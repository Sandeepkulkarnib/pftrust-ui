import axios from "axios";
import {
    CREATE_TRANSFER_IN_APPLICATION,
    DOWNLOAD_REQUEST_LETTER,
    DOWNLOAD_TRANSFER_IN_REPORT,
    FETCH_JOB_DETAILS,
    FETCH_TRANSFER_IN_DETAILS,
    FETCH_TRANSFER_IN_ESSENTIALS,
    FETCH_TRANSFER_IN_FOR_EMAIL_LIST,
    FETCH_TRANSFER_INS,
    GENERATE_TRANSFER_IN_REMINDER,
    GET_EMPLOYEE_DETAILS_FOR_TRANSFER_IN,
    GET_EMPLOYEE_DETAILS_FOR_TRANSFER_IN_BY_PF,
    GET_TRANSFER_IN_APPLICATION,
    REJECT_TRANSFER_IN,
    SEND_EMAILS_FOR_TRANSFER_IN_COMPLETION,
    SET_TRANSFER_IN_ESSENTIALS,
    SET_TRANSFER_INS,
    START_REPORT_JOB,
    UPDATE_REQUEST_STATUS,
    UPDATE_TRANSFER_IN_APPLICATION,
    UPLOAD_ANNEXUREK_DETAILS
} from "@/store/modules/pf/transferin/types";

export default {

    [FETCH_TRANSFER_INS]({commit, rootState}, payload) {

        commit(UPDATE_REQUEST_STATUS, {
            inProgress: false,
            isSuccess: false,
            isFailed: false,
            message: null
        })

        return new Promise((resolve, reject) => {

            let searchString = `${payload.search.length === 0 ? '' : payload.search}`

            axios.get("/transfer-ins?size=" + payload.size + "&page=" + payload.page + "&search=" + searchString,
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
                    commit(SET_TRANSFER_INS, response.data.response)
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
    [FETCH_TRANSFER_IN_ESSENTIALS]({commit, rootState}) {

        commit(UPDATE_REQUEST_STATUS, {
            inProgress: false,
            isSuccess: false,
            isFailed: false,
            message: null
        })

        return new Promise((resolve, reject) => {

            axios.get("/transfer-ins/essentials",
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
                    commit(SET_TRANSFER_IN_ESSENTIALS, response.data.response)
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

            axios.get("/transfer-ins/jobs/details?entityId=" + jobId,
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
    [DOWNLOAD_TRANSFER_IN_REPORT]({rootState}, fileName) {

        return new Promise((resolve, reject) => {

            axios.get("/transfer-ins/download?filePath=" + fileName,
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

            axios.post("/transfer-ins/report", data,
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

    },
    [FETCH_TRANSFER_IN_DETAILS]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/transfer-ins/details/" + data,
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

    },
    [REJECT_TRANSFER_IN]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.put("/transfer-ins/reject/" + data, {},
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

    },
    [UPLOAD_ANNEXUREK_DETAILS]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.post("/transfer-ins/uploadAnnexureK/" + data.entityId, data.form,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
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

    },
    [DOWNLOAD_REQUEST_LETTER]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/transfer-ins/" + data + "/getRequestLetter",
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
    [GENERATE_TRANSFER_IN_REMINDER]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.post("/transfer-ins/generateReminder/" + data.reminderId, {},
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
    [FETCH_TRANSFER_IN_FOR_EMAIL_LIST]({rootState}) {

        return new Promise((resolve, reject) => {

            axios.get("/transfer-ins/forEmailList",
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

    },
    [SEND_EMAILS_FOR_TRANSFER_IN_COMPLETION]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.post("/transfer-ins/sendEmails", data,
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
    [GET_EMPLOYEE_DETAILS_FOR_TRANSFER_IN]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/transfer-ins/employeeDetails/" + data,
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

    },
    [GET_EMPLOYEE_DETAILS_FOR_TRANSFER_IN_BY_PF]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/transfer-ins/employeeDetailsByPf/" + data,
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

    },
    [CREATE_TRANSFER_IN_APPLICATION]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.post("/transfer-ins", data,
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
    [GET_TRANSFER_IN_APPLICATION]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/transfer-ins/" + data,
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

    },
    [UPDATE_TRANSFER_IN_APPLICATION]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.put("/transfer-ins/" + data.entityId, data,
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
}