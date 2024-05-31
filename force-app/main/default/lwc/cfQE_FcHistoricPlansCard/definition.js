let definition =
      {"dataSource":{"contextVariables":[{"id":2,"name":"User.userContactId","val":"0030100000H1SlIAAV"},{"id":3,"name":"FromFC","val":"true"},{"id":7,"name":"User.userProfileName","val":"Benefit Admin"},{"id":9,"name":"recordId","val":"0030100000H1SlIAAV"}],"orderBy":{"isReverse":false,"name":""},"type":"IntegrationProcedures","value":{"inputMap":{"ContactId":"{User.userContactId}","FromFC":"true","ProfileName":"{User.userProfileName}","recordId":"{recordId}"},"ipMethod":"QE_IpGetHistoricPlans","resultVar":"[\"Plan\"]","vlocityAsync":false}},"enableLwc":true,"isFlex":true,"isRepeatable":true,"lwc":{"DeveloperName":"cfQE_FcHistoricPlansCard_4_HCG","Id":"0Rb01000000H8lJCAS","ManageableState":"unmanaged","MasterLabel":"cfQE_FcHistoricPlansCard_4_HCG","NamespacePrefix":"c"},"states":[{"actions":[],"childCards":[],"components":{"layer-0":{"children":[{"children":[{"class":"slds-col ","element":"outputField","elementLabel":"Text-1-clone-0","key":"element_element_block_0_0_outputField_0_0","name":"Text","parentElementKey":"element_block_0_0","property":{"card":"{card}","mergeField":"%3Cdiv%3E%3Cspan%20class=%22slds-text-heading_large%22%20style=%22color:%20#000000;%20font-size:%2024pt;%22%3EPlan%20History%3C/span%3E%3C/div%3E","record":"{record}"},"size":{"default":"12","isResponsive":false},"stateIndex":0,"styleObject":{"background":{"color":"","image":"","position":"","repeat":"","size":""},"border":{"color":"","radius":"","style":"","type":"","width":""},"class":"","container":{"class":""},"elementStyleProperties":{},"inlineStyle":"","margin":[],"padding":[],"size":{"default":"12","isResponsive":false},"sizeClass":"slds-size_12-of-12 ","style":"     : #ccc 1px solid; \n         ","text":{"align":"","color":""}},"type":"text"},{"class":"slds-col ","element":"customLwc","elementLabel":"Custom LWC-1","key":"element_element_block_0_0_customLwc_1_0","name":"Custom LWC","parentElementKey":"element_block_0_0","property":{"actions":"[   {     \"type\": \"ProductDetail\",     \"field\": \"ProductId\",     \"label\": \"View Plan\"   },   {     \"type\": \"ViewDependents\",     \"field\": \"Id\",     \"label\": \"View Dependents\"   } ]","columns":"[{\"visible\":true,\"label\":\"Plan Name\",\"fieldName\":\"PlanName\",\"sortable\":true,\"searchable\":true,\"sortingEnabled\":true},{\"visible\":true,\"label\":\"Plan Type\",\"fieldName\":\"PlanType\",\"sortable\":true,\"searchable\":true,\"sortingEnabled\":true},{\"visible\":true,\"label\":\"Start Date\",\"fieldName\":\"EffectiveDate\",\"sortable\":true,\"searchable\":true,\"sortingEnabled\":true},{\"visible\":true,\"label\":\"End Date\",\"fieldName\":\"EndDate\",\"sortable\":true,\"searchable\":true,\"sortingEnabled\":true},{\"visible\":true,\"label\":\"Your Cost\",\"fieldName\":\"StandardPremium\",\"sortable\":true,\"searchable\":true,\"sortingEnabled\":true}]","customlwcname":"qE_LWCOptimaDataTable","displayactions":"true","pagesize":"10","records":"{records}","recordsnode":"records[0].Plan"},"size":{"default":"12","isResponsive":false},"stateIndex":0,"styleObject":{"sizeClass":"slds-size_12-of-12"},"type":"element"}],"class":"slds-col ","element":"block","elementLabel":"Block-0","name":"Block","property":{"card":"{card}","collapsedByDefault":false,"collapsible":false,"data-conditions":{"group":[],"id":"state-condition-object","isParent":true},"label":"Block","record":"{record}"},"size":{"default":12,"isResponsive":false},"stateIndex":0,"styleObject":{"background":{"color":"","image":"","position":"","repeat":"","size":""},"border":{"color":"","radius":"","style":"","type":"","width":""},"class":"custom-class ","container":{"class":"custom-class"},"elementStyleProperties":{},"inlineStyle":"","margin":[],"padding":[],"size":{"default":12,"isResponsive":false},"sizeClass":"slds-size_12-of-12 ","style":"     : #ccc 1px solid; \n         ","text":{"align":"","color":""}},"type":"block"}]}},"conditions":{"group":[],"id":"state-condition-object","isParent":true},"definedActions":{"actions":[]},"documents":[],"fields":[],"isSmartAction":false,"name":"Active","omniscripts":[],"smartAction":{},"styleObject":{"class":"slds-card slds-p-around_x-small slds-m-bottom_x-small","container":{"class":"slds-card"},"margin":[{"size":"none","type":"around"}],"padding":[{"size":"x-small","type":"around"}],"size":{"default":"12","isResponsive":false},"sizeClass":"slds-size_12-of-12"}}],"theme":"slds","title":"QE_FcHistoricPlansCard","xmlObject":{"apiVersion":51,"isExplicitImport":false,"masterLabel":"QE_FcHistoricPlansCard","runtimeNamespace":"vlocity_ins","targetConfigs":"PHRhcmdldENvbmZpZyB0YXJnZXRzPSJsaWdodG5pbmdDb21tdW5pdHlfX0RlZmF1bHQiPg0KICAgICAgPHByb3BlcnR5IG5hbWU9InJlY29yZElkIiB0eXBlPSJTdHJpbmciLz4NCiAgICA8L3RhcmdldENvbmZpZz4=","targets":{"target":["lightningCommunity__Page","lightningCommunity__Default","lightning__RecordPage","lightning__HomePage","lightning__AppPage"]}},"Id":"a7v5Y000000HvE3QAK","vlocity_ins__GlobalKey__c":"QE_FcHistoricPlansCard/HCG/4/1632142921238","vlocity_ins__IsChildCard__c":false};
  export default definition