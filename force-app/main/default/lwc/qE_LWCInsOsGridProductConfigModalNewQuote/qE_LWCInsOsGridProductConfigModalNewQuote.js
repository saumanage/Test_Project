import { api, LightningElement } from 'lwc';
import insOsGridProductConfigModal from 'vlocity_ins/insOsGridProductConfigModal';

export default class qE_LWCInsOsGridProductConfigModalNewQuote extends insOsGridProductConfigModal {
    @api rateValues;
    @api selectedProducts;

    get displayAddToCart() {
        let attrs = this.product.attributeCategories.records;
        let prodAttrs = attrs.find(at => at.Code__c === "Product_Attributes")
        let rxbene;
        if( prodAttrs && prodAttrs.productAttributes && !!prodAttrs.productAttributes.records){
            rxbene = prodAttrs.productAttributes.records.find(pa => pa.code === "PrescriptionDrugCoverage")
            console.log('PrescriptionDrugCoverage', rxbene ? JSON.stringify(rxbene) : rxbene)
            
        }
        let productConfIsSelected = this.selectedProducts.find(p => p.RxId === this.product.Id + rxbene.userValues );
       
        return ( ((parseInt(this.rateValues.empSize ) > 50 && parseInt(this.rateValues.empSize ) <= 150 ) || this.rateValues.insuredType === "Level Funded") && !productConfIsSelected)
    }
    get displayRemoveFromCart() {
        return (this.product.isSelected && !((parseInt(this.rateValues.empSize ) > 50 && parseInt(this.rateValues.empSize ) <= 150 ) || this.rateValues.insuredType === "Level Funded") )
    }
    
    openProductConfigModal(payload) {
        this.product = { ...payload.product };
        this.resetProduct = { ...payload.product };
        this.modalTitle = this.labels.Edit + ' ' + this.product.Name;
        this.attrChanges = false;
        this.template.querySelector('vlocity_ins-modal').openModal();
    }
    
}