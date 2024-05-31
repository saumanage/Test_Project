import insOsCensusRow from 'vlocity_ins/insOsCensusRow';

export default class QE_LWCInsOsCensusRow extends insOsCensusRow {
    get errorsMember(){
        return this.member.error.includes(' - ') ? this.member.error.split(';').map(e => e.split(' - ')[1]).join(', ') : this.member.error;
    }

    
    get hasWarning() {
        return this.member.error == undefined && this.member.warning;
    }
}