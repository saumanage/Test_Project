import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';
import sentaraLogo from '@salesforce/resourceUrl/Sentara_Logo';
import checkBoxLogo from '@salesforce/resourceUrl/Checkbox_Logo';
import updateCaseRecord from '@salesforce/apex/X1800_AdvocateCaseViewController.updateCaseRecord';
import getCaseRecordVales from '@salesforce/apex/X1800_AdvocateCaseViewController.getCaseRecordVales';
import showUploadedDocuments from '@salesforce/apex/X1800_AdvocateCaseViewController.showUploadedDocuments';
import FORM_FACTOR from "@salesforce/client/formFactor";
//communityPath added by SFDC team
import communityPath from '@salesforce/community/basePath'; 

const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
export default class AdvocateCaseViewPage extends LightningElement {
    @api recordId;
    caseRecord;
    showNotes = false;
    showSpinner= false;
    caseRecordToBeUpdated ={};
    toCloseCase = false;
    coOrdinatorIsChecked = false;
    isNameNetworkChanged = false;
    caseMessages;
    sentaraLogoUrl;
    isPhoneLayout = false;
    currentPage;
    caseData={};
    checkBoxLogoUrl;
    submitShowSuccess = false;
    @track imageUrls=[];
    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference) {
        this.currentPage = currentPageReference;
            if(currentPageReference && currentPageReference.attributes){
                this.recordId = currentPageReference.attributes.recordId;
            }
        }
    }

    handleInputChange(event){
        if(event.target.label == 'Name/Network ID'){
            this.caseRecordToBeUpdated.X1800_PA_With_Ownership__c = event.target.value;
            this.isNameNetworkChanged = true;
            this.caseRecordToBeUpdated.markCaseClosed = false;
            this.toCloseCase = false;
        }

        if(event.target.value == 'Are you coordinating the response, or forwarding it to the appropriate Person(s)?'){
            this.caseRecordToBeUpdated.markCaseClosed = true;
            this.toCloseCase = true;
            this.showNotes = false;
            this.caseRecordToBeUpdated.X1800_Messages__c = null;
            this.caseRecordToBeUpdated.X1800_Ownership_Acknowledgement__c = event.target.checked ? true : false;
        }

        if(event.target.value == 'Return to 1-800'){
            this.showNotes = true;
            this.toCloseCase = false;
            this.caseRecordToBeUpdated.markCaseClosed = false;
        }
    }

    handleNotesInputChange(event){
        if(event.target.value){
            this.caseRecordToBeUpdated.X1800_Messages__c = event.target.value;
        }
    }

    handleSubmit(event){
        this.showSpinner = true;
        this.caseRecordToBeUpdated.Id = this.recordId;  

        if(!this.caseRecordToBeUpdated.X1800_PA_With_Ownership__c && this.isNameNetworkChanged || (!this.caseGetNetworkId && !this.isNameNetworkChanged )){
            this.showToastMessage("error","Error","Name/Network is mandatory");
            this.showSpinner = false;
            return;
        }

        var allValidTextArea = [...this.template.querySelectorAll("lightning-textarea")]
        .reduce((validSoFar, inputFields) => {
            inputFields.reportValidity();
            return validSoFar && inputFields.checkValidity();
        }, true);

        var allValidRadioGroup = [...this.template.querySelectorAll("lightning-radio-group")]
        .reduce((validSoFar, inputFields) => {
            inputFields.reportValidity();
            return validSoFar && inputFields.checkValidity();
        }, true);

        if(!allValidTextArea || !allValidRadioGroup){
            this.showToastMessage("error","Error","Please review all the errors");
            this.showSpinner = false;
            return;
        }

        updateCaseRecord({ 
            serializedCaseRecord : JSON.stringify(this.caseRecordToBeUpdated),
            solveCase : this.toCloseCase
        })
        .then( result =>{
            if(result == 'Success'){
                this.showToastMessage("success","Success", this.toCloseCase ? "Thank you for updating the case!" :  "Case has been routed back to 1-800 Team!");
                this.submitShowSuccess = true;
            }else{
                this.showToastMessage("error","Error",result);
            }
            this.showSpinner = false;
        })
        .catch( error => {
            this.showSpinner = false;
            console.log('exception ==>' + JSON.stringify(error));
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
    get getVisitIncidentsDate(){
        //return new Intl.DateTimeFormat('en-US', options).format(new Date(this.caseData && this.caseData.X1800_Visit_Incident_Date__c ? this.caseData.X1800_Visit_Incident_Date__c : null));
        if(this.caseData && this.caseData.X1800_Visit_Incident_Date__c){
            const dateComponents = this.caseData.X1800_Visit_Incident_Date__c.split('-');
            const year = dateComponents[0];
            const month = dateComponents[1];
            const day = dateComponents[2];
            const formattedDate = `${month}/${day}/${year}`;
            return formattedDate;
        }
        return null;
    }

    get getVisitIncidentTime(){
        return this.caseData && this.caseData.X1800_Visit_Incident_Time__c ?  this.caseData.X1800_Visit_Incident_Time__c : null;
    }

    get getComments(){
        return this.caseData && this.caseData.X1800_Comments__c ?  this.caseData.X1800_Comments__c : null;
    }

    get getChannel(){
        return this.caseData && this.caseData.X1800_Channel__c ?  this.caseData.X1800_Channel__c : null;
    }

    get getSubject(){
        return this.caseData && this.caseData.X1800_Subject__c ?  this.caseData.X1800_Subject__c : null;
    }
    get getStatus(){
        return this.caseData && this.caseData.Status ?  this.caseData.Status : null;
    }
    get getFacility(){
        return this.caseData && this.caseData.X1800_Facility__c ?  this.caseData.X1800_Facility__c : null;
    }

    get contactsCallBackNumber(){
        return this.caseData && this.caseData.X1800_Call_Back_Number_for_Advocate__c ?  this.caseData.X1800_Call_Back_Number_for_Advocate__c : null;
    }

    get contactsReplyEmail(){
        return this.caseData && this.caseData.X1800_Incident_Reply_Email__c ?  this.caseData.X1800_Incident_Reply_Email__c : null;
    }

    get caseRegion(){
        return this.caseData && this.caseData.X1800_Region__c ?  this.caseData.X1800_Region__c : null;
    }
    
    get caseCallType(){
        return this.caseData && this.caseData.X1800_Patient_Promise_Type__c ?  this.caseData.X1800_Patient_Promise_Type__c : null;
    }

    get caseGetNetworkId(){
        return this.caseData && this.caseData.X1800_PA_With_Ownership__c ?  this.caseData.X1800_PA_With_Ownership__c : null;
    }

    get getCallerName(){
        return this.caseData && this.caseData.X1800_Callers_Name__c ?  this.caseData.X1800_Callers_Name__c : null;
    }

    get getRepayType(){
        return this.caseData && this.caseData.X1800_Reply_Type__c ?  this.caseData.X1800_Reply_Type__c : null;
    }

    get getPatientFirstName(){
        return this.caseData && this.caseData.X1800_First_Name__c ?  this.caseData.X1800_First_Name__c : null;
    }

    get getPatientMiddleInitial(){
        return this.caseData && this.caseData.X1800_Middle_Initial__c ?  this.caseData.X1800_Middle_Initial__c : null;
    }

    get getPatientLastName(){
        return this.caseData && this.caseData.X1800_Last_Name__c ?  this.caseData.X1800_Last_Name__c : null;
    }

    get getPatientHomePhone(){
        return this.caseData && this.caseData.X1800_Home_Phone__c ?  this.caseData.X1800_Home_Phone__c : null;
    }

    get getPatientBirthDate(){
        //return new Intl.DateTimeFormat('en-US', options).format(new Date(this.caseData && this.caseData.X1800_Birthdate__c ? this.caseData.X1800_Birthdate__c : null));
        if(this.caseData && this.caseData.X1800_Birthdate__c){
            const dateComponents = this.caseData.X1800_Birthdate__c.split('-');
            const year = dateComponents[0];
            const month = dateComponents[1];
            const day = dateComponents[2];
            const formattedDate = `${month}/${day}/${year}`;
            return formattedDate;
        }
        return null;
    }

    get getPatientEmailAddress(){
        return this.caseData && this.caseData.X1800_Email_Address__c ?  this.caseData.X1800_Email_Address__c : null;
    }

    get getCaseMessages(){
        this.caseMessages = this.caseData && this.caseData.X1800_Messages__c ? this.caseData.X1800_Messages__c : null;
        if(!this.caseMessages){
            this.caseMessages = 'No case messages found.'
        }
        return this.caseMessages;
    }
    get getCaseNumber(){
        return this.caseData && this.caseData.CaseNumber ?  this.caseData.CaseNumber : null;
    }

    get radioOptions() {
        return [
            { label: 'Are you coordinating the response, or forwarding it to the appropriate Person(s)?', value: 'Are you coordinating the response, or forwarding it to the appropriate Person(s)?' },
            { label: 'Return to 1-800', value: 'Return to 1-800' },
        ];
    }
    connectedCallback() {

        this.sentaraLogoUrl = sentaraLogo;
        this.checkBoxLogoUrl = checkBoxLogo;
        
        if(FORM_FACTOR == 'Small'){
                this.isPhoneLayout = true;
        }

        if(this.recordId){
            getCaseRecordVales({
                recordId : this.recordId
            })
            .then(result =>{
                if(result){
                    let returnedResult = JSON.parse(result);
                    if(returnedResult){
                        this.caseData = returnedResult;
                    }
                }
            })
            .catch(exception =>{
                console.log('Exception in getCase ==>' + JSON.stringify(exception));
            })
        }
        this.getUploadedDocs(this.recordId);
    }

    getUploadedDocs(caseRecordId){
        showUploadedDocuments({
            recordId : caseRecordId
        }) 
        .then(result =>{
            if(true){
                for (let i = 0; i < result.length; i++) {
                    let contentVersionId = result[i].Id.substring(0, 15);
                    let contentBodyId = result[i].ContentBodyId.substring(0, 15);
                    //this.imageUrls.push('/sfc/servlet.shepherd/version/renditionDownload?rendition=ORIGINAL_Jpeg&versionId='+contentVersionId+'&operationContext=CHATTER&contentId='+contentBodyId);
                    //Code added by SFDC Team "communityPath" and '+vforcesite' this gets the Community path prefix.
                    this.imageUrls.push(communityPath+'vforcesite'+'/sfc/servlet.shepherd/version/renditionDownload?rendition=ORIGINAL_Jpeg&versionId='+contentVersionId+'&operationContext=CHATTER&contentId='+contentBodyId);
                }
            }
        })
        .catch(exception =>{
            console.log('exception ==>', JSON.stringify(exception));
        })
    }
}