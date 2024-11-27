import {SET_LOAN_ESSENTIALS, SET_LOANS, UPDATE_REQUEST_STATUS} from "@/store/modules/pf/loan/types";

export default {

    [UPDATE_REQUEST_STATUS] (state, data) {
        state.request.inProgress = data.inProgress
        state.request.isFailed = data.isFailed
        state.request.isSuccess = data.isSuccess
        state.request.message = data.message
    },
    [SET_LOANS] (state, data) {
        state.loans = data
    },
    [SET_LOAN_ESSENTIALS] (state, data) {
        state.statusList = data.statusList
        state.types = data.typeList
        state.unitCodes = data.unitCodeList
        state.years = data.years
        state.months = data.months
    }
}