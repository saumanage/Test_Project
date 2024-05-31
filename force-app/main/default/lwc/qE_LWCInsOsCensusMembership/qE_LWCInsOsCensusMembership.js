import { api, track } from 'lwc';
import insOSCensus from 'vlocity_ins/insOsCensus';
import { omniscriptUtils, commonUtils, dataFormatter } from 'vlocity_ins/insUtility';
import { namespace } from 'vlocity_ins/utility';
import moment from "vlocity_ins/dayjs";
import { OmniscriptActionCommonUtil } from "vlocity_ins/omniscriptActionUtils";

export default class QE_LWCInsOsCensus extends insOSCensus {

    //Andrew Vaughn compare original count to new count [CRMS-496,497]
    @api originalTotalMembers
    @api isImportFromContract
    @api contractId;
    nsPrefix = namespace;
    @track unsaved = false;
    @track unsavedErros ={};

    _actionUtil;
    /**
     * checkValidity should return a boolean value true, if the input is valid, false if invalid.
     * @returns {boolean}
     */
     @api checkValidity() {
        return this.saveResponse && !this.saveResponse.errors &&
        this.employees.filter(e => e.error).length === 0 &&
        this.employees.map(e => e.dependents).flat(1).filter(e => e.error).length === 0 &&
         !this.unsaved ? true: false;
        // && this.saveResponse.censusMemberIds.length > 0;
    }
    get showDeleteAllData(){
        return true;
    }
    get generalError(){
        return this.saveResponse && this.saveResponse.errors ?
        this.saveResponse.errors.map(e => e.error? e.error.replace("vlocity_ins__ContractLineId__c value is not valid", "Invalid Plan"):
             e.replace("Contract Id is not valid","The Uploaded Group Numbers do not match with the contract for this group application")).join(",") : "";
    }
    generateUniqueId() {
        return Math.random().toString(36).substring(7).toUpperCase();
    }
    disconnectedCallback() {
        /*** unsubscribe  event  ***/
        super.disconnectedCallback();


    }

    // Handles 'selected' event for employee.
    handleEmployeeSelect(event) {
        this.selectedEmployee = null;
        this.employees.forEach(member => {
            member.isSelected =
            member[this.nsPrefix + 'SocialSecurityNumber__c'] === event.detail[this.nsPrefix + 'SocialSecurityNumber__c']
                    ? !member.isSelected
                    : false;
            if (member.isSelected) {
                this.selectedEmployee = member;
            }
        });
    }
    /**
     * Extract following information from census data:
     * 1. Total Insured
     * 2. Employee Count
     * 3. Child count
     * 4. Spouse count
     * 5. Family count
     * 6. Employees
     *
     */
     calculateCensusInfo() {
        let censusInfo = { total: this.census.length, empCount: 0, empChCount: 0, empSpCount: 0, empFaCount: 0 };
        let employees = [];
        let empDeps = {}; // Stores dependents information on primary member's ID

        // Add employee dependents
        this.census.forEach(member => {
            if (member[this.nsPrefix + 'IsPrimaryMember__c'] ) {
                // Check if a primary member
                if (this.selectedEmployee) {
                    const selectedEmployeeIdentifier = this.selectedEmployee[this.nsPrefix + 'SocialSecurityNumber__c'] ;
                    const memberIdentifier = member[this.nsPrefix + 'SocialSecurityNumber__c'] ;
                    if (selectedEmployeeIdentifier === memberIdentifier) {
                        member.isSelected = true;
                    }
                }
                employees.push(member);
            } else {
                const primaryMemberId = member['QE_Primary_SSN__c'] ;
                if (empDeps[primaryMemberId]) {
                    empDeps[primaryMemberId].push(member);
                } else {
                    empDeps[primaryMemberId] = [member];
                }
            }
        });

        // Update census info
        employees.forEach((member, index) => {
            const memberIdentifier = member[this.nsPrefix + 'SocialSecurityNumber__c'] ;
            let hasSpouse = false;
            let hasChild = false;
            let randomVar = '';
            member.index = index;
            member.dependents = empDeps[memberIdentifier] ? empDeps[memberIdentifier] : [];
            member.dependents.forEach(dependent => {
                const dependentIsSpouse = dependent[this.nsPrefix + 'IsSpouse__c'] ;
                if (dependentIsSpouse) {
                    hasSpouse = true;
                } else {
                    hasChild = true;
                }
            });

            if (hasSpouse && hasChild) {
                censusInfo.empFaCount++;
            } else if (hasSpouse && !hasChild) {
                censusInfo.empSpCount++;
            } else if (!hasSpouse && hasChild) {
                censusInfo.empChCount++;
            } else if (!hasSpouse && !hasChild) {
                censusInfo.empCount++;
            }
        });

        /*console.log('num employees: ' + employees.length);
        console.log('num census: ' + this.census.length);*/

        //Andrew Vaughn check for significant membership change [CRMS-496, 497]
        this.checkSignificantMembershipChange(this.originalTotalMembers, this.census.length);

        this.censusInfo = censusInfo;
        this.employees = employees;
        this.empDeps = empDeps;
        // employees.map((member, index) => {
        //     member['QE_Primary_SSN__c'] = undefined;
        //     member.dependents.forEach((dep, index )=> {
        //         dep['QE_Primary_SSN__c'] = undefined;
        //     })
        // })
        this.censusInfo = censusInfo;
        this.employees = employees;
        this.empDeps = empDeps;

        //console.log(this.employees)
        this.validateMemberFields()
    }

    //This method takes in the originalCensusCount and the newCensusCount and if there is a 15% change then sets SignifcantCensusIncrease to true
    checkSignificantMembershipChange(originalCount, newCount) {
        if(!originalCount || originalCount == 0) {
            this.omniApplyCallResp({SignificantCensusIncrease: false});
            return;
        }
        originalCount = parseInt(originalCount);
        var change = newCount - originalCount;
        var percentChange = change/originalCount * 100;
        this.omniApplyCallResp({SignificantCensusIncrease: percentChange >= 15});
    }

    handleDelete(e){
        super.handleDelete(e);

    }
    // Delete census member on button click
    handleDelete(ev) {
        const currentMemberIdentifier = ev.detail[this.nsPrefix + 'SocialSecurityNumber__c'];
        const dependents = this.empDeps[currentMemberIdentifier] || [];
        let memberIdentifiers = [currentMemberIdentifier];
        dependents.forEach(d => d[this.nsPrefix + 'SocialSecurityNumber__c'] );
        this.deleteMembers(memberIdentifiers);

        this.omniValidate();
    }


    // Delete all census members on button click
    clearAll() {
        const memberIdentifiers = this.census.map(member =>
            member[this.nsPrefix + 'SocialSecurityNumber__c']
        );
        this.deleteMembers(memberIdentifiers);
        this.closeDeleteAllModal();
    }

    /**
     * Delete census members using array of identifiers
     * @param {Array} memberIdentifiers Array of Member Identifiers
     */
    deleteMembers(memberIdentifiers) {
        let deletionIds = [];
        this.census.forEach(member => {
            // Extract Ids for members
            if (
                memberIdentifiers.some(
                    id => member[this.nsPrefix + 'SocialSecurityNumber__c']   === id
                ) &&
                member.Id
            ) {
                deletionIds.push({ Id: member.Id });
            }
        });
        if (deletionIds.length > 0) {
            // Make API call to delete the members
            this.isLoaded = false;
            let deleteAction = JSON.parse(JSON.stringify(this.omniJsonDef.propSetMap.deleteAction || {}));
            deleteAction.inputMap = { ...deleteAction.inputMap, ...this.censusInputMap(deletionIds) };
            this.invokeService(deleteAction, 'InsCensusService', 'deleteMembers')
                .then(() => {
                    this.loadCensus().then(loadResponse => {
                        const newCensusMap = this.generateUpdatedCensusMap(loadResponse);
                        this.handleDeleteCensusLoad(newCensusMap, memberIdentifiers);
                    });
                })
                .catch(err => this.showError({ message: err }));
        } else {
            // Delete members from client end since associate record ID is not created yet.
            this.census = this.census.filter(
                member =>
                    !memberIdentifiers.includes(member[this.nsPrefix + 'SocialSecurityNumber__c'])
            );
            this.calculateCensusInfo();
            if (this.currentPageHasNoItems()) {
                this.navigateToLastPage();
            }
        }
    }

    /**
     * Create an updated census map based on the response of census loading service
     * @param {Object} getMembersResponse Response object from getMembers service
     * @returns {Object}
     */
     generateUpdatedCensusMap(getMembersResponse) {
        this.isLoaded = true;
        const loadResponse = JSON.parse(getMembersResponse);
        const currentCensusMap = this.census.reduce((result, member) => {
            result[member[this.nsPrefix + 'SocialSecurityNumber__c']] = member;
            return result;
        }, {});
        const fetchedCensusMap = loadResponse.census.members.reduce((result, member) => {
            result[member[this.nsPrefix + 'SocialSecurityNumber__c']] = member;
            return result;
        }, {});
        return { ...currentCensusMap, ...fetchedCensusMap };
    }
    handleUpdateCensusLoad(newCensusMap, saveMembersResponse) {
        const saveResponse = JSON.parse(saveMembersResponse);
        let updatedCensusMap = { ...newCensusMap };
        Object.values(updatedCensusMap).forEach(member => delete member.error); // Reset errors

        if (saveResponse.addPlanErrors) {
            this.showError({ message: saveResponse.addPlanErrors });
        }
        if (saveResponse.errors) {
            saveResponse.errors.forEach(erroredMember => {
                const memberIdentifier = erroredMember[this.nsPrefix + 'SocialSecurityNumber__c'];
                if (memberIdentifier) {
                    updatedCensusMap[memberIdentifier].error = erroredMember.error;
                }
            });
        }
        this.census = Object.values(updatedCensusMap).map(member => {
            member.uuid = this.generateUniqueId()
            return member;
        });

        this.calculateCensusInfo();

        this.unsaved = false;
        let OOAFlag = this.employees.filter(e => e.QE_Out_of_Area__c === 'Yes').length > 0 ||
                        this.employees.map(e => e.dependents).flat(1).filter(e => e.QE_Out_of_Area__c === 'Yes').length > 0 ;
        this.omniApplyCallResp({unsavedCensus: false, emptyMembers: this.saveResponse && !this.saveResponse.censusMemberIds.length, outOfAreaPlanRequired: OOAFlag });
        this.saveResponse = JSON.parse(saveMembersResponse);
        //console.log(this.saveResponse)
        this.omniValidate();
        this.isLoaded = true;
    }
    // handleUpdateCensusLoad(getMembersResponse, saveMembersResponse) {
    //     super.handleUpdateCensusLoad(getMembersResponse, saveMembersResponse);

    // }
    handleUpdate(ev) {

        //console.log('Census MEMB ', JSON.stringify(ev.detail));
        super.handleUpdate(ev);
        //console.log('Census UPDATE ', JSON.stringify(this.census));
        this.unsaved = true;
        this.isLoaded = true;
        this.omniApplyCallResp({unsavedCensus: true, emptyMembers: this.saveResponse && !this.saveResponse.censusMemberIds.length });
        this.omniValidate();
    }

    /**
     * param {Event} ev 
     * Description: Handle Save members Event.
     */
    handleSaveMembers(ev)
    {
       
        this.saveMembers(ev);
    }
    /**
     *
     * @param {boolean} addDependent
     * @param {object} employee
     * Description: Create empty census object for employee/dependent
     */
     addNewMember(addDependent, employee) {
        let newMember = this.headers.reduce((result, header) => {
            result[header.name] = '';
            return result;
        }, {});
        newMember[this.nsPrefix + 'IsPrimaryMember__c'] = !addDependent;
        // newMember[this.nsPrefix + 'SocialSecurityNumber__c'] = newMember[this.nsPrefix + 'SocialSecurityNumber__c'];
        newMember[this.nsPrefix + 'MemberIdentifier__c'] = this.generateUniqueId();
        // newMember['QE_Primary_SSN__c'] = addDependent ? employee[this.nsPrefix + 'SocialSecurityNumber__c'] : newMember[this.nsPrefix + 'SocialSecurityNumber__c'];
        newMember[this.nsPrefix + 'PrimaryMemberIdentifier__c'] = addDependent ? employee[this.nsPrefix + 'MemberIdentifier__c'] : newMember[this.nsPrefix + 'MemberIdentifier__c'];
        newMember.Relationship = '';
        newMember.memberIndex = this.censusCount + 1;
        newMember.uuid = this.generateUniqueId();
        newMember.edited = true;
        this.unsaved = true;
        this.isLoaded = true;
        this.omniApplyCallResp({unsavedCensus: this.unsaved, emptyMembers: this.saveResponse && !this.saveResponse.censusMemberIds.length });
        return newMember;
    }
    downloadFile() {
        this._censusTemplateName = this.censusTemplateName || '../resource/insOsFlowCensusTemplate';
        let url;
        if(location.pathname.includes('broker')){
            url = `/broker${this.censusTemplateName}`;
        }else if(location.pathname.includes('benefit')){
            url = `/benefit${this.censusTemplateName}`;
        }
        else{
            url = this.censusTemplateName
        }
        window.open(url);
    }

    /**
     * Get Depedents' SSN when they have no related subscriber in file
     * @param csvData Uploaded CSV record infromation
     *
     */
    getDependentsSSNWithoutSubscriber(csvData)
    {
        let depWithSubScriberSSNs  = csvData.reduce((records, dep, index)=>{

            if(dep.Relationship != 'Employee')
            {

                let primarySSN =  dep[ 'QE_Primary_SSN__c'] && `${dep[ 'QE_Primary_SSN__c']}`.replaceAll("-","");
                let selfSSN =  dep[ this.nsPrefix+ 'SocialSecurityNumber__c'] && `${dep[ this.nsPrefix + 'SocialSecurityNumber__c']}`.replaceAll("-","");

                let rec2 = csvData.find( rec=>{

                   let mainSSN  =rec[ this.nsPrefix+ 'SocialSecurityNumber__c'] && `${rec[ this.nsPrefix + 'SocialSecurityNumber__c']}`.replaceAll("-","");

                   return primarySSN === mainSSN;


                });

              if( !rec2)
               {

                //records= Object.assign(records, {[selfSSN] : primarySSN  } );
                // records.push({[selfSSN] : primarySSN  } );

                records[selfSSN] = primarySSN;


               }

            }

            return records;

       },{});

       return depWithSubScriberSSNs;
    }

    /**
     * Return List of orphan records based on Depdent SSN
     * @param {Array} subSSNList
     */
    getOrphanSubscriberData( subSSNList)
    {
        const options = {
            chainable: true, //Use chainable when an Integration Procedure exceeds the Salesforce CPU Governor limit.
       // useFuture: false,
        };


        const params = {
            input: JSON.stringify({ subSSN: subSSNList, contractId: this.contractId}),
            sClassName: `vlocity_ins.IntegrationProcedureService`,
            sMethodName: 'QE_IPGetSubscribersCensusForDependents', //this will need to match the VIP -> type_subtype
            options: JSON.stringify(options),
        };


        //return this.omniRemoteCall(params, false);
        return this._actionUtil.executeAction(params, null, this, null, null);

    }
    /**
     * Converts the result of XLSX parsing to census JSON
     * @param {Object} csvData
     */
     csvDataToCensus(csvData) {


        //console.log("CSV:::" + JSON.stringify(csvData) );
         //Only call if its import contract
         if( this.isImportFromContract)
         {

             let depSSNs= this.getDependentsSSNWithoutSubscriber(csvData);

             let csvData2 =  null;

               if(depSSNs && depSSNs !=={} ){
                this.getOrphanSubscriberData(depSSNs).then((response) => {






                    //Combine CSV Data
                    //if(response.result.IPResult ){


                        if( response.result.IPResult){

                            let resultMap =new Map( Object.entries(response.result.IPResult));

                            csvData2 = csvData.flatMap((row)=>{
                                if( row.QE_Primary_SSN__c !=row.vlocity_ins__SocialSecurityNumber__c)
                                {
                                    if(resultMap.has(row.QE_Primary_SSN__c) )
                                    {
                                        let primaryRow = resultMap.get(row.QE_Primary_SSN__c);
                                        
                                        primaryRow['QE_Effective_Date__c'] = row['QE_Effective_Date__c'];
                                        
                                        return [...resultMap.get(row.QE_Primary_SSN__c), row];
                                    }

                                }

                                return [row];
                            });



                        }

                        //Console.log('Records::' + JSON.stringify(result));
                        //Console.log('Records::' + JSON.stringify(result.IPResult))
                    //}


                }).catch((error) => {
                    console.error('Error: ' , JSON.stringify( error)  );


                })
                .finally(()=>{
                    //Call helper method
                    this.csvDataToCensusExt( (csvData2==null? csvData: csvData2) );
                });
             }else
             {
                this.csvDataToCensusExt(csvData); 
             }
         }
         else
         {
            this.csvDataToCensusExt(csvData);
         }



    }
      /**
     * Converts the result of XLSX parsing to census JSON helper
     * @param {Object} csvData
     */
    csvDataToCensusExt(csvData)
    {
        let empUniqueId = null;
        let empUniquePrimid = null;
        let currentDepBatch = [];
        let groupClassArr =  this.omniJsonData && this.omniJsonData.GroupClass ? Array.isArray(this.omniJsonData.GroupClass) ? this.omniJsonData.GroupClass : [this.omniJsonData.GroupClass] : [];
        let subgroupArr =  this.omniJsonData && this.omniJsonData.SubGroup ? Array.isArray(this.omniJsonData.SubGroup) ? this.omniJsonData.SubGroup : [this.omniJsonData.SubGroup]: [];



        let members = csvData.map(csvRow => {
            let member = this.addNewMember(false);
            Object.keys(csvRow).forEach(key => {
                member[key] = csvRow[key];
            });


            if( !member['QE_Record_State__c'])
            {
                member['QE_Record_State__c'] = 'NEW';
            }
            if (member.Relationship) {
                member[ 'QE_Effective_Date__c'] =       moment(member[ 'QE_Effective_Date__c'] ).isValid() ? moment(member[ 'QE_Effective_Date__c']).format() : "";
                member[ 'QE_HSA_Begin_Date__c'] =       moment(member[ 'QE_HSA_Begin_Date__c'] ).isValid() ? member[ 'QE_HSA_Begin_Date__c'] : "";
                member[ 'QE_Process_Date__c'] =          moment(member[ 'QE_Process_Date__c'] ).isValid() ? member[ 'QE_Process_Date__c'] : "";
                member[ 'QE_Term_Date__c']      =        moment(member[ 'QE_Term_Date__c'] ).isValid() ?    member[ 'QE_Term_Date__c'] : "";
                member[ 'QE_Primary_SSN__c']     =        member[ 'QE_Primary_SSN__c'] && `${member[ 'QE_Primary_SSN__c']}`.replaceAll("-","");
                member[ this.nsPrefix + 'SocialSecurityNumber__c']      = member[ this.nsPrefix + 'SocialSecurityNumber__c'] && `${member[ this.nsPrefix + 'SocialSecurityNumber__c']}`.replaceAll("-","");


                this.unsavedErros[member[this.nsPrefix + 'MemberIdentifier__c']] =
                    member['QE_Primary_SSN__c'] && `${member['QE_Primary_SSN__c']}`.length !== 9 ? 'Primary SSN should be 9 digits, ' : '';
                this.unsavedErros[member[this.nsPrefix + 'MemberIdentifier__c']] +=
                    member[this.nsPrefix + 'SocialSecurityNumber__c'] && `${member[this.nsPrefix + 'SocialSecurityNumber__c']}`.length !== 9 ? 'SSN should be 9 digits, ' : '';

                member[ this.nsPrefix + 'HireDate__c'] = moment(member[this.nsPrefix +  'HireDate__c'] ).isValid() ? member[ this.nsPrefix + 'HireDate__c'] : "";
                member[ this.nsPrefix + 'Birthdate__c'] = moment(member[ this.nsPrefix + 'Birthdate__c'] ).isValid() ? member[this.nsPrefix +  'Birthdate__c'] : "";
                if (member.Relationship === 'Employee') {
                    empUniqueId = member[this.nsPrefix + 'SocialSecurityNumber__c'];
                    empUniquePrimid = member[this.nsPrefix + 'PrimaryMemberIdentifier__c']
                } else if (member.Relationship === 'Spouse') {
                    member[this.nsPrefix + 'IsPrimaryMember__c'] = member['QE_Primary_SSN__c'] !== empUniqueId;
                    if(member['QE_Primary_SSN__c'] !== empUniqueId){
                        this.unsavedErros[member[this.nsPrefix + 'MemberIdentifier__c']] +='SSN and Relationship combination is invalid,';

                    }
                    member[this.nsPrefix + 'IsSpouse__c'] = true;
                    // member['QE_Primary_SSN__c'] = empUniqueId || "";
                    member[this.nsPrefix + 'PrimaryMemberIdentifier__c'] = empUniquePrimid || '';
                } else {
                    member[this.nsPrefix + 'IsPrimaryMember__c'] = member['QE_Primary_SSN__c'] !== empUniqueId;
                    if(member['QE_Primary_SSN__c'] !== empUniqueId){
                        this.unsavedErros[member[this.nsPrefix + 'MemberIdentifier__c']] +='SSN and Relationship combination is invalid,';
                    }
                    member[this.nsPrefix + 'IsSpouse__c'] = false;
                    // member[ 'QE_Primary_SSN__c'] = empUniqueId || "";
                    member[this.nsPrefix +  'PrimaryMemberIdentifier__c'] = empUniquePrimid || '';
                }
                if (empUniqueId === null) {
                    currentDepBatch.push(member);
                } else {
                    currentDepBatch.forEach(m => {
                        m[ 'QE_Primary_SSN__c'] = empUniqueId;
                        m[this.nsPrefix +  'PrimaryMemberIdentifier__c'] = empUniquePrimid;
                    });
                    currentDepBatch.length = 0;
                }
            }
            if(this.omniJsonData && this.omniJsonData.SubGroup){
                //Andrew Vaughn: Renewal SubGroups can re-use numbers, so use effect date + number to determine sub group id
                let memberEffectiveDate = new Date(member[ 'QE_Effective_Date__c']);
                //let subgroup = subgroupArr.find(s => s.Number === `${member['QE_Sub_Group__c']}`);
               // console.log('subgroupArr = '+JSON.stringify(subgroupArr));
                let subgroup = subgroupArr.find(s => {
                    let planEffectiveStartDate = new Date(s.PlanEffectiveStartDate);
                   // console.log('planEffectiveStartDate = '+planEffectiveStartDate);
                    let planUTCStartDate = new Date(planEffectiveStartDate.getTime() - planEffectiveStartDate.getTimezoneOffset() * 60000);
                 //   console.log('planUTCStartDate = '+planUTCStartDate);
                    let planEffectiveEndDate = new Date(s.PlanEffectiveEndDate);
                  //  console.log('planEffectiveEndDate = '+planEffectiveEndDate);
                    let plantUTCEndDate = new Date(planEffectiveEndDate.getTime() - planEffectiveEndDate.getTimezoneOffset() * 60000);

                    //DSP-42739
                    //Using Moment cause Date don't match when using UTC
                    let memberEffectiveDt = moment(member[ 'QE_Effective_Date__c']);
                    let planEffectiveStartDt = moment(s.PlanEffectiveStartDate);
                    let planEffectiveEndDt = moment(s.PlanEffectiveEndDate);
                   
                    //console.log('plantUTCEndDate = '+plantUTCEndDate);
                   // console.log('memberEffectiveDate = '+memberEffectiveDate);
                   //DSP-42739
                   //old return 
                   // return s.Number == `${member['QE_Sub_Group__c']}` && memberEffectiveDate >= planUTCStartDate && memberEffectiveDate < plantUTCEndDate;
                    //DSP-42739
                    //return with moment 
                    return  s.Number == `${member['QE_Sub_Group__c']}` && memberEffectiveDt.isSameOrAfter(planEffectiveStartDt, 'day')  &&  memberEffectiveDt.isBefore(planEffectiveEndDt, 'day') ;
                   
                });
               // console.log('subgroup = '+JSON.stringify(subgroup));
                let groupClassId =  groupClassArr.find(g=> g.Name === `${member[this.nsPrefix + 'GroupClassId__c']}`)
                member['QE_Sub_Group__c'] = subgroup ? subgroup.SubGroupId : '';
                member['QE_Sub_Division__c'] = subgroup ? subgroup.LocationId : '';
                member[this.nsPrefix + 'ContractLineId__c'] = subgroup ? subgroup.PlanId : '';
                member[this.nsPrefix + 'GroupClassId__c'] = groupClassId ? groupClassId.Id : '';
            }
            return member;
        });
        this.formatAllDateFields(members);
        this.census = members;
        this.calculateCensusInfo();
        this.navigateToFirstPage();
        //console.log('members = '+JSON.stringify(members));
        this.saveMembers(members);

    }
    connectedCallback() {

        this._actionUtil = new OmniscriptActionCommonUtil();
        this.stateData = omniscriptUtils.getSaveState(this);
        if (this.omniJsonDef.propSetMap.displaySettings) {
            this.displaySettings = JSON.parse(JSON.stringify(this.omniJsonDef.propSetMap.displaySettings || {}));
        }
        if (this.stateData) {
            this.parseSavedState(this.stateData);
        } else {
            this.init();
        }
        const dataOmniLayout = this.getAttribute('data-omni-layout');
        this.theme = dataOmniLayout === 'newport' ? 'nds' : 'slds';
        this.itemsPerPage = parseInt(this.itemsPerPage, 10);
        this.censusMemberUploadLimit = parseInt(this.censusMemberUploadLimit, 10);
       // console.log("header in connectedCallback:::", this.headers);
        this.omniApplyCallResp({unsavedCensus: this.unsaved, emptyMembers: this.saveResponse && !this.saveResponse.censusMemberIds.length });
    }
    saveState() {
        this.omniSaveState({
            census: this.census,
            headers: this.headers,
            customLabels: this.customLabels,
            saveResponse: this.saveResponse,
            unsaved: this.unsaved
        }, null, true);
    }
    parseSavedState(stateData) {
        this.census = stateData.census;
        this.headers = stateData.headers;
        this.customLabels = stateData.customLabels;
        this.saveResponse = stateData.saveResponse;
        this.unsaved = stateData.unsaved;
        this.calculateCensusInfo();
        this.isLoaded = true;
    }


    validateMemberFields(){
        // if(this.omniJsonData.fieldSetName === 'Small_Group'){
            this.employees.forEach(e => {
                 e.error = '';
                 e.warning = '';
                 e.error += !e.vlocity_ins__FirstName__c || e.vlocity_ins__FirstName__c === '' ? 'First Name is required, ' : '';
                 e.error += !e.QE_Primary_SSN__c        || e.QE_Primary_SSN__c === '' ? 'Primary SSN is required, ' : '';
                 e.error += this.unsavedErros[e.vlocity_ins__MemberIdentifier__c] ? this.unsavedErros[e.vlocity_ins__MemberIdentifier__c] : '';
                 e.error += !e.vlocity_ins__LastName__c || e.vlocity_ins__LastName__c === '' ? 'Last Name is required, ' : '';
                 e.error += !e.vlocity_ins__Gender__c   || e.vlocity_ins__Gender__c === '' ? 'Gender is required, ' : '';
                 e.error += !e.vlocity_ins__Birthdate__c || e.vlocity_ins__Birthdate__c === '' ? 'Birthdate is required, ' : '';
                 e.error += e.vlocity_ins__Birthdate__c && moment(e.vlocity_ins__Birthdate__c,'YYYY-MM-DD').isAfter(moment()) ? 'Invalid Birthdate' : '';
                //  e.error += !e.Cobra__c                 || e.Cobra__c === '' ? 'Cobra is required, ' : '';
                //  e.error += !e.QE_Out_of_Area__c        || e.QE_Out_of_Area__c === '' ? 'Out of Area is required, ' : '';
                 e.error += !e.vlocity_ins__PostalCode__c || e.vlocity_ins__PostalCode__c === '' ? 'Postal Code is required, ' : '';
                 e.error += !e.vlocity_ins__SocialSecurityNumber__c || e.vlocity_ins__SocialSecurityNumber__c === '' ? 'Social Security Number is required, ' : '';
                 e.error += !e.QE_Address__c                || e.QE_Address__c === '' ? 'Address is required, ' : '';
                 e.error += !e.QE_City__c                   || e.QE_City__c === '' ? 'City is required, ' : '';
                 e.error += !e.State__c                     || e.State__c === '' ? 'State is required, ' : '';
                 e.error += !e.QE_Effective_Date__c         || e.QE_Effective_Date__c === '' ? 'Effective Date is required, ' : '';
                 e.error += !e.QE_HSA__c                    || e.QE_HSA__c === '' ? 'HSA is required, ' : '';
                 e.error += !e.QE_Sub_Group__c                    || e.QE_Sub_Group__c === '' ? 'Sub Group is required, ' : '';
                
               // console.log('HIRE DATE: ' , e.vlocity_ins__HireDate__c, ' Term Date: ',  e.QE_Term_Date__c );

                 //Employeee Term Date check //DSP-42761.
                 e.error += (e.vlocity_ins__HireDate__c && e.QE_Term_Date__c   && (  moment(e.vlocity_ins__HireDate__c).isAfter(moment(e.QE_Term_Date__c) )  )   ) ? 'Term date cannot be before Hire date' :'';
                 
                 if(!this.isImportFromContract){
                    e.warning += !e.vlocity_ins__GroupClassId__c              || e.vlocity_ins__GroupClassId__c === '' ? 'Group Class is missing, ' : '';
                 }else
                 {
                      e.error += !e.vlocity_ins__GroupClassId__c              || e.vlocity_ins__GroupClassId__c === '' ? 'Group Class is missing, ' : '';
                 }
                 e.error += e.QE_HSA__c && e.QE_HSA__c === 'Y' && (!e.QE_HSA_Begin_Date__c || e.QE_HSA_Begin_Date__c === "") ? 'HSA Begin Date is required, ' : '';

                 if(e.error === ''){
                     e.error = undefined;
                 }
                 if(e.warning === ''){
                    e.warning = undefined;
                }
                 if(e.dependents){
                     e.dependents.forEach(dep => {
                        dep.error = '';
                        dep.warning = '';
                        dep.error += !dep.QE_Primary_SSN__c        || dep.QE_Primary_SSN__c === '' ? 'Primary SSN is required, ' : '';
                        dep.error += this.unsavedErros[dep.vlocity_ins__MemberIdentifier__c] ? this.unsavedErros[dep.vlocity_ins__MemberIdentifier__c] : '';
                        dep.error += !dep.vlocity_ins__FirstName__c || dep.vlocity_ins__FirstName__c === '' ? 'First Name is required, ' : '';
                        dep.error += !dep.vlocity_ins__LastName__c || dep.vlocity_ins__LastName__c === '' ? 'Last Name is required, ' : '';
                        dep.error += !dep.vlocity_ins__Gender__c   || dep.vlocity_ins__Gender__c === '' ? 'Gender is required, ' : '';
                        dep.error += !dep.vlocity_ins__Birthdate__c || dep.vlocity_ins__Birthdate__c === '' ? 'Birthdate is required, ' : '';
                        dep.error += dep.vlocity_ins__Birthdate__c && moment(dep.vlocity_ins__Birthdate__c,'YYYY-MM-DD').isAfter(moment()) ? 'Invalid Birthdate' : '';
                        // dep.error += !dep.Cobra__c                 || dep.Cobra__c === '' ? 'Cobra is required, ' : '';
                        // dep.error += !dep.QE_Out_of_Area__c        || dep.QE_Out_of_Area__c === '' ? 'Out of Area is required, ' : '';
                        dep.error += !dep.vlocity_ins__PostalCode__c || dep.vlocity_ins__PostalCode__c === '' ? 'Postal Code is required, ' : '';
                        dep.error += !dep.vlocity_ins__SocialSecurityNumber__c || dep.vlocity_ins__SocialSecurityNumber__c === '' ?  'Social Security Number is required, ' : '';
                        dep.error += !dep.QE_Address__c              || dep.QE_Address__c === '' ? 'Address is required, ' : '';
                        dep.error += !dep.QE_City__c                 || dep.QE_City__c === '' ? 'City is required, ' : '';
                        dep.error += !dep.State__c                   || dep.State__c === '' ? 'State is required, ' : '';
                        dep.error += !dep.QE_Effective_Date__c       || dep.QE_Effective_Date__c === '' ? 'Effective Date is required, ' : '';
                        dep.error += !dep.QE_HSA__c                  || dep.QE_HSA__c === '' ? 'HSA is required, ' : '';
                        dep.error += !dep.QE_Sub_Group__c                    || dep.QE_Sub_Group__c === '' ? 'Sub Group is required, ' : '';
                        if(!this.isImportFromContract){
                            dep.warning += !dep.vlocity_ins__GroupClassId__c            || dep.vlocity_ins__GroupClassId__c === '' ? 'Group class is missing, ' : '';
                        }else
                        {
                             dep.error += !dep.vlocity_ins__GroupClassId__c            || dep.vlocity_ins__GroupClassId__c === '' ? 'Group class is missing, ' : '';
                        }
                        dep.error += dep.QE_HSA__c && dep.QE_HSA__c === 'Y' && (!dep.QE_HSA_Begin_Date__c || dep.QE_HSA_Begin_Date__c === "") ? 'HSA Begin Date is required, ' : '';


                        //Dependent Term Date check //DSP-42761.
                        dep.error += (dep.vlocity_ins__HireDate__c && dep.QE_Term_Date__c   && (  moment(dep.vlocity_ins__HireDate__c).isAfter(moment(dep.QE_Term_Date__c) )  )   ) ? 'Invalid Dependent Hire Date or Term Date' :'';


                        if(dep.error === ''){
                            dep.error = undefined;
                        }
                        if(dep.warning === ''){
                            dep.warning = undefined;
                        }
                     })
                 }
            })

    }
    initHeaders(fetchedHeaders) {
        // let names = ['vlocity_ins__SpecProduct2Id__c', 'vlocity_ins__GroupClassId__c', 'vlocity_ins__GroupClassId__r.Name'];
        let names = [ 'Name', 'vlocity_ins__GroupClassId__c', 'vlocity_ins__GroupClassId__r.Name', 'QE_Sub_Group__c', 'QE_Sub_Division__c'];

        this.headers = fetchedHeaders.filter(header => {
            if(names.includes(header.name)) return false;
            return true;
        }).map((header, index) => {
            header.index = `${index}`;
            return header;
        });
        let groupClassArr =  this.omniJsonData && this.omniJsonData.GroupClass ? Array.isArray(this.omniJsonData.GroupClass) ? this.omniJsonData.GroupClass : [this.omniJsonData.GroupClass]: [];
        this.headers.push({
            "type": "PICKLIST",
            "fieldId": "",
            "options": groupClassArr.map(g=> ({value:g.Id, label:g.Name})),
            "label": "Group Class",
            "name": "vlocity_ins__GroupClassId__c",
          })
        let subgroupArr =  this.omniJsonData && this.omniJsonData.SubGroup ? Array.isArray(this.omniJsonData.SubGroup) ? this.omniJsonData.SubGroup : [this.omniJsonData.SubGroup] : [];
        this.headers.push({
            "type": "PICKLIST",
            "fieldId": "",
            "options": subgroupArr.map(g=> ({value:g.SubGroupId, label:g.Number})),
            "label": "Sub Group Number",
            "name": "QE_Sub_Group__c",
          })
        this.headers.push({
            "type": "PICKLIST",
            "fieldId": "",
            "options": subgroupArr.filter((s, index, self) => index === self.findIndex((t) => (t.LocationId === s.LocationId ))).map(g=> ({value:g.LocationId, label:g.Location})),
            "label": "Sub Group Name",
            "name": "QE_Sub_Division__c",
          })


/*
          //Only if from Import contract.
          if( this.isImportFromContract){
            //Store state of the record.
            this.headers.push(
                {
                    "type": 'STRING',
                    "style": 'noShow',
                    'label': 'Record State',
                    name:'QE_Record_State__c'
                });
            }*/


    }

    handleInitialCensusLoad(response) {
        //console.log('HANDLE INITIAL', response);
        this.isLoaded = true;
        if(response){
            const parsedData = JSON.parse(response);

            const responseError = parsedData.errors || parsedData.error;
            if (responseError && responseError !== 'OK') {
                this.showError({ message: responseError });
                this.isValidCensus = false;
                return;
            }
            if(parsedData && parsedData.census && parsedData.census.members && parsedData.census.members.length > 0){
                this.unsaved = false;
                this.omniApplyCallResp({unsavedCensus: this.unsaved, emptyMembers: this.saveResponse && !this.saveResponse.censusMemberIds.length });
            }
            this.census = parsedData.census.members.map((m, index) => {
                m.memberIndex = index;
                m.uuid = this.generateUniqueId();
                return m;
            });
            this.initHeaders(parsedData.census.headers);
           /* console.log("handleInitialCensusLoad parsedData:::", parsedData);
            console.log("this.initHeaders(parsedData.census.headers); parsedData:::", this.headers);*/
            this.calculateCensusInfo();


            this.isLoaded = true;
        }
    }

}