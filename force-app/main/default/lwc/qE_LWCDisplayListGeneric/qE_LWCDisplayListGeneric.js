import { LightningElement, track, api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';
import templ from "./qE_LWCDisplayListGeneric.html";

export default class qE_LWCDisplayListGeneric extends OmniscriptBaseMixin(LightningElement) {
    
    @track selectedRows = [];
    @track columnsToJson =[];
    @track tableDataJson = []

    @api hideCheck = false;
    @api nodeData;
    @api showCoverageDates;
    @api tableData;

    @api
    set columns(data){
        
        try{
            let columns = data.split(",");
            columns.forEach(col => {
                this.columnsToJson.push({ label: col, fieldName: col, hideDefaultActions: true });

            })
        }catch(e){
            console.error('Error trying to set columns', e)
        }
    }
    get columns(){
        return this.columnsToJson;
    }
    
    connectedCallback() {
        console.log('Connedted callback');
        console.log('Connedted callback', JSON.stringify(this.omniJsonData.DependentInfo));
        console.log('Connedted callback', JSON.stringify(this.omniJsonData));
        console.log('tableDataJson', JSON.stringify(this.tableDataJson));
        this.setTableData();
        this.getBaseUrl();
        this.setSubGroupNumber();
        this.calculateEndDate();
    }

    calculateEndDate() {
        if((this.omniJsonData.UpdatePlans && !this.omniJsonData.CanReEnrollPlans)) {
            let endDate;
            let coverageEndDate;
            if(this.omniJsonData.hasOwnProperty('LifeEventChanges') && this.omniJsonData.LifeEventChanges && this.omniJsonData.LifeEventChanges.QE_LWCLifeEventEffectiveDate.EffectiveDate) {
                endDate = this.omniJsonData.LifeEventChanges.QE_LWCLifeEventEffectiveDate.EffectiveDate;
                coverageEndDate = this.omniJsonData.LifeEventChanges.QE_LWCLifeEventEffectiveDate.EffectiveDate;
                console.log('IN-If');
            } else if(this.omniJsonData.hasOwnProperty('Options') && this.omniJsonData.Options !== null  && (this.omniJsonData.Options.SelectOptions_Global || this.omniJsonData.Options.SelectOptions_NotMember)) {
                endDate = this.omniJsonData.Options.EventDate_OC;
                coverageEndDate = this.omniJsonData.Options.EventDate_OC;
                console.log('IN-else');
            }
            console.log('End-Date-Unmodifide=>'+ endDate);
            endDate = new Date(endDate + 'T08:00:00');
            console.log('END-Date-INITIAL=> '+endDate);
            console.log('cov-end-date=> '+coverageEndDate);
            //endDate.setDate(endDate.getDate() -1);
            console.log('END-Date-AGAIN=> '+endDate);
            console.log("CoverageEndDate parse", JSON.parse(JSON.stringify(("0" + endDate.getDate()).slice(-2) + "-" + ("0"+(endDate.getMonth()+1)).slice(-2) + "-" + endDate.getFullYear())));
            console.log('CANCELCOVDate==> '+(endDate.getFullYear() + "-" + ("0" + (endDate.getMonth()+1)).slice(-2) + "-" + ("0" + endDate.getDate()).slice(-2)))
            this.omniApplyCallResp({CancelCoverageEndDate: (endDate.getFullYear() + "-" + ("0" + (endDate.getMonth()+1)).slice(-2) + "-" + ("0" + endDate.getDate()).slice(-2))});
            this.omniApplyCallResp({DependentCoverageEndDate: coverageEndDate});
        }
    }

    getBaseUrl() {
        var base_url = window.location.origin;
        this.omniApplyCallResp({BaseUrl: base_url});
        console.log("base_url::", base_url);
    }

    setSubGroupNumber() {
        let medicalProductSubGroupIds = this.omniJsonData.MedicalProductSubGroupIds && Array.isArray(this.omniJsonData.MedicalProductSubGroupIds) ? this.omniJsonData.MedicalProductSubGroupIds : [this.omniJsonData.MedicalProductSubGroupIds];
        let medicalPlan = this.omniJsonData.SelectedMedicalPlans ? JSON.parse(JSON.stringify(this.omniJsonData.SelectedMedicalPlans)) : [];
        
        if(this.omniJsonData.hasOwnProperty('SelectedMedicalPlans') && this.omniJsonData.SelectedMedicalPlans !== null && this.omniJsonData.SelectedMedicalPlans.filter(p => p.Type__c === 'Medical').length) {
            medicalPlan = JSON.parse(JSON.stringify(this.omniJsonData.SelectedMedicalPlans));
        }

        if(medicalProductSubGroupIds.length) {
            medicalProductSubGroupIds.forEach(sub => {
                if(medicalPlan.filter(p => p.Type__c === 'Medical').length && sub.ProductId === medicalPlan.filter(p => p.Type__c === 'Medical')[0].ProductId) {
                    medicalPlan.filter(p => p.Type__c === 'Medical')[0].additionalFields = {QE_Sub_Group__c: sub.Sub_GroupId};
                }
            });
        }
        this.omniApplyCallResp({SelectedMedicalPlans: medicalPlan});
    }

    setTableData() {
        
        try{
            console.log("showCoverageDates:::",JSON.stringify(this.showCoverageDates));
            let showDates = JSON.parse(this.showCoverageDates);
            console.log("showCoverageDates====:::",JSON.stringify(this.showCoverageDates));
            console.log("showDates------:",JSON.stringify(showDates));
            console.log("showDates= typeof===:::",typeof showDates);
            if(showDates) {
                let coverageDatesData = JSON.parse(JSON.stringify(this.tableData));
                this.tableDataJson = coverageDatesData;
                console.log("tableData:::", JSON.stringify(this.tableDataJson));
            } else {
                let waivedCoverages = [];
                let allPlanTypes = this.omniJsonData.AllPlanTypes;

                allPlanTypes.forEach(pt => {
                    let stepName = `STEP_${pt.planName}PlanSelection`;
                    let waiveNode = pt.planName == 'Medical' ? 'WaivePlan' : `Waive${pt.planName}Plan`;
                    
                    if (this.omniJsonData && this.omniJsonData.hasOwnProperty(stepName) && this.omniJsonData[stepName] && this.omniJsonData[stepName][waiveNode]) {
                        waivedCoverages.push({Type: pt.planValue});
                    }
            
                });

                // if(omniJSONData.hasOwnProperty("STEP_MedicalPlanSelection") && omniJSONData.STEP_MedicalPlanSelection && omniJSONData.STEP_MedicalPlanSelection.WaivePlan) {
                //     waivedCoverages.push({Type: "Medical"});
                // }
                // console.log("in else 2");
                // if(omniJSONData.hasOwnProperty("STEP_DentalPlanSelection") && omniJSONData.STEP_DentalPlanSelection && omniJSONData.STEP_DentalPlanSelection.WaiveDentalPlan) {
                //     waivedCoverages.push({Type: "Dental"});
                // }
                // console.log("in else 3");
                // if(omniJSONData.hasOwnProperty("STEP_VisionPlanSelection") && omniJSONData.STEP_VisionPlanSelection && omniJSONData.STEP_VisionPlanSelection.WaiveVisionPlan) {
                //     waivedCoverages.push({Type: "Vision"});
                // }
                this.tableDataJson = waivedCoverages;
            }
        }catch(e){
            console.error('Error trying to set columns', e)
        }
    }

    render() {
        return templ;
    }
}