export const OMNIDEF = {"userTimeZone":-240,"userProfile":"System Administrator","userName":"sxmadara@sentara.com.sentarahealth","userId":"0055Y00000HrgMOQAZ","userCurrencyCode":"USD","timeStamp":"2023-08-14T22:01:23.810Z","sOmniScriptId":"a5J5Y0000012cutUAA","sobjPL":{},"RPBundle":"","rMap":{},"response":null,"propSetMap":{"wpm":false,"visualforcePagesAvailableInPreview":{},"trackingCustomData":{},"timeTracking":false,"stylesheet":{"newportRtl":"","newport":"","lightningRtl":"","lightning":""},"stepChartPlacement":"top","ssm":false,"showInputWidth":false,"seedDataJSON":{},"scrollBehavior":"auto","saveURLPatterns":{},"saveObjectId":"%ContextId%","saveNameTemplate":null,"saveForLaterRedirectTemplateUrl":"vlcSaveForLaterAcknowledge.html","saveForLaterRedirectPageName":"sflRedirect","saveExpireInDays":null,"saveContentEncoded":false,"rtpSeed":false,"pubsub":false,"persistentComponent":[{"sendJSONPath":"","sendJSONNode":"","responseJSONPath":"","responseJSONNode":"","render":false,"remoteTimeout":30000,"remoteOptions":{"preTransformBundle":"","postTransformBundle":""},"remoteMethod":"","remoteClass":"","preTransformBundle":"","postTransformBundle":"","modalConfigurationSetting":{"modalSize":"lg","modalHTMLTemplateId":"vlcProductConfig.html","modalController":"ModalProductCtrl"},"label":"","itemsKey":"cartItems","id":"vlcCart"},{"render":false,"remoteTimeout":30000,"remoteOptions":{"preTransformBundle":"","postTransformBundle":""},"remoteMethod":"","remoteClass":"","preTransformBundle":"","postTransformBundle":"","modalConfigurationSetting":{"modalSize":"lg","modalHTMLTemplateId":"","modalController":""},"label":"","itemsKey":"knowledgeItems","id":"vlcKnowledge","dispOutsideOmni":false}],"message":{},"mergeSavedData":false,"lkObjName":null,"knowledgeArticleTypeQueryFieldsMap":{},"hideStepChart":true,"errorMessage":{"custom":[]},"enableKnowledge":false,"elementTypeToHTMLTemplateMapping":{},"disableUnloadWarn":true,"currentLanguage":"en_US","currencyCode":"","consoleTabTitle":null,"consoleTabLabel":"New","consoleTabIcon":"custom:custom18","cancelType":"SObject","cancelSource":"%ContextId%","cancelRedirectTemplateUrl":"vlcCancelled.html","cancelRedirectPageName":"OmniScriptCancelled","bLK":false,"autoSaveOnStepNext":false,"autoFocus":false,"allowSaveForLater":false,"allowCancel":true},"prefillJSON":"{}","lwcId":"157acf08-c560-0cd7-47cd-3a8b47817325","labelMap":{"DueDatesRequired":"Workflow:DueDatesRequired","CommentsRequired":"Workflow:CommentsRequired","qE_LWCWorkflowAction":"Workflow:qE_LWCWorkflowAction","NavigateToQuote":"NavigateToQuote","QE_EmailTaskOwner":"QE_EmailTaskOwner","QE_IPCreateTaskUpdateQuote":"QE_IPCreateTaskUpdateQuote","Workflow":"Workflow","GetNextWorkflowSteps":"GetNextWorkflowSteps","GetPreviousWorkflowAction":"GetPreviousWorkflowAction","GetCurrentWorkflowStep":"GetCurrentWorkflowStep"},"labelKeyMap":{},"errorMsg":"","error":"OK","dMap":{},"depSOPL":{},"depCusPL":{},"cusPL":{},"children":[{"type":"DataRaptor Extract Action","propSetMap":{"wpm":false,"validationRequired":"Step","ssm":false,"showPersistentComponent":[true,false],"show":null,"responseJSONPath":"","responseJSONNode":"","remoteTimeout":30000,"redirectTemplateUrl":"vlcAcknowledge.html","redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectPageName":"","redirectNextWidth":3,"redirectNextLabel":"Next","pubsub":false,"postMessage":"Done","message":{},"label":null,"inProgressMessage":"In Progress","ignoreCache":false,"failureNextLabel":"Continue","failureGoBackLabel":"Go Back","failureAbortMessage":"Are you sure?","failureAbortLabel":"Abort","errorMessage":{"default":null,"custom":[]},"enableDefaultAbort":false,"enableActionMessage":false,"dataRaptor Input Parameters":[{"inputParam":"Id","element":"ContextId"}],"controlWidth":12,"businessEvent":"","businessCategory":"","bundle":"QE_DrGetCurrentWorkflowStep","HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"GetCurrentWorkflowStep","level":0,"indexInParent":0,"bHasAttachment":false,"bEmbed":false,"bDataRaptorExtractAction":true,"JSONPath":"GetCurrentWorkflowStep","lwcId":"lwc0"},{"type":"DataRaptor Extract Action","propSetMap":{"wpm":false,"validationRequired":"Step","ssm":false,"showPersistentComponent":[true,false],"show":null,"responseJSONPath":"","responseJSONNode":"","remoteTimeout":30000,"redirectTemplateUrl":"vlcAcknowledge.html","redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectPageName":"","redirectNextWidth":3,"redirectNextLabel":"Next","pubsub":false,"postMessage":"Done","message":{},"label":"GetPreviousWorkflowAction","inProgressMessage":"In Progress","ignoreCache":false,"failureNextLabel":"Continue","failureGoBackLabel":"Go Back","failureAbortMessage":"Are you sure?","failureAbortLabel":"Abort","errorMessage":{"default":null,"custom":[]},"enableDefaultAbort":false,"enableActionMessage":false,"dataRaptor Input Parameters":[{"inputParam":"Id","element":"CurrentWorkflowStepId"},{"inputParam":"QuoteType","element":"QuoteType"}],"controlWidth":12,"businessEvent":"","businessCategory":"","bundle":"QE_DrGetPreviousWorkflowAction1","HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"GetPreviousWorkflowAction","level":0,"indexInParent":1,"bHasAttachment":false,"bEmbed":false,"bDataRaptorExtractAction":true,"JSONPath":"GetPreviousWorkflowAction","lwcId":"lwc1"},{"type":"DataRaptor Extract Action","propSetMap":{"wpm":false,"validationRequired":"Step","ssm":false,"showPersistentComponent":[true,false],"show":null,"responseJSONPath":"","responseJSONNode":"","remoteTimeout":30000,"redirectTemplateUrl":"vlcAcknowledge.html","redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectPageName":"","redirectNextWidth":3,"redirectNextLabel":"Next","pubsub":false,"postMessage":"Done","message":{},"label":null,"inProgressMessage":"In Progress","ignoreCache":true,"failureNextLabel":"Continue","failureGoBackLabel":"Go Back","failureAbortMessage":"Are you sure?","failureAbortLabel":"Abort","errorMessage":{"default":null,"custom":[]},"enableDefaultAbort":false,"enableActionMessage":false,"dataRaptor Input Parameters":[{"inputParam":"Id","element":"CurrentWorkflowStepId"},{"inputParam":"QuoteType","element":"QuoteType"}],"controlWidth":12,"businessEvent":"","businessCategory":"","bundle":"QE_DrGetNextWorkflowStep1","HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"GetNextWorkflowSteps","level":0,"indexInParent":2,"bHasAttachment":false,"bEmbed":false,"bDataRaptorExtractAction":true,"JSONPath":"GetNextWorkflowSteps","lwcId":"lwc2"},{"type":"Step","propSetMap":{"wpm":false,"validationRequired":true,"ssm":false,"showPersistentComponent":[true,false],"show":null,"saveMessage":"Are you sure you want to save it for later?","saveLabel":"Save for later","remoteTimeout":30000,"remoteOptions":{},"remoteMethod":"","remoteClass":"","pubsub":false,"previousWidth":3,"previousLabel":"Previous","nextWidth":3,"nextLabel":"Next","message":{},"label":null,"knowledgeOptions":{"typeFilter":"","remoteTimeout":30000,"publishStatus":"Online","language":"English","keyword":"","dataCategoryCriteria":""},"instructionKey":"","instruction":"","errorMessage":{"default":null,"custom":[]},"conditionType":"Hide if False","completeMessage":"Are you sure you want to complete the script?","completeLabel":"Complete","chartLabel":null,"cancelMessage":"Are you sure?","cancelLabel":"Cancel","businessEvent":"","businessCategory":"","allowSaveForLater":false,"HTMLTemplateId":"","uiElements":{"Workflow":""},"aggElements":{"qE_LWCWorkflowAction":""}},"offSet":0,"name":"Workflow","level":0,"indexInParent":3,"bHasAttachment":false,"bEmbed":false,"response":null,"inheritShowProp":null,"children":[{"response":null,"level":1,"indexInParent":0,"eleArray":[{"type":"Custom Lightning Web Component","rootIndex":3,"response":null,"propSetMap":{"show":null,"lwcName":"qe_LwcWorkflowAction","label":"qE_LWCWorkflowAction","hide":false,"disOnTplt":false,"customAttributes":[{"source":"%ContextId%","name":"recordid"},{"source":"%NextStep%","name":"nextsteps"},{"source":"%userProfile%","name":"userprofile"},{"source":"%PreviousStep%","name":"previousstep"}],"controlWidth":12,"conditionType":"Hide if False","bStandalone":false},"name":"qE_LWCWorkflowAction","level":1,"JSONPath":"Workflow:qE_LWCWorkflowAction","indexInParent":0,"index":0,"children":[],"bHasAttachment":false,"bcustomlightningwebcomponent1":true,"lwcId":"lwc30-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":1,"eleArray":[{"type":"Validation","rootIndex":3,"response":null,"propSetMap":{"validateExpression":{"group":{"rules":[{"field":"commentvalidity","data":"false","condition":"<>"}],"operator":"AND"}},"show":{"group":{"rules":[{"field":"commentvalidity","data":"false","condition":"="}],"operator":"AND"}},"messages":[{"value":true,"type":"Success","text":"","active":false},{"value":false,"type":"Requirement","text":"comments is required","active":true}],"label":"CommentsRequired","hideLabel":true,"disOnTplt":false,"controlWidth":12,"HTMLTemplateId":""},"name":"CommentsRequired","level":1,"JSONPath":"Workflow:CommentsRequired","indexInParent":1,"index":0,"children":[],"bHasAttachment":false,"bMessaging":true,"lwcId":"lwc31-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":2,"eleArray":[{"type":"Validation","rootIndex":3,"response":null,"propSetMap":{"validateExpression":{"group":{"rules":[{"field":"duedatevalidity","data":"false","condition":"<>"}],"operator":"AND"}},"show":{"group":{"rules":[{"field":"duedatevalidity","data":"false","condition":"="}],"operator":"AND"}},"messages":[{"value":true,"type":"Success","text":"","active":false},{"value":false,"type":"Requirement","text":"Due date is required","active":true}],"label":"DueDatesRequired","hideLabel":true,"disOnTplt":false,"controlWidth":12,"HTMLTemplateId":""},"name":"DueDatesRequired","level":1,"JSONPath":"Workflow:DueDatesRequired","indexInParent":2,"index":0,"children":[],"bHasAttachment":false,"bMessaging":true,"lwcId":"lwc32-0"}],"bHasAttachment":false}],"bAccordionOpen":false,"bAccordionActive":false,"bStep":true,"isStep":true,"JSONPath":"Workflow","lwcId":"lwc3"},{"type":"Integration Procedure Action","propSetMap":{"wpm":false,"validationRequired":"Step","useContinuation":false,"svgSprite":"","svgIcon":"","ssm":false,"showPersistentComponent":[false,false],"show":null,"sendOnlyExtraPayload":false,"sendJSONPath":"","sendJSONNode":"","responseJSONPath":"","responseJSONNode":"","remoteTimeout":30000,"remoteOptions":{"useFuture":false,"preTransformBundle":"","postTransformBundle":"","chainable":false},"redirectTemplateUrl":"vlcAcknowledge.html","redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectPageName":"","redirectNextWidth":3,"redirectNextLabel":"Next","pubsub":false,"preTransformBundle":"","postTransformBundle":"","postMessage":"Done","message":{},"label":"QE_IPCreateTaskUpdateQuote","integrationProcedureKey":"QE_IPCreateTaskUpdateQuote","inProgressMessage":"In Progress","failureNextLabel":"Continue","failureGoBackLabel":"Go Back","failureAbortMessage":"Are you sure?","failureAbortLabel":"Abort","extraPayload":{},"errorMessage":{"default":null,"custom":[]},"enableDefaultAbort":false,"enableActionMessage":false,"disOnTplt":false,"controlWidth":12,"HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"QE_IPCreateTaskUpdateQuote","level":0,"indexInParent":4,"bHasAttachment":false,"bEmbed":false,"bIntegrationProcedureAction":true,"JSONPath":"QE_IPCreateTaskUpdateQuote","lwcId":"lwc4"},{"type":"Email Action","propSetMap":{"wpm":false,"validationRequired":"Step","useTemplate":false,"staticDocList":[],"ssm":false,"showPersistentComponent":[true,false],"show":{"group":{"rules":[{"field":"OwnerId","data":null,"condition":"<>"}],"operator":"AND"}},"remoteTimeout":30000,"redirectTemplateUrl":"vlcAcknowledge.html","redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectPageName":"","redirectNextWidth":3,"redirectNextLabel":"Next","pubsub":false,"postMessage":"Done","message":{},"label":"QE_EmailTaskOwner","inProgressMessage":"In Progress","fileAttachments":"","failureNextLabel":"Continue","failureGoBackLabel":"Go Back","failureAbortMessage":"Are you sure?","failureAbortLabel":"Abort","errorMessage":{"default":null,"custom":[]},"enableDefaultAbort":false,"enableActionMessage":false,"emailTemplateInformation":{"whatId":"","saveAsActivity":false,"emailTemplateName":"","emailTargetObjectId":""},"emailInformation":{"toAddressList":["%OwnerId%"],"setHtmlBody":true,"emailSubject":"New Task is assigned to you","emailBody":"A new Task is assigned to you. Kindly click on link to go to it.","ccAddressList":[],"bccAddressList":[]},"docList":"","controlWidth":12,"contentVersionList":"","businessEvent":"","businessCategory":"","attachmentList":"","OrgWideEmailAddress":"","HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"QE_EmailTaskOwner","level":0,"indexInParent":5,"bHasAttachment":false,"bEmbed":false,"bEmailAction":true,"JSONPath":"QE_EmailTaskOwner","lwcId":"lwc5"},{"type":"Navigate Action","propSetMap":{"wpm":false,"variant":"brand","validationRequired":"Submit","targetType":"Record","targetName":"Quote","targetLWCLayout":"lightning","targetId":"%ContextId%","targetFilter":"Recent","ssm":false,"show":null,"replace":false,"recordAction":"view","pubsub":false,"objectAction":"home","message":{},"loginAction":"login","label":"NavigateToQuote","iconVariant":"","iconPosition":"left","iconName":"","controlWidth":12,"businessEvent":"","businessCategory":"","HTMLTemplateId":"","aggElements":{}},"offSet":0,"name":"NavigateToQuote","level":0,"indexInParent":6,"bHasAttachment":false,"bEmbed":false,"bNavigate":true,"JSONPath":"NavigateToQuote","lwcId":"lwc6"}],"bReusable":false,"bpVersion":4,"bpType":"QE","bpSubType":"OsWorkflow","bpLang":"English","bHasAttachment":false,"lwcVarMap":{"ContextId":null,"NextStep":null,"userProfile":null,"PreviousStep":null}};