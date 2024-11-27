import axios from "axios";
import {
    DOWNLOAD_EMPLOYEE_REPORT,
    FETCH_COMMONS,
    FETCH_CONTRIBUTIONS,
    FETCH_JOB_DETAILS, SET_COMMONS,
    SET_CONTRIBUTIONS, START_REPORT_JOB,
    UPDATE_REQUEST_STATUS
} from "@/store/modules/pf/contribution/types";

export default {

    [FETCH_CONTRIBUTIONS]({commit, rootState}, payload) {

        commit(UPDATE_REQUEST_STATUS, {
            inProgress: false,
            isSuccess: false,
            isFailed: false,
            message: null
        })

        return new Promise((resolve, reject) => {

            let searchString = `${payload.search.length === 0 ? '' : payload.search}`

            axios.get("/contributions?size=" + payload.size + "&page=" + payload.page + "&search=" + searchString,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + rootState.administrationModule.user.tokens.access
                    }
                })
                .then(response => {
                    commit(UPDATE_REQUEST_STATUS, {
                        inProgress: false,
                        isSuccess: true,
                        isFailed: false,
                        message: ""
                    })
                    commit(SET_CONTRIBUTIONS, response.data.response)
                    resolve(response.data.response)
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
    [FETCH_JOB_DETAILS]({commit, rootState}, jobId) {

        commit(UPDATE_REQUEST_STATUS, {
            inProgress: false,
            isSuccess: false,
            isFailed: false,
            message: null
        })
        return new Promise((resolve, reject) => {

            axios.get("/contributions/jobs/details?entityId=" + jobId,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + rootState.administrationModule.user.tokens.access
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
                    resolve(response.data.response)
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
    [FETCH_COMMONS]({commit, rootState}) {

        commit(UPDATE_REQUEST_STATUS, {
            inProgress: false,
            isSuccess: false,
            isFailed: false,
            message: null
        })
        return new Promise((resolve, reject) => {

            axios.get("/contributions/commons",
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + rootState.administrationModule.user.tokens.access
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
                    commit(SET_COMMONS, response.data.response)
                    resolve(response.data.response)
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
    [DOWNLOAD_EMPLOYEE_REPORT]({rootState}, fileName) {

        return new Promise((resolve, reject) => {

            axios.get("/contributions/download?filePath=" + fileName,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + rootState.administrationModule.user.tokens.access
                    },
                    responseType: "blob"
                })
                .then(response => {
                    resolve(response)
                })
                .catch(error => {
                    console.log(error)
                    reject(error)
                })

        })

    },
    [START_REPORT_JOB]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.post("/contributions/report", data,
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
                    reject(error.response.data.error)
                })

        })

    }



}