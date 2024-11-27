<template>
    <v-container>
        <v-dialog v-model="responseView" max-width="80%">
            <v-card max-width="100%">
                <v-card-title>
                    Higher Pension Calculation Details
                    <v-spacer></v-spacer>
                    <v-icon small color="black darken-2" @click="responseView = false">
                        mdi-close
                    </v-icon>
                </v-card-title>
                <v-row class="pa-0 ma-4">
                    <v-col>
                        <v-card>
                            <v-card-text>
                                <b>Name : <p v-html="empName"></p></b>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card>
                            <v-card-text>
                                <b> Pf-Number : <p v-html="pf"></p></b>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card>
                            <v-card-text>
                                <b>Token Number : <p v-html="token"></p></b>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card>
                            <v-card-text>
                                <b>Unit Code : <p v-html="unit"></p></b>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row class="ma-4 pa-0 ">
                    <v-col cols="6">
                        <v-spacer></v-spacer>
                        <v-spacer></v-spacer>
                        <v-simple-table class="elevation-1" v-if="showData === true">
                            <template>
                                <tbody>
                                    <tr>
                                        <td>Data Available For The Period : </td>
                                        <td>{{ cuntributionPeriod }}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            First Contribution :
                                        </td>
                                        <td>{{ contributionYear + " Month : " + contributionMonth }}
                                        </td>
                                    </tr>
                                    <!-- <tr>
                                        <td>
                                            Last Contribution :
                                        </td>
                                        <td>{{ lastContributionYr + " Month : " + lastContributionMonth }}
                                        </td>
                                    </tr> -->
                                    <tr>
                                        <td>
                                            Membership Tenure in Years :
                                        </td>
                                        <td>
                                            {{ tenure }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                           Applicable Tenure in Years :
                                        </td>
                                        <td>
                                             {{ tenure }}<span v-if="parseInt(tenure) > 20"> + 2Yrs = {{ tenure + 2 }}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                        <!-- <v-card style="margin-top: 20px;" cols="12">
                        <v-card-title>
                            <span class="text-h6">Disclaimer</span>
                        </v-card-title>
                        <v-row class="ma-3 pa-1">
                            <v-card-text>Maximum applicable tenure is 35Yrs</v-card-text>
                        </v-row>
                        <v-simple-table>
                        </v-simple-table>
                    </v-card> -->
                    </v-col>
                    <v-col cols="6">
                        <v-spacer></v-spacer>
                        <v-spacer></v-spacer>
                        <v-simple-table class="elevation-1" v-if="showData === true">
                            <template>
                                <tbody>
                                    <tr>
                                        <td>Corpus value received/accumulated : </td>
                                        <td>{{ corpusValue }}</td>
                                    </tr>
                                    <!-- <tr>
                                        <td>
                                            EPS contribution estimated amount :
                                        </td>
                                        <td>
                                            {{ epsContributionActual }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Estimated actual EPS contribution amount :
                                        </td>
                                        <td>
                                            {{ epsPfJudgement }}
                                        </td>
                                    </tr> -->
                                    <tr>
                                        <td>Estimated corpus payback :</td>
                                        <td>{{ corpusPayBack }}</td>
                                    </tr>
                                    <tr>
                                        <td>New Higher Pension :</td>
                                        <td>{{ newPension }}</td>
                                    </tr>
                                    <tr>
                                         
                                        <td style="font-size: 12px;"> NOTE : 
                                           <ol>1. Estimated corpus payback includes admin charges of Rs.<b>{{ adminInterest }}.00</b> (1.16% of the difference of wages and 15000, for the wage months on or after Sept 2014)</ol>
                                           <ol>2. All Values are in <b> Indian Rupees </b></ol>
                                        </td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-col>
                </v-row>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark @click="responseView = false">
                        OK
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-row>
            <v-col>
                <v-data-table :headers="headers" :items="employees" class="elevation-1" :loading="loading"
                    :options.sync="options" :server-items-length="totalEmployees" :footer-props="footerOptions"
                    loading-text="Loading... Please wait" key="pfNumber">
                    <template v-slot:top>
                        <v-row>
                            <v-col cols="6">
                                <v-toolbar flat>
                                    <v-toolbar-title>Search Employees
                                    </v-toolbar-title>
                                    <v-text-field hide-details single-line placeholder="search" class="ml-4"
                                        v-model="search" dense hint="Press Enter Search Employee" persistent-hint
                                        @keydown.enter.native="searchEmployee()"></v-text-field>
                                </v-toolbar>
                            </v-col>
                            <v-col cols="6" v-if="dis">
                                <v-toolbar flat>
                                    <p style="font-size: 15px;">Please Wait While we Fetch Data From <span
                                            style="color: red;"> 6200000 </span> Records In Our System, It May Take Some
                                        Time</p>
                                </v-toolbar>
                            </v-col>
                        </v-row>
                        <v-row class="ma-2 ml-2" v-if="showProgress === true">
                            <v-col>
                                <v-progress-circular indeterminate color="primary">
                                </v-progress-circular>
                                <P style="color:red">{{ statusMessage }}</P>
                            </v-col>
                        </v-row>
                    </template>

                    <template v-slot:[`item.pfNumber`]="{ item }">


                        <!-- <v-btn text color="primary" @click.native="loadData(item.pfNumber)">
                            {{ item.pfNumber }}
                        </v-btn> -->
                        <v-btn text color="primary" @click.native="loadData(item)">
                            {{ item.pfNumber }}
                        </v-btn>

                    </template>

                </v-data-table>
            </v-col>
        </v-row>

        <!-- <v-row class="ma-4 pa-0 ">
            <v-col cols="6">
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-simple-table class="elevation-1" v-if="showData === true">
                    <template>
                        <tbody>
                            <tr>
                                <td>Corpus value received/accumulated : </td>
                                <td>{{ corpusValue }}</td>
                            </tr>
                            <tr>
                                <td>
                                    EPS contribution estimated amount :
                                </td>
                                <td>
                                    {{ epsContributionActual }}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Estimated actual EPS contribution amount :
                                </td>
                                <td>
                                    {{ epsPfJudgement }}
                                </td>
                            </tr>
                            <tr>
                                <td>Estimated corpus payback :</td>
                                <td>{{ corpusPayBack }}</td>
                            </tr>
                            <tr>
                                <td>New Higher Pension :</td>
                                <td>{{ newPension }}</td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
            <v-col cols="6">
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-simple-table class="elevation-1" v-if="showData === true">
                    <template>
                        <tbody>
                            <tr>
                                <td>Data Available For The Period : </td>
                                <td>{{ cuntributionPeriod }}</td>
                            </tr>
                            <tr>
                                <td>
                                    Contribution Started On :
                                </td>
                                <td>{{ contributionYear + " Month : " + contributionMonth }}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Membership Tenure in Years :
                                </td>
                                <td>
                                    {{ tenure }}
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row> -->
    </v-container>
</template>
  
<script>

import fileDownload from 'js-file-download'

export default {
    name: "SearchEmployee",
    data() {
        return {
            adminInterest: "",
            lastContributionYr: "",
            lastContributionMonth: "",
            empName: "",
            token: "",
            pf: "",
            unit: "",
            responseView: false,
            dis: false,
            cuntributionPeriod: "",
            contributionYear: "",
            contributionMonth: "",
            tenure: "",
            corpusValue: "",
            epsContributionActual: "",
            epsPfJudgement: "",
            corpusPayBack: "",
            newPension: "",
            statusMessage: "Please Wait While we Fetch Data From 5278467 Records In Our System, It May Take Some",
            showProgress: false,
            showData: false,
            totalEmployees: 0,
            employees: [],
            loading: false,
            options: {
                itemsPerPage: 10,
                page: 1
            },
            headers: [
                {
                    text: 'Pf No.',
                    align: 'start',
                    sortable: false,
                    value: 'pfNumber',
                },
                { text: 'Pernr No.', sortable: false, value: 'pernNumber' },
                { text: 'Token No', sortable: false, value: 'tokenNumber' },
                { text: 'Name', sortable: false, value: 'name' },
                { text: 'UnitCode', sortable: false, value: 'unitCode' },
                // { text: 'Status', sortable: false, value: 'status' },
            ],
            footerOptions: {
                "items-per-page-options": [10, 25, 100],
            },
            search: "",
            dialog: false,
            selectedUnitCodes: [],
            interval: null,
            dateType: ["Date of Joining PF", "Date of Joining Service"],
            selectedDateType: "Date of Joining PF",
            menu: false,
            dates: [],
            downloading: false,
            downloadingError: false,
            selectedContributionStatusList: []
        }
    },
    watch: {
        options: {
            handler() {

                if (parseInt(this.$route.query.size) !== this.options.itemsPerPage
                    || parseInt(this.$route.query.page) !== this.options.page) {
                    this.$router.push({ path: this.$route.path, query: { size: this.options.itemsPerPage, page: this.options.page } })
                }

                // this.getEmployees()
            },
            deep: true,
        },
    },
    methods: {
        searchEmployee() {
            if (this.search !== null && this.search !== undefined && (this.search.trim().length > 0 || this.search.trim().length === 0)) {
                this.getEmployees()
            }
        },
        loadData(item) {
            // console.log("im here")
            this.showProgress = true;
            this.empName = item.name
            this.pf = item.pfNumber
            this.token = item.tokenNumber
            this.unit = item.unitCode
            console.log(item)
            // window.scrollToView('100', '100vh')
            this.$store.dispatch("CustomerModule/employeedetails", item.pfNumber)
                .then(response => {
                    console.log(response)
                    this.data = response
                    this.cuntributionPeriod = this.data.cuntributionPeriod
                    this.contributionYear = this.data.contributionYear
                    this.contributionMonth = this.data.contributionMonth
                    this.tenure = this.data.tenure
                    this.corpusValue = this.data.corpusValue
                    this.epsContributionActual = this.data.epsContributionActual
                    this.epsPfJudgement = this.data.epsPfJudgement
                    this.corpusPayBack = this.data.corpusPayBack
                    this.newPension = this.data.newPension
                    this.adminInterest = this.data.adminInterest
                    this.showProgress = false;
                    this.showData = true;
                    this.responseView = true;
                    this.statusMessage = "Please Wait While We Fetching Data, It May Take Some Time"
                })
                .catch(error => {
                    console.log(error)
                })

        },
        getEmployees() {
            this.loading = true
            this.dis = true;
            this.$store.dispatch("CustomerModule/searchemployee", {
                size: this.options.itemsPerPage,
                page: this.options.page,
                search: this.search
            })
                .then(response => {
                    this.employees = response.content
                    this.totalEmployees = response.totalElements
                    this.loading = true
                    this.dis = false;
                })
                .catch(error => {
                    console.log(error)
                })
        },
        download(fileName) {
            this.$store.dispatch("employeeModule/downloadEmployeeReport", fileName)
                .then(response => {
                    fileDownload(response.data, fileName)
                    this.downloading = false
                    this.dialog = false
                    this.selectedUnitCodes = []
                    this.dates = []
                    this.selectedContributionStatusList = []
                })
                .catch(error => {
                    console.log(error)
                })
        },
        generateReport() {

            this.downloading = true

            let data = {
                "params": JSON.stringify({
                    "unitCodes": this.selectedUnitCodes,
                    "dateType": this.selectedDateType,
                    "dates": this.dates,
                    "contributionStatusList": this.selectedContributionStatusList
                })
            }

            this.$store.dispatch("employeeModule/startReportJob", data)
                .then(response => {
                    this.trackJobForDownload(response.entityId)
                })
                .catch(error => {
                    console.log(error)
                    this.downloading = false
                    this.downloadingError = true
                })

        },
        trackJobForDownload(jobId) {
            let track = setInterval(() => this.trackJob(jobId, track), 5000)
        },
        trackJob(jobId, track) {
            this.$store.dispatch("employeeModule/fetchJobDetails", jobId)
                .then(response => {
                    if (response.status === "completed") {
                        clearInterval(track)
                        this.download(response.fileName)
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.downloading = false
                    this.downloadingError = true
                    clearInterval(track)
                })
        },
        toggle() {
            this.$nextTick(() => {
                if (this.selectedAllUnitCodes) {
                    this.selectedUnitCodes = []
                } else {
                    this.selectedUnitCodes = this.unitCodes.slice()
                }
            })
        }
    },
    computed: {
        unitCodes() {
            return this.$store.state.employeeModule.unitCodes.map(code => code.unitCode)
        },
        dateRangeText() {
            return this.dates.join(' ~ ')
        },
        contributionStatusList() {
            return this.$store.state.employeeModule.contributionStatusList
        },
        selectedAllUnitCodes() {
            return this.selectedUnitCodes.length === this.unitCodes.length
        },
        selectedSomeUnitCodes() {
            return this.selectedUnitCodes.length > 0 && !this.selectedAllUnitCodes
        },
        icon() {
            if (this.selectedAllUnitCodes) return 'mdi-close-box'
            if (this.selectedSomeUnitCodes) return 'mdi-minus-box'
            return 'mdi-checkbox-blank-outline'
        }
    },
    mounted() {

    }

}




</script>
  
<style scoped>
a {
    color: #000;
}
</style>