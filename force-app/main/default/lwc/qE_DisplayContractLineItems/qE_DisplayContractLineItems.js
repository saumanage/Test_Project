import { LightningElement, track } from 'lwc';
import {OmniscriptBaseMixin} from 'vlocity_ins/omniscriptBaseMixin';
import templ from "./qE_DisplayContractLineItems.html";
import moment from "vlocity_ins/dayjs";
const columns = [
    { label: 'Available Plans', fieldName: 'Name', hideDefaultActions: true },
    { label: 'Plan Number', fieldName: 'Number', hideDefaultActions: true },
    { label: 'Effective Date', fieldName: 'EffectiveDateText', hideDefaultActions: true},
    { label: 'Status', fieldName: 'Status', hideDefaultActions: true }
]
export default class QE_DisplayContractLineItems extends  OmniscriptBaseMixin(LightningElement){
    @track contracts = [];
    @track columns = columns;
    @track selectedRows =[];

    connectedCallback(){
        console.log('Connedted callback');
        if( this.omniJsonData){
            console.log(this.omniJsonData);
            if(Array.isArray(this.omniJsonData.Plans) ){
                let tempData = [...this.omniJsonData.Plans];
                tempData = tempData.map(p => {
                    //2022-06-23T06:59:59.000Z
                    return {
                        ...p,
                        EffectiveDateText : p.EffectiveDate && p.EffectiveDate !== ""? moment(p.EffectiveDate, "YYYY-MM-DDTHH:mm:ss" ).format("YYYY-MM-DD"): ""
                    }
                })
                this.contracts = tempData;
            }
            //this.omniApplyCallResp({"SelectedContracts": null});
            //this.selectedRows= [this.omniJsonData.Plans.Id]; 
        }
    }
    getSelectedContract(ev){
        console.log(JSON.stringify(ev.detail));
        let selectedRow = ev.detail;
        if( selectedRow && selectedRow.hasOwnProperty('selectedRows') && Array.isArray(selectedRow['selectedRows']) ) {
            selectedRow = JSON.parse(JSON.stringify(selectedRow));
            selectedRow['selectedRows']['Id'] = selectedRow['selectedRows'].Id;
        }

        if( selectedRow && selectedRow.hasOwnProperty('selectedRows') && selectedRow['selectedRows'] /*&& selectedRow['selectedRows'].length > 0*/ ){
            console.log(JSON.stringify(selectedRow['selectedRows']));
            if( selectedRow['selectedRows'].length > 0 )
                this.omniApplyCallResp({"SelectedContracts": selectedRow['selectedRows']});
            else
                this.omniApplyCallResp({"SelectedContracts": null});
            //console.log(JSON.stringify(this.omniJsonData));
        }
    }
    render(){
        return templ;
    }
}