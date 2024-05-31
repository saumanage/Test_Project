import {LightningElement, api, wire} from 'lwc';
import {getRecord, getFieldValue} from 'lightning/uiRecordApi';
// import { updateRecord } from 'lightning/uiRecordApi';
const FIELDS = ['Account.OHP_Communication_Barrier__c'];
 export default class OhpLwcMessageUtility extends LightningElement {
     @api recordId;
     @api showMessage;
     @api maxWidth; // maxWidth is a number that is converted to a percentage
     @api messageType; // alert, inline, prompt, illustration
     @api messageTitle;
     @api messageBody;
          defaultMessageBody;
     @api messageVariant;
     @api showIcon;
     @api iconName = 'utility:check';
     @api iconSize = 'small';
     @api iconVariant = 'inverse';
     @api iconAlternativeText;
     @api allowClose;
     @api illustrationName;
     @api buttonLabel = 'Okay';
     @api allowCancel = false;

    @wire(getRecord, { recordId : '$recordId', fields : FIELDS })
    wiredAccount({error, data}) {
        console.log('sss');
        
        if(data) {
            console.log(data);
            let OHP_Communication_Barrier__c = "[!OHP_Communication_Barrier__c]";
            if(this.defaultMessageBody && this.defaultMessageBody.includes(OHP_Communication_Barrier__c)) {
                this.messageBody = this.defaultMessageBody.replace(OHP_Communication_Barrier__c, data.fields.OHP_Communication_Barrier__c['value']);
            }
        } else if(error) {
            console.log(error);
        }
    }
    connectedCallback() {
        this.defaultMessageBody = this.messageBody;
        // console.log(this.showMessage);
        // console.log(this.maxWidth);
        // console.log(this.messageType);
        // console.log(this.messageTitle);
        // console.log(this.messageBody);
        // console.log(this.messageVariant);
        // console.log(this.showIcon);
        // console.log(this.iconName);
        // console.log(this.iconSize);
        // console.log(this.iconVariant);
        // console.log(this.iconAlternativeText);
        // console.log(this.allowClose);
        // console.log(this.illustrationName);
        // console.log(this.buttonLabel);
        // console.log(this.allowCancel);
    }
    closeMessage(){
         this.showMessage = false;
         const closeEvent = new CustomEvent('close', { detail : true});
         this.dispatchEvent(closeEvent);
 
     }

     cancel() {
    //      console.log('cancel');
    //      const fields = {'Id' : this.recordId, 'OHP_Deceased__c' : 'No'};
    //      console.log(fields);
    //      const record = { fields };
    //      updateRecord(record).then(() => {
    //          this.showMessage = false;
    //      }).catch(error => {
    //          console.log(error);
    //      })
        this.showMessage = false;
        const cancelEvent = new CustomEvent('close', { detail : false});
        this.dispatchEvent(cancelEvent);
     }
 
     // Dynamic styles & rendering
 
     get isAlert(){
 
         return this.messageType === 'alert'
 
     }
 
     get alertMessageClass(){
 
         switch (this.messageVariant) {
             case 'info':
                 return 'slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_info';
             case 'warning':
                 return 'slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_warning';
             case 'error':
                 return 'slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_error';
             case 'offline':
                 return 'slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_offline';
             case 'success':
                 return 'slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_offline';
             default:
                 return 'slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_info';
         }
     }
 
     get inlineMessageClass(){
 
         switch (this.messageVariant) {
             case 'info':
                 return 'slds-box slds-m-bottom--medium slds-theme_info slds-theme_alert-texture';
             case 'warning':
                 return 'slds-box slds-m-bottom--medium slds-theme_warning slds-theme_alert-texture';
             case 'error':
                 return 'slds-box slds-m-bottom--medium slds-theme_error slds-theme_alert-texture';
             case 'offline':
                 return 'slds-box slds-m-bottom--medium slds-theme_offline slds-theme_alert-texture';
             case 'success':
                 return 'slds-box slds-m-bottom--medium slds-theme_success slds-theme_alert-texture';
             default:
                 return 'slds-box slds-m-bottom--medium slds-theme_info slds-theme_alert-texture';
         }
     }
 
     get promptMessageClass(){
 
         switch (this.messageVariant) {
             case 'info':
                 return 'slds-modal__header slds-theme_info slds-theme_alert-texture';
             case 'warning':
                 return 'slds-modal__header slds-theme_warning slds-theme_alert-texture';
             case 'error':
                 return 'slds-modal__header slds-theme_error slds-theme_alert-texture';
             case 'offline':
                 return 'slds-modal__header slds-theme_offline slds-theme_alert-texture';
             case 'success':
                 return 'slds-modal__header slds-theme_success slds-theme_alert-texture';
             default:
                 return 'slds-modal__header slds-theme_info slds-theme_alert-texture';
         }
     }
 
     get isInline(){
 
         return this.messageType === 'inline'
 
     }
 
     get isPrompt(){
 
         return this.messageType === 'prompt'
 
     }
 
     get isIllustration(){
 
         return this.messageType === 'illustration'
 
     }
 
     get containerWidth(){
 
         if(this.maxWidth){
 
             return 'max-width:' + this.maxWidth + '%';
 
         } else {
 
             return 'max-width:100%';
 
         }
 
     }
 
 
 }