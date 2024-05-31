import { LightningElement,api } from 'lwc';
import {FlowNavigationNextEvent} from 'lightning/flowSupport';

const columnsMap = new Map([['modifiedByUser' , 'Modified By'], ['episodeStatus' ,'Episode Status' ],
                            ['createdByName', 'Created By Name'], ['episodeTypeCd', 'Episode Type'],
                            ['jivaEpisodeId', 'Episode Id'], ['referralReasonDesc', 'Referral Reason Description'],
                            ['episodeStartDt', 'Episode Start Date'], ['createdDt', 'Created Date']]);
export default class CustomTableComponent extends LightningElement {
    columnsMap = columnsMap;
    @api inputData;
    @api inputColumns;
    @api outputColumns;
    @api authNumber;
    @api memberDetail;
    @api showButton;
    @api episodeIdField;
    memberDetailMap;
    data=[];
    columnArray = [];
    columns = [];
    connectedCallback(){
        console.log('connectedCallback');
        this.setColumns();
        this.handleData();
    }
    //set up the columns to display
    setColumns(){
        console.log(this.inputColumns);
        this.columnArray = this.inputColumns.split(',');
        console.log('columnArray - ',this.columnArray);  
        this.columnArray.forEach(field => {
            this.columns.push({
                label: this.columnsMap.get(field),
                fieldName: field,
                type: 'text'
            });
        });
        this.outputColumns = JSON.stringify(this.columns);
        if(this.showButton){
            //add a view more button
            this.columns.push(
                {type: "button", typeAttributes: {  
                    label: 'View',  
                    name: 'View',  
                    title: 'View',  
                    disabled: false,  
                    value: 'view',  
                    iconPosition: 'left'  
            }});
        }
        console.log(this.columns);            
    }
    //set up a map
    handleData(){
        this.data = JSON.parse(this.inputData);
        this.memberDetailMap = new Map();
        this.data.forEach(detail => {
            this.memberDetailMap.set(detail[this.episodeIdField],detail);
        });
        console.log(this.memberDetailMap);
    }
    //get the episode ID and move on to the next screen
    callRowAction(event) { 
        this.authNumber = event.detail.row[this.episodeIdField];
        let selectedEpisode = this.memberDetailMap.get(this.authNumber);
        this.memberDetail = JSON.stringify(selectedEpisode);
        console.log('member '+this.memberDetail);
        const nextNavigationEvent = new FlowNavigationNextEvent();       
        this.dispatchEvent(nextNavigationEvent);
    }  
    
}