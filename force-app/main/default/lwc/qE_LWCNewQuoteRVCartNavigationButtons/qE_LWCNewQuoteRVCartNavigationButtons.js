import { LightningElement, api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';
import pubsub from 'vlocity_ins/pubsub';
import {DebugSrv} from 'c/qE_LWCSharedUtil';


export default class QE_LWCNewQuoteRVCartNavigationButtons extends OmniscriptBaseMixin(LightningElement) {


    @api showPreviousButton;
    @api chunk;
    @api nextLabel;
    @api stepProcess;

    selProds = [];
    NonOOAProductcount;
    OOAProductcount;

    pubsubPayload ={
        "ProcessReviewCart": this.nextButton.bind(this)
    };
    
    //root channel for pubsub  
    rootChannel = "QWE_NAV_REVIEWCART_01";

    get nextButtonLabel() {
        return this.nextLabel ?? "Next";
    }



    nextButton(evt) {

        try{
        
        if (evt) {
            //Not in plan selection Processs
            if( (this.stepProcess??'REVIEW_CART') == 'REVIEW_CART')
            {
                this.splitSelProds();

                if (this.omniJsonData.selProds) {
                    this.omniUpdateDataJson({ 'selProds': this.selProds, 'selProdCheck': true, 'NonOOAProductcount': this.NonOOAProductcount, 'OOAProductcount': this.OOAProductcount }, true);

                } else {
                    this.omniApplyCallResp({ 'selProds': this.selProds, 'selProdCheck': true, 'NonOOAProductcount': this.NonOOAProductcount, 'OOAProductcount': this.OOAProductcount });
                }

                
            }else if( (this.stepProcess??'REVIEW_CART') == 'PLAN_SELECTION')
            {
                        //In Plan selection Screen
                        //LOAD POSA PLANS For Midsize

                    
                    
                    let Quote_MarketSegment = this.omniJsonData['marketSegment'] ? this.omniJsonData['marketSegment'] : '';

                    if(Quote_MarketSegment && Quote_MarketSegment == 'Mid Sized Group')
                    {
                        this.loadPosaProductsGetRated();
                    }



            }

            //Goto Next step;
            this.omniNextStep();
        }

        }catch( err)
        {
            console.error(err);
        }

    
    }

    prevButton(evt) {
        if (evt) {
            this.omniPrevStep();
        }
    }

    connectedCallback() {
        this.showPreviousButton = this.showPreviousButton ?? true;
        pubsub.register(this.rootChannel, this.pubsubPayload);


    }
    disconnectedCallback() {
        try{
                pubsub.unregister(this.rootChannel, this.pubsubPayload);
        }catch(err)
        {

        }
    }

    splitSelProds() {

        let errCounter=1;
        if (this.omniJsonData['selectedProducts']) {

            this.selProds = []; //clear all elements

            //splice into chunks of 5
            //this.chunk = this.chunk??5;
            
            let chunkSet = 5;
            chunkSet = this.chunk ? Number(this.chunk) : 5;
            let temparray;

            let rec = Array.isArray(this.omniJsonData['selectedProducts']) ? this.omniJsonData['selectedProducts'] : [this.omniJsonData['selectedProducts']];
            
              let Quote_MarketSegment = this.omniJsonData['marketSegment'] ? this.omniJsonData['marketSegment'] : '';

            //merge POSA products with Selected Prodducts
            if( this.omniJsonData['finalPOSAProducts'] && Quote_MarketSegment == 'Mid Sized Group' )
            {
                
               let  finalPOSAProducts = Array.isArray(this.omniJsonData['finalPOSAProducts']) ? this.omniJsonData['finalPOSAProducts'] : [this.omniJsonData['finalPOSAProducts']];
              
                if(finalPOSAProducts.length > 0){
                    // rec.push(... finalPOSAProducts);

                    rec = rec.concat( finalPOSAProducts);
                }
                
                
            }

            let recs = (this.omniJsonData['isBenefitChange'] ?? false) ? rec.filter(item => {
                return (item.hasOwnProperty('ExistingProd') ? (item.ExistingProd == 'false' || item.ExistingProd == false) : true)
            }) : rec;

            let j = recs.length;


            for (let i = 0; i < j; i += chunkSet) {
                temparray = recs.slice(i, (i + chunkSet));

                //let temp =[]; 
                //temp.push(temparray);
                this.selProds.push({ 'prods': temparray });
            }



            this.NonOOAProductcount = recs.filter(item => item.SubType__c != "OOAPPO");
            this.OOAProductcount = recs.length - this.NonOOAProductcount.length;



        }

    }

/**
 * Function: loadPosaProductsGetRated
 * Purpose: Load accompanied POSA plans IDS for each HMO Plan
 * Author: Alrick
 */
    loadPosaProductsGetRated()
    {
        let POSA_Ids =[];
        //PPOPlans = this.products.filter(ppoPlan => ppoPlan.SubType__c == "PPO" || ppoPlan.QE_Product_Sub_Type__c == "PPO");
        //Get ALL POSA Plans
        
        
        if (this.omniJsonData['selectedProducts'])
        {
            
            let rec =Array.isArray(this.omniJsonData['selectedProducts']) ? this.omniJsonData['selectedProducts'] : [this.omniJsonData['selectedProducts']];
            
            let cartProducts = (this.omniJsonData['isBenefitChange'] ?? false) ? rec.filter(item => {
                return (item.hasOwnProperty('ExistingProd') ? (item.ExistingProd == 'false' || item.ExistingProd == false) : true)
            }) : rec;


                cartProducts.forEach((item)=> {
                        if( ((item.SubType__c??"INVALID") == "HMO" || (item.QE_Product_Sub_Type__c??"INVALID") == "HMO")  && item.QE_POSA_Plan__c)
                        {
                            if( !POSA_Ids.includes(item.QE_POSA_Plan__c)  )
                                POSA_Ids.push(item.QE_POSA_Plan__c);
                        }

                
                 });
          
            //Update Omniscripts          
            this.omniApplyCallResp({"POSA_IDS": POSA_Ids, 'POSA_CHECK': (POSA_Ids.length>0) });
            
        }

        
    }

 
    


}