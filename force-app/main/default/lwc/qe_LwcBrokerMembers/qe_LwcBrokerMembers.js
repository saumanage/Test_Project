import {LightningElement, api, wire} from 'lwc';
import isCommunity from '@salesforce/apex/QE_CLUtility.isCommunity';
import getBrokerMembers from '@salesforce/apex/QE_LwcBrokerMembersController.getBrokerMembers';

const columns = [
    {
        label: 'Name',
        fieldName: 'nameUrl',
        type: 'url',
        typeAttributes: {
            label: { fieldName: 'Name' },
            target: '_blank'
        }
    },
    {label: 'Phone', fieldName: 'Phone', type: 'phone'},
    {label: 'Email', fieldName: 'Email', type: 'email' }
];

export default class Qe_LwcBrokerMembers extends LightningElement {
    @api recordId;
    members;
    error;
    isPortal;
    columns = columns;

    connectedCallback(){
        isCommunity()
        .then(result => {
            this.isPortal = result;
            this.error = undefined;
        })
        .catch(error => {
            this.error = error;
            this.isPortal = undefined;
        });
    }

    @wire(getBrokerMembers, {recordId:'$recordId'})
    wiredMembers({ error, data }) {
        if (data) {
            let nameUrl;
            console.log('isPortal: '+this.isPortal)
            this.members = data.map(row => {
                if (this.isPortal) {
                    nameUrl = `/broker/s/member-details?recordId=${row.Id}`;
                } else {
                    nameUrl = `/${row.Id}`;
                }
                return {...row, nameUrl}
            })
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.members = undefined;
        }
    }
}