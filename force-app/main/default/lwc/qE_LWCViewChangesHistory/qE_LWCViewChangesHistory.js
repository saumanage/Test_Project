import { api, LightningElement, track } from 'lwc';
import util from "vlocity_ins/utility";
import moment from "vlocity_ins/dayjs";
import _ from "vlocity_ins/lodash";
export default class QE_LWCViewChangesHistory extends LightningElement {

    @api isEmbedded = false;
    @api name;
    @api userprofile;
    @api 
    get recordId(){
        return this._recordId;
    };
    set recordId(data){
        this._recordId = data;
        if(data){
            this.getInitialData();
        }
        
    }
    @api 
    get usercontactid(){
        return this._usercontactid;
    };
    set usercontactid(data){
        this._usercontactid = data;
        if(data){
            this.getInitialData();
        }
        
    }

    @track orderedData;
    @track fieldDefinitions= {};
    @track result=[];
    @track contactData;
    
    historyRequest = {
        type: "ApexRemote",
        value: {
            className: "QE_GetViewHistoryChanges",
            methodName: "getHistoryChanges",
            inputMap: "{}",
            optionsMap: "{}"
        }
    };
    contactInfo = {
        type : "Dataraptor",
        value : {
            bundleName : "QE_DrGetContactDetails",
            inputMap : "{}",
            optionsMap : "{}"
        } 
    };

    get showChanges(){
        return this.userprofile === "Benefit Admin" || this.userprofile === "Benefit Admin Manager" || this.userprofile === "Broker";
    }

    generateUniqueId() {
        return Math.random().toString(36).substring(7).toUpperCase();
    }
    connectedCallback(){
        console.log('QE_LWCViewChangesHistory', this._recordId)
    }
    getInitialData(){
        this.historyRequest.value.optionsMap = JSON.stringify({
            contactId: this.userprofile === 'Member' ? this.usercontactid : this._recordId 
        });
        this.contactInfo.value.inputMap = JSON.stringify({
            ContactId: this.userprofile === 'Member' ? this.usercontactid : this._recordId
        });
        util.getDataHandler(JSON.stringify(this.contactInfo))
            .then(resultString => {
                let r = JSON.parse(resultString);
                this.contactData = Array.isArray(r) ? r[0] : r;
                return util.getDataHandler(JSON.stringify(this.historyRequest));
            })
            .then(resultString => {
                let r = JSON.parse(resultString);
                this.fieldDefinitions = r.fieldDefinitions;
                let assetHistory = r.assetHistory && Array.isArray( r.assetHistory) ? r.assetHistory.map(a => ({...a, key: "assetHistory"})) : [];
                let assetPartyRelationHistory = r.assetPartyRelationHistory && Array.isArray( r.assetPartyRelationHistory) ? r.assetPartyRelationHistory.map(a => ({...a, key: "assetPartyRelationHistory"})) : [];
                let dependentHistory = r.dependentHistory && Array.isArray( r.dependentHistory) ? r.dependentHistory.filter(m => m.Field !== "QE_CSC_status__c").map(a => ({...a, key: "dependentHistory"})) : [];
                let memberHistory = r.memberHistory && Array.isArray( r.memberHistory) ? r.memberHistory.filter(m => m.Field !== "QE_CSC_status__c").map(a => ({...a, key: "memberHistory"})) : [];
                this.fieldDefinitions = r.fieldDefinitions.reduce((fields, obj) => {
                    const key = obj.QualifiedApiName;
                    if (!fields[key]) {
                        fields[key] = obj;
                    }
                    return fields;
                }, {});  


                let composedArray = [...assetHistory, ...assetPartyRelationHistory, ...dependentHistory, ...memberHistory]
                composedArray = _.orderBy(composedArray, (o) => {
                    return moment(o.CreatedDate,'YYYY-MM-DDTHH:mm:ss').unix();
                }, ['asc']);
                let flag = false;
                let key  = this.generateUniqueId();
                if(composedArray && Array.isArray(composedArray) && composedArray.length > 0){
                    //Andrew Vaughn change for date format
                    const myDate = new Date(Date.now());
                    const offSet = myDate.getTimezoneOffset() * -2;
                    const timeZoneArray = myDate.toString().match(/\((.+)\)/)[1].split(' ');
                    var timeZone = '';
                    timeZoneArray.forEach(word => {timeZone += word.charAt(0);});

                    const groupsFromApproval = composedArray.reduce((groups, obj) => {
                    
                        const date = obj.CreatedDate.split('T')[0];
                        const dateFormatted = moment(date, 'YYYY-MM-DD').format("MM-DD-YYYY");
                        if(obj.Field === "Pending_Approval__c" && obj.NewValue === true){
                            if(groups[key] && !flag){
                                groups[key].taskDate = `${groups[key].taskDate} to ${dateFormatted} `;
                                
                            }
                            key  = this.generateUniqueId();
                            flag = true;
                            if (!groups[key]) {
                                groups[key] = {taskChanges: [], taskDate: `${dateFormatted}`, eventDate: obj.CreatedDate};
                                
                            }
                            // groups[key].taskChanges.push({
                            //     ...obj,
                            //     "changeOn":  this.fieldDefinitions[obj.Field] && this.fieldDefinitions[obj.Field].Label ? this.fieldDefinitions[obj.Field].Label : obj.Field,
                            //     "oldValue": `${obj.OldValue}`,
                            //     "newValue": `${obj.NewValue}`,               
                            //     "changedBy": obj.CreatedBy.Name,
                            //     "changedAt": moment(obj.CreatedDate, 'YYYY-MM-DDTHH:mm:ss').format("MM-DD-YYYY HH:mm:ss")});
                        }else if(obj.Field === "Pending_Approval__c" && obj.NewValue === false && flag){
                            flag = false;
                            
                            groups[key].taskDate = `Completed By ${obj.CreatedBy.Name} | ${groups[key].taskDate} to ${dateFormatted} `;
                            groups[key].approvedBy = obj.CreatedBy.Name;
                            groups[key].lastDate = moment(obj.CreatedDate, 'YYYY-MM-DDTHH:mm:ss').format("MM-DD-YYYY");
                            // groups[key].taskChanges.push({
                            //     ...obj,
                            //      "changeOn":  this.fieldDefinitions[obj.Field] && this.fieldDefinitions[obj.Field].Label ? this.fieldDefinitions[obj.Field].Label : obj.Field,
                            //      "oldValue": `${obj.OldValue}`,
                            //      "newValue": `${obj.NewValue}`, 
                            //      "changedBy": obj.CreatedBy.Name,
                            //      "changedAt": moment(obj.CreatedDate, 'YYYY-MM-DDTHH:mm:ss').format("MM-DD-YYYY HH:mm:ss")});
                            key = this.generateUniqueId();
                        }else if(flag){
                            
                            groups[key].taskChanges.push({
                                ...obj,
                                "changeOn": this.fieldDefinitions[obj.Field] && this.fieldDefinitions[obj.Field].Label ? this.fieldDefinitions[obj.Field].Label : obj.Field ? obj.Field.replace(/([a-z])([A-Z])/g, '$1 $2') : "",
                                "oldValue": obj.OldValue !== null ? `${obj.OldValue}` : '',
                                "newValue": obj.NewValue !== null ? `${obj.NewValue}`: '', 
                                "changedBy": obj.CreatedBy.Name,
                                //Andrew Vaughn: added the utfOffset function call
                                "changedAt": moment(obj.CreatedDate, 'YYYY-MM-DDTHH:mm:ss').utcOffset(offSet).format("MM-DD-YYYY hh:mm:ss a [" + timeZone + "]")});
                        }else{
                            const date = obj.CreatedDate.split('T')[0];
                            const dateFormatted = moment(date, 'YYYY-MM-DD').format("MM-DD-YYYY");
                            if (!groups[key]) {
                                groups[key] = {taskChanges: [], taskDate: `${dateFormatted}`, eventDate: obj.CreatedDate};
                                
                            }
                            groups[key].lastDate = moment(obj.CreatedDate, 'YYYY-MM-DDTHH:mm:ss').format("MM-DD-YYYY");
                            groups[key].taskChanges.push({
                                ...obj,
                                "changeOn": this.fieldDefinitions[obj.Field] && this.fieldDefinitions[obj.Field].Label ? this.fieldDefinitions[obj.Field].Label :  obj.Field ? obj.Field.replace(/([a-z])([A-Z])/g, '$1 $2') : "",
                                "oldValue": obj.OldValue !== null ? `${obj.OldValue}` : '',
                                "newValue": obj.NewValue !== null ? `${obj.NewValue}`: '',  
                                "changedBy": obj.CreatedBy.Name,
                                //Andrew Vaughn: added the utfOffset function call
                                "changedAt": moment(obj.CreatedDate, 'YYYY-MM-DDTHH:mm:ss').utcOffset(offSet).format("MM-DD-YYYY hh:mm:ss a [" + timeZone + "]")});
                        }

                        
                        return groups;
                    }, {});
                    composedArray = [];
                    Object.keys(groupsFromApproval).forEach(key => {
                        if(groupsFromApproval[key].taskChanges.length > 0){
                            composedArray.push(groupsFromApproval[key])
                        }
                    })
                    
                    composedArray = composedArray.map(dateEv => {
                        let groups = dateEv.taskChanges.reduce((groups, obj) => {
                            const key = obj.key === "assetPartyRelationHistory" ? 
                            `${obj.Parent.vlocity_ins__AssetId__r.Name}${obj.Parent.vlocity_ins__PartyId__r ? obj.Parent.vlocity_ins__PartyId__r.Name : ''}` : 
                                obj.key === "assetHistory" ?  `${obj.Asset.Name}` :obj.key;
                            if (!groups[key]) {
                                groups[key] = {taskChanges: [], key: obj.key};
                            }
                            groups[key].taskChanges.push(obj);
                            return groups;
                        }, {});                    
                        Object.keys(groups).forEach(key => {
                            
                            let taskName = "";
                            let taskType = "";
                            switch (groups[key].key) {
                                case "assetHistory":
                                    taskName = `Subscriber Plan: ${groups[key].taskChanges[0].Asset.Name}`;
                                    taskType = `${this.contactData.ContactFirstName} ${this.contactData.ContactLastName}`
                                    break;
                                case "assetPartyRelationHistory":
                                    taskName = `Dependent Plan: ${groups[key].taskChanges[0].Parent.vlocity_ins__AssetId__r.Name}`;
                                    taskType = `${groups[key].taskChanges[0].Parent.vlocity_ins__PartyId__r ? groups[key].taskChanges[0].Parent.vlocity_ins__PartyId__r.Name : ''} `
                                    break;
                                case "memberHistory":
                                    taskName = "Subscriber Personal Information:";
                                    taskType = `${groups[key].taskChanges[0].Contact.Name}`
                                    break;
                                case "dependentHistory":
                                    taskName = "Dependent Personal Information:";
                                    taskType = `${groups[key].taskChanges[0].Contact.Name}`
                                break;
                                default:
                                    break;
                            }
    
                            groups[key] = {
                                ...groups[key],
                                taskName,
                                taskType,
                                taskChanges: _.orderBy(groups[key].taskChanges, (o) => {
                                    return moment(o.CreatedDate,'YYYY-MM-DDTHH:mm:ss').unix();
                                }, ['desc'])
                            };
                        })
                        let tempTaskHistory = []
                        Object.keys(groups).forEach(key => {
                            tempTaskHistory.push(groups[key])
                        })
                        delete dateEv.taskChanges;
                        dateEv.taskHistory = tempTaskHistory;
                        return dateEv;
                    })
                    composedArray = _.orderBy(composedArray, (o) => {
                        return moment(o.eventDate,'YYYY-MM-DDTHH:mm:ss').unix();
                    }, ['desc']);
                    if(composedArray[0] && !composedArray[0].taskDate.includes("to")){
                        composedArray[0].taskDate = `${composedArray[0].taskDate} to ${composedArray[0].lastDate}`
                    }
                    this.result = {
                        "contactFirstName": this.contactData.ContactFirstName ,
                        "contactMiddleName": this.contactData.ContactMiddleName,                    
                        "contactLastName": this.contactData.ContactLastName,
                        "ContactSuffix":this.contactData.ContactSuffix,
                        "ssn": this.contactData.SSN,
                        "accountName": this.contactData.AccountName,
                        "accordionsData":  composedArray
                    }
                    
                }else{
                    this.result = {
                        "contactFirstName": this.contactData.ContactFirstName ,
                        "contactMiddleName": this.contactData.ContactMiddleName,
                        "contactLastName": this.contactData.ContactLastName,
                        "ContactSuffix":this.contactData.ContactSuffix,
                        "ssn": this.contactData.SSN,
                        "accountName": this.contactData.AccountName,
                        "accordionsData":  undefined
                    }
                }
                console.log("getInitialData groups", composedArray)
                console.log('QE_LWCViewChangesHistory Result ',r)
            })
    }
    viewChanges(){
        this.template.querySelector(".vloc-ins-omni-modal-changes").openModal();
    }
    closeModal(){
        
        this.template.querySelector(".vloc-ins-omni-modal-changes").closeModal();
        

    }
}