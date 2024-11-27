import {SET_CONTRIBUTIONS, UPDATE_REQUEST_STATUS} from "@/store/modules/pf/contribution/types";
import {SET_COMMONS} from "@/store/modules/pf/employee/types";

export default {

    [UPDATE_REQUEST_STATUS] (state, data) {
        state.request.inProgress = data.inProgress
        state.request.isFailed = data.isFailed
        state.request.isSuccess = data.isSuccess
        state.request.message = data.message
    },
    [SET_CONTRIBUTIONS] (state, data) {
        state.contributions = data
    },
    [SET_COMMONS] (state, data) {
        state.unitCodes = data.unitCodes
        state.contributionStatusList = data.contributionStatusList
        state.years = data.years
        state.months = data.months
    }

}