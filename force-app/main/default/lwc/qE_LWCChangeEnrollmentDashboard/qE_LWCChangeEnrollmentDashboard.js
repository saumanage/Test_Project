import { LightningElement, track } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

export default class QE_LWCChangeEnrollmentDashboard extends OmniscriptBaseMixin(LightningElement) {
    'use strict';
    // @track mmAddMemberSummaryCustomEvent;
    @track enrolledPlanListArr = [];
    @track omniEnrolledPlanListArr = [];
    @track recordsArr = []
    @track dependentRepeatableArrDepId;
    @track dependentRepeatableArr = [];

    // Template initialization
    /**
     * @param {Object} baseCtrl OS baseCtrl
     * @param {Object} control Element control
     */
    connectedCallback() {
        console.log(JSON.stringify(this.omniJsonData));
        // this.mmAddMemberSummaryCustomEvent = 'membermaintenance-change-summary-' + Math.round((new Date()).getTime() / 1000);
        this.summary = this.omniJsonData;
        this.enrolledPlanListArr = this.convertArray(this.summary.EnrolledPlanList);
        this.omniEnrolledPlanListArr = this.convertArray(this.omniJsonData.EnrolledPlanList).map((sub, i) => {
            return {
                ...sub,
                idx: i,
                enrollments: {
                    records: this.convertArray(sub.enrollments.records).map((plan, k) => {
                        return {
                            ...plan,
                            idx: k,
                            isMedical: plan.ProductType == 'Medical',
                            isDental: plan.ProductType == 'Dental',
                            isPediatricDental: plan.ProductType == 'Pediatric Dental',
                            isMedicalSavFSA: plan.ProductType == 'Medical Savings Account' && plan.ProductSubType == 'FSA',
                            isMedicalSavHSA: plan.ProductType == 'Medical Savings Account' && plan.ProductSubType == 'HSA',
                            EffectiveStartFormatted: this.formatDate(plan.EffectiveStart),
                        }
                    })
                }
            }
        })
        this.dependentRepeatableArrDepId = this.convertArray(this.omniJsonData.dependentInfo.dependentRepeatable.dependentId);
        this.dependentRepeatableArr = this.convertArray(this.omniJsonData.dependentInfo.dependentRepeatable).map(dep => {
            return {
                ...dep,
                // isDependentEnrolled: this.isDependentEnrolled(plan, dep.dependentId)
            }
        });
        this.recordsArr = this.convertArray(this.omniJsonData.records).map((r, i) => ({...r, idx: i }))
    };
    convertArray(val) { return val !== '' && val !== undefined && val !== null ? (Array.isArray(val) ? val : [val]) : []; }

    splitCamelcase(input) {
        if (typeof input !== "string") {
            return input;
        }
        return input.replace(/([A-Z])/g, (match) => ` ${match}`).replace(/^./, (match) => match.toUpperCase());
    }

    changeToUpperCase(input) {
        if (typeof input !== "string") {
            return input;
        }
        return input.replace(/^./, (match) => match.toUpperCase());
    }

    formatPhone(input) {
        if (typeof input !== "string") {
            return input;
        }
        return "(" + input.substring(0, 3) + ") " + input.substring(3, 6) + "-" + input.substring(6, 10);
    }

    formatSSN(input) {
        if (typeof input !== "string") {
            return input;
        }
        return "XXX-XX-" + input.substring(input.length - 4, input.length);
    }
    formatDate(dt) {
        if (!dt) { return ""; }
        let dtSplit = dt.split('-');
        return dtSplit[1] + "/" + dtSplit[2] + "/" + dtSplit[0];
    }
    maskPhone(num) {
            if (typeof num !== "string") {
                return num;
            }
            let formattedNumber = "(" + num.substring(0, 3) + ") " + num.substring(3, 6) + "-" + num.substring(6, 10);
            return formattedNumber;
        }
        // isDependentEnrolled(plan, dependentId) {
        //     if (plan && plan.dependents && plan.dependents.records) {
        //         let filteredPlans = plan.dependents.records.filter((dependent) => {
        //             return dependent.contactId === dependentId;
        //         });
        //         if (filteredPlans.length > 0) {
        //             return 'Enrolled';
        //         }
        //     }
        //     return 'Declined';

    // }
}