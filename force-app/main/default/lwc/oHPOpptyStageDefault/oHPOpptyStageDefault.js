import { LightningElement, wire, api, track } from 'lwc';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { refreshApex } from '@salesforce/apex';

import ID_FIELD from '@salesforce/schema/Opportunity.Id';
import STRATEGY_FIELD from '@salesforce/schema/Opportunity.Strategy__c';
import STAGE_FIELD from '@salesforce/schema/Opportunity.Contact_Center_Stage__c';
import WINLOSS_FIELD from '@salesforce/schema/Opportunity.Win_Loss_Reason__c';

import RECORDTYPEID_FIELD from '@salesforce/schema/Opportunity.RecordTypeId';
import hasPermission from '@salesforce/customPermission/OHP_Sales_Contact_Center_Agent';
import hasPermissionOhpPayment from '@salesforce/customPermission/OHP_Payment_Center_Agent';

const noneOption = {label: '--None--', value: null}

export default class OHPOpptyStageDefault extends LightningElement {
    @api recordId;
    oppty;
    editMode = false;
    fieldsLoaded = false;
    strategyPicklist;
    @track strategyOptions = [];
    stagePicklist;
    @track stageOptions = [];
    winLossPicklist;
    @track winLossOptions = [];
    selectedStrategy;
    selectedStage;
    selectedWinLossReason;

    //get valid picklist options
    @wire(getRecord, {recordId: '$recordId', fields: [STRATEGY_FIELD, STAGE_FIELD, WINLOSS_FIELD, RECORDTYPEID_FIELD]})
    caseObjectInfo({data, error}) {                
        if(!hasPermission && !hasPermissionOhpPayment){
            if(data) {
                this.selectedStrategy = data.fields.Strategy__c.value;
                this.selectedStage = data.fields.Contact_Center_Stage__c.value;
                this.selectedWinLossReason = data.fields.Win_Loss_Reason__c.value;
                this.oppty = data;
                this.fieldsLoaded = true;
            }
        }
    }

    @wire(getPicklistValues,{ recordTypeId: '$oppty.recordTypeId', fieldApiName: 'Opportunity.Strategy__c' })
    strategyFieldInfo({data,error}){
        let strategyOptionAgent = [];
        if(hasPermission || hasPermissionOhpPayment){
            strategyOptionAgent.push({ label:'IFP Lead', value:'IFP Lead'});
            strategyOptionAgent.push({ label:'IFP Manage Member', value:'IFP Manage Member'});
            strategyOptionAgent.push({ label:'IFP Retention', value:'IFP Retention'});
            strategyOptionAgent.push({ label:'Medicare Lead', value:'Medicare Lead'});
            strategyOptionAgent.push({ label:'Medicare Retention', value:'Medicare Retention'});
            strategyOptionAgent.push({ label:'Commercial Lead', value:'Commercial Lead'});
            strategyOptionAgent.push({ label:'Commercial Sales', value:'Commercial Sales'});
            strategyOptionAgent.push({ label:'DSNP Lead', value:'DSNP Lead'});
            strategyOptionAgent.push({ label:'HMO Lead', value:'HMO Lead'});
            strategyOptionAgent.push({ label:'HMO MA Only', value:'HMO MA Only'});

            this.strategyOptions = strategyOptionAgent;
            this.fieldsLoaded = true;
        }else{
            if(data) {
                this.strategyPicklist = data;
                //following line removes preventExtensions to allow adding the none value
                this.strategyOptions = JSON.parse(JSON.stringify(this.strategyPicklist.values));
                this.strategyOptions.unshift(noneOption);
            }
        }
    }
    
    @wire(getPicklistValues,{ recordTypeId: '$oppty.recordTypeId', fieldApiName: 'Opportunity.Contact_Center_Stage__c' })
    categoryFieldInfo({data,error}){
        let strategyOptionAgent = [];
        if(!hasPermission && !hasPermissionOhpPayment){
            if(data) {
                this.stagePicklist = data;            
                //filter by the dependency
                let key = this.stagePicklist.controllerValues[this.selectedStrategy];            
                this.stageOptions = this.stagePicklist.values.filter(opt => opt.validFor.includes(key));            
                this.stageOptions.unshift(noneOption);
            }
        }       
    }

    @wire(getPicklistValues,{ recordTypeId: '$oppty.recordTypeId', fieldApiName: 'Opportunity.Win_Loss_Reason__c' })
    winlossFieldInfo({data,error}){
        if(data) {
            this.winLossPicklist = data;
            //filter by the dependency        
            
            let key = this.winLossPicklist.controllerValues[this.selectedStage];            
            this.winLossOptions = this.winLossPicklist.values.filter(opt => opt.validFor.includes(key));            
            this.winLossOptions.unshift(noneOption);
        }
    }

    handleSelection(event) {
        //handle changing the default values 
        this.selectedWinLossReason = '';       
        if(event.target.name == 'Strategy') {
            this.selectedStrategy = event.target.value;
            
            if(hasPermission || hasPermissionOhpPayment){
                let statusOptionAgent = [];
                if(this.selectedStrategy == 'IFP Lead'){
                    statusOptionAgent.push({ label:'Lead', value:'Lead'});
                    statusOptionAgent.push({ label:'Qualified', value:'Qualified'});
                    statusOptionAgent.push({ label:'Quoted', value:'Quoted'});
                    statusOptionAgent.push({ label:'Applied', value:'Applied'});
                }
                if(this.selectedStrategy == 'IFP Manage Member'){
                    statusOptionAgent.push({ label:'Quote', value:'Quote'});
                    statusOptionAgent.push({ label:'Delete Member', value:'Delete Member'});
                }
                if(this.selectedStrategy == 'IFP Retention'){
                    statusOptionAgent.push({ label:'Refused Offer', value:'Refused Offer'});
                    statusOptionAgent.push({ label:'Renewal Pending', value:'Renewal Pending'});
                }
                if(this.selectedStrategy == 'Medicare Lead'){
                    statusOptionAgent.push({ label:'Lead', value:'Lead'});
                    statusOptionAgent.push({ label:'Qualified', value:'Qualified'});
                }
                if(this.selectedStrategy == 'Medicare Retention'){
                    statusOptionAgent.push({ label:'Refused Offer', value:'Refused Offer'});
                    statusOptionAgent.push({ label:'Renewal Change Plan', value:'Renewal Change Plan'});
                    statusOptionAgent.push({ label:'Renewal Pending', value:'Renewal Pending'});
                }
                if(this.selectedStrategy == 'Commercial Lead'){
                    statusOptionAgent.push({ label:'Accepted', value:'Accepted'});
                    statusOptionAgent.push({ label:'Lead', value:'Lead'});
                }
                if(this.selectedStrategy == 'Commercial Sales'){
                    statusOptionAgent.push({ label:'Accepted', value:'Accepted'});
                    statusOptionAgent.push({ label:'Lead', value:'Lead'});
                }
                if(this.selectedStrategy == 'DSNP Lead'){
                    statusOptionAgent.push({ label:'Enrolled', value:'Enrolled'});
                    statusOptionAgent.push({ label:'Lead', value:'Lead'});
                    statusOptionAgent.push({ label:'Qualified', value:'Qualified'});
                }
                if(this.selectedStrategy == 'HMO Lead'){
                    statusOptionAgent.push({ label:'Enrolled', value:'Enrolled'});
                    statusOptionAgent.push({ label:'Lead', value:'Lead'});
                    statusOptionAgent.push({ label:'Qualified', value:'Qualified'});
                }
                if(this.selectedStrategy == 'HMO MA Only'){
                    statusOptionAgent.push({ label:'Enrolled', value:'Enrolled'});
                    statusOptionAgent.push({ label:'Lead', value:'Lead'});
                    statusOptionAgent.push({ label:'Qualified', value:'Qualified'});
                }
                this.stageOptions = statusOptionAgent;

                switch(this.selectedStrategy) {
                    case 'IFP Manage Member':
                        this.selectedStage = 'Quote';
                        break;
                    case 'IFP Retention':
                        this.selectedStage = 'Renewal Pending';
                        break;
                    case 'Medicare Retention':
                        this.selectedStage = 'Renewal Pending';
                            break;
                        default:
                            this.selectedStage = 'Lead';
                }  
                let winLossOptionsAgent = [];
                if(this.selectedStrategy == 'IFP Lead' && this.selectedStage == 'Lead'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'IFP Lead' && this.selectedStage == 'Qualified'){
                    winLossOptionsAgent.push({ label:'CSC Member Import', value:'CSC Member Import'});
                    winLossOptionsAgent.push({ label:'New Member', value:'New Member'});
                }
                else if(this.selectedStrategy == 'IFP Lead' && this.selectedStage == 'Quoted'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'IFP Lead' && this.selectedStage == 'Applied'){
                    winLossOptionsAgent.push({ label:'Age', value:'Age'});
                    winLossOptionsAgent.push({ label:'Already an Optima Member', value:'Already an Optima Member'});
                    winLossOptionsAgent.push({ label:'Application Expired', value:'Application Expired'});
                    winLossOptionsAgent.push({ label:'Broker Request', value:'Broker Request'});
                    winLossOptionsAgent.push({ label:'Cancelled', value:'Cancelled'});
                    winLossOptionsAgent.push({ label:'Chose not to apply', value:'Chose not to apply'});
                    winLossOptionsAgent.push({ label:'Customer Withdrawn', value:'Customer Withdrawn'});
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Deductible', value:'Deductible'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Mapped', value:'Mapped'});
                    winLossOptionsAgent.push({ label:'Medicaid', value:'Medicaid'});
                    winLossOptionsAgent.push({ label:'No Dental Included in Benefits', value:'No Dental Included in Benefits'});
                    winLossOptionsAgent.push({ label:'No Lead Response', value:'No Lead Response'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Optima Group Member', value:'Optima Group Member'});
                    winLossOptionsAgent.push({ label:'Out of Coverage Area', value:'Out of Coverage Area'});
                    winLossOptionsAgent.push({ label:'PCP Not in Service Area', value:'PCP Not in Service Area'});
                    winLossOptionsAgent.push({ label:'Pharmacy Benefits', value:'Pharmacy Benefits'});
                    winLossOptionsAgent.push({ label:'Premium', value:'Premium'});
                    winLossOptionsAgent.push({ label:'Unknown', value:'Unknown'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                }
                else if(this.selectedStrategy == 'IFP Manage Member' && this.selectedStage == 'Quote'){
                    winLossOptionsAgent.push({ label:'CSC Member Import', value:'CSC Member Import'});
                    winLossOptionsAgent.push({ label:'New Member', value:'New Member'});
                }
                else if(this.selectedStrategy == 'IFP Manage Member' && this.selectedStage == 'Delete Member'){
                    winLossOptionsAgent.push({ label:'CSC Member Import', value:'CSC Member Import'});
                    winLossOptionsAgent.push({ label:'New Member', value:'New Member'});
                }
                else if(this.selectedStrategy == 'IFP Retention' && this.selectedStage == 'Refused Offer'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Moved Out of Coverage Area', value:'Moved Out of Coverage Area'});
                    winLossOptionsAgent.push({ label:'PCP Not in Service Area', value:'PCP Not in Service Area'});
                    winLossOptionsAgent.push({ label:'Pharmacy Benefits', value:'Pharmacy Benefits'});
                    winLossOptionsAgent.push({ label:'Premium', value:'Premium'});
                    winLossOptionsAgent.push({ label:'Unknown', value:'Unknown'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                }
                else if(this.selectedStrategy == 'IFP Retention' && this.selectedStage == 'Renewal Pending'){
                    winLossOptionsAgent.push({ label:'CSC Member Import', value:'CSC Member Import'});
                    winLossOptionsAgent.push({ label:'New Member', value:'New Member'});
                }
                else if(this.selectedStrategy == 'Medicare Lead' && this.selectedStage == 'Lead'){
                    winLossOptionsAgent.push({ label:'Age', value:'Age'});
                    winLossOptionsAgent.push({ label:'Broker Request', value:'Broker Request'});
                    winLossOptionsAgent.push({ label:'Cancelled', value:'Cancelled'});
                    winLossOptionsAgent.push({ label:'Chose not to apply', value:'Chose not to apply'});
                    winLossOptionsAgent.push({ label:'Customer Withdrawn', value:'Customer Withdrawn'});
                    winLossOptionsAgent.push({ label:'Declined by CMS', value:'Declined by CMS'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Mapped', value:'Mapped'});
                    winLossOptionsAgent.push({ label:'Medicaid', value:'Medicaid'});
                    winLossOptionsAgent.push({ label:'No Lead Response', value:'No Lead Response'});
                    winLossOptionsAgent.push({ label:'Optima Group Member', value:'Optima Group Member'});
                    winLossOptionsAgent.push({ label:'Out of Coverage Area', value:'Out of Coverage Area'});
                    winLossOptionsAgent.push({ label:'PCP Not in Service Area', value:'PCP Not in Service Area'});
                    winLossOptionsAgent.push({ label:'Pharmacy Benefits', value:'Pharmacy Benefits'});
                    winLossOptionsAgent.push({ label:'Premium', value:'Premium'});
                    winLossOptionsAgent.push({ label:'Unknown', value:'Unknown'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                }
                else if(this.selectedStrategy == 'Medicare Lead' && this.selectedStage == 'Qualified'){
                    winLossOptionsAgent.push({ label:'Age', value:'Age'});
                    winLossOptionsAgent.push({ label:'Broker Request', value:'Broker Request'});
                    winLossOptionsAgent.push({ label:'Cancelled', value:'Cancelled'});
                    winLossOptionsAgent.push({ label:'Chose not to apply', value:'Chose not to apply'});
                    winLossOptionsAgent.push({ label:'Customer Withdrawn', value:'Customer Withdrawn'});
                    winLossOptionsAgent.push({ label:'Declined by CMS', value:'Declined by CMS'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Mapped', value:'Mapped'});
                    winLossOptionsAgent.push({ label:'Medicaid', value:'Medicaid'});
                    winLossOptionsAgent.push({ label:'No Lead Response', value:'No Lead Response'});
                    winLossOptionsAgent.push({ label:'Optima Group Member', value:'Optima Group Member'});
                    winLossOptionsAgent.push({ label:'Out of Coverage Area', value:'Out of Coverage Area'});
                    winLossOptionsAgent.push({ label:'PCP Not in Service Area', value:'PCP Not in Service Area'});
                    winLossOptionsAgent.push({ label:'Pharmacy Benefits', value:'Pharmacy Benefits'});
                    winLossOptionsAgent.push({ label:'Premium', value:'Premium'});
                    winLossOptionsAgent.push({ label:'Unknown', value:'Unknown'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                }
                else if(this.selectedStrategy == 'Medicare Retention' && this.selectedStage == 'Refused Offer'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Moved Out of Coverage Area', value:'Moved Out of Coverage Area'});
                    winLossOptionsAgent.push({ label:'PCP Not in Service Area', value:'PCP Not in Service Area'});
                    winLossOptionsAgent.push({ label:'Pharmacy Benefits', value:'Pharmacy Benefits'});
                    winLossOptionsAgent.push({ label:'Premium', value:'Premium'});
                    winLossOptionsAgent.push({ label:'Unknown', value:'Unknown'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                }
                else if(this.selectedStrategy == 'Medicare Retention' && this.selectedStage == 'Renewal Change Plan'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Moved Out of Coverage Area', value:'Moved Out of Coverage Area'});
                    winLossOptionsAgent.push({ label:'PCP Not in Service Area', value:'PCP Not in Service Area'});
                    winLossOptionsAgent.push({ label:'Pharmacy Benefits', value:'Pharmacy Benefits'});
                    winLossOptionsAgent.push({ label:'Premium', value:'Premium'});
                    winLossOptionsAgent.push({ label:'Unknown', value:'Unknown'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                }
                else if(this.selectedStrategy == 'Medicare Retention' && this.selectedStage == 'Renewal Pending'){
                    winLossOptionsAgent.push({ label:'CSC Member Import', value:'CSC Member Import'});
                    winLossOptionsAgent.push({ label:'New Member', value:'New Member'});
                }
                else if(this.selectedStrategy == 'Commercial Lead' && this.selectedStage == 'Accepted'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'Commercial Lead' && this.selectedStage == 'Lead'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'Commercial Sales' && this.selectedStage == 'Accepted'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'Commercial Sales' && this.selectedStage == 'Lead'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'DSNP Lead' && this.selectedStage == 'Enrolled'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'DSNP Lead' && this.selectedStage == 'Lead'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'DSNP Lead' && this.selectedStage == 'Qualified'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'HMO Lead' && this.selectedStage == 'Enrolled'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'HMO Lead' && this.selectedStage == 'Lead'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'HMO Lead' && this.selectedStage == 'Qualified'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'HMO MA Only' && this.selectedStage == 'Enrolled'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'HMO MA Only' && this.selectedStage == 'Lead'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'HMO MA Only' && this.selectedStage == 'Qualified'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                this.winLossOptions = winLossOptionsAgent;
            }
            else{                
                let key = this.stagePicklist.controllerValues[this.selectedStrategy];
                this.stageOptions = this.stagePicklist.values.filter(opt => opt.validFor.includes(key));
              /*  switch(this.selectedStrategy) {
                    case null:
                        this.selectedStage = null;
                        break;
                    case 'IFP Manage Member':
                        this.selectedStage = 'Quote';
                        break;
                    case 'IFP Retention':
                        this.selectedStage = 'Renewal Pending';
                        break;
                    case 'Medicare Retention':
                        this.selectedStage = 'Renewal Pending';
                            break;
                        default:
                            this.selectedStage = 'Lead';
                    } */
                    this.selectedStage = '';
                    this.stageOptions.unshift(noneOption);
            }
        }
        else if(event.target.name == 'Stage') {
            this.selectedStage = event.target.value;
            this.selectedWinLossReason = '';
            let newWinLossOptions = [];
            let winLossOptionsAgent = [];
            if(!hasPermission && !hasPermissionOhpPayment){                 
                if((this.selectedStrategy == 'IFP Lead' && this.selectedStage == 'Accepted') ||
                (this.selectedStrategy == 'IFP Lead' && this.selectedStage == 'Qualified') ||
                (this.selectedStrategy == 'IFP Retention' && this.selectedStage == 'PLAN_SELECTED') ||
                (this.selectedStrategy == 'IFP Retention' && this.selectedStage == 'READY_FOR_PLAN_SELECTION') ||
                (this.selectedStrategy == 'Medicare Lead' && this.selectedStage == 'Applied') || 
                (this.selectedStrategy == 'Medicare Lead' && this.selectedStage == 'Enrolled') ||
                (this.selectedStrategy == 'IFP Retention' && this.selectedStage == 'ENROLLMENT_COMPLETED') || 
                (this.selectedStrategy == 'IFP Retention' && this.selectedStage == 'ENROLLMENT_STARTED') ||
                (this.selectedStrategy == 'IFP Retention' && this.selectedStage == 'FINANCIAL_APPLICATION_COMPLETED') ||
                (this.selectedStrategy == 'IFP Retention' && this.selectedStage == 'FINANCIAL_APPLICATION_STARTED')
                ){  
                    this.winLossOptions = [];                                      
                    newWinLossOptions.push({ label:'CSC Member Import', value:'CSC Member Import'});
                    newWinLossOptions.push({ label:'New Member', value:'New Member'});                    
                    this.winLossOptions = newWinLossOptions;
                }
                else if(this.selectedStrategy == 'Medicare Retention' && this.selectedStage == 'Renewed'){
                    this.winLossOptions = [];                                      
                    newWinLossOptions.push({ label:'CSC Member Import', value:'CSC Member Import'});
                    newWinLossOptions.push({ label:'Renewed As Is', value:'Renewed As Is'});   
                    newWinLossOptions.push({ label:'Renewal Changing Plan AEP', value:'Renewal Changing Plan AEP'});                    
                    this.winLossOptions = newWinLossOptions;
                }
                else if((this.selectedStrategy == 'Medicare Lead' && this.selectedStage == 'Lead') ||
                        (this.selectedStrategy == 'Medicare Lead' && this.selectedStage == 'Qualified'))
                {
                    this.winLossOptions = [];                                      
                    newWinLossOptions.push({ label:'Age', value:'Age'});
                    newWinLossOptions.push({ label:'Broker Request', value:'Broker Request'});
                    newWinLossOptions.push({ label:'Cancelled', value:'Cancelled'});
                    newWinLossOptions.push({ label:'Chose not to apply', value:'Chose not to apply'});
                    newWinLossOptions.push({ label:'Customer Withdrawn', value:'Customer Withdrawn'});
                    newWinLossOptions.push({ label:'Declined by CMS', value:'Declined by CMS'});
                    newWinLossOptions.push({ label:'Ineligible', value:'Ineligible'});
                    newWinLossOptions.push({ label:'Mapped', value:'Mapped'});
                    newWinLossOptions.push({ label:'Medicaid', value:'Medicaid'});
                    newWinLossOptions.push({ label:'No Lead Response', value:'No Lead Response'});
                    newWinLossOptions.push({ label:'Optima Group Member', value:'Optima Group Member'});
                    newWinLossOptions.push({ label:'Out of Coverage Area', value:'Out of Coverage Area'});
                    newWinLossOptions.push({ label:'PCP Not in Service Area', value:'PCP Not in Service Area'});
                    newWinLossOptions.push({ label:'Pharmacy Benefits', value:'Pharmacy Benefits'});
                    newWinLossOptions.push({ label:'Premium', value:'Premium'});                                        
                    newWinLossOptions.push({ label:'Unknown', value:'Unknown'});
                    newWinLossOptions.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    this.winLossOptions = newWinLossOptions;
                }

                else if((this.selectedStrategy == 'Medicare Retention' && this.selectedStage == 'Refused Offer'))
                {
                    this.winLossOptions = [];                                      
                    newWinLossOptions.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    newWinLossOptions.push({ label:'Moved Out of Coverage Area', value:'Moved Out of Coverage Area'});
                    newWinLossOptions.push({ label:'PCP Not in Service Area', value:'PCP Not in Service Area'});
                    newWinLossOptions.push({ label:'Pharmacy Benefits', value:'Pharmacy Benefits'});
                    newWinLossOptions.push({ label:'Premium', value:'Premium'});
                    newWinLossOptions.push({ label:'Unknown', value:'Unknown'});
                    newWinLossOptions.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    this.winLossOptions = newWinLossOptions;
                }

                else{                    
                    let key = this.winLossPicklist.controllerValues[this.selectedStage];            
                    this.winLossOptions = this.winLossPicklist.values.filter(opt => opt.validFor.includes(key));
                    this.winLossOptions.unshift(noneOption);
                }          
                
            }
            else {
                if(this.selectedStrategy == 'IFP Lead' && this.selectedStage == 'Lead'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'IFP Lead' && this.selectedStage == 'Qualified'){
                    winLossOptionsAgent.push({ label:'CSC Member Import', value:'CSC Member Import'});
                    winLossOptionsAgent.push({ label:'New Member', value:'New Member'});
                }
                else if(this.selectedStrategy == 'IFP Lead' && this.selectedStage == 'Quoted'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'IFP Lead' && this.selectedStage == 'Applied'){
                    winLossOptionsAgent.push({ label:'Age', value:'Age'});
                    winLossOptionsAgent.push({ label:'Already an Optima Member', value:'Already an Optima Member'});
                    winLossOptionsAgent.push({ label:'Application Expired', value:'Application Expired'});
                    winLossOptionsAgent.push({ label:'Broker Request', value:'Broker Request'});
                    winLossOptionsAgent.push({ label:'Cancelled', value:'Cancelled'});
                    winLossOptionsAgent.push({ label:'Chose not to apply', value:'Chose not to apply'});
                    winLossOptionsAgent.push({ label:'Customer Withdrawn', value:'Customer Withdrawn'});
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Deductible', value:'Deductible'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Mapped', value:'Mapped'});
                    winLossOptionsAgent.push({ label:'Medicaid', value:'Medicaid'});
                    winLossOptionsAgent.push({ label:'No Dental Included in Benefits', value:'No Dental Included in Benefits'});
                    winLossOptionsAgent.push({ label:'No Lead Response', value:'No Lead Response'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Optima Group Member', value:'Optima Group Member'});
                    winLossOptionsAgent.push({ label:'Out of Coverage Area', value:'Out of Coverage Area'});
                    winLossOptionsAgent.push({ label:'PCP Not in Service Area', value:'PCP Not in Service Area'});
                    winLossOptionsAgent.push({ label:'Pharmacy Benefits', value:'Pharmacy Benefits'});
                    winLossOptionsAgent.push({ label:'Premium', value:'Premium'});
                    winLossOptionsAgent.push({ label:'Unknown', value:'Unknown'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                }
                else if(this.selectedStrategy == 'IFP Manage Member' && this.selectedStage == 'Quote'){
                    winLossOptionsAgent.push({ label:'CSC Member Import', value:'CSC Member Import'});
                    winLossOptionsAgent.push({ label:'New Member', value:'New Member'});
                }
                else if(this.selectedStrategy == 'IFP Manage Member' && this.selectedStage == 'Delete Member'){
                    winLossOptionsAgent.push({ label:'CSC Member Import', value:'CSC Member Import'});
                    winLossOptionsAgent.push({ label:'New Member', value:'New Member'});
                }
                else if(this.selectedStrategy == 'IFP Retention' && this.selectedStage == 'Refused Offer'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Deductible', value:'Deductible'});
                    winLossOptionsAgent.push({ label:'Moved Out of Coverage Area', value:'Moved Out of Coverage Area'});
                    winLossOptionsAgent.push({ label:'PCP Not in Service Area', value:'PCP Not in Service Area'});
                    winLossOptionsAgent.push({ label:'Pharmacy Benefits', value:'Pharmacy Benefits'});
                    winLossOptionsAgent.push({ label:'Premium', value:'Premium'});
                    winLossOptionsAgent.push({ label:'Unknown', value:'Unknown'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                }
                else if(this.selectedStrategy == 'IFP Retention' && this.selectedStage == 'Renewal Pending'){
                    winLossOptionsAgent.push({ label:'CSC Member Import', value:'CSC Member Import'});
                    winLossOptionsAgent.push({ label:'New Member', value:'New Member'});
                }
                else if(this.selectedStrategy == 'Medicare Lead' && this.selectedStage == 'Lead'){
                    winLossOptionsAgent.push({ label:'Age', value:'Age'});
                    winLossOptionsAgent.push({ label:'Broker Request', value:'Broker Request'});
                    winLossOptionsAgent.push({ label:'Cancelled', value:'Cancelled'});
                    winLossOptionsAgent.push({ label:'Chose not to apply', value:'Chose not to apply'});
                    winLossOptionsAgent.push({ label:'Customer Withdrawn', value:'Customer Withdrawn'});
                    winLossOptionsAgent.push({ label:'Declined by CMS', value:'Declined by CMS'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Mapped', value:'Mapped'});
                    winLossOptionsAgent.push({ label:'Medicaid', value:'Medicaid'});
                    winLossOptionsAgent.push({ label:'No Lead Response', value:'No Lead Response'});
                    winLossOptionsAgent.push({ label:'Optima Group Member', value:'Optima Group Member'});
                    winLossOptionsAgent.push({ label:'Out of Coverage Area', value:'Out of Coverage Area'});
                    winLossOptionsAgent.push({ label:'PCP Not in Service Area', value:'PCP Not in Service Area'});
                    winLossOptionsAgent.push({ label:'Pharmacy Benefits', value:'Pharmacy Benefits'});
                    winLossOptionsAgent.push({ label:'Premium', value:'Premium'});
                    winLossOptionsAgent.push({ label:'Unknown', value:'Unknown'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                }
                else if(this.selectedStrategy == 'Medicare Lead' && this.selectedStage == 'Qualified'){
                    winLossOptionsAgent.push({ label:'Age', value:'Age'});
                    winLossOptionsAgent.push({ label:'Broker Request', value:'Broker Request'});
                    winLossOptionsAgent.push({ label:'Cancelled', value:'Cancelled'});
                    winLossOptionsAgent.push({ label:'Chose not to apply', value:'Chose not to apply'});
                    winLossOptionsAgent.push({ label:'Customer Withdrawn', value:'Customer Withdrawn'});
                    winLossOptionsAgent.push({ label:'Declined by CMS', value:'Declined by CMS'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Mapped', value:'Mapped'});
                    winLossOptionsAgent.push({ label:'Medicaid', value:'Medicaid'});
                    winLossOptionsAgent.push({ label:'No Lead Response', value:'No Lead Response'});
                    winLossOptionsAgent.push({ label:'Optima Group Member', value:'Optima Group Member'});
                    winLossOptionsAgent.push({ label:'Out of Coverage Area', value:'Out of Coverage Area'});
                    winLossOptionsAgent.push({ label:'PCP Not in Service Area', value:'PCP Not in Service Area'});
                    winLossOptionsAgent.push({ label:'Pharmacy Benefits', value:'Pharmacy Benefits'});
                    winLossOptionsAgent.push({ label:'Premium', value:'Premium'});
                    winLossOptionsAgent.push({ label:'Unknown', value:'Unknown'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                }
                else if(this.selectedStrategy == 'Medicare Retention' && this.selectedStage == 'Refused Offer'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Moved Out of Coverage Area', value:'Moved Out of Coverage Area'});
                    winLossOptionsAgent.push({ label:'PCP Not in Service Area', value:'PCP Not in Service Area'});
                    winLossOptionsAgent.push({ label:'Pharmacy Benefits', value:'Pharmacy Benefits'});
                    winLossOptionsAgent.push({ label:'Premium', value:'Premium'});
                    winLossOptionsAgent.push({ label:'Unknown', value:'Unknown'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                }
                else if(this.selectedStrategy == 'Medicare Retention' && this.selectedStage == 'Renewal Change Plan'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Moved Out of Coverage Area', value:'Moved Out of Coverage Area'});
                    winLossOptionsAgent.push({ label:'PCP Not in Service Area', value:'PCP Not in Service Area'});
                    winLossOptionsAgent.push({ label:'Pharmacy Benefits', value:'Pharmacy Benefits'});
                    winLossOptionsAgent.push({ label:'Premium', value:'Premium'});
                    winLossOptionsAgent.push({ label:'Unknown', value:'Unknown'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                }
                else if(this.selectedStrategy == 'Medicare Retention' && this.selectedStage == 'Renewal Pending'){
                    winLossOptionsAgent.push({ label:'CSC Member Import', value:'CSC Member Import'});
                    winLossOptionsAgent.push({ label:'New Member', value:'New Member'});
                }
                else if(this.selectedStrategy == 'Commercial Lead' && this.selectedStage == 'Accepted'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'Commercial Lead' && this.selectedStage == 'Lead'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'Commercial Sales' && this.selectedStage == 'Accepted'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'Commercial Sales' && this.selectedStage == 'Lead'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'DSNP Lead' && this.selectedStage == 'Enrolled'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'DSNP Lead' && this.selectedStage == 'Lead'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'DSNP Lead' && this.selectedStage == 'Qualified'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'HMO Lead' && this.selectedStage == 'Enrolled'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'HMO Lead' && this.selectedStage == 'Lead'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'HMO Lead' && this.selectedStage == 'Qualified'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'HMO MA Only' && this.selectedStage == 'Enrolled'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'HMO MA Only' && this.selectedStage == 'Lead'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                else if(this.selectedStrategy == 'HMO MA Only' && this.selectedStage == 'Qualified'){
                    winLossOptionsAgent.push({ label:'Decided on Group Plan', value:'Decided on Group Plan'});
                    winLossOptionsAgent.push({ label:'Ineligible', value:'Ineligible'});
                    winLossOptionsAgent.push({ label:'Non-Qualifying Event', value:'Non-Qualifying Event'});
                    winLossOptionsAgent.push({ label:'Terminate Member', value:'Terminate Member'});
                    winLossOptionsAgent.push({ label:'Went With Another Carrier', value:'Went With Another Carrier'});
                    winLossOptionsAgent.push({ label:'Withdrawn', value:'Withdrawn'});
                }
                this.winLossOptions = winLossOptionsAgent;
            }
        }
        else if(event.target.name == 'WinLoss') {
            this.selectedWinLossReason = event.target.value;
        }
    }

    startEdit() {
        this.editMode = true;
    }

    handleSubmit(event) {
        if(this.editMode){
            this.editMode = false;
            const fields = {};
            fields[ID_FIELD.fieldApiName] = this.recordId;
            fields[STRATEGY_FIELD.fieldApiName] = this.selectedStrategy;
            fields[STAGE_FIELD.fieldApiName] = this.selectedStage;
            fields[WINLOSS_FIELD.fieldApiName] = this.selectedWinLossReason;
            const recordInput = {fields};

            updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Picklist values updated',
                        variant: 'success'
                    })
                );
                return refreshApex(this.oppty);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating picklist values',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
        }
    }
}