import { LightningElement, api  } from 'lwc';
import {OmniscriptBaseMixin} from 'vlocity_ins/omniscriptBaseMixin';
export default class QE_LWC_BenefitChangePlanSelection extends OmniscriptBaseMixin(LightningElement) {

    

@api columns = [
    { label: 'SubDivision', fieldName: 'Name', type: 'text' }
    
];

@api subDivisions = [
    {
        Id: 'a',
        Name: 'Cloudhub',
        
        trendIcon: 'utility:down',
    },
    {
        Id: 'b',
        Name: 'Quip',
        
        trendIcon: 'utility:up',
    },
];

@api records; /*=[
  {
    Id: 'x494549500',
    Plan: "Optima Health Plus 4500",
    isSelected: false

  },
  {
    Id: 'x494549501',
    Plan: "Optima Health Plus 3500",
    isSelected: false

  },
  {
    Id: 'x494549502',
    Plan: "Optima Health Plus 1500",
    isSelected: false

  }
];*/

    //keep track of selected Subgroups  with Plans
    selectedSubGroupWithPlan =[];
    //Get the selected subgroup rows for the plan
    getSelectedRows(event)
    {

        
        const selectedRows = event.detail.selectedRows;
        
        if( this.selectedSubGroupWithPlan.length>0)
        {
               let plansToKeep = this.selectedSubGroupWithPlan.filter(
                    rec=> rec.Plan!=this.currentCardId
                );

                this.selectedSubGroupWithPlan = plansToKeep;
        }

     
        selectedRows.forEach(currentRow => {
           
          
                    
                    this.selectedSubGroupWithPlan.push(
                        {
                            Plan: this.currentCardId,
                            SubDivision: currentRow.Id
                        }
                    );

            
            
        });

      let uniqueArray = this.selectedSubGroupWithPlan.reduce(function (a, d) {
       if (a.indexOf(d.Plan) === -1) {
         a.push(d.Plan);
       }
       return a;
        }, []);
    
        let isValid  = this.records.length == uniqueArray.length;
        


 
        this.omniApplyCallResp({"SelectedPlans": this.selectedSubGroupWithPlan, 'SelectedPlansCount':uniqueArray.length, 'SelectionValid': isValid });
        

    }

    currentCardId; //store current Card ID
    HoverOverCurrentCard(event)
    {
        
        if( event.currentTarget.dataset.id )
        {
            //console.log("Card ID: "+ event.currentTarget.dataset.id);
            this.currentCardId = event.currentTarget.dataset.id;
        }
    }

}