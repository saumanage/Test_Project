import { LightningElement, track } from 'lwc';
import checkMemberId from '@salesforce/apex/OHPTerminationFormHelper.checkMemberId';
import createTerminationTask from '@salesforce/apex/OHPTerminationFormHelper.createTerminationTask';
import SentaraHealthResource from '@salesforce/resourceUrl/SentaraHealthLogo';

const reasonOptions = [
    { label: 'I am moving out of the Sentara Health Plans service area', value: 'Moving'},
    { label: 'I am eligible for Medicare coverage', value: 'Retiring/Medicare'},
    { label: 'I am getting insurance coverage through my employer', value: 'Group Plan Eligible'},
    { label: 'I am eligible for a subsidy and will re-enroll in coverage on marketplace.virginia.gov', value: 'APTC Eligible'},
    { label: 'I am eligible for a Small Group Plan through Virginia\'s Sole Proprietor law', value: 'Sole Proprietor Small Group'},
    { label: 'I am getting a Medicaid plan', value: 'Medicaid Eligible'},
    { label: 'Other', value: 'Other'},
]

const dependentOptions = [
    { label: '0', value: '0' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' }
]

export default class OHPTerminationForm extends LightningElement {
    @track isDisabled = false;
   // @track isError = false;
    requiredFieldsError=false;
    terminationReasonError=false;
    terminationDateError=false;
    dependentsError=false;
    memberIdError = false;
    readAndAgreeError = false;

    SentaraHealthLogo = SentaraHealthResource;
    today = new Date();
    yearString;
    //isValidMemberIds;
    todayString = this.today.toLocaleString('default', {month: 'long'}) + ' ' + this.today.getDate() + ', ' + this.today.getFullYear();
    dependentsSelected=false;
    dateOptions = [];
    reasonOptions = reasonOptions;
    dependentOptions = dependentOptions;
    formView=false;
    confirmationOnly=false;
    retiringMedicare=false;
    aPTCEligible=false;
    soleProp=false;
    medicaidEligible = false;
    dependents = [];
    
    memberName = null;
    selectedDate = null;
               
    connectedCallback() {
        let date = this.today;
        let year = date.getFullYear();
        this.yearString = year;
        
        for (let i = 0; i < 6; i++) { // Iterate through the next 6 months
            let month = date.getMonth();
            let lastDay;
    
            // Calculate last day based on the month and year
            if (month === 1) { // Check for February
                lastDay = this.isLeapYear(year) ? 29 : 28; // Leap year or regular year
            } else {
                lastDay = this.getDaysInMonth(new Date(year, month)); // Get the number of days in the current month
            }
    
            // Push the date options
            this.dateOptions.push({
                label: date.toLocaleString('default', { month: 'long' }) + ' ' + lastDay + ', ' + year,
                value: (month + 1) + '/' + lastDay + '/' + year
            });
    
            // Calculate the next month and year
            date = this.addMonths(date, 1);
    
            if (month === 11) { // December, transition to the next year
                year++;
            }
        }
        this.formView = true; // Uncomment this line if needed in your actual code
    }

    addMonths(date, amount) {
        const newDate = new Date(date); // Create a new date to avoid modifying the original date
        const originalMonth = newDate.getMonth();
      
        // Add the specified number of months
        newDate.setMonth(newDate.getMonth() + amount);
      
        // Check if the resulting month is not as expected (e.g., 1 for February)
        if (newDate.getMonth() !== (originalMonth + amount) % 12) {
          // If not, set the day to 0 to get the last day of the previous month
          newDate.setDate(0);
        }
      
        return newDate; // Return the new date with months added
      }

      isLeapYear(year) {
        if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
          return true; // Leap year
        } else {
          return false; // Not a leap year
        }
      }
      
      getDaysInMonth(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
      }
        
    handleDependentSelection(event){
        if(event.target.value == 0) {
            this.dependentsSelected = false;
        }
        else {
            this.dependents = [];
            for(let i=1; i<=event.target.value; i++) {
                this.dependents.push({id:0, label:'Dependent '+i});
            }
            this.dependentsSelected = true;
        }
    }

    get isValidMemberIds() {
        console.log('in isValidMemberIds');
        let isValid = true;
        const memIds = this.template.querySelectorAll('[data-id="memberId"],[data-id="depMemberId"]');
        const memIdSuffixes = this.template.querySelectorAll('[data-id="memberIdSuffix"],[data-id="depMemberIdSuffix"]');
        let idData = {};
        
        let idString;
        for(let i=0; i<memIds.length; i++) {
            idString = memIds[i].value + '*' + memIdSuffixes[i].value;
            idData[i] = idString;
        }
        console.log('before checkmemberId, idData: ',idData);
        checkMemberId({memberIds: idData})
        .then(result => {
            for(let i=0; i<memIds.length; i++) {
                memIds[i].setCustomValidity('');
                memIdSuffixes[i].setCustomValidity('');
                if(!result[i]){
                    memIds[i].setCustomValidity('ERROR: Primary Contact plan not found -- Please refer to your member ID card for help in filling out Member information to ensure your request is completed accurately.');
                    memIdSuffixes[i].setCustomValidity('*');
                    isValid = false;
                    this.memberIdError = true;
                    this.isDisabled = false;
                }
                memIds[i].reportValidity();
                memIdSuffixes[i].reportValidity();
            }
        })
        .catch(error => {
            console.error('Error in checking member Id:', error);
        })
        this.memberIdError = false;
        return isValid;
    }

    get submitButtonClass() {
        return this.isDisabled ? 'submitBtn disabled' : 'submitBtn';
      }

    handleSubmit(event){
        event.preventDefault();

        this.isDisabled = true;
        this.requiredFieldsError=false;
        this.terminationReasonError=false;
        this.terminationDateError=false;
        this.dependentsError=false;
        this.memberIdError = false;
        this.readAndAgreeError = false;

        // Get data from submitted form
        let fieldsPopulated = true;
        let fieldData = {};

        const fields = this.template.querySelectorAll('lightning-input, lightning-combobox, lightning-radio-group');
        fields.forEach((field) => {
            field.setCustomValidity(''); //reset
            if(field.name == 'readAndAgree') {
                if(!field.checked) {
                    fieldsPopulated = false;
                    field.setCustomValidity('This value is required');
                    this.readAndAgreeError = true;
                    this.isDisabled = false;
                }
                field.reportValidity();
            }
            else if(!field.checkValidity()) {
                if(field.name == 'terminationReason'){
                    this.terminationReasonError = true;
                    this.isDisabled = false;
                   // this.isError = true;
                }
                else if(field.name == 'terminationDate') {
                    this.terminationDateError = true;
                    this.isDisabled = false;
                }
                else if(field.name == 'dependentDropdownSelection') {
                    this.dependentsError = true;
                    this.isDisabled = false;
                }
                else {
                    this.requiredFieldsError = true;
                    this.isDisabled = false;
                }
                fieldsPopulated = false;
                field.reportValidity();
            }
            fieldData[field.name] = field.value;
        });
        
        if(fieldsPopulated && this.isValidMemberIds) {
            createTerminationTask({formData: fieldData})
            .then(result => {
                if(result) {
                    //handle redirects
                    this.formView=false;
                    this.memberName = fields[2].value + ' ' + fields[3].value;
                    //fields[0].value = radio button selection
                    switch(fields[0].value){
                        case reasonOptions[0].value:
                            //moving
                            this.confirmationOnly = true;
                            break;
                        case reasonOptions[1].value:
                            //retiring/medicare
                            this.retiringMedicare = true;
                            break;
                        case reasonOptions[2].value:
                            //group plan eligible
                            this.confirmationOnly = true;
                            break;
                        case reasonOptions[3].value:
                            //aptc eligible
                            this.aPTCEligible = true;
                            break;
                        case reasonOptions[4].value:
                            //sole proprietor small group
                            this.soleProp = true;
                            break;
                        case reasonOptions[5].value:
                            //medicaid eligible
                            this.medicaidEligible = true;
                            break;
                        case reasonOptions[6].value:
                            //other
                            this.confirmationOnly = true;
                            break;
                    }
                }
            })
            .catch(error => {
                console.error('Error sending data: ', error);
            }).finally(() => {
                this.isDisabled = false; // Enable the submit button after submission
            });
        } 
    }

    handleDateSelection(event){
        this.selectedDate = event.target.options.find(opt => opt.value === event.detail.value).label;
    }
}