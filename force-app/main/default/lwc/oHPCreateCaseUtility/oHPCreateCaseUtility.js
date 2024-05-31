import { LightningElement, track, wire } from 'lwc';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import CASE_OBJECT from '@salesforce/schema/Case';
import PRODUCT_FIELD from '@salesforce/schema/Case.OHP_Product__c';
import ID_FIELD from '@salesforce/schema/Case.Id';

export default class OHPCreateCaseUtility extends LightningElement {
    @track
    recordTypeId;

    @wire(getObjectInfo, { objectApiName: CASE_OBJECT })
    handleObjectInfo({error, data}) {
        if (data) {
            const rtis = data.recordTypeInfos;
            this.recordTypeId = Object.keys(rtis).find(rti => rtis[rti].name === 'Sales Contact Center Case');
        }
    }

    @wire(getPicklistValues,{ recordTypeId: '$recordTypeId', fieldApiName: PRODUCT_FIELD })
    productPicklist;
   
    selectedProductValue;
    selectedProductLabel;

    handleOptionChange(event) {
        this.selectedProductValue = event.detail.value;
        this.selectedProductLabel = event.detail.label;
    }
    handleSuccess(event){
        const toastEvent = new ShowToastEvent({
            title: "Case successfully created",
            message: "ID: " + event.detail.id,
            variant: "success"
        });
        const fields = {};
        fields[ID_FIELD.fieldApiName] = event.detail.id;
        fields[PRODUCT_FIELD.fieldApiName] = this.selectedProductValue;
        const recordInput = {fields};
        updateRecord(recordInput);
        this.handleReset();
        eval("$A.get('e.force:refreshView').fire();");
        this.dispatchEvent(toastEvent);
    }
    handleReset(){
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
                if(field.fieldName == "Subject") {
                    field.value = "Thank you for contacting Optima Health";
                }
                else if(field.fieldName == "Origin") {
                    field.value = "Phone";
                }
                else if(field.fieldName == "Status") {
                    field.value = "Solved";
                }
            });
        }
        this.template.querySelector('c-combo-box-autocomplete').value = '';
    }
}