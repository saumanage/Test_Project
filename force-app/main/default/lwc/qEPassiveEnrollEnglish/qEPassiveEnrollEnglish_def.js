export const OMNIDEF = {"userTimeZone":-240,"userProfile":"System Administrator","userName":"jdavidson@eaglecrk.com.sentarahealth","userId":"0055Y00000HPLDKQA5","userCurrencyCode":"USD","timeStamp":"2022-08-18T22:25:13.705Z","sOmniScriptId":"a5J5Y000000WWEHUA4","sobjPL":{},"RPBundle":"","rMap":{},"response":null,"propSetMap":{"wpm":false,"visualforcePagesAvailableInPreview":{},"trackingCustomData":{},"timeTracking":false,"stylesheet":{"newportRtl":"","newport":"","lightningRtl":"","lightning":""},"stepChartPlacement":"right","ssm":false,"showInputWidth":false,"seedDataJSON":{"Individual":true},"scrollBehavior":"auto","saveURLPatterns":{},"saveObjectId":"%ContextId%","saveNameTemplate":null,"saveForLaterRedirectTemplateUrl":"vlcSaveForLaterAcknowledge.html","saveForLaterRedirectPageName":"sflRedirect","saveExpireInDays":null,"saveContentEncoded":false,"rtpSeed":false,"pubsub":false,"persistentComponent":[{"sendJSONPath":"","sendJSONNode":"","responseJSONPath":"","responseJSONNode":"","render":false,"remoteTimeout":30000,"remoteOptions":{"preTransformBundle":"","postTransformBundle":""},"remoteMethod":"","remoteClass":"","preTransformBundle":"","postTransformBundle":"","modalConfigurationSetting":{"modalSize":"lg","modalHTMLTemplateId":"vlcProductConfig.html","modalController":"ModalProductCtrl"},"label":"","itemsKey":"cartItems","id":"vlcCart"},{"render":false,"remoteTimeout":30000,"remoteOptions":{"preTransformBundle":"","postTransformBundle":""},"remoteMethod":"","remoteClass":"","preTransformBundle":"","postTransformBundle":"","modalConfigurationSetting":{"modalSize":"lg","modalHTMLTemplateId":"","modalController":""},"label":"","itemsKey":"knowledgeItems","id":"vlcKnowledge","dispOutsideOmni":false}],"message":{},"mergeSavedData":false,"lkObjName":null,"knowledgeArticleTypeQueryFieldsMap":{},"hideStepChart":false,"errorMessage":{"custom":[]},"enableKnowledge":false,"elementTypeToHTMLTemplateMapping":{},"disableUnloadWarn":true,"currentLanguage":"en_US","currencyCode":"","consoleTabTitle":null,"consoleTabLabel":"New","consoleTabIcon":"custom:custom18","cancelType":"SObject","cancelSource":"%ContextId%","cancelRedirectTemplateUrl":"vlcCancelled.html","cancelRedirectPageName":"OmniScriptCancelled","bLK":false,"autoSaveOnStepNext":false,"autoFocus":false,"allowSaveForLater":false,"allowCancel":true},"prefillJSON":"{}","lwcId":"b28a7136-0bf6-2c03-8125-6c109ee61370","labelMap":{"TextBlock2":"LGPassiveEnrollStart:TextBlock2","TextBlock3":"Passive Enroll Success:TextBlock3","TextBlock1":"subGroupError:TextBlock1","ExistingRenewalRecordError":"ErrorMessage:ExistingRenewalRecordError","Newpassiveopportunity":"PassiveEnrollCheck:Newpassiveopportunity","NavigateToContract1":"NavigateToContract1","LGPassiveEnrollStart":"LGPassiveEnrollStart","Passive Enroll Success":"Passive Enroll Success","PassiveEnrollIP":"PassiveEnrollIP","CreateTask":"CreateTask","QE_ApplicationRenewalProcess":"QE_ApplicationRenewalProcess","subGroupError":"subGroupError","ErrorMessage":"ErrorMessage","PassiveEnrollCheck":"PassiveEnrollCheck","SVContractLine":"SVContractLine","QE_DRGetContractMarketSegment":"QE_DRGetContractMarketSegment","DR_ContractLineItems":"DR_ContractLineItems","CANCEL":"CANCEL"},"labelKeyMap":{},"errorMsg":"","error":"OK","dMap":{},"depSOPL":{},"depCusPL":{},"cusPL":{},"children":[{"type":"Cancel Action","propSetMap":{"wpm":false,"variant":"brand","validationRequired":"Submit","targetType":"Record","targetLWCLayout":"lightning","targetId":"%ContextId%","targetFilter":"Recent","ssm":false,"showCancelPrompt":true,"show":null,"replace":false,"recordAction":"view","pubsub":false,"objectAction":"home","message":{},"loginAction":"login","label":"Cancel","iconVariant":"","iconPosition":"left","iconName":"","controlWidth":12,"businessEvent":"","businessCategory":"","HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"CANCEL","level":0,"indexInParent":0,"bHasAttachment":false,"bEmbed":false,"bCancel":true,"JSONPath":"CANCEL","lwcId":"lwc0"},{"type":"DataRaptor Extract Action","propSetMap":{"wpm":false,"validationRequired":"Step","ssm":false,"showPersistentComponent":[false,false],"show":null,"responseJSONPath":"","responseJSONNode":"","remoteTimeout":30000,"redirectTemplateUrl":"vlcAcknowledge.html","redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectPageName":"","redirectNextWidth":3,"redirectNextLabel":"Next","pubsub":false,"postMessage":"Done","message":{},"label":"DR_ContractLineItems","inProgressMessage":"In Progress","ignoreCache":false,"failureNextLabel":"Continue","failureGoBackLabel":"Go Back","failureAbortMessage":"Are you sure?","failureAbortLabel":"Abort","errorMessage":{"default":null,"custom":[]},"enableDefaultAbort":false,"enableActionMessage":false,"disOnTplt":false,"dataRaptor Input Parameters":[{"inputParam":"ContractId","element":"ContextId"}],"controlWidth":12,"bundle":"QE_DRGetContractLineItemsNew","HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"DR_ContractLineItems","level":0,"indexInParent":1,"bHasAttachment":false,"bEmbed":false,"bDataRaptorExtractAction":true,"JSONPath":"DR_ContractLineItems","lwcId":"lwc1"},{"type":"DataRaptor Extract Action","propSetMap":{"wpm":false,"validationRequired":"Step","ssm":false,"showPersistentComponent":[false,false],"show":null,"responseJSONPath":"","responseJSONNode":"","remoteTimeout":30000,"redirectTemplateUrl":"vlcAcknowledge.html","redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectPageName":"","redirectNextWidth":3,"redirectNextLabel":"Next","pubsub":false,"postMessage":"Done","message":{},"label":"DR_ContractLineItems","inProgressMessage":"In Progress","ignoreCache":false,"failureNextLabel":"Continue","failureGoBackLabel":"Go Back","failureAbortMessage":"Are you sure?","failureAbortLabel":"Abort","errorMessage":{"default":null,"custom":[]},"enableDefaultAbort":false,"enableActionMessage":false,"disOnTplt":false,"dataRaptor Input Parameters":[{"inputParam":"ContractId","element":"ContextId"}],"controlWidth":12,"bundle":"QE_DRGetContractMarketSegment","HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"QE_DRGetContractMarketSegment","level":0,"indexInParent":2,"bHasAttachment":false,"bEmbed":false,"bDataRaptorExtractAction":true,"JSONPath":"QE_DRGetContractMarketSegment","lwcId":"lwc2"},{"type":"Set Values","propSetMap":{"wpm":false,"ssm":false,"showPersistentComponent":[false,false],"show":null,"pubsub":false,"message":{},"label":"SVContractLine","elementValueMap":{"lineIdCheck":"=IF( %LineId%, true, false)","lastYearGroupCheck":"=IF( %SubGroupId%,true, false)","ContractId":"%ContextId%"},"disOnTplt":false,"controlWidth":12,"HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"SVContractLine","level":0,"indexInParent":3,"bHasAttachment":false,"bEmbed":false,"bSetValues":true,"JSONPath":"SVContractLine","lwcId":"lwc3"},{"type":"Step","propSetMap":{"wpm":false,"validationRequired":true,"ssm":false,"showPersistentComponent":[false,false],"show":null,"saveMessage":"Are you sure you want to save it for later?","saveLabel":"Save for later","remoteTimeout":30000,"remoteOptions":{},"remoteMethod":"","remoteClass":"","pubsub":false,"previousWidth":3,"previousLabel":"Previous","nextWidth":3,"nextLabel":"Next","message":{},"label":"Do you wish to proceed","knowledgeOptions":{"typeFilter":"","remoteTimeout":30000,"publishStatus":"Online","language":"English","keyword":"","dataCategoryCriteria":""},"instructionKey":"","instruction":"","errorMessage":{"default":null,"custom":[]},"disOnTplt":false,"conditionType":"Hide if False","completeMessage":"Are you sure you want to complete the script?","completeLabel":"Complete","chartLabel":null,"cancelMessage":"Are you sure?","cancelLabel":"Cancel","allowSaveForLater":true,"HTMLTemplateId":"","uiElements":{"PassiveEnrollCheck":"","Newpassiveopportunity":""},"aggElements":{}},"offSet":0,"name":"PassiveEnrollCheck","level":0,"indexInParent":4,"bHasAttachment":false,"bEmbed":false,"response":null,"inheritShowProp":null,"children":[{"response":null,"level":1,"indexInParent":0,"eleArray":[{"type":"Radio","rootIndex":4,"response":null,"propSetMap":{"show":null,"required":true,"repeatLimit":null,"repeatClone":false,"repeat":false,"readOnly":false,"options":[{"value":"Yes","name":"Yes"},{"value":"No","name":"No"}],"optionWidth":100,"optionSource":{"type":"","source":""},"optionHeight":100,"label":"Do you want to proceed with Passive Enrollment?","imageCountInRow":3,"horizontalMode":false,"hide":false,"helpText":"","help":false,"enableCaption":true,"disOnTplt":false,"defaultValue":null,"controllingField":{"type":"","source":"","element":""},"controlWidth":12,"conditionType":"Hide if False","accessibleInFutureSteps":false,"HTMLTemplateId":""},"name":"Newpassiveopportunity","level":1,"JSONPath":"PassiveEnrollCheck:Newpassiveopportunity","indexInParent":0,"index":0,"children":[],"bHasAttachment":false,"bRadio":true,"lwcId":"lwc40-0"}],"bHasAttachment":false}],"bAccordionOpen":false,"bAccordionActive":false,"bStep":true,"isStep":true,"JSONPath":"PassiveEnrollCheck","lwcId":"lwc4"},{"type":"Step","propSetMap":{"wpm":false,"validationRequired":true,"ssm":false,"showPersistentComponent":[true,false],"show":{"group":{"rules":[{"field":"lineIdCheck","data":"true","condition":"="},{"field":"PassiveEnrollCheck:Newpassiveopportunity","data":"Yes","condition":"="}],"operator":"AND"}},"saveMessage":"Are you sure you want to save it for later?","saveLabel":"","remoteTimeout":30000,"remoteOptions":{},"remoteMethod":"","remoteClass":"","pubsub":false,"previousWidth":0,"previousLabel":"","nextWidth":3,"nextLabel":"Close","message":{},"label":"Plans Error","knowledgeOptions":{"typeFilter":"","remoteTimeout":30000,"publishStatus":"Online","language":"English","keyword":"","dataCategoryCriteria":""},"instructionKey":"","instruction":"","errorMessage":{"default":null,"custom":[]},"disOnTplt":false,"conditionType":"Hide if False","completeMessage":"Are you sure you want to complete the script?","completeLabel":"Complete","chartLabel":null,"cancelMessage":"Are you sure?","cancelLabel":"","businessEvent":"","businessCategory":"","allowSaveForLater":false,"HTMLTemplateId":"","uiElements":{"ErrorMessage":""},"aggElements":{}},"offSet":0,"name":"ErrorMessage","level":0,"indexInParent":5,"bHasAttachment":false,"bEmbed":false,"response":null,"inheritShowProp":null,"children":[{"response":null,"level":1,"indexInParent":0,"eleArray":[{"type":"Text Block","rootIndex":5,"response":null,"propSetMap":{"textKey":"","text":"<p style=\"text-align: center; padding-left: 40px;\"></p>\n<p style=\"text-align: center;\"><strong>Previous year Plan is not selected for few Plans, please go to the contract Page : </strong><span style=\"text-decoration: underline;\"><span style=\"background-color: #ffffff;\"><strong><a href=\"../lightning/r/Contract/%ContextId%/view\" target=\"_blank\" style=\"background-color: #ffffff;\" rel=\"noopener\">Contract Page</a></strong></span></span></p>","show":{"group":{"rules":[{"field":"SVContractLine","data":null,"condition":"="}],"operator":"AND"}},"sanitize":false,"label":null,"disOnTplt":false,"dataJSON":false,"controlWidth":12,"HTMLTemplateId":""},"name":"ExistingRenewalRecordError","level":1,"JSONPath":"ErrorMessage:ExistingRenewalRecordError","indexInParent":0,"index":0,"children":[],"bHasAttachment":false,"bTextBlock":true,"lwcId":"lwc50-0"}],"bHasAttachment":false}],"bAccordionOpen":false,"bAccordionActive":false,"bStep":true,"isStep":true,"JSONPath":"ErrorMessage","lwcId":"lwc5"},{"type":"Step","propSetMap":{"wpm":false,"validationRequired":true,"ssm":false,"showPersistentComponent":[true,false],"show":{"group":{"rules":[{"field":"lastYearGroupCheck","data":"true","condition":"="},{"field":"PassiveEnrollCheck:Newpassiveopportunity","data":"Yes","condition":"="}],"operator":"AND"}},"saveMessage":"Are you sure you want to save it for later?","saveLabel":"","remoteTimeout":30000,"remoteOptions":{},"remoteMethod":"","remoteClass":"","pubsub":false,"previousWidth":0,"previousLabel":"","nextWidth":3,"nextLabel":"Close","message":{},"label":"Sub Group Error","knowledgeOptions":{"typeFilter":"","remoteTimeout":30000,"publishStatus":"Online","language":"English","keyword":"","dataCategoryCriteria":""},"instructionKey":"","instruction":"","errorMessage":{"default":null,"custom":[]},"disOnTplt":false,"conditionType":"Hide if False","completeMessage":"Are you sure you want to complete the script?","completeLabel":"Complete","chartLabel":null,"cancelMessage":"Are you sure?","cancelLabel":"","businessEvent":"","businessCategory":"","allowSaveForLater":false,"HTMLTemplateId":"","uiElements":{"subGroupError":""},"aggElements":{}},"offSet":0,"name":"subGroupError","level":0,"indexInParent":6,"bHasAttachment":false,"bEmbed":false,"response":null,"inheritShowProp":null,"children":[{"response":null,"level":1,"indexInParent":0,"eleArray":[{"type":"Text Block","rootIndex":6,"response":null,"propSetMap":{"textKey":"","text":"<p style=\"text-align: center;\"></p>\n<p style=\"text-align: center;\"><strong>Previous year Sub Group is not selected for few Sub Groups : </strong><span style=\"text-decoration: underline;\"><span style=\"background-color: #ffffff;\"><strong><a href=\"../lightning/r/Contract/%ContextId%/view\" target=\"_blank\" style=\"background-color: #ffffff;\" rel=\"noopener\">Contract Page</a></strong></span></span></p>\n<p></p>","show":null,"sanitize":false,"label":null,"disOnTplt":false,"dataJSON":false,"controlWidth":12,"HTMLTemplateId":""},"name":"TextBlock1","level":1,"JSONPath":"subGroupError:TextBlock1","indexInParent":0,"index":0,"children":[],"bHasAttachment":false,"bTextBlock":true,"lwcId":"lwc60-0"}],"bHasAttachment":false}],"bAccordionOpen":false,"bAccordionActive":false,"bStep":true,"isStep":true,"JSONPath":"subGroupError","lwcId":"lwc6"},{"type":"Remote Action","propSetMap":{"wpm":false,"validationRequired":"Step","svgSprite":"","svgIcon":"","ssm":false,"showPersistentComponent":[false,false],"show":{"group":{"rules":[{"group":{"rules":[{"field":"lastYearGroupCheck","data":"true","condition":"<>"},{"field":"lineIdCheck","data":"true","condition":"<>"},{"field":"PassiveEnrollCheck:Newpassiveopportunity","data":"Yes","condition":"="},{"field":"MarketSegment","data":"Large Group","condition":"<>"}],"operator":"AND"}}],"operator":"AND"}},"sendOnlyExtraPayload":true,"sendJSONPath":"","sendJSONNode":"","responseJSONPath":"","responseJSONNode":"","remoteTimeout":30000,"remoteOptions":{"preTransformBundle":"","postTransformBundle":""},"remoteMethod":"addSubscribersForRenewal","remoteClass":"QE_ApplicationRenewalProcess","redirectTemplateUrl":"vlcAcknowledge.html","redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectPageName":"","redirectNextWidth":3,"redirectNextLabel":"Next","pubsub":false,"preTransformBundle":"","postTransformBundle":"","postMessage":"Done","message":{},"label":"QE_ApplicationRenewalProcess","inProgressMessage":"In Progress","failureNextLabel":"Continue","failureGoBackLabel":"Go Back","failureAbortMessage":"Are you sure?","failureAbortLabel":"Abort","extraPayload":{"ContractId":"%ContextId%"},"errorMessage":{"default":null,"custom":[]},"enableDefaultAbort":false,"enableActionMessage":false,"disOnTplt":false,"controlWidth":12,"HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"QE_ApplicationRenewalProcess","level":0,"indexInParent":7,"bHasAttachment":false,"bEmbed":false,"bRemoteAction":true,"JSONPath":"QE_ApplicationRenewalProcess","lwcId":"lwc7"},{"type":"DataRaptor Post Action","propSetMap":{"wpm":false,"validationRequired":"Submit","ssm":false,"showPersistentComponent":[true,false],"show":{"group":{"rules":[{"group":{"rules":[{"field":"lastYearGroupCheck","data":"true","condition":"<>"},{"field":"lineIdCheck","data":"true","condition":"<>"},{"field":"PassiveEnrollCheck:Newpassiveopportunity","data":"Yes","condition":"="},{"field":"MarketSegment","data":"Large Group","condition":"="}],"operator":"AND"}}],"operator":"AND"}},"sendJSONPath":"","sendJSONNode":"","remoteTimeout":30000,"redirectTemplateUrl":"vlcAcknowledge.html","redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectPageName":"","redirectNextWidth":3,"redirectNextLabel":"Next","pubsub":false,"postTransformBundle":"","postMessage":"Done","message":{},"label":"CreateTask","inProgressMessage":"In Progress","failureNextLabel":"Continue","failureGoBackLabel":"Go Back","failureAbortMessage":"Are you sure?","failureAbortLabel":"Abort","errorMessage":{"default":null,"custom":[]},"enableDefaultAbort":false,"enableActionMessage":false,"controlWidth":12,"businessEvent":"","businessCategory":"","bundle":"QE_DRCreatePassiveEnrollTask","HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"CreateTask","level":0,"indexInParent":8,"bHasAttachment":false,"bEmbed":false,"bDataRaptorPostAction":true,"JSONPath":"CreateTask","lwcId":"lwc8"},{"type":"Integration Procedure Action","propSetMap":{"wpm":false,"validationRequired":"Step","useContinuation":false,"toastComplete":true,"svgSprite":"","svgIcon":"","ssm":false,"showPersistentComponent":[true,false],"show":{"group":{"rules":[{"group":{"rules":[{"field":"lastYearGroupCheck","data":"true","condition":"<>"},{"field":"lineIdCheck","data":"true","condition":"<>"},{"field":"PassiveEnrollCheck:Newpassiveopportunity","data":"Yes","condition":"="},{"field":"MarketSegment","data":"Large Group","condition":"="}],"operator":"AND"}}],"operator":"AND"}},"sendOnlyExtraPayload":true,"sendJSONPath":"","sendJSONNode":"","responseJSONPath":"","responseJSONNode":"","remoteTimeout":30000,"remoteOptions":{"useQueueable":true,"useFuture":true,"queueableChainable":true,"preTransformBundle":"","postTransformBundle":"","chainable":false},"redirectTemplateUrl":"vlcAcknowledge.html","redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectPageName":"","redirectNextWidth":3,"redirectNextLabel":"Next","pubsub":false,"preTransformBundle":"","postTransformBundle":"","postMessage":"Done","message":{},"label":"IntegrationProcedureAction1","invokeMode":"fireAndForget","integrationProcedureKey":"QE_IPPassiveEnroll","inProgressMessage":"In Progress","failureNextLabel":"Continue","failureGoBackLabel":"Go Back","failureAbortMessage":"Are you sure?","failureAbortLabel":"Abort","extraPayload":{"TaskId":"%DRId_Task%","ContractId":"%ContextId%"},"errorMessage":{"default":null,"custom":[]},"enableDefaultAbort":false,"enableActionMessage":false,"controlWidth":12,"businessEvent":"","businessCategory":"","HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"PassiveEnrollIP","level":0,"indexInParent":9,"bHasAttachment":false,"bEmbed":false,"bIntegrationProcedureAction":true,"JSONPath":"PassiveEnrollIP","lwcId":"lwc9"},{"type":"Step","propSetMap":{"wpm":false,"validationRequired":true,"ssm":false,"showPersistentComponent":[true,false],"show":{"group":{"rules":[{"field":"lastYearGroupCheck","data":"true","condition":"<>"},{"field":"PassiveEnrollCheck:Newpassiveopportunity","data":"Yes","condition":"="},{"field":"lineIdCheck","data":"true","condition":"<>"},{"field":"MarketSegment","data":"Large Group","condition":"<>"}],"operator":"AND"}},"saveMessage":"Are you sure you want to save it for later?","saveLabel":"","remoteTimeout":30000,"remoteOptions":{},"remoteMethod":"","remoteClass":"","pubsub":false,"previousWidth":0,"previousLabel":"","nextWidth":3,"nextLabel":"Close","message":{},"label":"Passive Enroll Success","knowledgeOptions":{"typeFilter":"","remoteTimeout":30000,"publishStatus":"Online","language":"English","keyword":"","dataCategoryCriteria":""},"instructionKey":"","instruction":"","errorMessage":{"default":null,"custom":[]},"disOnTplt":false,"conditionType":"Hide if False","completeMessage":"Are you sure you want to complete the script?","completeLabel":"Complete","chartLabel":null,"cancelMessage":"Are you sure?","cancelLabel":"","businessEvent":"","businessCategory":"","allowSaveForLater":false,"HTMLTemplateId":"","uiElements":{"Passive Enroll Success":""},"aggElements":{}},"offSet":0,"name":"Passive Enroll Success","level":0,"indexInParent":10,"bHasAttachment":false,"bEmbed":false,"response":null,"inheritShowProp":null,"children":[{"response":null,"level":1,"indexInParent":0,"eleArray":[{"type":"Text Block","rootIndex":10,"response":null,"propSetMap":{"textKey":"","text":"<p style=\"text-align: center;\"></p>\n<p style=\"text-align: center;\"><strong>Passive Enroll Successful</strong></p>\n<p></p>","show":null,"sanitize":false,"label":"TextBlock3","disOnTplt":false,"dataJSON":false,"controlWidth":12,"HTMLTemplateId":""},"name":"TextBlock3","level":1,"JSONPath":"Passive Enroll Success:TextBlock3","indexInParent":0,"index":0,"children":[],"bHasAttachment":false,"bTextBlock":true,"lwcId":"lwc100-0"}],"bHasAttachment":false}],"bAccordionOpen":false,"bAccordionActive":false,"bStep":true,"isStep":true,"JSONPath":"Passive Enroll Success","lwcId":"lwc10"},{"type":"Step","propSetMap":{"wpm":false,"validationRequired":true,"ssm":false,"showPersistentComponent":[true,false],"show":{"group":{"rules":[{"field":"lastYearGroupCheck","data":"true","condition":"<>"},{"field":"PassiveEnrollCheck:Newpassiveopportunity","data":"Yes","condition":"="},{"field":"lineIdCheck","data":"true","condition":"<>"},{"field":"MarketSegment","data":"Large Group","condition":"="}],"operator":"AND"}},"saveMessage":"Are you sure you want to save it for later?","saveLabel":"","remoteTimeout":30000,"remoteOptions":{},"remoteMethod":"","remoteClass":"","pubsub":false,"previousWidth":0,"previousLabel":"","nextWidth":3,"nextLabel":"Close","message":{},"label":"Passive Enroll Successfully Started","knowledgeOptions":{"typeFilter":"","remoteTimeout":30000,"publishStatus":"Online","language":"English","keyword":"","dataCategoryCriteria":""},"instructionKey":"","instruction":"","errorMessage":{"default":null,"custom":[]},"disOnTplt":false,"conditionType":"Hide if False","completeMessage":"Are you sure you want to complete the script?","completeLabel":"Complete","chartLabel":null,"cancelMessage":"Are you sure?","cancelLabel":"","businessEvent":"","businessCategory":"","allowSaveForLater":false,"HTMLTemplateId":"","uiElements":{"LGPassiveEnrollStart":""},"aggElements":{}},"offSet":0,"name":"LGPassiveEnrollStart","level":0,"indexInParent":11,"bHasAttachment":false,"bEmbed":false,"response":null,"inheritShowProp":null,"children":[{"response":null,"level":1,"indexInParent":0,"eleArray":[{"type":"Text Block","rootIndex":11,"response":null,"propSetMap":{"textKey":"","text":"<p style=\"text-align: center;\"></p>\n<p style=\"text-align: center;\"><strong>Passive Enrollment Successfully Started. You can track the status of the Passive Enrollment process from the following Task.</strong></p>\n<p style=\"text-align: center;\"><strong><a href=\"/lightning/r/Task/%DRId_Task%/view\" target=\"_blank\" rel=\"noopener\">View Task</a></strong></p>\n<p></p>","show":null,"sanitize":false,"label":"TextBlock3","disOnTplt":false,"dataJSON":false,"controlWidth":12,"HTMLTemplateId":""},"name":"TextBlock2","level":1,"JSONPath":"LGPassiveEnrollStart:TextBlock2","indexInParent":0,"index":0,"children":[],"bHasAttachment":false,"bTextBlock":true,"lwcId":"lwc110-0"}],"bHasAttachment":false}],"bAccordionOpen":false,"bAccordionActive":false,"bStep":true,"isStep":true,"JSONPath":"LGPassiveEnrollStart","lwcId":"lwc11"},{"type":"Navigate Action","propSetMap":{"wpm":false,"variant":"brand","validationRequired":"none","targetType":"Record","targetLWCLayout":"lightning","targetId":"%ContextId%","targetFilter":"Recent","ssm":false,"show":null,"replace":true,"recordAction":"view","pubsub":false,"objectAction":"home","message":{},"loginAction":"login","label":"Return to Contract","iconVariant":"","iconPosition":"center","iconName":"","disOnTplt":false,"controlWidth":2,"HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"NavigateToContract1","level":0,"indexInParent":12,"bHasAttachment":false,"bEmbed":false,"bNavigate":true,"JSONPath":"NavigateToContract1","lwcId":"lwc12"}],"bReusable":false,"bpVersion":3,"bpType":"QE","bpSubType":"PassiveEnroll","bpLang":"English","bHasAttachment":false,"lwcVarMap":{}};