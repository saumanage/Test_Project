import { api,track } from 'lwc';
import insOsGridProductRow from 'vlocity_ins/insOsGridProductRow';
import temp from './qE_LWCInsOsGridProductRow_tile.html';
import tempc from './qE_LWCInsOsGridProductRow_compact.html';
import pubsub from 'vlocity_ins/pubsub';

export default class QE_LWCInsOsGridProductRow extends insOsGridProductRow {
    @api reviewCartOpened = false;
    @api showConfigButton;
    @api planType;
    @track selectedProduct;
    @api dependentAge;
    @api dependentRelation;
    @api spouseAge;
    @api isCityOfSuffolkGroup;

    get dependentEmployeeAge(){
        return this.dependentAge;
    }

    get spouseAges(){
        return this.spouseAge;
    }

    get urlExist() {
        console.log('urlExist method called ');
        return this.product.hasOwnProperty("QE_Summary_of_Benefits__c") && this.product.QE_Summary_of_Benefits__c;
    }

    get isPlanTypeMedical(){
        console.log('isPlanTypeMedical method called ');
        return this.planType === "Medical";
    }

    get isPlanTypeCrticalIllness(){
        console.log('this.isCityOfSuffolkGroup = '+this.isCityOfSuffolkGroup);
        console.log('selectedProduct = '+JSON.stringify(this.selectedProduct) + ' this.planType= '+ this.planType)
        console.log('selectedProduct = '+this.selectedProduct)
        if(this.selectedProduct === undefined || this.selectedProduct){
            this.selectedProduct = this.product; 
        }
        return this.product.isSelected && this.planType === "CriticalIllness" && this.isCityOfSuffolkGroup;
    }
    
    render() {
        console.log('render method called ');
        return this.showProductTile ? temp : tempc;
    }
    get showDetails() {
        console.log('showDetails method called ');
        return !this.hiddenActions || !this.hiddenActions.includes('details');
    }
    get productRowTileClasses() {
        console.log('productRowTileClasses method called ');
        let className = `${this.theme}-is-relative ${this.theme}-grid ${this.theme}-box ${this.theme}-wrap vloc-ins-product-tile-container`;
        if (this.product.originalPlan) {
            className += ' vloc-ins-renewal';
        }
        if (this.product.originalPlanSelected) {
            className += ' vloc-ins-existing-plan';
        }
        return className;
    }
    get isSelectedForCartClasses() {
        console.log('isSelectedForCartClasses method called ');
        this.tileButtonClasses += ' slds-button slds-button_brand'
        this.compactButtonClasses += ' slds-button slds-button_brand'
        let classes = this.showProductTile ? this.tileButtonClasses : this.compactButtonClasses;
        console.log('this.product.isSelected = '+this.product.isSelected);
        console.log('this.product.isSelected = '+JSON.stringify(this.product));
        this.selectedProduct = this.product;
        if (this.product.isSelected) {
            classes += ` ${this.theme}-is-selected`;
        }
        return classes;
    }

    openSummaryofBenefits() {
        console.log('openSummaryofBenefits method called ');
        if( this.product.hasOwnProperty("QE_Summary_of_Benefits__c") && this.product.QE_Summary_of_Benefits__c) {
            window.open(this.product.QE_Summary_of_Benefits__c);
        }
    }

   /* connectedCallback() {
        this.showProductTile = this.showProductTile === 'true';
        this.tileButtonClasses = `${this.theme}-button_stretch ${this.theme}-button_stateful`;
        this.compactButtonClasses = `${this.theme}-m-left_small ${this.theme}-button_icon-border-filled`;
        this.config = this.product.productConfig;
        // Set the attributes to be displayed from the product
        this.parsedAttributes = this.getEligibleAttributes();
        pubsub.register(this.rootChannel, this.pubsubPayload);
        console.log('PRice this product',this.price);
        console.log('this product',JSON.stringify(this.product));
    }

    HiglightSelectedProduct() {
        console.log("ghjkl", this.labels);
        // console.log("this.product", JSON.stringify(this.product));
        console.log("this.product.isSelected", this.product.isSelected);
        // this.dispatchEvent(new CustomEvent('higlightproduct', { detail: { Id: this._product.Id, isSelected: this.product.isSelected} }));
    }

    get showEditAction() {
        console.log("this.showConfigButton:::", this.showConfigButton);
        return this.showConfigInline !== 'true' && (!this.hiddenActions || !this.hiddenActions.includes('edit')) && this.showConfigButton ? true : false;
    }*/
}