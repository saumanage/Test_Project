import { LightningElement,api,wire } from 'lwc';
import getCoverageBenefitList from '@salesforce/apex/MemberController.getCoverageBenefitList';
import { NavigationMixin } from 'lightning/navigation';
export default class benefitComponent extends NavigationMixin(LightningElement) {
    @api planId;
    coverageBenefits;
    error;
    //get a list of Coverage Benefits
    @wire(getCoverageBenefitList, { memberPlanID: '$planId' }) 
    wiredCoverageBenefits({ error, data }) {
        if (data) {
            console.log(data);
            this.coverageBenefits = data;
            this.error = undefined;
        } else if (error) {
            console.log(error);
            this.error = error;
            this.coverageBenefits = undefined;
        }
    };
    //open the Benefit page
    openCoverageBenefit(event) {
        console.log(event.target.dataset.id);
        this[NavigationMixin.Navigate]({
           type: 'standard__recordPage',
            attributes: {
                recordId:event.target.dataset.id,
                objectApiName: 'CoverageBenefit',
                actionName: 'view'
            }
       });
    }
}