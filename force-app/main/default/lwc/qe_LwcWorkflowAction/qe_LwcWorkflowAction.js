import { LightningElement, api, wire } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

//const FIELDS = ['Quote.Name', 'Quote.QE_Current_Workflow_Step__c'];

export default class Qe_LwcWorkflowAction extends OmniscriptBaseMixin(LightningElement) {

    @api recordid;
    @api nextsteps;
    @api userprofile;
    @api previousstep;
    comment = '';
    selectedStep;
    commentRequired = false;
    nextSteps;
    stepOptions;
    quote;
    task;
    currentWorkflowStepId;

    connectedCallback() {
        console.log('userprofile: '+this.userprofile);
        console.log('nextsteps: '+JSON.stringify(this.nextsteps));
        console.log('recordid: '+this.recordid);
        console.log('comment: '+this.comment);
        console.log('PName: '+this.previousstep.Name);
        console.log('POption: '+this.previousstep.Option);
        let options = [];
        let steps = new Map();
        if(this.nextsteps !== undefined) {
            if (!Array.isArray(this.nextsteps)) {
                this.nextsteps = [this.nextsteps];
            }
            for (let step of this.nextsteps) {
                if (step) {
                    console.log('Step: ' + step.Name);
                    options.push({
                        label: step.Name,
                        value: step.Id
                    })
                    steps.set(step.Id, step);
                }
            }
            if(this.previousstep.Option === true && this.previousstep.Name !== undefined && this.previousstep.Id !== undefined) {
                options.push({
                    label: this.previousstep.Name + ' Relook',
                    value: this.previousstep.Id
                })
                let prvName = this.previousstep.Name;
                let prvObj = JSON.parse(JSON.stringify(this.previousstep));
                prvObj.Name = prvName + ' Relook';
                steps.set(this.previousstep.Id, prvObj);
            }
            this.stepOptions = options;
            this.nextSteps = steps;
        }
        console.log('nextSteps: '+JSON.stringify([...this.nextSteps.entries()]));
        console.log('nextStepVal: '+JSON.stringify([...this.nextSteps.values()]));
    }


    setComment(event) {
        this.comment = event.target.value;
        console.log('Comment->'+this.comment);
        let commentData = {"comment":this.comment};
        //this.checkValidity();
        let validityCheck = {"commentvalidity":this.commentRequired?this.comment.length > 0?true:false:true};
        this.omniApplyCallResp(validityCheck);
        this.omniApplyCallResp(commentData);
    }

    handleSelect(event) {
        this.selectedStep = event.detail.value;
        console.log('Selected Step-->'+this.selectedStep);
        console.log(this.nextSteps.get(this.selectedStep).CommentsRequired);
        this.commentRequired = this.nextSteps.get(this.selectedStep).CommentsRequired;
        let workStep = {"workStep":this.nextSteps.get(this.selectedStep)};
        console.log('workStep: ' + JSON.stringify(workStep));
        //this.checkValidity();
        let validityCheck = {"commentvalidity":this.commentRequired?this.comment.length > 0?true:false:true};
        this.omniApplyCallResp(validityCheck);
        this.omniApplyCallResp(workStep);
    }

    // @api checkValidity() {
    //     let validityCheck;
    //     if(this.selectedStep) {
    //         validityCheck = this.commentRequired?this.comment.length > 0?true:false:true;
    //     }else {
    //         validityCheck = false;
    //     }
    //     console.log('validityCheck-->'+validityCheck);
    //     return validityCheck;
    // }

    handleSave() {
        console.log('selectedStep: ' + this.selectedStep);
        let workStep = this.nextSteps.get(this.selectedStep);
        console.log('workStep: ' + workStep);
        this.dispatchEvent(new CustomEvent('close'));
    }
}