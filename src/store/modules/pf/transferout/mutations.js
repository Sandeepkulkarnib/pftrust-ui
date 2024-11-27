import {
    SET_TRANSFER_OUT_ESSENTIALS,
    SET_TRANSFER_OUTS,
    UPDATE_REQUEST_STATUS
} from "@/store/modules/pf/transferout/types";

export default {

    [UPDATE_REQUEST_STATUS] (state, data) {
        state.request.inProgress = data.inProgress
        state.request.isFailed = data.isFailed
        state.request.isSuccess = data.isSuccess
        state.request.message = data.message
    },
    [SET_TRANSFER_OUTS] (state, data) {
        state.transferOuts = data
    },
    [SET_TRANSFER_OUT_ESSENTIALS] (state, data) {
        state.statusList = data.statusList
        state.types = data.typeList
        state.unitCodes = data.unitCodeList
        state.years = data.years
        state.months = data.months
    }
}