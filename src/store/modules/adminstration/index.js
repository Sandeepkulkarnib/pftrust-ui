import actions from './actions.js'
import mutations from './mutations.js'
import getters from './getters.js'

const state = {
    currentInstant: null,
    request: {
        inProgress: false,
        isFailed: false,
        message: null,
        isSuccess: false
    },
    loginForm: {
        title: "Admin Login",
    },
    user: {
        isLoggedIn: false,
        profile: {
            username: "",
            email: "",
            firstName: "",
            lastName: "",
            tenant: "",
            profileImage: "",
            roles: []
        },
        tokens: {
            access: "",
            refresh: ""
        }
    },
    tenants: [],
    permissions: [],
    logo: null,
    logoWidth: null,
    logoHeight: null,
    logoStyleClasses: null,
    activeJobs: [],
    clock: null,
    accountViewNavigation: [
        { text: 'View Profile', icon: 'mdi-clock', path: '/accounts', type: 'read', name: 'profile' },
        { text: 'Edit Profile', icon: 'mdi-account', path: '/accounts/edit', type: 'update', name: 'editProfile'},
        { text: 'Change Password', icon: 'mdi-flag', path: '/accounts/change-password', type: 'update', name: 'changePassword'}
    ]
}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}