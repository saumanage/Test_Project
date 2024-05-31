import { LightningElement, api, track } from 'lwc';
import {OmniscriptBaseMixin} from 'vlocity_ins/omniscriptBaseMixin'

export default class QE_LWCEditAssignedCategories extends OmniscriptBaseMixin(LightningElement) {

    @api assigned;
    @api attributes;
    @api 
    get categories(){
        return this._categories;
    };

    set categories(data){
        console.log('Setting categories');
        this._categories = data;
        if(data && this.attributes ){
            this.calculateData();

        }
    }
   

    @track catData = [];

    connectecCallback(){
        
    }

    calculateData(){
        console.log('QE_LWCEditAssignedCategories')
        this.catData = this.categories.map(cat => {
            let assigned = this.assigned && this.assigned.find(attr => attr.Name === cat.Name); 
            return {
                name: cat.Name,
                catId: cat.Id,
                options: [{label: "None",value: ''}].concat(this.attributes.filter(attr => attr.Categories === cat.Name)
                                        .map(attr => ({label: attr.Values, value: attr.ValuesId}))),
                value: assigned ? assigned.ValueId: '',
                valueP: assigned ? assigned.ValueId: '',
                catAssId: assigned ? assigned.Id: null
            }
        })
    }
    handleToggleSection(){

    }

    handleChange(ev){
        console.log(ev);
        let selection = this.catData.find(cat => ev.currentTarget.dataset.catname ===  cat.name );
        selection.value = ev.detail.value;

        if( ev.detail.value != null && ev.detail.value != "" ) {
            selection.valueP = ev.detail.value;
        }
        let selectedCategories = this.catData.map(c => ({category:c.name, catId: c.catId, value:c.value, valueP:c.valueP, catAssId:c.catAssId}))
        this.omniApplyCallResp({'selectedCategories' : selectedCategories })
    }
}