import insOsCensusRow from 'vlocity_ins/insOsCensusRow';
import { commonUtils } from 'vlocity_ins/insUtility';

export default class qE_LWCInsOsCensusRowMembership extends insOsCensusRow {
    get errorsMember(){
        return this.member.error.includes(' - ') ? this.member.error.split(';').map(e => e.split(' - ')[1]).join(', ') : this.member.error;
    }
    get warningMember(){
        return this.member.warning.includes(' - ') ? this.member.warning.split(';').map(e => e.split(' - ')[1]).join(', ') : this.member.warning;
    }


//DSP-42760
     handleUpdate(ev) {
//        console.log("This.Census ROW EV:::", JSON.stringify(ev.detail));
        commonUtils.triggerCustomEvent.call(this, 'update', { detail: ev.detail });
        //super.handleUpdate(ev); 
    }
}