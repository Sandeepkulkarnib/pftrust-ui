import axios from "axios";

import {
    CHANGE_USER_PASSWORD,
    GET_TENANTS,
    GET_USER_PERMISSIONS,
    LOGIN,
    UPDATE_REQUEST_STATUS,
    SET_TENANTS,
    SET_USER_ACCESS_TOKEN,
    SET_USER_PROFILE_DATA,
    UPDATE_USER_PROFILE,
    SET_USER_PERMISSIONS,
    GET_USER_PROFILE,
    GET_ACTIVITY_LOGS,
    VALIDATE_PERMISSIONS
} from './types.js'

export default {
    [GET_TENANTS]({commit}, data){
        commit(UPDATE_REQUEST_STATUS, {
            inProgress: true,
            isSuccess: false,
            isFailed: false,
            message: null
        })
        return new Promise((resolve, reject) => {
            axios.get("/auth/tenants/" + data)
                .then(response => {
                    console.log(response)
                    commit(UPDATE_REQUEST_STATUS, {
                        inProgress: false,
                        isSuccess: true,
                        isFailed: false,
                        message: null
                    })
                    commit(SET_TENANTS, response.data)
                    resolve(true)
                })
                .catch(error => {
                    console.log(error)
                    commit(UPDATE_REQUEST_STATUS, {
                        inProgress: false,
                        isSuccess: false,
                        isFailed: true,
                        message: error.response.data.error
                    })
                    reject(error.response.data.error)
                })
        })

    },
    [LOGIN]({commit}, data) {

        commit(UPDATE_REQUEST_STATUS,  {
            inProgress: true,
            isSuccess: false,
            isFailed: false,
            message: null
        })

        return new Promise((resolve, reject) => {

            axios.post("/auth/login", data,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(response => {
                    console.log(response)
                    commit(UPDATE_REQUEST_STATUS, {
                        inProgress: false,
                        isSuccess: true,
                        isFailed: false,
                        message: null
                    })
                    commit(SET_USER_PROFILE_DATA, response.data)
                    commit(SET_USER_ACCESS_TOKEN, response.data)
                    resolve(true)
                })
                .catch(error => {
                    console.log(error)
                    commit(UPDATE_REQUEST_STATUS, {
                        isSuccess: false,
                        isFailed: true,
                        message: error.response.data.error
                    })
                    reject(error.response.data.error)
                })

        })

    },
    [UPDATE_USER_PROFILE]({commit, state}, data) {

        commit(UPDATE_REQUEST_STATUS, {
            inProgress: true,
            isSuccess: false,
            isFailed: false,
            message: null
        })

        return new Promise((resolve, reject) => {

            axios.put("/account", data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + state.user.tokens.access
                    }
                })
                .then(response => {
                    console.log(response)
                    commit(UPDATE_REQUEST_STATUS, {
                        inProgress: false,
                        isSuccess: true,
                        isFailed: false,
                        message: "profile updated successfully."
                    })
                    commit(SET_USER_PROFILE_DATA, response.data.response)
                    resolve(true)
                })
                .catch(error => {
                    console.log(error)
                    commit(UPDATE_REQUEST_STATUS, {
                        inProgress: false,
                        isSuccess: false,
                        isFailed: true,
                        message: error.response.data.error
                    })
                    reject(error.response.data.error)
                })

        })

    },
    [CHANGE_USER_PASSWORD]({commit, state}, data) {

        commit(UPDATE_REQUEST_STATUS, {
            inProgress: true,
            isSuccess: false,
            isFailed: false,
            message: null
        })

        return new Promise((resolve, reject) => {

            axios.put("/account/change-password", data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + state.user.tokens.access
                    }
                })
                .then(response => {
                    console.log(response)
                    commit(UPDATE_REQUEST_STATUS, {
                        inProgress: false,
                        isSuccess: true,
                        isFailed: false,
                        message: response.data.response
                    })
                    resolve(true)
                })
                .catch(error => {
                    console.log(error)
                    commit(UPDATE_REQUEST_STATUS, {
                        inProgress: false,
                        isSuccess: false,
                        isFailed: true,
                        message: error.response.data.error
                    })
                    reject(error.response.data.error)
                })

        })

    },
    [GET_USER_PERMISSIONS]({commit, state}) {

        commit(UPDATE_REQUEST_STATUS, {
            inProgress: false,
            isSuccess: false,
            isFailed: false,
            message: null
        })

        return new Promise((resolve, reject) => {

            axios.get("/account/permissions",
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + state.user.tokens.access
                    }
                })
                .then(response => {
                    console.log(response)
                    commit(UPDATE_REQUEST_STATUS, {
                        inProgress: false,
                        isSuccess: true,
                        isFailed: false,
                        message: ""
                    })
                    commit(SET_USER_PERMISSIONS, response.data)
                    resolve(response.data)
                })
                .catch(error => {
                    console.log(error)

                    commit(UPDATE_REQUEST_STATUS, {
                        inProgress: false,
                        isSuccess: false,
                        isFailed: true,
                        message: ""
                    })
                    reject(error.response)
                })

        })

    },
    [GET_USER_PROFILE]({commit, state}) {

        commit(UPDATE_REQUEST_STATUS, {
            inProgress: false,
            isSuccess: false,
            isFailed: false,
            message: null
        })

        return new Promise((resolve, reject) => {

            axios.get("/account/profile",
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + state.user.tokens.access
                    }
                })
                .then(response => {
                    console.log(response)
                    commit(UPDATE_REQUEST_STATUS, {
                        inProgress: false,
                        isSuccess: true,
                        isFailed: false,
                        message: ""
                    })
                    commit(SET_USER_PROFILE_DATA, response.data.response)
                    resolve(true)
                })
                .catch(error => {
                    console.log(error)
                    commit(UPDATE_REQUEST_STATUS, {
                        inProgress: false,
                        isSuccess: false,
                        isFailed: true,
                        message: error.response.data.error
                    })
                    reject(error.response.data.error)
                })

        })

    },
    [GET_ACTIVITY_LOGS]({rootState}, payload) {

        return new Promise((resolve, reject) => {

            let searchString = `${payload.search.length === 0 ? '' : payload.search}`

            axios.get("/logs?size=" + payload.size + "&page=" + payload.page + "&search=" + searchString,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + rootState.administrationModule.user.tokens.access
                    }
                })
                .then(response => {
                    resolve(response.data.response)
                })
                .catch(error => {
                    console.log(error)
                    reject(error.response.data.error)
                })

        })

    },
    [VALIDATE_PERMISSIONS]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/account/validatePermissions?name=" + data.name + "&sub=" + data.sub,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + rootState.administrationModule.user.tokens.access
                    }
                })
                .then(response => {
                    console.log(response)
                    resolve(response.data.response)
                })
                .catch(error => {
                    console.log(error)
                    reject(error.response.status)
                })

        })

    },
}