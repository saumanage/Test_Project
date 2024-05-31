import { api, LightningElement } from 'lwc';
import dataTableCell from 'vlocity_ins/dataTableCell';

export default class QE_LWCOptimaDatatableCell extends dataTableCell {
    
    set type(value) {
        this._type = value
    }
    @api
    get type() {
        return this._type;
    }
}