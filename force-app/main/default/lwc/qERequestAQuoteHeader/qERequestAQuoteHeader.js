import { LightningElement } from 'lwc';
import My_Resource from '@salesforce/resourceUrl/SentaraLogos';

export default class qERequestAQuoteHeader extends LightningElement {
    sentaraHPLogo = My_Resource + '/Images/sentara-HP-logo.png';
    
    connectedCallback(){
        console.log('Width ===>'  + window.innerWidth )
        console.log('Width2 ===>'  +screen.width )
    } 
}