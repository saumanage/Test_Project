import { LightningElement, api, wire, track } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { FlowNavigationNextEvent } from 'lightning/flowSupport';

export default class OHPCaseCreateFlowscreen extends LightningElement {
    @api recordTypeId;
    @api ownerIdVal;
    @api ownerName;
    @api subjectVal;
    @api accountIdVal;
    @api dnisVal;
    @api originVal;

    @track isProdFocussed = false;
    productPicklist;
    @track productOptions;
    filteredProductOptions = [];

    @api selectedProduct = null;
    productLabel;

    @wire(getPicklistValues,{ recordTypeId: '$recordTypeId', fieldApiName: 'Case.OHP_Product__c' })
    productFieldInfo({data,error}){
        if(data) {
            this.productPicklist = data;
            this.productOptions = this.productPicklist.values;
            this.filteredProductOptions = [...this.productOptions];
        }
    }
    
    get noProductOptions() {
        return this.filteredProductOptions.length === 0;
    }

    get dropdownClassesProduct() {
        let dropdownClasses = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
        // Show dropdown list on focus
        if (this.isProdFocussed) {
            dropdownClasses += ' slds-is-open';
        }
        return dropdownClasses;
    }

    filterOptions(event) {
        const filterText = event.detail.value;
        this.selectedProduct = null;
        this.filteredProductOptions = this.productOptions.filter(option => {
            return option.label.toLowerCase().includes(filterText.toLowerCase());
        });    
    }

    handleSelectOption(event) {
        this.selectedProduct = event.currentTarget.dataset.label;
        this.isProdFocussed = false;
        //moved to here (2 lines)
        let productField = this.template.querySelector('[data-id="product"]');
        productField.value = event.currentTarget.dataset.value;
        const custEvent = new CustomEvent(
            'selectoption', {
                detail: {
                    value: event.currentTarget.dataset.value,
                    label: event.currentTarget.dataset.label
                }
            }
        );
        this.dispatchEvent(custEvent);
        //from here (2 lines)
        productField.setCustomValidity('');
        productField.reportValidity();
    }

    handleFocus(event) {
        this.isProdFocussed = true;
    }

    handleBlur(event) {
        // Timeout to ensure click event is captured before the 
        // options are hidden
        setTimeout(() => { this.isProdFocussed = false; }, 500);
    }

    handleNext() {
        //validate input - product, category, disposition, touch point, status
        let isValid = true;
        let searchInputs = this.template.querySelectorAll('lightning-input');
        console.log('searchinputs: ', searchInputs);
        if(this.selectedProduct == null) {
            isValid = false;
            searchInputs[0].setCustomValidity('Complete this field.\nA value must be clicked from the dropdown to be recorded.');
            searchInputs[0].reportValidity();
        }
        if(isValid) {
            this.template.querySelectorAll('lightning-input-field').forEach((field) => {
                switch(field.fieldName) {
                    case "OwnerId":
                        this.ownerIdVal = field.value;
                        break;
                    case "Subject":
                        this.subjectVal = field.value;
                        break;
                    case "AccountId":
                        this.accountIdVal = field.value;
                        break;
                    case "Origin":
                        this.originVal = field.value;
                        break;
                    case "DNIS__c":
                        this.dnisVal = field.value;
                        break;
                }
            });
            const navigateFinishEvent = new FlowNavigationNextEvent();
            this.dispatchEvent(navigateFinishEvent);
        }
    }
}