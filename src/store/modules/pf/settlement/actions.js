import axios from "axios";
import {
    CREATE_SETTLEMENT_APPLICATION,
    DOWNLOAD_SETTLEMENT_DISPATCH_LETTER, DOWNLOAD_SETTLEMENT_DOCUMENT,
    DOWNLOAD_SETTLEMENT_REPORT,
    DOWNLOAD_SETTLEMENT_WORKSHEET,
    FETCH_JOB_DETAILS,
    FETCH_SETTLEMENT_DETAILS,
    FETCH_SETTLEMENT_EMAIL_LIST,
    FETCH_SETTLEMENT_ESSENTIALS,
    FETCH_SETTLEMENTS, GENERATE_BANK_SHEET, GET_BANKS,
    GET_DOCUMENTS_LIST,
    GET_EMPLOYEE_DETAILS, GET_EMPLOYEE_DETAILS_BY_PF,
    GET_SETTLEMENT_APPLICATION,
    GET_SETTLEMENTS_FOR_BANK_SHEET,
    REJECT_SETTLEMENT_APPLICATION,
    SAVE_PAYMENT_DETAILS,
    SEND_SETTLEMENT_COMPLETION_EMAILS,
    SET_SETTLEMENT_ESSENTIALS,
    SET_SETTLEMENTS,
    START_REPORT_JOB,
    UPDATE_REQUEST_STATUS,
    UPDATE_SETTLEMENT_APPLICATION,
    UPLOAD_DOCUMENT,
    APPROVE_APPLICATION
} from "@/store/modules/pf/settlement/types";

export default {

    [FETCH_SETTLEMENTS]({commit, rootState}, payload) {

        commit(UPDATE_REQUEST_STATUS, {
            inProgress: false,
            isSuccess: false,
            isFailed: false,
            message: null
        })

        return new Promise((resolve, reject) => {

            let searchString = `${payload.search.length === 0 ? '' : payload.search}`

            axios.get("/settlements?size=" + payload.size + "&page=" + payload.page + "&search=" + searchString,
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
                    commit(SET_SETTLEMENTS, response.data.response)
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
    [FETCH_SETTLEMENT_ESSENTIALS]({commit, rootState}) {

        commit(UPDATE_REQUEST_STATUS, {
            inProgress: false,
            isSuccess: false,
            isFailed: false,
            message: null
        })

        return new Promise((resolve, reject) => {

            axios.get("/settlements/essentials",
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
                    commit(SET_SETTLEMENT_ESSENTIALS, response.data.response)
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

            axios.get("/settlements/jobs/details?entityId=" + jobId,
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
    [DOWNLOAD_SETTLEMENT_REPORT]({rootState}, fileName) {

        return new Promise((resolve, reject) => {

            axios.get("/settlements/download?filePath=" + fileName,
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

            axios.post("/settlements/report", data,
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
    [FETCH_SETTLEMENT_DETAILS]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/settlements/details/" + data,
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
    [REJECT_SETTLEMENT_APPLICATION]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.put("/settlements/reject/" + data, {},
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
    [SAVE_PAYMENT_DETAILS]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.put("/settlements/savePaymentDetails/" + data.entityId, data,
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
    [FETCH_SETTLEMENT_EMAIL_LIST]({rootState}) {

        return new Promise((resolve, reject) => {

            axios.get("/settlements/emailList",
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
    [SEND_SETTLEMENT_COMPLETION_EMAILS]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.post("/settlements/sendEmails", data,
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
    [DOWNLOAD_SETTLEMENT_WORKSHEET]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/settlements/" + data + "/getWorkSheet",
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
    [DOWNLOAD_SETTLEMENT_DISPATCH_LETTER]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/settlements/" + data + "/getDispatchLetter",
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
    [GET_EMPLOYEE_DETAILS]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/settlements/employeeDetails/" + data,
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
    [GET_EMPLOYEE_DETAILS_BY_PF]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/settlements/employeeDetailsByPf/" + data,
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
    [GET_DOCUMENTS_LIST]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/settlements/documents?entityId=" + data,
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
                    reject(error.response.data.error)
                })

        })

    },
    [UPLOAD_DOCUMENT]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.post("/settlements/uploadDocuments/" + data.entityId, data.form,
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
    [CREATE_SETTLEMENT_APPLICATION]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.post("/settlements", data,
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
    [GET_SETTLEMENT_APPLICATION]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/settlements/" + data,
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
    [UPDATE_SETTLEMENT_APPLICATION]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.put("/settlements/" + data.applicationId, data,
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
    [GET_SETTLEMENTS_FOR_BANK_SHEET]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/settlements/getForBankSheet?startDate=" + data.startDate + "&endDate=" + data.endDate +
                "&bankId=" + data.bankId,
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
    [GET_BANKS]({rootState}) {

        return new Promise((resolve, reject) => {

            axios.get("/settlements/banks",
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
    [GENERATE_BANK_SHEET]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.put("/settlements/generateBankSheet", data,
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
                    reject(error.response.data.error)
                })

        })

    },
    [DOWNLOAD_SETTLEMENT_DOCUMENT]({rootState}, fileName) {

        return new Promise((resolve, reject) => {

            axios.get("/settlements/downloadDocuments?document=" + fileName,
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
    [APPROVE_APPLICATION]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/settlements/approveApplication/" + data, 
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