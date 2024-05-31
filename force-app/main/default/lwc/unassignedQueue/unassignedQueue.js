import { LightningElement,wire,track,api } from 'lwc';
import getUsers from '@salesforce/apex/OHP_UnassignedQueue.getUsers';
import setAssignedRecords from '@salesforce/apex/OHP_UnassignedQueue.setAssignedRecords';
import getTableData from '@salesforce/apex/OHP_UnassignedQueue.getTableData';
import getTaskRecordTypeId from '@salesforce/apex/OHP_UnassignedQueue.getTaskRecordTypeId';

import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import { ShowToastEvent} from 'lightning/platformShowToastEvent'
import {refreshApex} from '@salesforce/apex'

import OPP_OBJECT from '@salesforce/schema/Opportunity';
import TASK_OBJECT from '@salesforce/schema/Task';

const userSearchColumns = [
    { label: 'Name', fieldName: 'Name'}
]

const medicareTaskColumns = [     
    { label: 'Contact Name', fieldName: 'AccountName', sortable: 'true'},
    { label: 'Task Name', 
        fieldName: 'recordId',
        type: 'url',
        typeAttributes: {label: { fieldName: 'Subject'}, target: '_blank'},
        sortable: 'true'
    },
    { label: 'Status', fieldName: 'Status', sortable: 'true'},
    { label: 'Task Assigned', fieldName: 'OwnerName', sortable: 'true'},
    { label: 'Date Created', fieldName: 'CreatedDate', sortable: 'true'},
    { label: 'Date Due', fieldName: 'ActivityDate', sortable: 'true' },
    { label: 'Date Completed', fieldName: 'CompletedDateTime', sortable: 'true'},
    { label: 'Task Notes', fieldName: 'notes', sortable: 'true'}
];

const unassignedIFPTaskColumns = [
    { label: 'Contact Name', fieldName: 'AccountName', sortable: 'true'},
    { label: 'Task Name', 
        fieldName: 'recordId',
        type: 'url',
        typeAttributes: {label: { fieldName: 'Subject'}, target: '_blank'},
        sortable: 'true'
    },
    { label: 'Status', fieldName: 'Status', sortable: 'true'},
    { label: 'Task Assigned', fieldName: 'OwnerName', sortable: 'true'},
    { label: 'Date Created', fieldName: 'CreatedDate', sortable: 'true'},
    { label: 'Date Due', fieldName: 'ActivityDate', sortable: 'true'},
    { label: 'Date Completed', fieldName: 'CompletedDateTime', sortable: 'true'},
    { label: 'Task Notes', fieldName: 'notes', sortable: 'true'}
    
    
];

const unassignedDSNPOutreachTaskColumns = [  
    { label: 'Contact Name', fieldName: 'AccountName', sortable: 'true'},
    { label: 'Task Name', 
        fieldName: 'recordId',
        type: 'url',
        typeAttributes: {label: { fieldName: 'Subject'}, target: '_blank'},
        sortable: 'true'
    },
    { label: 'Status', fieldName: 'Status', sortable: 'true'},
    { label: 'Task Assigned', fieldName: 'OwnerName', sortable: 'true'},
    { label: 'Date Created', fieldName: 'CreatedDate', sortable: 'true'},
    { label: 'Date Due', fieldName: 'ActivityDate', sortable: 'true'},
    { label: 'Date Completed', fieldName: 'CompletedDateTime', sortable: 'true'},
    { label: 'Task Notes', fieldName: 'notes', sortable: 'true'}
];

const ageTwentySixTaskColumns = [
    { label: 'Task Id', 
        fieldName: 'recordId',
        type: 'url',
        typeAttributes: {label: { fieldName: 'TaskId' }, target: '_blank'},
        sortable: "true"
    },
    { label: 'Preference Quad', fieldName: 'PreferenceQuad', sortable: "true"},
    { label: 'Contact Name', fieldName: 'AccountName', sortable: "true"},
    { label: 'Task Name', fieldName: 'Subject', sortable: "true"},
    { label: 'Status', fieldName: 'Status', sortable: "true"},
    { label: 'Task Assigned', fieldName: 'OwnerName', sortable: "true"},
    { label: 'Oppty Assigned', fieldName: 'oppOwnerName', sortable: "true"},
    { label: 'Oppty Channel', fieldName: 'soldChannel', sortable: "true"},
    { label: 'Date Created', fieldName: 'CreatedDate', sortable: "true"},
    { label: 'Date Due', fieldName: 'ActivityDate', sortable: "true"},
    { label: 'Date Completed', fieldName: 'CompletedDateTime', sortable: "true"},
    { label: 'Task Notes', fieldName: 'notes', sortable: "true"},
    { label: 'Dependent First Name', fieldName: 'DependentFirstName', sortable: "true"},
    { label: 'Dependent Last Name', fieldName: 'DependentLastName', sortable: "true"},
    { label: 'Dependent DOB', fieldName: 'Dependent_DOB', sortable: "true"}
];

const allOpportunitiesColumns = [
    { label: 'Contact Name', 
        fieldName: 'recordId',
        type: 'url',
        typeAttributes: {label: { fieldName: 'oppContact'}, target: '_blank'},
        sortable: 'true'
    },
    { label: 'Status', fieldName: 'oppStatus', sortable: 'true'},
    { label: 'Stage', fieldName: 'oppStage', sortable: 'true'},
    { label: 'Assigned', fieldName: 'OwnerName', sortable: 'true'},
    { label: 'Date Created', fieldName: 'CreatedDate', sortable: 'true'},
    { label: 'Date Closed', fieldName: 'oppCloseDate', sortable: 'true'},
    { label: 'Opportunity Notes', fieldName: 'oppnote', sortable: 'true'}
];

const communityMeetingsColumns = [
    { label: 'Event Date', 
        fieldName: 'recordId',
        type: 'url',
        typeAttributes: {label: { fieldName: 'EventDate'}, target: '_blank'},
        sortable: 'true'
    },
    { label: 'Location City', fieldName: 'LocationCity', sortable: 'true'},
    { label: 'Location Name', fieldName: 'LocationName', sortable: 'true'},
    { label: 'Customer First Name', fieldName: 'FirstName', sortable: 'true'},
    { label: 'Customer Last Name', fieldName: 'LastName', sortable: 'true'},
    { label: 'Middle Initial', fieldName: 'MiddleInitial', sortable: 'true'},
    { label: 'Physical Address 1', fieldName: 'PhysicalAddress1', sortable: 'true'},
    { label: 'Physical Address 2', fieldName: 'PhysicalAddress2', sortable: 'true'},
    { label: 'City', fieldName: 'City', sortable: 'true'},
    { label: 'State', fieldName: 'State', sortable: 'true'},
    { label: 'Postal Code', fieldName: 'PostalCode', sortable: 'true'},
    { label: 'Home Phone', fieldName: 'HomePhone', sortable: 'true'},
    { label: 'Mobile Phone', fieldName: 'MobilePhone', sortable: 'true'}
]

const unassignedTerminationFormColumns = [
    { label: 'Task Id', 
        fieldName: 'recordId',
        type: 'url',
        typeAttributes: {label: { fieldName: 'TaskId' }, target: '_blank'},
        sortable: 'true'
    },
    { label: 'Preference Quad', fieldName: 'PreferenceQuad', sortable: 'true'},
    { label: 'Contact Name', fieldName: 'AccountName', sortable: 'true'},
    { label: 'Task Name', fieldName: 'Subject', sortable: 'true'},
    { label: 'Status', fieldName: 'Status', sortable: 'true'},
    { label: 'Task Assigned', fieldName: 'OwnerName', sortable: 'true'},
    { label: 'Oppty Assigned', fieldName: 'oppOwnerName', sortable: 'true'},
    { label: 'Oppty Channel', fieldName: 'soldChannel', sortable: 'true'},
    { label: 'Date Created', fieldName: 'CreatedDate', sortable: 'true'},
    { label: 'Date Due', fieldName: 'ActivityDate', sortable: 'true'},
    { label: 'Date Completed', fieldName: 'CompletedDateTime', sortable: 'true'},
    { label: 'Task Notes', fieldName: 'notes', sortable: 'true'},
    ]

const unassignedQ1LeadNurtureTaskColumns = [
    { label: 'Task Id', 
        fieldName: 'recordId',
        type: 'url',
        typeAttributes: {label: { fieldName: 'TaskId' }, target: '_blank'},
        sortable: 'true'
    },
    { label: 'Preference Quad', fieldName: 'PreferenceQuad', sortable: 'true'},
    { label: 'Contact Name', fieldName: 'AccountName', sortable: 'true'},
    { label: 'Task Name', fieldName: 'Subject', sortable: 'true'},
    { label: 'Status', fieldName: 'Status', sortable: 'true'},
    { label: 'Task Assigned', fieldName: 'OwnerName', sortable: 'true'},
    { label: 'Oppty Assigned', fieldName: 'oppOwnerName', sortable: 'true'},
    { label: 'Oppty Channel', fieldName: 'soldChannel', sortable: 'true'},
    { label: 'Date Created', fieldName: 'CreatedDate', sortable: 'true'},
    { label: 'Date Due', fieldName: 'ActivityDate', sortable: 'true'},
    { label: 'Date Completed', fieldName: 'CompletedDateTime', sortable: 'true'},
    { label: 'Task Notes', fieldName: 'notes', sortable: 'true'},
];

const unassignedContactMeTaskColumns = [
    { label: 'Contact Name', fieldName: 'AccountName', sortable: 'true'},
    { label: 'Task Name', 
        fieldName: 'recordId',
        type: 'url',
        typeAttributes: {label: { fieldName: 'Subject'}, target: '_blank'}, 
        sortable: 'true'
    },
    { label: 'Status', fieldName: 'Status', sortable: 'true'},
    { label: 'Task Assigned', fieldName: 'OwnerName', sortable: 'true'},
    { label: 'Date Created', fieldName: 'CreatedDate', sortable: 'true'},
    { label: 'Date Due', fieldName: 'ActivityDate', sortable: 'true'},
    { label: 'Date Completed', fieldName: 'CompletedDateTime', sortable: 'true'},
    { label: 'Task Notes', fieldName: 'notes', sortable: 'true'}
];

const assignedMedicareLeadColumns = [
    { label: 'Contact ID', 
        fieldName: 'recordId',
        type: 'url',
        typeAttributes: {label: { fieldName: 'ContactId'}, target: '_blank'},
        sortable: 'true'
    },
    { label: 'First Name', fieldName: 'FirstName', sortable: 'true'},
    { label: 'Middle Initial', fieldName: 'MiddleInitial', sortable: 'true'},
    { label: 'Last Name', fieldName: 'LastName', sortable: 'true'},
    { label: 'Physical Address 1', fieldName: 'PhysicalAddressOne', sortable: 'true'},
    { label: 'Physical City', fieldName: 'PhysicalCity', sortable: 'true'},
    { label: 'Physical State', fieldName: 'PhysicalState', sortable: 'true'},
    { label: 'Home Phone', fieldName: 'HomePhone', sortable: 'true'},
    { label: 'Assigned To', fieldName: 'OwnerName', sortable: 'true'},
    { label: 'Broker Assign Date', fieldName: 'BrokerAssignDate', sortable: 'true'}
    
];

const allTasksColumns = [
    { label: 'Contact Name', fieldName: 'AccountName', sortable: 'true'},
    { label: 'Task Name', 
        fieldName: 'recordId',
        type: 'url',
        typeAttributes: {label: { fieldName: 'Subject'}, target: '_blank'},
        sortable: 'true'
    },
    { label: 'Status', fieldName: 'Status', sortable: 'true'},
    { label: 'Task Assigned', fieldName: 'OwnerName', sortable: 'true'},
    { label: 'Oppty Assigned', fieldName: 'oppOwnerName', sortable: 'true'},
    { label: 'Oppty Channel', fieldName: 'soldChannel', sortable: 'true'},
    { label: 'Date Created', fieldName: 'CreatedDate', sortable: 'true'},
    { label: 'Date Due', fieldName: 'ActivityDate', sortable: 'true'},
    { label: 'Date Completed', fieldName: 'CompletedDateTime', sortable: 'true'},
    { label: 'Follow Up Reason', fieldName: 'FollowUpReason', sortable: 'true'},
    { label: 'Task Notes', fieldName: 'notes', sortable: 'true'}
]



export default class UnassignedQueue extends LightningElement {
    @track sortBy;
    @track sortDirection;
    @track contactNameDefaultSortDirection = 'desc';

    //filtering variables
    oppAssignOptions = []; //going to get the values from allOppsdataUnfiltered owner column
    taskAssignOptions = []; //get from allTasksUnfiltered

    @track unassignedAge26Data;
    ageTwentySixTaskColumns = ageTwentySixTaskColumns;
    
    @wire(getTableData,{selectedTable: 'unassignedAge26'})
    ageTwentySixTasks({data,error}){
       
        if(data){
            //console.log('getTableData data block AGE26');
            //console.log(data);
            var taskList = [];
            for (var i = 0; i < data.length; i++) {  
                let tempRecord = Object.assign({}, data[i]);  
                tempRecord.recordId = "/" + tempRecord.recordId;  
                taskList.push(tempRecord);  
               }  
            //this.unassignedAge26Data = data;
            this.unassignedAge26Data=taskList;
        }
        else if(error) {
            console.log(error);
        }
        
        

    }

    capitalizeFirstLetter(conName) {
        return conName.charAt(0).toUpperCase() + conName.slice(1);
    }

    @track OpptysData;
    OpptysDataDataUnfiltered;
    allOpportunitiesColumns = allOpportunitiesColumns;
    
    @wire(getTableData,{selectedTable: 'opportunities'})
    allOpportunities({data,error}){
        if(data){
            
            var taskList = [];
            for (var i = 0; i < data.length; i++) {  
                let tempRecord = Object.assign({}, data[i]);  
                
                tempRecord.recordId = "/" + tempRecord.recordId;  
                tempRecord.oppContact = tempRecord.oppContact == undefined?tempRecord.oppContact:this.capitalizeFirstLetter(tempRecord.oppContact);
                taskList.push(tempRecord);  
            }  
            this.OpptysData=taskList;
            console.log('OpptysData :'+ JSON.stringify(this.OpptysData));
            this.OpptysDataUnfiltered=taskList;
            let entry = {};
            let uniqueSet=[];
            this.OpptysDataUnfiltered.forEach(row => {
                if(!uniqueSet.includes(row.OwnerName)){
                    uniqueSet.push(row.OwnerName);
                    entry = {label: row.OwnerName, value: row.OwnerName }
                    this.oppAssignOptions.push(entry);    
                }
            });
        }
        else if(error) {
            console.log(error);
        }
    }

    @track communityMeetingsdata;
    communityMeetingsColumns = communityMeetingsColumns;

    @wire(getTableData,{selectedTable: 'communityMeeting'})
    communityMeetingsRecords({data,error}){
        if(data){
            this.communityMeetingsdata = data;
        }
        else if(error) {
            console.log(error);
        }
    }

    @track unassignedMedicareData;
    unassignedMedicareUnfiltered;
    medicareTaskColumns = medicareTaskColumns;

    @wire(getTableData,{selectedTable: 'unassignedMedicare'})
    medicaretaskRecords({error,data}){
        if(data){
            var taskList = [];
            for (var i = 0; i < data.length; i++) {  
                let tempRecord = Object.assign({}, data[i]);  
                tempRecord.recordId = "/" + tempRecord.recordId;  
                taskList.push(tempRecord);  
               }
            this.unassignedMedicareData = taskList;
            this.unassignedMedicareDataUnfiltered = taskList;
        }
        else if(error) {
            console.log(error);
        }
    }

    @track unassignedIFPData;
    unassignedIFPDataUnfiltered;
    unassignedIFPTaskColumns = unassignedIFPTaskColumns;

    @wire(getTableData,{selectedTable: 'unassignedIFP'})
    unassignedIFPTasksRecords({error,data}){
        if(data){
            var taskList = [];
            for (var i = 0; i < data.length; i++) {  
                let tempRecord = Object.assign({}, data[i]);  
                tempRecord.recordId = "/" + tempRecord.recordId;  
                taskList.push(tempRecord);  
            }  
            this.unassignedIFPData = taskList;
            this.unassignedIFPDataUnfiltered =taskList;
        }
        else if(error) {
            console.log('Not loading error: unassignedIFP');
            console.log(error);
        }
    }

    @track unassignedDSNPData;
    unassignedDSNPDataUnfiltered;
    unassignedDSNPOutreachTaskColumns = unassignedDSNPOutreachTaskColumns;

    @wire(getTableData,{selectedTable: 'unassignedDSNP'})
    unassignedDSNPOutreachTasksRecords({error,data}){
        if(data){
            var taskList = [];
            for (var i = 0; i < data.length; i++) {  
                let tempRecord = Object.assign({}, data[i]);  
                tempRecord.recordId = "/" + tempRecord.recordId;  
                taskList.push(tempRecord);  
            }  
            this.unassignedDSNPData = taskList;
            this.unassignedDSNPDataUnfiltered = taskList;
        }
        else if(error) {
            console.log(error);
        }
    }

    @track unassignedTermData;
    unassignedTerminationFormColumns =  unassignedTerminationFormColumns;

    @wire(getTableData,{selectedTable: 'unassignedTerm'})
    unassignedTerminationFormRecords({error,data}){
        if(data) {
            var taskList = [];
            for (var i = 0; i < data.length; i++) {  
                let tempRecord = Object.assign({}, data[i]);  
                tempRecord.recordId = "/" + tempRecord.recordId;  
                taskList.push(tempRecord);  
            }  
            this.unassignedTermData=taskList;
        }
        else {
            this.unassignedTermData = undefined;
            console.error(error);
        }
    }


    @track unassignedQ1Data;
    unassignedQ1LeadNurtureTaskColumns = unassignedQ1LeadNurtureTaskColumns;

    @wire(getTableData,{selectedTable: 'unassignedQ1'}) 
    unassignedQ1LeadNurtureTasksRecords({error,data}){
        if(data) {
            console.log('Q1: DATA');
            console.log(data);
            var taskList = [];
            for (var i = 0; i < data.length; i++) {  
                let tempRecord = Object.assign({}, data[i]);  
                tempRecord.recordId = "/" + tempRecord.recordId;  
                taskList.push(tempRecord);  
            }
            this.unassignedQ1Data=taskList;
            console.log('Q1data var');
            console.log(this.unassignedQ1Data);
        }
        else {
            this.unassignedQ1Data = undefined;
            console.error(error);
        }
    }

    @track unassignedContactMeData;
    unassignedContactMeUnfiltered;
    unassignedContactMeTaskColumns = unassignedContactMeTaskColumns;

    @wire(getTableData,{selectedTable: 'unassignedContactMe'}) 
    unassignedContactMeTasksRecords({error,data}){
        if(data) {
            var taskList = [];
            for (var i = 0; i < data.length; i++) {  
                let tempRecord = Object.assign({}, data[i]);  
                tempRecord.recordId = "/" + tempRecord.recordId;  
                taskList.push(tempRecord);  
            }  
            this.unassignedContactMeData = taskList;
            this.unassignedContactMeDataUnfiltered = taskList;
        }
        else{
            this.unassignedContactMeData = undefined;
            console.error(error);
        }
    }

    @track cmtMeetingsData;
    cmtMeetingsDataUnfiltered;
    communityMeetingsColumns = communityMeetingsColumns;

    @wire(getTableData,{selectedTable: 'cmtMeetings'})
    getCommunityMettingsRecords({error,data}){
        if(data) {
            //console.log(data);
            var taskList = [];
            for (var i = 0; i < data.length; i++) {  
                let tempRecord = Object.assign({}, data[i]);  
                tempRecord.recordId = "/" + tempRecord.recordId;  
                taskList.push(tempRecord);  
               }  
            this.cmtMeetingsData = taskList;
            this.cmtMeetingsDataUnfiltered = taskList;
        }
        else{
            this.cmtMeetingsData = undefined;
            console.error(error);
        }
    }


    @track assignedMedicareLeadsData;
    assignedMedicareLeadColumns = assignedMedicareLeadColumns;

    @wire(getTableData,{selectedTable: 'assignedMedicareLeads'})
    assignedMedicareLeadsRecords({error,data}){
        if(data) {
            //console.log(data);
            var taskList = [];
            for (var i = 0; i < data.length; i++) {  
                let tempRecord = Object.assign({}, data[i]);  
                tempRecord.recordId = "/" + tempRecord.recordId;  
                taskList.push(tempRecord);  
               }  
            this.assignedMedicareLeadsData =taskList;
        }
        else{
            this.assignedMedicareLeadsData = undefined;
            console.error(error);
        }        
    }

    @track tasksData;
    tasksDataUnfiltered;
    allTasksColumns = allTasksColumns;

    @wire(getTableData,{selectedTable: 'tasks'})
    allTaskRecords({error,data}){
        if(data) {
            //console.log(data);
            var taskList = [];
            for (var i = 0; i < data.length; i++) {  
                let tempRecord = Object.assign({}, data[i]);  
                tempRecord.recordId = "/" + tempRecord.recordId;  
                taskList.push(tempRecord);  
               }
            this.tasksData = taskList;
            this.tasksDataUnfiltered =taskList;
            let entry = {};
            let uniqueSet=[];
            this.tasksDataUnfiltered.forEach(row => {
                if(!uniqueSet.includes(row.OwnerName)){
                    uniqueSet.push(row.OwnerName);
                    entry = {label: row.OwnerName, value: row.OwnerName};
                    this.taskAssignOptions.push(entry);
                }
            });
        }
        else{
            this.tasksData = undefined;
            console.error(error);
        }     
    }
                
    //NEWLY ADDED
    @api selectedUserId;
    @api userName;
    @track submitDisabled='true';
    tempId = null;
    tempName = null;
    userSearchColumns=userSearchColumns;
    userData;
    @track isModalOpen = false;
    openTab = 'unassignedAge26';
    selectedRecordIds;

    openModal() {
        this.isModalOpen = true;
    }
    closeModal() {
        this.submitDisabled = true;
        this.tempId = null;
        this.tempName = null;
        this.isModalOpen = false;
    }
    searchUsers() {
        //console.log('in search users');
        getUsers({searchInput: this.template.querySelector('[data-id="userSearchField"]').value})
        .then((result) => {
            //console.log(result);
            this.userData = result;
        }).catch((error) => {
            console.log('catch, error: ', error);
        });
    }
    handleUserChange(event) {
        this.tempId = event.detail.selectedRows[0].Id;
        this.tempName = event.detail.selectedRows[0].Name;
        this.submitDisabled = false;
    }
    submitDetails() {
        this.selectedUserId = this.tempId;
        this.userName = this.tempName;
        this.tempId = null;
        this.tempName = null;
        this.isModalOpen = false;
        this.submitDisabled = true;
        
        console.log('in submit details - selectedRecordIds');
        console.log(this.selectedRecordIds);

        setAssignedRecords({userId:this.selectedUserId, recordIds:this.selectedRecordIds})
        .then((result)=>{
             console.log('refreshApex');
           // refreshApex(this.wiredTaskRecords);

           console.log(this.selectedRecordIds)
            this.dispatchEvent( new ShowToastEvent({

                title:'Success',
                message:'Selected Records are assigned!',
                variant:'success'
            }))

            //eval("$A.get('e.force:refreshView').fire();");
            console.log("User Id"+this.selectedUserId)
            console.log("record Id: "+this.selectedRecordIds)
            console.log("Updated: " + result);
        }).catch((error)=>{
            console.log("error: " + error);
        })
        
    }
    prepareSelectedRow(event){
        const selectedRows = event.detail.selectedRows;
        this.selectedRecordIds = [];
        console.log(selectedRows);
        for(let i=0; i<selectedRows.length;i++){
            this.selectedRecordIds.push(selectedRows[i].recordId)
            console.log(selectedRows[i].recordId)
        }
    }
    
    handleTabSelection(event) {
        this.sortBy = null;
        this.sortDirection = null;
        this.openTab = event.target.name;
        this.selectedRecordIds = [];

        try {
            let selectedRows = this.template.querySelector('[data-name="' + this.openTab + '"]').getSelectedRows();
            selectedRows.forEach((row) => {
                //console.log(row);
                this.selectedRecordIds.push(row.Id);
            });
            //console.log(this.selectedTaskIds);
        } catch {
            console.log('catch block');
        }  
        console.log(this.openTab);
    }
    
    taskRecordTypeId;
    oppRecordTypeId;

    @wire(getTaskRecordTypeId)
    handleTaskInfo({error, data}) {
        if(data) {
            this.taskRecordTypeId = data;
        } else {
            console.error(error);
        }
    }

    @wire(getObjectInfo, { objectApiName: OPP_OBJECT })
    handleOppInfo({error, data}) {
        if (data) {
            const rtis = data.recordTypeInfos;
            this.oppRecordTypeId = Object.keys(rtis).find(rti => rtis[rti].name === 'OHP Contact Center Opportunity'); //Sales Contact Center Opportunity
        }
        else if (error) {
            console.log('Could not find record type named: OHP Contact Center Opportunity');
        }
    }

    isFilterModalOpen = false;
    openFilterSections = ['CommunityMeetings','Opportunities','Tasks','UnassignedContactMeTasks','UnassignedMedicareTasks','UnassignedIFPTasks','UnassignedDNSPOutreachTasks'];

    handleFilterSectionToggle(event) {
        this.openFilterSections = event.detail.openSections;
    }

    meetingDateFrom = null;
    meetingDateTo = null;
    taskDate = null;

    oppAssignVal = [];
    oppStatusVal = [];
    oppWLReasonVal = [];
    taskAssignVal = [];
    taskStatusVal = [];
    taskFollowUpReasonVal = [];
    contactMeStatusVal = [];
    medicareStatusVal = [];
    iFPStatusVal = [];
    dnspOutreachStatusVal = [];
    
    oppStatusOptions = [];
    oppWLReasonOptions = [];
    taskStatusOptions = [];
    taskFollowUpReasonOptions = [];
    
    allFilterData;

    @wire(getPicklistValues,{ recordTypeId: '$oppRecordTypeId', fieldApiName: 'Opportunity.Status__c' })
    opptyStatusValues({data,error}) {
        if(data) {
            JSON.parse(JSON.stringify(data.values)).forEach((row) => {
                this.oppStatusOptions.push({label:row.label, value:row.value});
            });
        } else {
            console.error(error);
        }
    }
    @wire(getPicklistValues,{ recordTypeId: '$oppRecordTypeId', fieldApiName: 'Opportunity.Win_Loss_Reason__c' })
    opptyWLReasonValues({data,error}) {
        if(data) {
            this.oppWLReasonOptions = JSON.parse(JSON.stringify(data.values));
            this.oppWLReasonOptions.unshift({label:'No Value', value:''});
        } else {
            console.error(error);
        }
    }
    @wire(getPicklistValues,{ recordTypeId: '$taskRecordTypeId', fieldApiName: 'Task.Status' })
    taskStatusValues({data,error}) {
        if(data) {
            this.taskStatusOptions = JSON.parse(JSON.stringify(data.values));
        } else {
            console.error(error);
        }
    }
    @wire(getPicklistValues,{ recordTypeId: '$taskRecordTypeId', fieldApiName: 'Task.Follow_Up_Reasons__c' })
    taskFollowUpReasonValues({data,error}) {
        if(data) {
            this.taskFollowUpReasonOptions = JSON.parse(JSON.stringify(data.values));
            this.taskFollowUpReasonOptions.unshift({label:'No Value', value:''});
        } else {
            console.error(error);
        }
    }

    //storage variables
    meetingDateFromStorage = null;
    meetingDateToStorage = null;
    taskDateStorage = null;

    oppAssignValStorage = [];
    oppStatusValStorage = [];
    oppWLReasonValStorage = [];
    taskAssignValStorage = [];
    taskStatusValStorage = [];
    taskFollowUpReasonValStorage = [];
    contactMeStatusValStorage = [];
    medicareStatusValStorage = [];
    iFPStatusValStorage = [];
    dnspOutreachStatusValStorage = [];

    openFilterModal() {
        this.isFilterModalOpen = true;
        
        //store before values in case they cancel changes
        this.meetingDateFromStorage = this.meetingDateFrom;
        this.meetingDateToStorage = this.meetingDateToStorage;
        this.taskDateStorage = this.taskDateStorage;

        this.oppAssignValStorage = this.oppAssignVal;
        this.oppStatusValStorage = this.oppStatusVal;
        this.oppWLReasonValStorage = this.oppWLReasonVal;
        this.taskAssignValStorage = this.taskAssignVal;
        this.taskStatusValStorage = this.taskStatusVal;
        this.taskFollowUpReasonValStorage = this.taskFollowUpReasonVal;
        this.contactMeStatusValStorage = this.contactMeStatusVal;
        this.medicareStatusValStorage = this.medicareStatusVal;
        this.iFPStatusValStorage = this.iFPStatusVal;
        this.dnspOutreachStatusValStorage = this.dnspOutreachStatusVal;
    }

    closeFilterModal() {
        this.isFilterModalOpen = false;
        //reset to saved values
        this.meetingDateFrom = this.meetingDateFromStorage;
        this.meetingDateTo = this.meetingDateToStorage;
        this.taskDate = this.taskDateStorage;

        this.oppAssignVal = this.oppAssignValStorage;
        this.oppStatusVal = this.oppStatusValStorage;
        this.oppWLReasonVal = this.oppAssignValStorage;
        this.taskAssignVal = this.oppWLReasonValStorage;
        this.taskStatusVal = this.taskStatusValStorage;
        this.taskFollowUpReasonVal = this.taskFollowUpReasonValStorage;
        this.contactMeStatusVal = this.contactMeStatusValStorage;
        this.medicareStatusVal = this.medicareStatusValStorage;
        this.iFPStatusVal = this.iFPStatusValStorage;
        this.dnspOutreachStatusVal = this.dnspOutreachStatusValStorage;
    }

    applyFilters() {
        this.isFilterModalOpen = false;

        //filter community meetings
        this.cmtMeetingsData = this.cmtMeetingsDataUnfiltered.filter(row =>
            (this.meetingDateFrom <= row.EventDate && row.EventDate <= this.meetingDateTo) ||
            (this.meetingDateFrom <= row.EventDate && this.meetingDateTo == null) || 
            (this.meetingDateFrom == null && row.EventDate <= this.meetingDateTo) ||
            (this.meetingDateFrom == null && this.meetingDateTo == null));
        //filter opportunity table || OpptysData row.EventDate
        this.OpptysData = this.OpptysDataUnfiltered.filter(row => 
            (this.oppStatusVal.includes(row.oppStatus) || this.oppStatusVal.length == 0) &&
            (this.oppWLReasonVal.includes(row.WinLossReason) || this.oppWLReasonVal.length == 0) &&
            (this.oppAssignVal.includes(row.OwnerName) || this.oppAssignVal.length == 0));
        //filter tasks | allTasks
        console.log(this.taskDate);
        this.tasksData = this.tasksDataUnfiltered.filter(row =>
            (this.taskStatusVal.includes(row.Status) || this.taskStatusVal.length == 0) &&
            (this.taskFollowUpReasonVal.includes(row.FollowUpReason) || this.taskFollowUpReasonVal.length == 0) &&
            (this.taskAssignVal.includes(row.OwnerName) || this.taskAssignVal.length == 0) &&
            (row.CreatedDate >= this.taskDate || this.taskDate == null));
        //filter unassigned contact me tasks | unassignedContactMe
        this.unassignedContactMeData = this.unassignedContactMeDataUnfiltered.filter(row =>
            (this.contactMeStatusVal.includes(row.Status) || this.contactMeStatusVal.length == 0));
        //filter unassigned medicare tasks | unassignedMedicareData
        this.unassignedMedicareData = this.unassignedMedicareDataUnfiltered.filter(row =>
            (this.medicareStatusVal.includes(row.Status) || this.medicareStatusVal.length == 0));
        //filter unassigned IFP tasks | unassignedIFPData
        this.unassignedIFPData = this.unassignedIFPDataUnfiltered.filter(row =>
            (this.iFPStatusVal.includes(row.Status) || this.iFPStatusVal.length == 0));
        //filter unassigned DNSP outreach tasks | unassignedDSNPOutreachTasks
        this.unassignedDSNPData = this.unassignedDSNPDataUnfiltered.filter(row =>
            (this.dnspOutreachStatusVal.includes(row.Status) || this.dnspOutreachStatusVal.length == 0));
    }

    handleDateChange(event) {
        this[event.target.name] = event.detail.value;
    }

    handleCheckboxChange(event) {
        this[event.target.name + 'Val'] = JSON.parse(JSON.stringify(event.detail.value));
    }

    handleSelectAll(event) {
        let optionsName;
        if(['contactMeStatus','medicareStatus','iFPStatus','dnspOutreachStatus'].includes(event.target.name)) { 
            optionsName = 'taskStatusOptions';
        } else {
            optionsName = event.target.name+'Options';
        }
        if(event.target.checked){ 
            this[event.target.name+'Val'] = [];
            for(let i=0; i<this[optionsName].length; i++) {
                this[event.target.name+'Val'].push(this[optionsName][i].value);
            }
        }
        else {
            this[event.target.name+'Val'] = [];
        }
    }

    doSorting(event) {
        this.sortBy = event.detail.fieldName;
        //This if else block is to sort OppContact only
        if(this.sortBy == 'recordId'){
            this.sortBy = 'oppContact';
            if(this.contactNameDefaultSortDirection == 'desc'){
                this.contactNameDefaultSortDirection = 'asc';
            }
            else if(this.contactNameDefaultSortDirection == 'asc'){
                this.contactNameDefaultSortDirection = 'desc';
            }            
            this.sortDirection = this.contactNameDefaultSortDirection;            
        }         
        else{
            this.sortDirection = event.detail.sortDirection;
            this.contactNameDefaultSortDirection = 'desc';
        }
          
        this.sortData(this.sortBy, this.sortDirection);
        this.sortBy = event.detail.fieldName;           
    }

    sortData(fieldname, direction) {
        let tableDataVar = this.openTab + 'Data';
        let parseData = JSON.parse(JSON.stringify(this[tableDataVar]));
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };
        // cheking reverse direction
        let isReverse = direction === 'asc' ? 1: -1;
        // sorting data
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';
            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });
        this[tableDataVar] = parseData;
    }
}