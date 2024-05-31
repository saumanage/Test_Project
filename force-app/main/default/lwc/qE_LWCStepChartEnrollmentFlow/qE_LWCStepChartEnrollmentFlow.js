import { LightningElement, track, wire, api } from "lwc";
import OmniScriptStepChart from "vlocity_ins/omniscriptStepChart";
import { OmniscriptBaseMixin } from "vlocity_ins/omniscriptBaseMixin";
import tmpl from "./qE_LWCStepChartEnrollmentFlow.html";

export default class QE_LWCStepChartEnrollmentFlow extends OmniscriptBaseMixin(OmniScriptStepChart) {
 
  @api jsonData;
  

  render() {
    return tmpl;
  }

  disconnectedCallback() {
    console.log("Disconnected callback STEPCHATBAR");
  }

  connectedCallback() {
    super.connectedCallback();    

    console.log(">>>Me here On connectedCallback");

  }
}