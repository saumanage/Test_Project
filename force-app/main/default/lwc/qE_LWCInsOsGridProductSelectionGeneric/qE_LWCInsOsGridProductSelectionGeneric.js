import { LightningElement, track, api } from 'lwc';
import insOsProductSelectionOptima from 'vlocity_ins/insOsGridProductSelection';

import pubsub from 'vlocity_ins/pubsub';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

import { commonUtils, dataFormatter, omniscriptUtils } from 'vlocity_ins/insUtility';

const DEFAULT_BATCH_SIZE = 10;
const MAX_CONCURRENT_SERVICE_REQUEST = 5;
const DEBUG =false;
export default class QE_LWCInsOsCustomGridProductSelection extends insOsProductSelectionOptima {

    @api hiddenActions;
    @api stepName;
    @api planType;
    @api planTypeValue;
    @api dependentAge;
    @api dependentRelation;
    @api spouseAge;
    @api isCityOfSuffolkGroup;
    
    customProductCount;

    initVariables() {
        this.dependentsNodeName = `${this.planType}Dependents`;
        this.selectedDependentsNodeName = `SelectedDependentsFor${this.planType}`
        this.assetNodeName = `${this.planType}AssetId`;
        this.selectedNewDepNodeName = `SelectedNewDep${this.planType}`;
        this.unselectedDepToRemoveNodeName = `UnselectedDepToRemove${this.planType}`;
        this.invalidUpdateNodeName = `InvalidateUpdate${this.planType}`;
        this.firstTimeNodeName = `FirstTime${this.planType}PlanSelected`;
        this.stepNodeName = `STEP_${this.planType}PlanSelection`;

        if (this.planType === 'Medical') {
            this.waiveNodeName = `WaivePlan`;
        } else {
            this.waiveNodeName = `Waive${this.planType}Plan`;
        }
    }

    removeSelectedProduct(selectedProducts) {
        this.initVariables();
        
           if(DEBUG) console.log("this.stepName:::", this.planType);

        let cartProducts = omniscriptUtils.getCartProducts(this);
        let selectedproductInCart = cartProducts.filter(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue);
          if(DEBUG) console.log("selectedproductInCart", JSON.parse(JSON.stringify(selectedproductInCart)));
        let selectedProductId;
        if (selectedproductInCart.length) {
            selectedProductId = selectedproductInCart[0].Id;
        }
        if (Array.isArray(selectedProducts) && selectedProducts.length) {
            for (let i = 0; i < selectedProducts.length; i++) {
                if (selectedProducts[i] && selectedProducts[i].hasOwnProperty("isSelected") && selectedProducts[i].isSelected && (selectedProductId ? selectedProducts[i].Id !== selectedProductId : true)) {
                    selectedProducts[i].isSelected = !selectedProducts[i].isSelected;
                    // pubsub.fire(this.rootChannel, 'updateProduct', { product: selectedProducts[i] });
                }
            }
            return selectedProducts;
        } else if (selectedProducts.length && selectedProducts[0].hasOwnProperty("isSelected") && selectedProducts[0].isSelected && (selectedProductId ? selectedProducts[i].Id !== selectedProductId : true)) {
            selectedProducts[0].isSelected = !selectedProducts[0].isSelected;
            // pubsub.fire(this.rootChannel, 'updateProduct', { product: selectedProducts[0] });
            return selectedProducts;
        }
    }

    validateUpdateEnrollPlans() {
        this.initVariables();


        if (this.omniJsonData.UpdatePlans || (this.omniJsonData.OpenEnrollment && this.omniJsonData.AssetStatusOE)) {
            let enrolledProducts = Array.isArray(this.omniJsonData.enrolledProducts) ? this.omniJsonData.enrolledProducts : [];
           
            
                  if(DEBUG) console.log('planTypeValue: ' + this.planTypeValue);

            if (this.omniJsonData.selectedProducts.filter(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue).length > 0 && enrolledProducts.filter(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue).length > 0) {
                let originalPlan = this.omniJsonData.enrolledProducts.find(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue);
                let selectedPlan = this.omniJsonData.selectedProducts.find(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue);
                if (selectedPlan.Id !== originalPlan.Id) {
                    this.omniApplyCallResp({ [this.invalidUpdateNodeName]: true });
                }
                if (selectedPlan.Id === originalPlan.Id) {
                    this.omniApplyCallResp({ [this.invalidUpdateNodeName]: false });
                }
                
                
                      if(DEBUG) console.log('selectedPlan 1==== '+JSON.stringify(selectedPlan));
            }

            if (this.omniJsonData.selectedProducts.filter(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue).length > 0 && enrolledProducts.filter(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue).length === 0) {
                let selectedPlan = this.omniJsonData.selectedProducts.find(p => p.Type__c.replaceAll(' ', '') === this.planTypeValue && p.isSelected == true);
                //  if(DEBUG) console.log(`selectedPlan${planTypeValue}::`, JSON.stringify(selectedPlan));
                  if(DEBUG) console.log('selectedPlan ==== '+selectedPlan);
                  
                if (selectedPlan && this.omniJsonData.hasOwnProperty(this.invalidUpdateNodeName) && !this.omniJsonData[this.invalidUpdateNodeName]) {
                    this.omniApplyCallResp({ [this.firstTimeNodeName]: true });
                } else if (selectedPlan) {
                    this.omniApplyCallResp({ [this.firstTimeNodeName]: true });
                }
            }
            

            if (this.omniJsonData && this.omniJsonData[this.stepNodeName] && this.omniJsonData[this.stepNodeName][this.waiveNodeName]) {
                this.omniApplyCallResp({ [this.invalidUpdateNodeName]: true });
            }
        }
    }

    removeProductsFromCartIfExists() {
        this.initVariables();

        //Get data from omniscript seed data.
        let allPlanTypes = this.omniJsonData.AllPlanTypes;
        
        //Get all products.
        let cartProducts = omniscriptUtils.getCartProducts(this);
          if(DEBUG) console.log("cartProducts456789::", JSON.parse(JSON.stringify(cartProducts)));

        //Loop through each one of the plan types and remove plan types that are waived.
        allPlanTypes.forEach(pt => {
            let stepName = `STEP_${pt.planName}PlanSelection`;
            let waiveNode = pt.planName == 'Medical' ? 'WaivePlan' : `Waive${pt.planName}Plan`;
            
            if (this.omniJsonData && this.omniJsonData[stepName] && this.omniJsonData[stepName][waiveNode]) {
                cartProducts = cartProducts.filter(p => p.Type__c !== pt.planValue);
            }
    
              if(DEBUG) console.log("cartProducts::", JSON.parse(JSON.stringify(cartProducts)));
            omniscriptUtils.updateCartProducts(this, cartProducts, this.rootChannel);
            this.productCount = cartProducts.length;
            this.customProductCount = cartProducts.length;
        });

          if(DEBUG) console.log("this.isConnected", this.isConnected);
    }

    connectedCallback() {
          if(DEBUG) console.log('isCityOfSuffolkGroup = '+this.isCityOfSuffolkGroup);
        if (typeof this.loadBatchSize === 'string') {
            this.loadBatchSize = parseInt(this.loadBatchSize, 10);
        }
        if (typeof this.concurrentBatchRequest === 'string') {
            this.concurrentBatchRequest = Math.min(
                parseInt(this.concurrentBatchRequest, 10),
                MAX_CONCURRENT_SERVICE_REQUEST
            );
        }
        if (typeof this.compareBar === 'string') {
            this.compareBar = this.compareBar === 'true';
        }
        if (this.omniJsonDef.propSetMap.filtersConfig) {
            this.populateServiceFilters();
        }

        this.stepName = this.omniScriptHeaderDef.asName;
        this.rootChannel = `ProductSelectionChannel-${dataFormatter.uniqueKey()}`;
        pubsub.register(this.rootChannel, this.pubsubPayload);
        const dataOmniLayout = this.getAttribute('data-omni-layout');
        this.theme = dataOmniLayout === 'newport' ? 'nds' : 'slds';
        this.productConfig = this.omniJsonDef.propSetMap.productConfig || {};
        if (typeof this.maxCompareProducts === 'string') {
            this.maxCompareProducts = Math.min(parseInt(this.maxCompareProducts, 10), 4);
        }
        this.stateData = omniscriptUtils.getSaveState(this);
        this.formatRemoteActions();
        if (this.stateData) {
            this.parseSavedState(this.stateData);
        } else {
            this.getProducts();
        }
        
        //Remove products if plan type is waived.
        const cartProducts = omniscriptUtils.getCartProducts(this);
        if (cartProducts.length === 0) {
            // Update the OS json to an empty array
            omniscriptUtils.updateCartProducts(this, [], this.rootChannel);
        } else {
            this.removeProductsFromCartIfExists();
            this.validateUpdateEnrollPlans();
        }
        
        if (this.filteredProducts) {
              if(DEBUG) console.log("filteredProducts:::", JSON.parse(JSON.stringify(this.filteredProducts)));
        }

    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

    parseSavedState(stateData) {
        this.products = stateData.products;
        this.selectedCompareProducts = stateData.selectedCompareProducts;
        this.visibleProductsIndex = stateData.visibleProductsIndex;
        this.totalNumProducts = stateData.totalNumProducts;
        this.filteredProducts = this.products;
        this.isLoaded = true;
        this.prepareSortCombo();
        this.populateInlineFilters(true);
        this.disableSortSelect = false;
        if (this.filteredProducts) {
              if(DEBUG) console.log("filteredProducts:--------::", JSON.parse(JSON.stringify(this.filteredProducts)));
            this.filteredProducts = this.filteredProducts.length ? this.removeSelectedProduct(this.filteredProducts) : [];
              if(DEBUG) console.log("filteredProducts:--------::", JSON.parse(JSON.stringify(this.filteredProducts)));
        }
    }

}