import { api, LightningElement, track } from 'lwc';
import { commonUtils, dataFormatter, omniscriptUtils } from 'vlocity_ins/insUtility';
import pubsub from 'vlocity_ins/pubsub';
import temp from './qE_LWCInsOsGridCartSummaryNewQuote.html'
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';
import {DebugSrv} from 'c/qE_LWCSharedUtil';

export default class QE_LWCInsOsGridCartSummary extends OmniscriptBaseMixin(LightningElement) {

    @api
    get empSize() {
        return this.rateValues.empSize;
    }
    set empSize(data) {
        this.rateValues.empSize = data;
        DebugSrv.IS_DEBUG() &&  console.log(data);

    }
    @api
    get insuredType() {
        return this.rateValues.insuredType;
    }
    set insuredType(data) {
        this.rateValues.insuredType = data;
        DebugSrv.IS_DEBUG() &&  console.log(data);
    }
    @api
    get isApprovedQuote() {
        return this.rateValues.isApprovedQuote;
    }
    set isApprovedQuote(data) {
        this.rateValues.isApprovedQuote = data;
        DebugSrv.IS_DEBUG() &&  console.log(data);
    }
    
    @api 
    get isBenefitChange()
    {
        return this.rateValues.isBenefitChange;
    }
    set isBenefitChange(data)
    {
        DebugSrv.IS_DEBUG() &&  console.log("LOG BENEFIT: "+ data);
        this.rateValues.isBenefitChange = data;
    }

    @track rateValues = {
        empSize: 0,
        insuredType: '',
        isApprovedQuote: false,
        isBenefitChange:false
    }
    @track cartProducts = [];
    @track productCount;

    reviewCartOpened = true;
    pubsubPayload = {
        updateCart: this.handleUpdateCart.bind(this),
        selectProduct: this.deleteProduct.bind(this)
    };

    // @api checkValidity() {
    //     return this.productCount > 0;
    // }
    connectedCallback() {
        // super.connectedCallback();
        const theme = this.getAttribute("data-omni-layout");
        this.theme = "newport" === theme ? "nds" : "slds";
        this.rootChannel = "ProductSelectionChannel-" + dataFormatter.uniqueKey();
        this.products = omniscriptUtils.getCartProducts(this) ? JSON.parse(JSON.stringify(omniscriptUtils.getCartProducts(this))) : [];
        this.productCount = this.products.length;
        pubsub.register(this.rootChannel, this.pubsubPayload);
        this.loadPOSAProducts();
    }
    loadPOSAProducts(){
        let PPOPlans = [];
        PPOPlans = this.products.filter(ppoPlan => ppoPlan.SubType__c == "PPO" || ppoPlan.QE_Product_Sub_Type__c == "PPO");
        //this.omniJsonData.selectedProducts
        let PPOPlansLength = PPOPlans.length;
        DebugSrv.IS_DEBUG() &&  console.log("PPOPLANS---------",PPOPlansLength);
         let finalPOSAProducts = [];

        if(this.omniJsonData.marketSegment =="Mid Sized Group" && this.omniJsonData.GroupInformation.InsuredType !="Level Funded" && PPOPlansLength < 1){
            let selectedProducts = this.products; //this.omniJsonData.selectedProducts;
            let POSAProducts = this.omniJsonData?.POSAProducts?.records??null;
           
            //let POSAProductsLength = POSAProducts.length;
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
                DebugSrv.IS_DEBUG() &&  console.log("tempSelectedProduct----------",tempSelectedProduct);
                tempSelectedProduct.forEach(tempProduct =>{
                    DebugSrv.IS_DEBUG() &&  console.log("product--------",tempProduct);
                    let newPOSAProduct = JSON.parse(JSON.stringify(POSAProduct));
                    let attrs = tempProduct.attributeCategories.records;
                    let prodAttrs = attrs.find(at => at.Code__c === "Product_Attributes")
                    let rxbene;
                    if( prodAttrs && prodAttrs.productAttributes && !!prodAttrs.productAttributes.records){
                        rxbene = prodAttrs.productAttributes.records.find(pa => pa.code === "PrescriptionDrugCoverage");
                    }
                    newPOSAProduct.attributeCategories.records[POSAattrs].productAttributes.records[POSArxbeneIndex].userValues = rxbene.userValues;
                    newPOSAProduct.attributeCategories.records[POSAattrs].productAttributes.records[POSArxbeneIndex].displayValue = rxbene.displayValue;
                    DebugSrv.IS_DEBUG() &&  console.log("New POSA------------",newPOSAProduct);
                    finalPOSAProducts.push(newPOSAProduct);
                })
            })
        }
            //let finalPOSAProductsNode = [] ;
            //finalPOSAProductsNode.push(finalPOSAProducts);
            //DebugSrv.IS_DEBUG() &&  console.log("final POSA list---------------",finalPOSAProductsNode);
           // DebugSrv.IS_DEBUG() &&  console.log("final POSA list---------------",finalPOSAProducts);
           // this.omniApplyCallResp({finalPOSAProducts: finalPOSAProducts });
            //this.omniApplyCallResp({duplicatedSamePlan: isDuplicate})

        }
        
        DebugSrv.IS_DEBUG() &&  console.log("final POSA list---------------",finalPOSAProducts);
        this.omniApplyCallResp({finalPOSAProducts: finalPOSAProducts });

    }
    disconnectedCallback() {
        pubsub.unregister(this.rootChannel, this.pubsubPayload);
       
    }
    handleUpdateCart(t) {
        this.omniNavigateTo(t)
    }
    deleteProduct(e) {
        // omniscriptUtils.clearStateOnChange(this);
        const clickedProductId = e.detail.id;
        let selectedProduct;
       const productIndex = !!e.detail.productIdCart ? this.products.findIndex(p => (p.Id === clickedProductId && p.productIdCart === e.detail.productIdCart)) :
        this.products.findIndex(p => p.Id === clickedProductId);
     //   const productIndex = this.products.findIndex(p => p.Id === clickedProductId);
        DebugSrv.IS_DEBUG() &&  console.log("productIndex -- ", productIndex);
         this.products.splice(productIndex, 1);

        omniscriptUtils.updateCartProducts(this, this.products, this.rootChannel)
        this.productCount = this.products.length;
        this.omniValidate();
        this.loadPOSAProducts();
        // this.productCount = cartProducts.length;

    }

    render() {
        return temp;
    }
}