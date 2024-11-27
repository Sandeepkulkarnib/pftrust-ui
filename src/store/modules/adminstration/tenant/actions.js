import axios from "axios";
import {
    FETCH_EMAIL_TEMPLATES, FETCH_PDF_TEMPLATES,
    FETCH_TENANT_DETAILS, FETCH_TENANT_IMAGES,
    UPDATE_TENANT_THEME, UPLOAD,
    UPLOAD_TENANT_LOGO_IMAGE
} from "@/store/modules/adminstration/tenant/types";

export default {

    [FETCH_TENANT_DETAILS]({rootState}) {

        return new Promise((resolve, reject) => {

            axios.get("/tenants/details",
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
    [UPLOAD_TENANT_LOGO_IMAGE]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.put("/tenants/uploadLogoImage", data,
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
    [UPDATE_TENANT_THEME]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.put("/tenants/updateColorTheme", data,
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
    [UPLOAD]({rootState}, data) {

        return new Promise((resolve, reject) => {

            axios.post("/tenants/upload/", data.form,
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
    [FETCH_TENANT_IMAGES]({rootState}) {

        return new Promise((resolve, reject) => {

            axios.get("/tenants/images",
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
    [FETCH_EMAIL_TEMPLATES]({rootState}) {

        return new Promise((resolve, reject) => {

            axios.get("/tenants/emailTemplates",
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
    [FETCH_PDF_TEMPLATES]({rootState}) {

        return new Promise((resolve, reject) => {

            axios.get("/tenants/pdfTemplates",
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