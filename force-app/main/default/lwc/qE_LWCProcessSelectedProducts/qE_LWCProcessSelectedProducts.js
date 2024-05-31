import { LightningElement, api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';
import { DebugSrv } from 'c/qE_LWCSharedUtil';
import { commonUtils, omniscriptUtils, dataFormatter } from 'vlocity_ins/insUtility';
const SPINNER_CLASS = "slds-spinner";
const MESSAGE_CLASS = "spinner-msg";

export default class QE_LWCProcessSelectedProducts extends  OmniscriptBaseMixin(LightningElement) {


    /********* CUSTOM SPINNER */

    isConnected;
    _size = "medium"; //Supports all the valid values of lightning:spinner,
    //but spinner message will be supported only for small, medium and large.
    _variant = "brand"; //Valid values: base, brand, inverse
    _message = "Loading...";
    _hideBackground = false;

    containerClass = "slds-spinner_container";
    spinnerClass;
    messageClass;

    @api
    set size(value) {
        this._size = value ? value : "medium";
        if (this.isConnected) this.init();
    }
    get size() {
        return this._size;
    }

    @api
    set variant(value) {
        this._variant = value ? value : "base";
    }
    get variant() {
        return this._variant;
    }

    @api
    set message(value) {
        this._message = value ? value : "Loading...";
        if (this.isConnected) this.init();
    }
    get message() {
        return this._message;
    }

    init() {
        //slds-grid slds-grid_vertical slds-grid_vertical-align-center slds-grid_align-center   //message Class
        this.containerClass += this._variant == "inverse" ? " slds-inverse_background" : "";
        this.spinnerClass = `${SPINNER_CLASS} ${SPINNER_CLASS}_${this._size} ${SPINNER_CLASS}_${this._variant}`;
        this.messageClass = `${MESSAGE_CLASS} ${MESSAGE_CLASS}_${this._size} slds-color_${this._variant}`;
        if (this._size == "xx-small" || this._size == "x-small") this.messageClass = "slds-hide";
    }

    /*** END CUSTOM SPINNER  */


    productAction; 
    @api quoteLineItemList;
    @api loadBatchSize; 
    productList= new Set();
    concurrentBatchRequest;
    productConfig;
    selectedProducts=[];
    prodMap  = new Map();
   // prodHistory  = new Map(); //Keep track of previous entities.
    isLoaded =false;
    connectedCallback() {
        this.concurrentBatchRequest = 5;
        
        this.init();
        this.isConnected = true;
         this.stepName = this.omniScriptHeaderDef.asName;

        this.loadBatchSize = this.loadBatchSize ?? 1;



        //process rates
        if (!this.message) {
            this.message = "Loading Previous selected plans";
        }

        
        this.getProductList();

        if(this.productList.size>0)
        {
            this.formatRemoteAction();
        

            this.getRatedProds();
        }else
        {
              this.isLoaded =true;
              this.omniNextStep();
        }

    }
  
    getProductList()
    {
         DebugSrv.IS_DEBUG() && console.log('ProductsList::' + JSON.stringify(this.quoteLineItemList) );
        if(this.quoteLineItemList && Array.isArray(this.quoteLineItemList) ){
            
            this.quoteLineItemList.forEach(item=>{
                
                if( item.ProductSubType!='POSA'){
                   
                    let pharmacyCode  = (item.PharmacyCode??'');
                    
                    if(pharmacyCode!='' ){
                        pharmacyCode = pharmacyCode.endsWith('A')? (pharmacyCode.substring(0, pharmacyCode.length-1 ) +'Z')  : pharmacyCode;
                    }

                    /*if(pharmacyCode !='' )
                    {
                        this.prodHistory.set( (item.Product2Id +pharmacyCode), {
                            PrimaryLOBCode: (item.PrimaryLOBCode??null),
                            SecondaryLOBCode: (item.SecondaryLOBCode??null),
                            PreviousQLI: (item.PreviousQLI??null)
                        }   );
                    }*/

                    if( this.prodMap.has(item.Product2Id) )
                    {
                            let rxIds = this.prodMap.get(item.Product2Id);
                            rxIds.push(pharmacyCode);
                            this.prodMap.set(item.Product2Id, rxIds);
                    }else
                    {
                        this.prodMap.set(item.Product2Id, [pharmacyCode]);
                    }

                    this.productList.add(item.Product2Id);
                }
                
            });

              DebugSrv.IS_DEBUG() && console.log('ProductsMap ::' + JSON.stringify( ...this.prodMap.values()) );
              DebugSrv.IS_DEBUG() && console.log('ProductsMapKey ::' + JSON.stringify( ...this.prodMap.keys()) );

            
        }
    }
        

    getRatedProds()
    {       //Array Of products//

            this.selectedProducts =[];

            const productIdBatches = this.groupProductIds([...this.productList]);
            const batchOperations = productIdBatches.map(productIds => {
            const batchDataMap = this.getRatedProductsDataMap(productIds);
                            return () => {
                                 return omniscriptUtils.omniGenericInvoke(this, batchDataMap).then(res => {
                                      
                                       const response = JSON.parse(res);
                                        
                                        let records;
                                        if (response.records) { // format from getRatedProducts
                                            records = response.records;
                                        } else if (response.result && response.result.listProducts) { // format from getRatedGroupProducts
                                            records = response.result.listProducts.records;
                                        }
                                        
                                        
                                        this.formatProducts(records);                                      
                                     
                                      //this.omniApplyCallResp({selectedProducts: selectedProducts });

                                     return res;
                                    });
                            };
                        });

     this.concurrentPromiseWithLimit(this.concurrentBatchRequest, batchOperations)
                            .then(() => {
                                //done get Rated;
                                 DebugSrv.IS_DEBUG() && console.log("SELected Products::" + JSON.stringify(this.selectedProducts ));
                                 this.omniApplyCallResp({selectedProducts: this.selectedProducts });     
                            })
                            .catch(error => commonUtils.showErrorToast.call(this, error))
                            .finally(() => {
                                    //Next Step 
                                    this.isLoaded =true;
                                    this.omniNextStep();
                            });

    }

     concurrentPromiseWithLimit(t, e) {
                const i = e.splice(t);
                const s = e;
                const r = [];
                let o = 0;
                return new Promise(t=>{
                    s.forEach(t=>{
                        const i = t();
                        r.push(i);
                        i.then(t=>{
                            e();
                            return t
                        }
                        )
                    }
                    );
                    
                    function e() {
                        if (o === i.length) {
                            t(Promise.all(r))
                        } else {
                            r.push(i[o]().then(t=>{
                                e();
                                return t
                            }
                            ));
                            o++
                        }
                    }
                }
                )
            }


    groupProductIds(prods) 
    {
                const e = [];
                let i = 0;
                while (i < prods.length) {
                    e.push(prods.slice(i, i + this.loadBatchSize));
                    i += this.loadBatchSize
                }
                return e
    }


    formatRemoteAction()
    {

        this.productConfig =  JSON.parse(JSON.stringify(this.omniJsonDef.propSetMap.productConfig || {}));

         this.productsAction = JSON.parse(JSON.stringify(this.omniJsonDef.propSetMap.productsAction || {}));
           this.productsAction.optionsMap = this.productsAction.optionsMap || {
                    omitEligibility: true,
                    ruleAttributeSetValue: false,
                    rootPricingOnly: true,
                    validateCoverageSelection: false,
                    evalOptionalCoverageRelationship: false
                };

        /* this.productsAction.inputMap = {
                    userInputs: this.ratingUserInputs
                };*/

    this.productsAction = omniscriptUtils.formatQuery(this.omniGetMergeField.bind(this), this.productsAction, "InsProductService", "getRatedProducts");
    }

    getRatedProductsDataMap(productIds)
    {
         let  e =  JSON.parse(JSON.stringify(this.productsAction));  
                /*e.optionsMap =    At(At({}, e.optionsMap), {}, {
                    products: t
                });*/
                e.optionsMap.products  =   JSON.parse(JSON.stringify(productIds));

         return e
        
    }

    addProductConfig(t) 
    {
                if (this.productConfig) {
                    const e = this.productConfig.fieldKeyName;
                    if (e) {
                        const i = t[e];
                        t.productConfig = this.productConfig.config[i]
                    }
                }
                t.productStep = this.stepName;
                t.placeholders = this.productConfig.placeholders;
                return t
        }

    formatProducts(prods) {
    //     rec.RxId = rxId;
     //rec.isSelected = true;


    if (prods && prods.length) {

        let t = this.checkRxId(prods);
        
        this.selectedProducts = this.selectedProducts.concat(t.map(t=>{
            
          let prod= dataFormatter.formatProduct(this.addProductConfig(t), { isProductSelection: true} );

        prod.isSelected =true;
        prod.ExistingProd=true;

        /*if( this.prodHistory.has(prod.RxId)  ) //check if they have the same RX ID
        {
            let prevData = this.prodHistory.get(prod.RxId);
            prod.PrimaryLOBCode = prevData.PrimaryLOBCode;
            prod.SecondaryLOBCode = prevData.SecondaryLOBCode;
            prod.PreviousQLI = prevData.PreviousQLI;
        }*/

        return prod;
        
         }));   
        }
    
    }

    checkRxId(prods)
    {
        let result =[];
     
            prods.forEach(prod=>{
                
                if( this.prodMap.has(prod.productId))
                {  
                     DebugSrv.IS_DEBUG() && console.log('Contains PROD:' +prod.productId );
                   let rxIds  = this.prodMap.get(prod.productId);
                    if( rxIds.length==1)
                    {       let  _prod  = JSON.parse(JSON.stringify(prod));
                            _prod.RxId = _prod.productId +rxIds[0];
                            this.setUserValues(_prod, rxIds[0]);
                            result.push(_prod);
                    }else
                    {
                        ///has multiple
                        rxIds.forEach( rxId=>{
                            let  _prod  = JSON.parse(JSON.stringify(prod));
                            _prod.RxId = _prod.productId +rxId;
                            this.setUserValues(_prod, rxId);
                            result.push(_prod);

                        });

                    }


                }
                else 
                {
                    result.push(JSON.parse(JSON.stringify(prod)) );
                }

            });
        

        return result;

    }

    

    setUserValues(selecRec, prescriptionCode){
        if(selecRec.attributeCategories){
                        let attrs = selecRec.attributeCategories?.records ?? [];
                        let prodAttrs = attrs.find(at => at.Code__c === "Product_Attributes")
                        let pdbene = prodAttrs.productAttributes.records.find(pd => pd.code === "PrescriptionDrugCoverage");
                        let pdbeneVal;
                        if (pdbene) {
                            pdbene.values.forEach( (pdVal)=> {
                                if (pdVal && pdVal.label && pdVal.value === (prescriptionCode ?? pdbene.userValues)) {
                                    //this.debug &&  DebugSrv.IS_DEBUG() && console.log("pdVal.value" + pdVal.value + " " + pdVal + " " + pdVal.label);
                                    pdbeneVal = pdVal.label;
                                }
                            });
                        }
                        selecRec.attributeCategories.records[0].productAttributes.records.forEach( (pAtts)=> {
                        // this.debug &&  DebugSrv.IS_DEBUG() && console.log('pAttspAtts',pAtts);
                            if (pAtts && pAtts.code === "PrescriptionDrugCoverage" && pdbeneVal) {
                                pAtts.displayValue= pdbeneVal;
                                if( prescriptionCode) pAtts.userValues = prescriptionCode;
                            }
                        });

                    }
    }
               



      
}