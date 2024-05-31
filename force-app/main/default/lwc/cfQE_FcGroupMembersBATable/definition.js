let definition =
      {"dataSource":{"contextVariables":[{"id":10,"name":"recordId","val":"0015C00000goxhfQAA"},{"id":19,"name":"InitialLoad","val":"true"}],"orderBy":{"isReverse":false,"name":""},"type":"IntegrationProcedures","value":{"inputMap":{"GroupId":"{recordId}","InitialLoad":"true"},"ipMethod":"QE_IpGetMembersForBA","resultVar":"","vlocityAsync":false}},"enableLwc":true,"events":[{"actionData":{"card":"{card}","stateAction":{"eventName":"reload","id":"flex-action-1627656688481","type":"cardAction"}},"channelname":"QE_FcMemberGroupDetails","displayLabel":"QE_FcMemberGroupDetails:data","element":"action","eventLabel":"pubsub","eventname":"data","eventtype":"pubsub","key":"event-0","recordIndex":"0"}],"isFlex":true,"isRepeatable":false,"lwc":{"DeveloperName":"cfQE_FcGroupMembersBATable_21_Optima_Health_Org","Id":"0Rb530000008eJXCAY","ManageableState":"unmanaged","MasterLabel":"cfQE_FcGroupMembersBATable_21_Optima_Health_Org","NamespacePrefix":"c"},"states":[{"actions":[],"childCards":[],"components":{"layer-0":{"children":[{"children":[{"class":"slds-col ","element":"outputField","elementLabel":"Block-1-Text-0","key":"element_element_block_0_0_outputField_0_0","name":"Text","parentElementKey":"element_block_0_0","property":{"card":"{card}","mergeField":"%3Cdiv%3E%3Cspan%20style=%22font-size:%2018pt;%22%3EMembers%3C/span%3E%3C/div%3E","record":"{record}"},"size":{"default":"10","isResponsive":false},"stateIndex":0,"styleObject":{"background":{"color":"","image":"","position":"","repeat":"","size":""},"border":{"color":"","radius":"","style":"","type":"","width":""},"class":"slds-p-top_x-small ","container":{"class":""},"elementStyleProperties":{},"inlineStyle":"","margin":[],"padding":[{"label":"top:x-small","size":"x-small","type":"top"}],"size":{"default":"10","isResponsive":false},"sizeClass":"slds-size_10-of-12 ","style":"     : #ccc 1px solid; \n         ","text":{"align":"","color":""}},"type":"text"},{"class":"slds-col ","element":"action","elementLabel":"Add Member Action","key":"element_element_block_0_0_action_1_0","name":"Action","parentElementKey":"element_block_0_0","property":{"buttonVariant":"neutral","card":"{card}","displayAsButton":true,"hideActionIcon":true,"reRenderFlyout":true,"record":"{record}","stateAction":{"displayName":"Add Subscriber","flyoutLwc":"q-e-add-subscriber-carrier-english","flyoutParams":{"ContextId":"{recordId}"},"flyoutType":"OmniScripts","hasExtraParams":true,"id":"flex-action-1622717099673","layoutType":"lightning","openFlyoutIn":"Modal","openUrlIn":"Current Window","osName":"QE/AddSubscriberCarrier/English","type":"Flyout","vlocityIcon":"standard-default"},"stateObj":"{record}","styles":{"label":{"color":"","fontSize":"20px","textAlign":"right"}}},"size":{"default":"2","isResponsive":false},"stateIndex":0,"styleObject":{"background":{"color":"","image":"","position":"","repeat":"","size":""},"border":{"color":"","radius":"","style":"","type":"","width":""},"class":"slds-text-align_left vloc-action-button slds-p-top_small slds-p-right_small ","container":{"class":"vloc-action-button"},"customClass":"","elementStyleProperties":{"styles":{"label":{"color":"","fontSize":"20px","textAlign":"right"}}},"inlineStyle":"","margin":[],"padding":[{"label":"top:small","size":"small","type":"top"},{"label":"right:small","size":"small","type":"right"}],"size":{"default":"2","isResponsive":false},"sizeClass":"slds-size_2-of-12 ","style":"     : #ccc 1px solid; \n         ","text":{"align":"left","color":""}},"type":"element","userUpdatedElementLabel":true},{"children":[{"class":"slds-col ","element":"customLwc","elementLabel":"Block-1-Custom LWC-2","key":"element_element_element_block_0_0_block_2_0_customLwc_0_0","name":"Custom LWC","parentElementKey":"element_element_block_0_0_block_2_0","property":{"actions":"[   {     \"type\": \"redirect\",     \"url\": \"/benefit/s/member-detail?recordId=\",     \"fieldUrl\": \"Id\",     \"label\": \"Member Details\"   },   {     \"type\": \"omniscript\",     \"omniType\": \"editSubscriber\",     \"fieldOmni\": \"Id\",     \"label\": \"Edit Member Details\"   },   {     \"type\": \"omniscript\",     \"omniType\": \"editSubGroup\",     \"fieldOmni\": \"Id\",     \"label\": \"Edit Group/Subgroup\"   } ]","displayactions":"true","isBA":"true","issearchavailable":"true","pagesize":"10","records":"{records}","recordMore":"{\"chkProfile\":\"Benefit Admin\",\"userProfile\":\"{User.userProfileName}\",\"type\":\"ApexRemote\",\"LookupField\":\"Id\",\"ChkFieldName\":\"CheckName\",\"ChkOutputField\":\"Name\",\"chkSearch\":true,\"chkSearchKey\":\"Name\",\"chkSearchProp\":\"SearchName\",\"CurrentStatus\":\"Active\",\"approach\":\"step\",\"startIndex\":\"0\",\"StatusList\":[\"Active\",\"Inactive\",\"Pending\"],\"IntegrationProcedures\":{\"type\":\"IntegrationProcedures\",\"value\":{\"inputMap\":{\"GroupId\":\"{recordId}\",\"InitialLoad\":true,\"CheckName\":\"!\",\"Limit\":30,\"SearchName\":\"\",\"Status\":\"Active\"},\"optionsMap\":{},\"ipMethod\":\"QE_IpGetMembersForBA\"}},\"ApexRemote\":{\"type\":\"ApexRemote\",\"value\":{\"className\":\"QE_FcGroupMembersBATableService\",\"methodName\":\"getRecords\",\"inputMap\":{\"GroupId\":\"{recordId}\",\"CheckName\":\"!\",\"Limit\":800,\"SearchName\":\"\",\"Status\":\"Active\"},\"optionsMap\":{}}}}","columns":"[{\"visible\":true,\"label\":\"Member Name\",\"fieldName\":\"Name\",\"sortable\":true,\"searchable\":true,\"sortingEnabled\":true},{\"visible\":true,\"label\":\"DOB\",\"fieldName\":\"Birthdate\",\"sortable\":true,\"searchable\":false,\"sortingEnabled\":true},{\"visible\":true,\"label\":\"Status\",\"fieldName\":\"Status\",\"sortable\":true,\"searchable\":false,\"sortingEnabled\":true}]","customlwcname":"qE_LWCOptimaDataTable"},"size":{"default":"12","isResponsive":false},"stateIndex":0,"styleObject":{"background":{"color":"","image":"","position":"","repeat":"","size":""},"border":{"color":"","radius":"","style":"","type":"","width":""},"class":"","container":{"class":""},"elementStyleProperties":{},"inlineStyle":"","margin":[],"padding":[],"size":{"default":"12","isResponsive":false},"sizeClass":"slds-size_12-of-12 ","style":"     : #ccc 1px solid; \n         ","text":{"align":"","color":""}},"type":"element"}],"class":"slds-col ","element":"block","elementLabel":"Block-1-Block-3","key":"element_element_block_0_0_block_2_0","name":"Block","parentElementKey":"element_block_0_0","property":{"card":"{card}","collapsedByDefault":false,"collapsible":false,"data-conditions":{"group":[{"field":"User.userProfileName","id":"state-new-condition-13","operator":"==","type":"custom","value":"Benefit Admin"},{"field":"User.userProfileName","id":"state-new-condition-18","logicalOperator":"||","operator":"==","type":"custom","value":"Benefit Admin Manager"}],"id":"state-condition-object","isParent":true},"label":"Block","record":"{record}"},"size":{"default":"12","isResponsive":false},"stateIndex":0,"styleObject":{"background":{"color":"","image":"","position":"","repeat":"","size":""},"border":{"color":"","radius":"","style":"","type":"","width":""},"class":"","container":{"class":""},"elementStyleProperties":{},"inlineStyle":"","margin":[],"padding":[],"size":{"default":"12","isResponsive":false},"sizeClass":"slds-size_12-of-12 ","style":"     : #ccc 1px solid; \n         ","text":{"align":"","color":""}},"type":"block"},{"children":[{"class":"slds-col ","element":"customLwc","elementLabel":"Block-1-Custom LWC-2","key":"element_element_element_block_0_0_block_3_0_customLwc_0_0","name":"Custom LWC","parentElementKey":"element_element_block_0_0_block_3_0","property":{"actions":"[   {     \"type\": \"redirect\",     \"url\": \"/broker/s/member-detail?recordId=\",     \"fieldUrl\": \"Id\",     \"label\": \"Member Details\"   },   {     \"type\": \"omniscript\",     \"omniType\": \"editSubscriber\",     \"fieldOmni\": \"Id\",     \"label\": \"Edit Member Details\"   },   {     \"type\": \"omniscript\",     \"omniType\": \"editSubGroup\",     \"fieldOmni\": \"Id\",     \"label\": \"Edit Group/Subgroup\"   } ]","displayactions":"true","isBA":"true","issearchavailable":"true","pagesize":"10","records":"{records}","recordMore":"{\"chkProfile\":\"Broker\",\"userProfile\":\"{User.userProfileName}\",\"type\":\"ApexRemote\",\"LookupField\":\"Id\",\"ChkFieldName\":\"CheckName\",\"ChkOutputField\":\"Name\",\"chkSearch\":true,\"chkSearchKey\":\"Name\",\"chkSearchProp\":\"SearchName\",\"CurrentStatus\":\"Active\",\"approach\":\"step\",\"startIndex\":\"0\",\"StatusList\":[\"Active\",\"Inactive\",\"Pending\"],\"IntegrationProcedures\":{\"type\":\"IntegrationProcedures\",\"value\":{\"inputMap\":{\"GroupId\":\"{recordId}\",\"InitialLoad\":true,\"CheckName\":\"!\",\"Limit\":30,\"SearchName\":\"\",\"Status\":\"Active\"},\"optionsMap\":{},\"ipMethod\":\"QE_IpGetMembersForBA\"}},\"ApexRemote\":{\"type\":\"ApexRemote\",\"value\":{\"className\":\"QE_FcGroupMembersBATableService\",\"methodName\":\"getRecords\",\"inputMap\":{\"GroupId\":\"{recordId}\",\"CheckName\":\"!\",\"Limit\":800,\"SearchName\":\"\",\"Status\":\"Active\"},\"optionsMap\":{}}}}","columns":"[{\"visible\":true,\"label\":\"Member Name\",\"fieldName\":\"Name\",\"sortable\":true,\"searchable\":true,\"sortingEnabled\":true},{\"visible\":true,\"label\":\"DOB\",\"fieldName\":\"Birthdate\",\"sortable\":true,\"searchable\":false,\"sortingEnabled\":true},{\"visible\":true,\"label\":\"Status\",\"fieldName\":\"Status\",\"sortable\":true,\"searchable\":false,\"sortingEnabled\":true}]","customlwcname":"qE_LWCOptimaDataTable"},"size":{"default":"12","isResponsive":false},"stateIndex":0,"styleObject":{"background":{"color":"","image":"","position":"","repeat":"","size":""},"border":{"color":"","radius":"","style":"","type":"","width":""},"class":"","container":{"class":""},"elementStyleProperties":{},"inlineStyle":"","margin":[],"padding":[],"size":{"default":"12","isResponsive":false},"sizeClass":"slds-size_12-of-12 ","style":"     : #ccc 1px solid; \n         ","text":{"align":"","color":""}},"type":"element"}],"class":"slds-col ","element":"block","elementLabel":"Block-1-Block-2-clone-0","key":"element_element_block_0_0_block_3_0","name":"Block","parentElementKey":"element_block_0_0","property":{"card":"{card}","collapsedByDefault":false,"collapsible":false,"data-conditions":{"group":[{"field":"User.userProfileName","id":"state-new-condition-33","operator":"==","type":"custom","value":"Broker"}],"id":"state-condition-object","isParent":true},"label":"Block","record":"{record}"},"size":{"default":"12","isResponsive":false},"stateIndex":0,"styleObject":{"background":{"color":"","image":"","position":"","repeat":"","size":""},"border":{"color":"#cccccc","radius":"","style":"","type":"","width":"0"},"class":"","container":{"class":""},"elementStyleProperties":{},"inlineStyle":"","margin":[],"padding":[],"size":{"default":"12","isResponsive":false},"sizeClass":"slds-size_12-of-12 ","style":"     : #cccccc 0px solid; \n         ","text":{"align":"","color":""}},"type":"block"}],"class":"slds-col ","element":"block","elementLabel":"Block-1","name":"Block","property":{"card":"{card}","collapsedByDefault":false,"collapsible":false,"data-conditions":{"group":[],"id":"state-condition-object","isParent":true},"label":"Block","record":"{record}"},"size":{"default":"12","isResponsive":false},"stateIndex":0,"styleObject":{"background":{"color":"","image":"","position":"","repeat":"","size":""},"border":{"color":"","radius":"","style":"","type":"","width":""},"class":"slds-card ","container":{"class":"slds-card"},"elementStyleProperties":{},"inlineStyle":"","margin":[],"padding":[],"size":{"default":"12","isResponsive":false},"sizeClass":"slds-size_12-of-12 ","style":"     : #ccc 1px solid; \n         ","text":{"align":"","color":""}},"type":"block"}]}},"conditions":{"group":[],"id":"state-condition-object","isParent":true},"definedActions":{"actions":[]},"documents":[],"fields":[],"isSmartAction":false,"name":"MemberDetails","omniscripts":[{"type":"QE","subtype":"AddSubscriberCarrier","language":"English"}],"smartAction":{},"styleObject":{"background":{"color":"","image":"","position":"","repeat":"","size":""},"border":{"color":"","radius":"","style":"","type":"","width":""},"class":"","container":{"class":""},"elementStyleProperties":{},"inlineStyle":"","margin":[],"padding":[],"size":{"default":"12","isResponsive":false},"sizeClass":"slds-size_12-of-12 ","style":"     : #ccc 1px solid; \n         ","text":{"align":"","color":""}}}],"theme":"slds","title":"QE_FcGroupMembersBATable","xmlObject":{"apiVersion":48,"isExplicitImport":false,"masterLabel":"QE_FcGroupMembersBATable","runtimeNamespace":"vlocity_ins","targetConfigs":"PHRhcmdldENvbmZpZyB0YXJnZXRzPSJsaWdodG5pbmdfX0FwcFBhZ2UiPg0KICAgICAgPHByb3BlcnR5IG5hbWU9ImRlYnVnIiB0eXBlPSJCb29sZWFuIi8+DQogICAgICA8cHJvcGVydHkgbmFtZT0icmVjb3JkSWQiIHR5cGU9IlN0cmluZyIvPg0KICAgIDwvdGFyZ2V0Q29uZmlnPg0KICAgIDx0YXJnZXRDb25maWcgdGFyZ2V0cz0ibGlnaHRuaW5nX19SZWNvcmRQYWdlIj4NCiAgICAgIDxwcm9wZXJ0eSBuYW1lPSJkZWJ1ZyIgdHlwZT0iQm9vbGVhbiIvPg0KICAgIDwvdGFyZ2V0Q29uZmlnPg0KICAgIDx0YXJnZXRDb25maWcgeG1sbnM9IiIgdGFyZ2V0cz0ibGlnaHRuaW5nQ29tbXVuaXR5X19EZWZhdWx0Ij4NCiAgICAgIDxwcm9wZXJ0eSBuYW1lPSJyZWNvcmRJZCIgdHlwZT0iU3RyaW5nIi8+DQogICAgPC90YXJnZXRDb25maWc+","targets":{"target":["lightning__RecordPage","lightning__AppPage","lightning__HomePage","lightningCommunity__Page","lightningCommunity__Default"]}},"Id":"a7v5Y000000HvOFQA0","vlocity_ins__GlobalKey__c":"QE_FcGroupMembersBATable/Optima_Health_Org/21/1646759791362","vlocity_ins__IsChildCard__c":false};
  export default definition