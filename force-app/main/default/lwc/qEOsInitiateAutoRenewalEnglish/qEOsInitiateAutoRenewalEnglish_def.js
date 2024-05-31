export const OMNIDEF = {"userTimeZone":-240,"userProfile":"System Administrator","userName":"vxpaluri@sentara.com.sentarahealth","userId":"0055Y00000HroYTQAZ","userCurrencyCode":"USD","timeStamp":"2023-10-26T21:46:37.322Z","sOmniScriptId":"a5J5Y000000ktJZUAY","sobjPL":{},"RPBundle":"","rMap":{},"response":null,"propSetMap":{"wpm":false,"visualforcePagesAvailableInPreview":{},"trackingCustomData":{},"timeTracking":false,"stylesheet":{"newportRtl":"","newport":"","lightningRtl":"","lightning":""},"stepChartPlacement":"right","ssm":false,"showInputWidth":false,"seedDataJSON":{"Individual":true},"scrollBehavior":"auto","saveURLPatterns":{},"saveObjectId":"%ContextId%","saveNameTemplate":null,"saveForLaterRedirectTemplateUrl":"vlcSaveForLaterAcknowledge.html","saveForLaterRedirectPageName":"sflRedirect","saveExpireInDays":null,"saveContentEncoded":false,"rtpSeed":false,"pubsub":false,"persistentComponent":[{"sendJSONPath":"","sendJSONNode":"","responseJSONPath":"","responseJSONNode":"","render":false,"remoteTimeout":30000,"remoteOptions":{"preTransformBundle":"","postTransformBundle":""},"remoteMethod":"","remoteClass":"","preTransformBundle":"","postTransformBundle":"","modalConfigurationSetting":{"modalSize":"lg","modalHTMLTemplateId":"vlcProductConfig.html","modalController":"ModalProductCtrl"},"label":"","itemsKey":"cartItems","id":"vlcCart"},{"render":false,"remoteTimeout":30000,"remoteOptions":{"preTransformBundle":"","postTransformBundle":""},"remoteMethod":"","remoteClass":"","preTransformBundle":"","postTransformBundle":"","modalConfigurationSetting":{"modalSize":"lg","modalHTMLTemplateId":"","modalController":""},"label":"","itemsKey":"knowledgeItems","id":"vlcKnowledge","dispOutsideOmni":false}],"message":{},"mergeSavedData":false,"lkObjName":null,"knowledgeArticleTypeQueryFieldsMap":{},"hideStepChart":false,"errorMessage":{"custom":[]},"enableKnowledge":false,"elementTypeToHTMLTemplateMapping":{},"disableUnloadWarn":true,"currentLanguage":"en_US","currencyCode":"","consoleTabTitle":null,"consoleTabLabel":"New","consoleTabIcon":"custom:custom18","cancelType":"SObject","cancelSource":"%ContextId%","cancelRedirectTemplateUrl":"vlcCancelled.html","cancelRedirectPageName":"OmniScriptCancelled","bLK":false,"autoSaveOnStepNext":false,"autoFocus":false,"allowSaveForLater":false,"allowCancel":true},"prefillJSON":"{}","lwcId":"6465f036-a9c5-8674-f80f-f0700f282c18","labelMap":{"FailureDetails":"Result:FailureDetails","SuccessDetails":"Result:SuccessDetails","Newrenewalopportunity":"NewOpportunity:Newrenewalopportunity","ExistingRenewalRecordError":"ErrorMessage:ExistingRenewalRecordError","NavigateToContract2":"NavigateToContract2","Result":"Result","Setvalues_ResponseFromQuoteRenwalIP":"Setvalues_ResponseFromQuoteRenwalIP","QE_DrUpdateTypeAndStatus":"QE_DrUpdateTypeAndStatus","QE_RenewalIPCreateQuoteIP":"QE_RenewalIPCreateQuoteIP","processMergeContacts":"processMergeContacts","IpRenewalProcessListMergeIdv":"IpRenewalProcessListMergeIdv","IPcreateRenewalCensusMembers":"IPcreateRenewalCensusMembers","IpRenewalProcessQuoteInfoIdv":"IpRenewalProcessQuoteInfoIdv","NavigateToContract1":"NavigateToContract1","NewOpportunity":"NewOpportunity","NavigateAction1":"NavigateAction1","ErrorMessage":"ErrorMessage","DR_ExtractOpportunityType":"DR_ExtractOpportunityType"},"labelKeyMap":{},"errorMsg":"","error":"OK","dMap":{},"depSOPL":{},"depCusPL":{},"cusPL":{},"children":[{"type":"DataRaptor Extract Action","propSetMap":{"wpm":false,"validationRequired":"Step","ssm":false,"showPersistentComponent":[false,false],"show":null,"responseJSONPath":"","responseJSONNode":"","remoteTimeout":30000,"redirectTemplateUrl":"vlcAcknowledge.html","redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectPageName":"","redirectNextWidth":3,"redirectNextLabel":"Next","pubsub":false,"postMessage":"Done","message":{},"label":"DR_ExtractOpportunityType","inProgressMessage":"In Progress","ignoreCache":false,"failureNextLabel":"Continue","failureGoBackLabel":"Go Back","failureAbortMessage":"Are you sure?","failureAbortLabel":"Abort","errorMessage":{"default":null,"custom":[]},"enableDefaultAbort":false,"enableActionMessage":false,"disOnTplt":false,"dataRaptor Input Parameters":[{"inputParam":"ContextId","element":"ContextId"}],"controlWidth":12,"bundle":"DR_ExtractOpportunity","HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"DR_ExtractOpportunityType","level":0,"indexInParent":0,"bHasAttachment":false,"bEmbed":false,"bDataRaptorExtractAction":true,"JSONPath":"DR_ExtractOpportunityType","lwcId":"lwc0"},{"type":"Step","propSetMap":{"wpm":false,"validationRequired":true,"ssm":false,"showPersistentComponent":[true,false],"show":{"group":{"rules":[{"field":"Oppstatus","data":"Renewal Process Successful","condition":"="}],"operator":"OR"}},"saveMessage":"Are you sure you want to save it for later?","saveLabel":"","remoteTimeout":30000,"remoteOptions":{},"remoteMethod":"","remoteClass":"","pubsub":false,"previousWidth":0,"previousLabel":"","nextWidth":3,"nextLabel":"Close","message":{},"label":"Existing Opportunity","knowledgeOptions":{"typeFilter":"","remoteTimeout":30000,"publishStatus":"Online","language":"English","keyword":"","dataCategoryCriteria":""},"instructionKey":"","instruction":"","errorMessage":{"default":null,"custom":[]},"disOnTplt":false,"conditionType":"Hide if False","completeMessage":"Are you sure you want to complete the script?","completeLabel":"Complete","chartLabel":null,"cancelMessage":"Are you sure?","cancelLabel":"","businessEvent":"","businessCategory":"","allowSaveForLater":true,"HTMLTemplateId":"","uiElements":{"ErrorMessage":""},"aggElements":{}},"offSet":0,"name":"ErrorMessage","level":0,"indexInParent":1,"bHasAttachment":false,"bEmbed":false,"response":null,"inheritShowProp":null,"children":[{"response":null,"level":1,"indexInParent":0,"eleArray":[{"type":"Text Block","rootIndex":1,"response":null,"propSetMap":{"textKey":"","text":"<p style=\"text-align: center;\"></p>\n<p style=\"text-align: center;\"><strong>This Contract has an existing renewal opportunity : </strong><span style=\"text-decoration: underline;\"><span style=\"background-color: #ffffff;\"><strong><a href=\"/lightning/r/Opportunity/%RenewedOppId%/view\" target=\"_blank\" style=\"background-color: #ffffff;\" rel=\"noopener\">%RenewedOppName%</a></strong></span></span></p>","show":null,"sanitize":false,"label":null,"disOnTplt":false,"dataJSON":false,"controlWidth":12,"HTMLTemplateId":""},"name":"ExistingRenewalRecordError","level":1,"JSONPath":"ErrorMessage:ExistingRenewalRecordError","indexInParent":0,"index":0,"children":[],"bHasAttachment":false,"bTextBlock":true,"lwcId":"lwc10-0"}],"bHasAttachment":false}],"bAccordionOpen":false,"bAccordionActive":false,"bStep":true,"isStep":true,"JSONPath":"ErrorMessage","lwcId":"lwc1"},{"type":"Navigate Action","propSetMap":{"wpm":false,"variant":"brand","validationRequired":null,"targetType":"Record","targetName":"","targetLWCLayout":"lightning","targetId":"%ContextId%","targetFilter":"Recent","ssm":false,"show":{"group":{"rules":[{"field":"Oppstatus","data":"Renewal Process Successful","condition":"="}],"operator":"AND"}},"replace":true,"recordAction":"view","pubsub":false,"objectAction":"home","message":{},"loginAction":"login","label":"Done","iconVariant":"","iconPosition":"Center","iconName":"","disOnTplt":false,"controlWidth":2,"HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"NavigateAction1","level":0,"indexInParent":2,"bHasAttachment":false,"bEmbed":false,"bNavigate":true,"JSONPath":"NavigateAction1","lwcId":"lwc2"},{"type":"Step","propSetMap":{"wpm":false,"validationRequired":true,"ssm":false,"showPersistentComponent":[false,false],"show":{"group":{"rules":[{"field":"Oppstatus","data":"Renewal Process Successful","condition":"<>"}],"operator":"OR"}},"saveMessage":"Are you sure you want to save it for later?","saveLabel":"Save for later","remoteTimeout":30000,"remoteOptions":{},"remoteMethod":"","remoteClass":"","pubsub":false,"previousWidth":3,"previousLabel":"Previous","nextWidth":3,"nextLabel":"Next","message":{},"label":"Renewal Process","knowledgeOptions":{"typeFilter":"","remoteTimeout":30000,"publishStatus":"Online","language":"English","keyword":"","dataCategoryCriteria":""},"instructionKey":"","instruction":"","errorMessage":{"default":null,"custom":[]},"disOnTplt":false,"conditionType":"Hide if False","completeMessage":"Are you sure you want to complete the script?","completeLabel":"Complete","chartLabel":null,"cancelMessage":"Are you sure?","cancelLabel":"Cancel","allowSaveForLater":true,"HTMLTemplateId":"","uiElements":{"NewOpportunity":"","Newrenewalopportunity":""},"aggElements":{}},"offSet":0,"name":"NewOpportunity","level":0,"indexInParent":3,"bHasAttachment":false,"bEmbed":false,"response":null,"inheritShowProp":null,"children":[{"response":null,"level":1,"indexInParent":0,"eleArray":[{"type":"Radio","rootIndex":3,"response":null,"propSetMap":{"show":null,"required":true,"repeatLimit":null,"repeatClone":false,"repeat":false,"readOnly":false,"options":[{"value":"Yes","name":"Yes"},{"value":"No","name":"No"}],"optionWidth":100,"optionSource":{"type":"","source":""},"optionHeight":100,"label":"Do you want to create a new renewal opportunity?","imageCountInRow":3,"horizontalMode":false,"hide":false,"helpText":"","help":false,"enableCaption":true,"disOnTplt":false,"defaultValue":null,"controllingField":{"type":"","source":"","element":""},"controlWidth":12,"conditionType":"Hide if False","accessibleInFutureSteps":false,"HTMLTemplateId":""},"name":"Newrenewalopportunity","level":1,"JSONPath":"NewOpportunity:Newrenewalopportunity","indexInParent":0,"index":0,"children":[],"bHasAttachment":false,"bRadio":true,"lwcId":"lwc30-0"}],"bHasAttachment":false}],"bAccordionOpen":false,"bAccordionActive":false,"bStep":true,"isStep":true,"JSONPath":"NewOpportunity","lwcId":"lwc3"},{"type":"Navigate Action","propSetMap":{"wpm":false,"variant":"brand","validationRequired":"none","targetType":"Record","targetLWCLayout":"lightning","targetId":"%ContextId%","targetFilter":"Recent","ssm":false,"show":{"group":{"rules":[{"field":"Newrenewalopportunity","data":"No","condition":"="}],"operator":"AND"}},"replace":true,"recordAction":"view","pubsub":false,"objectAction":"home","message":{},"loginAction":"login","label":"Done","iconVariant":"","iconPosition":"center","iconName":"","disOnTplt":false,"controlWidth":2,"HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"NavigateToContract1","level":0,"indexInParent":4,"bHasAttachment":false,"bEmbed":false,"bNavigate":true,"JSONPath":"NavigateToContract1","lwcId":"lwc4"},{"type":"Integration Procedure Action","propSetMap":{"wpm":false,"validationRequired":"Step","useContinuation":false,"svgSprite":"","svgIcon":"","ssm":false,"showPersistentComponent":[true,false],"show":{"group":{"rules":[{"field":"Contracts:ContractStatus","data":null,"condition":"="}],"operator":"AND"}},"sendJSONPath":"Contracts","sendJSONNode":"Contracts","responseJSONPath":"","responseJSONNode":"","remoteTimeout":30000,"remoteOptions":{"useFuture":false,"queueableChainable":true,"preTransformBundle":"","postTransformBundle":"","chainable":false},"redirectTemplateUrl":"vlcAcknowledge.html","redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectPageName":"","redirectNextWidth":3,"redirectNextLabel":"Next","pubsub":false,"preTransformBundle":"","postTransformBundle":"","postMessage":"Done","message":{},"label":"IpRenewalProcessQuoteInfoIdv","integrationProcedureKey":"QE_IpRenewalProcessQuoteInfoIdv","inProgressMessage":"In Progress","failureNextLabel":"Continue","failureGoBackLabel":"Go Back","failureAbortMessage":"Are you sure?","failureAbortLabel":"Abort","extraPayload":{"IndividualRenewalProcess":true},"errorMessage":{"default":null,"custom":[]},"enableDefaultAbort":false,"enableActionMessage":false,"controlWidth":12,"businessEvent":"","businessCategory":"","HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"IpRenewalProcessQuoteInfoIdv","level":0,"indexInParent":5,"bHasAttachment":false,"bEmbed":false,"bIntegrationProcedureAction":true,"JSONPath":"IpRenewalProcessQuoteInfoIdv","lwcId":"lwc5"},{"type":"Integration Procedure Action","propSetMap":{"wpm":false,"validationRequired":"Step","useContinuation":false,"svgSprite":"","svgIcon":"","ssm":false,"showPersistentComponent":[true,false],"show":{"group":{"rules":[{"field":"Contracts:ContractStatus","data":null,"condition":"="}],"operator":"AND"}},"sendOnlyExtraPayload":false,"sendJSONPath":"DRExt_GetQuoteDetails:Quotes:ContractList","sendJSONNode":"Account","responseJSONPath":"","responseJSONNode":"","remoteTimeout":30000,"remoteOptions":{"useFuture":false,"queueableChainable":true,"preTransformBundle":"","postTransformBundle":"","chainable":false},"redirectTemplateUrl":"vlcAcknowledge.html","redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectPageName":"","redirectNextWidth":3,"redirectNextLabel":"Next","pubsub":false,"preTransformBundle":"","postTransformBundle":"","postMessage":"Done","message":{},"label":"IPcreateRenewalCensusMembers","integrationProcedureKey":"QE_IPcreateRenewalCensusMembers","inProgressMessage":"In Progress","failureNextLabel":"Continue","failureGoBackLabel":"Go Back","failureAbortMessage":"Are you sure?","failureAbortLabel":"Abort","extraPayload":{},"errorMessage":{"default":null,"custom":[]},"enableDefaultAbort":false,"enableActionMessage":false,"controlWidth":12,"businessEvent":"","businessCategory":"","HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"IPcreateRenewalCensusMembers","level":0,"indexInParent":6,"bHasAttachment":false,"bEmbed":false,"bIntegrationProcedureAction":true,"JSONPath":"IPcreateRenewalCensusMembers","lwcId":"lwc6"},{"type":"Integration Procedure Action","propSetMap":{"wpm":false,"validationRequired":"Step","useContinuation":false,"svgSprite":"","svgIcon":"","ssm":false,"showPersistentComponent":[true,false],"show":{"group":{"rules":[{"field":"Contracts:ContractStatus","data":null,"condition":"="}],"operator":"AND"}},"sendOnlyExtraPayload":true,"sendJSONPath":"","sendJSONNode":"","responseJSONPath":"","responseJSONNode":"","remoteTimeout":30000,"remoteOptions":{"useFuture":false,"queueableChainable":true,"preTransformBundle":"","postTransformBundle":"","chainable":false},"redirectTemplateUrl":"vlcAcknowledge.html","redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectPageName":"","redirectNextWidth":3,"redirectNextLabel":"Next","pubsub":false,"preTransformBundle":"","postTransformBundle":"","postMessage":"Done","message":{},"label":"IpRenewalProcessListMergeIdv","integrationProcedureKey":"QE_IpRenewalProcessListMergeIdv","inProgressMessage":"In Progress","failureNextLabel":"Continue","failureGoBackLabel":"Go Back","failureAbortMessage":"Are you sure?","failureAbortLabel":"Abort","extraPayload":{"DRExt_GetQuoteDetails":"%DRExt_GetQuoteDetails%","Contracts":"%Contracts%","CensusData":"%CensusData%","AccountEligibleEmployees":"%AccountEligibleEmployees%"},"errorMessage":{"default":null,"custom":[]},"enableDefaultAbort":false,"enableActionMessage":false,"controlWidth":12,"businessEvent":"","businessCategory":"","HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"IpRenewalProcessListMergeIdv","level":0,"indexInParent":7,"bHasAttachment":false,"bEmbed":false,"bIntegrationProcedureAction":true,"JSONPath":"IpRenewalProcessListMergeIdv","lwcId":"lwc7"},{"type":"Integration Procedure Action","propSetMap":{"wpm":false,"validationRequired":"Step","useContinuation":false,"svgSprite":"","svgIcon":"","ssm":false,"showPersistentComponent":[true,false],"show":{"group":{"rules":[{"field":"Contracts:ContractStatus","data":null,"condition":"="}],"operator":"AND"}},"sendOnlyExtraPayload":true,"sendJSONPath":"","sendJSONNode":"","responseJSONPath":"","responseJSONNode":"","remoteTimeout":30000,"remoteOptions":{"useFuture":false,"queueableChainable":true,"preTransformBundle":"","postTransformBundle":"","chainable":false},"redirectTemplateUrl":"vlcAcknowledge.html","redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectPageName":"","redirectNextWidth":3,"redirectNextLabel":"Next","pubsub":false,"preTransformBundle":"","postTransformBundle":"","postMessage":"Done","message":{},"label":"processMergeContacts","integrationProcedureKey":"QE_IpRenewalProcessExt","inProgressMessage":"In Progress","failureNextLabel":"Continue","failureGoBackLabel":"Go Back","failureAbortMessage":"Are you sure?","failureAbortLabel":"Abort","extraPayload":{"MergedContracts":"%MergedContracts%","IndividualRenewalProcess":true,"DefaultPharmacy":"%DefaultPharmacy%"},"errorMessage":{"default":null,"custom":[]},"enableDefaultAbort":false,"enableActionMessage":false,"controlWidth":12,"businessEvent":"","businessCategory":"","HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"processMergeContacts","level":0,"indexInParent":8,"bHasAttachment":false,"bEmbed":false,"bIntegrationProcedureAction":true,"JSONPath":"processMergeContacts","lwcId":"lwc8"},{"type":"Integration Procedure Action","propSetMap":{"wpm":false,"validationRequired":"Step","useContinuation":false,"svgSprite":"","svgIcon":"","ssm":false,"showPersistentComponent":[true,false],"show":{"group":{"rules":[{"field":"Contracts:ContractStatus","data":"Success","condition":"="}],"operator":"AND"}},"sendJSONPath":"ratingIpInput","sendJSONNode":"VlocityNoRootNode","responseJSONPath":"","responseJSONNode":"","remoteTimeout":30000,"remoteOptions":{"useFuture":false,"queueableChainable":true,"preTransformBundle":"","postTransformBundle":"","chainable":false},"redirectTemplateUrl":"vlcAcknowledge.html","redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectPageName":"","redirectNextWidth":3,"redirectNextLabel":"Next","pubsub":false,"preTransformBundle":"","postTransformBundle":"","postMessage":"Done","message":{},"label":"QE_RenewalIPCreateQuoteIP","integrationProcedureKey":"QE_RenewalIPCreateQuoteIP","inProgressMessage":"In Progress","failureNextLabel":"Continue","failureGoBackLabel":"Go Back","failureAbortMessage":"Are you sure?","failureAbortLabel":"Abort","extraPayload":{},"errorMessage":{"default":null,"custom":[]},"enableDefaultAbort":false,"enableActionMessage":false,"controlWidth":12,"businessEvent":"","businessCategory":"","HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"QE_RenewalIPCreateQuoteIP","level":0,"indexInParent":9,"bHasAttachment":false,"bEmbed":false,"bIntegrationProcedureAction":true,"JSONPath":"QE_RenewalIPCreateQuoteIP","lwcId":"lwc9"},{"type":"DataRaptor Post Action","propSetMap":{"wpm":false,"validationRequired":"Submit","ssm":false,"showPersistentComponent":[true,false],"show":{"group":{"rules":[{"field":"Contracts:ContractStatus","data":"Success","condition":"="}],"operator":"AND"}},"sendJSONPath":"AccountUpdates","sendJSONNode":"VlocityNoRootNode","remoteTimeout":30000,"redirectTemplateUrl":"vlcAcknowledge.html","redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectPageName":"","redirectNextWidth":3,"redirectNextLabel":"Next","pubsub":false,"postTransformBundle":"","postMessage":"Done","message":{},"label":"QE_DrUpdateTypeAndStatus","inProgressMessage":"In Progress","failureNextLabel":"Continue","failureGoBackLabel":"Go Back","failureAbortMessage":"Are you sure?","failureAbortLabel":"Abort","errorMessage":{"default":null,"custom":[]},"enableDefaultAbort":false,"enableActionMessage":false,"controlWidth":12,"businessEvent":"","businessCategory":"","bundle":"QE_DrUpdateTypeAndStatus","HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"QE_DrUpdateTypeAndStatus","level":0,"indexInParent":10,"bHasAttachment":false,"bEmbed":false,"bDataRaptorPostAction":true,"JSONPath":"QE_DrUpdateTypeAndStatus","lwcId":"lwc10"},{"type":"Set Values","propSetMap":{"wpm":false,"ssm":false,"showPersistentComponent":[false,false],"show":null,"pubsub":false,"message":{},"label":"SVId","elementValueMap":{"RenewalProcessError":"=STRING(%Contracts:ErrorMsg%)","NewQuoteName":"=STRING(%Contracts:NewQuoteName%)","NewQuoteID":"=STRING(%Contracts:NewQuoteID%)","NewOpportunityName":"=STRING(%Contracts:NewOpportunityName%)","NewOpportunityID":"=STRING(%Contracts:NewOpportunityID%)"},"disOnTplt":false,"controlWidth":12,"HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"Setvalues_ResponseFromQuoteRenwalIP","level":0,"indexInParent":11,"bHasAttachment":false,"bEmbed":false,"bSetValues":true,"JSONPath":"Setvalues_ResponseFromQuoteRenwalIP","lwcId":"lwc11"},{"type":"Step","propSetMap":{"wpm":false,"validationRequired":true,"ssm":false,"showPersistentComponent":[true,false],"show":null,"saveMessage":"Are you sure you want to save it for later?","saveLabel":"","remoteTimeout":30000,"remoteOptions":{},"remoteMethod":"","remoteClass":"","pubsub":false,"previousWidth":"0","previousLabel":"","nextWidth":3,"nextLabel":"Return to Contract","message":{},"label":"Result","knowledgeOptions":{"typeFilter":"","remoteTimeout":30000,"publishStatus":"Online","language":"English","keyword":"","dataCategoryCriteria":""},"instructionKey":"","instruction":"","errorMessage":{"default":null,"custom":[]},"disOnTplt":false,"conditionType":"Hide if False","completeMessage":"Are you sure you want to complete the script?","completeLabel":"Complete","chartLabel":null,"cancelMessage":"Are you sure?","cancelLabel":"","businessEvent":"","businessCategory":"","allowSaveForLater":true,"HTMLTemplateId":"","uiElements":{"Result":""},"aggElements":{}},"offSet":0,"name":"Result","level":0,"indexInParent":12,"bHasAttachment":false,"bEmbed":false,"response":null,"inheritShowProp":null,"children":[{"response":null,"level":1,"indexInParent":0,"eleArray":[{"type":"Text Block","rootIndex":12,"response":null,"propSetMap":{"textKey":"","text":"<h3 style=\"text-align: center;\"><span style=\"color: #339966;\"><strong>Success</strong></span></h3>\n<p style=\"text-align: center;\"><span style=\"color: #000000;\">New opportunity : <span style=\"text-decoration: underline;\"><span style=\"color: #3366ff;\"><a href=\"/lightning/r/Opportunity/%NewOpportunityID%/view\" target=\"_blank\" style=\"color: #3366ff; text-decoration: underline;\" rel=\"noopener\">%NewOpportunityName%</a></span></span></span></p>\n<p style=\"text-align: center;\"><span style=\"color: #000000;\">New Quote: <span style=\"text-decoration: underline;\"><span style=\"color: #3366ff;\"><a href=\"/lightning/r/Quote/%NewQuoteID%/view\" target=\"_blank\" style=\"color: #3366ff; text-decoration: underline;\" rel=\"noopener\">%NewQuoteName%</a></span></span></span></p>\n<p style=\"text-align: center;\"></p>","show":{"group":{"rules":[{"field":"Contracts:ContractStatus","data":"Success","condition":"="}],"operator":"AND"}},"sanitize":false,"label":"TextBlock1","disOnTplt":false,"dataJSON":false,"controlWidth":12,"HTMLTemplateId":""},"name":"SuccessDetails","level":1,"JSONPath":"Result:SuccessDetails","indexInParent":0,"index":0,"children":[],"bHasAttachment":false,"bTextBlock":true,"lwcId":"lwc120-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":1,"eleArray":[{"type":"Text Block","rootIndex":12,"response":null,"propSetMap":{"textKey":"","text":"<h3 style=\"text-align: center;\"><span style=\"color: #ff0000;\"><strong>Error in Renewal process</strong></span></h3>\n<p style=\"text-align: center;\"><strong>%RenewalProcessError%</strong></p>","show":{"group":{"rules":[{"field":"Contracts:ContractStatus","data":"Success","condition":"<>"}],"operator":"AND"}},"sanitize":false,"label":"TextBlock1","disOnTplt":false,"dataJSON":false,"controlWidth":12,"HTMLTemplateId":""},"name":"FailureDetails","level":1,"JSONPath":"Result:FailureDetails","indexInParent":1,"index":0,"children":[],"bHasAttachment":false,"bTextBlock":true,"lwcId":"lwc121-0"}],"bHasAttachment":false}],"bAccordionOpen":false,"bAccordionActive":false,"bStep":true,"isStep":true,"JSONPath":"Result","lwcId":"lwc12"},{"type":"Navigate Action","propSetMap":{"wpm":false,"variant":"brand","validationRequired":"none","targetType":"Record","targetLWCLayout":"lightning","targetId":"%ContextId%","targetFilter":"Recent","ssm":false,"show":null,"replace":true,"recordAction":"view","pubsub":false,"objectAction":"home","message":{},"loginAction":"login","label":"Done","iconVariant":"","iconPosition":"center","iconName":"","disOnTplt":false,"controlWidth":2,"HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"NavigateToContract2","level":0,"indexInParent":13,"bHasAttachment":false,"bEmbed":false,"bNavigate":true,"JSONPath":"NavigateToContract2","lwcId":"lwc13"}],"bReusable":false,"bpVersion":2,"bpType":"QE","bpSubType":"OsInitiateAutoRenewal","bpLang":"English","bHasAttachment":false,"lwcVarMap":{}};