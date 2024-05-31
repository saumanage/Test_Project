import { api, LightningElement } from 'lwc';
import insOsEnrolleeBenefitsSummary from'vlocity_ins/insOsEnrolleeBenefitsSummary'
import templ from './qE_LWCInsOsEnrolleeSummaryCustom.html';
import { commonUtils, dataFormatter, omniscriptUtils } from 'vlocity_ins/insUtility';
import pubsub from 'vlocity_ins/pubsub';

export default class QE_LWCInsOsEnrolleeSummaryCustom extends insOsEnrolleeBenefitsSummary {


    @api planType;

    get showComponent(){
        return this.showComponentCalculate();
    }
    get dependentsList(){
        return this.dependents && this.dependents.length > 0 ? this.dependents.map(d => d.Name ).join(", ") : '';
    }
    connectedCallback(){
        if(this.showComponentCalculate()){
            super.connectedCallback();
        }
        this.removeProductsFromCartIfExists();
        this.validateUpdateEnrollPlans();
    }

    showComponentCalculate(){
        let response = false;
        let ruleValues = [];
        if(this.omniJsonDef.propSetMap.show.group.rules){
            let rules = this.omniJsonDef.propSetMap.show.group.rules;
            let ruleOperator = this.omniJsonDef.propSetMap.show.group.operator;
            
            rules.forEach(rule => {
                if(rule.condition === '='){
                    console.log(this.omniGetMergeField(`%${rule.field}%`) === (rule.data === "true" || rule.data === "false" ? rule.data === "true" : rule.data))
                    ruleValues.push(this.omniGetMergeField(`%${rule.field}%`) === (rule.data === "true" || rule.data === "false" ? rule.data === "true" : rule.data))
                }
            });
            response= ruleValues.every(v => v === true);
        }
        return response;
    }
    render(){
        return templ;
    }
    validateUpdateEnrollPlans(){
        console.log("OmnijsonData:::", JSON.stringify(this.omniJsonData));
        console.log("this.omniJsonData.UpdatePlans:::", typeof this.omniJsonData.UpdatePlans);
        console.log("this.omniJsonData.UpdatePlans value:::", this.omniJsonData.UpdatePlans);
        if(this.omniJsonData.UpdatePlans || (this.omniJsonData.OpenEnrollment && this.omniJsonData.AssetStatusOE)){
            let enrolledProducts = Array.isArray(this.omniJsonData.enrolledProducts) ? this.omniJsonData.enrolledProducts : [this.omniJsonData.enrolledProducts];
            if(this.omniJsonData.selectedProducts.filter(p => p.Type__c === "Medical").length > 0 && enrolledProducts.filter(p => p.Type__c === "Medical").length > 0){
                let originalPlan = this.omniJsonData.enrolledProducts.find(p => p.Type__c === "Medical");
                let selectedPlan = this.omniJsonData.selectedProducts.find(p => p.Type__c === "Medical");
                if(selectedPlan.Id !== originalPlan.Id){
                    this.omniApplyCallResp({InvalidateUpdateMedical: true});
                }
                if(selectedPlan.Id === originalPlan.Id){
                    this.omniApplyCallResp({InvalidateUpdateMedical: false});
                }
            }
            if(this.omniJsonData.selectedProducts.filter(p => p.Type__c === "Medical").length > 0 && enrolledProducts.filter(p => p.Type__c === "Medical").length === 0){
                let selectedPlan = this.omniJsonData.selectedProducts.find(p => p.Type__c === "Medical" && p.isSelected == true);
                console.log("selectedPlanMedical::", JSON.stringify(selectedPlan));
                if(selectedPlan && this.omniJsonData.hasOwnProperty("InvalidateUpdateMedical") && !this.omniJsonData.InvalidateUpdateMedical){
                    this.omniApplyCallResp({FirstTimeMedicalPlanSelected: true});
                } else if(selectedPlan) {
                    this.omniApplyCallResp({FirstTimeMedicalPlanSelected: true});
                }
            }
            if(this.omniJsonData && this.omniJsonData.STEP_MedicalPlanSelection && this.omniJsonData.STEP_MedicalPlanSelection.WaivePlan){
                // this.removeSelectedProduct(cartProducts, 'Medical');
                this.omniApplyCallResp({InvalidateUpdateMedical: true});
            }
            if(this.omniJsonData.selectedProducts.filter(p => p.Type__c === "Dental").length > 0 && enrolledProducts.filter(p => p.Type__c === "Dental").length > 0  ){
                let originalPlan = this.omniJsonData.enrolledProducts.find(p => p.Type__c === "Dental");
                let selectedPlan = this.omniJsonData.selectedProducts.find(p => p.Type__c === "Dental");
                if(selectedPlan.Id !== originalPlan.Id){
                    this.omniApplyCallResp({InvalidateUpdateDental: true});
                }
                if(selectedPlan.Id === originalPlan.Id){
                    this.omniApplyCallResp({InvalidateUpdateDental: false});
                }
            }
            if(this.omniJsonData && this.omniJsonData.STEP_DentalPlanSelection && this.omniJsonData.STEP_DentalPlanSelection.WaiveDentalPlan){
                // this.removeSelectedProduct(cartProducts, 'Medical');
                this.omniApplyCallResp({InvalidateUpdateDental: true});
            }
            if(this.omniJsonData.selectedProducts.filter(p => p.Type__c === "Dental").length > 0 && enrolledProducts.filter(p => p.Type__c === "Dental").length === 0){
                let selectedPlan = this.omniJsonData.selectedProducts.find(p => p.Type__c === "Dental" && p.isSelected == true);
                console.log("selectedPlanDental::", JSON.stringify(selectedPlan));
                if(selectedPlan && this.omniJsonData.hasOwnProperty("InvalidateUpdateDental") && !this.omniJsonData.InvalidateUpdateDental) {
                    this.omniApplyCallResp({FirstTimeDentalPlanSelected: true});
                } else if(selectedPlan) {
                    this.omniApplyCallResp({FirstTimeDentalPlanSelected: true});
                }
            }
            if(this.omniJsonData.selectedProducts.filter(p => p.Type__c === "Vision").length > 0 && enrolledProducts.filter(p => p.Type__c === "Vision").length > 0  ){
                let originalPlan = this.omniJsonData.enrolledProducts.find(p => p.Type__c === "Vision");
                let selectedPlan = this.omniJsonData.selectedProducts.find(p => p.Type__c === "Vision");
                if(selectedPlan.Id !== originalPlan.Id){
                    console.log("InvalidateUpdateVision::");
                    this.omniApplyCallResp({InvalidateUpdateVision: true});
                }
                if(selectedPlan.Id === originalPlan.Id){
                    this.omniApplyCallResp({InvalidateUpdateVision: false});
                }
            }
            if(this.omniJsonData && this.omniJsonData.STEP_VisionPlanSelection && this.omniJsonData.STEP_VisionPlanSelection.WaiveVisionPlan){
                // this.removeSelectedProduct(cartProducts, 'Medical');
                this.omniApplyCallResp({InvalidateUpdateVision: true});
            }
            if(this.omniJsonData.selectedProducts.filter(p => p.Type__c === "Vision").length > 0 && enrolledProducts.filter(p => p.Type__c === "Vision").length === 0){
                let selectedPlan = this.omniJsonData.selectedProducts.find(p => p.Type__c === "Vision" && p.isSelected == true);
                console.log("selectedPlanVision::", JSON.stringify(selectedPlan));
                if(selectedPlan && this.omniJsonData.hasOwnProperty("InvalidateUpdateVision") && !this.omniJsonData.InvalidateUpdateVision){
                    this.omniApplyCallResp({FirstTimeVisionPlanSelected: true});
                } else if(selectedPlan) {
                    this.omniApplyCallResp({FirstTimeVisionPlanSelected: true});
                }
            }
        }
    }
    removeProductsFromCartIfExists() {
        let cartProducts = omniscriptUtils.getCartProducts(this);
        console.log("cartProducts456789::", JSON.parse(JSON.stringify(cartProducts)));
        if(this.omniJsonData && this.omniJsonData.STEP_MedicalPlanSelection && this.omniJsonData.STEP_MedicalPlanSelection.WaivePlan){
            // this.removeSelectedProduct(cartProducts, 'Medical');
            cartProducts =  cartProducts.filter(p => p.Type__c !== 'Medical');
        }
        if(this.omniJsonData && this.omniJsonData.STEP_DentalPlanSelection && this.omniJsonData.STEP_DentalPlanSelection.WaiveDentalPlan){
            cartProducts =  cartProducts.filter(p => p.Type__c !== 'Dental');
        }
        if(this.omniJsonData && this.omniJsonData.STEP_VisionPlanSelection && this.omniJsonData.STEP_VisionPlanSelection.WaiveVisionPlan){
            cartProducts =  cartProducts.filter(p => p.Type__c !== 'Vision');
        }
        console.log("cartProducts::", JSON.parse(JSON.stringify(cartProducts)));
        omniscriptUtils.updateCartProducts(this, cartProducts, this.rootChannel);
        // this.productCount = cartProducts.length;
        // this.customProductCount = cartProducts.length;

        // console.log("this.isConnected", this.isConnected);
    }
    openProductModal(){
        console.log("Plans:::", JSON.stringify(this.plans));
        pubsub.fire(this.rootChannel, 'openProductModal', { products: this.plans });
    }
}