<template>
    <v-container>
        <v-row>
            <v-col>
                <v-toolbar flat>
                    <v-toolbar-title>Last 60 Months Contribution</v-toolbar-title>
                </v-toolbar>
            </v-col>
        </v-row>
        <v-row class="ma-0 pa-0">
            <v-col cols="3">
                <v-text-field v-model="pfNumber" label="PF Number" required dense hint="Press Enter to load Financial Year"
                    persistent-hint @keydown.enter.native="getDetails" :rules="rules.pfNumberRules"></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col v-if="this.display == true">
                <v-data-table :headers="headers" :items="contributions" :options.sync="options"
                    :server-items-length="contributionLength" class="elevation-1" :loading="loading"
                    loading-text="Loading... Please wait" key="id">
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
import { isNotEmpty,isNumber  } from "@/util/rules";

export default {
    name: "ExistingLoan",
    data() {
        return {
            mdi: "mdi-content-paste",
            dashboardTitle: "Monthly Contribution Details For The Year",
            btnText: "Summary",
            display: true,
            pfNumber: "",
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
                {
                    text: 'No. of Months',
                    align: 'start',
                    sortable: false,
                    value: 'monthNo',
                },
                { text: 'Month & Year', sortable: false, value: 'month' },
                { text: 'Employee', sortable: false, value: 'employeePf' },
                { text: 'Employer', sortable: false, value: 'employerPf' },
                { text: 'EPS', sortable: false, value: 'eps' },
                { text: 'PF Base', sortable: false, value: 'pfBase' },
                { text: 'Actual Interest', sortable: false, value: 'actualInterest' },
                { text: 'actual PF Base', sortable: false, value: 'actualPfBase' },
                { text: 'Difference for Hire Pension', sortable: false, value: 'hirePerson' },
                { text: 'Int. Rate', sortable: false, value: 'interestRate' },
                { text: 'Interest on Differential', sortable: false, value: 'interestDifferential' },
                { text: 'Total Amount payable', sortable: false, value: 'totAmountPayable' },

            ],
            summaryHeaders: [
                {
                    text: 'Fiscal Year',
                    align: 'start',
                    sortable: false,
                    value: 'fiscalYear',
                },
                { text: 'Difference For Hire Pension', sortable: false, value: 'difHighPension' },
                { text: 'Interest Rate', sortable: false, value: 'interestRate' },
                { text: 'Interest On Differential', sortable: false, value: 'differentialInterest' },
                { text: 'Higher Pension Payable', sortable: false, value: 'totAmountPayable' },
                { text: 'YTD Payable Amount', sortable: false, value: 'ytdPayable' },
                { text: 'Closing Balance', sortable: false, value: 'closingBalance' }
            ],
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
                this.dashboardTitle = "Yearly Details For Service Years"
                this.btnText = "Back"
                this.mdi = "mdi-arrow-left"
            } else {
                this.display = true
                this.dashboardTitle = "Monthly Contribution Details For The Year "
                this.btnText = "Summary"
                this.mdi = "mdi-content-paste"
            }
        },
        getDetails() {
            if(this.pfNumber !== ""){
                // this.$store.dispatch("CustomerModule/getFinancialYear")
                //     .then(response => {
                //         console.log(response)
                //         this.fyYears = response
                //     })
                //     .catch(error => console.log(error))
                this.getContribution();
                }
        },
        getContribution(){
            this.loading = true
            this.contributions = [
            {
                monthNo: 11,
                month: "Apr-10",
                employeePf: 4528.00,
                employerPf: 3987.00,
                eps: 541.00,
                pfBase: 37733,
                actualInterest: "8.33%",
                actualPfBase: 3143,
                hirePerson: 2602.00,
                interestRate: "9.50%",
                interestDifferential: 227,
                totAmountPayable: 2829.00
            },
            {
                monthNo: 10,
                month: "May-10",
                employeePf: 4528.00,
                employerPf: 3987.00,
                eps: 541.00,
                pfBase: 37733,
                actualInterest: "8.33%",
                actualPfBase: 3143,
                hirePerson: 2602.00,
                interestRate: "9.50%",
                interestDifferential: 206,
                totAmountPayable: 2808.00
            },
            {
                monthNo: 9,
                month: "Jun-10",
                employeePf: 4528.00,
                employerPf: 3987.00,
                eps: 541.00,
                pfBase: 37733,
                actualInterest: "8.33%",
                actualPfBase: 3143,
                hirePerson: 2602.00,
                interestRate: "9.50%",
                interestDifferential: 185,
                totAmountPayable: 2787.00
            },
            {
                monthNo: 8,
                month: "Jul-10",
                employeePf: 4528.00,
                employerPf: 3987.00,
                eps: 541.00,
                pfBase: 37733,
                actualInterest: "8.33%",
                actualPfBase: 3143,
                hirePerson: 2602.00,
                interestRate: "9.50%",
                interestDifferential: 165,
                totAmountPayable: 2767.00
            },
            {
                monthNo: 7,
                month: "Aug-10",
                employeePf: 5331.00,
                employerPf: 4790.00,
                eps: 541.00,
                pfBase: 44425,
                actualInterest: "8.33%",
                actualPfBase: 3701,
                hirePerson: 3160.00,
                interestRate: "9.50%",
                interestDifferential: 175,
                totAmountPayable: 3335.00
            },
            {
                monthNo: 6,
                month: "Sep-10",
                employeePf: 5331.00,
                employerPf: 4790.00,
                eps: 541.00,
                pfBase: 44425,
                actualInterest: "8.33%",
                actualPfBase: 3701,
                hirePerson: 3160.00,
                interestRate: "9.50%",
                interestDifferential: 150,
                totAmountPayable: 3310.00
            },
            {
                monthNo: 5,
                month: "Oct-10",
                employeePf: 5331.00,
                employerPf: 4790.00,
                eps: 541.00,
                pfBase: 44425,
                actualInterest: "8.33%",
                actualPfBase: 3701,
                hirePerson: 3160.00,
                interestRate: "9.50%",
                interestDifferential: 125,
                totAmountPayable: 3285.00
            },
            {
                monthNo: 4,
                month: "Nov-10",
                employeePf: 5331.00,
                employerPf: 4790.00,
                eps: 541.00,
                pfBase: 44425,
                actualInterest: "8.33%",
                actualPfBase: 3701,
                hirePerson: 3160.00,
                interestRate: "9.50%",
                interestDifferential: 100,
                totAmountPayable: 3260.00
            },
            {
                monthNo: 3,
                month: "Dec-10",
                employeePf: 5331.00,
                employerPf: 4790.00,
                eps: 541.00,
                pfBase: 44425,
                actualInterest: "8.33%",
                actualPfBase: 3701,
                hirePerson: 3160.00,
                interestRate: "9.50%",
                interestDifferential: 75,
                totAmountPayable: 3235.00
            },
            {
                monthNo: 2,
                month: "Jan-11",
                employeePf: 5331.00,
                employerPf: 4790.00,
                eps: 541.00,
                pfBase: 44425,
                actualInterest: "8.33%",
                actualPfBase: 3701,
                hirePerson: 3160.00,
                interestRate: "9.50%",
                interestDifferential: 50,
                totAmountPayable: 3210.00
            },
            {
                monthNo: 1,
                month: "Feb-11",
                employeePf: 5331.00,
                employerPf: 4790.00,
                eps: 541.00,
                pfBase: 44425,
                actualInterest: "8.33%",
                actualPfBase: 3701,
                hirePerson: 3160.00,
                interestRate: "9.50%",
                interestDifferential: 25,
                totAmountPayable: 3185.00
            },
            {
                monthNo: 0,
                month: "Mar-11",
                employeePf: 5331.00,
                employerPf: 4790.00,
                eps: 541.00,
                pfBase: 44425,
                actualInterest: "8.33%",
                actualPfBase: 3701,
                hirePerson: 3160.00,
                interestRate: "9.50%",
                interestDifferential: 0,
                totAmountPayable: 3160.00
            }
        ]
        this.contributionLength = this.contributions.length
        this.loading = false
        this.openingBalance = 0.00
        this.openingInterestRate = "0%"
        this.closingBalance = 37171
        this.closingInterestRate = "9.50%"

        this.summaryStatement = [
            {
                fiscalYear: 1999,
                difHighPension: 0,
                interestRate: "12%",
                differentialInterest: "0",
                totAmountPayable: "6179",
                ytdPayable: "0",
                closingBalance: "6179"
            },
            {
                fiscalYear: 2000,
                difHighPension: 6179,
                interestRate: "12%",
                differentialInterest: "270",
                totAmountPayable: "6741",
                ytdPayable: "6920",
                closingBalance: "13661"
            },
            {
                fiscalYear: 2001,
                difHighPension: 13661,
                interestRate: "9.50%",
                differentialInterest: "1298",
                totAmountPayable: "5790",
                ytdPayable: "14959",
                closingBalance: "20749"
            },
            {
                fiscalYear: 2002,
                difHighPension: 20749,
                interestRate: "9.50%",
                differentialInterest: "1971",
                totAmountPayable: "6291",
                ytdPayable: "22720",
                closingBalance: "29011"
            }
        ]
        this.loading = false
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