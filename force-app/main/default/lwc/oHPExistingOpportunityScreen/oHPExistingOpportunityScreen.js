import { LightningElement, api, wire, track } from 'lwc';

import getExistingOpps from '@salesforce/apex/OHPExistingOpportunityScreenHelper.getExistingOpps';

const columns = [
    { label: 'Name', fieldName: 'Name'},
    { label: 'Strategy', fieldName: 'Strategy__c'},
    { label: 'Contact Center Stage', fieldName: 'Contact_Center_Stage__c'},
    { label: 'Status', fieldName: 'Status__c'},
    { label: 'Account Name', fieldName: 'AccountName'},
    { label: 'Product', fieldName: 'OHP_Product__c'},
    { label: 'Plan', fieldName: 'OHP_Plan__c'},
    { label: 'Assigned To', fieldName: 'OwnerName'}
]

export default class OHPExistingOpportunityScreen extends LightningElement {
    @api selectedOppty;
    @api queryFilter;
    @api accountId;
    finishedLoading = false;
    @track data;
    error;
    columns=columns;

    @wire(getExistingOpps, {aId: '$accountId'})
    opptyOptions({error,data}){
        if(data) {
            console.log('in data ' + this.accountId);
            let currentData = [];
            data.forEach((row) => {
                console.log(row);
                let rowData = {};
                rowData.Id = row.Id;
                rowData.Name = row.Name;
                rowData.Strategy__c = row.Strategy__c;
                rowData.Contact_Center_Stage__c = row.Contact_Center_Stage__c;
                rowData.Status__c = row.Status__c;
                rowData.OHP_Product__c = row.OHP_Product__c;
                rowData.OHP_Plan__c = row.OHP_Plan__c;
                if(row.Account) {
                    rowData.AccountName = row.Account.Name;
                }
                if(row.Owner) {
                    rowData.OwnerName = row.Owner.Name;
                }
                currentData.push(rowData);
            });
            this.data = currentData;
            this.finishedLoading = true;
        }
        else if(error) {
            console.error('sure would be nice if this worthless lwc could print something useful :)');
            console.error('error ' + error.body);
            console.log(error.body);
            console.log(error.status);
            console.log(error.statusText);
            this.error = error;
            this.data = undefined;
            this.finishedLoading = true;
        }
    }
    get emptyList() {
        if(this.data){
            return this.data.length == 0;
        }
        return true;
    }

    handleChange(event) {
        console.log('in handle change');
        console.log('event.target: ', event.target);
        console.log('event.detail: ', event.detail);
        console.log('event.detail.selectedRows', event.detail.selectedRows);
        this.selectedOppty = event.detail.selectedRows[0].Id;
        console.log('selectedoppty: ',this.selectedOppty);
    }

}