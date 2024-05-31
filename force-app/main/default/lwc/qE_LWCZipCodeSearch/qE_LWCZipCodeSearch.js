import { LightningElement,api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';
import util from 'vlocity_ins/utility';
import templ from './qE_LWCZipCodeSearch.html';

export default class QE_LWCZipCodeSearch extends OmniscriptBaseMixin(LightningElement) {
    @api preZip;
    @api preCounty;
    @api isEditQuote;
    zipReadOnly=false;
    county;
    zipCode;
    ZipState;
    ZipCodeData;
    showStateError;
    parsedZipResult;
    countyList = [];
    zipCodeList = [];
    isCountyList =false;
    theme;
    isValidZipFound;
    isCountyEmptyConditionMet;
    isZipCodeConditionMet;
    requestInfo = {
        type : "Dataraptor",
        value : {
            bundleName : "QE_ZipCodeSearch",
            inputMap : "{}",
            optionsMap : "{}"
        } 
    };

    disconnectedCallback() {
        console.log('in disconnectedCallback');
        let mySaveState = {"county":this.county, "zipCode" : this.zipCode,"ZipState":this.ZipState,"showStateError":this.showStateError,"isCountyList" : this.isCountyList, "countyList": this.countyList,"isZipCodeConditionMet":this.isZipCodeConditionMet, "isCountyEmptyConditionMet" : this.isCountyEmptyConditionMet};
        let key = 'customLwcKey';
        let usePubSub = true;
        this.omniSaveState(mySaveState, key, usePubSub);
      }

    connectedCallback() {
        if(this.isEditQuote){
            this.zipReadOnly=true;
        }
        //this.isValidZipFound={isValidZipFound:false};
        //this.isZipCodeConditionMet={isZipCodeConditionMet:false};
        this.ZipCodeData = {
            "ZipRatingArea": "",
            "ZipId": "",
            "ZipCounty": "",
            "ZipCode": "",
            "ZipState":"",
            "showStateError":"",
            "isZipCodeConditionMet":false,
            "isCountyEmptyConditionMet":""
          }
        this.omniApplyCallResp(this.ZipCodeData);
        const dataOmniLayout = this.getAttribute('data-omni-layout');
        this.theme = dataOmniLayout === 'newport' ? "nds" : "slds";
        let key = 'customLwcKey';
        const state = this.omniGetSaveState(key);
        console.log('in connectedCallback',state);
        if(state)
        {
            console.log('in connectedCallback',state.zipCode);
            this.zipCode=state.zipCode;
            this.county=state.county;
            this.ZipState=state.ZipState;
            this.showStateError=state.showStateError;
            this.isCountyList=state.isCountyList;
            this.countyList=state.countyList;
            //this.isValidZipFound=state.isValidZipFound;
            this.isZipCodeConditionMet=state.isZipCodeConditionMet;
            this.isCountyEmptyConditionMet = state.isCountyEmptyConditionMet;
            this.fetchZipCode(this.zipCode);
        }
        console.log('preZip',this.preZip);
        if(this.preZip && this.preZip.length == 5)
        {
            //this.isZipCodeConditionMet={isZipCodeConditionMet:true};
            this.county=this.preCounty;
            this.isCountyEmptyConditionMet=true;
            this.fetchZipCode(this.preZip);
        }
        //this.omniApplyCallResp(this.isZipCodeConditionMet);
      }

    zipcodeSearch(event) {
        this.county='';
        this.countyList=[];
        console.log(event.target.value);
        if( event.target.value &&event.target.value.length>=5){

        
         this.fetchZipCode(event.target.value);
        }
        else
        {
            this.isZipCodeConditionMet={isZipCodeConditionMet:false};
            this.omniApplyCallResp(this.isZipCodeConditionMet);
        }
        // if(event.target.value.length == 5) {
        //     this.isZipCodeConditionMet={isZipCodeConditionMet:true};
          
        // }
        // else
        // {
        //     this.isZipCodeConditionMet={isZipCodeConditionMet:false};
        //     this.omniApplyCallResp(this.ZipCodeData);
        // }
        // this.omniApplyCallResp(this.isZipCodeConditionMet);
    }

    fetchZipCode(ZipValue)
    {
        this.requestInfo.value.inputMap = JSON.stringify({ZipCode : ZipValue});
            util.getDataHandler(JSON.stringify(this.requestInfo))
            .then(result => {
                this.parsedZipResult = JSON.parse(result);
                console.log('parsedResult11::::',this.parsedZipResult);
                if(this.parsedZipResult.length && this.parsedZipResult.length == 1) {
                    this.isCountyList= false;
                    //this.isZipCodeConditionMet={isZipCodeConditionMet:true};
                    this.ZipCodeData = this.parsedZipResult[0];
                    this.county = this.ZipCodeData.ZipCounty;
                    if(this.county) {
                        this.isCountyEmptyConditionMet = {isCountyEmptyConditionMet:true};
                    } else {
                        this.isCountyEmptyConditionMet = {isCountyEmptyConditionMet:false};
                    }
                    if(this.ZipCodeData.ZipCode && this.ZipCodeData.ZipCode.length ==5){
                        this.zipCode = this.ZipCodeData.ZipCode;
                    }
                    this.omniApplyCallResp(this.isCountyEmptyConditionMet);
                    this.ZipState = this.ZipCodeData.ZipState;
                    this.showStateError = this.ZipCodeData.showStateError;
                    this.isZipCodeConditionMet = this.ZipCodeData.isZipCodeConditionMet;
                    //this.isCountyEmptyConditionMet = this.ZipCodeData.isCountyEmptyConditionMet;
                    this.omniApplyCallResp(this.ZipCodeData);
                }
                else if(this.parsedZipResult.length && this.parsedZipResult.length > 1) {
                    this.countyList=[];
                    this.isZipCodeConditionMet={isZipCodeConditionMet:true};
                   
                    if(!this.isCountyEmptyConditionMet){
                    this.isCountyEmptyConditionMet = {isCountyEmptyConditionMet:false};
                    }
                    this.omniApplyCallResp(this.isCountyEmptyConditionMet);
                    this.omniApplyCallResp(this.isZipCodeConditionMet);
                    this.isCountyList= true;
                   // this.isZipCodeConditionMet={isZipCodeConditionMet:true};
                    console.log('parsedResult:::',this.parsedZipResult);
                    console.log('countyList:::',this.countyList);
                    this.parsedZipResult.forEach(temp =>{
                        this.countyList = [...this.countyList ,{value: temp.ZipCounty , label: temp.ZipCounty }];
                        this.zipCode = temp.ZipCode;
                        this.zipCodeList.push(temp.ZipCode);
                        //this.omniApplyCallResp(temp);
                    });
                    


                    if(this.county){
                    let zipCodeData = this.parsedZipResult.filter(item => item.ZipCounty ===  this.county);
                    this.omniApplyCallResp(zipCodeData[0]);
                    }
                }
                // else if( this.parsedZipResult.length == 0){
                //     this.isZipCodeConditionMet={isZipCodeConditionMet:false}
                // }
                // this.omniApplyCallResp(this.isZipCodeConditionMet); 
                
            });
    }

    countyValueChange(event)
    {
        let zipCodeData = this.parsedZipResult.filter(item => item.ZipCounty === event.target.value);
        this.county = event.target.value;
        if(zipCodeData.length == 1) {
            this.isCountyEmptyConditionMet = {isCountyEmptyConditionMet:true};
        } else {
            this.isCountyEmptyConditionMet = {isCountyEmptyConditionMet:false};
        }
        console.log('zipCodeData',zipCodeData);
        this.omniApplyCallResp(this.isCountyEmptyConditionMet);
        this.omniApplyCallResp(zipCodeData[0]);
    }

    render() {
        return templ;
    }
}