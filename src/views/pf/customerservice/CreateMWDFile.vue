<template>
    <v-container>
        <v-dialog v-model="responseView" max-width="50%">
            <v-card max-width="100%">
                <v-card-title>
                    Higher Pension Calculation Details
                    <v-spacer></v-spacer>
                    <v-icon small color="black darken-2" @click="responseView = false">
                        mdi-close
                    </v-icon>
                </v-card-title>
                <v-row class="pa-0 ma-4">
                    <v-col cols="5">
                        <v-card>
                            <v-card-text>
                                <b> Pf-Number : <p v-html="pfNumber"></p></b>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="5" v-if="member === true">
                        <v-card>
                            <v-card-text>
                                <b> Member ID : <p v-html="mid"></p></b>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="5" v-if="member === false">
                        <!-- <v-card> -->
                        <!-- <v-card-text> -->
                        <v-text-field v-model="memberid" label="Member ID" required dense
                            :hint="hintMe" persistent-hint
                            ></v-text-field>
                        <!-- </v-card-text> -->
                        <!-- </v-card> -->
                    </v-col>
                    <v-col cols="2" :disabled="resBtn" v-if="member === false">
                        <v-btn color="primary" dark @click="saveMid">
                            Save
                        </v-btn>
                    </v-col>
                </v-row>
                <!-- <v-row class="pa-0 ma-4"> -->


                <!-- <v-col cols="2" v-if="member === true">
                        <v-btn color="primary" dark @click="responseView = false">
                            Load Data
                        </v-btn>
                    </v-col> -->
                <!-- </v-row> -->
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
                </v-row>
                <v-card-actions v-if="member === false">
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark @click="getDetails">
                        <v-progress-circular v-if="showProgress === true" indeterminate color="white">
                        </v-progress-circular> Load Data
                    </v-btn>
                </v-card-actions>
                <v-card-actions v-if="member === true">
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark @click="getDetails">
                        <v-progress-circular v-if="showProgress === true" indeterminate color="white">
                        </v-progress-circular> Load Data
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
            <v-col cols="8">
                <v-card>
                    <v-card-subtitle>
                        NOTE :
                    </v-card-subtitle>
                    <v-card-text style="color: red"> ** Only data from November 1995 is considered for text file genertion.</v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="ma-0 pa-0">
            <v-col cols="3">
                <v-text-field v-model="pfNumber" label="PF Number" required dense hint="Press Enter to load data"
                    persistent-hint @keydown.enter.native="getMemberId" :rules="rules.pfNumberRules"></v-text-field>
            </v-col>
            <!-- <v-spacer></v-spacer> -->
            
            <!-- <v-col cols="3" v-if="this.display == true">
                <v-select :items="fyYears" item-value="ficalYear" item-text="ficalYear" label="Select FY"
                    v-model="selectedFyYear" v-on:change="getContribution" dense></v-select>
            </v-col>
            <v-col cols="1" v-if="showProgress === true">
                <v-progress-circular indeterminate color="primary">
                </v-progress-circular>
            </v-col> -->
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
                                <v-col cols="3 me-4" v-if="member === true">
                                    <v-btn color="primary" dark @click="getMWDExcel">

                                        <v-progress-circular v-if="excelProgress === true" indeterminate color="white">
                                        </v-progress-circular> Generate Excel
                                    </v-btn>
                                </v-col>
                                <v-col cols="3" v-if="member === true">
                                    <v-btn color="primary" dark @click="getMWDFile">
                                        <v-progress-circular v-if="downloadingSheet === true" indeterminate color="white">
                                        </v-progress-circular>
                                        Generate Txt
                                    </v-btn>
                                </v-col>
                                <!-- <v-spacer></v-spacer>      -->
                            </v-row>
                        </v-toolbar>
                    </template>
                    <!-- <template v-slot:footer>
                        <v-toolbar flat>
                            <v-spacer></v-spacer>
                            <v-row>
                                <v-spacer></v-spacer>


                                 <v-spacer></v-spacer>      
                            </v-row>
                        </v-toolbar>
                    </template> -->
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
import fileDownload from "js-file-download";

export default {
    name: "ExistingLoan",
    data() {
        return {
            hintMe: "Member ID Not Found, Enter Manually",
            resBtn : false,
            showData: false,
            memberid: null,
            excelProgress: false,
            downloadingSheet: false,
            member: false,
            mid: "",
            responseView: false,
            mdi: "mdi-content-paste",
            dashboardTitle: "Generate MWD Text File",
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
                // { text: 'Fiscal Year', sortable: false, value: 'fisccal_year' },
                {
                    text: '(1) Member ID',
                    align: 'start',
                    sortable: false,
                    value: 'memberId',
                },
                { text: '(2) Wage Month & Year', sortable: false, value: 'yearAndMonth' },
                { text: '(3) Wages on which PF contribution was paid', sortable: false, value: 'pfBase' },
                { text: '(4) Pension Contribution from employer 8.33%', sortable: false, value: 'companyContribution' },
                { text: '(5) Pension Contribution from employee @ 1.16%', sortable: false, value: 'admin_interest' },
                { text: '(6) Pension Contribution Paid by the employer earlier', sortable: false, value: 'eps' },
                { text: '(7) Pension Contribution to be paid along with interest', sortable: false, value: 'totalAmount' },
                { text: '(8) Yearly PF Interest rate', sortable: false, value: 'interestRate' },
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

            

            if(this.memberid == '' || this.memberid == null){
                this.hintMe = "Please enter member ID and save before proceeding"

            }

            if ((this.pfNumber !== '' && this.pfNumber !== null) && (this.mid !== '' && this.mid !== null)) {
                this.showProgress = true
                this.member = true
                this.$store.dispatch("CustomerModule/populateMwdData", this.pfNumber)
                    .then(response => {
                        this.contributions = response.monthly
                        this.contributionLength = this.contributions.length
                        this.showProgress = false
                        this.responseView = false
                        // this.pfNumber = null
                        this.memberid = null
                    })
                    .catch(error => {
                        console.log(error)
                        this.responseView = false
                    })
            }
            else {
                this.member = false
            }
        },
        getMemberId() {
            
            if (this.pfNumber != null) {
                this.$store.dispatch("CustomerModule/getMemberId", this.pfNumber)
                    .then(response => {
                        if (response.memberId !== "failed") {
                            this.mid = response.memberId
                            this.member = true
                            this.responseView = true
                        } else {
                            this.memberid = null
                            this.hintMe = "Member ID Not Found, Please Enter Manually"
                            this.member = false
                            this.responseView = true
                        }

                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        },
        saveMid() {
            if (this.pfNumber != null) {
                if(this.memberid == null || this.memberid == "" ){
                    this.hintMe = "Please Enter Member ID"
                }else{
                    let data = {
                        mid: this.memberid,
                        pfNumber: this.pfNumber
                    }
                    this.$store.dispatch("CustomerModule/setMid", data)
                        .then(response => {
                            // this.responseView = false
                            console.log(response.status)
                            if (response.status == true) {
                                // this.getDetails();
                                this.hintMe = "MemberID Saved Successfully.."
                                this.mid = this.memberid
                                console.log("true")
                                // this.responseView = false
                            } else {
                                console.log("false")
                                this.responseView = false
                            }
                        })
                        .catch(error => {
                            console.log(error)
                            this.pfNumber = null
                            this.memberid = null
                            this.responseView = false
                        })
                    }
            }
        },
        getContribution() {
            this.loading = true
            var data = {
                pfNumber: this.pfNumber,
                fiscalYear: this.selectedFyYear
            }

            this.$store.dispatch("CustomerModule/monthlyCorpus", data)
                .then(response => {
                    console.log(response.monthly)
                    this.contributions = response.monthly
                    this.contributionLength = this.contributions.length
                    this.openingBalance = this.contributions[0]['corpusForTheMonth']
                    this.openingInterestRate = this.contributions[0]['interestRate']
                    this.closingBalance = this.contributions[13]['corpusForTheMonth']
                    this.closingInterestRate = this.contributions[13]['interestRate'] + "%"
                    this.loading = false
                    // console.log(this.contributions[0]['differenceForHigherPension'])
                })
                .catch(error => {
                    console.log(error)
                })

        },
        getMWDFile() {
            this.downloadingSheet = true
            console.log("pfumber " + this.pfNumber)
            this.$store.dispatch("CustomerModule/getMWDSheet", this.pfNumber)
                .then(response => {
                    let fileName = response.headers["x-suggested-filename"]
                    fileDownload(response.data, fileName)
                    this.downloadingSheet = false
                    // this.selectPaymentDateDialog = false
                })
                .catch(error => {
                    console.log(error)
                })
        },
        getMWDExcel() {
            // this.downloadingSheet = true
            this.excelProgress = true
            this.$store.dispatch("CustomerModule/generateMwdExcel", this.pfNumber)
                .then(response => {
                    let fileName = response.headers["x-suggested-filename"]
                    fileDownload(response.data, fileName)
                    console.log(response)
                    this.excelProgress = false
                    // this.selectPaymentDateDialog = false
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