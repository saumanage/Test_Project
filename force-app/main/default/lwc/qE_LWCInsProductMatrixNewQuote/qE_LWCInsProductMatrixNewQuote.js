import { api, LightningElement } from 'lwc';
import temp from './qE_LWCInsProductMatrixNewQuote.html'
import insProductMatrix from 'vlocity_ins/insProductMatrix'

export default class QE_LWCInsProductMatrixNewQuote extends insProductMatrix {
    @api rateValues;

    
    render(){
        return temp;
    }
}