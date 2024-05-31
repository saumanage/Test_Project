import { LightningElement } from 'lwc';
import OmniscriptSaveForLaterAcknowledge from 'vlocity_ins/omniscriptSaveForLaterAcknowledge';
import tmpl from './qE_LWCSaveForLaterAcknowledge.html';

export default class QE_LWCSaveForLaterAcknowledge extends OmniscriptSaveForLaterAcknowledge{

    connectedCallback() {
    }

    render() {
        return tmpl;
    }

    handleResultChange(val) {
        if (val) {
           let link = "";
           if(window.location.search === "") {
            link = `${window.location.href}?c__instanceId=${val.instanceId}`;
           } else {
               if(window.location.search.includes("c__instanceId=")) {
                   link = window.location.href;
               } else {
                   link =  `${window.location.href}&c__instanceId=${val.instanceId}`;
               }
           }
            const body = `${this._bSflLabels.OmniResumeLink}\n${link}\n${this._bSflLabels.OmniSaveEmailBody}`;
            this.resumeLink = link;
            this.emailLink = `mailto:?subject=&body=${encodeURIComponent(body)}`;
            this.hasResult = true;
        }
    }
}