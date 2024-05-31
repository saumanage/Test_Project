import { api, LightningElement, track } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

export default class QE_LWCRehireEmployeeSelect extends OmniscriptBaseMixin(LightningElement) {

    @track value = 'Please Select';
    @track selectOption;


    handleChange(event) {
        this.value = event.detail.value;
        this.omniApplyCallResp({ selRehireRule: this.value });
    }

    @api
    get opt() {
        return this._opt;
    }
    set opt(data) {
        console.log('this.data>>' + data);
        this._opt = data;
        this.setSelectOptions();
    }

    setSelectOptions() {
        let selopt = [];
        console.log('this._opt>>' + this._opt);
        if (this._opt != null) {
            let myarray = this._opt.split(';');
            
            for (var i = 0; i < myarray.length; i++) {
                console.log('Rule' + myarray[i]);
                selopt.push({ label: myarray[i], value: myarray[i] })
            }
        }
        this.selectOption = selopt;
    }
}