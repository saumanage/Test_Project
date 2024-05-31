import { LightningElement, track, api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

export default class QE_LWCOmniNewportSummary extends OmniscriptBaseMixin(LightningElement) {

    @track summary;
    @track mmAddMemberSummaryCustomEvent;
    @track childs;
    @track selectedPlansArr = [];

    get middleInitialCalculated() {
        return this.summary.personalInfo.middleInitial != null && this.summary.personalInfo.middleInitial != "" ? (this.summary.personalInfo.middleInitial) : "";
    }
    get homeStreetCalculated() {
        return this.summary.personalInfo.homeStreet2 != null && this.summary.personalInfo.homeStreet2 != "" ? ", " + this.summary.personalInfo.homeStreet2 : "";
    }
    get zipCodeSearchCalculated() {
        return this.summary.personalInfo["ZipCodeSearch-Block"];
    }
    get mailingStreetCalculated() {
        return this.summary.personalInfo.mailingAddress && this.summary.personalInfo.mailingAddress.mailingStreet != null && this.summary.personalInfo.mailingAddress.mailingStreet != "" ? this.changeToUpperCase(this.summary.personalInfo.mailingAddress.mailingStreet) : "";
    }
    get mailingStreetCalculated2() {
        return this.summary.personalInfo.mailingAddress && this.summary.personalInfo.mailingAddress.mailingStreet2 != null && this.summary.personalInfo.mailingAddress.mailingStreet2 != "" ? ", " + this.summary.personalInfo.mailingAddress.mailingStreet2 : ""
    }
    get mailingCountyCalculated() {
        return this.summary.personalInfo.mailingCounty && this.summary.personalInfo.mailingCounty != null && this.summary.personalInfo.mailingCounty != "" ? this.changeToUpperCase(this.summary.personalInfo.mailingCounty) + " County" : ""
    }
    get subgroupCalculated() {
        return this.splitCamelcase(this.summary.groupInfo["subGroupBlock-Block"].subGroupBlock != null ? this.summary.groupInfo["subGroupBlock-Block"].subGroupBlock : this.summary.groupInfo.SubgroupName)
    }
    get groupClassCalculated() {
        return this.splitCamelcase(this.summary.groupInfo["groupClassBlock-Block"].groupClassBlock != null ? this.summary.groupInfo["groupClassBlock-Block"].groupClassBlock : this.summary.groupInfo.GroupClassName)
    }
    get cardinationOfBene() {
        return this.omniJsonData.CoordinationOfBenefits.Insurance["TACarrierName-Block"]
    }
    get needDepValidation() {
            return this.summary.dependentInfo.needDependents == 'yes';
        }
        // function reinitEventHandler(e) {
        //     const control = e.detail;
        //     document.removeEventListener(mmAddMemberSummaryCustomEvent, reinitEventHandler);
        //     summaryInit(baseCtrl.prototype, control);
        // }

    // Template initialization
    /**
     * @param {Object} baseCtrl OS baseCtrl
     * @param {Object} control Element control
     */
    connectedCallback() {
        //this.mmAddMemberSummaryCustomEvent = 'membermaintenance-addnew-summary-' + Math.round((new Date()).getTime() / 1000);
        // Listens for template reinit
        // document.addEventListener(mmAddMemberSummaryCustomEvent, reinitEventHandler);
        // OS dataJSON object

        this.summary = JSON.parse(JSON.stringify(this.omniJsonData));
        this.childs = this.omniJsonDef.children;
        console.log('2@summary : ' + JSON.stringify(this.summary));
        this.pediatricPlansArr = this.summary.PediatricDentalPlans && this.summary.PediatricDentalPlans.listProducts ? this.convertArray(this.summary.PediatricDentalPlans.listProducts.records) : [];
        this.summary.reasonForEnroll.hireDateFormatted = this.toDate(this.summary.reasonForEnroll.hireDate);
        this.summary.effectiveDateFormulaFormatted = this.toDate(this.summary.effectiveDateFormula);
        this.summary.reasonForEnroll.DateOfEventFormatted = this.toDate(this.summary.reasonForEnroll.DateOfEvent);
        this.summary.personalInfo.birthDateFormatted = this.toDate(this.summary.personalInfo.birthDate);
        this.EffectiveDateCOBFormatted = this.omniJsonData.CoordinationOfBenefits.Insurance ? this.toDate(this.omniJsonData.CoordinationOfBenefits.Insurance.EffectiveDateCOB) : '';
        this.TermDateFormatted = this.omniJsonData.CoordinationOfBenefits.Insurance ? this.toDate(this.omniJsonData.CoordinationOfBenefits.Insurance.TermDate) : '';
        if (this.summary.Attestation) {
            this.summary.Attestation.attestedDateFormatted = this.summary.Attestation ? this.toDate(this.summary.Attestation.attestedDate) : '';

        }

        this.summary.reasonForEnroll.reasonForEnrollmentFormatted = this.splitspaceCamelcase(this.summary.reasonForEnroll.reasonForEnrollment)
        this.summary.personalInfo.ethnicityFormatted = this.splitspaceCamelcase(this.summary.personalInfo.ethnicity)
        this.summary.groupInfo.groupNameFormatted = this.splitspaceCamelcase(this.summary.groupInfo.groupName)

        this.summary.personalInfo.genderFormatted = this.changeToUpperCase(this.summary.personalInfo.gender)
        this.summary.personalInfo.maritalStatusFormatted = this.changeToUpperCase(this.summary.personalInfo.maritalStatus)
        this.summary.personalInfo.primaryLanguageFormatted = this.changeToUpperCase(this.summary.personalInfo.primaryLanguage)
        this.summary.personalInfo.homeStreetFormatted = this.changeToUpperCase(this.summary.personalInfo.homeStreet)

        this.summary.personalInfo.phoneNumberFormmatted = this.formatPhone(this.summary.personalInfo.phoneNumber);
        this.summary.personalInfo.mobilePhoneFormmatted = this.formatPhone(this.summary.personalInfo.mobilePhone);
        this.summary.personalInfo.workPhoneFormmatted = this.formatPhone(this.summary.personalInfo.workPhone);
        // console.log('summary' +summary);
        //console.log('BPTREE Childs>>'+ baseCtrl.bpTree.children[3].children[0].eleArray[0].propSetMap.text);
        //console.log('BPTREE Child Name>>'+ baseCtrl.bpTree.children[3].name);
        if (this.omniJsonData.smallGroupSelection) {
            this.selectedPlansArr = this.convertArray(this.omniJsonData.smallGroupSelection.selectedPlans)
            this.selectedPlansArr = this.selectedPlansArr.map(plan => {
                return {
                    ...plan,
                    getAnualHealthValidation: plan.SubType__c == 'FSA' && (plan.MaxFSAMedicalCareAmount != null || plan.MinFSAMedicalCareAmount != null),
                    getAnualDepValidation: plan.SubType__c == 'FSA' && (plan.MaxFSADependentCareAmount != null || plan.MinFSADependentCareAmount != null),
                    getPlanNotMedicalSavings: plan.Type__c != 'Medical Savings Account',

                }
            })
        }

        this.dependenRepeatable = this.convertArray(this.omniJsonData.dependentInfo.dependentRepeatable)
        this.dependenRepeatable = this.dependenRepeatable.map((dependent, i) => {
            return {
                ...dependent,
                showIndex: i + 1,
                getMiddleDep: dependent ? (dependent.middleInitialDep != null && dependent.middleInitialDep != "" ? (dependent.middleInitialDep) : "") : '',
                birthDateDepFormatted: dependent ? this.toDate(dependent.birthDateDep) : '',
                relationshipFormatted: dependent ? this.changeToUpperCase(dependent.relationship) : '',
                genderDepFormatted: dependent ? this.changeToUpperCase(dependent.genderDep) : '',
                ethnicityDepFormatted: dependent ? this.splitCamelcase(dependent.ethnicityDep) : '',
                getDpPlan: this.omniJsonData.choosePlansDependents && this.convertArray(this.omniJsonData.choosePlansDependents.dependentPlans)[i] ? this.convertArray(this.omniJsonData.choosePlansDependents.dependentPlans)[i] : '',
                getPedDentalValidation: this.omniJsonData.choosePlansDependents && this.convertArray(this.omniJsonData.choosePlansDependents.dependentPlans)[i] ? this.convertArray(this.omniJsonData.choosePlansDependents.dependentPlans)[i].pedDentalPlanEnroll != null &&
                    this.convertArray(this.omniJsonData.choosePlansDependents.dependentPlans)[i].pedDentalPlanEnroll == 'decline' : '',
                getPedDentalPlanEnroll: this.omniJsonData.choosePlansDependents && this.convertArray(this.omniJsonData.choosePlansDependents.dependentPlans)[i] ? this.convertArray(this.omniJsonData.choosePlansDependents.dependentPlans)[i].pedDentalPlanEnroll == 'enroll' ? 'Enrolled' : this.convertArray(this.omniJsonData.choosePlansDependents.dependentPlans)[i].pedDentalPlanEnroll == 'decline' ? 'Declined' : '-' : '',
                getMedicalPlanEnroll: this.omniJsonData.choosePlansDependents && this.convertArray(this.omniJsonData.choosePlansDependents.dependentPlans)[i] ? this.convertArray(this.omniJsonData.choosePlansDependents.dependentPlans)[i].medicalPlanEnroll == 'enroll' ? 'Enrolled' : this.convertArray(this.omniJsonData.choosePlansDependents.dependentPlans)[i].medicalPlanEnroll == 'decline' ? 'Declined' : '-'  : '',
                getDentalPlanEnroll: this.omniJsonData.choosePlansDependents && this.convertArray(this.omniJsonData.choosePlansDependents.dependentPlans)[i] ? this.convertArray(this.omniJsonData.choosePlansDependents.dependentPlans)[i].dentalPlanEnroll == 'enroll' ? 'Enrolled' : this.convertArray(this.omniJsonData.choosePlansDependents.dependentPlans)[i].dentalPlanEnroll == 'decline' ? 'Declined' : '-' : '',
                getPcpDep:  this.convertArray(this.omniJsonData.PCPSelection.PCPDependents)[i] ? this.convertArray(this.omniJsonData.PCPSelection.PCPDependents)[i].PCPSelectionDepName : '',
                getCobDep: this.convertArray(this.omniJsonData.CoordinationOfBenefits.COBDependents)[i] ? this.convertArray(this.omniJsonData.CoordinationOfBenefits.COBDependents)[i].COBSelectionDepName : '',
                getPcpDepProviderIdValidation: this.convertArray(this.omniJsonData.PCPSelection.PCPDependents)[i] && this.convertArray(this.omniJsonData.PCPSelection.PCPDependents)[i].depProviderInformation && this.convertArray(this.omniJsonData.PCPSelection.PCPDependents)[i].depProviderInformation.depProviderID,
                getCarrierIdDepValidation: this.omniJsonData.CoordinationOfBenefits.COBDependents && this.convertArray(this.omniJsonData.CoordinationOfBenefits.COBDependents)[i] ? this.convertArray(this.omniJsonData.CoordinationOfBenefits.COBDependents)[i] && this.convertArray(this.omniJsonData.CoordinationOfBenefits.COBDependents)[i]['TACarrierNameDep-Block'] && this.convertArray(this.omniJsonData.CoordinationOfBenefits.COBDependents)[i]['TACarrierNameDep-Block'].carrierIdDep != null : '',
                getCobDepCarrierName: this.omniJsonData.CoordinationOfBenefits.COBDependents && this.convertArray(this.omniJsonData.CoordinationOfBenefits.COBDependents)[i] ? this.convertArray(this.omniJsonData.CoordinationOfBenefits.COBDependents)[i]['TACarrierNameDep-Block'] ? this.convertArray(this.omniJsonData.CoordinationOfBenefits.COBDependents)[i]['TACarrierNameDep-Block'] : '' : '',
                effectiveDateCOBFormatted: this.omniJsonData.CoordinationOfBenefits.COBDependents && this.convertArray(this.omniJsonData.CoordinationOfBenefits.COBDependents)[i] ? this.toDate(this.convertArray(this.omniJsonData.CoordinationOfBenefits.COBDependents)[i].effectiveDateCOB) : '',
                termDateCOBFormatted: this.omniJsonData.CoordinationOfBenefits.COBDependents && this.convertArray(this.omniJsonData.CoordinationOfBenefits.COBDependents)[i] ? this.toDate(this.convertArray(this.omniJsonData.CoordinationOfBenefits.COBDependents)[i].termDateCOB) : ''
            }
        })
        this.childsArr = this.convertArray(this.childs).map((child, i) => {
            return {
                ...child,
                keyCh: i,
                getIsChildAttestation: child.name == 'Attestation',
                childrenArr: this.convertArray(child.children).map((children, j) => {
                    return {
                        ...children,
                        keyChildrenNode: j,
                        ChildrenNodeConvertedArr: this.convertArray(children.eleArray).map((el, k) => ({...el, idxEl: `el-${k}` }))
                    }
                })
            }
        })
    };

    toDate(date) {

        if (date) {
            var dt = new Date(date);
            var d = dt.getDate();
            var m = dt.getMonth() + 1;
            var y = dt.getFullYear();
            return (m <= 9 ? '0' + m : m) + '/' + (d <= 9 ? '0' + d : d) + '/' + '' + y;
        } else {
            return;
        }

    }
    convertArray(val) { return Array.isArray(val) ? val : [val] }

    splitCamelcase(input) {
        if (typeof input !== "string") {
            return input;
        }
        // return input.replace(/([A-Z])/g, (match) => ` ${match}`).replace(/^./, (match) => match.toUpperCase());
        return input.replace(/^./, (match) => match.toUpperCase());
    }
    splitspaceCamelcase = function(input) {
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

    //SSN not to be shown on UI - VLOC-847 
    /*formatSSN(input) { 
        var maskedSsn;
            if (typeof input !== "string") {
                return input;
            }            
            //return "XXX-XX-" + input.substring(input.length-4,input.length); 
            if(input.length == 9) maskedSsn = "XXX-XX-XXXX";
            if(input.length == 11) maskedSsn = "XXX-XX-XXXXXX";
            return maskedSsn;
     } */

    maskPhone(num) {
        // if (!number) { return ''; }
        //console.log('Num>>'+input);
        //let num = String(input);
        if (typeof num !== "string") {
            return num;
        }
        let formattedNumber = "(" + num.substring(0, 3) + ") " + num.substring(3, 6) + "-" + num.substring(6, 10);
        return formattedNumber;
    }


    printDiv(divName) {
        /*let printContents = document.getElementById(divName).innerHTML;
        let popupWin = window.open('', '_blank', 'width=300,height=300');
        popupWin.document.open();
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();*/

        document.getElementById("print_logo").style.display = "block";
        window.print();
        document.getElementById("print_logo").style.display = "none";
    }

}