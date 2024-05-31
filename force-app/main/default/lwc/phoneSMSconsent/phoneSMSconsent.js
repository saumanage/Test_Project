import { LightningElement, api, track } from 'lwc';
import getAccountRecord from '@salesforce/apex/CC_MemberPreference.getAccountRecord';
import createAccountPhone from '@salesforce/apex/CC_MemberPreference.createAccountPhone';
export default class PhoneSMSconsent extends LightningElement {
    @api recordId;
    recordData1;
    recordData2;
    @track isAgent = false;
    statusOptions = [
        { value: 'Written', label: 'Written' },
        { value: 'Verbal', label: 'Verbal' },
        { value: 'Implied', label: 'Implied' },
        { value: 'DNC', label: 'DNC' },
        { value: 'DNC Lifetime Ban', label: 'DNC Lifetime Ban' },
    ];
    statusOptionsAgent = [
        { value: 'Written', label: 'Written' },
        { value: 'Verbal', label: 'Verbal' },
        { value: 'Implied', label: 'Implied' },
        { value: 'DNC', label: 'DNC' }
    ];
@track isDNCLifeTimeBan = false;


    connectedCallback() {
        this.accountInfo();
    }

    accountInfo() {
        console.log('recordId ' + this.recordId);
        getAccountRecord({ recordId: this.recordId })
            .then(result => {
                console.log('ACCOUNT RECORD: ', JSON.stringify(result));
                var tempData = [];
                var tem2 =[];
                var disappear = false;
                result.forEach(cv => {
                    var temp = false;
                    
                    if (cv.value != undefined) {
                        if (cv.label === 'Phone') {
                            temp = true;
                        }
                        if(cv.profileName != 'System Administrator'){
                            this.isAgent = true;
                        }
                        console.log('cv.Autolevel '+cv.Autolevel);
                        if(cv.Autolevel == 'DNC Lifetime Ban'){
                            console.log('isDNCLifeTimeBan '+cv.Autolevel);
                            this.isDNCLifeTimeBan = true;
                        }
                        tempData.push({
                            'Label': cv.label,
                            'updatedDate': cv.dateupdated,
                            'Phone': cv.value,
                            'consentValue': cv.AutoconsentValue,
                            'level': cv.Autolevel,
                            'editable': temp,
                            'profileName': cv.profileName,
                            'accountId': cv.accountId,
                            'disableRecord': cv.disableRecord
                        });
                        tem2.push({
                            'Label': cv.label,
                            'updatedDate': cv.dateupdated,
                            'Phone': cv.value,
                            'consentValue': cv.SMSconsentValue,
                            'level': cv.SMSlevel,
                            'editable': temp,
                            'profileName': cv.profileName,
                            'accountId': cv.accountId,
                            'disableRecord': cv.disableRecord
                        });
                    }
                })
                console.log('disappear ',disappear);
               /* if(disappear){
                  tempData.forEach(element => {
                      element.
                  });
                }*/
                 this.recordData1 = tempData.length > 0 ? tempData : undefined;
                 this.recordData2 = tem2.length > 0 ? tem2 : undefined;
                 console.log('this.recordData ', JSON.stringify(this.recordData1));
            })
            .catch(error => {
                console.log('CASE RECORD ERROR: ', error);
            })
    }
    handleRec2change(event) {
        var temp = JSON.parse(JSON.stringify(this.recordData2));
        console.log('In change' + event.target.value)
        temp[event.target.accessKey].Phone = event.target.value;
this.recordData2 = temp;
var temp2 = JSON.parse(JSON.stringify(this.recordData1));
        console.log('In change' + event.target.value)
        temp2[event.target.accessKey].Phone = event.target.value;
        this.recordData1 = temp2;

    }
    handleRec1change(event) {
        var temp = JSON.parse(JSON.stringify(this.recordData1));
        console.log('In change' + event.target.value)
        temp[event.target.accessKey].Phone = event.target.value;
        this.recordData1 = temp;
        var temp2 = JSON.parse(JSON.stringify(this.recordData2));
        console.log('In change' + event.target.value)
        temp2[event.target.accessKey].Phone = event.target.value;
this.recordData2 = temp2;
    }
    handleChange1(event) {
        var temp = JSON.parse(JSON.stringify(this.recordData1));
        console.log('In change' + event.target.value)
        temp[event.target.accessKey].level = event.target.value;
        if (event.target.value === 'DNC' || event.target.value === 'DNC Lifetime Ban') {
            console.log('in if');
            temp[event.target.accessKey].consentValue = 'No';
        } else {
            console.log('in else');
            temp[event.target.accessKey].consentValue = 'Yes';
        }
        this.recordData1 = temp;
    }
    handleChange2(event) {
        var temp = JSON.parse(JSON.stringify(this.recordData2));
        console.log('In change' + event.target.value)
        temp[event.target.accessKey].level = event.target.value;
        if (event.target.value === 'DNC' || event.target.value === 'DNC Lifetime Ban') {
            console.log('in if');
            temp[event.target.accessKey].consentValue = 'No';
        } else {
            console.log('in else');
            temp[event.target.accessKey].consentValue = 'Yes';
        }
        this.recordData2 = temp;
    }
    @api
    validate() {
        var records = [];
        console.log('changedData ' + JSON.stringify(this.recordData1[0].Phone));
        console.log('changedData ' + JSON.stringify(this.recordData2[0].Label));
        for (let i = 0; i < this.recordData2.length; i++) {
            const record1 = {
                PHONETYPE: this.recordData2[i].Label,
                PhoneLevelConsent: this.recordData1[i].level,
                SMSLevelConsent: this.recordData2[i].level,
                ACCOUNTID: this.recordData2[i].accountId,
                PROFILENAME: this.recordData2[i].profileName,
                PHONE: this.recordData2[i].Phone,
            };
            records.push(record1);
        }


        console.log(' records ' + JSON.stringify(records));
        createAccountPhone({ records: JSON.stringify(records) })
            .then(result => {
                console.log('result==> ' + result);
            })
            .catch(error => {
                console.log('CASE RECORD ERROR: ', error);
            })
    }
}