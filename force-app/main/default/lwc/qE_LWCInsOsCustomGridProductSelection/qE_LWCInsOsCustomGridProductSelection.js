import { LightningElement, track, api } from 'lwc';
import insOsProductSelectionOptima from 'vlocity_ins/insOsGridProductSelection';

import pubsub from 'vlocity_ins/pubsub';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

//import LABELS from './insOsGridProductSelectionLabels';
import { commonUtils, dataFormatter, omniscriptUtils } from 'vlocity_ins/insUtility';
// import LABELS from './insOsGridProductSelectionLabels';
const DEFAULT_BATCH_SIZE = 10;
const MAX_CONCURRENT_SERVICE_REQUEST = 5;

export default class QE_LWCInsOsCustomGridProductSelection extends insOsProductSelectionOptima {
    
    @api hiddenActions;
    @api stepName;
    @api planType;

    customProductCount;
    
    removeSelectedProduct(selectedProducts) {
        console.log("this.stepName:::", this.planType);
        let cartProducts = omniscriptUtils.getCartProducts(this);
        let selectedproductInCart = cartProducts.filter(p => p.Type__c === this.planType);
        console.log("selectedproductInCart", JSON.parse(JSON.stringify(selectedproductInCart)));
        let selectedProductId;
        if(selectedproductInCart.length) {
            selectedProductId = selectedproductInCart[0].Id;
        }
        if(Array.isArray(selectedProducts) && selectedProducts.length) {
            for(let i = 0; i < selectedProducts.length; i++) {
                if(selectedProducts[i] && selectedProducts[i].hasOwnProperty("isSelected") && selectedProducts[i].isSelected && (selectedProductId ? selectedProducts[i].Id !== selectedProductId : true)) {
                    selectedProducts[i].isSelected = !selectedProducts[i].isSelected;
                    // pubsub.fire(this.rootChannel, 'updateProduct', { product: selectedProducts[i] });
                }
            }
            return selectedProducts;
        } else if(selectedProducts.length && selectedProducts[0].hasOwnProperty("isSelected") && selectedProducts[0].isSelected && (selectedProductId ? selectedProducts[i].Id !== selectedProductId : true)) {
            selectedProducts[0].isSelected = !selectedProducts[0].isSelected;
            // pubsub.fire(this.rootChannel, 'updateProduct', { product: selectedProducts[0] });
            return selectedProducts;
        }
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
        this.productCount = cartProducts.length;
        this.customProductCount = cartProducts.length;

        console.log("this.isConnected", this.isConnected);
    }
    
    connectedCallback() {
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
        const cartProducts = omniscriptUtils.getCartProducts(this);
        if (cartProducts.length === 0) {
            // Update the OS json to an empty array
            omniscriptUtils.updateCartProducts(this, [], this.rootChannel);
        } else {
            this.removeProductsFromCartIfExists();
            this.validateUpdateEnrollPlans();
        }
        this.cartProductCount();
        if(this.filteredProducts) {
            console.log("filteredProducts:::", JSON.parse(JSON.stringify(this.filteredProducts)));
        }

    }
    

    disconnectedCallback(){
        super.disconnectedCallback();
        // this.removeProductsFromCartIfExists();
    }

    cartProductCount() {
        // console.log("omniJsonData::", JSON.parse(JSON.stringify(this.omniJsonData)));
        // if(this.customProductCount || ) {
            // this.productCount = this.customProductCount;
        // } else {
        //     const cartProducts = omniscriptUtils.getCartProducts(this);
        //     console.log("cartProductCount cartProducts:==>>:", JSON.parse(JSON.stringify(cartProducts)));
        //     this.productCount = cartProducts.length;
        // }
    }
/**
         * Formats product data
         * @param {Object} products
         */
    // formatProducts(products) {
    //     let tempProducts = Array.isArray(products) ? products : [products];
    //     if (tempProducts && tempProducts.length) {
    //         this.products = this.products.concat(
    //             tempProducts.map(product => {
    //                 return dataFormatter.formatProduct(this.addProductConfig(product), {
    //                     isProductSelection: true
    //                 });
    //             })
    //         );
    //     }
    //     this.filteredProducts = this.products;
    //     this.prepareSortCombo();
    //     this.populateInlineFilters(true);
    // }
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
        if(this.filteredProducts) {
            console.log("filteredProducts:--------::", JSON.parse(JSON.stringify(this.filteredProducts)));
            this.filteredProducts = this.filteredProducts.length ? this.removeSelectedProduct(this.filteredProducts) : [];
            console.log("filteredProducts:--------::", JSON.parse(JSON.stringify(this.filteredProducts)));
        }
    }

}