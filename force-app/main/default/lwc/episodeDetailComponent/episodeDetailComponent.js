import { LightningElement,api } from 'lwc';
import { FlowAttributeChangeEvent, FlowNavigationNextEvent } from 'lightning/flowSupport';

const SERVICE_COLUMNS = [{label: 'Seq #', fieldName: 'sequenceNo', type: 'text'},
                            {label: 'Service Type', fieldName: 'serviceTypeDesc', type: 'text'},
                            {label: 'Service Code', fieldName: 'serviceTypeCd', type: 'text'},
                            {label: 'Due Date', fieldName: 'dueDt', type: 'text'},
                            {label: 'Decision', fieldName: 'decisionDesc', type: 'text'},
                            {label: 'Auth Start Date', fieldName: 'assignedStartDt', type: 'date'},
                            {label: 'Auth End Date', fieldName: 'assignedEndDt', type: 'date'},
                            {label: 'Request Priority', fieldName: '', type: 'text'},
                            {label: 'Requested #', fieldName: 'requestedUnits', type: 'text'},
                            {label: 'Assigned #', fieldName: 'assignedUnits', type: 'text'},
                            {label: 'Denied #', fieldName: 'deniedUnits', type: 'text'},
                            {label: 'Reason', fieldName: 'decisionRsnDesc', type: 'text'},
                            {type: 'button', typeAttributes: {  
                                iconName: 'utility:preview',
                                label: 'View',  
                                name: 'view',  
                                variant: 'bare',
                                alternativeText: 'view',        
                                disabled: false
                            }}];
const STAY_COLUMNS = [{label: 'Seq #', fieldName: 'sequenceNo', type: 'text'},
                        {label: 'Service Type', fieldName: 'serviceTypeDesc', type: 'text'},
                        {label: 'Place of Service',fieldName: 'placeOfSvcDesc',type:'text'},
                        {label: 'Decision', fieldName: 'decisionDesc', type: 'text'},
                        {label: 'Auth Start Date', fieldName: 'assignedStartDt', type: 'date'},
                        {label: 'Auth End Date', fieldName: 'assignedEndDt', type: 'date'},
                        {label: 'Request Priority', fieldName: '', type: 'text'},
                        {label: 'Assigned Days', fieldName: 'assignedDays', type: 'text'},
                        {label: '# Days Requested', fieldName: 'requestedDays', type: 'text'},
                        {label: '# Days Denied', fieldName: 'deniedDays', type: 'text'},
                        {type: 'button', typeAttributes: {  
                            iconName: 'utility:preview',
                            label: 'View',  
                            name: 'view',  
                            variant: 'bare',
                            alternativeText: 'view',        
                            disabled: false
                        }}];
const APPEAL_STAY_COLUMNS = [
                        {label: 'Seq #', fieldName: 'sequenceNo', type: 'text'},
                        {label: 'Service Type', fieldName: 'serviceTypeDesc', type: 'text'},
                        {label: 'Requested Days',fieldName: 'requestedDays',type:'text'},
                        {label: 'Assigned Days', fieldName: 'assignedDays', type: 'text'},
                        {label: 'Applied Days', fieldName: '', type: 'date'},
                        {label: 'Expected Admit Date', fieldName: 'expectedAdminDt', type: 'date'},
                        {label: 'Place of Service', fieldName: 'placeOfSvcDesc', type: 'text'},
                        {label: 'Decision', fieldName: 'decisionDesc', type: 'text'},
                        {type: 'button', typeAttributes: {  
                            iconName: 'utility:preview',
                            label: 'View',  
                            name: 'view',  
                            variant: 'bare',
                            alternativeText: 'view',        
                            disabled: false
                        }}];
const APPEAL_SERVICE_COLUMNS = [{label: 'Seq #', fieldName: 'sequenceNo', type: 'text'},
                        {label: 'Service Type', fieldName: 'serviceTypeDesc', type: 'text'},
                        {label: 'Requested Units',fieldName: 'requestedUnits',type:'text'},
                        {label: 'Assigned Units', fieldName: 'assignedUnits', type: 'text'},
                        {label: 'Applied Units', fieldName: 'deniedUnits', type: 'date'},
                        {label: 'Assigned Start Date', fieldName: 'assignedStartDt', type: 'date'},
                        {label: 'Place of Service', fieldName: 'placeOfSvcDesc', type: 'text'},
                        {label: 'Decision', fieldName: 'decisionDesc', type: 'text'},
                        {type: 'button', typeAttributes: {  
                            iconName: 'utility:preview',
                            label: 'View',  
                            name: 'view',  
                            variant: 'bare',
                            alternativeText: 'view',        
                            disabled: false
                        }}];
const PROCEDURE_COLUMNS = [{label: 'Seq #', fieldName: '', type: 'text'},
                            {label: 'Procedure Type', fieldName: 'procedureTypeCd', type: 'text'},
                            {label: 'Procedure Code',fieldName: 'procedureCd',type:'text'},
                            {label: 'Procedure Desc',fieldName: 'procedureDesc',type:'text'},
                            {label: 'Procedure Modifier',fieldName: 'procedureModifierCd',type:'text'},
                            {label: 'Start Date',fieldName: 'startDt',type:'text'},
                            {label: 'End Date', fieldName: 'endDt', type: 'text'}];

const authSectionColumnsMap = new Map([['modifiedByUser',{label: 'Modified By User', fieldName: 'modifiedByUser', type: 'text'}],
                            ['episodeStatus',{label: 'Episode Status', fieldName: 'episodeStatus', type: 'text'}],
                            ['claimedVisits',{label: 'Used Units', fieldName: 'claimedVisits', type: 'text'}],
                            ['createdByName',{label: 'Created By Name', fieldName: 'createdByName', type: 'text'}],
                            ['episodeTypeCd',{label: 'Episode Type', fieldName: 'episodeTypeCd', type: 'text'}],
                            ['dueDt',{label: 'Due Date', fieldName: 'dueDt', type: 'text'}],
                            ['assignedNurseName',{label: 'Assigned Nurse Name', fieldName: 'assignedNurseName', type: 'text'}],
                            ['jivaEpisodeId',{label: 'Jiva Episode Id', fieldName: 'jivaEpisodeId', type: 'text'}],
                            ['referralReasonDesc',{label: 'Referral Reason', fieldName: 'referralReasonDesc', type: 'text'}],
                            ['episodeStartDt',{label: 'Episode Start Date', fieldName: 'episodeStartDt', type: 'date'}],
                            ['createdDt',{label: 'Created Date', fieldName: 'createdDt', type: 'text'}]]);


export default class EpisodeDetailComponent extends LightningElement {
    activeSections = ['Auth Details', 'Diagnosis Information','Provider Information','Type Information','System Information'];
    @api episodeNumber;
    @api authDetail;
    @api authDetailColumns;
    @api typeField;
    @api episode;
    @api authDetailFields;
    @api diagnosisFields;
    @api typeFields;
    @api outputData;
    @api notes;
    @api noteUri;
    @api memberId;
    @api extendedNoteUri;
    @api authorizationId ='';
    @api claimedVisits;
    @api sourceSystem;

    serviceColumns = SERVICE_COLUMNS;
    serviceData;
    authSectionData=[];
    authSectionColumns=[]; 
    authSectionColumnsMap = authSectionColumnsMap;
    type;
    authDetailSection={};
    diagnosisSection;
    providerSection;
    systemSection={};
    typeSectionName;
    authSectionName;
    stayData;
    stayColumns = STAY_COLUMNS;
    typeSection1;
    typeSection2;
    procedureSection;
    procedureColumns = PROCEDURE_COLUMNS;
    appealStayData;
    appealStayColumns = APPEAL_STAY_COLUMNS;
    appealServiceData;
    appealServiceColumns = APPEAL_SERVICE_COLUMNS;
    //claimsSectionColumn = claimsSectionColumn;
    //claimData = [{claimNo: '105647', phoneNo: '4004054841'}];

    //when the user clicks the button to view more for stay or service
    handleRowAction(event) {
        const row = event.detail.row;
        this.outputData = JSON.stringify(row);
        console.log('handle clicked');
        //console.log('extended uri: '+row.extendedNoteUri.substring(7));
        //console.log('note uri: '+row.noteUri.substring(7));
        if(row.noteUri!=null){
            this.noteUri = row.noteUri.substring(7);
        }
        if(row.extendedNoteUri!=null){
            this.extendedNoteUri = row.extendedNoteUri.substring(7);
        }
        const nextNavigationEvent = new FlowNavigationNextEvent();       
        this.dispatchEvent(nextNavigationEvent);
        console.log(JSON.stringify(row));
    }
    connectedCallback(){
        console.log('episode before parse = '+ this.episode);
        let episode = JSON.parse(this.episode);

        this.handleAuthSection();
        this.handleAuthDetailSection(episode.ePISODE.episodeCommon);
        this.handleTypeSection(episode.ePISODE.episodeSpecificFields);
        this.hanldeDiagosisSection(episode.ePISODE.episodeDiagnoses);
        this.handleProviderInfoSection(episode.ePISODE.episodeProviders);
        //console.log('Episode full data:~~~');
        //console.log(this.episode);
    }
    //set up the auth Details section and system section
    handleAuthDetailSection(authDetail){
        const testJSON = JSON.stringify(authDetail);
        var authorizationId = authDetail.certAuthNo;
        //var claimedVisits = authDetail.claimedVisits;
        console.log('claimedVisits = ' +this.claimedVisits);
      
        this.authSectionName = authDetail.episodeTypeDesc + ' Authorization Details';
        this.typeSectionName = authDetail.episodeTypeDesc + ' Information';
        this.type = authDetail.episodeTypeCd;
        console.log('auth section name '+this.authSectionName);
        console.log('type section name '+this.typeSectionName);
        //Admain can add or remove what fields are showing in the auth Details section
        if(this.authDetailFields!=null){
            let authFields = this.authDetailFields.split(',');
            for(let auth in authFields){
                if(authFields[auth]=='Parent Auth #'){
                    this.authDetailSection.parentEpisodeId = {label: 'Parent Auth #',value:authDetail.parentEpisodeId};
                }else if(authFields[auth]=='Auth #'){
                    this.authDetailSection.certAuthNo = {label: 'Auth #',value: authDetail.certAuthNo};
                }else if(authFields[auth]=='Start Date'){
                    this.authDetailSection.episodeStartDt = {label: 'Start Date',value:this.fixDateFormat(authDetail.episodeStartDt)};
                }else if(authFields[auth]=='Assigned Nurse'){
                    this.authDetailSection.assignedNurseName = {label: 'Assigned Nurse',value:authDetail.assignedNurseName};
                }else if(authFields[auth]=='Authorization Status'){
                    this.authDetailSection.episodeStatus = {label: 'Authorization Status',value:authDetail.episodeStatus};
                }else if(authFields[auth]=='Referral Reason'){
                    this.authDetailSection.referralReasonDesc = {label: 'Referral Reason',value:authDetail.referralReasonDesc};
                }else if(authFields[auth]=='Status Reason'){
                    this.authDetailSection.statusReasonDesc = {label: 'Status Reason',value:authDetail.statusReasonDesc};
                }else if(authFields[auth]=='Severity'){
                    this.authDetailSection.severityDesc = {label:'Severity',value:authDetail.severityDesc};
                }else if(authFields[auth]=='Complexity'){
                    this.authDetailSection.complexityTypeDesc = {label:'Complexity',value:authDetail.complexityTypeDesc};
                }else if(authFields[auth]=='Provider Name'){
                    this.authDetailSection.providerName = {label:'Provider Name',value:''};
                }else if(authFields[auth]=='Status Reason'){
                    this.authDetailSection.statusReasonDesc = {label:'Status Reason',value:authDetail.statusReasonDesc};
                }else if(authFields[auth]=='Used Units'){
                    this.authDetailSection.claimedVisits = {label:'Used Units', value:this.claimedVisits};
                }
            }
        }
        //this.dispatchEvent(new FlowAttributeChangeEvent('authorizationId', authorizationId));
        //this.authorizationId = authorizationId;
        //set up system section
        this.systemSection.modifiedDt = {label: 'Episode Modified Date',value:this.fixDateFormat(authDetail.modifiedDt)};
        this.systemSection.modifiedByName = {label: 'Episode Modified By',value:authDetail.modifiedByName};
        this.systemSection.createdByName = {label: 'Episode Created By',value:authDetail.createdByName};
        this.systemSection.createdDt = {label: 'Episode Created Date',value:this.fixDateFormat(authDetail.createdDt)};
    }
    //set up the diagosis section
    hanldeDiagosisSection(diagnosis){
        console.log('diagnosis section');
        console.log(diagnosis);
        if(diagnosis!=null){
            this.diagnosisSection ={};
            let episodeDiagnoses = diagnosis.episodeDiagnosis[0];
            this.diagnosisSection.diagnosisTypeCd = {label: 'Diagnosis Type',value:episodeDiagnoses.diagnosisTypeCd};
            this.diagnosisSection.diagnosisDesc = {label: 'Diagnosis Description',value:episodeDiagnoses.diagnosisDesc};
            this.diagnosisSection.isPrimary = {label: 'Primary',value:episodeDiagnoses.isPrimary};
        }
    }
    //set up the type section
    handleTypeSection(type){
        console.log('type section');
        if(type!=null){
            this.typeSection1=[];
            this.typeSection2=[];
            let typeLowerCaseName;

            for(let key in type){
                typeLowerCaseName = key;
            }

            console.log('type lower '+typeLowerCaseName);
            let typeSpecific = type[typeLowerCaseName];
            console.log('this.type = '+this.type);

            if(this.type=='IP'||this.type=='BH-IP'||this.type=='OP'||this.type=='BH-OP'){
                this.typeSection1.push({label: 'Referral Source',value:typeSpecific.referralSourceCd},
                                        {label: 'Request Received Date',value:this.fixDateFormat(typeSpecific.requestReceivedDt)},
                                        {label: 'Episode Class',value:typeSpecific.episodeClassCd});
                this.typeSection2.push({label: 'Urgency Type',value:typeSpecific.urgencyTypeCd},
                                        {label: 'Due Date',value:this.fixDateFormat(typeSpecific.dueDt)},
                                        {label: 'Assigned Reviewer',value:typeSpecific.assignedReviewerName});
                
                //set up auth service section
                if(typeSpecific.authServices!=null){
                    console.log('authService: ');              
                    this.serviceData = typeSpecific.authServices.authService;
                    
                    console.log('length '+this.serviceData.length);
                    for(let x=0;x<this.serviceData.length;x++){
                        this.serviceData[x].type = 'Service';
                        this.serviceData[x].requestReceivedDt = this.serviceData[x].requestReceivedDt.replace('T',' ').replace('Z',' ');
                        this.serviceData[x].serviceDecision.createdDt = this.fixDateFormat(typeSpecific.authServices.authService[x].serviceDecision.createdDt);
                        this.serviceData[x].dueDt = this.fixDateFormat(this.serviceData[x].dueDt);
                        this.serviceData[x].assignedUnits = typeSpecific.authServices.authService[x].serviceDecision.assignedUnits;
                        this.serviceData[x].decisionDesc = typeSpecific.authServices.authService[x].serviceDecision.decisionDesc;
                        this.serviceData[x].deniedUnits = typeSpecific.authServices.authService[x].serviceDecision.deniedUnits;
                        this.serviceData[x].assignedStartDt = this.fixDateFormat(typeSpecific.authServices.authService[x].serviceDecision.assignedStartDt);
                        this.serviceData[x].assignedEndDt = this.fixDateFormat(typeSpecific.authServices.authService[x].serviceDecision.assignedEndDt);
                        this.serviceData[x].decisionRsnDesc = typeSpecific.authServices.authService[x].serviceDecision.decisionRsnDesc;
                    }
                    console.log(this.serviceData);
                    console.log(typeSpecific.authServices.authService[0].serviceDecision);
                }
                //stay information
                if(typeSpecific.authStays!=null){
                    console.log('authStay: ');
                    this.stayData = typeSpecific.authStays.authStay;
                    this.stayData[0].type = 'Stay';
                    this.stayData[0].assignedStartDt = this.fixDateFormat(typeSpecific.authStays.authStay[0].stayDecision.assignedStartDt);
                    this.stayData[0].assignedEndDt = this.fixDateFormat(typeSpecific.authStays.authStay[0].stayDecision.assignedEndDt);
                    this.stayData[0].decisionDesc = typeSpecific.authStays.authStay[0].stayDecision.decisionDesc;
                    this.stayData[0].assignedDays = typeSpecific.authStays.authStay[0].stayDecision.assignedDays;
                    this.stayData[0].deniedDays = typeSpecific.authStays.authStay[0].stayDecision.deniedDays;

                }
            }
            //grievance specific fields
            else if(typeLowerCaseName=='grievanceSpecificFields'){
                this.typeSection1.push( {label: 'Referral Source',value:typeSpecific.referralSourceCd},
                                        {label: 'Episode Class',value:typeSpecific.episodeClassCd},
                                        {label: 'Urgency Type',value:typeSpecific.urgencyTypeCd},
                                        {label: 'Due Date',value:this.fixDateFormat(typeSpecific.dueDt)},
                                        {label: 'Issue Type',value:typeSpecific.issuesTypeCd});
                this.typeSection2.push( {label: 'Severity Level',value:typeSpecific.severityLevelDesc},
                                        {label: 'Severity Action',value:typeSpecific.severityActionDesc},
                                        {label: 'Acuity Level',value:typeSpecific.acuityLevel},
                                        {label: 'Acuity Change Desc',value:typeSpecific.acuityChangeRsnDesc},
                                        {label: 'Reason',value:typeSpecific.reasonDesc});
            }
            else if (typeLowerCaseName=='prSpecificFields'){
                this.typeSection1.push( {label: 'Referral Source',value:typeSpecific.referralSourceCd},
                                        {label: 'Episode Class',value:typeSpecific.episodeClassCd},
                                        {label: 'Urgency Type',value:typeSpecific.urgencyTypeCd},
                                        {label: 'Severity Level',value:typeSpecific.severityLevelDesc});
                this.typeSection2.push( {label: 'Due Date',value:this.fixDateFormat(typeSpecific.dueDt)},
                                        {label: 'Decision Desc',value:typeSpecific.decisionDesc},
                                        {label: 'Acuity Level',value:typeSpecific.acuityLevel},
                                        {label: 'Original Denial Reviewer',value:typeSpecific.originalDenialReviewer});
                if(typeSpecific.procedures!=null){
                    this.procedureSection = typeSpecific.procedures.procedure;
                    console.log(this.procedureSection);
                }
            }
            else if(typeLowerCaseName=='appealSpecificFields'){
                console.log('appeal');
                this.typeSection1.push({label: 'Request Received Date',value:this.fixDateFormat(typeSpecific.requestReceivedDt)},
                                        {label: 'Episode Class',value:typeSpecific.episodeClassCd},
                                        {label: 'Urgency Type',value:typeSpecific.urgencyTypeCd},
                                        {label: 'Due Date',value:this.fixDateFormat(typeSpecific.dueDt)},
                                        {label: 'Appeal Level',value:typeSpecific.appealLevelCd},
                                        {label: 'Appeal Type',value:typeSpecific.appellantTypeCd},
                                        {label: 'Appeal Category',value:typeSpecific.appealCategoryCd},
                                        {label: 'Appellant Name',value:typeSpecific.nameOfAppellant});
                this.typeSection2.push({label: 'Waiver Liablity Form Received',value:typeSpecific.isWaiverLiabilityFormReceived},
                                        {label: 'Waiver Liability Form Received Date',value:this.fixDateFormat(typeSpecific.liabilityFormReceivedDt)},
                                        {label: 'Appt Representative Form Received',value:typeSpecific.isAppointmentRepresentativeFormReceived},
                                        {label: 'Appt Representative Form Received',value:this.fixDateFormat(typeSpecific.representativeFormReceivedDt)},
                                        {label: 'Original Denial Reviewer',value:typeSpecific.originalDenialReviewer},
                                        {label: 'Appealed For',value:typeSpecific.appealedFor},
                                        {label: 'Source Method',value:typeSpecific.sourceMethodCd});
                if(typeSpecific.appealStays!=null){
                    let startJSON = JSON.stringify(typeSpecific.appealStays);
                    let modJSON = startJSON.replace('{"appealStay_set":true,"appealStay":',''); //remove the leading text before the array starts
                    modJSON = modJSON.slice(0,-1); //remove the last '}' characeter
                    this.appealStayData = JSON.parse(modJSON);
                    //this.appealStayData = typeSpecific.appealStays;
                    this.appealStayData[0].type = 'appealStay';
                }
                if(typeSpecific.appealServices!=null){
                    console.log('appeal service');
                    let startJSON = JSON.stringify(typeSpecific.appealServices);
                    console.log('startJSON = '+startJSON);
                    let modJSON = startJSON.replace('{"appealService_set":true,"appealService":',''); //remove the leading text before the array starts
                    modJSON = modJSON.slice(0,-1); //remove the last '}' characeter
                    this.appealServiceData = JSON.parse(modJSON);
                    //this.appealServiceData = typeSpecific.appealServices;
                    this.appealServiceData[0].type = 'appealService';
                }
            }
            else if(typeLowerCaseName=='peSpecificFields'){
                this.typeSection1.push( {label: 'Referral Source',value:typeSpecific.referralSourceCd},
                                        {label: 'Admission Type',value:typeSpecific.referralSourceCd},
                                        {label: 'Assigned Location',value:typeSpecific.assignedLocation},
                                        {label: 'Prior Location',value:typeSpecific.priorLocation},
                                        {label: 'Visit #',value:typeSpecific.vistNo},
                                        {label: 'Visit Description',value:typeSpecific.visitDescription});
                this.typeSection2.push( {label: 'Expected Admit Date',value:this.fixDateFormat(typeSpecific.expectedAdmitDt)},
                                        {label: 'Actual Admit Date',value:''},
                                        {label: 'Expected Discharge Date',value:this.fixDateFormat(typeSpecific.expectedDischargeDt)},
                                        {label: 'Actual Discharge Date',value:this.fixDateFormat(typeSpecific.ActualDischargeDt)},
                                        {label: 'Expected Length of Stay',value:typeSpecific.expectedLos},
                                        {label: 'Actual Length of Stay',value:typeSpecific.actualLos});
            }
        }
    }
    //handle the data and columns from previous component and display top of the page
    handleAuthSection(){
        //this.authSectionData.push(JSON.parse(this.authDetail));
        if(this.authDetail!=null){
            this.authSectionData = JSON.parse(this.authDetail);
            console.log(this.authDetailColumns);
            console.log(this.authSectionData[0]);
            console.log('authSectionData ');
            let episodeType = this.typeField;
            this.type = this.authSectionData[0][episodeType];
            console.log(this.authSectionData[0][episodeType]);
            console.log(this.authDetailColumns);
            let myArr = this.authDetailColumns.split(",");
            for(let x in myArr){
                this.authSectionColumns.push(this.authSectionColumnsMap.get(myArr[x]));
            }
        }
    }
    fixDateFormat(date){
        if(!date) return;
        let newDate = date.replace('T',' ').replace('.000Z',' ');
        return newDate;
    }
    //set up Provider Information section
    handleProviderInfoSection(provideInfo){
        if(provideInfo!=null){
            console.log(provideInfo);
            console.log('provider section');
            this.providerSection = {};
            let provider = provideInfo.episodeProvider[0];
            
            this.providerSection.providerId = {label:'Provider ID',value:provider.providerId};
            this.providerSection.providerName = {label:'Provider Name',value:provider.providerName};
            this.providerSection.providerTypeDesc = {label:'Provider Type',value:provider.providerTypeDesc};
            this.providerSection.providerRoleDesc = {label:'Provider Role',value:provider.providerRoleDesc};
            this.providerSection.phone = {label:'Phone',value:provider.phone};
            this.providerSection.providerFax = {label:'Fax',value:provider.providerFax};
            this.providerSection.inNetwork = {label:'In Network',value:provider.inNetwork};
            this.providerSection.providerAddressLine1 = {label:'Provider Address 1',value:provider.providerAddressLine1};
            this.providerSection.providerAddressLine2 = {label:'Provider Address 2',value:provider.providerAddressLine2};
            //this.providerSection.providerId = {label:'Provider ID',value:provider.providerId};
            this.providerSection.city = {label:'City',value:provider.city};
            this.providerSection.stateDesc = {label:'State',value:provider.stateDesc};
            this.providerSection.countryDesc = {label:'Country',value:provider.countryDesc};
            this.providerSection.zip = {label:'Zip',value:provider.zip};
        }
    }
    @api
    get inputVariables() {
        console.log('This is input variable authorizationId = ' + this.authorizationId);
        console.log('sourceSystem = '+ this.sourceSystem);
        console.log('MemberId = '+this.memberId);
        console.log('episodeType = '+this.typeField);
        return [
            {
                name: 'AuthorizationId',
                type: 'String',
                value: this.authorizationId 
            }, {
                name: 'sourceSystem',
                type: 'String',
                value: this.sourceSystem
            }, {
                name: 'MemberId',
                type: 'String',
                value: this.memberId
            },{
                name: 'episodeType',
                type: 'String',
                value: this.typeField
            }
        ];
   }
    
}