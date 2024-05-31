import { LightningElement,api } from 'lwc';
const noteColumns = [{label: 'Note Date', fieldName: 'noteDt', type: 'date'},
                    {label: 'Note', fieldName: 'noteText', type: 'text'},
                    {label: 'Addendum', fieldName: 'isAddendum', type: 'text'},
                    {label: 'Created By', fieldName: 'createdByName', type: 'text'},
                    {type: 'button', typeAttributes: {  
                            iconName: 'utility:preview',
                            label: 'View More',  
                            name: 'view',  
                            variant: 'bare',
                            alternativeText: 'view',        
                            disabled: false
                    }}];
export default class NoteComponent extends LightningElement {
    @api noteinfo;
    noteColumns = noteColumns;
    noteData=[];
    noteObject;
    connectedCallback(){
        console.log(this.noteinfo);
        this.handleNote(this.noteinfo);
    }
    //when the user clicks the button to view more
    handleRowAction(event) {
        const row = event.detail.row;
        console.log(row);
        this.noteObject = JSON.parse(JSON.stringify(row));
    }
    //handle the notes information
    handleNote(note){
        if(note != null){
            let noteArray = note.split(']');
            console.log(noteArray.length);
            for(let x in noteArray){
                console.log(noteArray[x].length);
                if(noteArray[x].length>0){
                    let tempNote = noteArray[x].replace('[','');
                    this.noteData.push(JSON.parse(tempNote));
                }
            }
        }
    }
}