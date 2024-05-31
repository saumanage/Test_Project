import { LightningElement, api, wire, track } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { FlowNavigationNextEvent } from 'lightning/flowSupport';

const custAnsweredProductList = [
    "Individual: On Exchange",
    "Individual: Off Exchange",
    "Individual",
    "Medicare",
    "Medicare: HMO",
    "Medicare: D-SNP",
    "Medicare: HMO MA Only",
    "Small Group",
    "Small Group: On Shop",
    "Small Group: Off Shop"
]

export default class OHPDependentPicklistsFlowscreen extends LightningElement {
    @api recordTypeId;
    @api ownerIdVal;
    @api ownerName;
    @api subjectVal;
    @api accountIdVal;
    @api opptyIdVal;
    @api dnisVal;
    @api originVal;
    @api touchpointVal;
    @api statusVal;

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
    @api selectedProduct = null;
    productLabel;
    @api selectedCategory = null;
    categoryLabel;
    @api selectedDisposition = null;
    dispositionLabel;

    @wire(getPicklistValues,{ recordTypeId: '$recordTypeId', fieldApiName: 'Case.OHP_Product__c' })
    productFieldInfo({data,error}){
        if(data) {
            this.productPicklist = data;
            this.productOptions = this.productPicklist.values;
            this.filteredProductOptions = [...this.productOptions];
        }
    }
    
    @wire(getPicklistValues,{ recordTypeId: '$recordTypeId', fieldApiName: 'Case.OHP_Category__c' })
    categoryFieldInfo({data,error}){
        if(data) {
            this.categoryPicklist = data;
            this.categoryOptions = this.categoryPicklist.values;
            let key = this.categoryPicklist.controllerValues[this.selectedProduct];
            this.categoryOptions = this.categoryPicklist.values.filter(opt => opt.validFor.includes(key));
            this.filteredCategoryOptions = [...this.categoryOptions];
        }
    }

    @wire(getPicklistValues,{ recordTypeId: '$recordTypeId', fieldApiName: 'Case.OHP_Disposition__c' })
    dispositionFieldInfo({data,error}){
        if(data) {
            this.dispositionPicklist = data;
            this.dispositionOptions = this.dispositionPicklist.values;
            let key = this.dispositionPicklist.controllerValues[this.selectedProduct];
            this.dispositionOptions = this.dispositionPicklist.values.filter(option => option.validFor.includes(key));
            this.filteredDispositionOptions = [...this.dispositionOptions];
            if(custAnsweredProductList.includes(this.selectedProduct)) {
                this.selectedDisposition = 'Customer Question Answered';
                console.log('in the if block!');
            }
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
        let selectedField = this.template.querySelector('[data-id="'+ event.target.title +'"]');
        selectedField.value = event.currentTarget.dataset.value;
        selectedField.setCustomValidity('');
        selectedField.reportValidity();
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

    handleFinish() {
        //validate input - product, category, disposition, touch point, status
        let isValid = true;
        let searchInputs = this.template.querySelectorAll('lightning-input');
        console.log('searchinputs: ', searchInputs);
        if(this.selectedProduct == null) {
            isValid = false;
            searchInputs[0].setCustomValidity('Complete this field.\nA value must be clicked from the dropdown to be recorded.');
            searchInputs[0].reportValidity();
        }
        if(this.selectedCategory == null) {
            isValid = false;
            searchInputs[1].setCustomValidity('Complete this field.\nA value must be clicked from the dropdown to be recorded.');
            searchInputs[1].reportValidity();
        }
        if(this.selectedDisposition == null) {
            isValid = false;
            searchInputs[2].setCustomValidity('Complete this field.\nA value must be clicked from the dropdown to be recorded.');
            searchInputs[2].reportValidity();
        }
        if(isValid) {
            const navigateFinishEvent = new FlowNavigationNextEvent();
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
                    case "OHP_Opportunity__c":
                        this.opptyIdVal = field.value;
                        break;
                    case "DNIS__c":
                        this.dnisVal = field.value;
                        break;
                    case "Origin":
                        this.originVal = field.value;
                        break;
                    case "OHP_Touch_Point__c":
                        this.touchpointVal = field.value;
                        break;
                    case "Status":
                        this.statusVal = field.value;
                        break;
                }
            });
            this.dispatchEvent(navigateFinishEvent);
        }
    }
}