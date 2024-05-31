import OmniscriptSelect  from 'vlocity_ins/omniscriptSelect';
import pubsub from 'vlocity_ins/pubsub';

/**
 * Author       : Durga Dutt, Govind
 * Description  : `OmniscriptSelect` extended to populate dropdown options dynamically.
 */
export default class OsSelect extends OmniscriptSelect{
    /**
     * Publishes address details via pubsub.
     * @param {object} details Address details with city, state and county information.
     */
    dispatchOptions(details){
        pubsub.fire('nwOsMsgBus', 'omniJsonUpdated', details);
    }

    handleChange(e){
        super.handleChange(e);
        this.dispatchOptions({})
    }
}