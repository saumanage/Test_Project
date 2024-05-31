import { LightningElement, api, track } from 'lwc';
import dataTable from "vlocity_ins/dataTable";
import templ from "./qE_LWCOptimaDataTable.html";
import { loadScript } from "lightning/platformResourceLoader"
import util from 'vlocity_ins/utility';
import lodash from 'vlocity_ins/lodash';
import { OmniscriptActionCommonUtil } from 'vlocity_ins/omniscriptActionUtils';
import { commonUtils, dataFormatter, omniscriptUtils } from 'vlocity_ins/insUtility';
import pubsub from 'vlocity_ins/pubsub';
import moment from "vlocity_ins/dayjs";
const depSpanColumns = [
    { label: 'Plan Name', fieldName: 'PlanName', hideDefaultActions: true,},
    { label: 'Plan Type', fieldName: 'PlanType', hideDefaultActions: true, },
    { label: 'Dependent Name', fieldName: 'Name', hideDefaultActions: true, },
    { label: 'Start Date', fieldName: 'StartDateText', hideDefaultActions: true},
    { label: 'End Date', fieldName: 'EndDateText', hideDefaultActions: true},
]

export default class QE_LWCOptimaDataTable extends dataTable {
    @api recordId;
    @api recordsnode;
    // Example of data raptor for table
    //@api recordssource ={
    // "type": "DataRaptor",
    // "name": "QE_DrGetBenefitAdminMemberDetails",
    // "keypayload": "GroupId"
    // }
    //@api valuepayload = '0015Y00002g4EoEQAU'
    searchTracker;
    @api recordssource;
    @api valuepayload;
    @api showMoreControls  = false;
    @api showMoreSearch  = false;
    @api
        get recordMore () {
            return this._recordMore;
        }
       set recordMore(data ){
             this._recordMore=data;
             this.showMoreControls =true;
            this.showMoreSearch = true;


        }

    resetCheckName = false;
    checkName = '!';
    statusIndex;
    searchedRecords = [];
    retrieveMoreRecords = true;
    recordsFoundFromSearch = [];
    //recordsnodesource work as same as recordnode but for source;
    @api recordsnodesource;
    @api isDependentTable;
    @api isBA;
    @api isnotEmpty;
    @api depModSpan;

    @track showActions = false;
    @track omniscriptModalLabel = '';
    @track prefill = {
        ContextId: ''
    }
    @track recordIdCard = '';
    @track depSpanColumns = depSpanColumns;
    @track dataDepSpan = [];


    @track omnis = {
        editDependent: false,
        deleteDependent: false,
        viewMembersGroup: false,
        editSubGroup:false,
        editSubscriber:false
    }
    data = [];
    record = {};
    next_wait =false;
    
    @track dataCompare;
    @track dataActions = [];
    @track products;
    @track modalTitle= '';

    @api
    get displayactions(){
        return this._displayactions;
    }

    set displayactions(data){
        this._displayactions = data;
    }


    @track IsNoMoreRecord =false;

    set actions(value) {

        if (value) {
            if (typeof value === "string") {
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    //
                }
            }
            value = value.filter(v => {
                if(v.condition ){
                    const get = (obj, path, def) => (() => typeof path === 'string' ? path.replace(/\[(\d+)]/g,'.$1') : path.join('.'))()
                        .split('.')
                        .filter(Boolean)
                        .every(step => ((obj = obj[step]) !== undefined)) ? obj : def
                    let tempObj = {records: this.records}

                    this.dataCompare = get(tempObj, v.condition.infocompare) ? JSON.parse(JSON.stringify(get(tempObj, v.condition.infocompare) )): {} ;
                    if(v.condition.comparator === "=="){
                        if(v.condition.value === "undefined"){
                            let textlog = "undefined log";
                            console.log(textlog)
                            return this.dataCompare[v.condition.field] == undefined;
                        }else{
                            return this.dataCompare[v.condition.field] == v.condition.value;

                        }
                    }else if(v.condition.comparator === "!="){
                        return this.dataCompare[v.condition.field] != v.condition.value;
                    }
                }else{
                    return true;
                }
            })
            this.showActions = Array.isArray(value) && value.length > 0;

            this.dataActions = value.map(item => {
                return {...item, Id: this.uniqueKey() }
            });
        }

    }
    @api
    get actions() {
        return this.dataActions;
    }

    get styleTable(){
        let calculatedHeight = 0;
        if(this.tablePageData){
            if(this.columns.length > 5){
                calculatedHeight = (53 * (this.tablePageData.length + 1))
                if(this.showActions){
                    calculatedHeight = calculatedHeight + (this.dataActions.length * 53)
                }
            }

        }else{
            calculatedHeight = 150;
        }
        return  `min-height: 150px;${calculatedHeight > 0 ? `height:${calculatedHeight}px;`:''}${calculatedHeight > 0 ? `overflow-x: scroll;`:''} `
    }
    get optionsPageSize() {
            return [
                { label: '10', value: '10' },
                { label: '20', value: '20' },
                { label: '30', value: '30' }
            ];
        }

    getFutureRecordSetup()
    {



        if( this.recordMore)
        {
            let f_record = JSON.parse(this.recordMore);

            console.log('f_record: '+ f_record);
            let params =null;
            if( f_record.type=="IntegrationProcedures")
            {

                f_record.value.inputMap.OffSet= ( this.pagesize * (this.currentPage + 1)   );
                //eval("f_record.value.inputMap." + `${f_record.ChkFieldName}` +  this.records[this.records.length]  );
                
                if( f_record.value.inputMap.FindByName)
                    f_record.value.inputMap.FindByName =false; //Stop search

                if(f_record.value.inputMap[ f_record.ChkFieldName] )
                {
                    //remove the records imported from the search to not interfere with correctly grabbing new records
                    if(this.recordsFoundFromSearch.length > 0){
                        this.records = this.records.filter(item => {
                            return !this.recordsFoundFromSearch.find(searchItem => {
                               return searchItem[f_record.LookupField] === item[f_record.LookupField];
                            });
                        });
                        this.recordsFoundFromSearch = [];
                    }
                    
                    f_record.value.inputMap[ f_record.ChkFieldName] = this.records[this.records.length-1][f_record.ChkOutputField];
                    console.log('CheckField: '+ f_record.value.inputMap[ f_record.ChkFieldName]  );
                }

                params ={
                    input:  f_record.value.inputMap,
                    sClassName: "vlocity_ins.IntegrationProcedureService",
                    sMethodName: f_record.bundleName,
                    options: f_record.value.optionsMap,
                };
            }else
            {
                     params = {
                        type : "Dataraptor",
                        value : {
                            bundleName : f_record.bundleName,
                            inputMap :f_record.value.inputMap ,
                            optionsMap : "{}"
                        }
                    };
            }

            return params;

        }

        return null;





    }

    /*
    handleRecordsComplete()
    {
        
       
            console.log('loaded:' + this.isLoaded);
            console.log("COmplete wait: "+ this.next_wait);
        if( this.next_wait ==true)
        {
            console.log("handleRecord Complete");
            this.toggleNext(false);
        }
    }*/
    
    toggleNext( disable)
    {
        this.next_wait = disable;
        console.log("next wait: "+ disable);
        const element = this.template.querySelector('[data-id="next_STAR"]');
        
        if(element)
        {



            if( element.disabled!=null)
                element.disabled =this.next_wait;
            
            if(element.ariaDisabled!=null)
                element.ariaDisabled =this.next_wait;
            
            if(element.ariaBusy!=null )
                element.ariaBusy =this.next_wait;

        }

    }
    goToPage2(e, pgnum){

      try
      {

        if(this.nextDisabled ) //at the last page
        {

          if(this.recordMore)
          {
            let f_record = JSON.parse(this.recordMore);

            console.log("Before Record: "+ this.records.length);

            if( this.records.length < f_record.value.inputMap.Limit  ) //are the records less than the limit. No Next page
            {
                this.IsNoMoreRecord =true;
                return;
            }

            if(this.IsNoMoreRecord) //no need to query records
             return;

            //Block from click next for a few moments

            //call based on type
            if( f_record.type =="IntegrationProcedures"){
                console.log("let them wait");
                this.toggleNext( true);
            this._actionUtilClass
                .executeAction(this.getFutureRecordSetup(), null, this, null, null)
                .then(response => {






                    if( (Array.isArray(response.result.IPResult)?response.result.IPResult: [response.result.IPResult]).length < f_record.value.inputMap.Limit )
                    {
                        if(this.nextDisabled)
                            {
                                this.IsNoMoreRecord =true;
                                this.showMoreControls =false;
                            }
                    }




                    if( ! Array.isArray(response.result.IPResult) ) //fail safe
                    {
                        //console.log("Input Rec keys:" + Object.keys( Object.keys(response.result.IPResult)));
                        //console.log("lookupField:"+ f_record.LookupField);
                        //if(  Object.keys( this.records[0]).length-2  > Object.keys(response.result.IPResult).length  ) //remove added column UniqueKey and Original Index
                        if( !( (""+f_record.LookupField) in response.result.IPResult) )
                        {
                            this.IsNoMoreRecord =true;
                            this.showMoreControls =false;
                            return;
                        }

                    }
                    //filter out existing records
                    var filterRec =  (Array.isArray(response.result.IPResult)?response.result.IPResult: [response.result.IPResult]);
                     filterRec =filterRec.filter( fr=> {   
                         return fr[f_record.LookupField]!= this.records[this.records.length-1][f_record.LookupField];
                     }); 

                    var recs =[...this.records, ...filterRec];
                    this.records =recs;




                    console.log("after Record: "+ this.records.length);

                })
                .catch(error => {
                    console.log(error, 'error');
                });

                 
            }else
            {
                util.getDataHandler(this.getFutureRecordSetup())
                    .then(result => {
                        //set rec

                    })
                    .catch(err => {
                        console.log(err);
                    });

            }

        
       //return;

          }
        }

      }catch(ex)
      {
          console.log('error loading next:' + ex);
        return;
      }

      //do the next
       e.target.dataset.index ="next";
      this.goToPage(e, pgnum);
        if(!this.recordMore)
        {

            this.IsNoMoreRecord =this.nextDisabled;
        }


    }

        // eslint-disable-next-line @lwc/lwc/no-async-await
    connectedCallback() {
        try{

        this._actionUtilClass = new OmniscriptActionCommonUtil();

        //columns example : "[   {     "visible": "true",     "label": "Group Name",     "fieldName": "Name",     "sortable": true,     "searchable": true,     "sortingEnabled": true   },   {     "visible": "true",     "label": "Status",     "fieldName": "Status",     "sortable": true,     "searchable": true,     "sortingEnabled": true   },   {     "visible": "true",     "label": "Type",     "fieldName": "Type",     "sortable": true,     "searchable": true,     "sortingEnabled": true   },   {     "visible": "true",     "label": "Id",     "fieldName": "Id",     "sortable": true,     "searchable": true,     "sortingEnabled": true   } ]"
        //actions example : [   {     "type": "redirect",     "url": "/broker/s/memberdetail?recordId=",     "fieldUrl": "Id",     "label": "Member Details"   } ]

        //actions example with omniscript modal [   {     "type": "omniscript",     "omniType": "deleteDivision",     "fieldOmni": "Id",     "label": "Delete Group Division"   } ]

        //WHERE CONDITION NODE COULD BE EMPTY
        //actions example card [   {     "type": "omniscript",     "omniType": "editDependent",     "fieldOmni": "Id",     "label": "Update Dependent",     "condition": {       "field": "Task",       "comparator": "==",       "value": "undefined",       "infocompare": "records[0]"     }   } ]
        console.log('Init connectedCallback')
        super.connectedCallback();
        /*
        if(!this.recordMore)
        {

            this.IsNoMoreRecord =this.nextDisabled;
        }else
        {
            this.IsNoMoreRecord =false;
        }*/


        this.rootChannel = `ProductSelectionChannel-${dataFormatter.uniqueKey()}`;
        console.log('this.rootChannel: ' + JSON.stringify(this.rootChannel));

        setTimeout(()=>{
            const get = (obj, path, def) => (() => typeof path === 'string' ? path.replace(/\[(\d+)]/g,'.$1') : path.join('.'))()
            .split('.')
            .filter(Boolean)
            .every(step => ((obj = obj[step]) !== undefined)) ? obj : def
            let tempObj = {records: this.records}
            if(this.recordsnode){
                this.records = Array.isArray(tempObj.records) && tempObj.records.length > 0 ? get(tempObj, this.recordsnode) : [];
                this.records = this.records ? this.records : [];
            }
            if(this.recordssource ){
                let recordSourceObj = JSON.parse(this.recordssource);
                if(recordSourceObj.type === 'DataRaptor'){
                    let request = {
                        type : "Dataraptor",
                        value : {
                            bundleName : recordSourceObj.name,
                            inputMap : `{"${recordSourceObj.keypayload}":"${get(tempObj,this.valuepayload)}"}`,
                            optionsMap : "{}"
                        }
                    };
                    console.log('requestL',JSON.stringify(request))
                    util.getDataHandler(JSON.stringify(request))
                    .then(result => {
                        let parsedResult = JSON.parse(result);
                        if(parsedResult.length && this.recordsnodesource) {
                            let temprecords = get(parsedResult,this.recordsnodesource);
                            this.records = Array.isArray(temprecords) ? temprecords : [temprecords];
                        }else{
                            this.records = parsedResult;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
                }

            }
            // let recVAlue = this.records[0].id == "REC0"? true : false;
            // if(this.records.length > 0) {
            //     this.isnotEmpty = true;
            // } else {
            //     this.isnotEmpty = false;
            // }
            console.log('isnotEmpty', this.isnotEmpty);
            //console.log('recordsL', JSON.stringify(this.records));
            let recVAlue = this.records[0].Id == "REC0" && this.records[0].originalIndex == "0"? true : false;
            if(this.records.length > 0 && recVAlue) {
                this.isnotEmpty = false;
            } else {
                this.isnotEmpty = true;
            }
            console.log('Init isnotEmpty : '+this.isnotEmpty)
            //console.log('tablePageData', JSON.stringify(this.tablePageData));
            console.log('tableHeaderClass', JSON.stringify(this.tableHeaderClass));
            console.log('columns', JSON.parse(JSON.stringify(this.columns)));
            console.log('columns obj', JSON.stringify(this.columns));
        },3000)
            
        


    }catch(ex){
        console.log('members : '+ex);
    }




    }

    handleSelect(ev) {
        let rowIndex = ev.currentTarget.dataset.index;
        let recVAlue = this.records[0].Id == "REC0" && this.records[0].originalIndex == "0"? true : false;
            if(this.records.length > 0 && recVAlue) {
                this.isnotEmpty = false;
            } else {
                this.isnotEmpty = true;
            }
        console.log('isnotEmpty', this.isnotEmpty);
        let record = this.filteredData.find(
            item => item.originalIndex === rowIndex
        );
        console.log(ev.detail);
        console.log("this.isDependentTable::::",this.isDependentTable);
        let actionSelected = this.dataActions.find(
            item => item.Id === ev.detail.value
        );
        if(this.isDependentTable && JSON.parse(this.isDependentTable) == true) {
            for(let i = 0; i < this.filteredData.length; i++) {
                if(actionSelected.label == 'Remove Dependent' && this.filteredData[i].Status == 'Not Enrolled' && this.filteredData[i].originalIndex == rowIndex)  {
                    alert("You cannot remove dependent as the dependent is not enrolled in any plans.");
                    return;
                }
            }
        }
        if (actionSelected.type === 'redirect') {
            window.location.href = actionSelected.url + record[actionSelected.fieldUrl];

        }else if(actionSelected.type === 'omniscript'){

            this.omniscriptModalLabel = actionSelected.label;
            this.prefill.ContextId = record[actionSelected.fieldOmni];

            // Passing Pubsub Channnel Name to OS
            if(actionSelected.omniType == "editSubGroup" || actionSelected.omniType == "editSubscriber") {
                this.prefill.vlocEvents = 'QE_FcMemberGroupDetails';
            }
            if(actionSelected.omniType == "editDependent" || actionSelected.omniType == "deleteDependent") {
                this.prefill.vlocEvents = 'QE_FcMemberDependentList';
            }

            // Checking From BA
            console.log('this.isBA -------' +this.isBA);
            this.prefill.FromBA = this.isBA ? 'Yes' : null;

            this.omnis[actionSelected.omniType] = true;
            this.template.querySelector(".vloc-ins-omni-modal").openModal();
        } else if(actionSelected.type === 'flexcard') {
            this.omnis[actionSelected.cardType] = true;
            this.recordIdCard = record[actionSelected.fieldCard];
            console.log('recordIdCard '+this.recordIdCard);
            this.template.querySelector(".vloc-ins-omni-modal").openModal();
        } else if(actionSelected.type === "ViewDependents"){

            let tempData = this.records[rowIndex] && this.records[rowIndex].DepSpan ? this.records[rowIndex].DepSpan : [];
            this.dataDepSpan = tempData.map(d => ({...d, StartDateText: d.StartDate ? moment(d.StartDate,"YYYY-MM-DD").format("MM/DD/YYYY") : "", EndDateText: d.EndDate ?moment(d.EndDate,"YYYY-MM-DD").format("MM/DD/YYYY") : ''}))
            this.depModSpan = this.dataDepSpan.length == 0? true: false;
            this.openDependentsModal()
        } else if(actionSelected.type === "ProductDetail"){
            let productId = record[actionSelected.field];
            this.isLoaded = false;
            let requestProduct = {
                type: "ApexRemote",
                value: {
                  className: "InsProductService",
                  methodName: "getCoverages",
                  inputMap: "{}",
                  optionsMap: JSON.stringify({productId})
                }
              };
              console.log('requestProdcut: ' + JSON.stringify(requestProduct));
            util.getDataHandler(JSON.stringify(requestProduct))
            .then(result => {
                let ipResult = JSON.parse(result);
                console.log('ipResult: ' + JSON.stringify(ipResult));
                if(ipResult && ipResult.records.length > 0) {
                    console.log(ipResult)
                    this.openProductModal({products: ipResult.records})
                }
            });
        }
    }
    openDependentsModal(){
        this.template.querySelector(".vloc-ins-deps-modal").openModal();

    }
    openProductModal(payload) {
        const isCart = (payload.isCart === 'true' || payload.isCart === true);
        this.isEditable = payload.isEditable;
        this.modalTitle = 'View';
        this.hideHeader = payload.products.length === 1;
        this.hideFooter = !isCart;
        this.compareLimit = payload.compareLimit;
        this.selectBtnFn = payload.selectBtnFn;
        this.products = JSON.parse(JSON.stringify(payload.products))

        if (this.hideHeader) {
            this.product = this.products[0];
            this.modalTitle =  this.product.Name;
            this.price = this.product.Price || 0;
        }
        this.template.querySelector(".vloc-ins-product-modal").openModal();
        this.isLoaded = true;


    }
    formatData(products) {
        return products.map(product => {
            const tempProduct = dataFormatter.deserializeHelper({ ...product }, 'childProducts');
            // tempProduct.priceNote = '/' + this.labels.InsMonthAbrv;
            if (tempProduct.childProducts && tempProduct.childProducts.records) {
                tempProduct.childProducts.records = tempProduct.childProducts.records.reduce((acc, childProd) => {
                    const type = dataFormatter.getNamespacedProperty(childProd, 'RecordTypeName__c');
                    if (!this.hiddenRecordTypes[type]) {
                        childProd.hidePrice = true;
                        acc.push(childProd);
                    }
                    return acc;
                }, []);
            }
            return tempProduct;
        });
    }
    closeModal(){
        Object.keys(this.omnis).forEach(k => {
            this.omnis[k] = false;
        });
        this.prefill = {};
        this.template.querySelector(".vloc-ins-omni-modal").closeModal();


    }
    changePageSize(ev) {
        this.pagesize = ev.detail.value;
      //  this.updateRecordsApexRemote(null);
        this.handleRecords(true, true);
    }

    showRowDetails(row) {
        this.record = row;
    }
    render() {
        return templ;
    }

    initColumn(ev) {
        console.log('Init column');
        console.log('initColumn ev: ' + JSON.stringify(ev));
        this.selectableObj = [],
        "string" == typeof ev && (ev = this.validObj(ev)),
        this.dataColumns = ev.map((el,index)=>{
            this.columnIndexObj[el.fieldName] = index,
            !0 !== el.searchable && "true" !== el.searchable || this.searchFields.push(el.fieldName),
            !0 !== el.editable && "true" !== el.editable || (this.isTableEditable = !0),
            "date" !== el.type && "datetime" !== el.type || !el.format || (this.dateObj[el.fieldName] = el.format),
            !0 !== el.userSelectable && "true" !== el.userSelectable || this.initUserSelectableCol(el);
            let a = void 0 === el.visible || !0 === el.visible || "true" === el.visible;
            return a && this.visibleColumns.push(el.fieldName),
            Object.assign(Object.assign({}, el), {}, {
                id: el.id || this.uniqueKey(),
                editable: "true" === el.editable || !0 === el.editable,
                sortable: "true" === el.sortable || !0 === el.sortable,
                visible: a,
                type: el.type && -1 !==  ["checkbox", "currency", "date", "datetime", "email", "number", "percent", "text", "textarea", "url", "icon", "phone"].indexOf(el.type) ? el.type : "text",
                showUserSelectableColumn: el.showUserSelectableColumn || 0 === index && this._userSelectableRow && this._hideExtraColumn
            })
        }
        ),
        this.dynamicColumns = [...this.dataColumns],
        this.handleRecords()
    }

    goToMyPageEvent(e, pageNum) {
        console.log('made it to goToMyPageEvent');
        try{
            this.updateRecordsApexRemote(e.target.dataset.index);
            this.goToPage(e, pageNum);
        }catch(ex){console.log('ex: ' + ex);}

    }

    //any pageNum, can be prev, next or Int of page to go to
    updateRecordsApexRemote(pageNum) {
        console.log('made it to updateRecordsApexRemote');
        let newOffset = this.currentPage;
        if(pageNum === 'prev_STAR' && newOffset > 0) {
            newOffset--;
        }
        else if(pageNum === 'next_STAR2') {
            newOffset++;
        }
        else if(pageNum !== 'prev_STAR' && pageNum !== 'next_STAR' && pageNum != null) {
            newOffset = parseInt(pageNum, 10) - 1;
        }
        console.log('newOffset: ' + newOffset);
        var params = JSON.stringify({
            type: "apexremote",
            value: {
              className: "QE_FcGroupMembersBATableService",
              methodName: "getRecords",
              inputMap: JSON.stringify({OffSet: newOffset, Limit: this.pagesize, GroupId: this.recordId}),
              optionsMap: JSON.stringify({})
            }
          });
        util
        .getDataHandler(params)
        .then(response => {
            console.log('params: ' + JSON.stringify(params));
            console.log('my apex response: ' + JSON.stringify(response));
            let res = JSON.parse(response);
            this.records = Array.isArray(res.result) ? res.result: [res.result];

            let recVAlue = this.records[0].Id == "REC0" && this.records[0].originalIndex == "0"? true : false;
            if(this.records.length > 0 && recVAlue) {
                this.isnotEmpty = false;
            } else {
                this.isnotEmpty = true;
            }

            this.handleRecords();
        })
        .catch(error => {
            console.log('Error geting records  error --> ' + error);
        })

    }

    clearSearchHandler(event)
    {
       this.searchTracker ="";
       this.newSearchKeyChangeHandler(event);
    }

    storeSearchKey(event)
    {
        this.searchTracker = event.target.value;
        if( !this.searchTracker)
        { 
            this.newSearchKeyChangeHandler(event);
        }
    }


    getSearchParams()
    {


         if( this.recordMore)
        {
            let f_record = JSON.parse(this.recordMore);

            
            let params =null;
            if( f_record.type=="IntegrationProcedures")
            {

               
                if(f_record.chkSearch )
                {
                    
                    f_record.value.inputMap[ f_record.chkSearchProp] = this.searchTracker;
                    if( !f_record.value.inputMap.FindByName)
                        f_record.value.inputMap.FindByName =true; //Allow search

                    params ={
                        type: 'IntegrationProcedures',
                        value:{
                            inputMap:  f_record.value.inputMap,                            
                            ipMethod: f_record.bundleName,
                        },
                        options: f_record.value.optionsMap,
                    };
                }
            }else
            {
                     params = {
                        type : "Dataraptor",
                        value : {
                            bundleName : f_record.bundleName,
                            inputMap :f_record.value.inputMap ,
                            optionsMap : "{}"
                        }
                    };
            }

            return params;

        }

        return null;
          
    }

    newSearchKeyChangeHandler(event) {
        try{
            window.clearTimeout(this.delaySearchTimeout);
            
            const searchKey = this.searchTracker;//event.target.value;
            this.searchInput = searchKey;
            this.isLoaded = false;
            this.currentPage = 0;
            this.noRecords = true;
            let foundRecord = false;
            this.tableData = [];

            
            
            //console.log('allData: ' + JSON.stringify(this.allData));
            //console.log('searchKey: ' + searchKey);        
            //console.log('tableArray: ' + JSON.stringify(tableArray));            
            
            this.delaySearchTimeout = setTimeout(() => {
                if(this.searchInput) {
                    this.showMoreControls = false;
                    //let tableArray = lodash.cloneDeep(this.allData);
                    console.log('searching');
                    this.allData.forEach(item => {
                        let columns = item.columns.filter(col => col.fieldName === 'Name');
                        //console.log('columns: ' + JSON.stringify(columns));
                        columns.forEach(col => {
                            let value = col.data.value;
                            //console.log('value: ' + value);
                            value = !!value ? value.toString() : '';
                            if(value && value.toLowerCase().includes(searchKey.toLowerCase())) {
                                console.log('item: ' + JSON.stringify(item));
                                this.noRecords = false;
                                this.tableData.push(item);
                                foundRecord = true;
                            }
                        });
                    });

                    if(this.recordMore)
                    {
                        //Check IP Conditions
                        let params = this.getSearchParams();
                        console.log("S Params: " + JSON.stringify(params));
                        if(params)
                        if(this.tableData.length == 0 && !foundRecord) {
                            this.isLoaded = false;
                            console.log('made it here');
                            //Call IP here, if IP returns nothing then execute the line below, otherwise push each contact from the IP to this.tableData                           
                          
                            util
                            .getDataHandler(JSON.stringify(params))
                            .then(response => {
                                console.log('response: ' + JSON.stringify(response));
                                var result = JSON.parse(response);
                                var newRecords = Array.isArray(result.IPResult) ? result.IPResult : [result.IPResult];
                                newRecords = newRecords.filter(p => p.hasOwnProperty('Id'));
                                this.noRecords = newRecords.length > 0;
                                
                                if(newRecords.length > 0) {
                                    console.log('updating records');
                                    this.recordsFoundFromSearch = newRecords;
                                    this.records = [...this.records, ...newRecords];
                                }
                                
                                console.log('newRecords: ' + JSON.stringify(newRecords));
                                console.log('new tableData: ' + JSON.stringify(this.tableData));
                                console.log('this.records: ' + JSON.stringify(this.records));
                                this.setUnGroupedTable(this.tableData);
                                this.isLoaded = true;
                            })
                            .catch(error => {
                                console.log('Error calling IP error: ' + error);
                            });
                        } //End IP conditions
                    } //if searchmore

                } //if search Input
                 else {
                    this.showMoreControls = this.IsNoMoreRecord ? false : true;
                    if(this.recordsFoundFromSearch.length > 0) {
                        //remove the records imported from the search to not interfere with correctly grabbing new records
                        if(this.recordsFoundFromSearch.length > 0){
                            this.records = this.records.filter(item => {
                                return !this.recordsFoundFromSearch.find(searchItem => {
                                return searchItem.Id === item.Id;
                                });
                            });
                            this.recordsFoundFromSearch = [];
                        }
                    }
                    this.tableData = lodash.cloneDeep(this.allData);
                    this.noRecords = false;
                } //else search input
                this.setUnGroupedTable(this.tableData);
                Promise.resolve().then(() => {
                    this.isLoaded = true;
                  });
                //tableArray = null;
            }, 500);
            
        }catch(e) {console.log('newSearchKeyChangeHandler error: ' + e);}
        
    }

    //End of new Search

    
    handleRecordsComplete() {
        
        let recordData = this.recordMore ? JSON.parse(this.recordMore) : '';
        
        
        if(recordData && recordData.type && recordData.approach && recordData.userProfile) {
            //Prevent the other embedded LWC in the FlexCard from retrieving more records
            let currProfile = recordData.userProfile;
            if(recordData.userProfile == 'Benefit Admin Manager') {currProfile = 'Benefit Admin';}
            if(recordData.userProfile == 'Broker Admin') {currProfile = 'Broker';}

            if(currProfile && recordData.chkProfile && recordData.chkProfile == currProfile) {

                //for testing apex class
                //recordData.approach = 'step';
                //recordData.type = 'ApexRemote';

                this.isLoaded = !this.retrieveMoreRecords;
                

                if(this.retrieveMoreRecords && recordData.approach == 'bulk') {
                    if(recordData[recordData.type] && recordData[recordData.type].value && recordData[recordData.type].value.inputMap && recordData[recordData.type].value.optionsMap){
                        
                        this.retrieveMoreRecords = (parseInt(recordData[recordData.type].value.inputMap.Limit) <= this.records.length);
                        
                        if(this.retrieveMoreRecords) {
                            this.retrieveMoreRecords = false;
                            this.isLoaded = true;

                            recordData[recordData.type].value.inputMap.InitialLoad = false;
                            //recordData[recordData.type].value.optionsMap.queueableChainable = true;

                            const params = recordData[recordData.type];
                            console.log('params: ' + JSON.stringify(params));

                            util.getDataHandler(JSON.stringify(params))
                            .then(response => {
                                console.log('response: ' + JSON.stringify(response));
                                let result = JSON.parse(response);
                                if(result.IPResult && Array.isArray(result.IPResult) && result.IPResult.length > 0 && result.IPResult[0].hasOwnProperty('Id')){
                                    this.records = result.IPResult;
                                }
                                else if(result.IPResult && !Array.isArray(result.IPResult)){
                                    result = [result.IPResult];
                                    if(result.length > 0 && result[0].hasOwnProperty('Id')) {
                                        this.records = result;
                                    }
                                    else { this.useStepApproach(); }
                                }
                                else { this.useStepApproach(); }
                            })
                            .catch(error => {
                                console.log('error calling ' + recordData.type + ': '+ JSON.stringify(error));
                                this.useStepApproach();
                            });
                        }
                    }
                }
                else if(this.retrieveMoreRecords && recordData.approach == 'step') {
                    
                    //if( recordData.value.inputMap.FindByName){recordData.value.inputMap.FindByName =false;} //Stop search

                    if(recordData[recordData.type] && recordData[recordData.type].value && recordData[recordData.type].value.inputMap && recordData[recordData.type].value.inputMap[recordData.ChkFieldName] && recordData.StatusList && recordData.startIndex) {
                        //Prepare the next  call based on their Status and Name
                        const statusList = Array.isArray(recordData.StatusList) ? recordData.StatusList : [recordData.StatusList];
                        //set initial status search
                        if(!this.statusIndex) {
                            this.statusIndex = this.records.length > 0 && this.records[this.records.length - 1].hasOwnProperty('Status') ? statusList.findIndex(p => p == this.records[this.records.length - 1].Status) : parseInt(recordData.startIndex);
                        }
                        this.checkName = this.resetCheckName || this.records.length == 0 || !this.records[this.records.length - 1].hasOwnProperty(recordData.ChkOutputField) ? '!' : this.records[this.records.length - 1][recordData.ChkOutputField];
                        
                        recordData[recordData.type].value.inputMap[recordData.ChkFieldName] = recordData.trimmedName ? this.checkName.replaceAll(' ', '') : this.checkName;
                        recordData[recordData.type].value.inputMap.Status = statusList[this.statusIndex];


                        //initColumns calls handleRecords which calls this method causing us to potentially do the same IP call again, this check prevents this
                        let alreadySearched = this.searchedRecords.includes(this.checkName + statusList[this.statusIndex]);
                        if(!alreadySearched) {
                            this.searchedRecords.push(this.checkName + statusList[this.statusIndex]);
                            console.log('searching for: ' + recordData[recordData.type].value.inputMap[recordData.ChkFieldName] + ' on status: ' + recordData[recordData.type].value.inputMap.Status + ' [Status: ' + this.statusIndex + ' of ' + statusList.length + ' Completed]');

                            const params = recordData[recordData.type];
                            util.getDataHandler(JSON.stringify(params))
                            .then(response => {
                                let result = JSON.parse(response);
                                let newRecords = [];

                                //process the response based on how we are retrieving records
                                if(recordData.type == 'IntegrationProcedures') {
                                    if(result.IPResult && Array.isArray(result.IPResult)){newRecords = result.IPResult;}
                                    if(result.IPResult && !Array.isArray(result.IPResult)){newRecords = [result.IPResult];}
                                    newRecords = newRecords.filter(p => p.hasOwnProperty('Id'));//remove IP's default empty result
                                }
                                else {
                                    if(result.result && Array.isArray(result.result)){newRecords = result.result;}
                                    if(result.result && !Array.isArray(result.result)){newRecords = [result.result];}
                                }
                                this.resetCheckName = false;
                                    
                                this.retrieveMoreRecords = (parseInt(recordData[recordData.type].value.inputMap.Limit) <= newRecords.length);
                                //this.retrieveMoreRecords = false; //only run once for testing
                                //this.retrieveMoreRecords = (300 <= newRecords.length); //do not have to de-activate FC everytime for testing

                                //check if we can retrieve by next status
                                if(!this.retrieveMoreRecords && this.statusIndex < (statusList.length - 1)) {
                                    this.statusIndex++;
                                    this.retrieveMoreRecords = true;
                                    this.resetCheckName = true;
                                }

                                if(newRecords.length > 0) {
                                    //bounce out already retrieved records
                                    let index = this.records.length - 1;
                                    let hasSameName = index >= 0 && this.records[index].hasOwnProperty(recordData.chkSearchKey);
                                    let sameNamesArray = [];
                                    while (hasSameName) {
                                        this.records[index][recordData.chkSearchKey] == recordData[recordData.type].value.inputMap[recordData.ChkFieldName] ? sameNamesArray.push(this.records[index]) : hasSameName = false;
                                        index > 0 ? index-- : hasSameName = false;
                                    }
                                    //console.log('sameNamesArray: ' + JSON.stringify(sameNamesArray));
                                    if(sameNamesArray.length > 0) {
                                        newRecords = newRecords.filter(item => {
                                            return !sameNamesArray.find(searchItem => {
                                                return searchItem[recordData.LookupField] == item[recordData.LookupField];
                                            });
                                        });
                                    }
                                    
                                    //update records, if the initial retrieval (from FlexCard Setup) didn't find members then don't use them.
                                    //also let the table know it is not empty                                
                                    if(this.records.length == 1 && !this.records[0].hasOwnProperty(recordData.chkSearchKey)){
                                        this.records = [...newRecords];
                                        this.isnotEmpty = true;
                                    }
                                    else {
                                        this.records = [...this.records, ...newRecords];
                                    }                                
                                }
                                else {//last run found nothing try again
                                    this.handleRecords();
                                }
                            })
                            .catch(error => {
                                console.log('error calling ' + recordData.type + ': '+ JSON.stringify(error));
                            });
                        }
                    }
                }
                else {
                    console.log('Handle Records Complete! [' + this.records.length + ' records]');
                }
            }
        }
    }
    useStepApproach() {
        console.log('switching to step approach');
        let recordData = JSON.parse(this.recordMore);
        this.retrieveMoreRecords = true;
        recordData.type = 'ApexRemote';
        recordData.approach = 'step';
        this.recordMore = JSON.stringify(recordData);
        this.handleRecords();
    }
}