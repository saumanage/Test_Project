import { api, track, LightningElement } from 'lwc';
import tmpl from './qE_LWCStepChartItemEnrollmentFlow.html';
import tmpl_nds from './qE_LWCStepChartItemEnrollmentFlow.html';
import StepChartItem from 'vlocity_ins/omniscriptStepChartItems';

/**
 * Stepchart component for Omniscript.
 */
export default class QE_LWCStepChartItemEnrollmentFlow extends StepChartItem {
    render() {
      return this._theme === 'nds' ? tmpl_nds : tmpl;
  }
}