import { LightningElement,api,wire, } from 'lwc';
import getMemberPlanList from '@salesforce/apex/MemberController.getMemberPlanList';
import { NavigationMixin } from 'lightning/navigation';
export default class memberPlansComponent extends NavigationMixin(LightningElement) {
    @api memberID;
    allPlans = [];
    memberPlans;
    activeMemberPlans = [];
    error;
    showPriorPlans = true;
    //get the list of Member Plan objects
    @wire(getMemberPlanList, { memID: '$memberID' }) 
    wiredMemberPlans({ error, data }) {
        if (data) {
            console.log(data);
            //sort the Active Plans to the top
            this.allPlans = [...data].sort((a,b) =>{
                if(a.Status=='Active' && b.Status!='Active'){
                    return -1;
                }
                if(a.Status!='Active' && b.Status=='Active'){
                    return 1;
                }
                return 0;
            });
            //sort the most recent Effective From date to first
            this.allPlans.sort((a,b) => {
                return new Date(b.EffectiveFrom) - new Date(a.EffectiveFrom);
            });
            let source = this.allPlans;
            this.error = undefined;
            for(let key in source){
                if(source[key].Status=='Active'){
                    this.activeMemberPlans.push(source[key]);
                }
            }
            this.memberPlans = this.activeMemberPlans;
        } else if (error) {
            console.log(error);
            this.error = error;
            this.memberPlans = undefined;
        }
    };
    //navigate to the Member Plan page
    openMemberPlan(event) {
        this[NavigationMixin.Navigate]({
           type: 'standard__recordPage',
            attributes: {
                recordId:event.target.dataset.id,
                objectApiName: 'MemberPlan',
                actionName: 'view'
            }
       });
    }
    //handles what display to the user
    handleToggleChange(event){
        if(event.target.checked==false){
            this.memberPlans = this.activeMemberPlans
        }else{
            this.memberPlans = this.allPlans;
        }
    }
}