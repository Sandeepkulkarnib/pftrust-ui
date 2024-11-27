import axios from "axios";


import {
    GET_PF_NUMBER, GET_FY_YEAR,
    SEARCH_EMPLOYEE,
    EMPLOYEE_DETAILS,
    MONTHLY_DETAILS,
    SERVICE_SUMMARY,
    MONTHLY_CORPUS,
    GET_MEMBER_ID,
    GET_MWD_DATA,
    GET_MWD_TXT_SHEET,
    GENERATE_MWD_EXCEL,
    GENERATE_MANUAL_MWD_EXCEL,
    SET_MID,
    DOWNLOAD_TEMPLATE,
    CORPUS_SUMMARY,
    DOWNLOAD_7PS_EXCEL,
    DOWNLOAD_8PS_EXCEL,
    DOWNLOAD_7PS_ZIP,
    DOWNLOAD_8PS_ZIP,
    GET_MEMBER_DETAILS,
    SET_MEMBER_DETAILS,
    DOWNLOAD_7PS_CONSOLIDATED,
    DOWNLOAD_8PS_CONSOLIDATED,
    GET_ESTABLISHMENT_CODE,
    START_CORPUS_REPORT_JOB, GET_CORPUS_REPORT_JOBS, DOWNLOAD_REPORT, FETCH_JOB_DETAILS
} from "@/store/modules/pf/customerservice/types";

export default {
    [GET_PF_NUMBER]({ rootState}) {

        return new Promise((resolve, reject) => {

            axios.get("/customer-service/getPfNumber",
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + rootState.administrationModule.user.tokens.access
                    },
                })
                .then(response => {
                    console.log(response)
                    resolve(JSON.parse(response))
                })
                .catch(error => {
                    console.log(error)
                    reject(error.response.data.error)
                })

        })

    },
    [GET_FY_YEAR]({ rootState},pfNumber) {

        return new Promise((resolve, reject) => {

            axios.get("/customer-service/getFinancialYear?pfNumber="+pfNumber,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + rootState.administrationModule.user.tokens.access
                    }
                })
                .then(response => {
                    // console.log(response.data.response)
                    resolve(JSON.parse(response.data.response))
                })
                .catch(error => {
                    console.log(error)
                    reject(error.response.data.error)
                })

        })

    },
    [SEARCH_EMPLOYEE]({ rootState}, payload) {

        return new Promise((resolve, reject) => {

            let searchString = `${payload.search.length === 0 ? '' : payload.search}`

            axios.get("/customer-service/searchemployee?size=" + payload.size + "&page=" + payload.page + "&search=" + searchString,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + rootState.administrationModule.user.tokens.access
                    }
                })
                .then(response => {
                    // commit(UPDATE_REQUEST_STATUS, {
                    //     inProgress: false,
                    //     isSuccess: true,
                    //     isFailed: false,
                    //     message: ""
                    // })
                    // commit(SET_EMPLOYEES, response.data.response)
                    resolve(response.data.response)
                })
                .catch(error => {
                    console.log(error)
                    // commit(UPDATE_REQUEST_STATUS, {
                    //     inProgress: false,
                    //     isSuccess: false,
                    //     isFailed: true,
                    //     message: error.response.data.error
                    // })
                    reject(error.response.data.error)
                })

        })

    },
    [EMPLOYEE_DETAILS]({ rootState}, pfNumber) {

        return new Promise((resolve, reject) => {

            // let searchString = `${payload.search.length === 0 ? '' : payload.search}`

            axios.get("/customer-service/employeedetails?pfNumber=" + pfNumber,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + rootState.administrationModule.user.tokens.access
                    },
                    timeout: 180000
                })
                .then(response => {
                    resolve(JSON.parse(response.data.response))
                })
                .catch(error => {
                    console.log(error)
                    reject(error.response.data.error)
                })

        })

    },
    [MONTHLY_DETAILS]({ rootState}, payload) {

        return new Promise((resolve, reject) => {

            // let searchString = `${payload.search.length === 0 ? '' : payload.search}`

            axios.get("/customer-service/monthlydetails?pfNumber="+payload.pfNumber+"&fiscalYear="+payload.fiscalYear,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + rootState.administrationModule.user.tokens.access
                    }
                })
                .then(response => {
                    resolve(JSON.parse(response.data.response))
                })
                .catch(error => {
                    console.log(error)
                    reject(error.response.data.error)
                })

        })

    },
    [SERVICE_SUMMARY]({ rootState}, pfNumber) {

        return new Promise((resolve, reject) => {

            // let searchString = `${payload.search.length === 0 ? '' : payload.search}`

            axios.get("/customer-service/servicesummary?pfNumber="+pfNumber,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + rootState.administrationModule.user.tokens.access
                    }
                })
                .then(response => {
                    resolve(JSON.parse(response.data.response))
                })
                .catch(error => {
                    console.log(error)
                    reject(error.response.data.error)
                })

        })

    },
    [MONTHLY_CORPUS]({ rootState}, payload) {

        return new Promise((resolve, reject) => {

            // let searchString = `${payload.search.length === 0 ? '' : payload.search}`

            axios.get("/customer-service/corpusaccumulated?pfNumber="+payload.pfNumber+"&fiscalYear="+payload.fiscalYear,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + rootState.administrationModule.user.tokens.access
                    }
                })
                .then(response => {
                    resolve(JSON.parse(response.data.response))
                })
                .catch(error => {
                    console.log(error)
                    reject(error.response.data.error)
                })

        })

    },
    [GET_MEMBER_ID]({ rootState}, pfNumber) {

        return new Promise((resolve, reject) => {

            // let searchString = `${payload.search.length === 0 ? '' : payload.search}`

            axios.get("/customer-service/getMemberId?pfNumber="+pfNumber,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + rootState.administrationModule.user.tokens.access
                    }
                })
                .then(response => {
                    console.log(JSON.parse(response.data.response))
                    resolve(JSON.parse(response.data.response))
                })
                .catch(error => {
                    console.log(error)
                    reject(error.response.data.error)
                })

        })

    },
    [GET_MWD_DATA]({ rootState}, pfNumber) {

        return new Promise((resolve, reject) => {

            // let searchString = `${payload.search.length === 0 ? '' : payload.search}`

            axios.get("/customer-service/populate-mwd-data?pfNumber="+pfNumber,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + rootState.administrationModule.user.tokens.access
                    }
                })
                .then(response => {
                    console.log(JSON.parse(response.data.response))
                    resolve(JSON.parse(response.data.response))
                })
                .catch(error => {
                    console.log(error)
                    reject(error.response.data.error)
                })

        })

    },
    [GET_MWD_TXT_SHEET]({rootState}, pfNumber) {

        return new Promise((resolve, reject) => {

            axios.get("/customer-service/generate-mwd-file?pfNumber="+ pfNumber,
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
    [SET_MID]({ rootState}, payload) {

        return new Promise((resolve, reject) => {

            // let searchString = `${payload.search.length === 0 ? '' : payload.search}`

            axios.get("/customer-service/create-mid?mid="+payload.mid+"&pfNumber="+payload.pfNumber,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + rootState.administrationModule.user.tokens.access
                    }
                })
                .then(response => {
                    console.log(JSON.parse(response.data.response))
                    resolve(JSON.parse(response.data.response))
                })
                .catch(error => {
                    console.log(error)
                    reject(error.response.data.error)
                })

        })

    },
    [GENERATE_MWD_EXCEL]({rootState}, pfNumber) {

        return new Promise((resolve, reject) => {

            axios.get("/customer-service/create-mwd-excel?pfNumber="+pfNumber,
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
    [GENERATE_MANUAL_MWD_EXCEL]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.post("/mwd-service/create-manual-mwd-excel",data,
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
    [DOWNLOAD_TEMPLATE]({rootState}) {

        return new Promise((resolve, reject) => {

            axios.get("/mwd-service/downloadMWDTemplate",
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
    [CORPUS_SUMMARY]({ rootState}, pfNumber) {

        return new Promise((resolve, reject) => {

            // let searchString = `${payload.search.length === 0 ? '' : payload.search}`

            axios.get("/customer-service/corpussummary?pfNumber="+pfNumber,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + rootState.administrationModule.user.tokens.access
                    }
                })
                .then(response => {
                    resolve(JSON.parse(response.data.response))
                })
                .catch(error => {
                    console.log(error)
                    reject(error.response.data.error)
                })

        })

    },
    [DOWNLOAD_7PS_EXCEL]({rootState}, pfNumber) {

        return new Promise((resolve, reject) => {

            axios.get("/customer-service/mwd-data-for-7p?pfNumber="+ pfNumber,
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
    [DOWNLOAD_8PS_EXCEL]({rootState}, pfNumber) {

        return new Promise((resolve, reject) => {

            axios.get("/customer-service/mwd-data-for-8p?pfNumber="+ pfNumber,
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
    [DOWNLOAD_7PS_ZIP]({rootState}, pfNumber) {

        return new Promise((resolve, reject) => {

            axios.get("/customer-service/get7PsForm?pfNumber="+ pfNumber,
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
    [DOWNLOAD_7PS_CONSOLIDATED]({rootState}, pfNumber) {

        return new Promise((resolve, reject) => {

            axios.get("/customer-service/get7PsForm?pfNumber="+ pfNumber+"&generateSinglePdf=true",
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
    [DOWNLOAD_8PS_ZIP]({rootState}, pfNumber) {

        return new Promise((resolve, reject) => {

            axios.get("/customer-service/get8PsForm?pfNumber="+ pfNumber,
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
    [DOWNLOAD_8PS_CONSOLIDATED]({rootState}, pfNumber) {

        return new Promise((resolve, reject) => {

            axios.get("/customer-service/get8PsForm?pfNumber="+ pfNumber+"&generateSinglePdf=true",
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
    [GET_MEMBER_DETAILS]({ rootState}, pfNumber) {

        return new Promise((resolve, reject) => {

            // let searchString = `${payload.search.length === 0 ? '' : payload.search}`

            axios.get("/customer-service/getMember-details?pfNumber="+pfNumber,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + rootState.administrationModule.user.tokens.access
                    }
                })
                .then(response => {
                    console.log(JSON.parse(response.data.response))
                    resolve(JSON.parse(response.data.response))
                })
                .catch(error => {
                    console.log(error)
                    reject(error.response.data.error)
                })

        })

    },
    [SET_MEMBER_DETAILS]({ rootState}, memberDetails) {

        return new Promise((resolve, reject) => {

            // let searchString = `${payload.search.length === 0 ? '' : payload.search}`

            axios.put("/customer-service/save-member-details",memberDetails,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + rootState.administrationModule.user.tokens.access
                    }
                })
                .then(response => {
                    console.log(JSON.parse(response.data.response))
                    resolve(JSON.parse(response.data.response))
                })
                .catch(error => {
                    console.log(error)
                    reject(error.response.data.error)
                })

        })

    },
    [GET_ESTABLISHMENT_CODE]({ rootState}) {

        return new Promise((resolve, reject) => {

            axios.get("/customer-service/get-establishment-code",
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + rootState.administrationModule.user.tokens.access
                    },
                })
                .then(response => {
                    // console.log(response.data.response)
                    resolve(JSON.parse(response.data.response))
                })
                .catch(error => {
                    console.log(error)
                    reject(error.response.data.error)
                })

        })

    },
    [START_CORPUS_REPORT_JOB]({rootState}, job) {

        return new Promise((resolve, reject) => {

            axios.post("/customer-service/report", job,
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
    [GET_CORPUS_REPORT_JOBS]({rootState}) {

        return new Promise((resolve, reject) => {

            axios.get("/customer-service/jobs",
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
    [DOWNLOAD_REPORT]({rootState}, filePath) {

        return new Promise((resolve, reject) => {

            axios.get("/customer-service/download?filePath=" + filePath,
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
    [FETCH_JOB_DETAILS]({rootState}, jobId) {

        return new Promise((resolve, reject) => {

            axios.get("/customer-service/jobs/details?entityId=" + jobId,
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
}