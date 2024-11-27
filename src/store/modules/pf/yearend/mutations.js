import {SET_JOBS, UPDATE_REQUEST_STATUS} from "@/store/modules/pf/yearend/types";
import {SET_COMMONS} from "@/store/modules/pf/employee/types";


export default {

    [UPDATE_REQUEST_STATUS] (state, data) {
        state.request.inProgress = data.inProgress
        state.request.isFailed = data.isFailed
        state.request.isSuccess = data.isSuccess
        state.request.message = data.message
    },
    [SET_JOBS] (state, data) {
        state.jobs = data
    },
    [SET_COMMONS] (state, data) {
        state.unitCodes = data.unitCodes
        state.financialYear = data.financialYear
        state.interestRate = data.interestRate
    },

}