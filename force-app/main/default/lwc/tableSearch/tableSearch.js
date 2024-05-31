import { LightningElement, wire, api} from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
import { loadStyle } from 'lightning/platformResourceLoader';
import WidthCSS from '@salesforce/resourceUrl/CSS';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getEvents from '@salesforce/apex/TableSearchController.getEvents';
import getAccountId from '@salesforce/apex/TableSearchController.getAccount';
import createCustomMeeting from '@salesforce/apex/TableSearchController.createCustomMeeting';

const columns = [
    { label: 'Event Date', fieldName: 'Event_Date_Formatted__c', type: 'Date' },
    { label: 'Event Time', fieldName: 'Event_Time__c', type: 'date', typeAttributes:{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true,timeZone:'UTC'}},
    { label: 'Venue Name', fieldName: 'Venue_Name__c', type: 'Text' },
    { label: 'Venue Address', fieldName: 'Venue_Address__c', type: 'Text' },
    { label: 'Venue City', fieldName: 'Venue_City__c', type: 'Text', cellAttributes: { alignment: 'left' } },
    { label: 'Venue Phone', fieldName: 'Venue_Phone__c', type: 'Phone' },
    { label: 'Venue Zip Code', fieldName: 'Venue_Zip_Code__c', type: 'Number' },
    { label: 'Number of Seats', fieldName: 'Number_of_Seats__c', type: 'Number' },
    { label: 'Venue State', fieldName: 'Venue_State__c', type: 'Text' },
    { label: 'Time Reserved', fieldName: 'Time_Reserved__c', type: 'Text' },
];

export default class TableSearch extends NavigationMixin(LightningElement) {
    //Sorting variables
    sortedDirection = 'asc';
    sortedBy = 'Event_Date_Formatted__c';

    @api recordId;
    accountId;
    selctedrow;
    meetingId;

    //Search keys
    venueStateFilter = '';
    eventDateFilter = '';
    venueCityFilter = '';
    venueZipCodeFilter = '';

    //Variables to store data
    error;
    result;
    items = [];
    data = [];
    results = [];
    columns; 

    //Pagination variables
    page = 1;
    allSelectedRows = [];
    startingRecord = 1;
    endingRecord = 0; 
    pageSize = 10;
    totalRecountCount = 0;
    totalPage = 0;
    isPageChanged = false;
    initialLoad = true;

    mapoppNameVsOpp = new Map();;

    renderedCallback() {
        Promise.all([
            loadStyle( this, WidthCSS )
            ]).then(() => {})
            .catch(error => {
                console.log( error.body.message );
        });

    }

    connectedCallback() {
        getEvents({})
            .then(result => {
                this.results = result;
                this.processRecords(result);
            })
            .catch(error => {
                this.error = error;
        });

        getAccountId({recordId : this.recordId})
            .then(result => {
                this.accountId = result;
                this.error = undefined;

                console.log(this.accountId);
            })
            .catch(error => {
                this.error = error;
        });


    }
  
    handleKeyChange( event ) {
        let filterLabel = event.target.label

        if(filterLabel == "Venue State"){
            this.venueStateFilter = event.target.value;
        }
        else if(filterLabel == "Event Date"){
            this.eventDateFilter = event.target.value;
        }
        else if(filterLabel == "Venue City"){
            this.venueCityFilter = event.target.value;
        }
        else if(filterLabel == "Venue Zip Code"){
            this.venueZipCodeFilter = event.target.value;
        }

        var data = [];
        for(var i=0; i<this.results.length;i++){
            if(this.results[i]!= undefined  && 
               this.results[i].Venue_State__c != undefined && 
               this.results[i].Event_Date_Formatted__c != undefined && 
               this.results[i].Venue_City__c != undefined && 
               this.results[i].Venue_Zip_Code__c != undefined &&
               this.results[i].Venue_State__c.toUpperCase().includes(this.venueStateFilter.toUpperCase()) &&
               this.results[i].Event_Date_Formatted__c.includes(this.eventDateFilter) && 
               this.results[i].Venue_City__c.toUpperCase().includes(this.venueCityFilter.toUpperCase()) && 
               this.results[i].Venue_Zip_Code__c.toString().includes(this.venueZipCodeFilter)){

                data.push(this.results[i]);
            }
        }
        this.processRecords(data);

    }

    processRecords(data){
        this.items = data;
        this.totalRecountCount = data.length; 
        this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
        
        this.data = this.items.slice(0,this.pageSize); 
        this.endingRecord = this.pageSize;
        this.columns = columns;
    }

    //Pagination starts here
    //clicking on previous button this method will be called
    previousHandler() {
        this.isPageChanged = true;
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
          var selectedIds = [];
          for(var i=0; i<this.allSelectedRows.length;i++){
            selectedIds.push(this.allSelectedRows[i].Id);
          }
        this.template.querySelector(
            '[data-id="table"]'
          ).selectedRows = selectedIds;
    }

    //clicking on next button this method will be called
    nextHandler() {
        this.isPageChanged = true;
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);            
        }
          var selectedIds = [];
          for(var i=0; i<this.allSelectedRows.length;i++){
            selectedIds.push(this.allSelectedRows[i].Id);
          }
        this.template.querySelector(
            '[data-id="table"]'
          ).selectedRows = selectedIds;
    }

    //this method displays records page by page
    displayRecordPerPage(page){

        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 

        this.data = this.items.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;
    }    
    
    sortColumns( event ) {
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
        return refreshApex(this.result);
        
    }
    
      //Single row selection in datatable 

      onRowSelection = event => {
        var selectedRows=event.detail.selectedRows;
        this.meetingId = selectedRows[0].Id;
        if(selectedRows.length>1)
        {
            var el = this.template.querySelector('lightning-datatable');
            selectedRows=el.selectedRows=el.selectedRows.slice(1);            
            event.preventDefault();
            return;
        }
    }

    //process selected row of data table.
    processSelectedRows(selectedOpps){
        var newMap = new Map();
        for(var i=0; i<selectedOpps.length;i++){
            if(!this.allSelectedRows.includes(selectedOpps[i])){
                this.allSelectedRows.push(selectedOpps[i]);
            }
            this.mapoppNameVsOpp.set(selectedOpps[i].Event_Date_Formatted__c, selectedOpps[i]);
            newMap.set(selectedOpps[i].Event_Date_Formatted__c, selectedOpps[i]);
        }
        for(let [key,value] of this.mapoppNameVsOpp.entries()){
            if(newMap.size<=0 || (!newMap.has(key) && this.initialLoad)){
                const index = this.allSelectedRows.indexOf(value);
                if (index > -1) {
                    this.allSelectedRows.splice(index, 1); 
                }
            }
        }
    }
    //Pagination ends here

    //Wire Function to get related AccountId
    /*@wire(getAccountId, {recId: "$recordId"})
    wiredOppotunity({ error, data }){
        if (data) {
            console.log(JSON.stringify(data));
            this.accountId=data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }*/

    //Onclick function to update Event with AccountId
    /*updateEventRecord(){
        var selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows();
        console.log(JSON.stringify(selectedRecords));
        selectedRecords.forEach(currentItem => {
        this.eventId = currentItem.Id
        });
        console.log(this.eventId);
        console.log(this.accountId);
        updateEvent({ accId : this.accountId, eventId : this.eventId })
        .then(result => {
            const event = new ShowToastEvent({
                title: 'Event Updated',
                message: 'Updated',
                variant: 'success'
            });
            this.dispatchEvent(event);
        })
        .catch(error => {
            const event = new ShowToastEvent({
                title : 'Error',
                message : 'Error creating contact. Please Contact System Admin',
                variant : 'error'
            });
            this.dispatchEvent(event);
        });
    }*/

    //Handle filter selection.
    handleAddMeetings( event ) {
        console.log(this.meetingId);
        console.log(this.accountId);
        createCustomMeeting({accountId : this.accountId, meetingId : this.meetingId})
            .then(result => {
                const messages = result;
                console.log(messages);
                const evt = new ShowToastEvent({
                    title: 'Toast message',
                    message: messages,
                    variant: 'info',
                    mode: 'dismissable'
                });
                this.dispatchEvent(evt);
            })
            .catch(error => {
                this.error = error;
        });

        //Custom event to close the model box.
        const addButtonAction = new CustomEvent("addbutton", {
            detail: ''
        });
        //this.dispatchEvent(addButtonAction);
    }
    
}