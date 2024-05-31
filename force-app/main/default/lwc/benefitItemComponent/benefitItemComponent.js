import { LightningElement,api,wire } from 'lwc';
import getCoverageBenefitItemList from '@salesforce/apex/MemberController.getCoverageBenefitItemList';
import { NavigationMixin } from 'lightning/navigation';
export default class benefitItemComponent extends NavigationMixin(LightningElement) {
    @api benefitId;
    benefitItems;
    error;
    //get a list of Coverage Benefit Items
    @wire(getCoverageBenefitItemList, { benefitID: '$benefitId' }) 
    wiredBenefitItems({ error, data }) {
        if (data) {
            console.log(data);
            this.benefitItems = data;
            this.error = undefined;
        } else if (error) {
            console.log(error);
            this.error = error;
            this.benefitItems = undefined;
        }
    };
    //open the Benefit Item page
    openCoverageBenefitItem(event) {
        console.log(event.target.dataset.id);
        this[NavigationMixin.Navigate]({
           type: 'standard__recordPage',
            attributes: {
                recordId:event.target.dataset.id,
                objectApiName: 'CoverageBenefitItem',
                actionName: 'view'
            }
       });
    }
}