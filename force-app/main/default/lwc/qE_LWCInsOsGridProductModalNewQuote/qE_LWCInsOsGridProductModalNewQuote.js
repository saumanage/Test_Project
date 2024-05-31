import { api, LightningElement } from 'lwc';
import insOsGridProductModal from 'vlocity_ins/insOsGridProductModal'
import temp from './qE_LWCInsOsGridProductModalNewQuote.html';

export default class QE_LWCInsOsGridProductModalNewQuote extends insOsGridProductModal {
    @api rateValues;
    get displayRates() {
        if(this.rateValues.insuredType === 'Fully Insured' && parseInt(this.rateValues.empSize ) > 50 && parseInt(this.rateValues.empSize ) <= 150){
            return  false;

        }else if(this.rateValues.insuredType === 'BusinessEDGE' || this.rateValues.insuredType === 'Self Funded' || this.rateValues.insuredType === 'Level Funded'){
            return  false;
        }else if(this.rateValues.marketSegment && this.rateValues.marketSegment === 'Large Group'){
            return false;
        }
        else{
            return  true;

        }
    }
    openProductModal(payload) {
        const isCart = (payload.isCart === 'true' || payload.isCart === true);
        this.isEditable = payload.isEditable;
        this.modalTitle = this.labels.InsComparePlans;
        this.hideHeader = payload.products.length === 1;
        this.hideFooter = !isCart;
        this.compareLimit = payload.compareLimit;
        this.selectBtnFn = payload.selectBtnFn;
        this.products = this.formatData([...payload.products]);

        if (this.hideHeader) {
            this.product = this.products[0];
            let label = this.isEditable ? this.labels.Edit : this.labels.View;
            this.modalTitle = label + ' ' + this.product.Name;
            this.price = this.product.Price || 0;
        }

        this.template.querySelector('vlocity_ins-modal').openModal();
    }
    backToCart() {
        this.template.querySelector('vlocity_ins-modal').closeModal();
        pubsub.fire(this.rootChannel, 'backToCart');
    }
    render() {
        return temp;
    }
}