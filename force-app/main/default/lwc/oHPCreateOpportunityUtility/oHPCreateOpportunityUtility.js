import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getDate from '@salesforce/apex/OhpOpportunityUtilityController.getDate';
import changeName from '@salesforce/apex/OhpOpportunityUtilityController.changeName';

export default class OHPCreateOpportunityUtility extends LightningElement {
    @wire(getDate) closingDate;
    handleSubmit(event){
        let fields = event.detail.fields;
        fields.Name=fields.AccountId;
        fields.StageName='Open';
        fields.CloseDate=this.closingDate.data;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }
    handleSuccess(event){
        this.oppId=event.detail.id;
        console.log(this.oppId);
        changeName({
            recID: this.oppId
        })
        .then((result)=>{
            eval("$A.get('e.force:refreshView').fire();");
        });
        const toastEvent = new ShowToastEvent({
            title: "Opportunity successfully created",
            message: "ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(toastEvent);
        this.handleReset(event);
    }
    handleReset(event){
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }     
    }
}