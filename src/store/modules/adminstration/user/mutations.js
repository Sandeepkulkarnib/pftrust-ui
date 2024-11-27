import {SET_USERS, UPDATE_REQUEST_STATUS} from "@/store/modules/adminstration/user/types";


export default {

    [UPDATE_REQUEST_STATUS] (state, data) {
        state.request.inProgress = data.inProgress
        state.request.isFailed = data.isFailed
        state.request.isSuccess = data.isSuccess
        state.request.message = data.message
    },
    [SET_USERS] (state, data) {
        state.users = data
    },

}