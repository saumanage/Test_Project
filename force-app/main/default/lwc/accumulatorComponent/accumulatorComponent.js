import { LightningElement, api } from 'lwc';
import{
    FlowNavigationNextEvent
}from "lightning/flowSupport";

export default class AccumulatorComponent extends LightningElement {
    @api accumulatorData;
    @api chosenAccum;
    @api fromDate;
    @api thruDate;
    @api availableActions = [];

    deductibleData = [];
    inMOOPData = [];
    outMOOPData = [];
    benefitData = [];
    activeSections = [];
    connectedCallback() {
        this.handleInput(this.accumulatorData);
    }
    //handle and transform input data
    handleInput(data) {
        this.accumulatorData=null;
        console.log(data);
        //const myArr = JSON.parse(data);
        let myArr = JSON.parse(data);
        console.log(myArr);
        console.log('myArr' + myArr);
        console.log(myArr.length);
        let inDecuctibleTier = 1;
        let outDeductibleTier = 1;
        let inMoopTier = 1;
        let outMoopTier = 1;
        for (let x = 0; x < myArr.length; x++) {
            let obj = myArr[x];
            console.log('member limit ' + obj.memLimit);
            if (obj.colHead.toUpperCase() == 'DEDUCTIBLE') {
                console.log('network:' + obj.netWork);
                if (obj.benefitDescription.toUpperCase().includes("MEDICARE") || obj.netWork == ('I') || obj.netWork == ('B')) {
                    this.setUpInNetworkDeductible(obj, inDecuctibleTier);
                    inDecuctibleTier++;
                } else if (obj.netWork === ('O')) {
                    this.setUpOutNetworkDeductible(obj, outDeductibleTier);
                    outDeductibleTier++;
                }
            }
            else if (obj.colHead.toUpperCase() == 'OUT OF NETWORK MOOP'||(obj.colHead=='Maxout' && obj.netWork==('O'))) {
                this.setUpOutNetworkMOOP(obj, outMoopTier);
                outMoopTier++;
            }
            else if (obj.colHead.toUpperCase() == 'IN NETWORK MOOP'|(obj.colHead=='Maxout' && (obj.netWork==('I')||obj.netWork==('B')))) {
                this.setUpInNetworkMOOP(obj, inMoopTier);
                inMoopTier++;
            }
            else if (obj.colHead.toUpperCase() == 'BENEFIT MAX LIMITS' || obj.colHead == 'LIFETIME MAX') {
                this.setUpBenefitMaxLimits(obj);
            }
            console.log('active section ' + this.activeSections);
        }
    }
    //caculate the remaining = limit - amount
    calculateRemaining(limit, amount) {
        if (limit > 0.0 && amount > 0.0) {
            console.log('Limit and amount');
            let modifiedLimit = limit.replace('$', '').replace(',', '');
            let modifiedAmount = amount.replace('$', '').replace(',', '');
            let dollarUS = Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            });
            let remaining = modifiedLimit - modifiedAmount;
            return dollarUS.format(remaining);
        }
        else if(limit > 0.0){
            let modifiedLimit = limit.replace('$', '').replace(',', '');
            let dollarUS = Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            });
            return dollarUS.format(modifiedLimit);
        }
        return;
    }
    //handle the in network deductible section
    setUpInNetworkDeductible(decuctibleInput, tier) {
        console.log('deductible ' + decuctibleInput.colHead);
        console.log('tier ' + tier);
        let existingDeductible = this.deductibleData.find(obj => {
            return obj.label === 'Deductible (Tier ' + tier + ')'
        });
        let objectWithNewFields = {
            'q4CarryoverAmount': decuctibleInput.q4CarryoverAmount,
            'IndividualInNetworkLimit': decuctibleInput.memLimit,
            'IndividualInNetworkApplied': decuctibleInput.memAmount,
            'IndividualInNetworkRemaining': this.calculateRemaining(decuctibleInput.memLimit, decuctibleInput.memAmount),
            'FamilyInNetworkLimit': decuctibleInput.famLimit,
            'FamilyInNetworkApplied': decuctibleInput.famAmount,
            'FamilyInNetworkRemaining': this.calculateRemaining(decuctibleInput.famLimit, decuctibleInput.famAmount),
            'thruDate':decuctibleInput.thruDate,
            'fromDate':decuctibleInput.fromDate,
            'InNetwork':true,
            'OutNetwork':false
        }
        if (existingDeductible == null) {
            //objectWithNewFields.name = 'Deductible'+this.countSection;
            objectWithNewFields.label = 'Deductible (Tier ' + tier + ')';
            this.deductibleData.push(objectWithNewFields);
            this.activeSections.push(objectWithNewFields.label);
        } else {
            Object.assign(existingDeductible, objectWithNewFields);
        }
    }
    //handle the out network deductible section
    setUpOutNetworkDeductible(decuctibleInput, tier) {
        console.log('out of deductible ' + decuctibleInput.colHead);
        //check if this tier exists or not
        let existingDeductible = this.deductibleData.find(obj => {
            return obj.label === 'Deductible (Tier ' + tier + ')'
        });
        let objectWithNewFields = {
            'IndividualOutNetworkLimit': decuctibleInput.memLimit,
            'IndividualOutNetworkApplied': decuctibleInput.memAmount,
            'IndividualOutNetworkRemaining': this.calculateRemaining(decuctibleInput.memLimit, decuctibleInput.memAmount),
            'FamilyOutNetworkLimit': decuctibleInput.famLimit,
            'FamilyOutNetworkApplied': decuctibleInput.famAmount,
            'FamilyOutNetworkRemaining': this.calculateRemaining(decuctibleInput.famLimit, decuctibleInput.famAmount),
            'OutNetworkCarryoverAmount': decuctibleInput.q4CarryoverAmount,
            'thruDate':decuctibleInput.thruDate,
            'fromDate':decuctibleInput.fromDate,
            'InNetwork':false,
            'OutNetwork':true
        }
        if (existingDeductible == null) {
            //objectWithNewFields.name = 'Deductible'+this.countSection;
            objectWithNewFields.label = 'Deductible (Tier ' + tier + ')';
            this.deductibleData.push(objectWithNewFields);
            this.activeSections.push(objectWithNewFields.label);
        } else {
            Object.assign(existingDeductible, objectWithNewFields);
        }
    }
    //set up the out of Nework MOOP section
    setUpOutNetworkMOOP(outNeworkMoop, tier) {
        console.log('setup out network moop');
        let object = {
            //'name':'Out of Network MOOP'+this.countSection,
            'label': 'Out of Network MOOP (Tier ' + tier + ')',
            'IndividualOutNetworkLimit': outNeworkMoop.memLimit,
            'IndividualOutNetworkApplied': outNeworkMoop.memAmount,
            'IndividualOutNetworkRemaining': this.calculateRemaining(outNeworkMoop.memLimit, outNeworkMoop.memAmount),
            'FamilyOutNetworkLimit': outNeworkMoop.famLimit,
            'FamilyOutNetworkApplied': outNeworkMoop.famAmount,
            'FamilyOutNetworkRemaining': this.calculateRemaining(outNeworkMoop.famLimit, outNeworkMoop.famAmount),
            'thruDate':outNeworkMoop.thruDate,
            'fromDate':outNeworkMoop.fromDate,
            'InNetwork':false,
            'OutNetwork':true
        }
        this.outMOOPData.push(object);
        this.activeSections.push(object.label);
    }
    //set up the in network MOOP section
    setUpInNetworkMOOP(inNeworkMoop, tier) {
        console.log('setup in network moop');
        let object = {
            //'name': 'In Network MOOP'+this.countSection,
            'label': 'In Network MOOP (Tier ' + tier + ')',
            'IndividualInNetworkLimit': inNeworkMoop.memLimit,
            'IndividualInNetworkApplied': inNeworkMoop.memAmount,
            'IndividualInNetworkRemaining': this.calculateRemaining(inNeworkMoop.memLimit, inNeworkMoop.memAmount),
            'FamilyInNetworkLimit': inNeworkMoop.famLimit,
            'FamilyInNetworkApplied': inNeworkMoop.famAmount,
            'FamilyInNetworkRemaining': this.calculateRemaining(inNeworkMoop.famLimit, inNeworkMoop.famAmount),
            'thruDate':inNeworkMoop.thruDate,
            'fromDate':inNeworkMoop.fromDate,
            'InNetwork':true,
            'OutNetwork':false
        }
        this.inMOOPData.push(object);
        this.activeSections.push(object.label);
    }
    //set up the Benefit Max Limits section
    setUpBenefitMaxLimits(benefit) {
        console.log('setup benefit');
        let object = {
            'label': 'Benefit Max Limits' + benefit.benefitTitle,
            'BenefitTitle': benefit.benefitTitle,
            'BenefitDescription': benefit.benefitDescription,
            'BenefitLimit': benefit.memLimit,
            'BenefitApplied': benefit.memAmount,
            'BenefitRemaining': this.calculateRemaining(benefit.memLimit, benefit.memAmount),
        }
        this.benefitData.push(object);
        this.activeSections.push(object.label);
    }
     handleRadio(event){
        this.chosenAccum=event.target;
        let tier=this.chosenAccum.value.replace(/\D/g, '');
        this.chosenAccum=event.target.value+' '+event.target.id;
        if(this.chosenAccum.includes("Deductible")){
            this.fromDate=this.deductibleData[tier-1].fromDate;
            this.thruDate=this.deductibleData[tier-1].thruDate;
        }
        else if(this.chosenAccum.includes("Out of Network MOOP")){
            this.fromDate=this.maxOutData[tier-1].fromDate;
            this.thruDate=this.maxOutData[tier-1].thruDate;
        }
        else if(this.chosenAccum.includes("In Network MOOP")){
            this.fromDate=this.inMOOPData[tier-1].fromDate;
            this.thruDate=this.inMOOPData[tier-1].thruDate;
        }
        else if(this.chosenAccum.includes("Benefit Max Limits")){
            this.fromDate=this.benefitData.fromDate;
            this.thruDate=this.benefitData.thruDate;
        }
        console.log(this.chosenAccum);
        console.log(tier);
        console.log(this.fromDate);
        console.log(this.thruDate);
    }
    checkIn(net){
        if(net == ('I') || obj.netWork == ('B')){
            return true;
        }
        return false;
    }
    handleNext(){
        if(this.checkChecked()){
            let navigationNextEvent=new FlowNavigationNextEvent();
            this.dispatchEvent(navigationNextEvent);
        }
    }
    checkChecked(){
        console.log('Here');
        var elements=this.template.querySelectorAll('input:checked');
        console.log(elements.length);
        if(elements.length>0){
            return true;
        }
        return false;
    }
}