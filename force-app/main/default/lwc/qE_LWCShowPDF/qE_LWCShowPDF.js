import { LightningElement } from 'lwc';
import {OmniscriptBaseMixin} from 'vlocity_ins/omniscriptBaseMixin';
import templ from "./qE_LWCShowPDF.html";

export default class QE_LWCShowPDF extends OmniscriptBaseMixin(LightningElement) {

    render() {
        return templ;
    }

    handleClick(ev) {
        if( this.omniJsonData.userProfile == 'System Administrator' ) {
            window.open('/resource/OOA_FAQ', '_blank');
        }else {
            window.open('/sfsites/c/resource/OOA_FAQ', '_blank');
        }
    }
}