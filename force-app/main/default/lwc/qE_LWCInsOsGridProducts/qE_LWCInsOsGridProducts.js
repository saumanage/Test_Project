import { api } from 'lwc';
import insOsGridProducts from 'vlocity_ins/insOsGridProducts';
import pubsub from 'vlocity_ins/pubsub';

export default class QE_LWCInsOsGridProducts extends insOsGridProducts {

    @api reviewCartOpened = false;
    @api showConfigButton;
    @api planType;
    hasRendered = false;
    isCriticalIllness = false;
    @api dependentAge;
    @api dependentRelation;
    @api spouseAge;
    isRender = true;
    @api isCityOfSuffolkGroup;
    
    pubsubPayload = {
        // selectProduct: this.higlightProduct.bind(this),
    };

    
    connectedCallback() {
        console.log("inside optimaInsOsGridProducts:::"+this.isCityOfSuffolkGroup);
        this.isCriticalIllness = this.planType == "CriticalIllness";
        pubsub.register(this.rootChannel, this.pubsubPayload);
    }

    renderedCallback() {
        console.log("this.products rendered = "+JSON.stringify(this.products));
        // if(!this.hasRendered) {
        //     this.products = JSON.parse(JSON.stringify(this.products));
        //     for(let i = 0; i < this.products.length; i++) {
        //         if(this.products.isSelected) {
        //             this.template.querySelectorAll('[data-name="products"]')[i].classList.add('border-style');
        //         }
        //         // if(!selectedProduct.isSelected) {
        //         //     this.template.querySelectorAll('[data-name="products"]')[i].classList.remove('border-style');
        //         // }
        //         console.log("this.template.querySelectorAll--------::", this.template.querySelectorAll('[data-name="products"]')[i].classList);
        //     }
        // }
        // this.hasRendered = true;
    }

    higlightProduct(e) {
        const clickedProductId = e.detail;
        const selectedProduct = this.products.find(p => p.Id === clickedProductId);
        console.log("isSelected", selectedProduct);
        var products = this.template.querySelectorAll('[data-name="products"]');
        console.log("JSON.parse(JSON.stringify(products[0])-----------::", JSON.parse(JSON.stringify(products[0])));
        console.log(" this.template.querySelectorAll--------::",  this.template.querySelectorAll('[data-name="products"]'));
        for(let i = 0; i < this.template.querySelectorAll('[data-name="products"]').length; i++) {
            console.log("dataset-----------::", products[i].dataset);
            if(selectedProduct.isSelected && this.template.querySelectorAll('[data-name="products"]')[i].dataset.key == selectedProduct.Id) {
                this.template.querySelectorAll('[data-name="products"]')[i].classList.add('border-style');
                // if (selectedProduct) {
                //     selectedProduct.style = 'border-style slds-col slds-size_1-of-1 nds-col nds-size_1-of-1 bottom-margin';
                //     pubsub.fire(this.rootChannel, 'updateProduct', { product: selectedProduct });
                // }
            }
            if(!selectedProduct.isSelected && this.template.querySelectorAll('[data-name="products"]')[i].dataset.key == selectedProduct.Id) {
                this.template.querySelectorAll('[data-name="products"]')[i].classList.remove('border-style');
                // if (selectedProduct) {
                //     selectedProduct.style = 'border-style slds-col slds-size_1-of-1 nds-col nds-size_1-of-1 bottom-margin';
                //     pubsub.fire(this.rootChannel, 'updateProduct', { product: selectedProduct });
                // }
            }
            console.log("single product-----------::", JSON.parse(JSON.stringify(products[i])));
            console.log("product-----------::", products[i].dataset.key);
            console.log("this.template.querySelectorAll--------::", this.template.querySelectorAll('[data-name="products"]')[i].classList);
        }
        console.log("this.template.querySelectorAll-----------::", this.template.querySelectorAll('[data-id="0"]'));
        
    }

}