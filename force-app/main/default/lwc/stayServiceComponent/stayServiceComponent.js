import { LightningElement, api } from 'lwc';

export default class StayServiceComponent extends LightningElement {
    @api inputData;
    @api notes;
    column1=[];
    column2=[];
    type;
    connectedCallback(){
        this.setUpPage(JSON.parse(this.inputData));
    }
    //set up the data to display
    setUpPage(data){
        if(data!=null){
            console.log('service or stay data');
            console.log(data);
            //set up service or stay
            if(data.type=='Service'||data.type=='Stay'){
                this.type = data.type;
                let typeDecision = data.type.toLowerCase() + 'Decision';
                this.column1.push({label: 'Seq #',value:data.sequenceNo},
                                    {label: 'Place of Service',value:data.placeOfSvcDesc},
                                    {label: 'Service Type',value:data.serviceTypeCd},
                                    {label: 'Due Date',value:data.dueDt});
                this.column2.push({label: 'Decision',value:data[typeDecision].decisionDesc},
                                    {label: 'Decision Reason',value:data[typeDecision].decisionRsnDesc},
                                    {label: 'Decision Date',value:data[typeDecision].createdDt},
                                    {label: 'Assigned Start Date',value:data.assignedStartDt},
                                    {label: 'Assigned End Date',value:data.assignedEndDt});
                //Service Request specific fields                    
                if(data.type=='Service'){
                    this.column1.push({label: 'Requested Units',value:data.requestedUnits},
                                        {label: 'Procedure Type',value:data.procedureTypeCd},
                                        {label: 'Procedure Code',value:data.procedureCd},
                                        {label: 'Procedure',value:data.procedureDesc},
                                        {label: 'Procedure Modifier',value:data.procedureModifierDesc},
                                        {label: 'Request Received',value:data.requestReceivedDt});

                    this.column2.push({label: 'Assigned Units',value:data.serviceDecision.assignedUnits},
                                        {label: 'Denied Units',value:data.serviceDecision.deniedUnits},
                                        {label: 'Peer to Peer Consult',value:data.isPeerToPeerConsultationRequired},
                                        {label: 'Due Date Extended',value:data.isDueDtExtended});
                }
                 //Stay Request specific fields   
                else if(data.type=='Stay'){
                    this.column1.push({label: 'Expected Admit Date',value:data.expectedAdmitDt},
                                        {label: 'Requested Days',value:data.requestedDays},
                                        {label: 'Request Received Date',value:data.requestReceivedDt},
                                        {label: 'Due Date Extended?',value:data.isDueDtExtended},
                                        {label: 'Extended Due Date',value:data.extendedDueDt},
                                        {label: 'Is Extension?',value:data.isExtension},
                                        {label: 'Is Extended',value:data.isExtended});
                    
                    this.column2.push({label: 'Expected Admit Date',value:data.expectedAdmitDt},
                                        {label: 'Requested Days',value:data.requestedDays},
                                        {label: 'Request Received Date',value:data.requestReceivedDt},
                                        {label: 'Due Date Extended?',value:data.isDueDtExtended},
                                        {label: 'Extended Due Date',value:data.extendedDueDt},
                                        {label: 'Is Extension?',value:data.isExtension},
                                        {label: 'Is Extended',value:data.isExtended});
                }
            }else if(data.type=='appealStay'||data.type=='appealService'){
                this.setUpAppealPage(data);
            }
        }
    }
    //set up appeal stay or appeal service
    setUpAppealPage(data){
        this.column1.push({label: 'Seq #',value:data.sequenceNo},
                            {label: 'Service Type Desc',value:data.serviceTypeDesc},
                            {label: 'Place of Service',value:data.placeOfSvcDesc},
                            {label: 'Request Received Date',value:data.requestReceivedDt},
                            {label: 'Due Date',value:data.dueDt},
                            {label: 'Due Date Extended?',value:data.isDueDtExtended},
                            {label: 'Extended Due Date',value:data.extendedDueDt});
        
        this.column2.push({label: 'Decision',value:data.decisionDesc},
                            {label: 'Decision Reason',value:data.decisionRsnDesc},
                            {label: 'Decision Date',value:data.decisionDt},
                            {label: 'Assigned Start Date',value:data.assignedStartDt},
                            {label: 'Assigned End Date',value:data.assignedEndDt},
                            {label: 'Peer to Peer Req?',value:data.isPeerToPeerConsultationRequired});
        if(data.type=='appealService'){
            this.type = 'Appeal Service';
            this.column1.push({label: 'Requested Units',value:data.requestedUnits},
                                {label: 'Assigned Units',value:data.assignedUnits},
                                {label: 'Procedure Type',value:data.procedureTypeCd},
                                {label: 'Procedure Code',value:data.procedureCd},
                                {label: 'Procedure',value:data.procedureDesc},
                                {label: 'Procedure Modifier',value:data.procedureModifierCd});
        
            this.column2.push({label: 'Assigned Units',value:data.assignedUnits},
                                {label: 'Denied Units',value:data.deniedUnits},
                                {label: 'Applied Units',value:''});

        }else if(data.type=='appealStay'){
            this.type = 'Appeal Stay';
            this.column1.push({label: 'Expected Admit Date',value:data.expectedAdminDt},
                                {label: 'Requested Days',value:data.requestedDays},
                                {label: 'Is Extension?',value:data.isExtension},
                                {label: 'Is Extended?',value:data.isExtended});
            
            this.column2.push({label: 'Actual Admit Date',value:data.actualAdmitDt},
                                {label: 'Assigned Days',value:data.assignedDays},
                                {label: 'Denied Days',value:data.deniedDays},
                                {label: 'Physician Review?',value:data.IsStaySentForPr},
                                {label: 'Applied Days',vale:''});
        }
    }
}