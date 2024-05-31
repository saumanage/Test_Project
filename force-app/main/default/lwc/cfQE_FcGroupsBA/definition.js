let definition =
      {"dataSource":{"contextVariables":[{"id":15,"name":"User.userProfileName","val":"Benefit Admin"}],"orderBy":{"isReverse":false,"name":""},"type":"IntegrationProcedures","value":{"inputMap":{"userProfile":"{User.userProfileName}"},"ipMethod":"QE_IpShowGroupsAndLocations","resultVar":"","vlocityAsync":false}},"enableLwc":true,"isFlex":true,"isRepeatable":false,"lwc":{"DeveloperName":"cfQE_FcGroupsBA_7_Optima_Health_Org","Id":"0Rb01000000H5sWCAS","ManageableState":"unmanaged","MasterLabel":"cfQE_FcGroupsBA_7_Optima_Health_Org","NamespacePrefix":"c"},"states":[{"actions":[],"blankCardState":false,"childCards":[],"components":{"layer-0":{"children":[{"children":[{"class":"slds-col ","element":"outputField","elementLabel":"Block-4-Text-0","key":"element_element_block_0_0_outputField_0_0","name":"Text","parentElementKey":"element_block_0_0","property":{"card":"{card}","mergeField":"%3Cdiv%20class=%22slds-text-heading_large%22%3E%3Cspan%20style=%22color:%20#000000;%22%3E%3Cstrong%20class=%22slds-text-heading_large%22%3EGroup%3C/strong%3E%3C/span%3E%3C/div%3E","record":"{record}"},"size":{"default":"10","isResponsive":false},"stateIndex":0,"styleObject":{"size":{"default":"10","isResponsive":false},"sizeClass":"slds-size_10-of-12 "},"type":"text"},{"class":"slds-col ","element":"customLwc","elementLabel":"Block-4-Custom LWC-1","key":"element_element_block_0_0_customLwc_1_0","name":"Custom LWC","parentElementKey":"element_block_0_0","property":{"actions":"[   {     \"type\": \"redirect\",     \"url\": \"/benefit/s/group-detail?recordId=\",     \"fieldUrl\": \"Id\",     \"label\": \"View Group/Subgroup\"   } ]","columns":"[   {     \"visible\": true,     \"label\": \"ACCOUNT NAME\",     \"fieldName\": \"Name\",     \"sortable\": true,     \"searchable\": true,     \"sortingEnabled\": true,     \"id\": \"key-11627579278550\",     \"editable\": false,     \"type\": \"text\",     \"showUserSelectableColumn\": false   }, {     \"visible\": true,     \"label\": \"SubGroup Name\",     \"fieldName\": \"SubGroupName\",     \"sortable\": true,     \"searchable\": true,     \"sortingEnabled\": true,     \"id\": \"key-11627579278551\",     \"editable\": false,     \"type\": \"text\",     \"showUserSelectableColumn\": false   },   {     \"visible\": true,     \"label\": \"TYPE\",     \"fieldName\": \"GroupType\",     \"sortable\": true,     \"searchable\": true,     \"sortingEnabled\": true,     \"id\": \"key-31627579278550\",     \"editable\": false,     \"type\": \"text\",     \"showUserSelectableColumn\": false   },   {     \"visible\": true,     \"label\": \"CONTRACT START DATE\",     \"fieldName\": \"EffectiveDate\",     \"sortable\": true,     \"searchable\": true,     \"sortingEnabled\": true,     \"id\": \"key-41627579278550\",     \"editable\": false,     \"type\": \"text\",     \"showUserSelectableColumn\": false   },   {     \"visible\": true,     \"label\": \"CONTRACT END DATE\",     \"fieldName\": \"TerminationDate\",     \"sortable\": true,     \"searchable\": true,     \"sortingEnabled\": true,     \"id\": \"key-51627579278550\",     \"editable\": false,     \"type\": \"text\",     \"showUserSelectableColumn\": false   } ]","customlwcname":"qE_LWCOptimaDataTable","displayactions":"true","pagesize":"10","records":"{records}"},"size":{"default":"12","isResponsive":false},"stateIndex":0,"styleObject":{"sizeClass":"slds-size_12-of-12"},"type":"element"}],"class":"slds-col ","element":"block","elementLabel":"Block-3","name":"Block","property":{"card":"{card}","collapsedByDefault":false,"collapsible":false,"label":"Block","record":"{record}"},"size":{"default":"12","isResponsive":false},"stateIndex":0,"styleObject":{"background":{"color":"","image":"","position":"","repeat":"","size":""},"border":{"color":"","radius":"","style":"","type":"","width":""},"class":"slds-card ","container":{"class":"slds-card"},"elementStyleProperties":{},"inlineStyle":"","margin":[],"padding":[],"size":{"default":"12","isResponsive":false},"sizeClass":"slds-size_12-of-12 ","style":"     : #ccc 1px solid; \n         ","text":{"align":"","color":""}},"type":"block"}]}},"conditions":{"group":[],"id":"state-condition-object","isParent":true},"definedActions":{"actions":[]},"documents":[],"fields":[],"isSmartAction":false,"name":"MemberDetails","omniscripts":[],"smartAction":{},"styleObject":{"background":{"color":"","image":"","position":"","repeat":"","size":""},"border":{"color":"","radius":"","style":"","type":"","width":""},"class":"slds-m-bottom_x-small ","container":{"class":""},"elementStyleProperties":{},"inlineStyle":"","margin":[{"label":"bottom:x-small","size":"x-small","type":"bottom"}],"padding":[],"size":{"default":"12","isResponsive":false},"sizeClass":"slds-size_12-of-12 ","style":"     : #ccc 1px solid; \n         ","text":{"align":"","color":""}}}],"theme":"slds","title":"QE_FcGroupsBA","xmlObject":{"apiVersion":48,"isExplicitImport":false,"masterLabel":"QE_FcGroupsBA","runtimeNamespace":"vlocity_ins","targetConfigs":"PHRhcmdldENvbmZpZyB0YXJnZXRzPSJsaWdodG5pbmdfX0FwcFBhZ2UiPg0KICAgICAgPHByb3BlcnR5IG5hbWU9ImRlYnVnIiB0eXBlPSJCb29sZWFuIi8+DQogICAgICA8cHJvcGVydHkgbmFtZT0icmVjb3JkSWQiIHR5cGU9IlN0cmluZyIvPg0KICAgIDwvdGFyZ2V0Q29uZmlnPg0KICAgIDx0YXJnZXRDb25maWcgdGFyZ2V0cz0ibGlnaHRuaW5nX19SZWNvcmRQYWdlIj4NCiAgICAgIDxwcm9wZXJ0eSBuYW1lPSJkZWJ1ZyIgdHlwZT0iQm9vbGVhbiIvPg0KICAgIDwvdGFyZ2V0Q29uZmlnPg0KICAgIDx0YXJnZXRDb25maWcgeG1sbnM9IiIgdGFyZ2V0cz0ibGlnaHRuaW5nQ29tbXVuaXR5X19EZWZhdWx0Ij4NCiAgICAgIDxwcm9wZXJ0eSBuYW1lPSJyZWNvcmRJZCIgdHlwZT0iU3RyaW5nIi8+DQogICAgPC90YXJnZXRDb25maWc+","targets":{"target":["lightning__RecordPage","lightning__AppPage","lightning__HomePage","lightningCommunity__Page","lightningCommunity__Default"]}},"Id":"a7v53000000CaY6AAK","vlocity_ins__GlobalKey__c":"QE_FcGroupsBA/Optima_Health_Org/8/1629219703122","vlocity_ins__IsChildCard__c":false};
  export default definition