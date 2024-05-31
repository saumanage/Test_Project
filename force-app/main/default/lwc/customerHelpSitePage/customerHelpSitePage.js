import { LightningElement, wire, track } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import CASE_OBJECT from '@salesforce/schema/Case';
import HOSPITAL from '@salesforce/schema/Case.X1800_Facility__c'; 
import REGION from '@salesforce/schema/Case.X1800_Region__c';
import REPLY_TYPE from '@salesforce/schema/Case.X1800_Reply_Type__c';
import STATE from '@salesforce/schema/Case.X1800_State__c';
import VISIT_TIME from '@salesforce/schema/Case.X1800_Visit_Incident_Time__c';
import CONSENT from '@salesforce/schema/Case.X1800_Communication_Consent__c';
import FORM_FACTOR from "@salesforce/client/formFactor";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getUnassignedQueueRecord from '@salesforce/apex/X1800_CustomerHelpSitePageController.getUnassignedQueueRecord';
import getExistingAccountRecord from '@salesforce/apex/X1800_CustomerHelpSitePageController.getExistingAccountRecord';
import createCaseAndAccountRecord from '@salesforce/apex/X1800_CustomerHelpSitePageController.createCaseAndAccountRecord';
import sentaraLogo from '@salesforce/resourceUrl/Sentara_Logo';
import checkBoxLogo from '@salesforce/resourceUrl/Checkbox_Logo';


export default class CustomerHelpSitePage extends LightningElement {
        recordTypeId_1800;
        regionValues;
        selectedRegionValue;
        caseRecordToBeCreated ={};
        accountRecordToBecreated ={};
        showContactInformation = false;
        showPatientInformation = true;
        showIncidentInformation = false;
        sentaraMayContact = false;
        isPhRequired = false;
        isEmailRequired = false;
        iAmPatient = false;
        defaultIdentification;
        doNotContact = false;
        isEmailRequiredOnContact = false;
        isPhRequiredOnContact = false;
        onBehalfOfPatient = false;
        dontWantToProvideInfo = false;
        hospitalValues;
        stateValues;
        contactOptions;
        HospitalValueData;
        doesAccountExists = false;
        formDob;
        zipCode;
        showSpinner = false;
        phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
        emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        isValidPhone  = true;
        isValidEmail = true;
        isValidPatientPhone  = true;
        isValidPatientEmail = true;
        visitOptions;
        sentaraContactOption;
        disableSubmitButton = false;
        submitShowSuccess = false;
        createAccount = true;
        isPhoneLayout = false;
        sentaraLogoUrl;
        checkBoxLogoUrl;
        formattedDate;
        showPhoneLayout = false;
        monthError = false;
        dateError = false;
        identificationOptions =[{ label: 'I am the patient', value: 'I am the patient' },
                                { label: 'I am contacting on behalf of the patient', value: 'I am contacting on behalf of the patient' },
                                { label: 'I do not want to provide patient information', value: 'I do not want to provide patient information' }];

        handleInputChange(event){
                try{
                        if (event.target.label == 'First Name') {
                                this.accountRecordToBecreated.FirstName = event.target.value;
                        }
                        if (event.target.label == 'Middle Initial') {
                                this.accountRecordToBecreated.MiddleName = event.target.value;
                        }
                        if(event.target.label == 'Last Name'){
                                this.accountRecordToBecreated.LastName = event.target.value;
                        }
                        
                        if(event.target.label == 'Birth Date'){
                                this.accountRecordToBecreated.PersonBirthdate = event.target.value;   
                                this.formDob = event.target.value;
                        }
                        if(event.target.label == 'Phone Number'){
                                this.isValidPatientPhone = this.phoneRegex.test(event.target.value);                    
                                if(!event.target.value){this.isValidPatientPhone = true}
                                this.accountRecordToBecreated.PersonHomePhone = event.target.value;  
                                const x = event.target.value
                                        .replace(/\D+/g, '')
                                        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
                                event.target.value = 
                                        !x[2] ? x[1] : `(${x[1]}) ${x[2]}` + (x[3] ? `-${x[3]}` : ``);
                        }
                        if(event.target.label == 'Email'){
                                this.isValidPatientEmail = this.emailRegex.test(event.target.value);
                                if(!event.target.value){this.isValidPatientEmail = true}
                                this.accountRecordToBecreated.PersonEmail = event.target.value;  
                        }
                        if(event.target.label == 'Street Address'){
                                this.accountRecordToBecreated.PersonMailingStreet = event.target.value;  
                        }
                        if(event.target.label == 'City'){
                                this.accountRecordToBecreated.PersonMailingCity = event.target.value;  
                        }
                        if(event.target.label == 'State'){
                                this.accountRecordToBecreated.PersonMailingState = event.target.value;  
                        }
                        if(event.target.label == 'ZIP Code'){
                                this.accountRecordToBecreated.PersonMailingPostalCode = event.target.value;
                                this.zipCode = event.target.value;
                        }
                        if(event.target.label == 'Visit/Incident Date'){
                                this.caseRecordToBeCreated.X1800_Visit_Incident_Date__c = event.target.value;
                        }
                        if(event.target.name == 'Visit Time'){
                                this.caseRecordToBeCreated.X1800_Visit_Incident_Time__c = event.target.value;
                        }
                        if(event.target.name == 'Sentera may contact'){
                                this.caseRecordToBeCreated.X1800_Communication_Consent__c = event.target.value;
                        }
                        
                }catch(error){
                        console.log('error ==>' + error);
                }
        }
        handleInputChangeDate(event) {
                const inputValue = event.target.value;
                this.accountRecordToBecreated.PersonBirthdate = event.target.value;   
                this.formDob = event.target.value;
                const numericValue = inputValue.replace(/\D/g, '');
                const formattedValue = this.formatDate(numericValue);
                this.formattedDate = formattedValue;
        }
        hadleIdentificationOfCaller(event){
                if(event.target.value  == 'I am contacting on behalf of the patient'){
                        this.iAmPatient = false;
                        this.onBehalfOfPatient = true;
                        this.isEmailRequired = false;
                        this.isPhRequired = false; 
                        this.showContactInformation =  !this.doNotContact ? true : false;
                        this.showIncidentInformation = false;
                        this.showPatientInformation = true;
                        this.createAccount = true;
                }else if(event.target.value  == 'I do not want to provide patient information'){
                        this.showPatientInformation = false;
                        this.showIncidentInformation = true;
                        this.showContactInformation =  !this.doNotContact ? true : false;
                        this.iAmPatient = false;
                        this.dontWantToProvideInfo = true;
                        this.isEmailRequired = false;
                        this.isPhRequired = false; 
                        this.createAccount= false;
                }else{
                        this.onBehalfOfPatient = true;
                        this.iAmPatient = true;
                        this.showPatientInformation = true;
                        this.showContactInformation = false;
                        this.showIncidentInformation = false;
                        this.isEmailRequired = false;
                        this.isPhRequired = false; 
                        this.createAccount = true;
                }
        }

        handleReplyType(event){
                if(event.target.value == 'Do Not Contact'){
                        this.doNotContact = true;
                        this.showContactInformation = false;
                        this.sentaraMayContact = false;
                }else{
                        this.doNotContact = false;
                        this.showContactInformation = !this.iAmPatient ? true : false;
                        this.sentaraMayContact = true;
                }

                if(event.target.value == 'Phone'){
                        this.phoneRegex.test(event.target.value);
                        this.isPhRequired = this.iAmPatient || this.dontWantToProvideInfo ? true : false;
                        this.isEmailRequired = false;
                        this.isEmailRequiredOnContact = false;
                        this.isPhRequiredOnContact = this.onBehalfOfPatient ? true : false;
                }else if(event.target.value == 'Email'){
                        this.isEmailRequired = this.iAmPatient || this.dontWantToProvideInfo ? true : false;
                        this.isPhRequired = false;
                        this.isPhRequiredOnContact = false;
                        this.isEmailRequiredOnContact = this.onBehalfOfPatient ? true : false;
                }else if(event.target.value == 'Either Phone or Email'){
                        this.isEmailRequired =  this.iAmPatient || this.dontWantToProvideInfo ? true : false;
                        this.isPhRequired =  this.iAmPatient || this.dontWantToProvideInfo ? true : false;
                        this.isEmailRequiredOnContact = this.onBehalfOfPatient ? true : false;
                        this.isPhRequiredOnContact = this.onBehalfOfPatient ? true : false;
                }else{
                        this.isEmailRequired = false;
                        this.isPhRequired = false;  
                }
                if(event.target.value){
                        this.caseRecordToBeCreated.X1800_Reply_Type__c = event.target.value;
                }
                if(!this.showContactInformation){
                        this.isValidPhone = true;
                        this.isValidEmail = true;
                }
        }

        handleConcernInputChange(event){
                if(event.target.value){
                        this.caseRecordToBeCreated.X1800_Comments__c = event.target.value;
                }
        }
        handleConInfoInputChnage(event){
                if(event.target.label == 'Full Name'){
                        this.caseRecordToBeCreated.X1800_Callers_Name__c = event.target.value;
                }
                if(event.target.label == 'Phone'){
                        this.isValidPhone = this.phoneRegex.test(event.target.value);
                        if(!event.target.value){this.isValidPhone = true}
                        this.caseRecordToBeCreated.X1800_Call_Back_Number_for_Advocate__c = event.target.value;
                        const x = event.target.value
                                .replace(/\D+/g, '')
                                .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
                        event.target.value = 
                                !x[2] ? x[1] : `(${x[1]}) ${x[2]}` + (x[3] ? `-${x[3]}` : ``);
                }
                if(event.target.label == 'Email'){
                        this.isValidEmail = this.emailRegex.test(event.target.value);
                        if(!event.target.value){this.isValidEmail = true}
                        this.caseRecordToBeCreated.X1800_Incident_Reply_Email__c = event.target.value;
                }
        }

        handlerRegionInput(event){
                try{
                        let key = this.HospitalValueData.controllerValues[event.target.value];
                        this.hospitalValues = this.HospitalValueData.values.filter(opt => opt.validFor.includes(key))
                        this.caseRecordToBeCreated.X1800_Region__c = event.target.value;
                }catch(err){
                        console.log('error while region selection ==>'+ err);
                }
        }
        handlerFacilityInput(event){
                this.caseRecordToBeCreated.X1800_Facility__c = event.target.value;
        }

        handleSubmit(event){
                this.disableSubmitButton = true;
                this.showSpinner = true;
                var allValidInput = [...this.template.querySelectorAll("lightning-input")]
                .reduce((validSoFar, inputFields) => {
                    inputFields.reportValidity();
                    return validSoFar && inputFields.checkValidity();
                }, true);

                var allValidCombo = [...this.template.querySelectorAll("lightning-combobox")]
                .reduce((validSoFar, inputFields) => {
                    inputFields.reportValidity();
                    return validSoFar && inputFields.checkValidity();
                }, true);

                var allValidTextArea = [...this.template.querySelectorAll("lightning-textarea")]
                .reduce((validSoFar, inputFields) => {
                    inputFields.reportValidity();
                    return validSoFar && inputFields.checkValidity();
                }, true);

                if(!this.monthError && !this.dateError && allValidInput && allValidCombo && allValidTextArea && this.isValidPhone && this.isValidEmail && this.isValidPatientPhone && this.isValidPatientEmail){
                        getUnassignedQueueRecord({})
                        .then( queueRecord =>{
                                if(queueRecord){
                                        this.caseRecordToBeCreated.OwnerId = queueRecord.Id;
                                }
                        })
                        .catch( exception =>{
                                this.showSpinner = false;
                                console.log('exception ==>' + exception);
                        })

                        if(this.caseRecordToBeCreated && this.createAccount){
                                getExistingAccountRecord({
                                        firstName : this.accountRecordToBecreated.FirstName,
                                        lastName : this.accountRecordToBecreated.LastName,
                                        postalCode : this.zipCode,
                                        dOB : this.formDob,
                                        phNumber : this.accountRecordToBecreated.PersonHomePhone,
                                        isPhone : this.isPhoneLayout
                                })
                                .then(result=>{
                                        this.caseRecordToBeCreated.RecordTypeId = this.recordTypeId_1800;
                                        let returnedResult = JSON.parse(result);
                                        if(returnedResult && returnedResult.Id){
                                                this.caseRecordToBeCreated.AccountId = returnedResult.Id;
                                                this.createSobjects(JSON.stringify(this.caseRecordToBeCreated), null);
                                        }else{
                                                this.caseRecordToBeCreated.AccountId = null;
                                                this.createSobjects(JSON.stringify(this.caseRecordToBeCreated), JSON.stringify(this.accountRecordToBecreated));
                                        }                                     
                                })
                                .catch(error=>{
                                        this.disableSubmitButton = false;
                                        this.showSpinner = false;
                                })
                        }
                        else if(this.caseRecordToBeCreated && !this.createAccount){
                                this.caseRecordToBeCreated.RecordTypeId = this.recordTypeId_1800;
                                this.caseRecordToBeCreated.AccountId = null;
                                this.createSobjects(JSON.stringify(this.caseRecordToBeCreated), null);
                        }
                }else{
                        this.showSpinner = false;
                        this.disableSubmitButton = false;
                        this.showToastMessage("error","Error","Please review all the errors");
                }
        }

        createSobjects(caseRecord, accountRecord){
                createCaseAndAccountRecord({
                        serializedCaseRecord : caseRecord,
                        serializedAccountRecord : accountRecord,
                        isPhone : this.isPhoneLayout
                })
                .then(result=>{
                        if(result == 'Success'){
                                this.showToastMessage("success","Success","Case created Successfully !");
                                this.submitShowSuccess = true;
                        }else{
                                this.showToastMessage("error","Error",result);
                        }
                        setTimeout(() => {
                                this.showSpinner = false;
                                this.disableSubmitButton = false;
                        }, 700);
                })
                .catch(error=>{
                        this.disableSubmitButton = false;
                        this.showSpinner = false;
                })
        }

        showToastMessage( status, title, message){
                const event =  new ShowToastEvent({
                                        title: title,
                                        message: message,
                                        variant: status
                                })
                this.dispatchEvent(event);
        }

        @wire(getPicklistValues, { recordTypeId: '$recordTypeId_1800', fieldApiName:  REGION })
        RegionValues({error, data}){
                if(data){
                        this.regionValues = data.values;
                }
        };
        @wire(getPicklistValues, { recordTypeId: '$recordTypeId_1800', fieldApiName:  STATE })
        StateValues({error, data}){                  
                if(data){
                        this.stateValues = data.values;
                }
        };
        
        @wire(getPicklistValues, { recordTypeId: '$recordTypeId_1800', fieldApiName:  REPLY_TYPE })
        ReplyTypeValues({error, data}){
                if(data){
                        this.contactOptions = data.values;
                }
        };

        @wire(getPicklistValues, { recordTypeId: '$recordTypeId_1800', fieldApiName: HOSPITAL })
        HospitalValues({error, data}){
                if(data){
                        this.hospitalValues = data.values;
                        this.HospitalValueData = data;
                }
        };

        @wire(getPicklistValues, { recordTypeId: '$recordTypeId_1800', fieldApiName: VISIT_TIME })
        IncidentVisitValues({error, data}){
                if(data){
                        this.visitOptions = data.values;
                }
        };
        @wire(getPicklistValues, { recordTypeId: '$recordTypeId_1800', fieldApiName: CONSENT })
        ConsetValues({error, data}){
                if(data){
                        this.sentaraContactOption = data.values;
                }
        };
        
        @wire(getObjectInfo, { objectApiName: CASE_OBJECT })
        getobjectInfo(result) {
                if (result.data) {
                        const rtis = result.data.recordTypeInfos;
                        this.recordTypeId_1800 = Object.keys(rtis).find((rti) => rtis[rti].name === '1-800');
                }
        }
        
        connectedCallback() {
                this.sentaraLogoUrl = sentaraLogo;
                this.checkBoxLogoUrl = checkBoxLogo;
                if(FORM_FACTOR == 'Small'){
                        this.isPhoneLayout = true;
                }
        }
        handleUrlClick(){
                window.open('https://www.sentara.com/');
        }

        formatDate(input) {
                const parts = [];
                // Add MM
                if (input.length > 0) { 
                        this.monthError = input.slice(0, 2) > 12 ? true : false;
                        parts.push(input.slice(0, 2));
                }
                // Add DD
                if (input.length > 2) {
                        this.dateError = input.slice(2, 4) > 31 ? true : false;
                        parts.push(input.slice(2, 4));
                }
                // Add YYYY
                if (input.length > 4) {  
                        parts.push(input.slice(4, 8));
                }
                return parts.join('/');
        }
}