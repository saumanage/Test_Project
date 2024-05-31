import { LightningElement, track, api } from 'lwc';

import getUsers from '@salesforce/apex/OHPFindUsersHelper.getUsers';

const columns = [
    { label: 'Name', fieldName: 'Name'}
]
export default class OHPFindUsers extends LightningElement {
    //Boolean tracked variable to indicate if modal is open or not default value is false as modal is closed when page is loaded
    @api selectedUserId;
    @api userName;
    @track submitDisabled='true';
    tempId = null;
    tempName = null;
    columns=columns;
    data;

    @track isModalOpen = false;
    openModal() {
        getUsers({searchInput: this.template.querySelector('lightning-input').value})
            .then((result) => {
                console.log(result);
                this.data = result;
            }).catch((error) => {
                console.log('catch, error: ', error);
            });
        this.isModalOpen = true;
    }
    closeModal() {
        this.tempId = null;
        this.tempName = null;
        this.template.querySelector('lightning-input').value = this.userName;
        this.isModalOpen = false;
    }
    submitDetails() {
        this.selectedUserId = this.tempId;
        this.userName = this.tempName;
        this.tempId = null;
        this.tempName = null;
        this.isModalOpen = false;
        this.submitDisabled = true;
    }
    handleChange(event) {
        this.tempId = event.detail.selectedRows[0].Id;
        this.tempName = event.detail.selectedRows[0].Name;
        this.submitDisabled = false;
    }
}