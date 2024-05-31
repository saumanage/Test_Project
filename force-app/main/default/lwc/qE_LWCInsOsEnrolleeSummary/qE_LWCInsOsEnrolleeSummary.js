import { LightningElement } from 'lwc';
import insOsEnrolleeBenefitsSummary from'vlocity_ins/insOsEnrolleeBenefitsSummary'
import templ from './qE_LWCInsOsEnrolleeSummary.html';
import { commonUtils, dataFormatter, omniscriptUtils } from 'vlocity_ins/insUtility';

export default class qE_LWCInsOsEnrolleeSummary extends insOsEnrolleeBenefitsSummary {
    get showComponent(){
        return this.showComponentCalculate();
    }
    connectedCallback(){
        if(this.showComponentCalculate()){
            super.connectedCallback();
        }
        this.removeProductsFromCartIfExists();
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
}