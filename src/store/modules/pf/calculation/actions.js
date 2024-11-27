import axios from "axios";

import {
    GET_EXCEL,
    GET_FORM_A,
    GET_FORM_B
    } from "@/store/modules/pf/calculation/types";

export default {
    [GET_EXCEL]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.post("/calculation-service/generateExcel",data,
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
    [GET_FORM_A]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.post("/calculation-service/generateFormA",data,
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
    [GET_FORM_B]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.post("/calculation-service/generateFormB",data,
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