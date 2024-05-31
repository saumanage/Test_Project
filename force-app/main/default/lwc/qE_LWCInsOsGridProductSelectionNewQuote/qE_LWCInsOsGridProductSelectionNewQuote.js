import { api, track } from 'lwc';
import insOsProductSelectionOptima from 'vlocity_ins/insOsGridProductSelection';
import { OmniscriptBaseMixin } from "vlocity_ins/omniscriptBaseMixin";
import { commonUtils, dataFormatter, omniscriptUtils } from 'vlocity_ins/insUtility';
import util from "vlocity_ins/utility";
import pubsub from 'vlocity_ins/pubsub';
import {DebugSrv} from 'c/qE_LWCSharedUtil';


export default class QE_LWCInsOsGridProductSelection extends OmniscriptBaseMixin(insOsProductSelectionOptima) {
    showConfigButton = false;
    @api displayAllFilters = false;
    @api prodBatchSize = 0;
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
        this.debug && console.log(data)

    }
    @api
    get insuredType() {
        return this.rateValues.insuredType;
    }
    set insuredType(data) {
        this.rateValues.insuredType = data;
        this.debug && console.log(data)
    }
    @api
    get isApprovedQuote() {
        return this.rateValues.isApprovedQuote;
    }
    set isApprovedQuote(data) {
        this.rateValues.isApprovedQuote = data;
        this.debug && console.log(data)
    }
    @api
    get isEditClone() {
        return this.rateValues.isEditClone;
    }
    set isEditClone(data) {
        this.rateValues.isEditClone = data;
        this.debug && console.log(data)
    }

    @api
    get isBenefitChange()
    {
        return this.rateValues.isBenefitChange;
    }
    set isBenefitChange(data)
    {
        this.rateValues.isBenefitChange = data;
    }
    
    @api
    get marketSegment() {
        return this.rateValues.marketSegment;
    }
    set marketSegment(data) {
        this.rateValues.marketSegment = data;
    }

    @api
    get debug()
    {
         return DebugSrv.IS_DEBUG();
    }

    @api fireNextButton;
    @track rateValues = {
        empSize: 0,
        sizeType: '',
        insuredType: '',
        isApprovedQuote: false,
        isEditClone:false,
        marketSegment:'',
        isBenefitChange:false
    }
    // @api Quote_MarketSegment;
    IsAcceptQuoteFlow = false;
    uniqueKey() {
        return Math.random().toString(36).substring(7);
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
    handleAddCartProd(value) {

        //this.debug && console.log('handleAddCartProd value: ' + JSON.stringify(value));
        if(((parseInt(this.rateValues.empSize ) > 50 && parseInt(this.rateValues.empSize ) <= 150 ) || this.rateValues.insuredType === "Level Funded")){
            this.debug && console.log('handleAddCartProd');
            let productFromConfNew = { ...value.detail };
            let productFromConf = JSON.parse(JSON.stringify(productFromConfNew));
            omniscriptUtils.clearStateOnChange(this);
            const clickedProductId = productFromConf.Id;
            // let selectedProduct = this.products.find(p => p.Id === clickedProductId);
            // if (selectedProduct) {
            //     selectedProduct.isSelected = !selectedProduct.isSelected;
            //     productFromConf.isSelected = selectedProduct.isSelected;
                pubsub.fire(this.rootChannel, 'updateProduct', { product: productFromConf });
            // }
            //Validation for PharmacyBenefits Plans
            let attrs = productFromConf.attributeCategories.records;
            let prodAttrs = attrs.find(at => at.Code__c === "Product_Attributes")
            let rxbene;
            let pdbene;
            let rxbeneVal;
            if( prodAttrs && prodAttrs.productAttributes && !!prodAttrs.productAttributes.records){
                rxbene = prodAttrs.productAttributes.records.find(pa => pa.code === "PrescriptionDrugCoverage")
                //pdbene = prodAttrs.productAttributes.records.find(pd => pd.code === "PrescriptionDrugCoverag")
                this.debug && console.log('PrescriptionDrugCoverage', rxbene ? JSON.stringify(rxbene) : rxbene);
                //this.debug && console.log('PrescriptionDrugCoverag', pdbene ? JSON.stringify(pdbene) : pdbene)
                if(rxbene){
                    productFromConf.RxId = productFromConf.Id + rxbene.userValues;
                    rxbene.values.map(function (pdVal) {
                            if (pdVal && pdVal.label && pdVal.value === rxbene.userValues) {
                               // this.debug && console.log("pdVal.value" + pdVal.value + " " + pdVal + " " + pdVal.label);
                                rxbeneVal = pdVal.label;
                            }
                        });
                }


                //For POC Abhishek
                /*if(pdbene){
                   pdbene.values.map(function(pdVal){
                        if(pdVal && pdVal.label && pdVal.label === rxbene.userValues){
                            this.debug && console.log("pdVal.value"+pdVal.value+" "+pdVal + " "+pdVal.label);
                            pdbeneVal = pdVal.value;
                        }
                    });
                }*/
                this.debug && console.log("productFromConf"+productFromConf+ " " + value.detail);
                productFromConf.attributeCategories.records[0].productAttributes.records.map(function(pAtts)
                {
                    if(pAtts && pAtts.code === "PrescriptionDrugCoverage"){
                        pAtts.displayValue = rxbeneVal;
                        //this.debug && console.log("pAtts.displayValue: "+ pAtts.displayValue);
                    }
                });
            }


            productFromConf.productIdCart = this.uniqueKey();
            productFromConf.isSelected = true;
            let cartProducts = omniscriptUtils.getCartProducts(this);
            // let productIndex = cartProducts.findIndex(p => p.Id === clickedProductId);
            // productIndex === -1 ? cartProducts.push(productFromConf) : cartProducts.splice(productIndex, 1);
            cartProducts.push(productFromConf)
            omniscriptUtils.updateCartProducts(this, cartProducts, this.rootChannel);
            this.productCount = cartProducts.length;
            this.validateOOA();

        }else{

            super.handleAddCartProd(value);
        }
    }

    updateDisplayValue(prod, isRxId)
    {


        let productFromConf = JSON.parse(JSON.stringify(prod));


        if(!this.product)
        {
            this.debug && console.log("NO PRODUCT TO process display value");
        }

      if( !productFromConf.hasOwnProperty("attributeCategories") )
                return;

             if( !productFromConf.attributeCategories.hasOwnProperty("records")  )
                return;


           //Validation for PharmacyBenefits Plans
            let attrs = productFromConf.attributeCategories.records;
            let prodAttrs = attrs.find(at => at.Code__c === "Product_Attributes");
            let rxbene;
            let pdbene;
            let rxbeneVal;
            if( prodAttrs && prodAttrs.productAttributes && !!prodAttrs.productAttributes.records){
                rxbene = prodAttrs.productAttributes.records.find(pa => pa.code === "PrescriptionDrugCoverage")
                //pdbene = prodAttrs.productAttributes.records.find(pd => pd.code === "PrescriptionDrugCoverag")
                //this.debug && console.log('PrescriptionDrugCoverage', rxbene ? JSON.stringify(rxbene) : rxbene)
                //this.debug && console.log('PrescriptionDrugCoverag', pdbene ? JSON.stringify(pdbene) : pdbene)
                if(rxbene){
                    if(isRxId)
                        productFromConf.RxId = productFromConf.Id + rxbene.userValues;

                    rxbene.values.map(function (pdVal) {
                            if (pdVal && pdVal.label && pdVal.value === rxbene.userValues && (pdVal.label != rxbene.displayValue) ) {
                               // this.debug && console.log("FIX Display:->pdVal.value" + pdVal.value + " " + pdVal + " " + pdVal.label);

                                rxbeneVal = pdVal.label;
                                //rxbene.displayValue = pdVal.label;
                            }
                        });



                }

                if(rxbeneVal)
                {
                    productFromConf.attributeCategories.records[0].productAttributes.records.map(function (pAtts) {
                            //this.debug && console.log(' ROW pAttspAtts',pAtts);
                            if (pAtts && pAtts.code === "PrescriptionDrugCoverage" && rxbeneVal) {
                                pAtts.displayValue= rxbeneVal;
                            }
                        });

                        this.product = productFromConf;
                }

            }




    }

    selectProduct(e) {
        this.debug && console.log('selectProduct e: ' + JSON.stringify(e));

        if(((parseInt(this.rateValues.empSize ) > 50 && parseInt(this.rateValues.empSize ) <= 150 ) || this.rateValues.insuredType === "Level Funded")){
            this.debug && console.log('selectProduct')
            omniscriptUtils.clearStateOnChange(this);
            const clickedProductId = e.detail.id;
            const isCart = e.detail.isCart;
            const isCompare = e.detail.isCompare;
            let selectedProduct;
            if(!isCart){
                selectedProduct = JSON.parse(JSON.stringify(this.products.find(p => p.Id === clickedProductId)));
                selectedProduct.isSelected = true;
                selectedProduct.productIdCart = this.uniqueKey();
            }

            pubsub.fire(this.rootChannel, 'updateProduct', { product: selectedProduct });

            let cartProducts = omniscriptUtils.getCartProducts(this);
            if(isCart){
                const productIndex = cartProducts.findIndex(p => p.productIdCart === clickedProductId);
                cartProducts.splice(productIndex, 1);
            }else if(isCompare){
                const productIndex = cartProducts.findIndex(p => p.Id === clickedProductId);

                let attrs = selectedProduct.attributeCategories.records;
                let prodAttrs = attrs.find(at => at.Code__c === "Product_Attributes")
                let rxbene;
                if( prodAttrs && prodAttrs.productAttributes && !!prodAttrs.productAttributes.records){
                    rxbene = prodAttrs.productAttributes.records.find(pa => pa.code === "PrescriptionDrugCoverage")
                   // this.debug && console.log('PrescriptionDrugCoverage', rxbene ? JSON.stringify(rxbene) : rxbene)

                }
                let productConfIsSelectedIndex = cartProducts.findIndex(p => p.RxId === selectedProduct.Id + rxbene.userValues );

                if(productConfIsSelectedIndex < 0){
                    selectedProduct.RxId = selectedProduct.Id + rxbene.userValues;
                    cartProducts.push(selectedProduct);
                }else{
                    cartProducts.splice(productConfIsSelectedIndex, 1);
                }
            }else{
                cartProducts.push(selectedProduct);

            }
            omniscriptUtils.updateCartProducts(this, cartProducts, this.rootChannel);
            this.productCount = cartProducts.length;
            this.validateOOA();
        }else{
            super.selectProduct({detail: e.detail.id});
            this.validateOOA();
        }

    }
    validateOOA(){
        setTimeout(()=> {
            if(this.omniJsonData && this.omniJsonData.outOfAreaPlanRequired == true){
                let outOfAreaSelected = this.omniJsonData.selectedProducts && this.omniJsonData.selectedProducts.filter(p =>(p.QE_Out_of_Area__c=="Yes"||  p.Name.includes("OOA") ) ).length > 0;
                this.omniApplyCallResp({outOfAreaSelected})
            }
        },1000)
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
        if (typeof this.prodBatchSize === 'string') {
            this.prodBatchSize = parseInt(this.prodBatchSize, 10);
        }
        if( this.prodBatchSize && this.prodBatchSize >0 )
        {
            this.loadBatchSize = this.prodBatchSize; //loadBatchSize defaults to 10 in parent class
        }

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
        } else if(this.isEditClone) {
            this.getProducts();
        }
        else {
            this.getProducts();
            //omniscriptUtils.updateCartProducts(this, [], this.rootChannel);
        }

        if (cartProducts.length === 0) {
            // Update the OS json to an empty array
            omniscriptUtils.updateCartProducts(this, [], this.rootChannel);
        }else
        {
            this.validateOOA();

        }
        

        //Timeout to wait the update of cart products
        setTimeout(() => {
            this.cartProductCount();
            this.handleConfigButton();
        }, 1000);
        //this.debug && console.log('Connectedcallback compelete');
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 260) {
                this.removeClass();
            }
        });
    }
    removeClass()
    {   
        if( super.removeClass)
            super.removeClass();
    }

    
     isDirty =false;
     updateProductPricing()
     {
         if (this.isEditClone || (this.omniJsonData.selectedProducts && this.omniJsonData.selectedProducts.length > 0))
         {
            let newSelectedProds =[];
            let selectedProds = this.omniJsonData.selectedProducts;
             
            selectedProds.forEach( sProd=>{
             
                    let prod = this.products.filter(t=>t.productId== sProd.productId);
                    if( Array.isArray(prod) & prod.length>0)
                    {
                        prod =prod[0];
                    }
                
                if( prod!=null && prod!=undefined  ){
                    newSelectedProds.push(  JSON.parse(JSON.stringify(prod)));
                   
                }else
                {
                    
                      newSelectedProds.push(  JSON.parse(JSON.stringify(sProd)));
                }

                 });
                
                if( !this.isDirty &&  newSelectedProds.length>0)
                    {
                         this.isDirty=true;
                        this.omniApplyCallResp({selectedProducts: newSelectedProds });
                    }
           
                    
         }

     }

    updateDisplayValue()
    {

        this.debug && console.log( "PRODS FOUND:" + JSON.stringify(this.filteredProducts));

        if(!this.filteredProducts)
        {
            this.debug && console.log("NO PRODUCTS TO process display value");
        }

       this.filteredProducts.forEach((productFromConf) => { //Validation for PharmacyBenefits Plans


            if( !productFromConf.hasOwnProperty("attributeCategories") )
                return;

             if( !productFromConf.attributeCategories.hasOwnProperty("records")  )
                return;


            let attrs = productFromConf.attributeCategories.records;
            let prodAttrs = attrs.find(at => at.Code__c === "Product_Attributes");
            let rxbene;
            let pdbene;
            let rxbeneVal;
            if( prodAttrs && prodAttrs.productAttributes && !!prodAttrs.productAttributes.records){
                rxbene = prodAttrs.productAttributes.records.find(pa => pa.code === "PrescriptionDrugCoverage")
                //pdbene = prodAttrs.productAttributes.records.find(pd => pd.code === "PrescriptionDrugCoverag")
                //this.debug && console.log('PrescriptionDrugCoverage', rxbene ? JSON.stringify(rxbene) : rxbene)
                //this.debug && console.log('PrescriptionDrugCoverag', pdbene ? JSON.stringify(pdbene) : pdbene)
                if(rxbene){
                    productFromConf.RxId = productFromConf.Id + rxbene.userValues;
                    rxbene.values.map(function (pdVal) {
                            if (pdVal && pdVal.label && pdVal.value === rxbene.userValues && (rxbene.displayValue != pdVal.label)) {
                                this.debug && console.log("FIX Display:->pdVal.value" + pdVal.value + " " + pdVal + " " + pdVal.label);
                                rxbeneVal = pdVal.label;
                                rxbene.displayValue = pdVal.label;
                            }
                        });
                }

            }

       }); //Each Product


    }

    cartProductCount() {
        this.debug && console.log('cartProductCountcalled');
        const cartProducts = omniscriptUtils.getCartProducts(this);
        this.productCount = cartProducts.length;
        this.debug && console.log('cartProductCountcalled-after');
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
        this.debug && console.log("Quote_MarketSegment::", JSON.stringify(this.Quote_MarketSegment));
        this.debug && console.log("Quote_MarketSegment::", typeof this.IsAcceptQuoteFlow);
        if(this.IsAcceptQuoteFlow) {
            if(this.Quote_MarketSegment && this.Quote_MarketSegment == 'Mid Sized Group') {
                this.showConfigButton = true;
            } else {
                this.showConfigButton = false;
            }
        } else {
            this.showConfigButton = true;
        }
    }

    prevButton(evt) {
        if (evt) {
            this.omniPrevStep();
        }
    }

    nextButton(evt) {
        if (evt) {

            
            if( (this.fireNextButton??false) ){
            //Fire Event instead;
                pubsub.fire('QWE_NAV_REVIEWCART_01', 'ProcessReviewCart', {"evt":evt});
            }else
            {
                this.omniNextStep();
            }
        }
    }

    getProducts() {
        if (this.isEditClone || (this.omniJsonData.selectedProducts && this.omniJsonData.selectedProducts.length > 0)) {
            let selectedProductcartMap = new Map();
            
            let existingProductcartMap = new Map();
            if (this.omniJsonData.selectedProducts && this.omniJsonData.selectedProducts != undefined) {
                let selectedProducts = JSON.parse(JSON.stringify(this.omniJsonData.selectedProducts));
                selectedProducts.forEach((selecRec) => {
                    selectedProductcartMap.set(selecRec.productId, selecRec.RxId);  
                        //set existing Product
                    if (selecRec.ExistingProd &&  selecRec.ExistingProd ==="true")
                    {
                        
                        existingProductcartMap.set(selecRec.productId, true);
                    }
                });
            }
            
            /*if (this.omniJsonData.selectedProducts && this.omniJsonData.selectedProducts != undefined) {
                let selectedProducts = JSON.parse(JSON.stringify(this.omniJsonData.selectedProducts));

                
                selectedProducts.forEach((selecRec) => {
                    let attrs = selecRec.attributeCategories.records;
                    let prodAttrs = attrs.find(at => at.Code__c === "Product_Attributes")
                    let pdbene = prodAttrs.productAttributes.records.find(pd => pd.code === "PrescriptionDrugCoverage");
                    let pdbeneVal;
                    selectedProductcartMap.set(selecRec.productId, selecRec.RxId);
                    
                    //set existing Product
                    if (selecRec.ExistingProd &&  selecRec.ExistingProd ==="true")
                    {
                        
                        existingProductcartMap.set(selecRec.productId, true);
                    }

                    
                    if (pdbene) {
                        pdbene.values.map(function (pdVal) {
                            if (pdVal && pdVal.label && pdVal.value === pdbene.userValues) {
                                //this.debug && console.log("pdVal.value" + pdVal.value + " " + pdVal + " " + pdVal.label);
                                pdbeneVal = pdVal.label;
                            }
                        });
                    }
                    selecRec.attributeCategories.records[0].productAttributes.records.map(function (pAtts) {
                       // this.debug && console.log('pAttspAtts',pAtts);
                        if (pAtts && pAtts.code === "PrescriptionDrugCoverage") {
                            pAtts.displayValue= pdbeneVal;
                        }
                    });

               

                });
                
                 if (selectedProducts && selectedProducts.length) {
                     let t = selectedProducts;
                        selectedProducts = t.map(t=>dataFormatter.formatProduct(this.addProductConfig(t), {
                            isProductSelection: true
                        }));
                    }
                

                this.debug && console.log('this.omniJsonData.selectedProducts',JSON.stringify( selectedProducts));
                this.omniApplyCallResp({selectedProducts: selectedProducts });
            }*/
            this.products = [];
            this.disableSortSelect = true;
            this.reFormulateFilterString();
            this.initAction.optionsMap.filters = this.serviceFilterString;
            omniscriptUtils.omniGenericInvoke(this, this.initAction)
                .then(response => {
                    const eligibleProductsResponse = JSON.parse(response);
                    this.totalNumProducts = eligibleProductsResponse.totalNumProducts;
                    if (this.totalNumProducts > 0) {
                        const productIdBatches = this.groupProductIds(eligibleProductsResponse.products);
                        const batchOperations = productIdBatches.map(productIds => {
                            const batchDataMap = this.getRatedProductsDataMap(productIds);
                            return () => {
                                return omniscriptUtils.omniGenericInvoke(this, batchDataMap).then(res => {
                                    // Don't add data while cancelling product fetch
                                    if (!this.isCancelProductFetch) {
                                        const response = JSON.parse(res);
                                        //this.debug && console.log('RatedProducts: ', response);
                                        let records;
                                        if (response.records) { // format from getRatedProducts
                                            records = response.records;
                                        } else if (response.result && response.result.listProducts) { // format from getRatedGroupProducts
                                            records = response.result.listProducts.records;
                                        }

                                        //Custom code for edit/clone
                                        records.forEach((rec) => {
                                            if (selectedProductcartMap.has(rec.productId)) {
                                                rec.isSelected = true;
                                                rec.RxId = selectedProductcartMap.get(rec.productId);
                                            }
                                            //set existing products
                                            if( existingProductcartMap.has(rec.productId) )
                                            {
                                                
                                                rec.ExistingProd =true;
                                            }

                                       

                                        });

                                        this.formatProducts(records);
                                        this.debug && console.log(records);
                                    }
                                    return res;
                                });
                            };
                        });
                        

                        this.isProductsLoading = true;
                        this.concurrentPromiseWithLimit(this.concurrentBatchRequest, batchOperations)
                            .then(() => {
        
                                    //UPDATe SelectedProducts
                                    /*if( (this.omniJsonData.hasOwnProperty('quoteMarketSegment') ?  this.omniJsonData.quoteMarketSegment : '') ==='Small Group'   && this.rateValues.insuredType==='Fully Insured' )
                                        {
                                            this.updateProductPricing(); 
                                        }*/
                                // All products have loaded by this point
                                this.isProductsLoading = false;
                                this.disableSortSelect = false;
                                if (this.isCancelProductFetch) {
                                    this.isCancelProductFetch = false;
                                    this.applyServiceFilters();
                                }
                            })
                            .catch(error => commonUtils.showErrorToast.call(this, error))
                            .finally(() => this.isLoaded = true);
                    } else {
                        this.products = [];
                        this.filteredProducts = [];
                        this.prepareSortCombo();
                        this.populateInlineFilters(true);
                    }
                })
                .catch(error => {
                    commonUtils.showErrorToast.call(this, error);
                    this.totalNumProducts = 0;
                })
                .finally(() => this.isLoaded = true);

        }
        else {



                super.getProducts();



               // this.updateDisplayValue();


        }
    }


    prepareSortCombo() {
        this.debug && console.log('this.filteredProducts.length: ' + this.filteredProducts.length);
        this.debug && console.log('this.totalNumProducts: ' + this.totalNumProducts);
        if(this.totalNumProducts > 0 && this.filteredProducts.length == this.totalNumProducts) {
            this.debug && console.log('sorting');
            let isAsc = true;
            let attributeExists;
            const fieldKey = "QE_SF_Ordinal__c";
            //const fieldLabel = "SFOrdinal";
            if (this.products) {
                attributeExists = this.filteredProducts.some(product => product[fieldKey] != '');
                if (attributeExists){
                    /*

                    */
                    this.filteredProducts.sort(function (a, b) {
                        const aValues = parseInt(a[fieldKey], 10);
                        const bValues = parseInt(b[fieldKey], 10);
  						return isAsc ? aValues - bValues : bValues - aValues;
                    });
                    this.debug && console.log('sorted filtered products: ' + JSON.stringify(this.filteredProducts));
                   /* this.filteredProducts.forEach(p => {
                        this.debug && console.log('Name: ' + p.Name + '  SF Ordinal: ' + p.QE_SF_Ordinal__c);
                    });*/
                    //super.formatProducts(JSON.parse(JSON.stringify(this.filteredProducts)));
                    this.updateDisplayValue();
                }
            }
        }
    }


    removeClass() {
       this.debug && console.log('working fine');
    }

}