import {SET_INTEREST_RATES, SET_UNIT_CODES, UPDATE_REQUEST_STATUS} from "@/store/modules/pf/backoffice/types";

export default {

    [UPDATE_REQUEST_STATUS] (state, data) {
        state.request.inProgress = data.inProgress
        state.request.isFailed = data.isFailed
        state.request.isSuccess = data.isSuccess
        state.request.message = data.message
    },
    [SET_UNIT_CODES] (state, data) {
        state.unitcodes = data
    },
    [SET_INTEREST_RATES] (state, data) {
        state.interestRates = data
    }

}