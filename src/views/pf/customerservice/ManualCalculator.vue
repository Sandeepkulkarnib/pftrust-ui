<template>
    <v-container>
        <v-card>
            <!-- <v-card-title>
                <span class="text-h5">Manual EPS Calculation</span>
            </v-card-title> -->

            <v-row class="ma-4 pa-0">
                <v-col cols="6">
                    <!-- <v-card> -->
                    <v-form ref="form">
                        <v-card-title>
                            <span class="text-h6">EPS Calculation Form</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field label="PF NO." v-model="pfNumber"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field label="Pern NO." v-model="pernNumber"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field label="Mobile NO." v-model="mobNumber"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field label="Employee Name*" v-model="empName" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field label="Corpus Value*" v-model="corpusValue" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :nudge-right="40"
                                            :return-value.sync="joiningDate" lazy transition="scale-transition" offset-y
                                            full-width min-width="290px">
                                            <template v-slot:activator="{ on }">
                                                <v-text-field v-model="joiningDate" label="Date Of Joining PF*" readonly
                                                    v-on="on"></v-text-field>
                                            </template>
                                            <v-date-picker v-model="joiningDate" no-title scrollable>
                                                <v-spacer></v-spacer>
                                                <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                                                <v-btn flat color="primary" @click="$refs.menu.save(joiningDate)">OK</v-btn>
                                            </v-date-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" sm="3" md="3">
                                        <v-text-field label="Break In PF*" v-model="year" persistent-hint hint="In Years"
                                            required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="3" md="3">
                                        <v-text-field label="Break In PF*" v-model="month" persistent-hint hint="In Months"
                                            required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-dialog ref="dialog" v-model="modal" :return-value.sync="retirementDate"
                                            persistent lazy full-width width="290px">
                                            <template v-slot:activator="{ on }">
                                                <v-text-field v-model="retirementDate" label="Date Of Retirement*" readonly
                                                    v-on="on" hint="If not selected 31-03-2023 is considered"></v-text-field>
                                            </template>
                                            <v-date-picker v-model="retirementDate" scrollable>
                                                <v-spacer></v-spacer>
                                                <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
                                                <v-btn flat color="primary"
                                                    @click="$refs.dialog.save(retirementDate)">OK</v-btn>
                                            </v-date-picker>
                                        </v-dialog>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field label="PF Base" v-model="pfBase" persistent-hint
                                            hint="Average Of 60 Months" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field label="Total Years Of Service" v-model="tenure" persistent-hint
                                            hint="Total Years Of Service in years" required></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <small>*indicates required field</small>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue-darken-1" variant="text" @click.native="reset()">
                                Reset
                            </v-btn>
                            <v-btn color="primary" variant="text" @click.native="calculate()">
                                Submit
                            </v-btn>
                        </v-card-actions>
                        <!-- </v-card> -->
                    </v-form>
                </v-col>
                <v-col cols="6">
                    <v-card>
                        <v-card-title>
                            <span class="text-h6">EPS Calculation Result</span>
                        </v-card-title>
                        <v-simple-table>
                            <template>
                                <tbody>
                                    <tr>
                                        <td>Corpus Value Received : </td>
                                        <td>{{ corpusValue }}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            EPS contribution estimated amount
                                        </td>
                                        <td>
                                            {{ estimatedEps }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Estimated actual EPS contribution amount :
                                        </td>
                                        <td>
                                            {{ actualEps }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Estimated corpus payback :</td>
                                        <td>{{ corpusPayBack }}</td>
                                    </tr>
                                    <tr>
                                        <td>New Higher Pension :</td>
                                        <td>{{ newHighPension }}</td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-card>
                    <v-card style="margin-top: 20px;" cols="12">
                        <v-card-title>
                            <span class="text-h6">Disclaimer</span>
                        </v-card-title>
                        <v-row class="ma-3 pa-1">
                            <h5 style="color:red"> Calculation is totally babsed on the inputs given by the user <br> Since interest rates are not considered, result may differ </h5>
                        </v-row>
                        <!-- <v-simple-table>
                        </v-simple-table> -->
                    </v-card>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>
<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.3/moment-with-locales.min.js"
integrity="sha512-vFABRuf5oGUaztndx4KoAEUVQnOvAIFs59y4tO0DILGWhQiFnFHiR+ZJfxLDyJlXgeut9Z07Svuvm+1Jv89w5g=="
crossorigin="anonymous" referrerpolicy="no-referrer"></script> -->
<script>

import fileDownload from 'js-file-download'
import moment from 'moment'

export default {
    name: "SearchEmployee",
    data() {
        return {
            year: 0,
            month: 0,
            tenure: 0,
            pfNumber: '',
            pernNumber: '',
            mobNumber: '',
            empName: '',
            corpusValue: null,
            retirementDate: null,
            estimatedEps: null,
            actualEps : null,
            corpusPayBack : null,
            newHighPension : null,
            joiningDate: null,
            showData: false,
            totalEmployees: 0,
            employees: [],
            loading: true,
            headers: [
                {
                    text: 'Pernr No.',
                    align: 'start',
                    sortable: false,
                    value: 'pernNumber',
                },
                { text: 'Pf No.', sortable: false, value: 'pfNumber' },
                { text: 'Token No', sortable: false, value: 'tokenNumber' },
                { text: 'Name', sortable: false, value: 'name' },
                { text: 'UnitCode', sortable: false, value: 'unitCode' },
                { text: 'Status', sortable: false, value: 'status' },
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

                this.getEmployees()
            },
            deep: true,
        },
        search() {
            if (this.search !== null && this.search !== undefined && (this.search.trim().length > 0 || this.search.trim().length === 0)) {
                this.getEmployees()
            }
        }
    },
    methods: {
        calculate() {
            let slab = [
                {
                    startDate: "1995-10-01",
                    endDate: "2001-05-31",
                    slabAMount: 5000
                },
                {
                    startDate: "2001-06-01",
                    endDate: "2014-08-31",
                    slabAMount: 6500
                },
                {
                    startDate: "2014-09-01",
                    endDate: "2023-05-31",
                    slabAMount: 15000
                }
            ]

            var belongingSlab = 0;
        if(moment(slab[0]['startDate']).diff(moment(this.joiningDate),'months') < 0){
            if(moment(slab[0]['endDate']).diff(moment(this.joiningDate),'months') > 0){
                belongingSlab = 1;
            }
        }
        if(moment(slab[1]['startDate']).diff(moment(this.joiningDate),'months') < 0){
            if(moment(slab[1]['endDate']).diff(moment(this.joiningDate),'months') > 0){
                belongingSlab = 2;
            }
        }
        if(moment(slab[2]['startDate']).diff(moment(this.joiningDate),'months') < 0){
            if(moment(slab[2]['endDate']).diff(moment(this.joiningDate),'months') > 0){
                belongingSlab = 3;
            }
        }
        console.log("slab "+belongingSlab)
        
        let retirementBelonging = 0;
        if(moment(slab[0]['startDate']).diff(moment(this.retirementDate),'months') < 0){
            if(moment(slab[0]['endDate']).diff(moment(this.retirementDate),'months') > 0){
                retirementBelonging = 1;
            }
        }
        if(moment(slab[1]['startDate']).diff(moment(this.retirementDate),'months') < 0){
            if(moment(slab[1]['endDate']).diff(moment(this.retirementDate),'months') > 0){
                retirementBelonging = 2;
            }
        }
        if(moment(slab[2]['startDate']).diff(moment(this.retirementDate),'months') < 0){
            if(moment(slab[2]['endDate']).diff(moment(this.retirementDate),'months') > 0){
                retirementBelonging = 3;
            }
        }
        console.log("retirement slab "+retirementBelonging)

           let slabone = 0;
           let slabtwo = 0;
           let slabthree = 0;
            let slab_one_amount = 0;
            let slab_two_amount = 0;

           console.log(belongingSlab); 
            if(!this.retirementDate){
                if(belongingSlab === 1){
                    let date1 = moment(this.joiningDate)
                    let date2 = moment(slab[0]['endDate'])
                    let difference_in_month = parseInt(date2.diff(date1,'months'))
                    slab_one_amount = difference_in_month * slab[0]['slabAMount']
                    slabone = slab_one_amount
                    console.log(slab_one_amount)
                    let date3 = moment(slab[1]['startDate'])
                    let date4 = moment(slab[1]['endDate'])
                    let difference_in_month2 = parseInt(date4.diff(date3,'months'))
                    console.log(difference_in_month2)
                    slab_two_amount = difference_in_month2 * slab[1]['slabAMount']
                    slabtwo = slab_two_amount
                    console.log(slab_two_amount)
                    let date5 = moment(slab[2]['startDate'])
                    let date6 = moment(slab[2]['endDate'])
                    let difference_in_month3 = parseInt(date6.diff(date5,'months'))
                    console.log(difference_in_month3)
                    let slab_three_amount = difference_in_month3 * slab[2]['slabAMount']
                    slabthree = slab_three_amount
                    console.log(slab_three_amount)
                }else if(belongingSlab === 2){
                    let date3 = moment(this.joiningDate)
                    let date4 = moment(slab[1]['endDate'])
                    let difference_in_month2 = parseInt(date4.diff(date3,'months'))
                    console.log(difference_in_month2)
                    let slab_two_amount = difference_in_month2 * slab[1]['slabAMount']
                    slabtwo = slab_two_amount
                    console.log(slab_two_amount)
                    let date5 = moment(slab[2]['startDate'])
                    let date6 = moment(slab[2]['endDate'])
                    let difference_in_month3 = parseInt(date6.diff(date5,'months'))
                    console.log(difference_in_month3)
                    let slab_three_amount = difference_in_month3 * slab[2]['slabAMount']
                    slabthree = slab_three_amount
                    console.log(slab_three_amount)
                }else if(belongingSlab === 3){
                    let date5 = moment(this.joiningDate)
                    let date6 = moment(slab[2]['endDate'])
                    let difference_in_month3 = parseInt(date6.diff(date5,'months'))
                    console.log(difference_in_month3)
                    let slab_three_amount = difference_in_month3 * slab[2]['slabAMount']
                    slabthree = slab_three_amount
                    console.log(slab_three_amount)
                }else{
                    alert("User doesnot belong to the pension scheme 1995")
                }
            }
                // let retirementBelonging = 0;
                // if (moment(slab[0]['startDate']) <= moment(this.retirementDate) && moment(slab[0]['endtDate']) >= moment(this.retirementDate) ){
                //     retirementBelonging = 1;
                // }else if(moment(slab[1]['startDate']) <= moment(this.retirementDate) && moment(slab[1]['endtDate']) >= moment(this.retirementDate)){
                //     retirementBelonging = 2;
                // }else if(moment(slab[1]['startDate']) <= moment(this.retirementDate) && moment(slab[1]['endtDate']) >= moment(this.retirementDate)){
                //     retirementBelonging = 3;
                // }else {
                //     retirementBelonging = 0;
                // }
                if(this.retirementDate){
                    if(belongingSlab === 1 && retirementBelonging === 1){
                        let date1 = moment(this.joiningDate)
                        let date2 = moment(this.retirementDate)
                        let difference_in_month = parseInt(date2.diff(date1,'months'))
                        slab_one_amount = difference_in_month * slab[0]['slabAMount']
                        slabone = slab_one_amount
                        console.log(slab_one_amount)
                    } 
                    if(belongingSlab === 1 && retirementBelonging === 2){
                        let date1 = moment(this.joiningDate)
                        let date2 = moment(slab[0]['endDate'])
                        let difference_in_month = parseInt(date2.diff(date1,'months'))
                        slab_one_amount = difference_in_month * slab[0]['slabAMount']
                        slabone = slab_one_amount
                        console.log(slab_one_amount)
                        let date3 = moment(slab[1]['startDate'])
                        let date4 = moment(this.retirementDate)
                        let difference_in_month2 = parseInt(date4.diff(date3,'months'))
                        console.log(difference_in_month2)
                        let slab_two_amount = difference_in_month2 * slab[1]['slabAMount']
                        slabtwo = slab_two_amount
                        console.log(slab_two_amount)
                    }
                    if(belongingSlab === 1 && retirementBelonging === 3){
                        let date1 = moment(this.joiningDate)
                        let date2 = moment(slab[0]['endDate'])
                        let difference_in_month = parseInt(date2.diff(date1,'months'))
                        slab_one_amount = difference_in_month * slab[0]['slabAMount']
                        slabone = slab_one_amount
                        console.log(slab_one_amount)
                        let date3 = moment(slab[1]['startDate'])
                        let date4 = moment(slab[1]['endDate'])
                        let difference_in_month2 = parseInt(date4.diff(date3,'months'))
                        console.log(difference_in_month2)
                        let slab_two_amount = difference_in_month2 * slab[1]['slabAMount']
                        slabtwo = slab_two_amount
                        console.log(slab_two_amount)
                        let date5 = moment(slab[2]['startDate'])
                        let date6 = moment(this.retirementDate)
                        let difference_in_month3 = parseInt(date6.diff(date5,'months'))
                        console.log(difference_in_month3)
                        let slab_three_amount = difference_in_month3 * slab[2]['slabAMount']
                        slabthree = slab_three_amount
                        console.log(slab_three_amount)
                    }
                    if (belongingSlab === 2 && retirementBelonging === 2){
                        let date3 = moment(this.joiningDate)
                        let date4 = moment(this.retirementDate)
                        let difference_in_month2 = parseInt(date4.diff(date3,'months'))
                        console.log(difference_in_month2)
                        let slab_two_amount = difference_in_month2 * slab[1]['slabAMount']
                        slabtwo = slab_two_amount
                        console.log(slab_two_amount)
                    }
                    if (belongingSlab === 2 && retirementBelonging === 3){
                        console.log("im here")
                        let date3 = moment(this.joiningDate)
                        let date4 = moment(slab[1]['endDate'])
                        let difference_in_month2 = parseInt(date4.diff(date3,'months'))
                        console.log(difference_in_month2)
                        let slab_two_amount = difference_in_month2 * slab[1]['slabAMount']
                        slabtwo = slab_two_amount
                        console.log(slab_two_amount)
                        let date5 = moment(slab[2]['startDate'])
                        let date6 = moment(this.retirementBelonging)
                        let difference_in_month3 = parseInt(date6.diff(date5,'months'))
                        console.log(difference_in_month3)
                        let slab_three_amount = difference_in_month3 * slab[2]['slabAMount']
                        slabthree = slab_three_amount
                        console.log(slab_three_amount)
                    }
                    if (belongingSlab === 3 && retirementBelonging === 3){
                        let date5 = moment(this.joiningDate)
                        let date6 = moment(this.retirementBelonging)
                        let difference_in_month3 = parseInt(date6.diff(date5,'months'))
                        console.log(difference_in_month3)
                        let slab_three_amount = difference_in_month3 * slab[2]['slabAMount']
                        slabthree = slab_three_amount
                        console.log(slab_three_amount)
                    }
            }
            let deduct = (this.year*12 + this.month)*slab[1]['slabAMount']
            let total = slabone+slabtwo+slabthree
            console.log(this.tenure)
            if(this.tenure > 20){
                this.tenure = parseInt(this.tenure) + 2;
                console.log("tenure1 "+this.tenure)
            }

            if(this.tenure > 35){
                this.tenure = 35;
                console.log("tenure2 "+this.tenure)
            }

            this.estimatedEps = (total-deduct) * (8.33/100)
            this.actualEps = (parseInt(this.corpusValue) + this.estimatedEps)*(35/100)
            this.actualEps = (Math.round(this.actualEps * 100) / 100).toFixed(2);
            this.corpusPayBack = (this.actualEps - this.estimatedEps).toFixed(2);
            let actualTenure = (this.tenure*12) - (this.year+this.month) 
            this.newHighPension = ((this.pfBase*(actualTenure/12))/70).toFixed(2)
        },
        reset() {
            this.$refs.form.reset()
        },
        loadData() { 
            console.log("im here")
            this.showData = true;
        },
        getEmployees() {
            this.$store.dispatch("employeeModule/fetchEmployees", {
                size: this.options.itemsPerPage,
                page: this.options.page,
                search: this.search
            })
                .then(response => {
                    this.employees = response.content
                    this.totalEmployees = response.totalElements
                    this.loading = false
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
        // this.options = {
        //     itemsPerPage: this.$route.query.size === undefined ? 10 : parseInt(this.$route.query.size),
        //     page: this.$route.query.page === undefined ? 1 : parseInt(this.$route.query.page)
        // }

        // if (this.unitCodes.length < 1) {
        //     this.$store.dispatch("employeeModule/fetchCommons")
        //         .then(response => console.log(response))
        //         .catch(error => console.log(error))
        // }

        // this.employees = [
        //     {
        //         pernNumber: "90000000",
        //         pfNumber: "19129",
        //         tokenNumber: "200001",
        //         name: "Mahindra Anand Gopal",
        //         unitCode: "899000",
        //         status: "A"

        //     }
        // ]

        this.loading = false

    }

}




</script>
  
<style scoped>
a {
    color: #000;
}
</style>