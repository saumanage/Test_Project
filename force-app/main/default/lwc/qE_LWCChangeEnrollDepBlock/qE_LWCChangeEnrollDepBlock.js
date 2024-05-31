import { LightningElement, api, track } from 'lwc';

export default class QE_LWCChangeEnrollDepBlock extends LightningElement {
    @api plan;
    @api dependent;

    get isDependentEnrolled() {
        if (this.plan && this.plan.dependents && this.plan.dependents.records) {
            let filteredPlans = this.plan.dependents.records.filter((dependent) => {
                return dependent.contactId === this.dependent.dependentId;
            });
            if (filteredPlans.length > 0) {
                return 'Enrolled';
            }
        }
        return 'Declined';

    }
}