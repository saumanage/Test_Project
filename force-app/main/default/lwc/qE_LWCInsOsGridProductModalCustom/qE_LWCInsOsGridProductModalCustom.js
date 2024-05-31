import { api, track } from 'lwc';
import insOsGridProductModal from 'vlocity_ins/insOsGridProductModal';
import templ from "./qE_LWCInsOsGridProductModalCustom.html";

export default class QE_LWCInsOsGridProductModalCustom extends insOsGridProductModal {

    @track _showPrice = false;
    @api 
    get showPrice(){
        return this._showPrice === "true";
    }
    set showPrice(data){
        this._showPrice = data;
    }
    connectedCallback(){
        super.connectedCallback();
        
    }
    render() {
        return templ;
    }
    openProductModal(payload) {
        const isCart = (payload.isCart === 'true' || payload.isCart === true);
        this.isEditable = payload.isEditable;
        this.modalTitle = 'View';
        this.hideHeader = payload.products.length === 1;
        this.hideFooter = !isCart;
        this.compareLimit = payload.compareLimit;
        this.selectBtnFn = payload.selectBtnFn;
        let tempProducts = payload.products ? JSON.parse(JSON.stringify(payload.products)) : [];
        this.products = this.formatData([...tempProducts]);

        if (this.hideHeader) {
            this.product = this.products[0];
            this.modalTitle =  this.product.Name;
            this.price = this.product.Price || 0;
        }
        this.template.querySelector(".vloc-ins-productmodal").openModal();
        this.isLoaded = true;


    }
}