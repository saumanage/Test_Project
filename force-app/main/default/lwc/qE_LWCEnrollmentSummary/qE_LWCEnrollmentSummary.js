import { LightningElement, track } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

export default class qE_LWCEnrollmentsummary extends OmniscriptBaseMixin(LightningElement) {
    @track childData;
    @track summary;
 
    connectedCallback(){
        console.log("omniJsonData",JSON.stringify(this.omniJsonData));
        // this.childData = this.omniJsonData.child.eleArray;
         this.summary = this.omniJsonData;
         this.summary.personalInfo.homeStreet = this.changeToUpperCase(this.summary.personalInfo.homeStreet);
         this.summary.personalInfo.primaryLanguage = this.changeToUpperCase(this.summary.personalInfo.primaryLanguage);
         this.summary.personalInfo.maritalStatus = this.changeToUpperCase(this.summary.personalInfo.maritalStatus);
        //  this.summary.personalInfo.firstName = this.summary.personalInfo.firstName? this.changeToUpperCase(this.summary.personalInfo.firstName):"";
        //  this.summary.personalInfo.lastName = this.summary.personalInfo.lastName? this.changeToUpperCase(this.summary.personalInfo.lastName):"";
        //  this.summary.personalInfo.workPhone = this.summary.personalInfo.workPhone? this.formatPhone(this.summary.personalInfo.workPhone):"";
        //  this.summary.personalInfo.mobilePhone = this.summary.personalInfo.mobilePhone? this.formatPhone(this.summary.personalInfo.mobilePhone):"";
        //  this.summary.personalInfo.phoneNumber = this.summary.personalInfo.phoneNumber? this.formatPhone(this.summary.personalInfo.phoneNumber):"";
        //  this.summary.personalInfo.ethnicity = this.summary.personalInfo.ethnicity? this.splitCamelcase(this.summary.personalInfo.ethnicity):"";
        //  this.summary.personalInfo.birthDate = this.summary.personalInfo.birthDate? this.toDate(this.summary.personalInfo.birthDate):"";
    }
    get middleInitialCalc(){
        return this.summary.personalInfo.middleInitial != null && this.summary.personalInfo.middleInitial != "" ? this.changeToUpperCase(this.summary.personalInfo.middleInitial) : "";
    }
    get mailStreet1Calc(){
        return this.summary.personalInfo.mailingAddress.currentMailingStreet != null && this.summary.personalInfo.mailingAddress.currentMailingStreet != ""? this.changeToUpperCase(this.summary.personalInfo.mailingAddress.currentMailingStreet):"";
    }
    get mailStreet2Calc(){
        return this.summary.personalInfo.mailingAddress.mailingStreet2 != null && this.summary.personalInfo.mailingAddress.mailingStreet2 != ""? ", "+this.summary.personalInfo.mailingAddress.mailingStreet2 :"";
    }
    get mailStreet1MainCalc(){
        return this.summary.personalInfo.mailingAddress.mailingStreet != null && this.summary.personalInfo.mailingAddress.mailingStreet != ""? this.changeToUpperCase(this.summary.personalInfo.mailingAddress.mailingStreet):"";
    }
    get mailStreet2MainCalc(){
        return this.summary.personalInfo.mailingAddress.mailingStreet2 != null && this.summary.personalInfo.mailingAddress.mailingStreet2 != ""? ", "+this.summary.personalInfo.mailingAddress.mailingStreet2 :"";
    }
    get mCityCalc(){
        return this.summary.personalInfo.mailingAddress["MailingZipCodeSearch-Block"].mCity;
    }
    get mStateCalc(){
        return this.summary.personalInfo.mailingAddress["MailingZipCodeSearch-Block"].mState;
    }
    get mZipCodeCalc(){
        return this.summary.personalInfo.mailingAddress["MailingZipCodeSearch-Block"].mZipCode;
    }
    get mCountyCalc(){
        return this.summary.personalInfo.mailingAddress["MailingZipCodeSearch-Block"].mCounty+" County";
    }
    get currentStreetCalc(){
        return this.changeToUpperCase(this.summary.personalInfo.currentStreet)
    }

    get homeStreetCalc(){
        return this.summary.personalInfo.homeStreet != null && this.summary.personalInfo.homeStreet != ""? this.summary.personalInfo.homeStreet:"";
    }
    get homestreet2Calc(){
        return this.summary.personalInfo.homeStreet2 != null && this.summary.personalInfo.homeStreet2!= ""? ", "+this.summary.personalInfo.homeStreet2 :"";
    }
    get homeCountryCalc(){
        return this.summary.personalInfo.homeCounty != null && this.summary.personalInfo.homeCounty != ""? this.changeToUpperCase(this.summary.personalInfo.homeCounty)+" County":"";
    }

    get changeMailingAddCalc(){
        return this.summary.personalInfo.mailingAddress.changeMailingAddress  == 'Yes'? true : false;
    }


    toDate(date) {
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear();
        return (m<=9 ? '0' + m : m)+ '/' +  (d <= 9 ? '0' + d : d) + '/' +'' + y ;
    }
    convertArray(val) { return Array.isArray(val) ? val : [val] }

    splitCamelcase(input){ 
            if (typeof input !== "string") {
                return input;
            }
           // return input.replace(/([A-Z])/g, (match) => ` ${match}`).replace(/^./, (match) => match.toUpperCase());
            return input.replace(/^./, (match) => match.toUpperCase());
     }
     splitspaceCamelcase= function(input) { 
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
            return "(" + input.substring(0,3) + ") " + input.substring(3, 6) +"-" + input.substring(6, 10); 
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
        let formattedNumber = "(" + num.substring(0,3) + ") " + num.substring(3, 6) +"-" + num.substring(6, 10);       
        return formattedNumber;
     }


    printDiv(divName) {
        /*let printContents = document.getElementById(divName).innerHTML;
        let popupWin = window.open('', '_blank', 'width=300,height=300');
        popupWin.document.open();
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();*/
        
        document.getElementById("print_logo").style.display="block";
        window.print();
        document.getElementById("print_logo").style.display="none";
    }
}