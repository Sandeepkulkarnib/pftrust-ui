<template>
    <v-container>
        <v-row>
            <v-col>
                <v-toolbar flat>
                    <v-toolbar-title>{{ dashboardTitle }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <!-- <v-btn color="primary" dark @click.native="setDisplay()">
                        <v-icon> {{ mdi }} </v-icon> {{ btnText }}
                    </v-btn> -->
                </v-toolbar>
            </v-col>
        </v-row>
        <v-row class="ma-0 pa-0">
            <v-col cols="3">
                <v-text-field v-model="pfNumber" label="PF Number" required dense hint="Press Enter to load Financial Year"
                    persistent-hint @keydown.enter.native="getDetails" :rules="rules.pfNumberRules"></v-text-field>
            </v-col>
            <v-col cols="3" v-if="this.display == true">
                <v-select :items="fyYears" item-value="ficalYear" item-text="ficalYear" label="Select FY"
                    v-model="selectedFyYear" v-on:change="getContribution" dense></v-select>
            </v-col>
            <v-col cols="1" v-if="showProgress === true">
                <v-progress-circular indeterminate color="primary">
                </v-progress-circular>
            </v-col>
        </v-row>
        <v-row>
            <v-col v-if="this.display == true">
                <v-data-table :headers="headers" :items="contributions" :options.sync="options"
                    :server-items-length="contributionLength" class="elevation-1" :loading="loading"
                    loading-text="Loading... Please wait" key="id">
                    <template v-slot:top>
                        <!--   <v-toolbar flat>
                            <v-toolbar-title>Contribution Details</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" dark @click.stop="dialog = true">
                                <v-icon> mdi-content-paste </v-icon> Summary
                            </v-btn>

                        </v-toolbar>-->
                        <v-toolbar flat>
                            <v-spacer></v-spacer>
                            <v-row>
                                <v-spacer></v-spacer>
                                <v-col class="ma-0 pb-0"><v-toolbar-title style="font-size: 15px ;">Opening Interest Rate : {{ openingInterestRate
                                }}</v-toolbar-title></v-col>
                                <v-col class="ma-0 pb-0"><v-toolbar-title style="font-size: 15px ;">Opening Balance : {{ openingBalance
                                }}</v-toolbar-title></v-col>
                                <v-col class="ma-0 pb-0"><v-toolbar-title style="font-size: 15px ;">Closing Interest Rate : {{ closingInterestRate
                                }}</v-toolbar-title></v-col>
                                <v-col class="ma-0 pb-0"><v-toolbar-title style="font-size: 15px ;">Closing Balance : {{ closingBalance
                                }}</v-toolbar-title></v-col>
                                <!-- <v-spacer></v-spacer>      -->
                            </v-row>
                        </v-toolbar>
                    </template>
                    <template v-slot:footer>
                        <v-toolbar flat>
                            <v-spacer></v-spacer>
                            <v-row>
                                <v-spacer></v-spacer>
                                
                                
                                <!-- <v-spacer></v-spacer>      -->
                            </v-row>
                        </v-toolbar>
                    </template>
                </v-data-table>
            </v-col>
            <v-col v-if="this.display == false">
                <v-data-table :headers="summaryHeaders" :items="summaryStatement" :options.sync="options"
                    :server-items-length="contributionLength" class="elevation-1" :loading="loading"
                    loading-text="Loading... Please wait" key="id">
                </v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script>
import { isNotEmpty, isNumber } from "@/util/rules";

export default {
    name: "ExistingLoan",
    data() {
        return {
            mdi: "mdi-content-paste",
            dashboardTitle: "Monthly Corpus Payable Details For The Year",
            btnText: "Summary Service",
            display: true,
            pfNumber: "",
            showProgress: false,
            selectedFyYear: null,
            fyYears: [],
            contributionLength: 0,
            summaryStatementLength: 0,
            closingBalance: 0.00,
            closingInterestRate: "0%",
            openingBalance: 0.00,
            openingInterestRate: "0%",
            contributions: [],
            summaryStatement: [],
            loading: false,
            totalCost: '',
            appliedAmount: '',
            rules: {
                pfNumberRules: [
                    v => isNotEmpty(v, "PF No. is Required"),
                    v => isNumber(v, "Please Enter Valid PF Number")
                ]
            },
            // options: {
            //     itemsPerPage: 10,
            //     page: 1
            // },
            headers: [
                // {
                //     text: 'No. of Months',
                //     align: 'start',
                //     sortable: false,
                //     value: 'monthNumber',
                // },
                { text: 'Month & Year', sortable: false, value: 'yearAndMonth' },
                { text: 'Employee Contribution', sortable: false, value: 'employeeControbution' },
                { text: 'Employer PF Contribution', sortable: false, value: 'companyContribution' },
                { text: 'Employer EPS Contribution', sortable: false, value: 'eps' },
                { text: 'PF Base', sortable: false, value: 'PfBase' },
               
                { text: 'Actual EPS Contribution', sortable: false, value: 'actualPfBase' },
                { text: 'Difference for Higher Pension', sortable: false, value: 'differenceForHigherPension' },
                { text: 'Int. Rate', sortable: false, value: 'interestRate' },
                { text: 'Interest on Differential', sortable: false, value: 'interestOnDifferential' },
                { text: 'Total Amount payable', sortable: false, value: 'totalAmount' },
                { text: 'Admin Charges*', sortable: false, value: 'admin_interest' },
                // { text: 'Actual Interest', sortable: false, value: 'actualInterest' },

            ],
            // summaryHeaders: [
            //     {
            //         text: 'Fiscal Year',
            //         align: 'start',
            //         sortable: false,
            //         value: 'fiscalYear',
            //     },
            //     { text: 'Difference For Hire Pension', sortable: false, value: 'difHighPension' },
            //     { text: 'Interest Rate', sortable: false, value: 'interestRate' },
            //     { text: 'Interest On Differential', sortable: false, value: 'differentialInterest' },
            //     { text: 'Higher Pension Payable', sortable: false, value: 'totAmountPayable' },
            //     { text: 'YTD Payable Amount', sortable: false, value: 'ytdPayable' },
            //     { text: 'Closing Balance', sortable: false, value: 'closingBalance' }
            // ],
            // footerOptions: {
            //     "items-per-page-options": [10, 25, 100],
            // },
            dialog: false,
            dialog2: false,
            message: "<p></p>",
            stausMessage: "<p></p>"
        }
    },
    methods: {
        setDisplay() {
            if (this.display === true) {
                this.display = false
                this.dashboardTitle = "Service Summary"
                this.btnText = "Back"
                this.mdi = "mdi-arrow-left"
            } else {
                this.display = true
                // this.dashboardTitle = "Monthly Corpus Payable Details For The Year "
                this.btnText = "Summary Service"
                this.mdi = "mdi-content-paste"
            }
        },
        getDetails() {
            this.showProgress = true
            if (this.pfNumber !== "") {
                this.$store.dispatch("CustomerModule/getFinancialYear", this.pfNumber)
                    .then(response => {
                        console.log(response[0]['fiscalYear'])
                        console.log(response.length)
                        for (let i = 0; i < response.length; i++) {
                            // this.fyYears = response.data
                            this.fyYears.push(response[i]['fiscalYear'])
                            this.showProgress = false
                        }
                        console.log(this.fyYears)

                    })
                    .catch(error => console.log(error))
            }
        },
        getContribution() {
            this.loading = true
            var data = {
                pfNumber: this.pfNumber,
                fiscalYear: this.selectedFyYear
            }

            this.$store.dispatch("CustomerModule/monthlydetails", data)
                .then(response => {
                    console.log(response.monthly)
                    this.contributions = response.monthly
                    this.contributionLength = this.contributions.length
                    this.openingBalance = this.contributions[0]['differenceForHigherPension']
                    this.openingInterestRate = this.contributions[0]['interestRate']
                    this.closingBalance = this.contributions[13]['totalAmount']
                    this.closingInterestRate = this.contributions[13]['interestRate'] + "%"
                    this.loading = false
                    // console.log(this.contributions[0]['differenceForHigherPension'])
                })
                .catch(error => {
                    console.log(error)
                })
            
        },
        validate() {
            this.$refs.form.validate()

            if (this.$refs.form.validate()) {
                this.save()
            }
        },
        save() {
            let data = {
                loanCode: this.loanCode,
                loanGroup: this.loanGroup,
                loanTitle: this.loanTitle,
                tenure: this.tenure,
                withdrawal: this.withdrawal,
                retirementDate: this.retirementDate,
                nextEligibility: this.nextEligibility,
                pfBaseSalary: this.pfBaseSalary,
                memberContribution: this.memberContribution,
                companyContribution: this.companyContribution,
                vpfContribution: this.vpfContribution,
                totalCost: this.totalCost,
                appliedAmount: this.appliedAmount
            }
            let success = false
            this.$store.dispatch("loanModule/saveLoanType", data)
                .then(response => {
                    success = true;
                    console.log(response)
                    if (success) {
                        this.stausMessage = '<p>Success</p>'
                        this.message = '<p>New Loan Type is added successfully.</p>'
                        this.dialog2 = true;
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.stausMessage = '<p>Unable to save Loan Type</p>'
                    this.message = '<p>Loan Type with the same loan Code is already exists.</p>'
                    this.dialog2 = true;
                })
            this.$refs.form.reset()
        },
        reFresh() {
            this.$store.dispatch("loanModule/getLoanTypes")
                .then(response => {
                    this.loading = false
                    this.loanTypes = response
                    this.totalLoans = response.length
                })
                .catch(error => console.log(error))
        },
    },
    mounted() {
        this.$store.dispatch("CustomerModule/getPfNumber")
            .then(response => {
                console.log(response)
            })
            .catch(error => console.log(error))


    }
}




</script>
  
<style scoped>
a {
    color: #000;
}
</style>