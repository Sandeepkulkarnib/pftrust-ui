import actions from './actions.js'
import mutations from './mutations.js'
import getters from './getters.js'

const state = {
    request: {
        inProgress: false,
        isFailed: false,
        message: null,
        isSuccess: false
    },
    employees: [],
    jobs: [],
    unitCodes: [],
    contributionStatusList: [],
    monthlyStatusProcessJobs: [],
    years: [],
    months: []
}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}