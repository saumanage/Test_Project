import { api, track } from 'lwc';
import insOSCensus from 'vlocity_ins/insOsCensus';
import { omniscriptUtils, commonUtils, dataFormatter } from 'vlocity_ins/insUtility';
import { namespace } from 'vlocity_ins/utility';
import moment from "vlocity_ins/dayjs";
import {DebugSrv} from 'c/qE_LWCSharedUtil';

export default class QE_LWCInsOsCensus extends insOSCensus {

    nsPrefix = namespace;
    @track unsaved = true;
    /**
     * checkValidity should return a boolean value true, if the input is valid, false if invalid.
     * @returns {boolean}
     */
    @api checkValidity() {

        
        return this.saveResponse && !this.saveResponse.errors &&
            this.employees.filter(e => e.error).length === 0 && this.employees.map(e => e.dependents).flat(1).filter(e => e.error).length === 0 && !this.unsaved &&
            this.saveResponse.censusMemberIds.length > 0;
    }
    selectedEmployee = null;
    is5Tier = false;
    globalMMCensusWarning = false;
    globalCensusError = false;
    censusErrorArray = [];
    //isMmCensusChildCountValid = true;

    get percentageOfOOA() {
        let ooaMembers = this.employees.filter(e => e.QE_Out_of_Area__c == "Yes").length;
        let ooaDep = this.employees.map(e => e.dependents).flat(1).filter(e => e.QE_Out_of_Area__c == "Yes").length;

        let MembersLength = this.employees.length;
        let depsLength = this.employees.map(e => e.dependents).flat(1).length;

        let percent = ((ooaMembers + ooaDep) / (MembersLength + depsLength)) * 100;
        if (percent > 35 && this.omniJsonData.fieldSetName === 'Small_Group') {
            return true;
        }
        else if (percent > 20 && this.omniJsonData.fieldSetName === 'Mid_Sized_Group') {
            return true;
        }
        else if (percent > 35 && this.omniJsonData.fieldSetName === 'Level_Funded') {
            return true;
        }
        else {
            return false;
        }
        // if no members {
        //     return ""
        // }else{
        //     return ((ooaMembers + ooaDep) / (MembersLength + depsLength) ) * 100;

        // }
    }
    get showDeleteAllData() {
        //ShoW delete if census have data
        if( this.census  && this.census.length>0)
            return true;
        
        if(this.saveResponse && this.saveResponse.censusMemberIds)
            return    (this.saveResponse.censusMemberIds?.length?? 0) > 0;

        return false;

    }
    generateUniqueId() {
        return Math.random().toString(36).substring(7).toUpperCase();
    }
    disconnectedCallback() {
        /*** unsubscribe  event  ***/
        super.disconnectedCallback();


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
        newMember[this.nsPrefix + 'MemberIdentifier__c'] = this.generateUniqueId();
        newMember[this.nsPrefix + 'PrimaryMemberIdentifier__c'] = addDependent ? employee[this.nsPrefix + 'MemberIdentifier__c'] : newMember[this.nsPrefix + 'MemberIdentifier__c'];
        newMember.Relationship = '';
        newMember.memberIndex = this.censusCount + 1;
        newMember.uuid = this.generateUniqueId();
        newMember.edited = true;
        this.unsaved = true;
        this.isLoaded = true;
        this.omniApplyCallResp({ unsavedCensus: this.unsaved, emptyMembers: this.census.length > 0 ? false : true });
        return newMember;
    }
    handleUpdateCensusLoad(getMembersResponse, saveMembersResponse) {
        super.handleUpdateCensusLoad(getMembersResponse, saveMembersResponse);
        this.unsaved = false;
        let OOAFlag = this.employees.filter(e => e.QE_Out_of_Area__c === 'Yes').length > 0 ||
            this.employees.map(e => e.dependents).flat(1).filter(e => e.QE_Out_of_Area__c === 'Yes').length > 0;
        this.omniApplyCallResp({ unsavedCensus: false, emptyMembers: this.census.length > 0 ? false : true, outOfAreaPlanRequired: OOAFlag });
        this.saveResponse = JSON.parse(saveMembersResponse);
        DebugSrv.IS_DEBUG() && console.log(this.saveResponse);
        this.omniValidate();
        this.isLoaded = true;
    }
    handleUpdate(ev) {
        DebugSrv.IS_DEBUG() && console.log("This.Census Person:::", ev);
        super.handleUpdate(ev);
        DebugSrv.IS_DEBUG() && console.log("this.census:::", JSON.stringify(this.census));
        this.unsaved = true;
        this.isLoaded = true;
        this.omniApplyCallResp({ unsavedCensus: true, emptyMembers: this.census.length > 0 ? false : true });
        this.omniValidate();
    }

    connectedCallback() {
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
        DebugSrv.IS_DEBUG() && console.log("header in connectedCallback:::", this.headers);
        this.is5Tier = this.omniJsonData.fieldSetName !== 'Small_Group';
        this.omniApplyCallResp({ unsavedCensus: this.unsaved, emptyMembers: this.census.length > 0 ? false : true });
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

    calculateCensusInfoMidMarket() {
        let censusInfo = { total: this.census.length, totalEmp: 0, empCount: 0, empChCount: 0, empSingleChCount: 0, empSpCount: 0, empFaCount: 0 };
        let employees = [];
        let empDeps = {}; // Stores dependents information on primary member's ID
        let totalMember = 0;
        // Add employee dependents
        this.census.forEach(member => {
            if (dataFormatter.getNamespacedProperty(member, 'IsPrimaryMember__c')) {
                // Check if a primary member
                if (this.selectedEmployee) {
                    const selectedEmployeeIdentifier = dataFormatter.getNamespacedProperty(
                        this.selectedEmployee,
                        'MemberIdentifier__c'
                    );
                    const memberIdentifier = dataFormatter.getNamespacedProperty(member, 'MemberIdentifier__c');
                    if (selectedEmployeeIdentifier === memberIdentifier) {
                        member.isSelected = true;
                    }
                }
                employees.push(member);
            } else {
                const primaryMemberId = dataFormatter.getNamespacedProperty(member, 'PrimaryMemberIdentifier__c');
                if (empDeps[primaryMemberId]) {
                    empDeps[primaryMemberId].push(member);
                } else {
                    empDeps[primaryMemberId] = [member];
                }
            }
        });

        // Update census info
        employees.forEach((member, index) => {
            const memberIdentifier = dataFormatter.getNamespacedProperty(member, 'MemberIdentifier__c');
            const hasSpouse = dataFormatter.getNamespacedProperty(member, "QE_HasSpouse__c")
            const noOfChild = dataFormatter.getNamespacedProperty(member, "QE_Number_of_Children__c");
            const hasOneChild = noOfChild === 1 ? true : false;
            const hasChildrens = noOfChild > 1 ? true : false;

            //let hasSpouse = false;
            let censusChildRowCount = 0;

            member.index = index;
            member.dependents = empDeps[memberIdentifier] ? empDeps[memberIdentifier] : [];

            member.dependents.forEach(dependent => {
                const dependentIsSpouse = dataFormatter.getNamespacedProperty(dependent, 'IsSpouse__c');

                if (!dependentIsSpouse) {
                    censusChildRowCount++;
                }
            });

            if (hasSpouse && (hasOneChild || hasChildrens)) {
                censusInfo.empFaCount++;
            } else if (hasSpouse && !(hasOneChild || hasChildrens)) {
                censusInfo.empSpCount++;
            } else if (!hasSpouse && hasOneChild) {
                censusInfo.empSingleChCount++;
            } else if (!hasSpouse && hasChildrens) {
                censusInfo.empChCount++;
            } else if (!hasSpouse && !(hasOneChild || hasChildrens)) {
                censusInfo.empCount++;
            }
            // DebugSrv.IS_DEBUG() && console.log("memberIdentifier ", memberIdentifier, censusChildRowCount, noOfChild, censusChildRowCount !== noOfChild);

            totalMember++;
            if (hasSpouse) {
                totalMember++;
            }
            if (noOfChild && noOfChild > 0) {
                totalMember = totalMember + noOfChild;
            }
        });
        
        this.censusInfo = censusInfo;
        censusInfo.totalEmp = employees.length;
        censusInfo.total = totalMember;
        this.employees = employees;
        this.empDeps = empDeps;
    }

    calculateCensusInfoLevelFunded() {
        let censusInfo = { total: this.census.length, totalEmp: 0, empCount: 0, empChCount: 0, empSingleChCount: 0, empSpCount: 0, empFaCount: 0 };
        let employees = [];
        let empDeps = {}; // Stores dependents information on primary member's ID

        // Add employee dependents
        this.census.forEach(member => {
            if (dataFormatter.getNamespacedProperty(member, 'IsPrimaryMember__c')) {
                // Check if a primary member
                if (this.selectedEmployee) {
                    const selectedEmployeeIdentifier = dataFormatter.getNamespacedProperty(
                        this.selectedEmployee,
                        'MemberIdentifier__c'
                    );
                    const memberIdentifier = dataFormatter.getNamespacedProperty(member, 'MemberIdentifier__c');
                    if (selectedEmployeeIdentifier === memberIdentifier) {
                        member.isSelected = true;
                    }
                }
                employees.push(member);
            } else {
                const primaryMemberId = dataFormatter.getNamespacedProperty(member, 'PrimaryMemberIdentifier__c');
                if (empDeps[primaryMemberId]) {
                    empDeps[primaryMemberId].push(member);
                } else {
                    empDeps[primaryMemberId] = [member];
                }
            }
        });
        // Update census info
        employees.forEach((member, index) => {
            const memberIdentifier = dataFormatter.getNamespacedProperty(member, 'MemberIdentifier__c');
            let hasSpouse = false;
            let hasChild = false;
            let childCount = 0;
            member.index = index;
            member.dependents = empDeps[memberIdentifier] ? empDeps[memberIdentifier] : [];
            
            member.dependents.forEach(dependent => {
                const dependentIsSpouse = dataFormatter.getNamespacedProperty(dependent, 'IsSpouse__c');

                if (dependentIsSpouse) {
                    hasSpouse = true;
                } else {
                    hasChild = true;
                    childCount++;
                }
            });

            if(hasSpouse && hasChild) {
                censusInfo.empFaCount++;
            } else if(hasSpouse && !hasChild) {
                censusInfo.empSpCount++;
            } else if(!hasSpouse && hasChild && childCount === 1) {
                censusInfo.empSingleChCount++;
            } else if(!hasSpouse && hasChild) {
                censusInfo.empChCount++;
            } else if(!hasSpouse && !hasChild) {
                censusInfo.empCount++;
            }
        });

        this.censusInfo = censusInfo;
        censusInfo.totalEmp = employees.length;
        this.employees = employees;
        this.empDeps = empDeps;
    }

    calculateCensusInfoSmallGroup() {
        let censusInfo = { total: this.census.length, totalEmp: 0, empCount: 0, empChCount: 0, empSpCount: 0, empFaCount: 0 };
        let employees = [];
        let empDeps = {}; // Stores dependents information on primary member's ID

        // Add employee dependents
        this.census.forEach(member => {
            if (dataFormatter.getNamespacedProperty(member, 'IsPrimaryMember__c')) {
                // Check if a primary member
                if (this.selectedEmployee) {
                    const selectedEmployeeIdentifier = dataFormatter.getNamespacedProperty(
                        this.selectedEmployee,
                        'MemberIdentifier__c'
                    );
                    const memberIdentifier = dataFormatter.getNamespacedProperty(member, 'MemberIdentifier__c');
                    if (selectedEmployeeIdentifier === memberIdentifier) {
                        member.isSelected = true;
                    }
                }
                employees.push(member);
            } else {
                const primaryMemberId = dataFormatter.getNamespacedProperty(member, 'PrimaryMemberIdentifier__c');
                if (empDeps[primaryMemberId]) {
                    empDeps[primaryMemberId].push(member);
                } else {
                    empDeps[primaryMemberId] = [member];
                }
            }
        });

        // Update census info
        employees.forEach((member, index) => {
            const memberIdentifier = dataFormatter.getNamespacedProperty(member, 'MemberIdentifier__c');
            let hasSpouse = false;
            let hasChild = false;

            member.index = index;
            member.dependents = empDeps[memberIdentifier] ? empDeps[memberIdentifier] : [];
            member.dependents.forEach(dependent => {
                const dependentIsSpouse = dataFormatter.getNamespacedProperty(dependent, 'IsSpouse__c');
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
        this.censusInfo = censusInfo;
        censusInfo.totalEmp = employees.length;
        this.employees = employees;
        this.empDeps = empDeps;
    }

    calculateCensusInfo() {
        console.log(this.omniJsonData);
        //DebugSrv.IS_DEBUG() && console.log("this.omniJsonData.fieldSetName - ", this.omniJsonData.fieldSetName);
        if (this.omniJsonData.fieldSetName === 'Level_Funded') {
            DebugSrv.IS_DEBUG() && console.log('calculating level funded');
            this.calculateCensusInfoLevelFunded();
        } else if (this.omniJsonData.fieldSetName === 'Mid_Sized_Group') {
            DebugSrv.IS_DEBUG() && console.log('mid market');
            this.calculateCensusInfoMidMarket();
        } else {
            DebugSrv.IS_DEBUG() && console.log('calculating small group');
            this.calculateCensusInfoSmallGroup();
        }
        this.omniApplyCallResp({ unsavedCensus: this.unsaved, emptyMembers: this.census.length > 0 ? false : true });
        this.validateMemberFields()
    }

    validateEmployeeFields(e) {
        e.error = '';
        e.error += !e.vlocity_ins__PrimaryMemberIdentifier__c || e.vlocity_ins__PrimaryMemberIdentifier__c === '' ? 'Primary Member Identifier is missing is required, please correct the issue and upload the census again' : '';
        e.error += !e.vlocity_ins__MemberIdentifier__c || e.vlocity_ins__MemberIdentifier__c === '' ? 'Member Identifier is missing is required, please correct the issue and upload the census again' : '';
        e.error += !e.vlocity_ins__FirstName__c || e.vlocity_ins__FirstName__c === '' ? 'First Name is required, ' : '';
        e.error += !e.vlocity_ins__LastName__c || e.vlocity_ins__LastName__c === '' ? 'Last Name is required, ' : '';
        e.error += !e.vlocity_ins__Gender__c || e.vlocity_ins__Gender__c === '' ? 'Gender is required, ' : '';
        e.error += !e.vlocity_ins__Birthdate__c || e.vlocity_ins__Birthdate__c === '' ? 'Birthdate is required, ' : '';
        e.error += e.vlocity_ins__Birthdate__c && moment(e.vlocity_ins__Birthdate__c, 'YYYY-MM-DD').isAfter(moment()) ? 'Invalid Birthdate' : '';
        e.error += !e.QE_Out_of_Area__c || e.QE_Out_of_Area__c === '' ? 'Out of Area is required, ' : '';
        e.error += !e.vlocity_ins__PostalCode__c || e.vlocity_ins__PostalCode__c === '' ? 'Postal Code is required, ' : '';
        if (typeof e.QE_Effective_Age__c === "number") {
            e.error += e.QE_Effective_Age__c < 17 ? 'You have uploaded census with subscribers below the minimum age threshold of 17, please correct the issue and upload the census again' : '';
        } else {
            const ageByDOB = new Date(new Date() - new Date(e.vlocity_ins__Birthdate__c)).getFullYear() - 1970;
            e.error += ageByDOB < 17 ? 'You have uploaded census with subscribers below the minimum age threshold of 17, please correct the issue and upload the census again' : '';
        }
        if (this.omniJsonData.fieldSetName === 'Mid_Sized_Group') {
            e.error += !e.QE_Product_Line__c || e.QE_Product_Line__c === '' ? 'Product Line is required, ' : '';
        }
        if (e.error === '') {
            this.censusErrorArray.push(0);
            e.error = undefined;
        } else {
            this.censusErrorArray.push(1);
        }
    }

    validateDependentsFields(dep) {
        dep.error = '';
        dep.error += !dep.vlocity_ins__PrimaryMemberIdentifier__c || dep.vlocity_ins__PrimaryMemberIdentifier__c === '' ? 'Primary Member Identifier is missing is required, please correct the issue and upload the census again, ' : '';
        dep.error += !dep.vlocity_ins__MemberIdentifier__c || dep.vlocity_ins__MemberIdentifier__c === '' ? 'Member Identifier is missing is required, please correct the issue and upload the census again, ' : '';
        dep.error += !dep.vlocity_ins__FirstName__c || dep.vlocity_ins__FirstName__c === '' ? 'First Name is required, ' : '';
        dep.error += !dep.vlocity_ins__LastName__c || dep.vlocity_ins__LastName__c === '' ? 'Last Name is required, ' : '';
        dep.error += !dep.vlocity_ins__Gender__c || dep.vlocity_ins__Gender__c === '' ? 'Gender is required, ' : '';
        dep.error += !dep.vlocity_ins__Birthdate__c || dep.vlocity_ins__Birthdate__c === '' ? 'Birthdate is required, ' : '';
        dep.error += dep.vlocity_ins__Birthdate__c && moment(dep.vlocity_ins__Birthdate__c, 'YYYY-MM-DD').isAfter(moment()) ? 'Invalid Birthdate' : '';
        dep.error += !dep.QE_Out_of_Area__c || dep.QE_Out_of_Area__c === '' ? 'Out of Area is required, ' : '';
        dep.error += !dep.vlocity_ins__PostalCode__c || dep.vlocity_ins__PostalCode__c === '' ? 'Postal Code is required, ' : '';
        if (this.omniJsonData.fieldSetName === 'Mid_Sized_Group') {
            dep.error += !dep.QE_Product_Line__c || dep.QE_Product_Line__c === '' ? 'Product Line is required, ' : '';
        }
        if (dep.error === '') {
            this.censusErrorArray.push(0);
            dep.error = undefined;
        } else {
            this.censusErrorArray.push(1);
        }
    }

    validateMemberFields() {
        let warningMessage = false;

        this.censusErrorArray = [];
        this.employees.forEach(e => {
            this.validateEmployeeFields(e);
            if (this.omniJsonData.fieldSetName === 'Mid_Sized_Group') {
                warningMessage = this.employeeLevelWarning(e);
            }
            if (e.dependents) {
                e.dependents.forEach(dep => {
                    this.validateDependentsFields(dep);
                })
            }
        })
        
        this.globalCensusError = this.censusErrorArray.indexOf(1) === -1 ? false : true;
        
        if (!this.globalCensusError && this.omniJsonData.fieldSetName === 'Mid_Sized_Group' && warningMessage) {
            this.setGlobalMMCensusWarning();
        }
    }

    setGlobalMMCensusWarning() {
        this.globalMMCensusWarning = this.employees.some(e => {
            let temp = this.getMMChildCount(e);
            if(e.QE_Number_of_Children__c == "") {
                e.QE_Number_of_Children__c = 0;
            }
            
            return e.QE_Number_of_Children__c !== temp;
        });
    }

    getMMChildCount(e) {
        return  e.QE_HasSpouse__c ?  e.dependents.length -1: e.dependents.length;;
    }

    employeeLevelWarning(e) {
        e.warning = false;
        let empNumOfChildren = e.QE_Number_of_Children__c;
        let empHasSpouse = e.QE_HasSpouse__c;
        let empDependentsCountCensus = 0
        if (e.dependents && e.dependents.length > 0) {
            empDependentsCountCensus = e.dependents.length;
        }
        let empDependentsCount = empHasSpouse ? empNumOfChildren + 1 : empNumOfChildren;
        
        if (empDependentsCountCensus !== empDependentsCount && this.omniJsonData.fieldSetName !== 'Mid_Sized_Group') {
            e.warning = true;
        }

        return e.warning;
    }

        // Delete all census members on button click
        clearAll() {
            this.globalMMCensusWarning = false;
            const memberIdentifiers = this.census.map(member =>
                dataFormatter.getNamespacedProperty(member, 'MemberIdentifier__c')
            );
            this.deleteMembers(memberIdentifiers);
            this.closeDeleteAllModal();
        }
    /*removed because super method was not firing in some enviornments. Overwritten below
    filemapCreated(ev){
        DebugSrv.IS_DEBUG() && console.log('filemapCreated ev: ' + JSON.stringify(ev));
        let myEv = JSON.parse(JSON.stringify(ev));
        /*toDo: reformat myEv when mid Market and pass myEv to super.filemapCreated;
            if (this.omniJsonData.fieldSetName == 'Mid_Sized_Group') {
                reformatting of myEv goes here
            }

        */
        /*super.filemapCreated(myEv);
    }*/

    filemapCreated(ev) {
        this.isLoaded = false;
        const csvData = ev.detail.data || [];
        if (csvData.length > this.censusMemberUploadLimit) {
            this.showError({
                message: this.labels.InsOSCensusErrorExceedRowCount.replace('{0}', this.censusMemberUploadLimit)
            });
            this.isLoaded = true;
            return;
        }
        this.csvDataToCensus(csvData);
    }

    initHeaders(fetchedHeaders) {
        let names = ['vlocity_ins__SpecProduct2Id__c', 'vlocity_ins__GroupClassId__c', 'vlocity_ins__GroupClassId__r.Name'];

        this.headers = fetchedHeaders.filter(header => {
            if (names.includes(header.name)) return false;
            return true;
        }).map((header, index) => {
            header.index = `${index}`;
            return header;
        });


        //   this.headers = fetchedHeaders.map((header, index) => {
        //     if(names.includes(header.name)) return;
        //     header.index = `${index}`;
        //     return header;
        // });
    }

    handleInitialCensusLoad(response) {
        DebugSrv.IS_DEBUG() && console.log('HANDLE INITIAL', response);
        this.isLoaded = true;
        const parsedData = JSON.parse(response);
        const responseError = parsedData.errors || parsedData.error;
        if (responseError && responseError !== 'OK') {
            this.showError({ message: responseError });
            this.isValidCensus = false;
            return;
        }
        if (parsedData && parsedData.census && parsedData.census.members && parsedData.census.members.length > 0) {
            this.unsaved = false;
            this.omniApplyCallResp({ unsavedCensus: this.unsaved, emptyMembers: this.census.length > 0 ? false : true });
        }
        this.census = parsedData.census.members.map((m, index) => {
            m.memberIndex = index;
            m.uuid = this.generateUniqueId();
            return m;
        });
        this.initHeaders(parsedData.census.headers);
        DebugSrv.IS_DEBUG() && console.log("handleInitialCensusLoad parsedData:::", parsedData);
        DebugSrv.IS_DEBUG() && console.log("this.initHeaders(parsedData.census.headers); parsedData:::", this.headers);
        this.calculateCensusInfo();


        this.isLoaded = true;
    }


}