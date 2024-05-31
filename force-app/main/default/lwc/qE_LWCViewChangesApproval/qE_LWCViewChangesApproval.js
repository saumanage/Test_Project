import { api, LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import util from "vlocity_ins/utility";

export default class QE_LWCViewChangesApproval extends LightningElement {

    @api 
    get recordId(){
        return this._recordId;
    };
    set recordId(data){
        this._recordId = data;
    }
    @api taskid;
    @api textbutton;
    @api texttoast;
    @api variant;
    historyApproval = {
        type : "Dataraptor",
        value : {
            bundleName : "QE_DrUpdateMemberAndTask",
            inputMap : "{}",
            optionsMap : "{}"
        } 
    };

     historyApproval2 = {
        type : "IntegrationProcedures",
        value : {
            ipMethod : "QE_IPMemberTaskApproval",
            inputMap : "{}",
            optionsMap : "{}"
        } 
    };

    connectedCallback(){
        console.log('QE_LWCViewChangesApproval', this.textbutton);
    }
    approveChanges(){
        this.historyApproval2.value.inputMap = JSON.stringify({
            taskId: this.taskid,
            Status: "Completed",
            ContactId:  this._recordId,
            PendingApproval: false
        });
        util.getDataHandler(JSON.stringify(this.historyApproval2))
            .then(resultString => {
            // console.log('QE_LWCViewChangesApproval IP Result: ', JSON.stringify( resultString));
                const toast = new ShowToastEvent({
                    "title": this.texttoast,
                    "mode": "sticky",
                    "variant": this.variant
                });
                this.dispatchEvent(toast);
                setTimeout(() => {
                    location.reload();
                },2000)
        })
        
    }
}