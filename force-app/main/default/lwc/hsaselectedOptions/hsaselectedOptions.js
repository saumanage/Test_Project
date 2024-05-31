import { LightningElement, api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

export default class HsaselectedOptions extends OmniscriptBaseMixin(LightningElement) {

    
    @api isHSADefault = false;
    value;

    get options() {
        return [
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' },
        ];
    }

    connectedCallback(){

        if(this.isHSADefault){
            this.value = 'true';
        }
        

    }

    handleChange(event) {
        
        const selectedOption = event.detail.value;
        this.omniApplyCallResp({ isHSADefault: selectedOption });

        console.log('Option selected with value: ' + selectedOption);
        console.log('omniJsonData = '+JSON.stringify(this.omniJsonData));
    }

}