export const OMNIDEF = {"userTimeZone":-420,"userProfile":"System Administrator","userName":"jdavidson@eaglecrk.com.sentarahealth","userId":"0055Y00000HPLDKQA5","userCurrencyCode":"USD","timeStamp":"2021-10-28T17:46:42.131Z","sOmniScriptId":"a5J5Y000000WVwFUAW","sobjPL":{},"RPBundle":"","rMap":{},"response":null,"propSetMap":{"wpm":false,"visualforcePagesAvailableInPreview":{},"trackingCustomData":{},"timeTracking":true,"stylesheet":{"newportRtl":"","newport":"","lightningRtl":"","lightning":""},"stepChartPlacement":"top","ssm":false,"showInputWidth":false,"seedDataJSON":{},"saveURLPatterns":{},"saveObjectId":"%ContextId%","saveNameTemplate":null,"saveForLaterRedirectTemplateUrl":"vlcSaveForLaterAcknowledge.html","saveForLaterRedirectPageName":"sflRedirect","saveExpireInDays":null,"saveContentEncoded":false,"rtpSeed":false,"pubsub":false,"persistentComponent":[{"sendJSONPath":"","sendJSONNode":"","responseJSONPath":"","responseJSONNode":"","render":false,"remoteTimeout":30000,"remoteOptions":{"preTransformBundle":"","postTransformBundle":""},"remoteMethod":"","remoteClass":"","preTransformBundle":"","postTransformBundle":"","modalConfigurationSetting":{"modalSize":"lg","modalHTMLTemplateId":"vlcProductConfig.html","modalController":"ModalProductCtrl"},"label":"","itemsKey":"cartItems","id":"vlcCart"},{"render":false,"remoteTimeout":30000,"remoteOptions":{"preTransformBundle":"","postTransformBundle":""},"remoteMethod":"","remoteClass":"","preTransformBundle":"","postTransformBundle":"","modalConfigurationSetting":{"modalSize":"lg","modalHTMLTemplateId":"","modalController":""},"label":"","itemsKey":"knowledgeItems","id":"vlcKnowledge"}],"message":{},"lkObjName":null,"knowledgeArticleTypeQueryFieldsMap":{},"includeCustomization":true,"hideStepChart":false,"errorMessage":{"custom":[]},"enableKnowledge":false,"elementTypeToHTMLTemplateMapping":{},"disableUnloadWarn":true,"customPages":{"ContractPreview":"vlocity_ins__ContractAmendmentPreview?verticalMode=true"},"currentLanguage":"en_US","currencyCode":"","consoleTabTitle":null,"consoleTabLabel":"New","consoleTabIcon":"custom:custom18","cancelType":"SObject","cancelSource":"%ContextId%","cancelRedirectTemplateUrl":"vlcCancelled.html","cancelRedirectPageName":"OmniScriptCancelled","bLK":false,"autoSaveOnStepNext":false,"autoFocus":false,"allowSaveForLater":false,"allowCancel":true},"prefillJSON":"{}","lwcId":"e181e1b3-8e45-84b9-fcc8-a4730b139b41","labelMap":{"Finish":"GenerateDocument:Finish","NavigateTextBlock":"GenerateDocument:NavigateTextBlock","SuccessMessage":"GenerateDocument:SuccessMessage","DocumentGenerationLWC":"GenerateDocument:DocumentGenerationLWC","GenerateDocument":"GenerateDocument","Set Values":"Set Values","GetDocumentTemplatesForSelectedName":"GetDocumentTemplatesForSelectedName","TADTesting":"TADTesting","SetValues2":"SetValues2"},"labelKeyMap":{},"errorMsg":"","error":"OK","dMap":{},"depSOPL":{},"depCusPL":{},"cusPL":{},"children":[{"type":"Set Values","propSetMap":{"wpm":false,"ssm":false,"showPersistentComponent":[false,false],"show":null,"pubsub":false,"message":{},"label":"SetValues2","elementValueMap":{"multiDocumentGenerationValue1":false,"SelectDocumentTemplate":"TAD","ContractId":"%ContextId%"},"disOnTplt":false,"controlWidth":12,"HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"SetValues2","level":0,"indexInParent":0,"bHasAttachment":false,"bEmbed":false,"bSetValues":true,"JSONPath":"SetValues2","lwcId":"lwc0"},{"type":"DataRaptor Extract Action","propSetMap":{"wpm":false,"validationRequired":"Step","ssm":false,"showPersistentComponent":[false,false],"show":null,"responseJSONPath":"","responseJSONNode":"","remoteTimeout":30000,"redirectTemplateUrl":"vlcAcknowledge.html","redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectPageName":"","redirectNextWidth":3,"redirectNextLabel":"Next","pubsub":false,"postMessage":"Done","message":{},"label":"DataRaptorExtractAction2","inProgressMessage":"In Progress","ignoreCache":false,"failureNextLabel":"Continue","failureGoBackLabel":"Go Back","failureAbortMessage":"Are you sure?","failureAbortLabel":"Abort","errorMessage":{"default":null,"custom":[]},"enableDefaultAbort":false,"enableActionMessage":false,"disOnTplt":false,"dataRaptor Input Parameters":[{"inputParam":"ContractId","element":"ContractId"}],"controlWidth":12,"bundle":"QE_DrTADExtract","HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"TADTesting","level":0,"indexInParent":1,"bHasAttachment":false,"bEmbed":false,"bDataRaptorExtractAction":true,"JSONPath":"TADTesting","lwcId":"lwc1"},{"type":"DataRaptor Extract Action","propSetMap":{"wpm":false,"validationRequired":"Step","ssm":false,"showPersistentComponent":[false,false],"show":null,"responseJSONPath":"DocumentTemplate","responseJSONNode":"selectedTemplate","remoteTimeout":30000,"redirectTemplateUrl":"vlcAcknowledge.html","redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectPageName":"","redirectNextWidth":3,"redirectNextLabel":"Next","pubsub":false,"postMessage":"Done","message":{},"label":"GetDocumentTemplatesForSelectedName","inProgressMessage":"In Progress","ignoreCache":false,"failureNextLabel":"Continue","failureGoBackLabel":"Go Back","failureAbortMessage":"Are you sure?","failureAbortLabel":"Abort","errorMessage":{"default":null,"custom":[]},"enableDefaultAbort":false,"enableActionMessage":false,"disOnTplt":false,"dataRaptor Input Parameters":[{"inputParam":"documentName","element":"SelectDocumentTemplate"}],"controlWidth":12,"bundle":"QE_DrGetDocumentTemplatebyName","HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"GetDocumentTemplatesForSelectedName","level":0,"indexInParent":2,"bHasAttachment":false,"bEmbed":false,"bDataRaptorExtractAction":true,"JSONPath":"GetDocumentTemplatesForSelectedName","lwcId":"lwc2"},{"type":"Set Values","propSetMap":{"wpm":false,"validationRequired":"None","ssm":false,"showPersistentComponent":[false,false],"show":null,"pubsub":false,"message":{},"label":null,"elementValueMap":{"useTemplateDRExtract":"No","templateType":"=%selectedTemplate:TemplateType%","templateId":"=%selectedTemplate:Id%","qId":"=%ContractId%","pdfViewer":"=IF(%multiDocumentGenerationValue% == true, 'none', 'VlocityClientSideViewer')","generateMultipleDocument":"=%multiDocumentGenerationValue1%","downloadFileFormat":"No","documentType":"pdf","documentName":"=%SelectDocumentTemplate%","contextId":"=%ContractId%","attachFileFormat":"PDF"},"controlWidth":12,"HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"Set Values","level":0,"indexInParent":3,"bHasAttachment":false,"bEmbed":false,"bSetValues":true,"JSONPath":"Set Values","lwcId":"lwc3"},{"type":"Step","propSetMap":{"wpm":false,"validationRequired":true,"ssm":false,"showPersistentComponent":[false,false],"show":null,"saveMessage":"Are you sure you want to save it for later?","saveLabel":"Save for later","remoteTimeout":30000,"remoteOptions":{},"remoteMethod":"","remoteClass":"","pubsub":false,"previousWidth":3,"previousLabel":"","nextWidth":3,"nextLabel":"","message":{},"label":"Generate Document","knowledgeOptions":{"typeFilter":"","remoteTimeout":30000,"publishStatus":"Online","language":"English","keyword":"","dataCategoryCriteria":""},"instructionKey":"","instruction":"","errorMessage":{"default":null,"custom":[]},"disOnTplt":false,"conditionType":"Hide if False","completeMessage":"Are you sure you want to complete the script?","completeLabel":"Complete","chartLabel":null,"cancelMessage":"Are you sure?","cancelLabel":"Cancel","allowSaveForLater":true,"HTMLTemplateId":"","uiElements":{"GenerateDocument":""},"aggElements":{"DocumentGenerationLWC":""}},"offSet":0,"name":"GenerateDocument","level":0,"indexInParent":4,"bHasAttachment":false,"bEmbed":false,"response":null,"inheritShowProp":null,"children":[{"response":null,"level":1,"indexInParent":0,"eleArray":[{"type":"Custom Lightning Web Component","rootIndex":4,"response":null,"propSetMap":{"show":null,"lwcName":"vlocity_ins__clmOsDocxGenerateDocument","label":"CustomLWC1","hide":false,"disOnTplt":false,"customAttributes":[{"source":"%ContextId%","name":"context-id"},{"source":"%selectedTemplate%","name":"selected-template"},{"source":"%documentName%","name":"document-title"}],"controlWidth":12,"conditionType":"Hide if False","bStandalone":false},"name":"DocumentGenerationLWC","level":1,"JSONPath":"GenerateDocument:DocumentGenerationLWC","indexInParent":0,"index":0,"children":[],"bHasAttachment":false,"bcustomlightningwebcomponent1":true,"lwcId":"lwc40-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":1,"eleArray":[{"type":"Text Block","rootIndex":4,"response":null,"propSetMap":{"textKey":"","text":"<h3 style=\"text-align: center;\"><strong>TAD Document Generated Successfully and attached to the Plan.&nbsp;</strong></h3>","show":{"group":{"rules":[{"field":"isPDFAttachDone","data":"true","condition":"="}],"operator":"AND"}},"sanitize":false,"label":null,"disOnTplt":false,"dataJSON":false,"controlWidth":12,"HTMLTemplateId":""},"name":"SuccessMessage","level":1,"JSONPath":"GenerateDocument:SuccessMessage","indexInParent":1,"index":0,"children":[],"bHasAttachment":false,"bTextBlock":true,"lwcId":"lwc41-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":2,"eleArray":[{"type":"Text Block","rootIndex":4,"response":null,"propSetMap":{"textKey":"","text":"","show":null,"sanitize":false,"label":null,"disOnTplt":false,"dataJSON":false,"controlWidth":10,"HTMLTemplateId":""},"name":"NavigateTextBlock","level":1,"JSONPath":"GenerateDocument:NavigateTextBlock","indexInParent":2,"index":0,"children":[],"bHasAttachment":false,"bTextBlock":true,"lwcId":"lwc42-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":3,"eleArray":[{"type":"Navigate Action","rootIndex":4,"response":null,"propSetMap":{"wpm":false,"variant":"brand","validationRequired":"none","targetType":"Record","targetName":"Contract","targetLWCLayout":"lightning","targetId":"%ContextId%","targetFilter":"%ContextId%","ssm":false,"show":{"group":{"rules":[{"field":"isPDFAttachDone","data":"true","condition":"="}],"operator":"AND"}},"replace":true,"recordAction":"view","pubsub":false,"objectAction":"home","message":{},"loginAction":"login","label":"Finish","iconVariant":"","iconPosition":"left","iconName":"","disOnTplt":false,"controlWidth":2,"HTMLTemplateId":""},"name":"Finish","level":1,"JSONPath":"GenerateDocument:Finish","indexInParent":3,"index":0,"children":[],"bHasAttachment":false,"bNavigate":true,"lwcId":"lwc43-0"}],"bHasAttachment":false}],"bAccordionOpen":false,"bAccordionActive":false,"bStep":true,"isStep":true,"JSONPath":"GenerateDocument","lwcId":"lwc4"}],"bReusable":false,"bpVersion":2,"bpType":"QE","bpSubType":"osTADDocumentGenertion","bpLang":"English","bHasAttachment":false,"lwcVarMap":{"ContextId":null,"selectedTemplate":null,"documentName":null}};