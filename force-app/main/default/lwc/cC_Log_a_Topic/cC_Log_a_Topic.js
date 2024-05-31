import { LightningElement, track, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CloseActionScreenEvent } from 'lightning/actions';
import  getTopicRecordTypeId  from '@salesforce/apex/CC_Log_A_Topic_Controller.getTopicRecordTypeId';
import  getRecordTypeLabel  from '@salesforce/apex/CC_Log_A_Topic_Controller.getRecordTypeLabel';

export default class CC_Log_a_Topic extends LightningElement {
    @api recordId;
    @track boolVal=false;
    @track reasonCode = '';
    @track reasonCategory = '';
    @track reasonCodeNSA = '';
    @wire(getTopicRecordTypeId, { recordId:'$recordId' })recordTypeId;
    @wire(getRecordTypeLabel, { recordId:'$recordId' })recordTypeLabel;

    handleSubmit(event) {
        const fields = event.detail.fields;
        fields.Case__c = this.recordId;
        console.log(this.recordTypeId.data);
        console.log(this.recordTypeLabel.data);
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }
    handleSuccess(event) {
        console.log('Im here');
        const toastEvent = new ShowToastEvent({
            title: "Topic successfully created",
            message: "Reason Category: " + event.detail.fields.ReasonCategory__c.value+", Reason Code: "+event.detail.fields.ReasonCode__c.value,
            variant: "success"
        });
        this.dispatchEvent(toastEvent);
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                if (field.name === "reasonCode" || field.name === "reasonCategory" || field.name === "reasonCodeNSA") {
                    field.reset();
                }
            });
        }
    }
    close(event) {
        this.dispatchEvent(new CloseActionScreenEvent());
    }
}