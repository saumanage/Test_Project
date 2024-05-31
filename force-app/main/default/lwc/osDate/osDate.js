import OmniscriptDate  from 'vlocity_ins/omniscriptDate';
import pubsub from 'vlocity_ins/pubsub';

export default class OsDate extends OmniscriptDate {
    /**
     * Publishes address details via pubsub.
     * @param {object} details Address details with city, state and county information.
     */
    dispatchOptions(details){
        pubsub.fire('nwOsMsgBus', 'omniJsonUpdated', details);
    }

    handleChange(e){
        super.handleChange(e);
        this.dispatchOptions({});
    }

}