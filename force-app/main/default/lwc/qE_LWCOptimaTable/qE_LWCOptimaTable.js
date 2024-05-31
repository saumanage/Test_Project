import { api, LightningElement, track } from 'lwc';
import dataTable from "vlocity_ins/dataTable";
import templ from "./qE_LWCOptimaTable.html";

const COLUMNS = [
    { label: 'Name', fieldName: 'Name', hideDefaultActions: true, },
    { label: 'Street', fieldName: 'Street', hideDefaultActions: true, },
    { label: 'City', fieldName: 'City', hideDefaultActions: true, },
    { label: 'State', fieldName: 'State', hideDefaultActions: true, }
];

export default class qE_LWCOptimaTable extends dataTable {
    @api recordId;
    @api displayactions;
    columnsTable = COLUMNS;
    data = [];
    record = {};

    connectedCallback() {
        super.connectedCallback();
        let parsedResult = JSON.parse(JSON.stringify(this.records));
        this.data = parsedResult[0].GroupDivision;
        console.log('columns', this.columnsTable);
        console.log('parsedResult', parsedResult);
        console.log('records', JSON.stringify(this.records));
        console.log('data', JSON.stringify(this.data));
    }

    render() {
        return templ;
    }
}