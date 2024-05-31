import { LightningElement } from 'lwc';
import CellOOA from './qE_LWCDisplayListCustomTable_ooa.html';
import LightningDatatable from 'lightning/datatable';

export default class QE_LWCDisplayListCustomTable extends LightningDatatable {
    static customTypes = {
        CellOOA: {
            template: CellOOA,
            typeAttributes: ['ooa','context','relationship'],
        },
    };
}