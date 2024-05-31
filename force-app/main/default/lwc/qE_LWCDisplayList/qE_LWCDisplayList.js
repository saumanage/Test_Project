import { LightningElement, track, api } from 'lwc';
import {OmniscriptBaseMixin} from 'vlocity_ins/omniscriptBaseMixin';
import { omniscriptUtils, commonUtils, dataFormatter } from 'vlocity_ins/insUtility';
import templ from "./qE_LWCDisplayList.html";
const columns = [
    { label: 'Dependent Name', fieldName: 'Name', hideDefaultActions: true, typeAttributes: { tooltip: { fieldName: 'Name' } }},
    { label: 'Relationship', fieldName: 'relationshipType', hideDefaultActions: true, typeAttributes: { tooltip: { fieldName: 'relationshipType' } }},
]

export default class QE_LWCDisplayList extends OmniscriptBaseMixin(LightningElement) {
    @track tableData = [];
    @track columns = columns;
    @track selectedRows = [];
    @track ooaSelected = [];
    @track pdfLink;
    @api planType;
    @track MedicalDependents = [];
    @track DentalDependents = [];
    @track VisionDependents = [];
    @api pdfLinkName = 'OOA Dependent Program';
    priceUpdated = false;
    showPreviousButton = true;

    get displayPDF(){
        let planSelected = this.omniJsonData && this.omniJsonData.selectedProducts && this.omniJsonData.selectedProducts.filter(p => p.Type__c === this.planType && (p.SubType__c === 'HMO' || p.SubType__c === 'POS'));            
        //return this.planType === 'Medical' && planSelected && planSelected.length > 0 && !(this.ooaSelected.length=== 1 && this.ooaSelected.filter(s => s.relationshipType === 'Spouse').length >0);
        console.log('ooaSelected :: '+JSON.stringify(this.ooaSelected));
        try {
            return this.planType === 'Medical' && planSelected && planSelected.length > 0 && this.ooaSelected && this.ooaSelected.length > 0 && this.ooaSelected.filter(s => s.ooa === true).length > 0;
        } catch(err) {
            console.log("err::", JSON.stringify(err));
        }
    }

    @api
    get selectedProducts() {
      return this._selectedProducts;
    }
    set selectedProducts(value) {
        this._selectedProducts = value;
        if(this.planType == 'Medical') {
            this.validateOOACell();
        }
        if(!this.stateData) {
            this.deselectDependents();
        }
    }

    deselectDependents() {
        if((this.omniJsonData.UpdatePlans && !this.omniJsonData.CanReEnrollPlans) || (this.omniJsonData.OpenEnrollment && this.omniJsonData.AssetStatusOE)){
            let enrolledProducts = Array.isArray(this.omniJsonData.enrolledProducts) ? this.omniJsonData.enrolledProducts : [this.omniJsonData.enrolledProducts];
            let isAlreadySelected = false;
            if(this.omniJsonData.hasOwnProperty("selectedProducts") && Array.isArray(this.omniJsonData.selectedProducts) && this.omniJsonData.selectedProducts.length) {
                if(this.planType == 'Medical' && this.omniJsonData.selectedProducts.filter(p => p.Type__c === "Medical").length > 0 && enrolledProducts.filter(p => p.Type__c === "Medical").length > 0){
                    let originalPlan = this.omniJsonData.enrolledProducts.find(p => p.Type__c === "Medical");
                    let selectedPlan = this.omniJsonData.selectedProducts.find(p => p.Type__c === "Medical");
                    let selectedNewPlan = this.omniJsonData.selectedProducts.find(p => p.Type__c === "Medical" && p.Id !== originalPlan.Id);
                    console.log("selectedNewPlan:::", JSON.stringify(selectedNewPlan));
                    if(selectedNewPlan && selectedNewPlan.Id !== originalPlan.Id){
                        this.selectedRows = [];
                        console.log("this.selectedRows::: if----", JSON.stringify(this.selectedRows));
                        isAlreadySelected = true;
                    }
                    if(!isAlreadySelected && selectedPlan.Id === originalPlan.Id && this.MedicalDependents && Array.isArray(this.MedicalDependents) && this.MedicalDependents.length){
                        this.selectedRows = this.MedicalDependents.map(dep => dep.DependentId);
                        console.log("this.selectedRows::: else---", JSON.stringify(this.selectedRows));
                        console.log("this.MedicalDependents::: else---", JSON.stringify(this.MedicalDependents));
                    } else if(!isAlreadySelected && selectedPlan.Id === originalPlan.Id && this.omniJsonData.MedicalDependents.hasOwnProperty('Dependents')) {
                        this.selectedRows = this.omniJsonData.MedicalDependents.Dependents && Array.isArray(this.omniJsonData.MedicalDependents.Dependents) ? 
                                                    this.omniJsonData.MedicalDependents.Dependents : [this.omniJsonData.MedicalDependents.Dependents];
                    }
                }
                if(this.planType == 'Dental' && this.omniJsonData.selectedProducts.filter(p => p.Type__c === "Dental").length > 0 && enrolledProducts.filter(p => p.Type__c === "Dental").length > 0  ){
                    let originalPlan = this.omniJsonData.enrolledProducts.find(p => p.Type__c === "Dental");
                    let selectedPlan = this.omniJsonData.selectedProducts.find(p => p.Type__c === "Dental");
                    let selectedNewPlan = this.omniJsonData.selectedProducts.find(p => p.Type__c === "Dental" && p.Id !== originalPlan.Id);
                    console.log("originalPlan:::", JSON.stringify(originalPlan));
                    console.log("selectedNewPlan:::", JSON.stringify(selectedNewPlan));
                    if(selectedNewPlan && selectedNewPlan.Id !== originalPlan.Id){
                        this.selectedRows = [];
                        console.log("this.selectedRows::: if----", JSON.stringify(this.selectedRows))
                        isAlreadySelected = true;
                    }
                    if(!isAlreadySelected && selectedPlan.Id === originalPlan.Id && this.DentalDependents && Array.isArray(this.DentalDependents) && this.DentalDependents.length){
                        this.selectedRows = this.DentalDependents.map(dep => dep.DependentId);
                        console.log("this.selectedRows::: else 1----", JSON.stringify(this.selectedRows));
                    } else if(!isAlreadySelected && selectedPlan.Id === originalPlan.Id && this.omniJsonData.DentalDependents.hasOwnProperty('Dependents')) {
                        this.selectedRows = this.omniJsonData.DentalDependents.Dependents && Array.isArray(this.omniJsonData.DentalDependents.Dependents) ? 
                        this.omniJsonData.DentalDependents.Dependents : [this.omniJsonData.DentalDependents.Dependents];
                        console.log("this.selectedRows::: else 2----", JSON.stringify(this.selectedRows));
                    }
                }
                if(this.planType == 'Vision' && this.omniJsonData.selectedProducts.filter(p => p.Type__c === "Vision").length > 0 && enrolledProducts.filter(p => p.Type__c === "Vision").length > 0  ){
                    let originalPlan = this.omniJsonData.enrolledProducts.find(p => p.Type__c === "Vision");
                    let selectedPlan = this.omniJsonData.selectedProducts.find(p => p.Type__c === "Vision");
                    let selectedNewPlan = this.omniJsonData.selectedProducts.find(p => p.Type__c === "Vision" && p.Id !== originalPlan.Id);
                    if(selectedNewPlan && selectedNewPlan.Id !== originalPlan.Id){
                        this.selectedRows = [];
                        isAlreadySelected = true;
                    }
                    if(!isAlreadySelected && selectedPlan.Id === originalPlan.Id && this.VisionDependents && Array.isArray(this.VisionDependents) && this.VisionDependents.length){
                        this.selectedRows = this.VisionDependents.map(dep => dep.DependentId);
                    } else if(!isAlreadySelected && selectedPlan.Id === originalPlan.Id && this.omniJsonData.VisionDependents.hasOwnProperty('Dependents')) {
                        this.selectedRows = this.omniJsonData.VisionDependents.Dependents && Array.isArray(this.omniJsonData.VisionDependents.Dependents) ? 
                        this.omniJsonData.VisionDependents.Dependents : [this.omniJsonData.VisionDependents.Dependents];
                    }
                }
            }
            
        }
    }

    connectedCallback() {
        console.log('Connected callback', JSON.stringify(this.omniJsonData));
        if(this.planType === 'Medical') {
            this.showPreviousButton = false;
        }

        try {
        if( this.omniJsonData.userProfile == 'System Administrator' ) {
            this.pdfLink = '/resource/OOA_FAQ';
        }else {
            this.pdfLink = '/sfsites/c/resource/OOA_FAQ';
        }
        
        this.stateData = omniscriptUtils.getSaveState(this);
        if(this.planType == 'Medical') {
            this.validateOOACell();
        }
        if (this.stateData) {
            this.parseSavedState(this.stateData);
        } else {
            if( this.omniJsonData ) { 
                console.log(this.omniJsonData);
                if(Array.isArray(this.omniJsonData.DependentInfo) ){
                    console.log(JSON.parse(JSON.stringify((this.omniJsonData.DependentInfo))));
                    console.log("Dependent info populated:::");
                    if(this.planType == 'Medical' && !this.ooaSelected.length) {
                        this.ooaSelected = this.omniJsonData.DependentInfo;
                    }
                    this.tableData.push(...this.omniJsonData.DependentInfo);
                } else {
                    if(this.planType == 'Medical' && !this.ooaSelected.length) {
                        this.ooaSelected.push(this.omniJsonData.DependentInfo);
                    }
                    this.tableData.push(this.omniJsonData.DependentInfo);
                }
                if( this.planType == 'Medical' && this.omniJsonData.hasOwnProperty("MedicalDependents") && this.omniJsonData.MedicalDependents  && this.omniJsonData.MedicalDependents.Dependents) {
                    this.MedicalDependents  = this.omniJsonData.MedicalDependents.Dependents && Array.isArray(this.omniJsonData.MedicalDependents.Dependents) ? 
                                                this.omniJsonData.MedicalDependents.Dependents : [this.omniJsonData.MedicalDependents.Dependents];
                    this.selectedRows = this.MedicalDependents.map(dep => dep.DependentId);
                    this.omniApplyCallResp({"MedicalAssetId": 
                        {"assetId": this.MedicalDependents[0].hasOwnProperty("AssetId") ? this.MedicalDependents[0].AssetId : null}
                    });
                }else if( this.planType == 'Dental' && this.omniJsonData.hasOwnProperty("DentalDependents") && this.omniJsonData.DentalDependents && this.omniJsonData.DentalDependents.Dependents){
                    this.DentalDependents  = this.omniJsonData.DentalDependents.Dependents &&  Array.isArray(this.omniJsonData.DentalDependents.Dependents) ? 
                                                this.omniJsonData.DentalDependents.Dependents : [this.omniJsonData.DentalDependents.Dependents];
                                                console.log("this.DentalDependents:::", JSON.stringify(this.DentalDependents));
                    this.selectedRows = this.DentalDependents.map(dep => dep.DependentId);
                    console.log("this.selectedRows:::", JSON.parse(JSON.stringify(this.selectedRows)));
                    this.omniApplyCallResp({"DentalAssetId": 
                        {"assetId": this.DentalDependents[0].hasOwnProperty("AssetId") ? this.DentalDependents[0].AssetId : null}
                    });
                }else if( this.planType == 'Vision' && this.omniJsonData.hasOwnProperty("VisionDependents") && this.omniJsonData.VisionDependents && this.omniJsonData.VisionDependents.Dependents){
                    this.VisionDependents = this.omniJsonData.VisionDependents.Dependents && Array.isArray(this.omniJsonData.VisionDependents.Dependents) ? 
                                                this.omniJsonData.VisionDependents.Dependents : [this.omniJsonData.VisionDependents.Dependents];
                    this.selectedRows =  this.VisionDependents.map(dep => dep.DependentId);
                    this.omniApplyCallResp({"VisionAssetId": 
                        {"assetId": this.VisionDependents[0].hasOwnProperty("AssetId") ? this.VisionDependents[0].AssetId : null}
                    });
                }
                
                this.validateSelectionsOfDependents();
            }

            console.log("selectedProducts:::", JSON.stringify(this.selectedProducts));
            if(this.selectedProducts && this.selectedProducts.length) {
                if(this.omniJsonData.selectedProducts.filter(p => p.Type__c === "Medical").length > 0 && this.omniJsonData.hasOwnProperty("MedicalDependents") && this.omniJsonData.MedicalDependents.hasOwnProperty("PlanPrice") && this.omniJsonData.MedicalDependents.PlanPrice) {
                    this.selectedProducts.filter(p => p.Type__c === "Medical").forEach(p => {
                        console.log("MedicalDependents Price:::", JSON.stringify(this.omniJsonData.MedicalDependents.PlanPrice));
                        p.Price = this.omniJsonData.MedicalDependents.PlanPrice;
                    });
                }
                if(this.omniJsonData.selectedProducts.filter(p => p.Type__c === "Dental").length > 0 && this.omniJsonData.hasOwnProperty("DentalDependents") && this.omniJsonData.DentalDependents.hasOwnProperty("PlanPrice") && this.omniJsonData.DentalDependents.PlanPrice) {
                    this.selectedProducts.filter(p => p.Type__c === "Dental").forEach(p => {
                        console.log("DentalDependents Price:::", JSON.stringify(this.omniJsonData.DentalDependents.PlanPrice));
                        p.Price = this.omniJsonData.DentalDependents.PlanPrice;
                    });
                }
                if(this.omniJsonData.selectedProducts.filter(p => p.Type__c === "Vision").length > 0 && this.omniJsonData.hasOwnProperty("VisionDependents") && this.omniJsonData.VisionDependents.hasOwnProperty("PlanPrice") && this.omniJsonData.VisionDependents.PlanPrice) {
                    this.selectedProducts.filter(p => p.Type__c === "Vision").forEach(p => {
                        console.log("VisionDependents Price:::", JSON.stringify(this.omniJsonData.VisionDependents.PlanPrice));
                        p.Price = this.omniJsonData.VisionDependents.PlanPrice;
                    });
                }
                this.omniApplyCallResp({selectedProducts: this.selectedProducts});
            }
        }
    } catch(err) {
        console.log("error::", JSON.stringify(err));
    }
        
    }
    
    validateOOACell(){
        if(this.selectedProducts && this.selectedProducts.length > 0){
            let planSelected = this.omniJsonData.selectedProducts.filter(p => p.Type__c === this.planType && (p.SubType__c === 'HMO' || p.SubType__c === 'POS'));
            if(planSelected.length > 0){
                this.columns = [];
                this.columns.push(...columns,{
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
        }else{
            this.columns = [];
            this.columns = columns;
            this.ooaSelected = [];
            let tempOoaSelected = [];
            console.log('this.planType '+this.planType);
            this.omniApplyCallResp({[`${this.planType}selectedOOADeps`]: tempOoaSelected});
        }
    }
    rowAction(ev){
        console.log('ROWACTION', ev.detail)
        
    }
    selectedOOA(ev){
        try {
        
            console.log(ev.detail);
            let idSelected = ev.detail.data.context;
            let depSelected = JSON.parse(JSON.stringify(this.omniJsonData.DependentInfo.find(dep => dep.Id === idSelected)));
            depSelected.ooa = ev.detail.data.checked;

            if(this.omniJsonData[`${this.planType}selectedOOADeps`] && Array.isArray(this.omniJsonData[`${this.planType}selectedOOADeps`])){
                let selectedOOADeps = this.omniJsonData[`${this.planType}selectedOOADeps`];

                console.log("selectedOOADeps:::", JSON.stringify(selectedOOADeps));
                if( selectedOOADeps.filter( s => s.Id === depSelected.Id).length === 1 ) {
                    let tempSelectedOOADeps = [];
                    for( var sl in selectedOOADeps ) {
                        if( selectedOOADeps[sl].Id != depSelected.Id ) {
                            tempSelectedOOADeps.push(selectedOOADeps[sl]);
                        }else {
                            tempSelectedOOADeps.push(depSelected);
                        }
                    }
                    this.ooaSelected = tempSelectedOOADeps;
                }else {
                    this.ooaSelected.push(depSelected);
                }

                console.log("selectedOOADeps----:::", JSON.stringify(selectedOOADeps));

                this.omniApplyCallResp({[`${this.planType}selectedOOADeps`]: this.ooaSelected});
                console.log("this.ooaSelected::: if", JSON.stringify(this.ooaSelected));
            }else {
                let depIndex = this.ooaSelected.indexOf(depSelected.Id);
                if(depIndex) {
                    this.ooaSelected.splice(depIndex, 1);
                    this.ooaSelected.push(depSelected);
                }
                this.omniApplyCallResp({[`${this.planType}selectedOOADeps`]: this.ooaSelected});
                console.log("this.ooaSelected::: else---", JSON.stringify(this.ooaSelected));
            }

        } catch (error) {
            console.log("error OOA::", error);
        }
    }
    selectedDependent(ev) {
        console.log('dependents :: '+JSON.stringify(ev.detail));
        let selectedRow = ev.detail;
        if( selectedRow && selectedRow.hasOwnProperty('selectedRows') && Array.isArray(selectedRow['selectedRows']) ) {
            selectedRow = JSON.parse(JSON.stringify(selectedRow));
            selectedRow['selectedRows']['Id'] = selectedRow['selectedRows'].Id;
        }

        if( selectedRow && selectedRow.hasOwnProperty('selectedRows') && selectedRow['selectedRows'] ){
            console.log(JSON.stringify(selectedRow['selectedRows']));

            if( this.planType == 'Medical') {
                this.omniApplyCallResp({"SelectedDependentsForMedical": selectedRow['selectedRows']});

                //IF rows has been touched get the new selected and unselected
                if(this.MedicalDependents && selectedRow['selectedRows'] /*this.omniJsonData.SelectedDependentsForMedical*/){
                    console.log('MAKE CHANGES to dep selections')
                    this.omniApplyCallResp({SelectedNewDepMedical: this.omniJsonData.DependentInfo.filter(dep => selectedRow['selectedRows'].findIndex(r => r.Id === dep.Id) >= 0 && this.MedicalDependents.findIndex(r => r.DependentId === dep.Id) < 0) });
                    this.omniApplyCallResp({UnselectedDepToRemoveMedical: this.MedicalDependents.filter(dep => selectedRow['selectedRows'].findIndex(r => r.Id === dep.DependentId) < 0) });

                }

            }else if( this.planType == 'Dental' ){
                this.omniApplyCallResp({"SelectedDependentsForDental": selectedRow['selectedRows']});
                //IF rows has been touched get the new selected and unselected
                if(this.DentalDependents && selectedRow['selectedRows'] /*this.omniJsonData.SelectedDependentsForDental*/){
                    console.log('MAKE CHANGES to dep selections')
                    this.omniApplyCallResp({SelectedNewDepDental: this.omniJsonData.DependentInfo.filter(dep => selectedRow['selectedRows'].findIndex(r => r.Id === dep.Id) >= 0 && this.DentalDependents.findIndex(r => r.DependentId === dep.Id) < 0) });
                    this.omniApplyCallResp({UnselectedDepToRemoveDental: this.DentalDependents.filter(dep => selectedRow['selectedRows'].findIndex(r => r.Id === dep.DependentId) < 0) });

                }

            }else if( this.planType == 'Vision' ){
                this.omniApplyCallResp({"SelectedDependentsForVision": selectedRow['selectedRows']});
                //IF rows has been touched get the new selected and unselected
                if(this.VisionDependents && selectedRow['selectedRows'] /*this.omniJsonData.SelectedDependentsForVision*/){
                    this.omniApplyCallResp({SelectedNewDepVision: this.omniJsonData.DependentInfo.filter(dep => selectedRow['selectedRows'].findIndex(r => r.Id === dep.Id) >= 0 && this.VisionDependents.findIndex(r => r.DependentId === dep.Id) < 0) });
                    this.omniApplyCallResp({UnselectedDepToRemoveVision: this.VisionDependents.filter(dep => selectedRow['selectedRows'].findIndex(r => r.Id === dep.DependentId) < 0) });

                }

            }
            this.selectedRows = selectedRow['selectedRows'].map(r => r.Id);
            console.log("selectedRows:------>>>",JSON.stringify(selectedRow['selectedRows'].map(r => r.Id)));
            console.log("selectedRows:------99999>>>", JSON.stringify(this.selectedRows));
        }
    }

    validateSelectionsOfDependents(){
        //If no rows has been touched populate the SelectedDependentsForMedical 
        if(Array.isArray(this.omniJsonData.DependentInfo)) {
            this.dependentsToSelect();
        } else if(this.omniJsonData.DependentInfo) {
            this.omniJsonData.DependentInfo = [this.omniJsonData.DependentInfo];
            this.dependentsToSelect();
        }
    }

    dependentsToSelect() {
        if(this.omniJsonData.hasOwnProperty("MedicalDependents") && this.omniJsonData.MedicalDependents && this.omniJsonData.MedicalDependents.Dependents && !this.omniJsonData.SelectedDependentsForMedical){
            console.log('No CHanges made to dep selections')
            this.omniApplyCallResp({SelectedDependentsForMedical: this.omniJsonData.DependentInfo.filter(dep => this.MedicalDependents.findIndex(r => r.DependentId === dep.Id) >= 0)});
        }
        if(this.omniJsonData.hasOwnProperty("DentalDependents") && this.omniJsonData.DentalDependents && this.omniJsonData.DentalDependents.Dependents && !this.omniJsonData.SelectedDependentsForDental){
            console.log('No CHanges made to dep selections')
            this.omniApplyCallResp({SelectedDependentsForDental: this.omniJsonData.DependentInfo.filter(dep => this.DentalDependents.findIndex(r => r.DependentId === dep.Id) >= 0)});
        }
        if(this.omniJsonData.hasOwnProperty("VisionDependents") && this.omniJsonData.VisionDependents && this.omniJsonData.VisionDependents.Dependents && !this.omniJsonData.SelectedDependentsForVision){
            console.log('No CHanges made to dep selections')
            this.omniApplyCallResp({SelectedDependentsForVision: this.omniJsonData.DependentInfo.filter(dep => this.VisionDependents.findIndex(r => r.DependentId === dep.Id) >= 0)});
        }
    }

    disconnectedCallback(){
        console.log("parseSavedState:: OOA---->>>>", JSON.stringify(this.ooaSelected));
        console.log("selectedRows:: OOA---->>>>", JSON.stringify(this.selectedRows));

        this.omniSaveState({tableData: this.tableData, selectedRows : this.selectedRows, ooaSelected: this.ooaSelected}, null, true);
    }

    parseSavedState(stateData) {
        this.ooaSelected = stateData.ooaSelected;
        console.log("stateData:: OOA---->>>>", JSON.stringify(stateData));
        this.tableData = stateData.tableData.map(dep => {
            let dependentAtOOA = stateData.ooaSelected.find(s=> s.Id === dep.Id);
            dep.ooa = dependentAtOOA && dependentAtOOA.ooa;
            return dep;
        });
        this.selectedRows = stateData.selectedRows;
    }

    render() {
        return templ;
    }

}