import { LightningElement, track, api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';
import { omniscriptUtils, commonUtils, dataFormatter } from 'vlocity_ins/insUtility';
import templ from "./qE_LWCDependentsList.html";
const columns = [
    { label: 'Dependent Name', fieldName: 'Name', hideDefaultActions: true, typeAttributes: { tooltip: { fieldName: 'Name' } } },
    { label: 'Relationship', fieldName: 'relationshipType', hideDefaultActions: true, typeAttributes: { tooltip: { fieldName: 'relationshipType' } } },
]

export default class QE_LWCDisplayList extends OmniscriptBaseMixin(LightningElement) {
    @track tableData = [];
    @track columns = columns;
    @track selectedRows = [];
    @track ooaSelected = [];
    @track pdfLink;
    @api planType;
    @api planTypeValue;
    @api pdfLinkName = 'OOA Dependent Program';
    priceUpdated = false;
    showPreviousButton = true;

    get displayPDF() {
        let planSelected = this.omniJsonData && this.omniJsonData.selectedProducts && this.omniJsonData.selectedProducts.filter(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue && (p.SubType__c === 'HMO' || p.SubType__c === 'POS'));
        //return this.planType === 'Medical' && planSelected && planSelected.length > 0 && !(this.ooaSelected.length=== 1 && this.ooaSelected.filter(s => s.relationshipType === 'Spouse').length >0);
        console.log('ooaSelected :: ' + JSON.stringify(this.ooaSelected));
        try {
            return this.planType === 'Medical' && planSelected && planSelected.length > 0 && this.ooaSelected && this.ooaSelected.length > 0 && this.ooaSelected.filter(s => s.ooa === true).length > 0;
        } catch (err) {
            console.log("err::", JSON.stringify(err));
        }
    }

    @api
    get selectedProducts() {
        return this._selectedProducts;
    }
    set selectedProducts(value) {
        this._selectedProducts = value;
        if (this.planType == 'Medical') {
            this.validateOOACell();
        }
       if (!this.stateData) {
            this.deselectDependents();
        }
    }

    initVariables() {
        //Sets initial node values.
        this.dependentsNodeName = `${this.planType}Dependents`;
        this[this.dependentsNodeName] = this[this.dependentsNodeName] || [];
        this.selectedDependentsNodeName = `SelectedDependentsFor${this.planType}`
        this.assetNodeName = `${this.planType}AssetId`;
        this.selectedNewDepNodeName = `SelectedNewDep${this.planType}`;
        this.unselectedDepToRemoveNodeName = `UnselectedDepToRemove${this.planType}`;
        this.notSelectedDepNodeName = `NotSelectedDep${this.planType}`;
    }
    

    deselectDependents() {
        //Sets initial node values.
        this.initVariables();
        //console.log("this[this.dependentsNodeName]", JSON.stringify(this[this.dependentsNodeName]));
        if(this[this.dependentsNodeName].length > 0) {
            if (this.omniJsonData.UpdatePlans || this.omniJsonData.CanReEnrollPlans || this.omniJsonData.OpenEnrollment || (this.omniJsonData.OpenEnrollment && this.omniJsonData.AssetStatusOE)) {
                let enrolledProducts = Array.isArray(this.omniJsonData.enrolledProducts) ? this.omniJsonData.enrolledProducts : [];
                let isAlreadySelected = false;
                if (this.omniJsonData.hasOwnProperty("selectedProducts") && Array.isArray(this.omniJsonData.selectedProducts) && this.omniJsonData.selectedProducts.length) {
                    if (this.omniJsonData.selectedProducts.filter(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue).length > 0 && enrolledProducts.filter(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue).length > 0) {
                        let originalPlan = this.omniJsonData.enrolledProducts.find(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue);
                        /*
                        The line below might cause problems when a user switches plans, and has more than one plan of the same type in the cart
                        this is because find returns the first one of the type, but the user can add more than one
                        */
                        let selectedPlan = this.omniJsonData.selectedProducts.find(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue);
                        let selectedNewPlan;
    
                        if (originalPlan && originalPlan.Id) {
                            selectedNewPlan = this.omniJsonData.selectedProducts.find(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue && p.Id !== originalPlan.Id);
                        }
    
                        if (selectedNewPlan && selectedNewPlan.Id && selectedNewPlan.Id !== originalPlan.Id) {
                            /*
                            Andrew Vaughn: reseting selectedRows is no longer needed when changing plans [CRMS-867]
                            */
                            //this.selectedRows = this.omniJsonData.hasOwnProperty(this.selectedNewDepNodeName) && this.omniJsonData[this.selectedNewDepNodeName].length > 0 ? this.omniJsonData[this.selectedNewDepNodeName].map(dep => dep.Id) : [];
                            //this.selectedRows = []; original line
                            isAlreadySelected = true;
                        }
    
                        if (!isAlreadySelected && selectedPlan.Id === originalPlan.Id && this[this.dependentsNodeName] && Array.isArray(this[this.dependentsNodeName]) && this[this.dependentsNodeName].length) {
                            
                            /* Andrew Vaughn: [CRMS-867]
                            ****UPDATE: This code is no longer needed, selectedRows is updated in the selectedDependent event
                            the UnselectedDepToRemoveNode & SelectedNewDepNode is done only in disconnectedCallback based on selectedRows*******

                            
                            qE_LWCNavigationButtons.assignPriceToPlans() omniApplyCallResponse for selectedProducts calls this LWC's set selectedProducts 
                            which in turn calls this method and overwrites the selectedRows with the original values before calling disconnected callback.  
                            This check helps keep selectedRows in Sync 
                            */

                            /*
                           //add the newly selected dependents
                           if(this.omniJsonData.hasOwnProperty(this.selectedNewDepNodeName) && this.omniJsonData[this.selectedNewDepNodeName].length > 0) {
                               console.log('this.omniJsonData[this.selectedNewDepNodeName]: ' + JSON.stringify(this.omniJsonData[this.selectedNewDepNodeName]));
                               this.selectedRows = this.omniJsonData[this.selectedNewDepNodeName].map(dep => dep.Id);
                           }
                           //add dependents already enrolled in the plan
                           if(this[this.dependentsNodeName] && this[this.dependentsNodeName].length > 0){
                                let canAdd = true;
                                this[this.dependentsNodeName].forEach(dep => {
                                    canAdd = true;
                                    //dont add if they have already been added or marked for removal for this plan
                                    if (this.omniJsonData.hasOwnProperty(this.unselectedDepToRemoveNodeName) && this.omniJsonData[this.unselectedDepToRemoveNodeName].length > 0) {
                                        console.log('markedForRemovalFindIndex: ' + (this.omniJsonData[this.unselectedDepToRemoveNodeName].findIndex(removeDep => removeDep.DependentId === dep.DependentId) < 0));
                                        canAdd = this.omniJsonData[this.unselectedDepToRemoveNodeName].findIndex(removeDep => removeDep.DependentId === dep.DependentId) < 0;
                                    }
                                    //dont add if already added
                                    console.log('alreadyAddedFindIndex: ' + (this.selectedRows.findIndex(selectedDep => selectedDep === dep.DependentId) < 0));
                                    canAdd = canAdd && (this.selectedRows.findIndex(selectedDep => selectedDep === dep.DependentId) < 0);
                                    console.log('canAdd: ' + canAdd);
                                    if(canAdd){this.selectedRows.push(dep.DependentId);}
                                });
                           } */
                           
                           /*
                           for (let dep of this[this.dependentsNodeName]) {
                               console.log('dep: ' + JSON.stringify(dep));
                               canAdd = true;
                               if (this.omniJsonData.hasOwnProperty(this.unselectedDepToRemoveNodeName) && this.omniJsonData[this.unselectedDepToRemoveNodeName].length > 0) {
                                   
                                   canAdd = (this.omniJsonData[this.unselectedDepToRemoveNodeName].findIndex(removeDep => removeDep.DependentId === dep.DependentId) < 0) && (this.selectedRows.findIndex(selectedDep => selectedDep === dep.DependentId) < 0);
                               }
                               if(canAdd){
                                   this.selectedRows.push(dep.DependentId);
                               }
                           }
                           Remove later
                           if(this.omniJsonData.hasOwnProperty(this.unselectedDepToRemoveNodeName) && this.omniJsonData[this.unselectedDepToRemoveNodeName].length > 0) {
                             this.selectedRows = this[this.dependentsNodeName].map(dep => dep.DependentId).filter(selectedId => {
                                return !this.omniJsonData[this.unselectedDepToRemoveNodeName].find(removedDep => {
                                    return removedDep.DependentId === selectedId;
                                })
                            });
                           }
                           if((!this.omniJsonData.hasOwnProperty(this.selectedNewDepNodeName) || (this.omniJsonData.hasOwnProperty(this.selectedNewDepNodeName) && this.omniJsonData.hasOwnProperty(this.selectedNewDepNodeName).length == 0))
                           && (!this.omniJsonData.hasOwnProperty(this.unselectedDepToRemoveNodeName ||(this.omniJsonData.hasOwnProperty(this.unselectedDepToRemoveNodeName) && this.omniJsonData.hasOwnProperty(this.unselectedDepToRemoveNodeName).length == 0)))) {
                               this.selectedRows = this[this.dependentsNodeName].map(dep => dep.DependentId);
                           } */
                           
                        } else if (!isAlreadySelected && selectedPlan.Id === originalPlan.Id && this.omniJsonData[this.dependentsNodeName] && this.omniJsonData[this.dependentsNodeName].hasOwnProperty('Dependents')) {
                            this.selectedRows = this.omniJsonData[this.dependentsNodeName]['Dependents'] && Array.isArray(this.omniJsonData[this.dependentsNodeName]['Dependents']) ?
                                this.omniJsonData[this.dependentsNodeName]['Dependents'] : [this.omniJsonData[this.dependentsNodeName]['Dependents']];
                        }
                    }
                }
            }
        }
    }

    connectedCallback() {
        //Sets initial node values.
        this.initVariables();

        if (this.planType === 'Medical') {
            this.showPreviousButton = false;
        }

        try {
            if (this.omniJsonData.userProfile == 'System Administrator') {
                this.pdfLink = '/resource/OOA_FAQ';
            } else {
                this.pdfLink = '/sfsites/c/resource/OOA_FAQ';
            }

            this.stateData = omniscriptUtils.getSaveState(this);
            if (this.planType == 'Medical') {
                this.validateOOACell();
            }
            if (this.stateData) {
                this.parseSavedState(this.stateData);
            } else {
                if (this.omniJsonData) {
                    if (Array.isArray(this.omniJsonData.DependentInfo)) {
                        console.log(JSON.parse(JSON.stringify((this.omniJsonData.DependentInfo))));
                        console.log("Dependent info populated:::");
                        if (this.planType == 'Medical' && !this.ooaSelected.length) {
                            this.ooaSelected = this.omniJsonData.DependentInfo;
                        }
                        this.tableData.push(...this.omniJsonData.DependentInfo);
                    } else {
                        if (this.planType == 'Medical' && !this.ooaSelected.length) {
                            this.ooaSelected.push(this.omniJsonData.DependentInfo);
                        }
                        this.tableData.push(this.omniJsonData.DependentInfo);
                    }

                    
                    if(this.omniJsonData.hasOwnProperty(this.dependentsNodeName) && this.omniJsonData[this.dependentsNodeName] && this.omniJsonData[this.dependentsNodeName]['Dependents']) {
                        this[this.dependentsNodeName] = this.omniJsonData[this.dependentsNodeName]['Dependents'] && Array.isArray(this.omniJsonData[this.dependentsNodeName]['Dependents']) ?
                            this.omniJsonData[this.dependentsNodeName]['Dependents'] : [this.omniJsonData[this.dependentsNodeName]['Dependents']];
                       /* Andrew Vaughn:
                       No longer need to guard against this happening as UnselectedDepToRemoveNode and SelectedNewDepNode is updated 
                       once in disconnectedCallback [CRMS-867]
                       if(this.unselectedDepToRemoveNodeName && Array.isArray(this.unselectedDepToRemoveNodeName) && this.unselectedDepToRemoveNodeName.length > 0) {
                        this.selectedRows = this[this.dependentsNodeName]['Dependents'].filter(planDependents => {
                            return !this.unselectedDepToRemoveNodeName.find(removedDep => {
                                return removedDep.DependentId === planDependents.DependentId;
                            });
                        });
                       }
                       else {
                        this.selectedRows = this[this.dependentsNodeName].map(dep => dep.DependentId);
                       } */
                       //only populate selected rows if it has not been
                       if(this.selectedRows && this.selectedRows.length == 0){
                           this.selectedRows = this[this.dependentsNodeName].map(dep => dep.DependentId);
                           //Andrew Vaughn CRMS-1166: Ensure dependents dropped are no longer in list of selected dependents while selecting plans
                           if(!this.omniJsonData[this.selectedDependentsNodeName]) {
                               let droppedDependents = this.omniJsonData.DroppedDependents ? this.omniJsonData.DroppedDependents : [];
                               droppedDependents = droppedDependents && Array.isArray(droppedDependents) ? droppedDependents : [droppedDependents];
                               this.selectedRows = this.selectedRows.filter(row => {
                                    return !droppedDependents.find(droppedDep => {
                                        return droppedDep.depId == row;
                                    });
                                });
                           }
                        }
                        
                        this.omniApplyCallResp({
                            [this.assetNodeName]:
                                { "assetId": this[this.dependentsNodeName][0].hasOwnProperty("AssetId") ? this[this.dependentsNodeName][0].AssetId : null }
                        });
                    }

                    this.validateSelectionsOfDependents();
                }

                /* Andrew Vaughn: removed price, price is updated in navigation buttons lwc
                console.log("selectedProducts:::", JSON.stringify(this.selectedProducts));
                if (this.selectedProducts && this.selectedProducts.length) {
                    if (this.omniJsonData.selectedProducts.filter(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue).length > 0 && this.omniJsonData.hasOwnProperty(this.dependentsNodeName) && this.omniJsonData[this.dependentsNodeName].hasOwnProperty("PlanPrice") && this.omniJsonData[this.dependentsNodeName]['PlanPrice']) {
                        this.selectedProducts.filter(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue).forEach(p => {
                            console.log(`${this.planType} Dependents Price:::`, JSON.stringify(this.omniJsonData[this.dependentsNodeName]['PlanPrice']));
                            p.Price = this.omniJsonData[this.dependentsNodeName]['PlanPrice'];
                        });
                    }
                    this.omniApplyCallResp({ selectedProducts: this.selectedProducts });
                } */
            }
        } catch (err) {
            console.log("error::", JSON.stringify(err));
        }

    }

    validateOOACell() {
        if (this.selectedProducts && this.selectedProducts.length > 0) {
            let planSelected = this.omniJsonData.selectedProducts.filter(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue && (p.SubType__c === 'HMO' || p.SubType__c === 'POS'));
            if (planSelected.length > 0) {
                this.columns = [];
                this.columns.push(...columns, {
                    label: 'OOA Dependent Program',
                    type: 'CellOOA',
                    fixedWidth: 200,
                    typeAttributes: {
                        ooa: { fieldName: 'ooa' },
                        context: { fieldName: 'Id' },
                        relationship: { fieldName: 'relationshipType' },
                        menuAlignment: 'left'
                    },
                    hideDefaultActions: true
                })
            }
        } else {
            this.columns = [];
            this.columns = columns;
            this.ooaSelected = [];
            let tempOoaSelected = [];
            console.log('this.planType ' + this.planType);
            this.omniApplyCallResp({ [`${this.planType}selectedOOADeps`]: tempOoaSelected });
        }
    }
    rowAction(ev) {
        console.log('ROWACTION', ev.detail)

    }
    selectedOOA(ev) {
        try {

            console.log(ev.detail);
            let idSelected = ev.detail.data.context;
            let depSelected = JSON.parse(JSON.stringify(this.omniJsonData.DependentInfo.find(dep => dep.Id === idSelected)));
            depSelected.ooa = ev.detail.data.checked;

            if (this.omniJsonData[`${this.planType}selectedOOADeps`] && Array.isArray(this.omniJsonData[`${this.planType}selectedOOADeps`])) {
                let selectedOOADeps = this.omniJsonData[`${this.planType}selectedOOADeps`];

                console.log("selectedOOADeps:::", JSON.stringify(selectedOOADeps));
                if (selectedOOADeps.filter(s => s.Id === depSelected.Id).length === 1) {
                    let tempSelectedOOADeps = [];
                    for (var sl in selectedOOADeps) {
                        if (selectedOOADeps[sl].Id != depSelected.Id) {
                            tempSelectedOOADeps.push(selectedOOADeps[sl]);
                        } else {
                            tempSelectedOOADeps.push(depSelected);
                        }
                    }
                    this.ooaSelected = tempSelectedOOADeps;
                } else {
                    this.ooaSelected.push(depSelected);
                }

                console.log("selectedOOADeps----:::", JSON.stringify(selectedOOADeps));

                this.omniApplyCallResp({ [`${this.planType}selectedOOADeps`]: this.ooaSelected });
                console.log("this.ooaSelected::: if", JSON.stringify(this.ooaSelected));
            } else {
                let depIndex = this.ooaSelected.indexOf(depSelected.Id);
                if (depIndex) {
                    this.ooaSelected.splice(depIndex, 1);
                    this.ooaSelected.push(depSelected);
                }
                this.omniApplyCallResp({ [`${this.planType}selectedOOADeps`]: this.ooaSelected });
                console.log("this.ooaSelected::: else---", JSON.stringify(this.ooaSelected));
            }

        } catch (error) {
            console.log("error OOA::", error);
        }
    }

    selectedDependent(ev) {
        console.log('dependents :: ' + JSON.stringify(ev.detail));
        let selectedRow = ev.detail;
        if (selectedRow && selectedRow.hasOwnProperty('selectedRows') && Array.isArray(selectedRow['selectedRows'])) {
            selectedRow = JSON.parse(JSON.stringify(selectedRow));
            selectedRow['selectedRows']['Id'] = selectedRow['selectedRows'].Id;
        }

        if (selectedRow && selectedRow.hasOwnProperty('selectedRows') && selectedRow['selectedRows']) {
            console.log(JSON.stringify(selectedRow['selectedRows']));

            this.omniApplyCallResp({ [this.selectedDependentsNodeName]: selectedRow['selectedRows'] });
            
            /* Andrew Vaughn: This code is no longer needed as the SelectedNewDepNode & UnselectedDepToRemoveNode is updated once in the disconnected callback [CRMS-867]
            //IF rows has been touched get the new selected and unselected
            if (this[this.dependentsNodeName] && selectedRow['selectedRows'] ) {
                let selectedPlan = this.omniJsonData.selectedProducts ? this.omniJsonData.selectedProducts.filter(prod => prod.Type__c.replaceAll(' ', '') === this.planTypeValue) : [];
                console.log('updating event selectedPlan: ' + JSON.stringify(selectedPlan));
                console.log('updating event this[this.dependentsNodeName]: ' + JSON.stringify(this[this.dependentsNodeName]));
                console.log('updating event this.unselectedDepToRemoveNodeName: ' + this.unselectedDepToRemoveNodeName);
                if(selectedPlan.length !== 1) {
                    this.omniApplyCallResp({ [this.selectedNewDepNodeName]: this.omniJsonData.DependentInfo.filter(dep => selectedRow['selectedRows'].findIndex(r => r.Id === dep.Id) >= 0 && this[this.dependentsNodeName].findIndex(r => r.DependentId === dep.Id) < 0) });
                }
                else if(selectedPlan.length === 1 && selectedPlan[0].hasOwnProperty('planId')){
                    this.omniApplyCallResp({ [this.selectedNewDepNodeName]: this.omniJsonData.DependentInfo.filter(dep => selectedRow['selectedRows'].findIndex(r => r.Id === dep.Id) >= 0 && this[this.dependentsNodeName].findIndex(r => r.PlanId === selectedPlan[0].planId && r.DependentId === dep.Id) < 0) });
                }
                this.omniApplyCallResp({ [this.unselectedDepToRemoveNodeName]: this[this.dependentsNodeName].filter(dep => selectedRow['selectedRows'].findIndex(r => r.Id === dep.DependentId) < 0) });
            } */

            this.selectedRows = selectedRow['selectedRows'].map(r => r.Id);
            //console.log("selectedRows:------>>>", JSON.stringify(selectedRow['selectedRows'].map(r => r.Id)));
            //console.log("selectedRows:------99999>>>", JSON.stringify(this.selectedRows));
        }
    }

    validateSelectionsOfDependents() {
        //If no rows has been touched populate the SelectedDependentsForMedical 
        if (Array.isArray(this.omniJsonData.DependentInfo)) {
            this.dependentsToSelect();
        } else if (this.omniJsonData.DependentInfo) {
            this.omniJsonData.DependentInfo = [this.omniJsonData.DependentInfo];
            this.dependentsToSelect();
        }
    }

    dependentsToSelect() {
        if (this.omniJsonData.hasOwnProperty(this.dependentsNodeName) && this.omniJsonData[this.dependentsNodeName] && this.omniJsonData[this.dependentsNodeName]['Dependents'] && !this.omniJsonData[this.selectedDependentsNodeName]) {
            console.log('No Changes made to dep selections')
            //Andrew Vaughn CRMS-1166: Ensure dependents dropped are no longer in list of selected dependents while selecting plans
            //added the && condition in omniApplyCallResp to not include dependents in the droppedDependents list
            let droppedDependents = this.omniJsonData.DroppedDependents ? this.omniJsonData.DroppedDependents : [];
            droppedDependents = droppedDependents && Array.isArray(droppedDependents) ? droppedDependents : [droppedDependents];
            this.omniApplyCallResp({ 
                [this.selectedDependentsNodeName]: this.omniJsonData.DependentInfo.filter(dep => this[this.dependentsNodeName].findIndex(r => r.DependentId === dep.Id) >= 0 && droppedDependents.findIndex(droppedDep => droppedDep.depId == dep.Id) < 0) 
            });
        }
    }

    
    disconnectedCallback() {
        console.log(this.planTypeValue + " disconnectedCallback this.ooaSelected: " + JSON.stringify(this.ooaSelected));
        console.log(this.planTypeValue + " disconnectedCallback this.selectedRows: " + JSON.stringify(this.selectedRows));
        console.log('this.dependentsNodeName: ' + JSON.stringify(this.omniJsonData[this.dependentsNodeName]));
        console.log('this.omniJsonData.DependentInfo: ' + JSON.stringify(this.omniJsonData.DependentInfo));
        /*
        Andrew Vaughn: update the SelectedNewDepNode and UnselectedDepToRemoveNode once in the disconnected callback [CRMS-867]
        only do this if:
        - the user has dependents & has selected dependent(s)
        - and has selected only 1 plan (not necessary when plan is waived or when user adds 2 plans and clicks previous, as that is allowed)
        */
        if(this.omniJsonData.DependentInfo && this.omniJsonData.DependentInfo.length > 0) {
            
            let selectedPlan = this.omniJsonData.selectedProducts ? this.omniJsonData.selectedProducts.filter(prod => prod.Type__c.replaceAll(' ', '') == this.planTypeValue) : [];
            if(selectedPlan.length === 1 && selectedPlan[0].hasOwnProperty('planId')){
                
                if(this[this.dependentsNodeName] && this[this.dependentsNodeName].length > 0) {
                    //Dep is newly selected if they are enrolled in a plan of this type, but the one currently enrolled in is different from one selected [CRMS-933]
                    this.omniApplyCallResp({ [this.selectedNewDepNodeName]: this.omniJsonData.DependentInfo.filter(dep => this.selectedRows.findIndex(r => r == dep.Id) >= 0 && this[this.dependentsNodeName].findIndex(r => r.PlanId == selectedPlan[0].planId && r.DependentId == dep.Id) < 0) }, true);
                    //Dep is Unselected if they were enrolled in the plan and were not selected
                    if(this[this.dependentsNodeName] && this[this.dependentsNodeName].length > 0) {
                        this.omniApplyCallResp({ [this.unselectedDepToRemoveNodeName]: this[this.dependentsNodeName].filter(dep => this.selectedRows.findIndex(r => r == dep.DependentId) < 0) }, true);
                    }
                    
                }
                else {//dep is newly selected if they are not enrolled in a plan of this type
                    this.omniApplyCallResp({ [this.selectedNewDepNodeName]: this.omniJsonData.DependentInfo.filter(dep => this.selectedRows.findIndex(r => r == dep.Id) >= 0)}, true);
                }
                //Andrew Vaughn: CRMS-1204 add dependents not selected when not waiving a plan
                let stepName = `STEP_${this.planType}PlanSelection`;
                let waiveName = this.planType == 'Medical' ? 'WaivePlan' : `Waive${this.planType}Plan`;
                if(this.omniJsonData[stepName][waiveName] == false) {
                    this.omniApplyCallResp({ [this.notSelectedDepNodeName]:  this.omniJsonData.DependentInfo.filter(dep => this.selectedRows.findIndex(row => row == dep.Id) < 0)}, true);
                }                
            }            
        }

        //Andrew Vaughn added planTypeValue and this[this.dependentsNodeName]
        this.omniSaveState({ tableData: this.tableData, selectedRows: this.selectedRows, ooaSelected: this.ooaSelected, planTypeValue: this.planTypeValue, originalDep: this[this.dependentsNodeName] }, null, true);
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

        //console.log("coverageType::", JSON.stringify(coverageType));
        console.log(this.planTypeValue + ' coveragetype: ' + coverageType);

        return coverageType;
    }

    assignPriceToPlans(planType, coverageType) {
        //Loop through each plan and assign price based on coverage type.
        this.priceUpdated = true;
        this.selectedProducts = JSON.parse(JSON.stringify(this.selectedProducts));
        let employerMonthlyCost = 0;
        this.selectedProducts.filter(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue).forEach(p => {

            //Check if each plan has been rated and rate type is composite
            if (p.CalculatedPriceData && (p.planRateType === 'Composite' || planType != 'Medical')) { //Andrew Vaughn: Added check for Ancillary

                //Get coverage type according to plan type.
                //let coverageType = this.omniJsonData[`${p.Type__c}CoverageType`];

                //Check if coverage type has been defined. If so, get correspondent tier price.
                if (coverageType != '' || coverageType != undefined) {
                    if (this.planType == 'Medical' && p.CoverageTier == '4 Tier' && coverageType == 'Employee + Children') {
                        coverageType = 'Employee + Child';
                    }
                    let price = p.CalculatedPriceData[coverageType];
                    if (planType == 'Medical' && this.omniJsonData.hasOwnProperty('ContributionType') && this.omniJsonData.ContributionType == 'Percent') {
                        price = price - (price * this.omniJsonData.EmployerContribution / 100);
                        employerMonthlyCost = (price * this.omniJsonData.EmployerContribution / 100);
                        console.log("employerMonthlyCost:: percent::", employerMonthlyCost);

                    }
                    if (planType == 'Medical' && this.omniJsonData.hasOwnProperty('ContributionType') && this.omniJsonData.ContributionType == 'Dollar') {
                        price = price - this.omniJsonData.EmployerContribution;
                        employerMonthlyCost = this.omniJsonData.EmployerContribution;
                        console.log("employerMonthlyCost: dollar:::", employerMonthlyCost);
                    }
                    if (planType == 'Medical') {
                        this.omniApplyCallResp({ EmployerMonthlyCost: employerMonthlyCost });
                    }

                    console.log("Price:", price);
                    if (price !== undefined) {
                        p.Price = price;
                    }
                }

            } else {
                console.warn('Plan has not been priced.');
            }
        });
        this.omniApplyCallResp({ selectedProducts: this.selectedProducts });

    }

    //Andrew Vaughn added planTypeValue and this[this.dependentsNodeName]
    parseSavedState(stateData) {
        this.ooaSelected = stateData.ooaSelected;
        console.log("from parseSavedState: " + JSON.stringify(stateData));
        this.tableData = stateData.tableData.map(dep => {
            let dependentAtOOA = stateData.ooaSelected.find(s => s.Id === dep.Id);
            dep.ooa = dependentAtOOA && dependentAtOOA.ooa;
            return dep;
        });
        this.planTypeValue = stateData.planTypeValue;
        this[this.dependentsNodeName] = stateData.originalDep;

        console.log('parseSaveState tableData: ' + JSON.stringify(this.tableData));

        this.selectedRows = stateData.selectedRows;       
        console.log('parseSaveState selectedRows: ' + JSON.stringify(this.selectedRows)); 
        
    }

    render() {
        return templ;
    }

    nextButton(evt) {
        if (evt) {

            console.log('hello from next Event');
            let dependentsData = this.omniJsonData[this.selectedDependentsNodeName] && Array.isArray(this.omniJsonData[this.selectedDependentsNodeName]) ? this.omniJsonData[this.selectedDependentsNodeName] : [];
            let coverageType = this.getCoverageType(dependentsData);
            this.assignPriceToPlans(this.planType, coverageType);
        

            this.omniNextStep();
        }
    }

    prevButton(evt) {
        if (evt) {
            this.omniPrevStep();
        }
    }
}