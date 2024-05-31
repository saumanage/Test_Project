import { LightningElement, api } from 'lwc';
import {OmniscriptBaseMixin} from 'vlocity_ins/omniscriptBaseMixin';

export default class QE_LWCRedirectComponent extends OmniscriptBaseMixin(LightningElement) {

    @api buttonLabel;
    @api navigateTo;

    handleClick(){
        this.omniNavigateTo(this.navigateTo)
    }
}