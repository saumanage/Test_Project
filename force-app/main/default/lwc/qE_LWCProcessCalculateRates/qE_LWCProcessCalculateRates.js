import { LightningElement, api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';
import pubsub from 'vlocity_ins/pubsub';
import { DebugSrv } from 'c/qE_LWCSharedUtil';
import { OmniscriptActionCommonUtil } from 'vlocity_ins/omniscriptActionUtils';

const SPINNER_CLASS = "slds-spinner";
const MESSAGE_CLASS = "spinner-msg";

export default class QE_LWCProcessCalculateRates extends OmniscriptBaseMixin(LightningElement) {


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


    @api members; //Get All members
    @api chunk;
    @api effectiveDate;
    @api isChiroBenefit;
    @api isMorbidityBenefit;
    @api planInput;
    @api isCompositeRating;
    @api memberInputList;
    @api finalAdjustedRatingFactor
    
    memberListCount = 0;
    recordCounter = 1;
    get recordProcessed() {
        return this._recordProcessed;
    }
    set recordProcessed(value) {
        this._recordProcessed = value;
        this.recordCounter = value + 1;

    }

    isLoaded = false;
    loadingMessage;

    params = {
        input: {
            "effectiveDate": this.effectiveDate,
            "MemberInput": {}

        },
        sClassName: "vlocity_ins.IntegrationProcedureService",
        sMethodName: "QEMedical_IPCalculateCompositeRates",
        options: {
            "queueableChainable": true
        }
    };




    connectedCallback() {
        this._actionUtil = new OmniscriptActionCommonUtil();
        this.init();
        this.isConnected = true;

        this.chunk = this.chunk ?? 2;



        //process rates
        if (!this.loadingMessage) {
            this.loadingMessage = "Calculating Rates";
        }

        if (this.members) {
            this.memberInputList =[];
            this.splitMembers();
        }
        

        DebugSrv.IS_DEBUG() && console.log("About to Process");
        this.processRates(null);
        DebugSrv.IS_DEBUG() && console.log("Done Process");
    }



    splitMembers() {
        if (!this.members) return;  //nothing to split

      
        let finalRate = parseFloat('0' + this.finalAdjustedRatingFactor);
        let recs = new Map();
        this.members.forEach(memb => {

            let member = JSON.parse(JSON.stringify(memb));
            let qli = member['qliId'] ?? null;

            
            
            if(this.isCompositeRating && this.isCompositeRating == true)
            {
                
                member.ESPRateFactor =(parseFloat('0' + member.ESPRateFactor) * finalRate);
                member.EKidRateFactor=(parseFloat('0' + member.EKidRateFactor) * finalRate);
                member.EKidsRateFactor=(parseFloat('0' + member.EKidsRateFactor) * finalRate);
                member.EERateFactor =(parseFloat('0' + member.EERateFactor) * finalRate);
                member.FAMRateFactor =(parseFloat('0' + member.FAMRateFactor) * finalRate);
                
            }
           


            if (recs.has(qli)) {
                let temp = recs.get(qli);
                temp.push(member);
                recs.set(qli, temp);
            } else {
                recs.set(qli, [member]);
            }


        });

        let j = 1;



        let temp = [];
        let counter = 1;
        for (let [key, value] of recs) {

            temp = temp.concat(Array.isArray(value) ? [...value] : [value]);


            if (j >= this.chunk || counter == recs.size) {
                this.memberInputList.push(temp);
                temp = [];

                j = 0;

            }
            counter++;
            j++;
        }


    }


    inputRecords = [];

    processRates(isAsync) {

        if (!this.memberInputList) return true;  //nothing to process

        this.recordProcessed = 0;
        this.memberListCount = this.memberInputList.length;


        if (isAsync == null || isAsync == undefined) {

            this.memberInputList.forEach(memberInput => {

                //process each member input
              
                
                let input = JSON.parse(JSON.stringify(this.params));
                input.input.MemberInput = JSON.parse(JSON.stringify(memberInput));
                input.input.effectiveDate = this.effectiveDate;
                this.inputRecords.push(input);
           




            });



            this.ipCaller2(this.inputRecords[0]);


        } else
            if (isAsync) {
                this.memberInputList.forEach(memberInput => {

                    //process each member input

                    let input = this.params;
                    input.input.MemberInput = memberInput.MemberInput;
                    input.input.effectiveDate = this.effectiveDate;
                    this.inputRecords.push(input);


                    this.ipCaller(input);


                });
            } else {

                var promisRecord = [];



                //async awit methond 


                let input = this.params;

                this.memberInputList.forEach(memberInput => {




                    input.input.MemberInput = memberInput.MemberInput;
                    input.input.effectiveDate = this.effectiveDate;
                    promisRecord.push(this._actionUtil.executeAction(input, null, this, null, null));

                    /* await this._actionUtil.executeAction( input,null, this, null, null )
                     .then((response)=>{                
                        DebugSrv.IS_DEBUG() &&  console.log("MMM::" + JSON.stringify(response));
                         
                          let result = response.result.IPResult;     
         
                         this.omniUpdateDataJson(result, false);
         
                     })
                     .catch((error)=> {
                             DebugSrv.IS_DEBUG() &&  console.log("AWAIT ERROR::" + error);
                     })
                     .finally( ()=>{
                         this.recordProcessed ++; 
                         if(this.recordProcessed == this.memberListCount )
                         {
                             this.isLoaded=true;
                             //Goto Next step;
                             this.omniNextStep();
                         }
         
                     })*/

                });

                promisRecord.forEach(async (element, index) => {
                    let result = await element;
                    DebugSrv.IS_DEBUG() && console.log("SEQ::" + index + "::" + JSON.stringify(result));
                    this.omniUpdateDataJson(result.IPResult, false);
                });


            }



        return false;
    }

    ipCaller(input) {

        this._actionUtil.executeAction(input, null, this, null, null)
            .then(response => {
                DebugSrv.IS_DEBUG() && console.log("YEPEEE");
                DebugSrv.IS_DEBUG() && console.log("OUT::" + JSON.stringify(response));
                let result = response.result.IPResult;



                this.omniUpdateDataJson(result, false);

                //this.omniApplyCallResp({ 'selProds': this.selProds, 'selProdCheck': true, 'NonOOAProductcount': this.NonOOAProductcount, 'OOAProductcount': this.OOAProductcount });


                //this.sendDataToDebugConsole(input, response, 'Success Calling');

            })
            .catch(error => {
                DebugSrv.IS_DEBUG() && console.log("NOEEEE:: " + SON.stringify(error));
                //  this.sendDataToDebugConsole(input, error, "Error IP Call");
            })
            .finally(
                () => {

                    this.recordProcessed++;
                    if (this.recordProcessed == this.memberListCount) {
                        this.isLoaded = true;
                        //Goto Next step;
                        this.omniNextStep();
                    }
                }
            );


    }



    ipCaller2(input) {

        let isSuccess =true;
        this._actionUtil.executeAction(input, null, this, null, null)
            .then(response => {
               
                DebugSrv.IS_DEBUG() && console.log("OUT::" + JSON.stringify(response));
                let result = response.result.IPResult;
                 isSuccess =("success" in result)? result.success :true;


                var resp = this.omniJsonData['CALC_MemberRatesCalculation'] ?? null;


                DebugSrv.IS_DEBUG() && console.log("IT WORKED : " + JSON.stringify(resp));
                if (resp == null) {
                 
                        this.omniApplyCallResp(result);
                 

                } else {
                    //combine them 
                     if( !isSuccess) //There was a failure
                     {
                            this.omniApplyCallResp({ 'success': isSuccess });
                    
                     }

                    if ((result.CALC_MemberRatesCalculation?.output ?? null) != null) {
                        resp.output.push(...result.CALC_MemberRatesCalculation.output);
                        
                       
                                            

                        this.omniApplyCallResp({ 'CALC_MemberRatesCalculation': resp });
                    }

                }



                //this.sendDataToDebugConsole(input, response, 'Success Calling');

            })
            .catch(error => {
                DebugSrv.IS_DEBUG() && console.log("NOEEEE:: " + JSON.stringify(error));
                //  this.sendDataToDebugConsole(input, error, "Error IP Call");
            })
            .finally(
                () => {

                    this.recordProcessed++;


                    if (this.recordProcessed == this.memberListCount || !isSuccess) {
                        this.isLoaded = true;
                        //Goto Next step;
                        this.omniNextStep();
                    } else {
                        this.ipCaller2(this.inputRecords[this.recordProcessed]);
                    }
                }
            );



    }



    sendDataToDebugConsole(params, resp, label) {
        let sendParams = JSON.parse(JSON.stringify(params));
        if (sendParams && sendParams.options) {
            let optionNode = JSON.parse(sendParams.options);
            delete optionNode.options;
            delete optionNode.input;
            sendParams.options = optionNode;
        }
        let sendResp = JSON.parse(JSON.stringify(resp));

        // for queueable support
        if (sendResp && sendResp.responseResult) {
            sendResp.responseResult = JSON.parse(sendResp.responseResult);
        }

        // dispatches action data to debug console
        const debugEvent = new CustomEvent('omniactiondebug', {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                params: sendParams,
                response: sendResp,
                element: { label: label },
            },
        });
        this.dispatchEvent(debugEvent);
    }



}