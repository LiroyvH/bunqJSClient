import ApiAdapter from "../ApiAdapter";
import Session from "../Session";
import ApiEndpointInterface from "../Interfaces/ApiEndpointInterface";
import PinCodeAssignmentCollection from "../Types/PinCodeAssignmentCollection";
import CounterpartyAlias from "../Types/CounterpartyAlias";
import CardType from "../Types/CardType";
import ProductType from "../Types/ProductType";

export default class CardDebit implements ApiEndpointInterface {
    ApiAdapter: ApiAdapter;
    Session: Session;

    /**
     * @param {ApiAdapter} ApiAdapter
     */
    constructor(ApiAdapter: ApiAdapter) {
        this.ApiAdapter = ApiAdapter;
        this.Session = ApiAdapter.Session;
    }

    /**
     * @param {number} userId
     * @param {string} name
     * @param {string} description
     * @param {CounterpartyAlias} alias
     * @param {CardType} cardType
     * @param {ProductType} productType
     * @param {PinCodeAssignmentCollection} assignments
     * @param {number} monetaryAccountIdFallback
     * @param options
     * @returns {Promise<any>}
     */
    public async post(
        userId: number,
        name: string,
        description: string,
        alias: CounterpartyAlias = null,
        cardType: CardType = null,
	productType: ProductType = null,
        assignments: PinCodeAssignmentCollection = null,
        monetaryAccountIdFallback: number = null,
        options: any = {}
    ) {
        const limiter = this.ApiAdapter.RequestLimitFactory.create("/card-debit", "POST");

        const response = await limiter.run(async axiosClient =>
            this.ApiAdapter.post(
                `/v1/user/${userId}/card-debit`,
                {
                    second_line: description,
                    name_on_card: name,
                    alias: alias,
                    type: cardType,
		    product_type: productType,
                    pin_code_assignment: assignments,
                    monetary_account_id_fallback: monetaryAccountIdFallback
                },
                {},
                { isEncrypted: true },
                axiosClient
            )
        );

        return response.Response;
    }
}
