import { LightningElement, api } from 'lwc';
export default class ModalDemoInLWC extends LightningElement {
    isShowModal = false;
    @api recordId;

    showModalBox() {  
        this.isShowModal = true;
    }

    hideModalBox() {  
        this.isShowModal = false;
    }
}