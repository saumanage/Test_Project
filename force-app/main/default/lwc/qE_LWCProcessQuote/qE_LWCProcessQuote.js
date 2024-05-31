import { LightningElement, api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';
import pubsub from 'vlocity_ins/pubsub';
import { DebugSrv } from 'c/qE_LWCSharedUtil';
import { OmniscriptActionCommonUtil } from 'vlocity_ins/omniscriptActionUtils';

const SPINNER_CLASS = "slds-spinner";
const MESSAGE_CLASS = "spinner-msg";

export default class QE_LWCProcessQuote extends OmniscriptBaseMixin(LightningElement) {
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
    
    isLoaded = false;
    @api quoteId; //Quote Id Information
    @api isBenefitChange; //Is Benefit Change
    @api quoteHeader;
    inputRecords =[];
    RecordCount =0;
    recordCounter =1;

    get recordProcessed() {
        return this._recordProcessed;
    }
    set recordProcessed(value) {
        this._recordProcessed = value;
        this.recordCounter = value + 1;

    }
    
     params = {
        input: {
            "selectedProductsMain": [],
            "Quote_HEAD": {},
            "isBenefitChange": false,
            "quoteId": ""

        },
        sClassName: "vlocity_ins.IntegrationProcedureService",
        sMethodName: "QE_IPQuoteLineItemAddition",
        options: {
            //"queueableChainable": true,
            "chainable": true
        }
    };
    connectedCallback() {
        this._actionUtil = new OmniscriptActionCommonUtil();
        this.message='Processing batch'
        this.init();
        this.isConnected = true;

        this.processQuote();



    }

    
    processQuote()
    {
        if( !this.omniJsonData['selProds'] ) return; //nothing to process

        let selProds = this.omniJsonData['selProds'];
        this.RecordCount = selProds.length;
        this.recordProcessed =0;

        let input  = JSON.parse(JSON.stringify(this.params));
        //input.input = JSON.parse(JSON.stringify(this.quoteHeader));            
        input.input.isBenefitChange = this.isBenefitChange;         
        input.input.quoteId = this.quoteId;
           
       
        DebugSrv.IS_DEBUG() &&console.log('BEFORE_TRAN::' + JSON.stringify(input) );

        selProds.forEach(currentItem => {
            if( this.recordProcessed==0)
            {
                  if( this.omniJsonData.QE_TransformSGQuoteJSON_HEAD?.smallGroupQuoteJson)
                  {
                    input.input.smallGroupQuoteJson = JSON.parse(JSON.stringify(this.omniJsonData.QE_TransformSGQuoteJSON_HEAD?.smallGroupQuoteJson));
                  }  
                //input.input = JSON.parse(JSON.stringify(this.quoteHeader));            
                input.input.isBenefitChange = this.isBenefitChange;         
                input.input.quoteId = this.quoteId;

            }
            //input.input.selectedProductsMain = JSON.parse(JSON.stringify( currentItem.prods));
            if( input.input.smallGroupQuoteJson)
            {
                input.input.smallGroupQuoteJson.productConfigurationDetail={
                    records:[]
                };
            }else
            {
                 input.input.smallGroupQuoteJson = {
                     productConfigurationDetail:{
                        records:[]
                    }
                };
            }

            input.input.smallGroupQuoteJson.productConfigurationDetail.records =  JSON.parse(JSON.stringify( this.TransformedProds( currentItem.prods)));
            // Check if edit Quote
            if(this.omniJsonData['editQuote'] && this.omniJsonData['editQuote'] ==true )
            {
                 if( input.input.smallGroupQuoteJson?.additionalFields?.OwnerId) 
                 {
                    delete  input.input.smallGroupQuoteJson.additionalFields.OwnerId;
                    
                 }
            }

           DebugSrv.IS_DEBUG() &&  console.log('TRANSFORMED::' + JSON.stringify(input) );
            this.inputRecords.push(JSON.parse(JSON.stringify(input)));
          
        });

        this.callIp(this.inputRecords[0]);


    }

    callIp(input)
    {

         let isSuccess =true;
        this._actionUtil.executeAction(input, null, this, null, null)
            .then(response => {
               
               DebugSrv.IS_DEBUG() && console.log('INPUT::' + JSON.stringify(input));
               
                DebugSrv.IS_DEBUG() && console.log("OUT::" + JSON.stringify(response));
                let result = response.result.IPResult;
                 isSuccess =("success" in result)? result.success :true;            
                

            })
            .catch(error => {
                DebugSrv.IS_DEBUG() && console.log("NOEEEE:: " + JSON.stringify(error));
                
            })
            .finally(
                () => {

                    this.recordProcessed++;


                    if (this.recordProcessed == this.RecordCount || !isSuccess) {
                        this.isLoaded = true;
                         if( !isSuccess) //There was a failure
                         {
                            this.omniApplyCallResp({ 'success': isSuccess });
                    
                         }

                        //Goto Next step;
                        this.omniNextStep();
                    } else {
                        this.callIp(this.inputRecords[this.recordProcessed]);
                    }
                }
            );

    }


    TransformedProds (prodList)
    {
        let prods  = Array.isArray(prodList) ? prodList : [prodList];
     

        let prods2 = prods.map((prodRec)=>{
            let prod  = JSON.parse(JSON.stringify(prodRec));
            let pharmacy =this.getPharmacyData(prod);
            let pharmacyCode  =  (pharmacy?.userValues??'');
            if(pharmacyCode!='')
            {
                let contractType  = this.omniJsonData?.GroupInformation?.PlanSelectionType;
                pharmacyCode = pharmacyCode.substring(0,12) + ( contractType =='Calendar'?'Z':'A');
            }
            prod.additionalFields ={
                QE_Pharmacy_Code__c  : pharmacyCode,
                QE_Pharmacy_DisplayValue__c  : (pharmacy?.displayValue??''),
                vlocity_ins__ItemName__c :  (prod?.Name  + ' '+  (pharmacy?.displayValue??'')).trim(),
                PrimaryLOBCode__c : (prod?.QE_Primary_LOB_Code__c??null),
                SecondaryLOBCode__c : (prod?.QE_Secondary_LOB_Code__c??null),
                QE_Is_Benefit_Change__c : this.isBenefitChange,
                QE_Pharmacy_Benefit__c  : (pharmacy?.displayValue??null)

            };
            
            this.processPreviousData(prod); //update with Previous information

            return prod;

        });
        

        return prods2;
        /*
        prods.forEach( prod=>{
            let pharmacy =this.getPharmacyData(prod);
            prod.additionalFields ={
                QE_Pharmacy_Code__c  : pharmacy?.userValues,
                QE_Pharmacy_DisplayValue__c  : pharmacy?.displayValue,
                vlocity_ins__ItemName__c : prod?.Name  + ' '+  pharmacy?.displayValue,
                PrimaryLOBCode__c : prod?.QE_Primary_LOB_Code__c,
                SecondaryLOBCode__c : prod?.QE_Secondary_LOB_Code__c,
                QE_Is_Benefit_Change__c : this.isBenefitChange,
                QE_Pharmacy_Benefit__c  : pharmacy?.displayValue

            };
            
           


        });*/



    }

    processPreviousData(prod)
    {
        if( this.omniJsonData.quoteLineItemList && Array.isArray(this.omniJsonData.quoteLineItemList) )
        {
            //existing items exist 

            let  prevItem  = this.omniJsonData.quoteLineItemList.find(
                qli=> qli.Product2Id == prod.Id && qli.PharmacyCode == prod.additionalFields.QE_Pharmacy_Code__c
            );

            if( !prevItem)
            {
                prevItem  = this.omniJsonData.quoteLineItemList.find(
                     qli=> qli.Product2Id == prod.Id 
                );
            }
            DebugSrv.IS_DEBUG() && console.log("Previous QLI:: " + JSON.stringify(prevItem));
            if( prevItem) 
            { 
                //previous item exist.
                prod.additionalFields.Previous_Year_Quote_Line_Item__c = (prevItem?.PreviousQLI??null);

                prod.additionalFields.PrimaryLOBCode__c = (prevItem.PrimaryLOBCode && prevItem.PrimaryLOBCode !="") ? prevItem?.PrimaryLOBCode :  prod.additionalFields?.PrimaryLOBCode__c;
                prod.additionalFields.SecondaryLOBCode__c = (prevItem.SecondaryLOBCode && prevItem.SecondaryLOBCode !="") ? prevItem?.SecondaryLOBCode :  prod.additionalFields?.SecondaryLOBCode__c;
                
              //  if( (prod.ExistingProd??false)==true)
               // {
                     prod.additionalFields.QE_Alternate_Plan__c = (prevItem?.AlternatePlan??false);
               // }


            }
        }

    }

    getPharmacyData(selecRec){

        
        if(selecRec.attributeCategories){ 
            let attrs = selecRec.attributeCategories?.records ?? []; 
            let prodAttrs = attrs.find(at => at.Code__c === "Product_Attributes"); 
            let pdbene = prodAttrs.productAttributes.records.find(pd => pd.code === "PrescriptionDrugCoverage"); 
            
             
             return pdbene;
            
             /*let pdbeneVal; 



           
            if (pdbene) 
            { 
                pdbene.values.forEach( (pdVal)=> { 
                if (pdVal && pdVal.label && pdVal.value === (prescriptionCode ?? pdbene.userValues)) 
                { 
                    //this.debug && DebugSrv.IS_DEBUG() && console.log("pdVal.value" + pdVal.value + " " + pdVal + " " + pdVal.label); 
                    pdbeneVal = pdVal.label;
                     } 
                }); 
            }

            selecRec.attributeCategories.records[0].productAttributes.records.forEach( (pAtts)=> { 
                // this.debug && DebugSrv.IS_DEBUG() && console.log('pAttspAtts',pAtts); 
                
                if (pAtts && pAtts.code === "PrescriptionDrugCoverage" && pdbeneVal) { 
                    pAtts.displayValue= pdbeneVal; if( prescriptionCode) pAtts.userValues = prescriptionCode; 
                    } 
                }); */
            } 

            return null;
    }
}