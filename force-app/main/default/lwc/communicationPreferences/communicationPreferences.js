import { LightningElement, wire, api, track } from 'lwc';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
// import { getPicklistValues } from '@salesforce/uiObjectInfoApi';

const FIELDS = ['Account.OHP_Communication_Barrier__c', 'Account.OHP_Deceased__c', 
                'Account.OHP_Pref_Communication_Channel__c', 'Account.PersonDoNotCall', 
                'Account.OHP_Do_Not_Email__c', 'Account.OHP_Do_Not_Mail__c', 
                'Account.OHP_Language_Preferences__c', 'Account.Id'];

export default class CommunicationPreferences extends LightningElement {
    @api
    recordId;

    accountRecord;
    @track
    accountRecordChanged;

    accountPicklistsValues = 
    {
        OHP_Communication_Barrier__c : ['Blind','Deaf','Language Barrier','Visually Impaired','Hard of Hearing','Speech Impaired','Non English Speaking','Limited English Proficiency'], 
        OHP_Deceased__c : ['No', 'Yes'],
        OHP_Pref_Communication_Channel__c : ['Phone', 'Email', 'Mail'],
        OHP_Language_Preferences__c : ['English','Spanish','French','German','Castilian','Mandarin - Chinese','Cantonese - Chinese','Japanese','Vietnamese','Other']
    };
    accountComboboxValues = {};

    isViewState = true;
    showDoubleCheckModal = false;

    doubleCheckMessage = "";

    connectedCallback() {
        for(const property in this.accountPicklistsValues) {
            const accountPicklistValues = this.accountPicklistsValues[property];
            // console.log(accountPicklistValues);
            let temp = [{label : "--None--", value : null}];
            for(let i = 0; i < accountPicklistValues.length; i++) {
                temp.push({label : accountPicklistValues[i], value : accountPicklistValues[i]});
            }
            this.accountComboboxValues[property] = temp;
        }
        // console.log(this.accountComboboxValues);
    }

    @wire(getRecord, { recordId : '$recordId', fields : FIELDS })
    wiredAccount({error, data}) {
        console.log(data);
        console.log(this.recordId);
        if(data) {
            console.log(data);
            let recordFields = {};
            for(const field in data.fields) {
                recordFields[field] = data.fields[field].value;
            }

            this.accountRecord =  JSON.parse(JSON.stringify(recordFields));
            this.accountRecordChanged = JSON.parse(JSON.stringify(recordFields));

            console.log('this.accountRecord', this.accountRecord);
            console.log('this.accountRecord', this.accountRecordChanged);
            // let OHP_Communication_Barrier__c = "[!OHP_Communication_Barrier__c]";
            // if(this.messageBody && this.messageBody.includes(OHP_Communication_Barrier__c)) {
            //     this.messageBody = this.messageBody.replace(OHP_Communication_Barrier__c, data.fields.OHP_Communication_Barrier__c['value']);
            // }
        } else if(error) {
            console.log('error');
            console.log(error);
        }
        console.log('error');
    }

    get accountRecordChanged() {
        return this.accountRecordChanged;
    }

    handleUpdate(event) {
        this.isViewState = false;
    }

    handleCancel(event) {
        this.accountRecordChanged = JSON.parse(JSON.stringify(this.accountRecord));
        console.log('this.accountRecordChanged', this.accountRecordChanged);
        this.isViewState = true;
    }

    handleSave(event) {
        if(this.accountRecord.OHP_Communication_Barrier__c !== this.accountRecordChanged.OHP_Communication_Barrier__c) {
            let displayValue = this.accountRecordChanged.OHP_Communication_Barrier__c ? this.accountRecordChanged.OHP_Communication_Barrier__c : 'None';
            this.doubleCheckMessage = "Are you sure you want to update Special Communication Needs to " + displayValue + " ?";
            this.showDoubleCheckModal = true;
        } 
        
        if(this.accountRecord.OHP_Deceased__c !== this.accountRecordChanged.OHP_Deceased__c) {
            if(this.doubleCheckMessage) {
                this.doubleCheckMessage += '\n';
            }
            let displayValue = this.accountRecordChanged.OHP_Deceased__c ? this.accountRecordChanged.OHP_Deceased__c : 'None';
            this.doubleCheckMessage += "Are you sure you want to update Deceased status to " + displayValue + " ?";
            this.showDoubleCheckModal = true;
        }

        if(!this.doubleCheckMessage) {
            this.saveAccount();
        }
    }

    handleClose(event) {
        console.log(event.detail);
        if(event.detail) {
            this.saveAccount();
        }
        this.doubleCheckMessage = "";
        this.showDoubleCheckModal = false;
    }

    handleFieldChange(event) {
        this.accountRecordChanged[event.target.name] = event.target.checked !== undefined ? event.target.checked :  event.target.value;
    }

    saveAccount() {
        let recordInput = { fields : this.accountRecordChanged};
        console.log('handleSave', JSON.parse(JSON.stringify(recordInput)));
        updateRecord(recordInput).then(() => {
            console.log('saved');
            this.isViewState = true;
        }).catch(error => {
            console.log(error);
        });
    }
}