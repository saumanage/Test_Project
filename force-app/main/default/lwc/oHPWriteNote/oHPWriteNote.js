import { LightningElement, track,wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createContentDocumentLink from '@salesforce/apex/OHPWriteNoteController.createContentDocumentLink';
import convertBaseSixtyFour from '@salesforce/apex/OHPWriteNoteController.convertBaseSixtyFour';
import fetchNotes from '@salesforce/apex/PrintNotesController.fetchNotes';  
import { refreshApex } from '@salesforce/apex';
import temp1 from './template1';
import temp2 from './template2';

const columns = [
    {
        label: 'Created Date', fieldName: 'strUrl', fixedWidth:150, type:'url', 
        typeAttributes:{
            label:{
                fieldName:'strCreatedDate'
            }
        }
    },
    { label: 'Body', fieldName: 'strNotes', wrapText: true,type:'text'}
];
export default class OHPWriteNote extends LightningElement {
    @api recordId;    
    @api objectNameApi;
    @track noteId;
    @track noteContent = '';
    disableBtn=false;
    fields = ['Title', 'Content'];
    error;
    columns = columns; 
    switchTemplate = false;
    @wire(fetchNotes, { strRecordId:'$recordId' })records;
    
    renderedCallback(){                
        this.disableBtn=true;
    }

    @api
    handleSubmit(event){        
        this.disableBtn=true;
        event.preventDefault();
        const fields = event.detail.fields;
        fields.Title="Title";
        convertBaseSixtyFour({noteCon:this.noteContent}).then(response =>{
            fields.Content=response;
            this.template.querySelector('lightning-record-edit-form').submit(fields);
        });
    }

    handleSuccess(event){        
        this.noteId=event.detail.id;
        this.handleReset(event);
        createContentDocumentLink({
            noteId: this.noteId,
            accountId:this.recordId
        })
        .then((result)=>{
            refreshApex(this.records);
        });
        const toastEvent = new ShowToastEvent({
            title: "Note successfully created",
            message: "ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(toastEvent);
        this.disableBtn=false;
    }
    render(){
        if(this.switchTemplate)
            return temp1;
        else return temp2;
    }
    handleReset(event){
        if(this.switchTemplate === true){
            this.switchTemplate = false;
        }
        else if(this.switchTemplate === false){
            this.switchTemplate = true;
        }
        this.template
          .querySelectorAll('lightning-input-rich-text')
          .forEach((input) => {
            input.setRangeText("", 0, input.value.length, "start");
          });
        this.template.querySelector('lightning-button[data-savebtn="savenote"]').disabled = true;
    }

    handleNoteChange(event) {        
        
        this.noteContent = event.target.value;        
        if(this.noteContent == undefined || this.noteContent == null || this.noteContent == '')
            this.template.querySelector('lightning-button[data-savebtn="savenote"]').disabled = true;
        else
            this.template.querySelector('lightning-button[data-savebtn="savenote"]').disabled = false;
    }
}