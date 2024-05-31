import { LightningElement } from 'lwc';
import { OmniscriptBaseMixin } from "vlocity_ins/omniscriptBaseMixin";
import util from "vlocity_ins/utility";

export default class QE_LWCSetSaveForLaterId extends OmniscriptBaseMixin(LightningElement) {
    saveForLaterCompleted = {
        type: "Dataraptor",
        value: {
            bundleName: "QE_DrUpdateSaveForLaterId",
            inputMap: "{}",
            optionsMap: "{}"
        }
    };

    connectedCallback() {
        let indexOfInstanceId = window.location.href.indexOf('c__instanceId=');
        let instanceId = "";
        if (indexOfInstanceId > -1) {
            instanceId = window.location.href.substr(indexOfInstanceId + 14, 18);
            this.saveForLaterCompleted.value.inputMap = JSON.stringify({
                sInstanceId: instanceId
            });
            util.getDataHandler(JSON.stringify(this.saveForLaterCompleted))
                .then(resultString => {
                    console.log("SaveForLater Status Completed")
                })
        }

    }


}