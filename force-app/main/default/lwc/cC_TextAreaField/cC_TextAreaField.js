import { LightningElement,api } from 'lwc';

export default class CC_TextAreaField extends LightningElement {
    @api fieldName;
    @api textValue;
    @api placeHolderText;

    updateText(event){
        this.textValue = event.target.value;
     }
}