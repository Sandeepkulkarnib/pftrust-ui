import axios from "axios";


import {
        GET_MEMBER_ID,
        GET_MWD_DATA,
        GET_MWD_TXT_SHEET,
        GENERATE_MWD_EXCEL,
        GENERATE_FORM3A_PDF,
        GENERATE_FORM3A_EXCEL
    } from "@/store/modules/pf/hpcservice/types";

export default {
    
    [GET_MEMBER_ID]({ rootState}, memberId) {

        return new Promise((resolve, reject) => {

            // let searchString = `${payload.search.length === 0 ? '' : payload.search}`

            axios.get("/hpc-service/getEmployee?memberId="+memberId,
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
    [GET_MWD_DATA]({ rootState}, memberId) {

        return new Promise((resolve, reject) => {

            // let searchString = `${payload.search.length === 0 ? '' : payload.search}`

            axios.get("/hpc-service/getMwdData?memberId="+memberId,
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
    [GET_MWD_TXT_SHEET]({rootState}, memberId) {

        return new Promise((resolve, reject) => {

            axios.get("/hpc-service/getMwdTextFile?memberId="+ memberId,
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
    [GENERATE_MWD_EXCEL]({rootState}, memberId) {

        return new Promise((resolve, reject) => {

            axios.get("/hpc-service/getMwdExcelFile?memberId="+memberId,
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
    [GENERATE_FORM3A_PDF]({rootState}, memberId) {

        return new Promise((resolve, reject) => {

            axios.get("/hpc-service/getForm3A?memberId="+memberId,
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
    [GENERATE_FORM3A_EXCEL]({rootState}, memberId) {

        return new Promise((resolve, reject) => {

            axios.get("/hpc-service/form3AExcel?memberId="+memberId,
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

    }
}