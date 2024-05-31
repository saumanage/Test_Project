/*******************************************************************************************
* @Name         qE_LWCLinkReport
* @Description  This class builds the URL for BA Portal Buttons to view specific reports.
*
*******************************************************************************************
* MODIFICATION LOG
* Version       Developer           Date        Description
*-------------------------------------------------------------------------------------------
*  1.0          Matthew Shoemate    10/4/2023   Initial Creation
*******************************************************************************************/

import { api, LightningElement } from 'lwc';

export default class QE_LWCLinkReport extends LightningElement {
    @api recordId;
    @api Id;
    @api linkName;
    @api recordType;
    
    get url(){
        //return `/benefit/s/report/${this.Id}`//  ?reportFilters=[{"operator":"equals","value":${this.recordId},"column":"ACCOUNT_ID"}]`
        
        if(this.linkName == "Employee Census Report" && this.recordType == "Group")
            return `/${location.pathname.includes('benefit') ? 'benefit' : 'broker'}/s/report/${this.Id}?reportFilters=[{"operator":"equals","value":"${this.recordId}","column":"Contact.QE_Group__c.Id"}]`;
        else if(this.linkName == "Employee Census Report"  && this.recordType == "Group Division")
            return `/${location.pathname.includes('benefit') ? 'benefit' : 'broker'}/s/report/${this.Id}?reportFilters=[{"operator":"equals","value":"${this.recordId}","column":"Account.Id"}]`;
        else if(this.linkName == "Current Election Benefit Detail" && this.recordType == "Group")
            return `/${location.pathname.includes('benefit') ? 'benefit' : 'broker'}/s/report/${this.Id}?reportFilters=[{"operator":"equals","value":"${this.recordId}","column":"Contact.QE_Group__c.Id"}]`;
        else if(this.linkName == "Current Election Benefit Detail" && this.recordType == "Group Division")
            return `/${location.pathname.includes('benefit') ? 'benefit' : 'broker'}/s/report/${this.Id}?reportFilters=[{"operator":"equals","value":"${this.recordId}","column":"Contact.Account.Id"}]`;
        else if(this.linkName == "Benefit Summary Report" && this.recordType == "Group" )
            return `/${location.pathname.includes('benefit') ? 'benefit' : 'broker'}/s/report/${this.Id}?reportFilters=[{"operator":"equals","value":"${this.recordId}","column":"Contact.QE_Group__c.Id"}]`;
        else if(this.linkName == "Benefit Summary Report" && this.recordType == "Group Division" )
            return `/${location.pathname.includes('benefit') ? 'benefit' : 'broker'}/s/report/${this.Id}?reportFilters=[{"operator":"equals","value":"${this.recordId}","column":"Contact.Account.Id"}]`;
        else if(this.linkName == "Enrollment Tasks" && this.recordType == "Group")
            return `/${location.pathname.includes('benefit') ? 'benefit' : 'broker'}/s/report/${this.Id}?reportFilters=[{"operator":"equals","value":"${this.recordId}","column":"PARENT_ID"}]`;
        else if(this.linkName == "Enrollment Tasks" && this.recordType == "Group Division")
            return `/${location.pathname.includes('benefit') ? 'benefit' : 'broker'}/s/report/${this.Id}?reportFilters=[{"operator":"equals","value":"${this.recordId}","column":"ACCOUNT_ID"}]`;
        else if(this.linkName == "Pending Election Benefit Detail" && this.recordType == "Group")
            return `/${location.pathname.includes('benefit') ? 'benefit' : 'broker'}/s/report/${this.Id}?reportFilters=[{"operator":"equals","value":"${this.recordId}","column":"Contact.QE_Group__c.Id"}]`;
        else if(this.linkName == "Pending Election Benefit Detail" && this.recordType == "Group Division")
            return `/${location.pathname.includes('benefit') ? 'benefit' : 'broker'}/s/report/${this.Id}?reportFilters=[{"operator":"equals","value":"${this.recordId}","column":"Contact.Account.Id"}]`;
        else
            return `/${location.pathname.includes('benefit') ? 'benefit' : 'broker'}/s/report/${this.Id}`;
    }
}