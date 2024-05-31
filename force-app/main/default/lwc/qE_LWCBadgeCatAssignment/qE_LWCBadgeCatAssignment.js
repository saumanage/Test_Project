import { api, LightningElement } from 'lwc';

export default class QE_LWCBadgeCatAssignment extends LightningElement {

    @api records;

    get showCategories(){
        return this.records && this.records[0] && this.records[0].CatAssign;
    }
    get assignments(){
        return this.showCategories ? this.records[0].CatAssign : [];
    }
    connectedCallback(){
        console.log('QE_LWCBadgeCatAssignment')
    }
    // @api name;
    // @api value;

}