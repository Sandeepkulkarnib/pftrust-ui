import {
    LOGOUT,
    UPDATE_REQUEST_STATUS,
    SET_TENANTS, SET_USER_ACCESS_TOKEN,
    SET_USER_PROFILE_DATA, SET_USER_PERMISSIONS, SET_TIME, INCREMENT_TIME, UPDATE_TENANT_LOGO_IMAGE
} from "@/store/modules/adminstration/types";

export default {
    [SET_TIME] (state, data){
        state.currentInstant = data.response
    },
    [INCREMENT_TIME] (state){
      state.currentInstant.milliseconds = state.currentInstant.milliseconds + 1000
    },
    [SET_TENANTS] (state, data){
        state.tenants = data.response
    },
    [UPDATE_REQUEST_STATUS] (state, data) {
        state.request.inProgress = data.inProgress
        state.request.isFailed = data.isFailed
        state.request.isSuccess = data.isSuccess
        state.request.message = data.message
    },
    [SET_USER_PROFILE_DATA] (state, data) {
        state.user.isLoggedIn = true;

        state.user.profile.email = data.email
        state.user.profile.firstName = data.firstName
        state.user.profile.lastName = data.lastName
        state.user.profile.username = data.username
        state.user.profile.tenant = data.tenant
        state.user.profile.profileImage = data.profileImage

        state.user.profile.roles = data.roles
    },
    [SET_USER_ACCESS_TOKEN] (state, data) {
        state.user.isLoggedIn = true;
        state.user.tokens.access = data.tokens["x-access-token"]
        state.user.tokens.refresh = data.tokens["x-refresh-token"]
        localStorage.setItem("x-access-token", state.user.tokens.access)
        localStorage.setItem("x-refresh-token", state.user.tokens.access)
    },
    [SET_USER_PERMISSIONS] (state, data) {
      state.permissions = data.response.permissions;
      state.logo = data.response.logo;
      state.activeJobs = data.response.activeJobs;
      state.clock = data.response.clock;
      state.theme = data.response.theme;
      state.logoWidth = data.response.logoWidth
      state.logoHeight = data.response.logoHeight
      state.logoStyleClasses = data.response.logoStyleClasses
    },
    [LOGOUT] (state) {

        state.user.isLoggedIn = false

        state.user.profile.email = ''
        state.user.profile.firstName = ''
        state.user.profile.lastName = ''
        state.user.profile.username = ''
        state.user.profile.tenant = ''

        state.user.tokens.access = null
        state.user.tokens.refresh = null
        state.tenants = []

        localStorage.clear()
    },
    [SET_USER_PROFILE_DATA] (state, data) {
        state.user.isLoggedIn = true;

        state.user.profile.email = data.email
        state.user.profile.firstName = data.firstName
        state.user.profile.lastName = data.lastName
        state.user.profile.username = data.username
        state.user.profile.tenant = data.tenant
        state.user.profile.profileImage = data.profileImage

        state.user.profile.roles = data.roles
    },
    [UPDATE_TENANT_LOGO_IMAGE] (state, data) {
        state.logo = data.logo;
        state.logoWidth = data.width
        state.logoHeight = data.height
    },

}