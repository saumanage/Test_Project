import { LightningElement, api } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getAccount from '@salesforce/apex/EngagentDetailsController.getAccount';
import getUrl from '@salesforce/apex/OhpOpportunityToEngagent.getUrl';
import { NavigationMixin } from 'lightning/navigation';


export default class EngagentDetails extends NavigationMixin(LightningElement) {
    @api recordId;
    contactId;

    renderedCallback() {
        console.log('rendered------------');
        console.log(this.recordId + ' is provided');
        this.getdata();
    }
    getdata() {
        getAccount({ recordId: this.recordId })
            .then(result => {
                this.contactId = result;
                if (this.contactId == null) {
                    const evt = new ShowToastEvent({
                        title: "Error",
                        message: "Opportunity is not related to any contact",
                        variant: "error"
                    });
                    this.dispatchEvent(evt);
                    this.dispatchEvent(new CloseActionScreenEvent());
                }

                console.log(JSON.stringify(result));
            })
            .catch(error => {
                this.error = error;
            });
    }

    closeModal() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }
    onSubmitHandler(event) {
        event.preventDefault();
        const fields = event.detail.fields;
        if (!fields.FirstName) {
           this.showToastMessage('error','Required Field Missing first Name','error');
        } else {
            this.template.querySelector('lightning-record-edit-form').submit(fields);
        }

    }

    handleSuccess(event) {
        this.accountRecordId = event.detail.id;
        getUrl({ oppId: this.recordId })
            .then(result => {
                this.showToastMessage('Record updated','Contact was updated','success');
                this.dispatchEvent(new CloseActionScreenEvent());
                console.log('result',result);
                if (result) {
                    this[NavigationMixin.Navigate]({
                        "type": "standard__webPage",
                        "attributes": {
                            "url": result
                        }
                    });
                }

            }).catch(error => {
                this.error = error;
            });
    }

    showToastMessage(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant

        });
        this.dispatchEvent(evt);
    }
}