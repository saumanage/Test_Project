import { api, LightningElement } from 'lwc';
import insOsGridCartModal from 'vlocity_ins/insOsGridCartModal';

export default class QE_LWCInsOsGridCartModal extends insOsGridCartModal {
    @api rateValues;

    openCartModal(payload) {
        this.products = [...payload.products];
        this.template.querySelector('vlocity_ins-modal').openModal();
    }

    closeCartModal() {
        this.template.querySelector('vlocity_ins-modal').closeModal();
    }
}