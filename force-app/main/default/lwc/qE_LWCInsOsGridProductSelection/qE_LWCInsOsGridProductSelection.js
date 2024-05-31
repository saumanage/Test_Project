import { api } from 'lwc';
import insOsProductSelectionOptima from 'vlocity_ins/insOsGridProductSelection';
import { commonUtils, dataFormatter, omniscriptUtils } from 'vlocity_ins/insUtility';
import pubsub from 'vlocity_ins/pubsub';

export default class QE_LWCInsOsGridProductSelection extends insOsProductSelectionOptima {
    showConfigButton = false;

    // @api Quote_MarketSegment;
    IsAcceptQuoteFlow = false;

    connectedCallback() {
        if (typeof this.loadBatchSize === 'string') {
            this.loadBatchSize = parseInt(this.loadBatchSize, 10);
        }
        if (typeof this.concurrentBatchRequest === 'string') {
            this.concurrentBatchRequest = Math.min(
                parseInt(this.concurrentBatchRequest, 10),
                MAX_CONCURRENT_SERVICE_REQUEST
            );
        }
        if (typeof this.compareBar === 'string') {
            this.compareBar = this.compareBar === 'true';
        }
        if (this.omniJsonDef.propSetMap.filtersConfig) {
            this.populateServiceFilters();
        }

        this.stepName = this.omniScriptHeaderDef.asName;
        this.rootChannel = `ProductSelectionChannel-${dataFormatter.uniqueKey()}`;
        pubsub.register(this.rootChannel, this.pubsubPayload);
        const dataOmniLayout = this.getAttribute('data-omni-layout');
        this.theme = dataOmniLayout === 'newport' ? 'nds' : 'slds';
        this.productConfig = this.omniJsonDef.propSetMap.productConfig || {};
        if (typeof this.maxCompareProducts === 'string') {
            this.maxCompareProducts = Math.min(parseInt(this.maxCompareProducts, 10), 4);
        }
        this.stateData = omniscriptUtils.getSaveState(this);
        this.formatRemoteActions();
        if (this.stateData) {
            this.parseSavedState(this.stateData);
        } else {
            this.getProducts();
        }
        const cartProducts = omniscriptUtils.getCartProducts(this);
        if (cartProducts.length === 0) {
            // Update the OS json to an empty array
            omniscriptUtils.updateCartProducts(this, [], this.rootChannel);
        }
        this.cartProductCount();
        this.handleConfigButton();
    }

    handleConfigButton() {
        let parsedData = JSON.parse(JSON.stringify(this.omniJsonData));
        this.Quote_MarketSegment = parsedData.hasOwnProperty('Quote_MarketSegment') ? parsedData.Quote_MarketSegment : '';
        this.IsAcceptQuoteFlow = parsedData.hasOwnProperty('IsAcceptQuoteFlow') ? parsedData.IsAcceptQuoteFlow : '';
        console.log("Quote_MarketSegment::", JSON.stringify(this.Quote_MarketSegment));
        console.log("Quote_MarketSegment::", typeof this.IsAcceptQuoteFlow);
        if(this.IsAcceptQuoteFlow) {
            if(this.Quote_MarketSegment && this.Quote_MarketSegment == 'Mid Sized Group') {
                this.showConfigButton = true;
            } else {
                this.showConfigButton = false;
            }
        } else {
            this.showConfigButton = true;
        }
    }
}