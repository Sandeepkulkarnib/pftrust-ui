import {SET_JOBS, UPDATE_REQUEST_STATUS} from "@/store/modules/pf/job/types";

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

}