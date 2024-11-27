import axios from "axios";
import {
    DOWNLOAD_LOAN_REPORT,
    FETCH_JOB_DETAILS,
    FETCH_LOAN_DETAILS,
    FETCH_LOAN_ESSENTIALS,
    FETCH_LOANS,
    REJECT_LOAN_APPLICATION,
    SET_LOAN_ESSENTIALS,
    SET_LOANS,
    UPDATE_REQUEST_STATUS,
    SAVE_PAYMENT_DETAILS,
    DOWNLOAD_LOAN_WORKSHEET,
    DOWNLOAD_LOAN_RECEIPT,
    GET_EMPLOYEE_DETAILS,
    DOWNLOAD_LOAN_HISTORY_SHEET,
    CHECK_LOAN_ELIGIBILITY,
    GET_DOCUMENTS_LIST,
    UPLOAD_DOCUMENT,
    CREATE_LOAN_APPLICATION,
    DOWNLOAD_LOAN_DOCUMENT,
    GET_LOAN_DETAILS,
    UPDATE_LOAN_APPLICATION,
    FETCH_LOAN_EMAIL_LIST,
    SEND_LOAN_COMPLETION_EMAILS,
    DOWNLOAD_LOAN_APPLICATION_TEMPLATE,
    CHECK_LOAN_APPLICATION_ELIGIBILITY,
    PROCESS_LOAN_APPLICATIONS,
    GET_PROCESS_LOAN_APPLICATIONS_JOB_STATUS,
    GET_PENDING_LOAN_APPLICATIONS, GET_PROCESS_LOAN_JOBS, GET_LOAN_TYPES, SAVE_LOAN_TYPE, GET_EMPLOYEE_DETAILS_BY_PF,
    APPROVE_APPLICATION
} from "@/store/modules/pf/loan/types";
import {START_REPORT_JOB} from "@/store/modules/pf/contribution/types";

export default {

    [FETCH_LOANS]({commit, rootState}, payload) {

        commit(UPDATE_REQUEST_STATUS, {
            inProgress: false,
            isSuccess: false,
            isFailed: false,
            message: null
        })

        return new Promise((resolve, reject) => {

            let searchString = `${payload.search.length === 0 ? '' : payload.search}`

            axios.get("/loans?size=" + payload.size + "&page=" + payload.page + "&search=" + searchString,
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
                    commit(SET_LOANS, response.data.response)
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
    [FETCH_LOAN_ESSENTIALS]({commit, rootState}) {

        commit(UPDATE_REQUEST_STATUS, {
            inProgress: false,
            isSuccess: false,
            isFailed: false,
            message: null
        })

        return new Promise((resolve, reject) => {

            axios.get("/loans/essentials",
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
                    commit(SET_LOAN_ESSENTIALS, response.data.response)
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

            axios.get("/loans/jobs/details?entityId=" + jobId,
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
    [DOWNLOAD_LOAN_REPORT]({rootState}, fileName) {

        return new Promise((resolve, reject) => {

            axios.get("/loans/download?filePath=" + fileName,
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

            axios.post("/loans/report", data,
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
    [FETCH_LOAN_DETAILS]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/loans/details/" + data,
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
    [REJECT_LOAN_APPLICATION]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.put("/loans/" + data + "/reject", {},
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

            axios.put("/loans/" + data.entityId + "/savePaymentDetails", data,
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
    [DOWNLOAD_LOAN_WORKSHEET]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/loans/" + data + "/getLoanWorkSheet",
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
    [DOWNLOAD_LOAN_RECEIPT]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/loans/" + data + "/getLoanReceipt",
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

            axios.get("/loans/eligibleLoanTypes/" + data,
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

            axios.get("/loans/eligibleLoanTypesByPf/" + data,
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
    [DOWNLOAD_LOAN_HISTORY_SHEET]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/loans/getLoanHistorySheet/" + data,
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
    [CHECK_LOAN_ELIGIBILITY]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.post("/loans/checkEligibility", data,
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

            axios.get("/loans/" + data + "/loanDocuments",
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

            axios.post("/loans/uploadDocuments/" + data.entityId, data.form,
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
    [CREATE_LOAN_APPLICATION]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.post("/loans", data,
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
    [DOWNLOAD_LOAN_DOCUMENT]({rootState}, fileName) {

        return new Promise((resolve, reject) => {

            axios.get("/loans/downloadDocuments?document=" + fileName,
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
    [GET_LOAN_DETAILS]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/loans/" + data,
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
    [UPDATE_LOAN_APPLICATION]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.put("/loans/" + data.applicationId, data,
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
    [FETCH_LOAN_EMAIL_LIST]({rootState}) {

        return new Promise((resolve, reject) => {

            axios.get("/loans/emailList",
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
    [SEND_LOAN_COMPLETION_EMAILS]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.post("/loans/sendEmails", data,
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
    [DOWNLOAD_LOAN_APPLICATION_TEMPLATE]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/loans/getTemplate?template=" + data,
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
    [CHECK_LOAN_APPLICATION_ELIGIBILITY]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.post("/loans/bulk/checkEligibility", data,
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
    [PROCESS_LOAN_APPLICATIONS]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.post("/loans/bulk/process-applications", data,
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

        });

    },
    [GET_PROCESS_LOAN_APPLICATIONS_JOB_STATUS]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/loans/bulk/process-applications/" + data,
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

        });

    },
    [GET_PENDING_LOAN_APPLICATIONS]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.post("/loans/bulk/pending-applications", data,
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

        });

    },
    [GET_PROCESS_LOAN_JOBS]({rootState}) {

        return new Promise((resolve, reject) => {

            axios.get("/loans/bulk/process-applications",
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

        });

    },
    [GET_LOAN_TYPES]({rootState}) {

        return new Promise((resolve, reject) => {
            // Api Url
            axios.get("/loans/getLoanTypes",
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

        });

    },
    [SAVE_LOAN_TYPE]({rootState}, data) {

        return new Promise((resolve, reject) => {
            // Api Url
            axios.post("/loans/loan-types/saveLoanType", data,
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

        });

    },
    [APPROVE_APPLICATION]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.get("/loans/approveApplication/" + data, 
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