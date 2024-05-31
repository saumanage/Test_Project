import { LightningElement,api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';
import insOsProductSelectionOptima from 'vlocity_ins/insOsGridProductSelection';
import { commonUtils, dataFormatter, omniscriptUtils } from 'vlocity_ins/insUtility';
import pubsub from 'vlocity_ins/pubsub';

export default class QE_StandardPremiumCriticalIllness extends OmniscriptBaseMixin(LightningElement) {

    @api selectedProducts;
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

    standardPremium;
    @api dependentAge;
    @api dependentRelation;
    @api spouseAge;
    @api isCityOfSuffolkGroup;

    connectedCallback(){
        //if(this.isCityOfSuffolkGroup){
            console.log('dependentAge = '+this.dependentAge);
            console.log('spouseAge = '+this.spouseAge);
            console.log('selectedProducts = '+JSON.stringify(this.selectedProducts));
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
            }
            
            if(this.selectedProducts && this.selectedProducts.Name){
                var selectedProductName = this.selectedProducts.Name.toLowerCase();
                selectedProductName = selectedProductName.replace(/\s/g, '');
            }

            if(selectedProductName.includes('&')){
                var Employee = selectedProductName.substring(0, selectedProductName.indexOf('&')).trim();
                var spouse= selectedProductName.substring(selectedProductName.indexOf('&') + 1).trim();
                console.log('Employee = '+Employee + ' spouse= '+spouse);
                var EmployeePlan = this.planMetadata.filter(plan => plan.plan_name__c === Employee && this.dependentAge>=plan.StartAge && this.dependentAge <=plan.EndAge);
                SpousePlan = [];
                if(age){
                    var SpousePlan = this.spousePlans.filter(plan => plan.plan_name__c === spouse&& this.dependentAge>=plan.StartAge && this.dependentAge <=plan.EndAge);
                
                }
                console.log('Employee = '+JSON.stringify(EmployeePlan) + ' spouse= '+JSON.stringify(SpousePlan));
                var totalPremium = 0;
                if(EmployeePlan.length > 0 ){
                    totalPremium = EmployeePlan[0].Premium__c;
                }
                if(SpousePlan.length > 0){
                    totalPremium = totalPremium + SpousePlan[0].Premium__c;
                }
                
                this.standardPremium = this.selectedProducts.currencySymbol +' '+ totalPremium.toFixed(2);
                var price = totalPremium;
    
    
            }else{
                console.log('selectedProductName Name = '+selectedProductName);
                let plan = this.planMetadata.filter(plan => plan.plan_name__c === selectedProductName && this.dependentAge>=plan.StartAge && this.dependentAge <=plan.EndAge);
                console.log('plan == '+JSON.stringify(plan));
                this.standardPremium = this.selectedProducts.currencySymbol +' '+ plan[0].Premium__c.toFixed(2);
                price = plan[0].Premium__c;
            }
            
        //}
        
        
        
    }

    
}