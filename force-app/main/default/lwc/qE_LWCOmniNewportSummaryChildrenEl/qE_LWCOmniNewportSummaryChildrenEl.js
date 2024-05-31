import { LightningElement, track , api } from 'lwc';

export default class QE_LWCOmniNewportSummaryChildrenEl extends LightningElement {
    @api element;
    @api summary;

    get IsDisclaimer(){
        return element.name=='disclaimer' 
    }
    connectedCallback(){
        this.template.querySelector(".elementChildren").appendChild(element.propSetMap.text);
    }
}