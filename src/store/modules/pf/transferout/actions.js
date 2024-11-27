import axios from "axios";
import {
    DOWNLOAD_TRANSFER_OUT_ANNEXUREK,
    DOWNLOAD_TRANSFER_OUT_DISPATCH_LETTER,
    DOWNLOAD_TRANSFER_OUT_REPORT,
    DOWNLOAD_TRANSFER_OUT_WORKSHEET,
    FETCH_JOB_DETAILS,
    FETCH_TRANSFER_OUT_DETAILS,
    FETCH_TRANSFER_OUT_EMAIL_LIST,
    FETCH_TRANSFER_OUT_ESSENTIALS,
    FETCH_TRANSFER_OUTS,
    REJECT_TRANSFER_OUT_APPLICATION,
    SAVE_PAYMENT_DETAILS,
    SEND_TRANSFER_OUT_COMPLETION_EMAILS,
    SET_TRANSFER_OUT_ESSENTIALS,
    SET_TRANSFER_OUTS,
    START_REPORT_JOB,
    UPDATE_REQUEST_STATUS,
    GET_EMPLOYEE_DETAILS,
    GET_DOCUMENTS_LIST,
    CREATE_TRANSFER_OUT_APPLICATION,
    UPDATE_TRANSFER_OUT_APPLICATION,
    GET_TRANSFER_OUT_APPLICATION,
    UPLOAD_DOCUMENT,
    GENERATE_BANK_SHEET, GET_BANKS, GET_TRANSFER_OUTS_FOR_BANK_SHEET, DOWNLOAD_TRANSFER_OUT_DOCUMENT,
    APPROVE_APPLICATION
} from "@/store/modules/pf/transferout/types";
import {GET_EMPLOYEE_DETAILS_BY_PF} from "@/store/modules/pf/settlement/types";

export default {

    [FETCH_TRANSFER_OUTS]({commit, rootState}, payload) {

        commit(UPDATE_REQUEST_STATUS, {
            inProgress: false,
            isSuccess: false,
            isFailed: false,
            message: null
        })

        return new Promise((resolve, reject) => {

            let searchString = `${payload.search.length === 0 ? '' : payload.search}`

            axios.get("/transfer-outs?size=" + payload.size + "&page=" + payload.page + "&search=" + searchString,
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
                    commit(SET_TRANSFER_OUTS, response.data.response)
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
    [FETCH_TRANSFER_OUT_ESSENTIALS]({commit, rootState}) {

        commit(UPDATE_REQUEST_STATUS, {
            inProgress: false,
            isSuccess: false,
            isFailed: false,
            message: null
        })

        return new Promise((resolve, reject) => {

            axios.get("/transfer-outs/essentials",
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
                    commit(SET_TRANSFER_OUT_ESSENTIALS, response.data.response)
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

            axios.get("/transfer-outs/jobs/details?entityId=" + jobId,
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
    [DOWNLOAD_TRANSFER_OUT_REPORT]({rootState}, fileName) {

        return new Promise((resolve, reject) => {

            axios.get("/transfer-outs/download?filePath=" + fileName,
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

            axios.post("/transfer-outs/report", data,
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
    [FETCH_TRANSFER_OUT_DETAILS]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/transfer-outs/details/" + data,
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

            axios.put("/transfer-outs/savePaymentDetails/" + data.entityId, data,
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
    [REJECT_TRANSFER_OUT_APPLICATION]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.put("/transfer-outs/reject/" + data, {},
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
    [FETCH_TRANSFER_OUT_EMAIL_LIST]({rootState}) {

        return new Promise((resolve, reject) => {

            axios.get("/transfer-outs/emailList",
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
    [SEND_TRANSFER_OUT_COMPLETION_EMAILS]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.post("/transfer-outs/sendEmails", data,
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
    [DOWNLOAD_TRANSFER_OUT_DISPATCH_LETTER]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/transfer-outs/" + data + "/getDispatchLetter",
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
    [DOWNLOAD_TRANSFER_OUT_WORKSHEET]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/transfer-outs/" + data + "/getWorkSheet",
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
    [DOWNLOAD_TRANSFER_OUT_ANNEXUREK]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/transfer-outs/" + data + "/getAnnexurK",
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

            axios.get("/transfer-outs/employeeDetails/" + data,
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

            axios.get("/transfer-outs/employeeDetailsByPf/" + data,
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

            axios.get("/transfer-outs/documents?entityId=" + data,
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

            axios.post("/transfer-outs/uploadDocuments/" + data.entityId, data.form,
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
    [CREATE_TRANSFER_OUT_APPLICATION]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.post("/transfer-outs", data,
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
    [GET_TRANSFER_OUT_APPLICATION]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/transfer-outs/" + data,
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
    [UPDATE_TRANSFER_OUT_APPLICATION]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.put("/transfer-outs/" + data.applicationId, data,
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
    [GET_TRANSFER_OUTS_FOR_BANK_SHEET]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/transfer-outs/getForBankSheet?startDate=" + data.startDate + "&endDate=" + data.endDate +
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

            axios.get("/transfer-outs/banks",
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

            axios.put("/transfer-outs/generateBankSheet", data,
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
    [DOWNLOAD_TRANSFER_OUT_DOCUMENT]({rootState}, fileName) {

        return new Promise((resolve, reject) => {

            axios.get("/transfer-outs/downloadDocuments?document=" + fileName,
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

            axios.get("/transfer-outs/approveApplication/" + data, 
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