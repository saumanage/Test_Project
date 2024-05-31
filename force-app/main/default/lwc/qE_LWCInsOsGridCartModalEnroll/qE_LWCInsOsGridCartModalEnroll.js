import insOsGridCartModal from 'vlocity_ins/insOsGridCartModal';

export default class QE_LWCInsOsGridCartModalEnroll extends insOsGridCartModal {

    openCartModal(payload) {
        this.products = [...payload.products];
        this.template.querySelector('vlocity_ins-modal').openModal();
    }

    closeCartModal() {
        this.template.querySelector('vlocity_ins-modal').closeModal();
    }
}