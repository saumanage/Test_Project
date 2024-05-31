import { LightningElement } from 'lwc';
import outputField from 'vlocity_ins/outputField';

export default class QE_LWCOptimaOutputField extends outputField {
    formatUsPhone(e) {
        if(e){
            let t = new RegExp(/^((\+1)|1)? ?\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})( ?(ext\.? ?|x)(\d*))?$/);
            e = e.trim();
            let l = t.exec(e);
            return null !== l && l.length > 8 ? "(" + l[3] + ") " + l[4] + "-" + l[5] + (void 0 !== l[8] ? " x" + l[8] : "") : e
        }else{
            return "";
        }
    }
}