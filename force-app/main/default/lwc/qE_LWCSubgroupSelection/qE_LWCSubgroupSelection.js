import { LightningElement, track, api } from 'lwc';
import {OmniscriptBaseMixin} from 'vlocity_ins/omniscriptBaseMixin';
import templ from "./qE_LWCSubgroupSelection.html";
const columns = [
    { label: 'Name', fieldName: 'Name' },
]
export default class QE_LWCSubgroupSelection extends  OmniscriptBaseMixin(LightningElement){

    @api selectedLocation;
    //@api profileName;
    @track subgroups= [];
    @track columns = columns;
    @track selectedRows =[];

    connectedCallback(){
        console.log('Connedted callback');
        console.log('selectedLocation::::::', JSON.stringify(this.selectedLocation));

        //if( this.omniJsonData && this.omniJsonData.GroupRecordType && this.omniJsonData.GroupRecordType != 'Group Division' && this.omniJsonData.hasOwnProperty('GroupInfo') && this.omniJsonData.GroupInfo) {
            //this.subgroups.push(this.omniJsonData.GroupInfo);
        
            if( this.omniJsonData.hasOwnProperty('SubGroupInfo') && this.omniJsonData.SubGroupInfo && Array.isArray(this.omniJsonData.SubGroupInfo) ){
                this.subgroups.push(...this.omniJsonData.SubGroupInfo);
            }else{
                this.subgroups.push(this.omniJsonData.SubGroupInfo);
            }
            this.selectedRows = [this.selectedLocation];

            //this.selectedRows = this.profileName == 'System Administrator' ? [this.selectedLocation] : [this.omniJsonData.GroupInfo.Id];

        //}
        /*if( this.omniJsonData && this.omniJsonData.GroupRecordType && this.omniJsonData.GroupRecordType == 'Group Division'  
                && this.omniJsonData.hasOwnProperty('GroupDivision') && this.omniJsonData.GroupDivision
                && this.omniJsonData.hasOwnProperty('ParentGroupInfo') && this.omniJsonData.ParentGroupInfo) {
            this.subgroups.push(this.omniJsonData.ParentGroupInfo);
            
            if( this.omniJsonData.hasOwnProperty('GroupDivision') && this.omniJsonData.SubGroupInfo && Array.isArray(this.omniJsonData.GroupDivision) ){
                this.subgroups.push(...this.omniJsonData.GroupDivision);
            }else{
                this.subgroups.push(this.omniJsonData.GroupDivision);
            }
            this.selectedRows= [this.omniJsonData.GroupDivision.Id];            
        }*/
    }
    getSelectedName(ev){
        console.log(JSON.stringify(ev.detail));
        let selectedRow = ev.detail;
        if( selectedRow && selectedRow.hasOwnProperty('selectedRows') && Array.isArray(selectedRow['selectedRows']) ) {
            selectedRow = JSON.parse(JSON.stringify(selectedRow));
            selectedRow['selectedRows'][0]['locationId'] = selectedRow['selectedRows'][0].Id;
        }

        if( selectedRow && selectedRow.hasOwnProperty('selectedRows') && selectedRow['selectedRows'] && selectedRow['selectedRows'].length > 0 ) {
            this.omniApplyCallResp(selectedRow['selectedRows'][0]);
            this.omniApplyCallResp({"IsCobraGroup": selectedRow['selectedRows'][0]['IsCobra']});
        }
    }
    render(){
        return templ;
    }
}