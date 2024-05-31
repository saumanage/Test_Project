import { LightningElement, api } from 'lwc';

export default class QE_LWCPlanCellOOA extends LightningElement {
  
    @api context;
    @api relationship;

    @api
    get checkedOOA() {
      return this._checkedOOA;
    }
    set checkedOOA(value) {
      this._checkedOOA = value;
    }

    get display(){
      return this.relationship !== 'Spouse';
    }
    handleChange(ev){
      this.dispatchEvent(new CustomEvent('ooa', {
          composed: true,
          bubbles: true,
          cancelable: true,
          detail: {
              data: { context: this.context, checked: ev.detail.checked}
          }
      }));
  }
}