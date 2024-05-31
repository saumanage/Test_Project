import { api } from 'lwc';
import insOsGridProductRow from 'vlocity_ins/insOsGridProductRow';
import temp from './qE_LWCInsOsGridProductRowOptima_tile.html';
import tempc from './qE_LWCInsOsGridProductRowOptima_compact.html';
import pubsub from 'vlocity_ins/pubsub';
import { omniscriptUtils, commonUtils } from 'vlocity_ins/insUtility';
import {DebugSrv} from 'c/qE_LWCSharedUtil';

export default class QE_LWCInsOsGridProductRow extends insOsGridProductRow {
    @api reviewCartOpened = false;
    @api showConfigButton;
    @api rateValues;


    get doBenefitChange()
    {


        return ( (this.product.ExistingProd??false)  && ( (this.rateValues.isBenefitChange??false)));
    }

    get isAlternatePlan()
    {
        return ( (this.product.QE_Alternate_Plan__c??false));
    }

    
    get displayRates() {
        if(!this.rateValues.isApprovedQuote &&  this.rateValues.insuredType === 'Fully Insured' && parseInt(this.rateValues.empSize ) > 50 && parseInt(this.rateValues.empSize ) <= 150){
            return  false;

        }else if(!this.rateValues.isApprovedQuote && this.rateValues.insuredType === 'BusinessEDGE' || this.rateValues.insuredType === 'Self Funded' || this.rateValues.insuredType === 'Level Funded'){
            return  false;
        }else if(this.rateValues.marketSegment && this.rateValues.marketSegment === 'Large Group'){
            return false;
        }
        else if(!this.rateValues.showRatesAcceptQuote && this.rateValues.insuredType === ''){
            return false;
        }
        else{
            return  true;

        }
    }
    get RxBenefits() {
         DebugSrv.IS_DEBUG() && console.log( 'Get RXBenefit Called');
        if(this.product && this.product.attributeCategories && !!this.product.attributeCategories.records ){
            let attrs = this.product.attributeCategories.records;
            let prodAttrs = attrs.find(at => at.Code__c === "Product_Attributes")
            if( prodAttrs && prodAttrs.productAttributes && !!prodAttrs.productAttributes.records){
                let rxbene = prodAttrs.productAttributes.records.find(pa => pa.code === "PrescriptionDrugCoverage")
                DebugSrv.IS_DEBUG() && console.log( 'Get RXBenefit:' + JSON.stringify(rxbene ));
                return  rxbene ? rxbene.displayValue : '';
            }else{
                return undefined
            }
        } else{
            return undefined;
        }
    }
    render() {
        return this.showProductTile ? temp : tempc;
    }


    connectedCallback() {
        this.showProductTile = this.showProductTile === 'true';
        this.tileButtonClasses = `${this.theme}-button_stretch ${this.theme}-button_stateful`;
        this.compactButtonClasses = `${this.theme}-m-left_small ${this.theme}-button_icon-border-filled`;
        this.config = this.product.productConfig;

    //Get Attribute Old Area



        this.updateDisplayValue(this.product);

           // Set the attributes to be displayed from the product
        this.parsedAttributes = this.getEligibleAttributes();
        DebugSrv.IS_DEBUG() && console.log('Parsed Attribute: ',this.parsedAttributes);
        
        DebugSrv.IS_DEBUG() && console.log('this product',JSON.stringify(this.product));
         DebugSrv.IS_DEBUG() && console.log('PRice this product',this.price);

        pubsub.register(this.rootChannel, this.pubsubPayload);

    }


    updateDisplayValue(prod)
    {


        let productFromConf = JSON.parse(JSON.stringify(prod));


        if(!this.product)
        {
            DebugSrv.IS_DEBUG() && console.log("NO PRODUCT TO process display value");
        }

       //Modified -Records Error
        if( !productFromConf.hasOwnProperty("attributeCategories") )
            return;

        if( !productFromConf.attributeCategories.hasOwnProperty("records")  )
        return;

           //Validation for PharmacyBenefits Plans
            let attrs = productFromConf && productFromConf.attributeCategories ? productFromConf.attributeCategories.records : null;
            let prodAttrs = attrs ? attrs.find(at => at.Code__c === "Product_Attributes") : null;
            let rxbene;
            let pdbene;
            let rxbeneVal;
            if( prodAttrs && prodAttrs.productAttributes && !!prodAttrs.productAttributes.records){
                rxbene = prodAttrs.productAttributes.records.find(pa => pa.code === "PrescriptionDrugCoverage")
                //pdbene = prodAttrs.productAttributes.records.find(pd => pd.code === "PrescriptionDrugCoverag")
                DebugSrv.IS_DEBUG() && console.log('PrescriptionDrugCoverage', rxbene ? JSON.stringify(rxbene) : rxbene)
                //DebugSrv.IS_DEBUG() && console.log('PrescriptionDrugCoverag', pdbene ? JSON.stringify(pdbene) : pdbene)
                if(rxbene){
                   // productFromConf.RxId = productFromConf.Id + rxbene.userValues;
                    rxbene.values.map(function (pdVal) {
                            if (pdVal && pdVal.label && pdVal.value === rxbene.userValues && (pdVal.label != rxbene.displayValue) ) {
                                DebugSrv.IS_DEBUG() && console.log("FIX Display:->pdVal.value" + pdVal.value + " " + pdVal + " " + pdVal.label);

                                rxbeneVal = pdVal.label;
                                //rxbene.displayValue = pdVal.label;
                            }
                        });



                }

                if(rxbeneVal)
                {
                    productFromConf.attributeCategories.records[0].productAttributes.records.map(function (pAtts) {
                            DebugSrv.IS_DEBUG() && console.log(' ROW pAttspAtts',pAtts);
                            if (pAtts && pAtts.code === "PrescriptionDrugCoverage" && rxbeneVal) {
                                pAtts.displayValue= rxbeneVal;
                            }
                        });

                        this.product = productFromConf;
                }

            }




    }


    HiglightSelectedProduct() {
        DebugSrv.IS_DEBUG() && console.log("ghjkl", this.labels);
        // DebugSrv.IS_DEBUG() && console.log("this.product", JSON.stringify(this.product));
        DebugSrv.IS_DEBUG() && console.log("this.product.isSelected", this.product.isSelected);
        // this.dispatchEvent(new CustomEvent('higlightproduct', { detail: { Id: this._product.Id, isSelected: this.product.isSelected} }));
    }
    selectProduct() {
        let flagIsSelected = this.product.isSelected === true;
        
    
        if( this.doBenefitChange)
            return; //Existing Product, do not allow to change.
      
        let tempDetail = {
            id: this._product.Id,
            isCart: this.isCart
        };
        if(this._product.productIdCart) {
            tempDetail["productIdCart"] = this._product.productIdCart;
        }
        pubsub.fire(this.rootChannel, 'selectProduct', { detail: tempDetail });
        if(flagIsSelected === false){
            commonUtils.showSuccessToast.call(this, 'Your plan successfully added to the cart.');

        }
    }

   
    
    addHoverState() 
    {
       if( this.doBenefitChange)
       {
           this.removeHoverState();
       }else
       {
            this.selectedIcon = "utility:close";
            this.selectedLabel = this.labels.Remove
        }
     }
    removeHoverState() {
        this.selectedIcon = "utility:check";
        this.selectedLabel = this.labels.AddedToCart
    }

    
    openSummaryofBenefits() {
        if( this.product.hasOwnProperty("QE_Summary_of_Benefits__c") && this.product.QE_Summary_of_Benefits__c) {
            window.open(this.product.QE_Summary_of_Benefits__c);
        }
    }
    get showEditAction() {
        DebugSrv.IS_DEBUG() && console.log("this.showConfigButton:::", this.showConfigButton);
        return this.showConfigInline !== 'true' && (!this.hiddenActions || !this.hiddenActions.includes('edit')) && this.showConfigButton ? true : false;
    }
    get showCartAction() {
        return this.showConfigInline !== 'true' && (!this.hiddenActions || !this.hiddenActions.includes('edit')) && this.showConfigButton ? false : true;
    }
}