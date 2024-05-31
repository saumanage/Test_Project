import { createRecord } from 'lightning/uiRecordApi';
import { LightningElement, api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

export default class QE_LWCNavigationButtons extends OmniscriptBaseMixin(LightningElement) {
    @api planType;
    showPreviousButton = true;
    
    @api planTypeValue;

    //Andrew Vaughn: crms-873
    @api customStandardPremium;
    @api jsonDef;
    newStandardPremium;

    @api
    get selectedProducts() {
        return this._selectedProducts;
    }
    set selectedProducts(value) {
        this._selectedProducts = value;
        // if(!this.stateData) {
        //     this.deselectDependents();
        // }

    }

    connectedCallback() {
        console.log('jsonDef = = '+JSON.stringify(this.jsonDef));
        this.dependentsNodeName = `${this.planType}Dependents`;
        this.selectedDependentsNodeName = `SelectedDependentsFor${this.planType}`;
        this.assetNodeName = `${this.planType}AssetId`;
        this.selectedNewDepNodeName = `SelectedNewDep${this.planType}`;
        this.unselectedDepToRemoveNodeName = `UnselectedDepToRemove${this.planType}`;       

        if (this.planType === 'Medical') {
            this.showPreviousButton = false;
        }
    }

    getCoverageType(selectedDependents) {
        let childCount = 0;
        let spouseSelected = 0;
        let coverageType = '';

        for (let i = 0; i < selectedDependents.length; i++) {
            if (selectedDependents[i].relationshipType === 'Child' || selectedDependents[i].relationshipType === 'Other Dependent' || selectedDependents[i].relationshipType === 'Disabled Child') {
                childCount++;
            }
            if (selectedDependents[i].relationshipType === 'Spouse') {
                spouseSelected = 1;
            }
        }

        
        if (selectedDependents.length === 0) {
            coverageType = 'Employee';
        } else if (childCount === 0 && spouseSelected) {
            coverageType = 'Employee + Spouse';
        } else if (childCount === 1 && !spouseSelected) {
            coverageType = 'Employee + Child';
        } else if (childCount > 1 && !spouseSelected) {
            coverageType = 'Employee + Children';
        } else if (childCount >= 1 && spouseSelected) {
            coverageType = 'Family';
        } 

        console.log("coverageType::", JSON.stringify(coverageType));
        
        return coverageType;
    }

    assignPriceToPlans(planType, coverageType) {
        //Loop through each plan and assign price based on coverage type.
        this.priceUpdated = true;
        //this.selectedProducts = this.omniJsonData.selectedProducts;
        this.selectedProducts = JSON.parse(JSON.stringify(this.selectedProducts));
        console.log("PPPP:::>" + JSON.stringify(this.selectedProducts) );
        let employerMonthlyCost = 0;
        //  = ;
        let medicalProductSubGroupIds = this.omniJsonData.MedicalProductSubGroupIds && Array.isArray(this.omniJsonData.MedicalProductSubGroupIds) ? this.omniJsonData.MedicalProductSubGroupIds : [this.omniJsonData.MedicalProductSubGroupIds];
        if (medicalProductSubGroupIds.length && planType == 'Medical') {
            medicalProductSubGroupIds.forEach(sub => {
                if (this.selectedProducts.filter(p => p.Type__c === 'Medical').length && sub.ProductId === this.selectedProducts.filter(p => p.Type__c === 'Medical')[0].productId) {
                    this.selectedProducts.filter(p => p.Type__c === 'Medical')[0].additionalFields = { QE_Sub_Group__c: sub.Sub_GroupId };
                }
            });
        }

        let tierType;
        let fourTierType;
        
        this.selectedProducts.filter(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue).forEach(p => {
            if(p.Type__c === "Critical Illness"){
                p.Price = this.calculatePrice(p.Name);
                
            }
            //Check if each plan has been rated and rate type is composite
            if ( (p.CalculatedPriceData ||this.newStandardPremium)   && p.planRateType !== 'Age') {//Andrew Vaughn: ensure all non Age rate plans get priced

                console.log('Evaluating ' + planType);
                //Andrew Vaughn Medical plans follow tier coverage from Account & contract, ancillary coverage is based on the plan
                if(p.Type__c == 'Medical') {
                    tierType = this.omniJsonData && this.omniJsonData.ContractTier ? this.omniJsonData.ContractTier : '';
                    fourTierType = this.omniJsonData && this.omniJsonData.AccountFourTierType ? this.omniJsonData.AccountFourTierType : '';
                }
                else {
                    let ancillaryPlan = this.omniJsonData.AllAncillaryPlans ? this.omniJsonData.AllAncillaryPlans.find(ap => (ap.hasOwnProperty('Id') && p.hasOwnProperty('planId') && ap.Id === p.planId)) : '';
                    tierType = ancillaryPlan && ancillaryPlan.hasOwnProperty('TierType') ? ancillaryPlan.TierType : '';
                    fourTierType = ancillaryPlan && ancillaryPlan.hasOwnProperty('FourTierType') ? ancillaryPlan.FourTierType : '';
                }
                tierType = tierType == '4T' || tierType === '4 Tier' ? '4 Tier' : '5 Tier';
                fourTierType = fourTierType == '4 tier - with Child' ? '4 tier - with Child' : '4 tier - with Children';

                if(tierType == '4 Tier' && fourTierType == '4 tier - with Child' && coverageType == 'Employee + Children') {
                    coverageType = 'Family';
                }
                if(tierType == '4 Tier' && fourTierType == '4 tier - with Children' && coverageType == 'Employee + Child') {
                    coverageType = 'Employee + Children';
                }
                

                console.log(planType + ' coverageType: ' + coverageType);
                //Get coverage type according to plan type.
                //let coverageType = this.omniJsonData[`${p.Type__c}CoverageType`];

                //Check if coverage type has been defined. If so, get correspondent tier price.
                if (coverageType != '' || coverageType != undefined) {
                    //p.coverageType = coverageType;
                    let originalPrice, price;
                    /* Andrew Vaughn: if/else no longer needed
                    if (p.CoverageTier == '4 Tier' && coverageType == 'Employee + Child') {
                        originalPrice =p.CalculatedPriceData['Employee + Children'];
                        price = p.CalculatedPriceData['Employee + Children'];
                    } else {
                        originalPrice = p.CalculatedPriceData[coverageType];
                        price = p.CalculatedPriceData[coverageType];
                    } */
                    console.log('this.newStandardPremium = '+this.newStandardPremium);
                    if(this.ltdStandardPremium) {
                        console.log('ltdStandardPremium exists after connected callback: ' + this.ltdStandardPremium);
                    }
                    
                    if( this.newStandardPremium)
                    {
                        originalPrice = this.newStandardPremium;
                        price = this.newStandardPremium;
                    }else
                    {
                        console.log('p.CalculatedPriceData = '+JSON.stringify(p.CalculatedPriceData));
                        if( p.CalculatedPriceData){ //no values in contract line item. This will be null
                            originalPrice =   p.CalculatedPriceData[coverageType];
                            price =  p.CalculatedPriceData[coverageType];
                        }
                    }
                    /* Andrew VaughnOld code for Contributions
                    if (planType == 'Medical' && this.omniJsonData.hasOwnProperty('ContributionType') && this.omniJsonData.ContributionType == 'Percent') {
                        price = price - (price * this.omniJsonData.EmployerContribution / 100);
                        employerMonthlyCost = (originalPrice * this.omniJsonData.EmployerContribution / 100);
                    }
                    if (planType == 'Medical' && this.omniJsonData.hasOwnProperty('ContributionType') && this.omniJsonData.ContributionType == 'Dollar') {
                        price = originalPrice - this.omniJsonData.EmployerContribution;
                        employerMonthlyCost = this.omniJsonData.EmployerContribution;
                    }
                    if (planType == 'Medical') {
                        p.coverageType = coverageType;
                        this.omniApplyCallResp({ EmployerMonthlyCost: employerMonthlyCost });
                    } */
                    //Andrew Vaughn: Employer contribution code for CRMS-728 & 729
                    if(planType == 'Medical' && this.omniJsonData.EmployerGroupContribution && this.omniJsonData.EmployerGroupContribution.length > 0) {
                        let tempCoverageType = coverageType;
                        if(tempCoverageType == 'Employee + Child'){tempCoverageType = 'Employee & Child';}
                        if(tempCoverageType == 'Employee + Children'){tempCoverageType = 'Employee & Children';}
                        if(tempCoverageType == 'Employee + Spouse'){tempCoverageType = 'Employee & Spouse';}
                        let empCon = this.omniJsonData.EmployerGroupContribution.find(ec => ec.PlanId == p.planId && ec.CoverageType == tempCoverageType);
                        if(empCon && (empCon.PercentContribution || empCon.AmountContribution)) {
                            if(empCon.ContributionType == 'Dollar') {
                                employerMonthlyCost = empCon.AmountContribution;
                                price = originalPrice - empCon.AmountContribution;
                            }
                            if(empCon.ContributionType == 'Percent ( % )') {
                                price = price - (price * empCon.PercentContribution / 100);
                                employerMonthlyCost = (originalPrice * empCon.PercentContribution / 100);
                            }
                            this.omniApplyCallResp({ EmployerMonthlyCost: employerMonthlyCost });
                        }
                    }
                    else if(planType == 'Medical' && this.omniJsonData.EmployerPlanContribution && this.omniJsonData.EmployerPlanContribution.length > 0) {
                        let empCon = this.omniJsonData.EmployerPlanContribution.find(ec => ec.PlanId == p.planId);
                        if(empCon && empCon.EmployerPricingLogData) {
                            let coveragePrice = JSON.parse(empCon.EmployerPricingLogData)[coverageType];
                            if(coveragePrice) {
                                price = originalPrice - coveragePrice;
                                employerMonthlyCost = coveragePrice;
                                this.omniApplyCallResp({ EmployerMonthlyCost: employerMonthlyCost });
                            }
                        }
                    }

                    console.log(planType + " Price: " + price);
                    if (price !== undefined) {
                        p.Price = price;
                    }
                }
            } else if (p.planRateType === 'Age') {
                if (planType == 'Medical') {
                    tierType = this.omniJsonData.ContractTier && this.omniJsonData.ContractTier === '4T' ? '4 Tier' : '5 Tier';
                    fourTierType = this.omniJsonData.AccountFourTierType && this.omniJsonData.AccountFourTierType === '4 tier - with Child' ? '4 tier - with Child' : '4 tier - with Children';
                    if(tierType === '4 Tier' && fourTierType === '4 tier - with Child' && coverageType === 'Employee + Children') {
                        coverageType = 'Family';
                    }
                    if(tierType === '4 Tier' && fourTierType === '4 tier - with Children' && coverageType === 'Employee + Child') {
                        coverageType = 'Employee + Children';
                    }
                    if(coverageType) {
                        p.coverageType = coverageType;
                    }
                }
            }
        });
        this.omniApplyCallResp({ selectedProducts: this.selectedProducts });

    }

    nextButton(evt) {
        if (evt) {
            //Andrew Vaughn: crms-873, Assign customStandardPremium as price for flagged groups/plans
            if(this.customStandardPremium) {
                let stepName = 'STEP_' + this.planType + 'PlanSelection';
                let stepValueName = this.planType + 'StandardPremium';
                this.newStandardPremium = this.omniJsonData[stepName] && this.omniJsonData[stepName][stepValueName] ? parseFloat(this.omniJsonData[stepName][stepValueName]) : '';
                console.log('newStandardPremium: ' + this.newStandardPremium);
            }
            let dependentsData = [];
            dependentsData = this.omniJsonData[this.selectedDependentsNodeName] && Array.isArray(this.omniJsonData[this.selectedDependentsNodeName]) ? this.omniJsonData[this.selectedDependentsNodeName] : [];
            
            let coverageType = this.getCoverageType(dependentsData);
            
            this.assignPriceToPlans(this.planType, coverageType);

            // if (this.planType == 'Medical') {
            //     dependentsData = this.omniJsonData.SelectedDependentsForMedical && Array.isArray(this.omniJsonData.SelectedDependentsForMedical) ? this.omniJsonData.SelectedDependentsForMedical : [];
            //     let coverageType = this.getCoverageType(dependentsData);
            //     this.assignPriceToPlans('Medical', coverageType);
            // } else if (this.planType == 'Dental') {
            //     dependentsData = this.omniJsonData.SelectedDependentsForDental && Array.isArray(this.omniJsonData.SelectedDependentsForDental) ? this.omniJsonData.SelectedDependentsForDental : [];
            //     let coverageType = this.getCoverageType(dependentsData);
            //     this.assignPriceToPlans('Dental', coverageType);
            // } else if (this.planType == 'Vision') {
            //     dependentsData = this.omniJsonData.SelectedDependentsForVision && Array.isArray(this.omniJsonData.SelectedDependentsForVision) ? this.omniJsonData.SelectedDependentsForVision : [];
            //     let coverageType = this.getCoverageType(dependentsData);
            //     this.assignPriceToPlans('Vision', coverageType);
            // } else if (this.planType == 'Cancer') {
            //     dependentsData = this.omniJsonData[this.selectedDependentsNodeName] && Array.isArray(this.omniJsonData[this.selectedDependentsNodeName]) ? this.omniJsonData[this.selectedDependentsNodeName] : [];
            //     let coverageType = this.getCoverageType(dependentsData);
            //     this.assignPriceToPlans(this.planType, coverageType);
            // }
            
            this.omniNextStep();
        }
    }

    prevButton(evt) {
        if (evt) {
            this.omniPrevStep();
        }
    }

    calculatePrice(planName){
        console.log('planName === '+planName);
        console.log('dependentAge = '+this.dependentAge);
        console.log('spouseAge = '+this.spouseAge);
        if(this.spouseAge == undefined || !this.spouseAge){
            this.spouseAge = 0;
        }else{
            //var age = 
            var dob = this.spouseAge.replaceAll('-','');
            console.log('dob = '+dob);
            var year = Number(dob.substr(0, 4));
            var month = Number(dob.substr(4, 2)) - 1;
            var day = Number(dob.substr(6, 2));
            var today = new Date();
            var age = today.getFullYear() - year;
            if (today.getMonth() < month || (today.getMonth() == month && today.getDate() < day)) {
                age--;
            }
            console.log('age = '+age);
            //this.spouseAge = age;
        }
        if(planName){
            planName = planName.toLowerCase();
            planName = planName.replace(/\s/g, '');
        }
        if(planName && planName.includes('&')){
            var Employee = planName.substring(0, planName.indexOf('&')).trim();
            var spouse = planName.substring(planName.indexOf('&') + 1).trim();
            console.log('Employee = '+Employee + ' spouse = '+spouse);
            var EmployeePlan = this.planMetadata.filter(plan => plan.plan_name__c === Employee && this.dependentAge>=plan.StartAge && this.dependentAge <=plan.EndAge);
            SpousePlan = [];
            if(age){
                var SpousePlan = this.spousePlans.filter(plan => plan.plan_name__c === spouse && this.dependentAge>=plan.StartAge && this.dependentAge <=plan.EndAge);
            }
            console.log('Employee = '+JSON.stringify(EmployeePlan) + ' spouse = '+JSON.stringify(SpousePlan));
            var totalPremium = 0;
            if(EmployeePlan.length > 0 ){
                totalPremium = EmployeePlan[0].Premium__c;
            }
            if(SpousePlan.length > 0){
                totalPremium = totalPremium + SpousePlan[0].Premium__c;
            }
            
            var price = totalPremium;


        }else{
            let plan = this.planMetadata.filter(plan => plan.plan_name__c === planName && this.dependentAge>=plan.StartAge && this.dependentAge <=plan.EndAge);
            console.log('plan == '+JSON.stringify(plan));
            price = plan[0].Premium__c;
        }
        return price.toFixed(2);
    }

    @api planMetadata = [
        {plan_name__c : "criticalillness-employee$10k",StartAge: 0, EndAge : 29, Premium__c : 4.70},
        {plan_name__c : "criticalillness-employee$20k",StartAge: 0, EndAge : 29, Premium__c : 9.40},
        {plan_name__c : "criticalillness-employee$30k",StartAge: 0, EndAge : 29, Premium__c : 14.10},
        {plan_name__c : "criticalillness-employee$10k",StartAge: 30, EndAge : 39, Premium__c : 6.60},
        {plan_name__c : "criticalillness-employee$20k",StartAge: 30, EndAge : 39, Premium__c : 13.20},
        {plan_name__c : "criticalillness-employee$30k",StartAge: 30, EndAge : 39, Premium__c : 19.80},
        {plan_name__c : "criticalillness-employee$10k",StartAge: 40, EndAge : 49, Premium__c : 12.5},
        {plan_name__c : "criticalillness-employee$20k",StartAge: 40, EndAge : 49, Premium__c : 25},
        {plan_name__c : "criticalillness-employee$30k",StartAge: 40, EndAge : 49, Premium__c : 37.5},
        {plan_name__c : "criticalillness-employee$10k",StartAge: 50, EndAge : 59, Premium__c : 24.80},
        {plan_name__c : "criticalillness-employee$20k",StartAge: 50, EndAge : 59, Premium__c : 49.60},
        {plan_name__c : "criticalillness-employee$30k",StartAge: 50, EndAge : 59, Premium__c : 74.40},
        {plan_name__c : "criticalillness-employee$10k",StartAge: 60, EndAge : 70, Premium__c : 46.70},
        {plan_name__c : "criticalillness-employee$20k",StartAge: 60, EndAge : 70, Premium__c : 93.40},
        {plan_name__c : "criticalillness-employee$30k",StartAge: 60, EndAge : 70, Premium__c : 140.10}];
    
        @api spousePlans = [
        {plan_name__c : "spouse$5k",StartAge: 0, EndAge : 29, Premium__c : 2.36},
        {plan_name__c : "spouse$10k",StartAge: 0, EndAge : 29, Premium__c : 4.70},
        {plan_name__c : "spouse$15k",StartAge: 0, EndAge : 29, Premium__c : 7.06},
        {plan_name__c : "spouse$5k",StartAge: 30, EndAge : 39, Premium__c : 3.30},
        {plan_name__c : "spouse$10k",StartAge: 30, EndAge : 39, Premium__c : 6.60},
        {plan_name__c : "spouse$15k",StartAge: 30, EndAge : 39, Premium__c : 9.90},
        {plan_name__c : "spouse$5k",StartAge: 40, EndAge : 49, Premium__c : 6.26},
        {plan_name__c : "spouse$10k",StartAge: 40, EndAge : 49, Premium__c : 12.50},
        {plan_name__c : "spouse$15k",StartAge: 40, EndAge : 49, Premium__c : 18.76},
        {plan_name__c : "spouse$5k",StartAge: 50, EndAge : 59, Premium__c : 12.40},
        {plan_name__c : "spouse$10k",StartAge: 50, EndAge : 59, Premium__c : 24.80},
        {plan_name__c : "spouse$15k",StartAge: 50, EndAge : 59, Premium__c : 37.20},
        {plan_name__c : "spouse$5k",StartAge: 60, EndAge : 70, Premium__c : 23.36},
        {plan_name__c : "spouse$10k",StartAge: 60, EndAge : 70, Premium__c : 46.70},
        {plan_name__c : "spouse$15k",StartAge: 60, EndAge : 70, Premium__c : 70.06}];

        @api dependentAge;
        @api spouseAge;

}