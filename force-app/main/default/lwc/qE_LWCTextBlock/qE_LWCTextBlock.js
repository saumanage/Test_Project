import { LightningElement, track, api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

export default class QE_LWCTextBlock extends OmniscriptBaseMixin(LightningElement) {

    //@track childData;
    @api providerDetails;
    @track providerDetailsList = [];

    connectedCallback(){
        console.log(JSON.stringify(this.omniJsonData));
        console.log('providerDetails : '+this.providerDetails);
        //this.childData = this.omniJsonData.child.eleArray;
        //this.providerDetails = this.providerDetails;
        this.providerDetails = '[{"providerName":"Test", "providerNpi":"6576","specialtyName":"Spcl Test","phone":"65465465","city":"Albama","zip":"12007","state":"NY","acceptingNewPatients":"Yes"}]';
        this.providerDetailsList = JSON.parse(this.providerDetails);
    }
}