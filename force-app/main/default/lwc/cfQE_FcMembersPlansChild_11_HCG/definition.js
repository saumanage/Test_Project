let definition =
      {"dataSource":{"contextVariables":[{"id":2,"name":"User.userContactId","val":"0030100000CrnA3AAJ"},{"id":3,"name":"FromFC","val":"true"},{"id":15,"name":"Status","val":"Active"},{"id":7,"name":"recordId","val":"0030100000CrnA3AAJ"},{"id":9,"name":"User.userProfileName","val":"Member"}],"orderBy":{"isReverse":false,"name":""},"type":"IntegrationProcedures","value":{"inputMap":{"ContactId":"{User.userContactId}","FromFC":"true","ProfileName":"{User.userProfileName}","Status":"Active","recordId":"{recordId}"},"ipMethod":"QE_IpGetAncillaryPlans","resultVar":"[\"PlansDetails\"]","vlocityAsync":false}},"enableLwc":true,"isFlex":true,"lwc":{"DeveloperName":"cfQE_FcMembersPlansChild_11_HCG","Id":"0Rb01000000H5wYCAS","ManageableState":"unmanaged","MasterLabel":"cfQE_FcMembersPlansChild_11_HCG","NamespacePrefix":"c"},"states":[{"actions":[],"childCards":[],"components":{"layer-0":{"children":[{"children":[{"class":"slds-col ","element":"outputField","elementLabel":"Text-1-clone-0","key":"element_element_block_0_0_outputField_0_0","name":"Text","parentElementKey":"element_block_0_0","property":{"card":"{card}","mergeField":"%3Cdiv%3E%3Cspan%20class=%22slds-text-heading_large%22%20style=%22color:%20#000000;%20font-size:%2024pt;%22%3ECurrent%20Plans%3C/span%3E%3C/div%3E","record":"{record}"},"size":{"default":"10","isResponsive":false},"stateIndex":0,"styleObject":{"background":{"color":"","image":"","position":"","repeat":"","size":""},"border":{"color":"","radius":"","style":"","type":"","width":""},"class":"","container":{"class":""},"elementStyleProperties":{},"inlineStyle":"","margin":[],"padding":[],"size":{"default":"10","isResponsive":false},"sizeClass":"slds-size_10-of-12 ","style":"     : #ccc 1px solid; \n         ","text":{"align":"","color":""}},"type":"text"}],"class":"slds-col ","element":"block","elementLabel":"Block-1","name":"Block","property":{"card":"{card}","collapsedByDefault":false,"collapsible":false,"data-conditions":{"group":[],"id":"state-condition-object","isParent":true},"label":"Block","record":"{record}"},"size":{"default":12,"isResponsive":false},"stateIndex":0,"styleObject":{"background":{"color":"","image":"","position":"","repeat":"","size":""},"border":{"color":"","radius":"","style":"","type":"","width":""},"class":"","container":{"class":""},"elementStyleProperties":{},"inlineStyle":"","margin":[],"padding":[],"size":{"default":12,"isResponsive":false},"sizeClass":"slds-size_12-of-12 ","style":"     : #ccc 1px solid; \n         ","text":{"align":"","color":""}},"type":"block"},{"class":"slds-col ","element":"customLwc","elementLabel":"Custom LWC-2","name":"Custom LWC","property":{"actions":"[   {     \"type\": \"ProductDetail\",     \"field\": \"ProductId\",     \"label\": \"View Plan\"   },   {     \"type\": \"ViewDependents\",     \"field\": \"\",     \"label\": \"View Dependents\"   } ]","columns":"[     {         \"visible\": true,         \"label\": \"Plan Name\",         \"fieldName\": \"PlanName\",         \"sortable\": true,         \"searchable\": true,         \"sortingEnabled\": true     },     {         \"visible\": true,         \"label\": \"Plan Type\",         \"fieldName\": \"PlanType\",         \"sortable\": true,         \"searchable\": true,         \"sortingEnabled\": true     },  {         \"visible\": true,         \"label\": \"HSA\",         \"fieldName\": \"HSAElected\",         \"sortable\": true,         \"searchable\": true,         \"sortingEnabled\": true     },   {         \"visible\": true,         \"label\": \"Coverage\",         \"fieldName\": \"Coverage\",         \"sortable\": true,         \"searchable\": true,         \"sortingEnabled\": true     },     {         \"visible\": true,         \"label\": \"Start Date\",         \"fieldName\": \"EffectiveDate\",         \"sortable\": true,         \"searchable\": true,         \"sortingEnabled\": true     },     {         \"visible\": true,         \"label\": \"End Date\",         \"fieldName\": \"EndDate\",         \"sortable\": true,         \"searchable\": true,         \"sortingEnabled\": true     },     {         \"visible\": true,         \"label\": \"Your Cost\",         \"fieldName\": \"StandardPremium\",         \"sortable\": true,         \"searchable\": true,         \"sortingEnabled\": true     }, {         \"visible\": true,         \"label\": \"HSA Amount\",         \"fieldName\": \"HSAAmount\",         \"sortable\": true,         \"searchable\": true,         \"sortingEnabled\": true     },    {         \"visible\": true,         \"label\": \"Employer Cost\",         \"fieldName\": \"EmployerContribution\",         \"sortable\": true,         \"searchable\": true,         \"sortingEnabled\": true     },     {         \"visible\": true,         \"label\": \"Who is Covered?\",         \"fieldName\": \"Dependents\",         \"sortable\": true,         \"searchable\": true,         \"sortingEnabled\": true     } ]","customlwcname":"qE_LWCOptimaDataTable","displayactions":"true","pagesize":"10","records":"{records}","recordsnode":"records[0].Plan"},"size":{"default":"12","isResponsive":false},"stateIndex":0,"styleObject":{"sizeClass":"slds-size_12-of-12"},"type":"element"}]}},"conditions":{"group":[{"field":"showPlans","id":"state-new-condition-7","operator":"==","type":"custom","value":"true"}],"id":"state-condition-object","isParent":true},"definedActions":{"actions":[]},"documents":[],"fields":[],"isSmartAction":false,"name":"Active","omniscripts":[],"smartAction":{},"styleObject":{"class":"slds-card slds-p-around_x-small slds-m-bottom_x-small","container":{"class":"slds-card"},"margin":[{"size":"none","type":"around"}],"padding":[{"size":"x-small","type":"around"}],"size":{"default":"12","isResponsive":false},"sizeClass":"slds-size_12-of-12"}}],"theme":"slds","title":"QE_FcMembersPlansChild","xmlObject":{"apiVersion":48,"isExplicitImport":false,"masterLabel":"QE_FcMembersPlansChild","runtimeNamespace":"vlocity_ins","targetConfigs":"PHRhcmdldENvbmZpZyB0YXJnZXRzPSJsaWdodG5pbmdDb21tdW5pdHlfX0RlZmF1bHQiPg0KICAgICAgPHByb3BlcnR5IG5hbWU9InJlY29yZElkIiB0eXBlPSJTdHJpbmciLz4NCiAgICA8L3RhcmdldENvbmZpZz4=","targets":{"target":["lightningCommunity__Page","lightningCommunity__Default","lightning__RecordPage","lightning__HomePage","lightning__AppPage"]}},"Id":"a7v5Y000000HvEBQA0","vlocity_ins__GlobalKey__c":"QE_FcMembersPlansChild/HCG/11/1627596812736","vlocity_ins__IsChildCard__c":true};
  export default definition