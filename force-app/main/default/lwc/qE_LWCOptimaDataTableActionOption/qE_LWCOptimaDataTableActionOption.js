import { api, LightningElement } from 'lwc';

export default class QE_LWCOptimaDataTableActionOption extends LightningElement {
   
    @api action;
    @api row;

    get disableOption(){
        console.log(this.row)
        if(this.action.type === "ProductDetail"){
            let column = this.row.columns.find(c => c.fieldName === "PlanType");
            if(column.data.value === 'Medical'){
                return false;
            }else{
                return true;
            }
        }else{
            return false;
        }
        
    }


    handleSelect(e){
        console.log('privateselect QE_LWCOptimaDataTableActionOption')
        this.dispatchEvent(
            new CustomEvent('privateselect', {
                bubbles: true,
                cancelable: true,
                detail: e.detail
            })
        );
    }
}