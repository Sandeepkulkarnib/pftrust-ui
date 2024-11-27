import {
    SET_EMPLOYEES,
    UPDATE_REQUEST_STATUS,
    SET_JOBS,
    SET_COMMONS,
    SET_MONTHLY_STATUS_PROCESS_JOBS
} from "@/store/modules/pf/employee/types";

export default {

    [UPDATE_REQUEST_STATUS] (state, data) {
        state.request.inProgress = data.inProgress
        state.request.isFailed = data.isFailed
        state.request.isSuccess = data.isSuccess
        state.request.message = data.message
    },
    [SET_EMPLOYEES] (state, data) {
        state.employees = data
    },
    [SET_JOBS] (state, data) {
        state.jobs = data
    },
    [SET_COMMONS] (state, data) {
        state.unitCodes = data.unitCodes
        state.contributionStatusList = data.contributionStatusList
        state.years = data.years
        state.months = data.financialMonths
    },
    [SET_MONTHLY_STATUS_PROCESS_JOBS] (state, data) {
        state.monthlyStatusProcessJobs = data
    },

}