import { api } from 'lwc';
import insOsGridCart from 'vlocity_ins/insOsGridCart';

export default class QE_LWCInsOsGridCart extends insOsGridCart {
    @api rateValues;
    @api reviewCartOpened = false;
   
    // Edit Selection custom function 
    editSelection(event) {
        if(event.target.dataset.productStep == undefined) {
            event.target.dataset.productStep = "PlansForEditClone";
        }
        super.editSelection(event);
    }
}