import { LightningElement } from 'lwc';
import {OmniscriptBaseMixin} from 'vlocity_ins/omniscriptBaseMixin';

export default class QE_LWCDeathOfDependents extends OmniscriptBaseMixin(LightningElement) {
    value = [];
    options;

    connectedCallback() {
        this.options = this.omniJsonData.allDependentsList ? this.omniJsonData.allDependentsList : null;
    }

    handleChange(event) {
        let changeValue = event.detail.value;
        console.log('changeValue : '+changeValue);
        let dependentList = [];
        if( changeValue && changeValue.length > 0 ) {
            for(var dep in changeValue ) {
                if( changeValue[dep] && changeValue[dep].length === 18 ) {
                    var depObj = {
                        depId : changeValue[dep]
                    };
                    dependentList.push( depObj );
                }
            }
        }

        this.omniUpdateDataJson({ DeceasedDependents: dependentList });
    }

}