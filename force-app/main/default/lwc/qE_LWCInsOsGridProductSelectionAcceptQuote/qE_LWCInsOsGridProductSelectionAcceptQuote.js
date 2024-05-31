import { api, track } from 'lwc';
import insOsProductSelectionOptima from 'vlocity_ins/insOsGridProductSelection';
import { commonUtils, dataFormatter, omniscriptUtils } from 'vlocity_ins/insUtility';
import util from "vlocity_ins/utility";
import pubsub from 'vlocity_ins/pubsub';


export default class QE_LWCInsOsGridProductSelection extends insOsProductSelectionOptima {
    showConfigButton = false;
    @api displayAllFilters = false;
    @api hiddenActions;
    @api
    get empSize() {
        return this.rateValues.empSize;
    }
    set empSize(data) {
        this.rateValues.empSize = parseInt(data);
        if(this.rateValues.empSize >= 1 && this.rateValues.empSize <= 50){
            this.rateValues.sizeType = 'SG'
        }else if(this.rateValues.empSize >= 51 && this.rateValues.empSize <= 150){
            this.rateValues.sizeType = 'MM'
        }else{
            this.rateValues.sizeType = 'LG'
        }
        console.log(data)

    }
    @api
    get insuredType() {
        return this.rateValues.insuredType;
    }
    set insuredType(data) {
        this.rateValues.insuredType = data;
        console.log(data)
    }
    @api
    get isApprovedQuote() {
        return this.rateValues.isApprovedQuote;
    }
    set isApprovedQuote(data) {
        this.rateValues.isApprovedQuote = data;
        console.log(data)
    }
    @api
    get showRatesAcceptQuote() {
        return this.rateValues.showRatesAcceptQuote;
    }
    set showRatesAcceptQuote(data) {
        this.rateValues.showRatesAcceptQuote = data;
        console.log(data)
    }

    @track rateValues = {
        empSize: 0,
        sizeType: '',
        insuredType: '',
        isApprovedQuote: false,
        showRatesAcceptQuote:true
    }

    //keep POSA QLI info to not be delete
    posaDetails = [];

    // @api Quote_MarketSegment;
    IsAcceptQuoteFlow = false;
    uniqueKey() {
        return Math.random().toString(36).substring(7);
    }
    handleAddCartProd(value) {
        if(parseInt(this.rateValues.empSize ) > 50 && parseInt(this.rateValues.empSize ) <= 150){
            console.log('handleAddCartProd')
            let productFromConf = { ...value.detail };
            omniscriptUtils.clearStateOnChange(this);
            const clickedProductId = productFromConf.Id;
            // let selectedProduct = this.products.find(p => p.Id === clickedProductId);
            // if (selectedProduct) {
            //     selectedProduct.isSelected = !selectedProduct.isSelected;
            //     productFromConf.isSelected = selectedProduct.isSelected;
                pubsub.fire(this.rootChannel, 'updateProduct', { product: productFromConf });
            // }
            productFromConf.productIdCart = this.uniqueKey();
            productFromConf.isSelected = true;
            let cartProducts = omniscriptUtils.getCartProducts(this);
            // let productIndex = cartProducts.findIndex(p => p.Id === clickedProductId);
            // productIndex === -1 ? cartProducts.push(productFromConf) : cartProducts.splice(productIndex, 1);
            cartProducts.push(productFromConf)
            omniscriptUtils.updateCartProducts(this, cartProducts, this.rootChannel);
            this.productCount = cartProducts.length;

        }else{
            super.handleAddCartProd(value);
        }
        
    }
    getProducts() {
        this.products = [];
        util
        .getDataHandler(JSON.stringify({
            type: "ApexRemote",
            value: {
              className: "InsQuoteService",
              methodName: "getQuoteDetail",
              inputMap: "{}",
              optionsMap: JSON.stringify({quoteId: this.omniJsonData.ContextId, isMultiRoot: true})
            }
          }))
        .then(response => {
            console.log(response);
            let res = JSON.parse(response);
            if(res.productConfigurationDetail && !!res.productConfigurationDetail.records){
                this.posaDetails = res.productConfigurationDetail.records.filter(p => p.QE_Product_Sub_Type__c == 'POSA');
                res.productConfigurationDetail.records=res.productConfigurationDetail.records.filter(e => !e.vlocity_ins__ProductName__c.includes("POSA"))
                this.totalNumProducts = res.productConfigurationDetail.records.length;
                this.formatProducts(res.productConfigurationDetail.records);
            }
        })
        .catch(error => {
            commonUtils.showErrorToast.call(this, error);
            this.totalNumProducts = 0;
        })
        .finally(() => this.isLoaded = true);

    }
    populateServiceFilters() {
        this.inPageFiltersConf = this.omniJsonDef.propSetMap.filtersConfig.inPageFilters;
        this.serviceFilters = [];
        if (this.omniJsonDef.propSetMap.filtersConfig.serviceFilters) {
            const preFilterMerged = this.omniGetMergeField(this.preFilter);
            // const preFiltersArray = preFilterMerged.split(',');
            this.serviceFilters = Object.values(this.omniJsonDef.propSetMap.filtersConfig.serviceFilters).map(serviceFilter => {
                const filter = JSON.parse(JSON.stringify(serviceFilter));
                const emptyOption = {
                    label: `--${this.labels.None}--`,
                    value: ''
                };
                filter.listOfValues.unshift(emptyOption);
                filter.filterSelection = '';
                // preFiltersArray.forEach(preFilter => {
                //     const preFilterKey = preFilter.split(':')[0];
                //     const preFilterValue = preFilter.split(':')[1];
                //     const keyMatch = filter.attributeObject === preFilterKey;
                //     const valueAvailable = filter.listOfValues.some(option => option.value === preFilterValue);
                //     if (keyMatch && valueAvailable) {
                //         filter.filterSelection = preFilterValue;
                //     }
                // });
                return filter;
            });
        }
    }
    selectProduct(e) {
        let cartProducts = [];
        console.log('rateValuesrateValues');
        if(parseInt(this.rateValues.empSize ) > 50 && parseInt(this.rateValues.empSize ) <= 150){
            console.log('selectProduct')
            omniscriptUtils.clearStateOnChange(this);
            const clickedProductId = e.detail.id;
            const isCart = e.detail.isCart;
            let selectedProduct;
            if(!isCart){
                selectedProduct = JSON.parse(JSON.stringify(this.products.find(p => p.Id === clickedProductId)));
                selectedProduct.isSelected = true;
                selectedProduct.productIdCart = this.uniqueKey();
            }
            
            pubsub.fire(this.rootChannel, 'updateProduct', { product: selectedProduct });
            
            cartProducts = omniscriptUtils.getCartProducts(this);
            if(isCart){
                const productIndex = cartProducts.findIndex(p => p.productIdCart === clickedProductId);
                cartProducts.splice(productIndex, 1);
            }else{
                cartProducts.push(selectedProduct);
    
            }
            omniscriptUtils.updateCartProducts(this, cartProducts, this.rootChannel);
            this.productCount = cartProducts.length;
        }else{
            super.selectProduct({detail: e.detail.id});
        }
        setTimeout(() => {
            let valueArr = this.omniJsonData.selectedProducts.map((item) => item.productName);
            let isDuplicate = valueArr.some((item, idx) => valueArr.indexOf(item) != idx );
            this.omniApplyCallResp({duplicatedSamePlan: isDuplicate})
            console.log('NEW CONSOLE TEST');
            this.loadPOSAProducts();
        },250)
    }
    disconnectedCallback() {
        const stateData = {
            products: this.products,
            selectedCompareProducts: this.selectedCompareProducts,
            visibleProductsIndex: this.visibleProductsIndex,
            totalNumProducts: this.totalNumProducts,
            empSize: this.empSize,
            insuredType: this.insuredType,
            sizeType: this.rateValues.sizeType,
            userInputs: JSON.stringify(this.omniJsonData.userInputs)
        };
        this.omniSaveState(stateData, null, true);
        pubsub.unregister(this.rootChannel, this.pubsubPayload);
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
        const cartProducts = omniscriptUtils.getCartProducts(this);
        if (this.stateData && this.stateData.empSize === parseInt(this.rateValues.empSize) && 
                this.stateData.insuredType === this.rateValues.insuredType && 
                JSON.stringify(this.omniJsonData.userInputs) === this.stateData.userInputs && 
                this.stateData.products.filter(p => p.isSelected).length > 0 && 
                this.stateData.products.filter(p => p.isSelected).length === cartProducts.length) {
            this.parseSavedState(this.stateData);
        } else {
            this.getProducts();
            omniscriptUtils.updateCartProducts(this, [], this.rootChannel);

        }
        
        if (cartProducts.length === 0) {
            // Update the OS json to an empty array
            omniscriptUtils.updateCartProducts(this, [], this.rootChannel);
        }
        //Timeout to wait the update of cart products
        setTimeout(() => {
            this.cartProductCount();
            this.handleConfigButton();
        }, 1000);
    }
    cartProductCount() {
        const cartProducts = omniscriptUtils.getCartProducts(this);
        this.productCount = cartProducts.length;
    }
    parseSavedState(stateData) {
        this.products = stateData.products;
        this.selectedCompareProducts = stateData.selectedCompareProducts;
        this.visibleProductsIndex = stateData.visibleProductsIndex;
        this.totalNumProducts = stateData.totalNumProducts;
        this.empSize = stateData.empSize;
        this.insuredType = stateData.insuredType;
        this.filteredProducts = this.products;
        this.isLoaded = true;
        this.prepareSortCombo();
        this.populateInlineFilters(true);
        this.disableSortSelect = false;
    }
    handleConfigButton() {
        let parsedData = JSON.parse(JSON.stringify(this.omniJsonData));
        this.Quote_MarketSegment = parsedData.hasOwnProperty('Quote_MarketSegment') ? parsedData.Quote_MarketSegment : '';
        this.IsAcceptQuoteFlow = parsedData.hasOwnProperty('IsAcceptQuoteFlow') ? parsedData.IsAcceptQuoteFlow : '';
        console.log("Quote_MarketSegment::", JSON.stringify(this.Quote_MarketSegment));
        console.log("Quote_MarketSegment::", typeof this.IsAcceptQuoteFlow);
        if(this.IsAcceptQuoteFlow) {
            // if(this.Quote_MarketSegment && this.Quote_MarketSegment == 'Mid Sized Group') {
            //     this.showConfigButton = true;
            // } else {
            //     this.showConfigButton = false;
            // }
        } else {
            this.showConfigButton = true;
        }
    }

    loadPOSAProducts(){
        let PPOPlans = this.omniJsonData.selectedProducts.filter(ppoPlan => ppoPlan.QE_Product_Sub_Type__c == "PPO");
        let PPOPlansLength = PPOPlans.length;
        let finalPOSAProducts = [];
        let posasToKeep = [];  //Andrew vaughn: added
        console.log("PPOPLANS---------",PPOPlansLength);
        if(PPOPlansLength < 1 && this.omniJsonData.Quote_MarketSegment =="Mid Sized Group" && this.omniJsonData.FundingType =="Fully Insured"){
            let selectedProducts = this.omniJsonData.selectedProducts;
            let POSAProducts = this.omniJsonData.POSAProducts.records;
            if(POSAProducts != null){
            POSAProducts.forEach(POSAProduct =>{
                let newPOSAProduct = JSON.parse(JSON.stringify(POSAProduct));
                let POSAattrs = newPOSAProduct.attributeCategories.records.findIndex(at => at.Code__c === "Product_Attributes");;
                let POSAprodAttrs = newPOSAProduct.attributeCategories.records.find(at => at.Code__c === "Product_Attributes");
                let POSArxbeneIndex;
		        if(POSAprodAttrs && POSAprodAttrs.productAttributes && !!POSAprodAttrs.productAttributes.records){
		            POSArxbeneIndex = POSAprodAttrs.productAttributes.records.findIndex(pa => pa.code === "PrescriptionDrugCoverage");
                }
                let tempSelectedProduct = selectedProducts.filter(product => product.QE_POSA_Plan__c == POSAProduct.Id);
                console.log("tempSelectedProduct----------",tempSelectedProduct);
                tempSelectedProduct.forEach(tempProduct =>{
                    console.log("product--------",tempProduct);
                    let newPOSAProduct = JSON.parse(JSON.stringify(POSAProduct));
                    let attrs = tempProduct.attributeCategories.records;
                    let prodAttrs = attrs.find(at => at.Code__c === "Product_Attributes")
                    let rxbene;
                    if( prodAttrs && prodAttrs.productAttributes && !!prodAttrs.productAttributes.records){
                        rxbene = prodAttrs.productAttributes.records.find(pa => pa.code === "PrescriptionDrugCoverage");
                    }
                    newPOSAProduct.attributeCategories.records[POSAattrs].productAttributes.records[POSArxbeneIndex].userValues = rxbene.userValues;
                    newPOSAProduct.attributeCategories.records[POSAattrs].productAttributes.records[POSArxbeneIndex].displayValue = rxbene.displayValue;
                    
                    //Andrew Vaughn: added.
                    this.posaDetails.forEach(posa => {
                        if(posa.Product2Id == newPOSAProduct.Id) {
                            posasToKeep.push(posa);
                        }
                    });
                    
                    console.log("New POSA------------",newPOSAProduct);
                    finalPOSAProducts.push(newPOSAProduct);
                })
            })
        }
            //let finalPOSAProductsNode = [] ;
            //finalPOSAProductsNode.push(finalPOSAProducts);
            //console.log("final POSA list---------------",finalPOSAProductsNode);
            //this.omniApplyCallResp({duplicatedSamePlan: isDuplicate})
        }
        console.log("final POSA list---------------",finalPOSAProducts);
        this.omniApplyCallResp({finalPOSAProducts: finalPOSAProducts });
        this.omniApplyCallResp({posasToKeep: posasToKeep})// Andrew Vaughn: added
    }
}