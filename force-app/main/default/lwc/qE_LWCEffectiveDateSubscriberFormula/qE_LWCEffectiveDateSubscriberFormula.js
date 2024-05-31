import { api, LightningElement, track } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';
import templ from "./qE_LWCEffectiveDateSubscriberFormula.html";
import moment from "vlocity_ins/dayjs";
import pubsub from 'vlocity_ins/pubsub';

export default class QE_LWCEffectiveDateSubscriberFormula extends OmniscriptBaseMixin(LightningElement) {


    @track value;
    @track isreadonly;
    @track termDate;
    @track termEvent;
    @track contextId;
    @track labelName = "Effective Date";
    modifyEffectiveDate;

    // fields  INC1997642 -Rehire Flow
    @api assetExpireDate;
    @api contractEndDate;

    @api
    get userProfile() {
        return this._userProfile;
    }
    set userProfile(data) {
        this._userProfile = data;
        this.calculateReadOnly();
    }

    @api
    get fromFlow() {
        return this._fromFlow;
    }
    set fromFlow(data) {
        this._fromFlow = data;
        this.calculateReadOnly();
    }


    @api
    get termConfiguration() {
        return this._termConfiguration;
    }
    set termConfiguration(data) {
        this._termConfiguration = data;
        this.calculateReadOnly();
        this.formulaEffectiveDate();
    }

    @api
    get terminationDetails() {
        return this._terminationDetails;
    }
    set terminationDetails(data) {
        /* this._terminationDetails = data == null || data == undefined ? '' : data;        
       if (this._terminationDetails != '') {
            this.termDate = this._terminationDetails.TerminationDate != null ? this._terminationDetails.TerminationDate : null;
            this.termEvent = this._terminationDetails.LifeEvent != null ? this._terminationDetails.LifeEvent : null;
            this.formulaEffectiveDate();
            this.calculateReadOnly();
        }*/
    }
   /* 
    get termDate() {
        return this._termDate;
    }
    set termDate(data) {
        this._termDate = data;
        console.log('>>this._termDate>>'+this._termDate);
        this.calculateReadOnly();
        this.formulaEffectiveDate();
    }
    
    get termEvent() {
        return this._termEvent;
    }
    set termEvent(data) {
        this._termEvent = data;
        console.log('>>this._termEvent>>'+this._termEvent);
        this.calculateReadOnly();
    } */

    @api
    get fundingType() {
        return this._fundingType;
    }
    set fundingType(data) {
        this._fundingType = data;
        this.calculateReadOnly();
    }

    @api
    get marketSegment() {
        return this._marketSegment;
    }
    set marketSegment(data) {
        this._marketSegment = data;
        this.calculateReadOnly();
    }

    @api
    get currentEffectiveDate() {
        return this._currentEffectiveDate;
    }
    set currentEffectiveDate(data) {
        this._currentEffectiveDate = data;
    }

    @api
    get terminationDate() {
        return this._terminationDate;
    }
    set terminationDate(data) {
        this._terminationDate = data;
    }


    @api
    get terminationEffectiveDate() {
        return this._terminationEffectiveDate;
    }
    set terminationEffectiveDate(data) {
        this._terminationEffectiveDate = data;
    }
    
    @api
    get assetEffectiveDate() {
        return this._assetEffectiveDate;
    }
    set assetEffectiveDate(data) {
        this._assetEffectiveDate = data;
    }

    @api
    get rehireRule() {
        return this._rehireRule;
    }
    set rehireRule(data) {
        this._rehireRule = data;
        this.formulaEffectiveDate();
    }

    @api
    get hireDate() {
        return this._hireDate;
    }
    set hireDate(data) {
        this._hireDate = data;
        
        this.formulaEffectiveDate();
    }
    @api
    get following() {
        return this._following;
    }
    set following(data) {
        this._following = data;
        
        this.formulaEffectiveDate();
    }
    @api
    get hireNumberDays() {
        return this._hireNumberDays;
    }
    set hireNumberDays(data) {
        this._hireNumberDays = data;
        
        this.formulaEffectiveDate();
    }
    @api
    get hireStartOn() {
        return this._hireStartOn;
    }
    set hireStartOn(data) {
        this._hireStartOn = data;
        
        this.formulaEffectiveDate();
    }

    changeDate(e) {
        console.log(e.target.value)
        this.value = e.target.value;
        this.omniApplyCallResp({ EffectiveDate: this.value });
        this.omniUpdateDataJson({ EffectiveDate: this.value });
    }

    calculateReadOnly() {       
        if (this.fromFlow === 'Terminate') {
            console.log('In Readonly this.termEvent' + this.termEvent);
            this.labelName = "Coverage End Date";
            this.isreadonly = ( this.modifyEffectiveDate == true || this.termEvent === 'Other/Correction' || this.fundingType === 'Self Funded' ? false : true);
        } else {
            this.isreadonly = (this.userProfile === 'System Administrator' || this.userProfile === 'Base Profile' ? false : (this.marketSegment === 'Large Group' || moment(this.value).isBefore(moment())? false : true));
            console.log(' moment(this.value).isBefore(moment():'+ moment(this.value).isBefore(moment()));
        }
    }

    connectedCallback() {
        console.log('connectedCallback !!');
        this.handleJsonUpdate();
        pubsub.register('nwOsMsgBus',  { omniJsonUpdated : this.handleJsonUpdate.bind(this)});
    }
    
    handleJsonUpdate(){
        const self = this;
        setTimeout(function(){ 
            //Andrew Vaughn added null check for termDate and termEvent, was throwing errors and interfering with other things.
            self.termDate = self.omniJsonData.TerminationDetails && self.omniJsonData.TerminationDetails.TerminationDate ? self.omniJsonData.TerminationDetails.TerminationDate : '';  
            self.termEvent = self.omniJsonData.TerminationDetails && self.omniJsonData.TerminationDetails.LifeEvent ? self.omniJsonData.TerminationDetails.LifeEvent : '';
            self.contextId = self.omniJsonData.ContextId;
            self.userProfile = self.omniJsonData.userProfile;
            self.fundingType = self.omniJsonData.AccountFundingType;
            self.marketSegment = self.omniJsonData.AccountMarketSegment;
            self.termConfiguration = self.omniJsonData.AccountTermConfig;
            self.modifyEffectiveDate = self.omniJsonData.modifyEffectiveDate;
            self.fromFlow = self.omniJsonData.fromFlow;
            self.formulaEffectiveDate();
            self.calculateReadOnly();
        }, 100);
    }

    formulaEffectiveDate() {
        let momentValue = this.calculate();
        let jsonDataNode;
        if (momentValue) {
            this.value = momentValue.format('YYYY-MM-DD');
            jsonDataNode = momentValue.format('YYYY-MM-DD');
            this.calculateReadOnly();
        }

        this.omniApplyCallResp({ EffectiveDate: jsonDataNode });
        this.omniUpdateDataJson({ EffectiveDate: jsonDataNode  });
    }

    calculate() {
        var hireDateday = moment(this.hireDate, 'YYYY-MM-DD').date();
        var IMUSWP = 'Immediately Upon Satisfaction of Wait Period';
        var FDOFM = '1st day of Month following';
        var FOM = '1st day of Month following Wait Period (date of hire if hired on FOM)';
        console.log("this.hireDate ::"+this.hireDate);
        console.log("this.hireDate ::"+this.following);
        console.log("this.hireStartOn ::"+this.hireStartOn);
        console.log("this.termConfiguration ::"+this.termConfiguration);
        console.log("this.termDate ::"+this.termDate);
        if (this.hireDate && this.following && this.hireStartOn) {
            console.log('Calculate Effective Hire In')
            if (this.rehireRule === null || this.rehireRule === '' || this.rehireRule === 'With a wait period') {
                if (this.following === 'Date of hire') {

                    if(this.hireStartOn === FDOFM ) //start of following month from hire date.
                        return moment(this.hireDate, 'YYYY-MM-DD').startOf('month').add(2, 'months');

                    //Immediately upon satisfaction
                    return  moment(this.hireDate, 'YYYY-MM-DD');

                        //return moment(this.hireDate, 'YYYY-MM-DD').startOf('month').add(1, 'month').add(this.hireNumberDays, 'days')                   
                } else if (this.following === 'Days of employment') {
                    if(this.hireStartOn === IMUSWP){
                        //change for february
                        let myHireDate = moment(this.hireDate, 'YYYY-MM-DD');

                        //30 day rule on february hire month
                        if(myHireDate.daysInMonth() <= 29 && myHireDate.date() === 1){
                            if (this.hireNumberDays && parseInt(this.hireNumberDays) < 60) {
                                return moment(this.hireDate, 'YYYY-MM-DD').startOf('month').add(1, 'months');
                            }
                            else if (this.hireNumberDays){
                                return moment(this.hireDate, 'YYYY-MM-DD').startOf('month').add(2, 'months');
                            }
                            
                        }
                        else if (myHireDate.daysInMonth() <= 29 && myHireDate.date() !== 1) {
                            if (this.hireNumberDays && parseInt(this.hireNumberDays) < 60) {
                                return moment(this.hireDate, 'YYYY-MM-DD').startOf('month').add(2, 'months');
                            }
                            else if (this.hireNumberDays){
                                return moment(this.hireDate, 'YYYY-MM-DD').startOf('month').add(3, 'months');
                            }
                        }
                        //60 day rule on january hire month
                        if(this.hireNumberDays  && myHireDate.month() === 0 && parseInt(this.hireNumberDays) === 60 ) {
                            if(myHireDate.date() === 1) {
                                return moment(this.hireDate, 'YYYY-MM-DD').startOf('month').add(2, 'months');
                            }
                            else {
                                return moment(this.hireDate, 'YYYY-MM-DD').startOf('month').add(3, 'months');
                            }
                            
                        }
                        return moment(this.hireDate, 'YYYY-MM-DD').add(this.hireNumberDays, 'days').add(1, 'days')
                    }else if((this.hireNumberDays > 0 || this.hireNumberDays != null|| this.hireNumberDays == 0 || this.hireNumberDays === null) && hireDateday == 1 && this.hireStartOn === FOM){
                        return moment(this.hireDate, 'YYYY-MM-DD')
                    }else if((this.hireStartOn != IMUSWP && this.hireStartOn != FOM)||((this.hireNumberDays > 0 || this.hireNumberDays != null || this.hireNumberDays == 0 || this.hireNumberDays === null) && hireDateday != 1 && this.hireStartOn === FOM)){
                        //change for february
                        let myHireDate = moment(this.hireDate, 'YYYY-MM-DD');
                        //30 day rule on february hire month
                        if(myHireDate.daysInMonth() <= 29 && myHireDate.date() === 1){
                            if (this.hireNumberDays && parseInt(this.hireNumberDays) < 60) {
                                return moment(this.hireDate, 'YYYY-MM-DD').startOf('month').add(1, 'months');
                            }
                            else if (this.hireNumberDays){
                                return moment(this.hireDate, 'YYYY-MM-DD').startOf('month').add(2, 'months');
                            }
                            
                        }
                        else if (myHireDate.daysInMonth() <= 29 && myHireDate.date() !== 1) {
                            if (this.hireNumberDays && parseInt(this.hireNumberDays) < 60) {
                                return moment(this.hireDate, 'YYYY-MM-DD').startOf('month').add(2, 'months');
                            }
                            else if (this.hireNumberDays){
                                return moment(this.hireDate, 'YYYY-MM-DD').startOf('month').add(3, 'months');
                            }
                        }
                        //60 day rule on january hire month
                        if(this.hireNumberDays  && myHireDate.month() === 0 && parseInt(this.hireNumberDays) === 60 ) {
                            if(myHireDate.date() === 1) {
                                return moment(this.hireDate, 'YYYY-MM-DD').startOf('month').add(2, 'months');
                            }
                            else {
                                return moment(this.hireDate, 'YYYY-MM-DD').startOf('month').add(3, 'months');
                            }
                            
                        }                   
                        return moment(this.hireDate, 'YYYY-MM-DD').add(this.hireNumberDays, 'days').startOf('month').add(1, 'month')
                    }
                }
            } else if (this.rehireRule === 'Without a wait period') {

                //moment(this.assetEffectiveDate, 'YYYY-MM-DD').add(1, 'day');
                  if( this.assetExpireDate)
                  {
                        let effDate = moment(this.assetExpireDate, 'YYYY-MM-DD').add(1, 'day');

                        if( this.contractEndDate && effDate.isAfter( moment(this.contractEndDate, 'YYYY-MM-DD') )  )
                        {
                            //if it after contract end date. send back current contract end date
                            return moment(this.contractEndDate, 'YYYY-MM-DD');
                        }   
                    
                        //no after contract end date
                        return effDate;

                  }

                return moment(this.hireDate, 'YYYY-MM-DD')
            } else if (this.rehireRule === 'No lapse in coverage') {
                if (this.terminationEffectiveDate != null && (moment(this.terminationEffectiveDate, 'YYYY-MM-DD').isAfter(moment(this.hireDate, 'YYYY-MM-DD')))) {
                    return moment(this.terminationEffectiveDate, 'YYYY-MM-DD').add(1, 'day')
                } else {
                    return moment(this.hireDate, 'YYYY-MM-DD')
                }
            } else if (this.rehireRule === 'Never terminated') {
                //console.log('Test>' + moment(this.assetEffectiveDate, 'YYYY-MM-DD').diff(moment(this.hireDate, 'YYYY-MM-DD'), 'days'))
                /*  if(moment(this.terminationEffectiveDate, 'YYYY-MM-DD').diff(moment(this.hireDate, 'YYYY-MM-DD'), 'days') == -1 ){
                      return moment(this.currentEffectiveDate, 'YYYY-MM-DD')
                  }else{
                      return moment(this.hireDate, 'YYYY-MM-DD')
                  } */
                return moment(this.assetEffectiveDate, 'YYYY-MM-DD')
            }
        }
        else if (this.termConfiguration && this.termDate) {
            var termEffDate;

            if(this.termEvent == 'Death of Subscriber' ){
                termEffDate = moment(this.termDate, 'YYYY-MM-DD');
                console.log("this.termEffDate ::"+termEffDate);
                return termEffDate;
            }
            else{
                switch (this.termConfiguration) {
                    case "End of Month": {
                        termEffDate = moment(this.termDate, 'YYYY-MM-DD').endOf('month');
                        break;
                    }
                    case "End of Month (Previous)": {
                        let dateofmonth = moment(this.termDate, 'YYYY-MM-DD').date();
                        termEffDate = dateofmonth > 15 ? moment(this.termDate, 'YYYY-MM-DD').endOf('month') : moment(this.termDate, 'YYYY-MM-DD').startOf('month').subtract(1, 'days');
                        break;
                    }
                    case "Date Of": {
                        termEffDate = moment(this.termDate, 'YYYY-MM-DD');
                        break;
                    }
                }
                console.log("this.termEffDate ::"+termEffDate);
                return termEffDate;
            }
        }
    }
    render() {
        return templ;
    }
}