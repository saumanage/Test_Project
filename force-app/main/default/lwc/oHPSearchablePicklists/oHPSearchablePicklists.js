import { LightningElement, wire, api, track } from 'lwc';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { refreshApex } from '@salesforce/apex';

import PRODUCT_FIELD from '@salesforce/schema/Case.OHP_Product__c';
import CATEGORY_FIELD from '@salesforce/schema/Case.OHP_Category__c';
import DISPOSITION_FIELD from '@salesforce/schema/Case.OHP_Disposition__c';
import RECORDTYPEID_FIELD from '@salesforce/schema/Case.RecordTypeId';
import ID_FIELD from '@salesforce/schema/Case.Id';

export default class oHPSearchablePicklists extends LightningElement {
    editMode = false;
    @api recordId;
    case;

    @track isProdFocussed = false;
    @track isCatFocussed = false;
    @track isDisFocussed = false;
    productPicklist;
    categoryPicklist;
    dispositionPicklist;
    @track productOptions;
    @track categoryOptions;
    @track dispositionOptions;
    filteredProductOptions = [];
    filteredCategoryOptions = [];
    filteredDispositionOptions = [];
    selectedProduct;
    selectedCategory;
    selectedDisposition;
    fieldsLoaded = false;

    @wire(getRecord, {recordId: '$recordId', fields: [PRODUCT_FIELD, CATEGORY_FIELD, DISPOSITION_FIELD, RECORDTYPEID_FIELD]})
    caseObjectInfo({data, error}) {
        if(data) {
            this.case = data;
            this.selectedProduct = data.fields.OHP_Product__c.value;
            this.selectedCategory = data.fields.OHP_Category__c.value;
            this.selectedDisposition = data.fields.OHP_Disposition__c.value;
            this.fieldsLoaded = true;
        }
    }

    @wire(getPicklistValues,{ recordTypeId: '$case.recordTypeId', fieldApiName: 'Case.OHP_Product__c' })
    productFieldInfo({data,error}){
        if(data) {
            this.productPicklist = data;
            this.productOptions = this.productPicklist.values;
            this.filteredProductOptions = [...this.productOptions];
        }
    }
    
    @wire(getPicklistValues,{ recordTypeId: '$case.recordTypeId', fieldApiName: 'Case.OHP_Category__c' })
    categoryFieldInfo({data,error}){
        if(data) {
            this.categoryPicklist = data;
            this.categoryOptions = this.categoryPicklist.values;
            let key = this.categoryPicklist.controllerValues[this.selectedProduct];
            this.categoryOptions = this.categoryPicklist.values.filter(opt => opt.validFor.includes(key));
            this.filteredCategoryOptions = [...this.categoryOptions];
        }
    }

    @wire(getPicklistValues,{ recordTypeId: '$case.recordTypeId', fieldApiName: 'Case.OHP_Disposition__c' })
    dispositionFieldInfo({data,error}){
        if(data) {
            this.dispositionPicklist = data;
            this.dispositionOptions = this.dispositionPicklist.values;
            let key = this.dispositionPicklist.controllerValues[this.selectedProduct];
            this.dispositionOptions = this.dispositionPicklist.values.filter(option => option.validFor.includes(key));
            this.filteredDispositionOptions = [...this.dispositionOptions];
        }
    }

    get noProductOptions() {
        return this.filteredProductOptions.length === 0;
    }
    get noCategoryOptions() {
        return this.filteredCategoryOptions.length === 0;
    }
    get noDispositionOptions() {
        return this.filteredDispositionOptions.length === 0;
    }

    get dropdownClassesProduct() {
        let dropdownClasses = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
        // Show dropdown list on focus
        if (this.isProdFocussed) {
            dropdownClasses += ' slds-is-open';
        }
        return dropdownClasses;
    }
    get dropdownClassesCategory() {
        let dropdownClasses = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
        // Show dropdown list on focus
        if (this.isCatFocussed) {
            dropdownClasses += ' slds-is-open';
        }
        return dropdownClasses;
    }
    get dropdownClassesDisposition() {
        let dropdownClasses = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
        // Show dropdown list on focus
        if (this.isDisFocussed) {
            dropdownClasses += ' slds-is-open';
        }
        return dropdownClasses;
    }

    startEdit() {
        this.editMode = true;
    }

    filterOptions(event) {
        const filterText = event.detail.value;
        if(event.target.label == "Product") {
            this.selectedProduct = null;
            this.filteredProductOptions = this.productOptions.filter(option => {
                return option.label.toLowerCase().includes(filterText.toLowerCase());
            });    
        } else if(event.target.label == "Category") {
            this.selectedCategory = null;
            this.filteredCategoryOptions = this.categoryOptions.filter(option => {
                return option.label.toLowerCase().includes(filterText.toLowerCase());
            });    
        } else if(event.target.label == "Disposition") {
            this.selectedDisposition = null;
            this.filteredDispositionOptions = this.dispositionOptions.filter(option => {
                return option.label.toLowerCase().includes(filterText.toLowerCase());
            });   
        }
    }

    handleSelectOption(event) {
        if(event.target.title == "product") {
            this.selectedProduct = event.currentTarget.dataset.label;
            let key = this.categoryPicklist.controllerValues[this.selectedProduct];
            this.categoryOptions = this.categoryPicklist.values.filter(opt => opt.validFor.includes(key));
            this.filteredCategoryOptions = this.categoryOptions;
            key = this.dispositionPicklist.controllerValues[this.selectedProduct];
            this.dispositionOptions = this.dispositionPicklist.values.filter(option => option.validFor.includes(key));
            this.filteredDispositionOptions = this.dispositionOptions;
            //clear category and disposition if no longer allowed values for selected product
            if(!this.categoryOptions.includes(this.selectedCategory)) {
                this.selectedCategory = null;
            }
            if(!this.dispositionOptions.includes(this.selectedDisposition)) {
                this.selectedDisposition = null;
            }
            this.isProdFocussed = false;
        }
        else if(event.target.title == "category") {
            this.selectedCategory = event.currentTarget.dataset.label;
            this.isCatFocussed = false;                
        }
        else if(event.target.title == "disposition") {
            this.selectedDisposition = event.currentTarget.dataset.label;
            this.isDisFocussed = false;                
        }
        const custEvent = new CustomEvent(
            'selectoption', {
                detail: {
                    value: event.currentTarget.dataset.value,
                    label: event.currentTarget.dataset.label
                }
            }
        );
        this.dispatchEvent(custEvent);
    }

    handleFocus(event) {
        this.isProdFocussed = event.target.label == "Product";
        this.isCatFocussed = event.target.label == "Category";
        this.isDisFocussed = event.target.label == "Disposition";
    }

    handleBlur(event) {
        // Timeout to ensure click event is captured before the 
        // options are hidden
        if(event.target.label == "Product") {
            setTimeout(() => { this.isProdFocussed = false; }, 500);
        }
        else if(event.target.label == "Category") {
            setTimeout(() => { this.isCatFocussed = false; }, 500);
        }
        else if(event.target.label == "Disposition") {
            setTimeout(() => { this.isDisFocussed = false; }, 500);
        }
    }

    handleSubmit() {
        if(this.editMode){
            this.editMode = false;
            const fields = {};
            fields[ID_FIELD.fieldApiName] = this.recordId;
            fields[PRODUCT_FIELD.fieldApiName] = this.selectedProduct;
            fields[CATEGORY_FIELD.fieldApiName] = this.selectedCategory;
            fields[DISPOSITION_FIELD.fieldApiName] = this.selectedDisposition;
            const recordInput = {fields};
    
            updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Picklist values updated',
                        variant: 'success'
                    })
                );
                return refreshApex(this.case);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating picklist values',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
        }
    }
}