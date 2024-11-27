<template>
    <v-container>
        <v-row>
            <v-col>
                <v-toolbar flat>
                    <v-toolbar-title>Corpus Summary</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </v-col>
            <v-spacer></v-spacer>
            <!-- <v-col cols="6">
                <span style="font-size: 14px;">
                NOTE : 
                    <ol>* Total payback includes admin charges of Rs.<b>{{ adminInterest }}.00</b> (1.16% of the difference of wages and 15000, for the wage months on or after Sept 2014)</ol>
                    <ol>** If total Tenure is more than 20Yrs then 2 Service years will be added to the calculation</ol>
                </span>
            </v-col>     -->
        </v-row>
        <v-row class="ma-0 pa-0">
            <v-col cols="3">
                <v-text-field v-model="pfNumber" label="PF Number" required dense hint="Press Enter to load Data"
                    persistent-hint @keydown.enter.native="getDetails" :rules="rules.pfNumberRules"></v-text-field>
            </v-col>
        </v-row>
        <v-row class="ma-2 ml-2" v-if="showProgress === true">
                            <v-col>
                                <v-progress-circular indeterminate color="primary">
                                </v-progress-circular>
                                <P style="color:red">{{ statusMessage }}</P>
                            </v-col>
                        </v-row>
        <v-row>
            <v-col>
                <v-data-table :headers="headers" :items="contributions" :options.sync="options"
                    :server-items-length="contributionLength" class="elevation-1" :loading="loading"
                    loading-text="Loading... Please wait" key="id">
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-spacer></v-spacer>
                            <v-row>
                                <v-spacer></v-spacer>
                                <!-- <v-col class="ma-0 pb-0" v-if="tenure > 20"><v-toolbar-title style="font-size: 15px ;">Tenure (Yrs)** : {{ tenure
                                }} + 2 = {{ tenure+2 }}</v-toolbar-title></v-col> -->
                                <v-col class="ma-0 pb-0" v-if="tenure <= 20"><v-toolbar-title style="font-size: 15px ;">Tenure (Yrs)** : {{ tenure
                                }}</v-toolbar-title></v-col>
                                <!-- <v-col class="ma-0 pb-0"><v-toolbar-title style="font-size: 15px ;">Admin Charges : {{ adminInterest
                                }}</v-toolbar-title></v-col>
                                <v-col class="ma-0 pb-0"><v-toolbar-title style="font-size: 15px ;">Total Payback Corpus : {{ totalValue
                                }}</v-toolbar-title></v-col>  -->
                                <v-col class="ma-0 pb-0"><v-toolbar-title style="font-size: 15px ;">Total Corpus Accumulated* : {{ totalCorpus }}</v-toolbar-title></v-col>
                                <!-- <v-spacer></v-spacer>      -->
                            </v-row>
                        </v-toolbar>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script>
import { isNotEmpty,isNumber  } from "@/util/rules";

export default {
    name: "CorpusSummary",
    data() {
        return {
            totalCorpus: "",
            adminInterest: "",
            totalValue: "",
            tenure: "",
            showProgress: false,
            statusMessage: "Please Wait While We Fetch Data, It May Take Some Time",
            mdi: "mdi-content-paste",
            dashboardTitle: "Corpus Summary",
            btnText: "Summary Service",
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
            { text: 'Fiscal Year', sortable: false, value: 'fisccal_year' },                
                { text: 'Opening Balance', sortable: false, value: 'openingBalance' },
                { text: 'Employee', sortable: false, value: 'employeeControbution' },
                { text: 'Employer', sortable: false, value: 'companyContribution' },
                { text: 'EPS', sortable: false, value: 'eps' },
                { text: 'Corpus', sortable: false, value: 'corpus' },
                { text: 'Interest On Corpus', sortable: false, value: 'corpusPercentage' },
                { text: 'Corpus for The Year', sortable: false, value: 'corpusForTheMonth' },
                // { text: 'Diff. for Higher Pension', sortable: false, value: 'differenceForHigherPension' },
                { text: 'Inst. Rate', sortable: false, value: 'interestRate' },
                // { text: 'Inst. on Differential', sortable: false, value: 'interestOnDifferential' },
                // { text: 'Total Amt. payable', sortable: false, value: 'totalAmountPayableOnAccount' },
                // { text: 'YTD Payable Amount', sortable: false, value: 'ytdPayableAmount' },
                { text: 'Closing Balance', sortable: false, value: 'closingBalance' },

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
        getDetails() {
            
            if(this.pfNumber !== ""){
                this.$store.dispatch("CustomerModule/corpusSummary",this.pfNumber)
                    .then(response => {
                        console.log(response)
                        this.contributions = response.monthly
                        this.contributionLength = this.contributions.length
                        // this.totalValue = response.totalAmount
                        this.tenure =  this.contributions.length
                        // this.adminInterest = response.adminTotal
                        this.totalCorpus = this.contributions[this.contributionLength-1]["closingBalance"]
                        this.loading = false
                        this.showProgress = false
                    })
                    .catch(error => console.log(error))
                }
                this.showProgress = true
                this.loading = true
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