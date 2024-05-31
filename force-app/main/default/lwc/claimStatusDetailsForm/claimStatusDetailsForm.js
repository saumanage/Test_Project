import { LightningElement, api, track, wire } from 'lwc';

const column = [{ label: 'Reason Code', fieldName: 'code' },
                { label: 'Description', fieldName: 'description' },
                { label: 'NDC', fieldName: 'ndcCode' },
                { label: 'CPT Code', fieldName: 'serviceName' },
                { label: 'CPT modifier', fieldName: 'modifier' },
                { label: 'Code', fieldName: 'code' },
                { label: 'Billed units', fieldName: 'billedUnits' },
                { label: 'Discharge date', fieldName: 'thruDate' },
                { label: 'Allowable Amount', fieldName: 'amountAllowed', type: 'currency' }];



export default class ClaimStatusDetailsForm extends LightningElement {
    @api details = '';
    @api vendorDetails = '';
    @api detailsRow = null;
    @api vendorRowDetails = null;
    @track columns = column;
    @track services = [];
     @api 
    get claimtype() {
        return (this.detailsRow.claimType == '0' ? 'Medical' : 'Behavior');
    }
    connectedCallback() {
        debugger;
        this.detailsRow = JSON.parse(this.details);
        if(this.vendorDetails != '')
        {
            this.vendorRowDetails = JSON.parse(this.vendorDetails);
            this.detailsRow.addressLine1 = this.vendorRowDetails.billingAddress1;
            this.detailsRow.addressLine2 = this.vendorRowDetails.billingAddress2;
            this.detailsRow.city = this.vendorRowDetails.city;
            this.detailsRow.state = this.vendorRowDetails.billingStreet;
            this.detailsRow.zipCode = this.vendorRowDetails.zip;
        }
        if(this.detailsRow.datesOfService != null && this.detailsRow.datesOfService != undefined && this.detailsRow.datesOfService != '')
        {
            this.detailsRow.datesOfService = new Date(this.detailsRow.datesOfService.split(' ')[0]);
        }
        for(var i = 0; i < this.detailsRow.services.length; i++)  
        {
            
            this.detailsRow.services[i]['key'] = i;
            
        }
        this.services = this.detailsRow.services;
        // for(var i = 0; i < this.services.length; i++)  
        // {
        //     this.services[i] = 0 + this.services[i].amountAllowed;
        // }
        console.log('this.detailsRow '+this.detailsRow);
    }
}