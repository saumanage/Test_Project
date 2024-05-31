import { api } from 'lwc';
import insOsCensusInfo from 'vlocity_ins/insOsCensusInfo';
import { namespace } from 'vlocity_ins/utility';
import { dataFormatter } from 'vlocity_ins/insUtility';
import pubsub from 'vlocity_ins/pubsub';
import { commonUtils } from 'vlocity_ins/insUtility';

const HIDDEN_FIELDS = ['IsSpouse__c', 'OptOutTypes__c', 'ContractLineId__c'];

export default class qE_LWCInsOsCensusInfoMembership extends insOsCensusInfo {
    @api headers;
    @api member;
    person;
    optOutTypesField;
    formChannel = `optimaInsOsCensusInfo-${dataFormatter.uniqueKey()}`;
    hiddenFieldsWithPrefix = [];
    pubsubPayload = {
        changeFieldValue: this.handleChange.bind(this)
    };
    get errorsMember(){
        return this.member.error.includes(' - ') ? this.member.error.split(';').map(e => e.split(' - ')[1]).join(', ') : this.member.error;
    }
    get warningMember(){
        return this.member.warning.includes(' - ') ? this.member.warning.split(';').map(e => e.split(' - ')[1]).join(', ') : this.member.warning;
    }
    connectedCallback() {
        this.hiddenFieldsWithPrefix = HIDDEN_FIELDS.map(f => `${namespace}${f}`);
        this.hiddenFieldsWithPrefix.push('QE_Record_State__c');

        this.person = { ...this.member }; // Copying member public property for easy manipulation
        // Deleting dependents node(If any), since this node is used for internal purpose only
        if (this.person.dependents) {
            delete this.person.dependents;
        }
        this.optOutTypesField = this.headers.find(el => el.name === `${namespace}OptOutTypes__c`);
        pubsub.register(this.formChannel, this.pubsubPayload);
        //console.log("headerColumns:::", JSON.stringify(this.headerColumns));
    }

    handleChange(payload) {
        //DebugSrv.IS_DEBUG() && console.log("inside HandleChange:::", JSON.stringify(this.person));
        this.person[payload.fieldName] = payload.value;
        commonUtils.triggerCustomEvent.call(this, 'update', { detail: this.person });
        //DebugSrv.IS_DEBUG() && console.log("Done HandleChange:::", JSON.stringify(this.person));
    }

    get headerColumns() {
        let columns = this.headers.filter(header => !this.hiddenFieldsWithPrefix.includes(header.name));
        const isPrimaryMember = dataFormatter.getNamespacedProperty(this.person, 'IsPrimaryMember__c');
        if (!this.disableRelationshipField) {
            let relationColumn = {
                name: `${namespace}IsSpouse__c`,
                type: 'PICKLIST',
                label: this.labels.InsOSCensusRelationship,
                options: []
            };
            if (isPrimaryMember) {
                relationColumn.options.push({ value: this.labels.InsOSCensusRelationshipEmployee, label: this.labels.InsOSCensusRelationshipEmployee });
            } else {
                relationColumn.options.push({ value: true, label: this.labels.InsOSCensusRelationshipSpouse });
                relationColumn.options.push({ value: false, label: this.labels.InsOSCensusRelationshipChild });
            }
            columns.push(relationColumn);
        }

        return columns.map(column => {
            return {
                dataType: column.type === 'REFERENCE' || column.type === 'DATE' ? 'LOOKUP': column.type,
                isUpdateable: column.name === 'QE_Effective_Age__c'
                                || column.name === 'vlocity_ins__PrimaryMemberIdentifier__c'
                                 ? false : true,
                options: column.options,
                isDisabled: column.name === 'vlocity_ins__GroupClassId__c'
                            || column.name === 'QE_Primary_SSN__c'
                            || column.name === 'QE_Sub_Group__c'
                            || column.name === 'QE_Sub_Division__c'
                            || column.name === 'vlocity_ins__ContractLineId__c'
                            ? true : false,
                label: column.label,
                value: column.name === `${namespace}IsSpouse__c` && isPrimaryMember ? this.labels.InsOSCensusRelationshipEmployee : this.member[column.name],
                fieldName: column.name,
                objectApiName: `${namespace}GroupCensusMember__c`,
                style: column.type === 'DATE' ? 'padding-top nds-m-bottom_large nds-size_1-of-5 nds-p-around_small slds-m-bottom_large slds-size_1-of-5 slds-p-around_small' : 'nds-m-bottom_large nds-size_1-of-5 nds-p-around_small slds-m-bottom_large slds-size_1-of-5 slds-p-around_small'
            };
        });
    }
}