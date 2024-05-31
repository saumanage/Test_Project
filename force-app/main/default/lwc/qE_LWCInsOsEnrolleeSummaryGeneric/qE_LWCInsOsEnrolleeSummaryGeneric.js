import { api, LightningElement } from 'lwc';
import insOsEnrolleeBenefitsSummary from'vlocity_ins/insOsEnrolleeBenefitsSummary'
import templ from './qE_LWCInsOsEnrolleeSummaryGeneric.html';
import { commonUtils, dataFormatter, omniscriptUtils } from 'vlocity_ins/insUtility';
import pubsub from 'vlocity_ins/pubsub';
//import {qE_LWCSharedUtil} from 'c/qE_LWCSharedUtil'

export default class QE_LWCInsOsEnrolleeSummaryCustom extends insOsEnrolleeBenefitsSummary {

    @api planType;
    @api planTypeValue;

    //Andrew Vaughn: added for crms-752
    @api contribution;
    
    get DEBUG()
    {
        
        
        //console.log("GettIng DEGUG");
        //console.log("GettIng DEGUG2: "+qE_LWCSharedUtil.IS_DEBUG() );
        return true;
    }
      
    get showComponent(){
        return this.showComponentCalculate();
    }
    get dependentsList(){
        return this.dependents && this.dependents.length > 0 ? this.dependents.map(d => d.Name ).join(", ") : '';
    }
    get subscriberName(){
        return this.omniJsonData && this.omniJsonData.SubscriberName ? this.omniJsonData.SubscriberName : "";
    }
    connectedCallback(){
        if(this.showComponentCalculate()){
            super.connectedCallback();
        }
        this.removeProductsFromCartIfExists();
        this.validateUpdateEnrollPlans();
        this.validateEmailRequired();
    }

    showComponentCalculate(){
        let response = false;
        let ruleValues = [];
        if(this.omniJsonDef.propSetMap.show.group.rules){
            let rules = this.omniJsonDef.propSetMap.show.group.rules;
            let ruleOperator = this.omniJsonDef.propSetMap.show.group.operator;
            
            rules.forEach(rule => {
                if(rule.condition === '='){
                      if(this.DEBUG) console.log(this.omniGetMergeField(`%${rule.field}%`) === (rule.data === "true" || rule.data === "false" ? rule.data === "true" : rule.data))
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
        //  if(this.DEBUG) console.log("OmnijsonData:::", JSON.stringify(this.omniJsonData));
        //  if(this.DEBUG) console.log("this.omniJsonData.UpdatePlans:::", typeof this.omniJsonData.UpdatePlans);
        //  if(this.DEBUG) console.log("this.omniJsonData.UpdatePlans value:::", this.omniJsonData.UpdatePlans);

        

        let invalidUpdateNodeName = `InvalidateUpdate${this.planType}`;
        let firstTimeNodeName = `FirstTime${this.planType}PlanSelected`;
        let stepNodeName = `STEP_${this.planType}PlanSelection`;
        let waiveNodeName = `Waive${this.planType}Plan`;
        
        if( !this.omniJsonData)
            return;

        if(this.omniJsonData.UpdatePlans || (this.omniJsonData.OpenEnrollment && this.omniJsonData.AssetStatusOE)){
              if(this.DEBUG) console.log('selectedProducts: ' + JSON.stringify(this.omniJsonData.selectedProducts));
            let enrolledProducts = Array.isArray(this.omniJsonData.enrolledProducts) ? this.omniJsonData.enrolledProducts : [];
            if(this.omniJsonData.selectedProducts && this.omniJsonData.selectedProducts.filter(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue).length > 0 && enrolledProducts.filter(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue).length > 0){
                let originalPlan = this.omniJsonData.enrolledProducts.find(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue);
                let selectedPlan = this.omniJsonData.selectedProducts.find(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue);
                if(selectedPlan.Id !== originalPlan.Id){
                    this.omniApplyCallResp({[invalidUpdateNodeName]: true});
                }
                if(selectedPlan.Id === originalPlan.Id){
                    this.omniApplyCallResp({[invalidUpdateNodeName]: false});
                }
            }
            if(this.omniJsonData.selectedProducts && this.omniJsonData.selectedProducts.filter(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue).length > 0 && enrolledProducts.filter(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue).length === 0){
                let selectedPlan = this.omniJsonData.selectedProducts.find(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue && p.isSelected == true);
                  if(this.DEBUG) console.log(`selectedPlan${this.planType}::`, JSON.stringify(selectedPlan));
                if(selectedPlan && this.omniJsonData.hasOwnProperty(invalidUpdateNodeName) && !this.omniJsonData.InvalidateUpdateMedical){
                    this.omniApplyCallResp({[firstTimeNodeName]: true});
                } else if(selectedPlan) {
                    this.omniApplyCallResp({[firstTimeNodeName]: true});
                }
            }
            if(this.omniJsonData && this.omniJsonData[stepNodeName] && this.omniJsonData[stepNodeName][waiveNodeName]){
                this.omniApplyCallResp({[invalidUpdateNodeName]: true});
            }
        }
    }
    removeProductsFromCartIfExists() {
        // this.initVariables();

        //Get data from omniscript seed data.
        let allPlanTypes = this.omniJsonData.AllPlanTypes;
        
        //Get all products.
        let cartProducts = omniscriptUtils.getCartProducts(this);
          if(this.DEBUG) console.log("cartProducts456789::", JSON.parse(JSON.stringify(cartProducts)));

        //Loop through each one of the plan types and remove plan types that are waived.
        allPlanTypes.forEach(pt => {
            let stepName = `STEP_${pt.planName}PlanSelection`;
            let waiveNode = pt.planName == 'Medical' ? 'WaivePlan' : `Waive${pt.planName}Plan`;
            
            if (this.omniJsonData && this.omniJsonData[stepName] && this.omniJsonData[stepName][waiveNode]) {
                cartProducts = cartProducts.filter(p => p.Type__c !== pt.planValue);
            }
    
              if(this.DEBUG) console.log("cartProducts::", JSON.parse(JSON.stringify(cartProducts)));
            omniscriptUtils.updateCartProducts(this, cartProducts, this.rootChannel);
            this.productCount = cartProducts.length;
            this.customProductCount = cartProducts.length;
        });

          if(this.DEBUG) console.log("this.isConnected", this.isConnected);
    }
    openProductModal(){
          if(this.DEBUG) console.log("Plans:::", JSON.stringify(this.plans));
        pubsub.fire(this.rootChannel, 'openProductModal', { products: this.plans });
    }

    validateEmailRequired()
    {
        
        /*if(!this.plans)
        {
            super.initData();
        }*/

         if(this.DEBUG) console.log("Plans_EMAIL:::", JSON.stringify(this.plans));
        //Check if plans exist
         if(this.plans){
            let QE_EmailRequired  = this.plans.some(
                (rec) => rec.QE_Email_Address_Required__c ===true
                );

            if(QE_EmailRequired) //only update if true;
             this.omniApplyCallResp({"EmailRequiredForSelectedPlan":QE_EmailRequired });
         }
    }
}