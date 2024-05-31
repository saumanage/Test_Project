import { LightningElement, track, api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';
import templ from "./qE_LWCLifeEventEffectiveDate.html";
import pubsub from 'vlocity_ins/pubsub';
import util from "vlocity_ins/utility";

export default class QE_LWCLifeEventEffectiveDate extends OmniscriptBaseMixin(LightningElement) {

    @api userProfile;
    @track isReadOnly = true;
    @track value;
    @track selectedValue;
    @track showSelect = false;
    @track dateOptions = [];
    @track showDate = false;
    effectiveDateFormula; 
    eligibleDateToSelect;
    lifeEvent;
    benefitEventDate;
    contextId;
    modifyEffectiveDate;

    /*effectiveDateDRInfo = {
        type: "DataRaptor",
        value: {
            bundleName: "QE_DrUpdateEffectiveDate",
            inputMap: "{}",
            optionsMap: "{}"
        }
    };*/


    connectedCallback() {
        console.log('connectedCallback !!');
        pubsub.register('nwOsMsgBus',  { omniJsonUpdated : this.handleJsonUpdate.bind(this)});
    }

    handleJsonUpdate(){
        const self = this;
        setTimeout(function(){ 
            console.log('handleJsonUpdate '+JSON.stringify(self.omniJsonData));
            console.log('MarketSegment '+self.omniJsonData.MarketSegment);
            var marketSegment = self.omniJsonData.hasOwnProperty('MarketSegment') ? self.omniJsonData.MarketSegment : null;
            
            //self.omniJsonDataTemp = JSON.parse(JSON.stringify(self.omniJsonData));
            self.lifeEvent = self.omniJsonData.LifeEventChanges.LifeEvent;  
            self.benefitEventDate = self.omniJsonData.LifeEventChanges.BenefitEventDate;
            self.effectiveDateFormula = self.omniJsonData.LifeEventChanges.EffectiveDateFormula;
            self.eligibleDateToSelect = self.omniJsonData.LifeEventChanges.eligibleDateToSelect;
            self.contextId = self.omniJsonData.ContextId;
            self.modifyEffectiveDate = self.omniJsonData.modifyEffectiveDate;
            console.log('lifeEvent '+self.lifeEvent);
            console.log('benefitEventDate '+self.benefitEventDate);
            console.log('effectiveDateFormula '+self.effectiveDateFormula);
            console.log('eligibleDateToSelect '+self.eligibleDateToSelect);

            self.showDate = self.lifeEvent && self.benefitEventDate && self.lifeEvent != 'Employee termination' && self.lifeEvent != 'Death of Subscriber' && self.lifeEvent != 'Termination of all coverage' && self.lifeEvent != 'Employment Status Change' && self.lifeEvent != 'Retirement' ? true :false;
            if( self.lifeEvent && self.benefitEventDate && self.omniJsonData ){
                
                if(self.modifyEffectiveDate == true){
                    self.isReadOnly = false;
                }
                else {
                
                    if( self.userProfile == 'System Administrator' || self.userProfile == 'Base Profile'
                            || ( self.userProfile == 'Benefit Admin' && ( self.lifeEvent == 'Death of Subscriber' || self.lifeEvent == 'Marriage' ) )
                            || ( self.userProfile == 'Broker' && ( self.lifeEvent == 'Death of Subscriber' || self.lifeEvent == 'Marriage' ) )
                        ){
                            self.isReadOnly = false;
                    }else {
                        self.isReadOnly = true;
                    }   

                    if( marketSegment && marketSegment == 'Large Group' && self.lifeEvent == 'Court Order' ) {
                        self.isReadOnly = false;
                    } 
                }               
                console.log('effectiveDateFormula : '+self.effectiveDateFormula);
                console.log('eligibleDateToSelect : '+self.eligibleDateToSelect);
                self.showSelect = (self.lifeEvent == 'Death of Subscriber' || self.lifeEvent == 'Marriage') && !self.modifyEffectiveDate;
                self.effectiveDateFormulatemp  = (self.lifeEvent == 'Adoption' || self.lifeEvent == 'COBRA' ||  self.lifeEvent == 'Birth' ||  self.lifeEvent == 'Death of Subscriber' ||  self.lifeEvent == 'Marriage' || self.lifeEvent == 'Death of Dependent') ? self.benefitEventDate : self.eligibleDateToSelect;
                self.effectiveDateFormulatemp =  (self.lifeEvent =='Loss of other coverage') ? self.effectiveDateFormula  : self.effectiveDateFormulatemp; 
                console.log('eligibleDateToSelect : '+self.effectiveDateFormulatemp);
                self.value = self.effectiveDateFormulatemp;
                console.log('value : '+self.value);
                //self.omniApplyCallResp({ EffectiveDate: self.value });
                self.omniUpdateDataJson({ EffectiveDate: self.value });
                console.log('effectiveDateFormulatemp :: '+self.effectiveDateFormulatemp);

                
                let effectiveDateDMY = self.effectiveDateFormulatemp.split('-');
                let eligibleDateDMY = self.eligibleDateToSelect.split('-');

                if(self.lifeEvent == 'Marriage') {
                    self.selectedValue = self.eligibleDateToSelect;
                }
                self.dateOptions = [];
                console.log('showSelect : '+self.showSelect);
                if( self.showSelect ){
                   
                        self.dateOptions.push({
                            value : self.effectiveDateFormulatemp,
                            label : effectiveDateDMY[1]+'/'+effectiveDateDMY[2]+'/'+effectiveDateDMY[0]
                        });
                        self.dateOptions.push({
                            value : self.eligibleDateToSelect,
                            label : eligibleDateDMY[1]+'/'+eligibleDateDMY[2]+'/'+eligibleDateDMY[0]
                        });
                    
                   console.log('dateOptions STR : '+JSON.stringify(self.dateOptions));
                   console.log('dateOptions  : '+self.dateOptions);
                }
                //self.updateEffectiveDate(self.effectiveDateFormula);
            }
        }, 100);
    }

    /*updateEffectiveDate(effectiveDatevalue) {
        console.log('updateEffectiveDate :: '+effectiveDatevalue);
        this.effectiveDateDRInfo.value.inputMap = JSON.stringify({ ContextId: this.contextId, EffectiveDate: effectiveDatevalue });

        util.getDataHandler(JSON.stringify(this.effectiveDateDRInfo))
            .then(result => {
                console.log('effectiveDateDRInfo Updated!!');
            }).catch(failureCallback => {
                console.error('Inside catch block..1', failureCallback);
            });
    }*/

    changeDate(event) {
        console.log(event.target.value)
        this.value = event.target.value;
        //this.updateEffectiveDate(this.value);
        //this.omniApplyCallResp({ EffectiveDate: this.value });
        this.omniUpdateDataJson({ EffectiveDate: this.value });
    }

    handleChange(event) {
        this.value = event.detail.value;
        this.selectedValue = event.detail.value;
        //this.updateEffectiveDate(this.value);
        //this.omniApplyCallResp({ EffectiveDate: this.value });
        this.omniUpdateDataJson({ EffectiveDate: this.value });
    }

    render() {
        return templ;
    }
}