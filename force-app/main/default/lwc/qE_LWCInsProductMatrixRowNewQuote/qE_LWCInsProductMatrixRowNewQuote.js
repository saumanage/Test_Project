import { api, LightningElement } from 'lwc';
import insProductMatrixRow from 'vlocity_ins/insProductMatrixRow';
import temp from './qE_LWCInsProductMatrixRowNewQuote.html'; 

export default class QE_LWCInsProductMatrixRowNewQuote extends insProductMatrixRow {
    @api rateValues;
    get displaySelect(){
        // if(this.rateValues.insuredType === 'Fully Insured' && parseInt(this.rateValues.empSize ) > 50 && parseInt(this.rateValues.empSize ) <= 150){
        //     return  false;

        // }else{
            return false
        // }
    }
    get displayRates() {
        if(!this.rateValues.isApprovedQuote && this.rateValues.insuredType === 'Fully Insured' && parseInt(this.rateValues.empSize ) > 50 && parseInt(this.rateValues.empSize ) <= 150){
            return  false;

        }else if(!this.rateValues.isApprovedQuote && this.rateValues.insuredType === 'BusinessEDGE' || this.rateValues.insuredType === 'Self Funded' || this.rateValues.insuredType === 'Level Funded'){
            return  false;

        }else if(this.rateValues.marketSegment && this.rateValues.marketSegment === 'Large Group'){
            return false;
        }
        else{
            return  true;

        }
    }
    toggleSelect(event) {
        const recordId = event.currentTarget.dataset.recordId;
        this.selectBtnFn({ detail: {id: recordId, isCompare: true}});
        const index = event.currentTarget.dataset.recordIndex;
        this.contents[index].isSelected = !this.contents[index].isSelected;
    }
    render() {
        return temp
    }
}