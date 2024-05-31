import { LightningElement } from 'lwc';
import insCensus from 'vlocity_ins/insCensus';
//import insOSCensusTemplate from "./qE_LWCCensusGeneric.html";
//import insOSCensusTemplate from 'vlocity_ins/insOsCensus/insOsCensus.html';

import { api, track } from 'lwc';
//import insOSCensus from 'vlocity_ins/insOsCensus';
import { omniscriptUtils, commonUtils, dataFormatter } from 'vlocity_ins/insUtility';
import { namespace } from 'vlocity_ins/utility';
import moment from "vlocity_ins/dayjs";
import {DebugSrv} from 'c/qE_LWCSharedUtil';

export default class QE_LWCCensusGeneric extends insCensus {
    /*render() {
        return insOSCensusTemplate;
    }*/
   // @api name;
    /*@api get newRecordId (){
        return this.recordId;
        }
        set newRecordId(val){
            this.recordId = val;
        }*/
     @api recordId;
     connectedCallback() {
         /*this.censusTemplateName = '/resource/OptimaCensusTemplate';
         this.fieldsetName = 'Mid Sized Group';
         this.censusId = 'a4J5C000000bXw7UAE';*/
         this.objectApiName = 'Vlocity_ins__GroupCensus__c';
         //this.recordId = 'a4J5C000000bXw7UAE';
         //this.isLoaded = true;
         super.recordId = this.recordId;
         super.connectedCallback();
         /*this.getRecordData({ recordId: "$recordId", objectFields: this.fields })
            .then(data => {
                //this.contacts = data;
                //this.error = null;
                console.log('Data:: ' + data);
            }).catch(error => {
                //this.contacts = null;
                consol.log('Error:: ' + error);
            });
        */
         //this.loadCensus();
         console.log('this.fields:: ' + this.fields + super.fields + 'ObjectFiels::' + this.objectFields);
         console.log('this.censusId:: ' + this.censusId);
         console.log('this.census:: ' +  this.census);
         console.log('this.accountId:: ' +  this.accountId);
         console.log('this.objectApiName:: ' + this.objectApiName);
         console.log('this.recordId:: ' + this.recordId);
         console.log('super.recordId:: ' + super.recordId);
     }
     
     loadCensus (){
         console.log('In LoadCensus');
     }
}