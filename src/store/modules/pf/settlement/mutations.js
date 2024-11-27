import {SET_SETTLEMENT_ESSENTIALS, SET_SETTLEMENTS, UPDATE_REQUEST_STATUS} from "@/store/modules/pf/settlement/types";

export default {

    [UPDATE_REQUEST_STATUS] (state, data) {
        state.request.inProgress = data.inProgress
        state.request.isFailed = data.isFailed
        state.request.isSuccess = data.isSuccess
        state.request.message = data.message
    },
    [SET_SETTLEMENTS] (state, data) {
        state.settlements = data
    },
    [SET_SETTLEMENT_ESSENTIALS] (state, data) {
        state.statusList = data.statusList
        state.types = data.typeList
        state.unitCodes = data.unitCodeList
        state.years = data.years
        state.months = data.months
    }
}