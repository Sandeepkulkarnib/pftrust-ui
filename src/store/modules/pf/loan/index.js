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
    loans: [],
    unitCodes: [],
    years: [],
    months: [],
    statusList: [],
    types: []
}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}