let definition =
      {"dataSource":{"contextVariables":[],"orderBy":{"isReverse":false,"name":""},"type":"IntegrationProcedures","value":{"inputMap":{"ContactId":"{User.userContactId}","FromFC":"true","ProfileName":"{User.userProfileName}","Status":"Pending","columns":"[   {     \"visible\": true,     \"label\": \"Plan Name\",     \"fieldName\": \"PlanName\",     \"sortable\": true,     \"searchable\": true,     \"sortingEnabled\": true    },   {     \"visible\": true,     \"label\": \"Plan Type\",     \"fieldName\": \"PlanType\",     \"sortable\": true,     \"searchable\": true,     \"sortingEnabled\": true   },   {     \"visible\": true,     \"label\": \"Coverage\",     \"fieldName\": \"Coverage\",     \"sortable\": true,     \"searchable\": true,     \"sortingEnabled\": true   },   {     \"visible\": true,     \"label\": \"Start Date\",     \"fieldName\": \"EffectiveDate\",     \"sortable\": true,     \"searchable\": true,     \"sortingEnabled\": true   },    {     \"visible\": true,     \"label\": \"End Date\",     \"fieldName\": \"EndDate\",     \"sortable\": true,     \"searchable\": true,     \"sortingEnabled\": true   },   {     \"visible\": true,     \"label\": \"Standard Premium\",     \"fieldName\": \"StandardPremium\",     \"sortable\": true,     \"searchable\": true,     \"sortingEnabled\": true   },    {     \"visible\": true,     \"label\": \"Employer Contribution\",     \"fieldName\": \"EmployerContribution\",     \"sortable\": true,     \"searchable\": true,     \"sortingEnabled\": true   },    {     \"visible\": true,     \"label\": \"Total Monthly Cost\",     \"fieldName\": \"TotalMonthlyCost\",     \"sortable\": true,     \"searchable\": true,     \"sortingEnabled\": true   } ]","recordId":"{recordId}"},"ipMethod":"QE_IpGetAncillaryPlans","resultVar":"[\"PlansDetails\"]","vlocityAsync":false}},"enableLwc":true,"isFlex":true,"lwc":{"DeveloperName":"cfQE_FcMembersPendingPlansChild_19_HCG","Id":"0Rb5C0000001txESAQ","ManageableState":"unmanaged","MasterLabel":"cfQE_FcMembersPendingPlansChild_19_HCG","NamespacePrefix":"c"},"states":[{"actions":[],"childCards":[],"components":{"layer-0":{"children":[{"children":[{"class":"slds-col ","element":"outputField","elementLabel":"Text-1-clone-0","key":"element_element_block_0_0_outputField_0_0","name":"Text","parentElementKey":"element_block_0_0","property":{"card":"{card}","mergeField":"%3Cdiv%3E%3Cspan%20class=%22slds-text-heading_large%22%20style=%22color:%20#000000;%20font-size:%2024pt;%22%3EPending%20Plans%3C/span%3E%3C/div%3E","record":"{record}"},"size":{"default":"10","isResponsive":false},"stateIndex":0,"styleObject":{"background":{"color":"","image":"","position":"","repeat":"","size":""},"border":{"color":"","radius":"","style":"","type":"","width":""},"class":"","container":{"class":""},"elementStyleProperties":{},"inlineStyle":"","margin":[],"padding":[],"size":{"default":"10","isResponsive":false},"sizeClass":"slds-size_10-of-12 ","style":"     : #ccc 1px solid; \n         ","text":{"align":"","color":""}},"type":"text"},{"class":"slds-col ","element":"action","elementLabel":"Action-2","key":"element_element_block_0_0_action_1_0","name":"Action","parentElementKey":"element_block_0_0","property":{"actionList":[{"actionIndex":0,"buttonVariant":"neutral","card":"{card}","data-conditions":{"group":[{"field":"isOpenEnrollment","id":"state-new-condition-0","operator":"==","type":"custom","value":"true"},{"field":"User.userProfileName","id":"state-new-condition-14","logicalOperator":"&&","operator":"==","type":"custom","value":"Member"}],"id":"state-condition-object","isParent":true},"displayAsButton":true,"draggable":false,"hideActionIcon":true,"isOpen":true,"isTrackingDisabled":false,"key":"1664400566178-al1ogail1","label":"Action","record":"{record}","stateAction":{"channelName":"close_modal","displayName":"Update Plans","flyoutLwc":"q-e-os-enrollment-flow-english","flyoutParams":{"AssetStatusOE":"true","ContextId":"{User.userContactId}","OpenEnrollment":"true","RenewPlan":"true"},"flyoutType":"OmniScripts","hasExtraParams":true,"id":"flex-action-1664400802445","layoutType":"lightning","openFlyoutIn":"Modal","openUrlIn":"Current Window","osName":"QE/OsEnrollmentFlow/English","type":"Flyout","vlocityIcon":"standard-default"},"stateObj":"{record}","styles":{"label":{"color":"","fontSize":"18px","textAlign":"right"}}}],"buttonVariant":"neutral","card":"{card}","data-conditions":{"group":[{"field":"isOpenEnrollment","id":"state-new-condition-0","operator":"==","type":"custom","value":"true"},{"field":"User.userProfileName","id":"state-new-condition-14","logicalOperator":"&&","operator":"==","type":"custom","value":"Member"}],"id":"state-condition-object","isParent":true},"displayAsButton":true,"flyoutChannel":"close_modal","flyoutDetails":{"openFlyoutIn":"Modal"},"hideActionIcon":true,"iconName":"standard-default","isTrackingDisabled":false,"label":"Update Plans","record":"{record}","showSpinner":"false","stateObj":"{record}","styles":{"label":{"color":"","fontSize":"18px","textAlign":"right"}}},"size":{"default":2,"isResponsive":false},"stateIndex":0,"styleObject":{"background":{"color":"","image":"","position":"","repeat":"","size":""},"border":{"color":"","radius":"","style":"","type":"","width":""},"class":"vloc-action-button slds-p-top_small slds-p-right_small ","container":{"class":"vloc-action-button"},"elementStyleProperties":{"styles":{"label":{"color":"","fontSize":"18px","textAlign":"right"}}},"inlineStyle":" cursor:pointer;","margin":[],"padding":[{"label":"top:small","size":"small","type":"top"},{"label":"right:small","size":"small","type":"right"}],"size":{"default":2,"isResponsive":false},"sizeClass":"slds-size_2-of-12 ","style":"     : #ccc 1px solid; \n          cursor:pointer;","text":{"align":"","color":""}},"type":"element"},{"class":"slds-col ","element":"action","elementLabel":"Block-0-Action-1-clone-0","key":"element_element_block_0_0_action_2_0","name":"Action","parentElementKey":"element_block_0_0","property":{"actionList":[{"actionIndex":0,"buttonVariant":"neutral","card":"{card}","data-conditions":{"group":[{"field":"isOpenEnrollment","id":"state-new-condition-0","operator":"==","type":"custom","value":"true"},{"group":[{"field":"User.userProfileName","id":"state-new-condition-3","operator":"==","type":"custom","value":"Broker"},{"field":"User.userProfileName","id":"state-new-condition-7","logicalOperator":"||","operator":"==","type":"custom","value":"Benefit Admin"},{"field":"User.userProfileName","id":"state-new-condition-19","logicalOperator":"||","operator":"==","type":"custom","value":"Benefit Admin Manager"}],"id":"state-new-group-4","logicalOperator":"&&"}],"id":"state-condition-object","isParent":true},"displayAsButton":true,"draggable":true,"hideActionIcon":true,"isOpen":true,"key":"1664400806911-hy8fp5j7k","label":"Action","record":"{record}","stateAction":{"channelName":"close_modal","displayName":"Update Plans","flyoutLwc":"q-e-os-enrollment-flow-english","flyoutParams":{"AssetStatusOE":"true","ContextId":"{recordId}","OpenEnrollment":"true","RenewPlan":"true"},"flyoutType":"OmniScripts","hasExtraParams":true,"id":"flex-action-1664400813705","layoutType":"lightning","openFlyoutIn":"Modal","openUrlIn":"Current Window","osName":"QE/OsEnrollmentFlow/English","type":"Flyout","vlocityIcon":"standard-default"},"stateObj":"{record}","styles":{"label":{"color":"","fontSize":"18px","textAlign":"right"}}}],"buttonVariant":"neutral","card":"{card}","data-conditions":{"group":[{"field":"isOpenEnrollment","id":"state-new-condition-0","operator":"==","type":"custom","value":"true"},{"group":[{"field":"User.userProfileName","id":"state-new-condition-3","operator":"==","type":"custom","value":"Broker"},{"field":"User.userProfileName","id":"state-new-condition-7","logicalOperator":"||","operator":"==","type":"custom","value":"Benefit Admin"},{"field":"User.userProfileName","id":"state-new-condition-19","logicalOperator":"||","operator":"==","type":"custom","value":"Benefit Admin Manager"}],"id":"state-new-group-4","logicalOperator":"&&"}],"id":"state-condition-object","isParent":true},"displayAsButton":true,"flyoutChannel":"close_modal","flyoutDetails":{"openFlyoutIn":"Modal"},"hideActionIcon":true,"iconName":"standard-default","label":"Update Plans","record":"{record}","showSpinner":"false","stateObj":"{record}","styles":{"label":{"color":"","fontSize":"18px","textAlign":"right"}}},"size":{"default":2,"isResponsive":false},"stateIndex":0,"styleObject":{"background":{"color":"","image":"","position":"","repeat":"","size":""},"border":{"color":"","radius":"","style":"","type":"","width":""},"class":"vloc-action-button slds-p-top_small slds-p-right_small ","container":{"class":"vloc-action-button"},"elementStyleProperties":{"styles":{"label":{"color":"","fontSize":"18px","textAlign":"right"}}},"inlineStyle":" cursor:pointer;","margin":[],"padding":[{"label":"top:small","size":"small","type":"top"},{"label":"right:small","size":"small","type":"right"}],"size":{"default":2,"isResponsive":false},"sizeClass":"slds-size_2-of-12 ","style":"     : #ccc 1px solid; \n          cursor:pointer;","text":{"align":"","color":""}},"type":"element"}],"class":"slds-col ","element":"block","elementLabel":"Block-0","name":"Block","property":{"card":"{card}","collapsedByDefault":false,"collapsible":false,"data-conditions":{"group":[],"id":"state-condition-object","isParent":true},"label":"Block","record":"{record}"},"size":{"default":12,"isResponsive":false},"stateIndex":0,"styleObject":{"background":{"color":"","image":"","position":"","repeat":"","size":""},"border":{"color":"","radius":"","style":"","type":"","width":""},"class":"","container":{"class":""},"elementStyleProperties":{},"inlineStyle":"","margin":[],"padding":[],"size":{"default":12,"isResponsive":false},"sizeClass":"slds-size_12-of-12 ","style":"     : #ccc 1px solid; \n         ","text":{"align":"","color":""}},"type":"block"},{"class":"slds-col ","element":"customLwc","elementLabel":"Custom LWC-2","name":"Custom LWC","property":{"actions":"[   {     \"type\": \"ProductDetail\",     \"field\": \"ProductId\",     \"label\": \"View Plan\"   },   {     \"type\": \"ViewDependents\",     \"field\": \"\",     \"label\": \"View Dependents\"   } ]","columns":"[     {         \"visible\": true,         \"label\": \"Plan Name\",         \"fieldName\": \"PlanName\",         \"sortable\": true,         \"searchable\": true,         \"sortingEnabled\": true     },     {         \"visible\": true,         \"label\": \"Plan Type\",         \"fieldName\": \"PlanType\",         \"sortable\": true,         \"searchable\": true,         \"sortingEnabled\": true     },   {         \"visible\": true,         \"label\": \"Coverage\",         \"fieldName\": \"Coverage\",         \"sortable\": true,         \"searchable\": true,         \"sortingEnabled\": true     },     {         \"visible\": true,         \"label\": \"Start Date\",         \"fieldName\": \"EffectiveDate\",         \"sortable\": true,         \"searchable\": true,         \"sortingEnabled\": true     },     {         \"visible\": true,         \"label\": \"End Date\",         \"fieldName\": \"EndDate\",         \"sortable\": true,         \"searchable\": true,         \"sortingEnabled\": true     },     {         \"visible\": true,         \"label\": \"Your Cost\",         \"fieldName\": \"StandardPremium\",         \"sortable\": true,         \"searchable\": true,         \"sortingEnabled\": true     },   {         \"visible\": true,         \"label\": \"Employer Cost\",         \"fieldName\": \"EmployerContribution\",         \"sortable\": true,         \"searchable\": true,         \"sortingEnabled\": true     },   {         \"visible\": true,         \"label\": \"HSA\",         \"fieldName\": \"HSAElected\",         \"sortable\": true,         \"searchable\": true,         \"sortingEnabled\": true     },   {         \"visible\": true,         \"label\": \"Contributions\",         \"fieldName\": \"HSAAmount\",         \"sortable\": true,         \"searchable\": true,         \"sortingEnabled\": true     },         {         \"visible\": false,         \"label\": \"Who is Covered?\",         \"fieldName\": \"Dependents\",         \"sortable\": true,         \"searchable\": true,         \"sortingEnabled\": true     } ]","customlwcname":"qE_LWCOptimaDataTable","displayactions":"true","pagesize":"10","records":"{records}","recordsnode":"records[0].Plan"},"size":{"default":"12","isResponsive":false},"stateIndex":0,"styleObject":{"sizeClass":"slds-size_12-of-12"},"type":"element"}]}},"conditions":{"group":[{"field":"showPlans","id":"state-new-condition-13","operator":"==","type":"custom","value":"true"}],"id":"state-condition-object","isParent":true},"definedActions":{"actions":[]},"documents":[],"fields":[],"isSmartAction":false,"name":"Active","omniscripts":[],"smartAction":{},"styleObject":{"class":"slds-card slds-p-around_x-small slds-m-bottom_x-small","container":{"class":"slds-card"},"margin":[{"size":"none","type":"around"}],"padding":[{"size":"x-small","type":"around"}],"size":{"default":"12","isResponsive":false},"sizeClass":"slds-size_12-of-12"}}],"theme":"slds","title":"QE_FcMembersPendingPlansChild","Id":"a7v5Y000000HvSrQAK","vlocity_ins__GlobalKey__c":"QE_FcMembersPendingPlansChild/HCG/19/1664399876762","vlocity_ins__IsChildCard__c":true};
  export default definition