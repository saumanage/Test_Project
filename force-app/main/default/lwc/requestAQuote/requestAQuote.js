import { LightningElement,track, api, wire } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import RequestAQuoteSR from '@salesforce/resourceUrl/RequestAQuoteSR';
import LEAD_OBJECT from '@salesforce/schema/Lead';
import { CurrentPageReference } from 'lightning/navigation';
import { RecordFieldDataType } from 'lightning/uiRecordApi';

export default class RequestQuote extends LightningElement {

    leadObject = LEAD_OBJECT;
    @track sectionHide = false;  
    @api recordId;
    @track brokersectionHide = false; 
    currentPageReference = null; 
    urlStateParameters = null;
    @track ReturnURL = null;

    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
       if (currentPageReference) {
          this.urlStateParameters = currentPageReference.state;
          this.ReturnURL = this.urlStateParameters.returnUrl?? null;
          console.log("Page: "+ JSON.stringify(currentPageReference) );
          console.log("State: "+ JSON.stringify(currentPageReference.state) );
       }
    }

    renderedCallback() {
        Promise.all([
            loadStyle(this, RequestAQuoteSR),
        ])
            .then(() => {
                console.log('WCS: Files loaded.');
            })
            .catch(error => {
                console.log('WCS: '+error.body.message);
            });
    }

    @api  utmCampaign;
    @api  utmSource;
    @api  utmMedium;

    /***GET MEthods */

    selectedState="VA";
    get stateOptions()
    {
        return [{"value":"AL","label":"AL"},{"value":"AK","label":"AK"},{"value":"AZ","label":"AZ"},{"value":"AR","label":"AR"},{"value":"CA","label":"CA"},{"value":"CO","label":"CO"},{"value":"CT","label":"CT"},{"value":"DE","label":"DE"},{"value":"DC","label":"DC"},{"value":"FL","label":"FL"},{"value":"FA","label":"FA"},{"value":"GA","label":"GA"},{"value":"HI","label":"HI"},{"value":"ID","label":"ID"},{"value":"IL","label":"IL"},{"value":"IN","label":"IN"},{"value":"IA","label":"IA"},{"value":"KS","label":"KS"},{"value":"KY","label":"KY"},{"value":"LA","label":"LA"},{"value":"ME","label":"ME"},{"value":"MD","label":"MD"},{"value":"MA","label":"MA"},{"value":"MI","label":"MI"},{"value":"MN","label":"MN"},{"value":"MS","label":"MS"},{"value":"MO","label":"MO"},{"value":"MT","label":"MT"},{"value":"NE","label":"NE"},{"value":"NV","label":"NV"},{"value":"NH","label":"NH"},{"value":"NJ","label":"NJ"},{"value":"NM","label":"NM"},{"value":"NY","label":"NY"},{"value":"NC","label":"NC"},{"value":"ND","label":"ND"},{"value":"OH","label":"OH"},{"value":"OK","label":"OK"},{"value":"OR","label":"OR"},{"value":"PA","label":"PA"},{"value":"RI","label":"RI"},{"value":"SC","label":"SC"},{"value":"SD","label":"SD"},{"value":"TN","label":"TN"},{"value":"TX","label":"TX"},{"value":"UT","label":"UT"},{"value":"VT","label":"VT"},{"value":"VA","label":"VA"},{"value":"WA","label":"WA"},{"value":"WV","label":"WV"},{"value":"WI","label":"WI"},{"value":"WY","label":"WY"}];
    }

    get getHasBroker()
    {
        return [
            {value: 'NO', label: 'NO', description: 'Does not currently have a broker'},
            {value: 'YES', label: 'YES', description: 'Currently has a broker'}
        ];
    }

    get getEmployes()
    {
        return [
            //{value: '1', label: '1'},
            {value: '1-4', label: '1-4'},
            //{value: '2-24', label: '2-24'},
            //{value: '25-50', label: '25-50'},
            {value: '5-50', label: '5-50'},
            //{value: '2-50', label: '5-50'},
            //{value: '51-100', label: '51-100'},
            //{value: '101-150', label: '101-150'},
            {value: '51-150', label: '51-150'},
            {value: '151+', label: '151+'},
        ];
    }

    get getRenewalMonths()
    {
        return [
            {value: 'No Current Health Plan', label: 'No Current Health Plan'},
            {value: 'January', label: 'January'},
            {value: 'February', label: 'February'},
            {value: 'March', label: 'March'},
            {value: 'April', label: 'April'},
            {value: 'May', label: 'May'},
            {value: 'June', label: 'June'},
            {value: 'July', label: 'July'},
            {value: 'August', label: 'August'},
            {value: 'September', label: 'September'},
            {value: 'October', label: 'October'},
            {value: 'November', label: 'November'},
            {value: 'December', label: 'December'},
        ];
    }
    /** END GET */

    handleSubmit(event)
    {
        event.preventDefault();
        // Get data from submitted form
        const fields = event.detail.fields;
        var fieldrecords ={};
        const fields2= this.template.querySelectorAll('lightning-input, lightning-combobox,select,input,textarea, lightning-textarea');
        console.log("fields2:" + JSON.stringify(fields2));
        console.log("fields:" + JSON.stringify(fields));
     
        const allValid = [
            ...this.template.querySelectorAll('lightning-input, lightning-combobox'),
        ].reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);

        if (allValid) {
            console.log('All form entries look valid. Ready to submit!');

            fields2.forEach(currentItem => {
                 fieldrecords[currentItem.name] = currentItem.value; //load field list and values
            });

            /** SET DEFAULT VALUES */
            fieldrecords['LeadSource']= 'Optima Health';
            //QUERY Values 
            if(this.urlStateParameters)
            {
                /* this.utmCampaign =this.urlStateParameters.utm_campaign?? "";
                this.utmMedium= this.urlStateParameters.utm_medium?? "";
                this.utmSource= this.urlStateParameters.utm_source?? "";*/
                
                fieldrecords["UTM_Campaign__c"] = this.urlStateParameters.utm_campaign?? "";
                fieldrecords["UTM_Medium__c"] = this.urlStateParameters.utm_medium?? "";
                fieldrecords["UTM_Source__c"] = this.urlStateParameters.utm_source?? "";
            }

            console.log("Recs:" + JSON.stringify(fieldrecords));
            this.template.querySelector('lightning-record-edit-form').submit(fieldrecords);
            console.log("handle Submit")
            this.sectionHide = true;
        } else {
            console.log('Please update the invalid form entries and try again.');
        }

        // You need to submit the form after modifications
    }

    handlePhoneChange(event){
        console.log("in handlePhoneChange");
        try{
            var phoneVal = event.target.value;
            console.log("phoneVal ::"+phoneVal);
            phoneVal = phoneVal.replace(/\D/g,"");
            console.log("phoneVal1 ::"+phoneVal);
            var formattedPhone = [];
            formattedPhone = phoneVal.split("");
            formattedPhone = formattedPhone.filter(word => word.trim().length > 0);
        
            var formattedPhoneStr ="";
            console.log("formattedPhone 11 ::"+formattedPhone);
            if(phoneVal){
                console.log('formattedPhone ::'+formattedPhone);
                if(formattedPhone[0] != "(")
                    formattedPhone.splice(0,0,"(");
                    console.log('formattedPhone 1::'+formattedPhone);
            
                if(phoneVal.length > 3){
                    formattedPhone.splice(4,0,") ");
                }
                if(phoneVal.length > 6){
                    formattedPhone.splice(8,0,"-");
                }
                if(phoneVal.length > 10){
                    formattedPhone.splice(13,0," Ext. ");
                }
                console.log("formattedPhone ::"+formattedPhone);
                formattedPhoneStr = formattedPhone.toString();
                formattedPhoneStr = formattedPhoneStr.replace(/,/g,"");
                console.log("formattedPhoneStr ::"+formattedPhoneStr);
                event.target.value = formattedPhoneStr;
            }
        }catch(err){
            console.log(err);
        }

        /*if(phoneVal){
            var phoneArr = phoneVal.split("");
            if(phoneArr.length > 0){
                var phoneStr = '';
                for(var index = 0 ; index < 16 ; index++){
                    if(index < phoneArr.length)
                        phoneStr += phoneArr[index];
                    else
                        phoneStr += '_';
                }
            }
            console.log("phoneStr ::"+phoneStr);
            if(phoneStr){
                phoneStr = phoneStr.splice(0,0,"(");
                console.log("phoneStr 2::"+phoneStr);
                phoneStr = phoneStr.splice(4,0,") ");
                console.log("phoneStr 3::"+phoneStr);
                phoneStr = phoneStr.splice(9,0,"-");
                console.log("phoneStr 4::"+phoneStr);
                phoneStr = phoneStr.splice(14,0," Ext. ");
                console.log("phoneStr 5::"+phoneStr);
            }
        }*/
    }

    healthinsurancehandleChange(evt) {
        if(evt.target.value=='YES'){
            this.brokersectionHide = true;
        }else{
            this.brokersectionHide = false;
        }
        //this.myValue = evt.target.value;
       // console.log('Currentue of the input: ' + evt.target.value);
    }

    handleSuccess(event)
    {
        const payload = event.detail;
        console.log("Success:" +  JSON.stringify(payload));
    }

    handleError(event)
    {
        const payload = event.detail;
        console.log("errors:" + JSON.stringify(payload));
    }

}