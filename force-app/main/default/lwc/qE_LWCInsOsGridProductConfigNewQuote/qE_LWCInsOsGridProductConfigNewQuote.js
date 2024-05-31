import { api, LightningElement } from 'lwc';
import insOsGridProductConfig from 'vlocity_ins/insOsGridProductConfig';
import templ from './qE_LWCInsOsGridProductConfigNewQuote.html';
import pubsub from 'vlocity_ins/pubsub';
import { clientRules, dataFormatter, commonUtils } from 'vlocity_ins/insUtility';

export default class QE_LWCInsOsGridProductConfigNewQuote extends insOsGridProductConfig {
    @api rateValues;

    get cellLabel() {
        return `${this.theme}-col ${this.theme}-size_1-of-1 ${this.theme}-m-bottom_medium ${this.theme}-p-horizontal_x-small`;
    }
    get displayRates() {
        if(!this.rateValues.isApprovedQuote && this.rateValues.insuredType === 'Fully Insured' && parseInt(this.rateValues.empSize ) > 50 && parseInt(this.rateValues.empSize ) <= 150){
            return  false;
        }else if(!this.rateValues.isApprovedQuote && this.rateValues.insuredType === 'BusinessEDGE' || this.rateValues.insuredType === 'Self Funded' || this.rateValues.insuredType === 'Level Funded'){
            return  false;
        }else if(this.rateValues.marketSegment && this.rateValues.marketSegment === 'Large Group'){
            return false;
        }
        else{
            return  true;

        }
    }

    addToCartProd(){
        this.product.isSelected = !this.product.isSelected;
        pubsub.fire(this.rootChannel, 'addCartProdEvent', { detail: this.product });
        if (this.product.isSelected) {
            commonUtils.showSuccessToast.call(this, 'Your plan configuration successfully added to the cart.');
        }
    }
    render() {
        return templ;
    }
}