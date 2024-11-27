<template>
    <v-container>
        <v-dialog v-model="responseView" max-width="80%">
            <v-card max-width="100%">
                <v-card-title>
                    Higher Pension Employee Details
                    <v-spacer></v-spacer>
                    <v-icon small color="black darken-2" @click="responseView = false">
                        mdi-close
                    </v-icon>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="ma-0 pa-0">
                    <v-container fluid fill-height>
                        <v-row class="ma-0 pa-0">
                            <v-col>
                                <h4 class="text-decoration-underline">Employee Info:  <Span style="color: red;"> {{ notFound }} </Span></h4>
                            </v-col>
                        </v-row>
                        <v-row class="pa-0 ma-0" v-if="displayDetails">
                            <v-col>
                                <div>
                                    <p class="font-weight-black mb-0 pb-0">{{ memberId }}</p>
                                    <p>Member ID</p>
                                </div>
                            </v-col>
                            <v-col>
                                <div>
                                    <p class="font-weight-black mb-0 pb-0">{{ name }}</p>
                                    <p>Name </p>
                                </div>
                            </v-col>
                            <v-col>
                                <div>
                                    <p class="font-weight-black mb-0 pb-0">{{ employeeId }}</p>
                                    <p>Employee ID</p>
                                </div>
                            </v-col>
                            <v-col>
                                <div>
                                    <p class="font-weight-black mb-0 pb-0">{{ uanNo }}</p>
                                    <p>UAN Number</p>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row class="pa-0 ma-0" v-if="displayDetails">
                            <v-col>
                                <div>
                                    <p class="font-weight-black mb-0 pb-0">{{ category }}</p>
                                    <p>Employee Category</p>
                                </div>
                            </v-col>
                            <v-col>
                                <div>
                                    <p class="font-weight-black mb-0 pb-0">{{ ppNo }}</p>
                                    <p>PPO Number</p>
                                </div>
                            </v-col>
                            <v-col>
                                <div>
                                    <p class="font-weight-black mb-0 pb-0">{{ dob }}</p>
                                    <p>Date Of Birth</p>
                                </div>
                            </v-col>
                            <v-col>
                                <div>
                                    <p class="font-weight-black mb-0 pb-0">{{ doj }}</p>
                                    <p>Date Of Joining</p>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row class="pa-0 ma-0" v-if="displayDetails">
                            <v-col>
                                <div>
                                    <p class="font-weight-black mb-0 pb-0">{{ dol }}</p>
                                    <p>Date Of Leaving</p>
                                </div>
                            </v-col>
                            <v-col>
                                <div>
                                    <p class="font-weight-black mb-0 pb-0">{{ submittedOn }}</p>
                                    <p>Application Submitted On</p>
                                </div>
                            </v-col>
                            <v-col>
                                <div>
                                    <p class="font-weight-black mb-0 pb-0">{{ acknowledgementNo }}</p>
                                    <p>Acknowledgement Number</p>
                                </div>
                            </v-col>
                            <v-col>
                                <div>
                                </div>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
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
                    <!-- <v-card-text style="color: red"> ** Only data from November 1995 is considered for text file
                        genertion.</v-card-text>
                        <v-card-text style="color: red"> *** </v-card-text> -->
                    <v-card-text style="color: red"> 1. Only data from November 1995 is considered for text file
                        genertion.<br>2.
                        Text file is generated based on the input given in the source file.</v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="ma-0 pa-0">
            <v-col cols="3">
                <v-text-field v-model="memberId" label="Member ID" required dense hint="Press Enter to load data"
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
                        <v-toolbar flat >
                            <v-row v-if="member === true">
                                <v-spacer></v-spacer>
                                <v-col cols="2 me-4" >
                                    <v-btn color="primary" dark @click="getForm3AExcel">
                                        <v-progress-circular v-if="form3AExcel === true" indeterminate color="white">
                                        </v-progress-circular> Form3A Excel
                                    </v-btn>
                                </v-col>
                                <v-col cols="2 me-4">
                                    <v-btn color="primary" dark @click="getForm3APdf">
                                        <v-progress-circular v-if="form3APdf === true" indeterminate color="white">
                                        </v-progress-circular> Form3A PDF
                                    </v-btn>
                                </v-col>
                                <v-col cols="2 me-4">
                                    <v-btn color="primary" dark @click="getMWDExcel">

                                        <v-progress-circular v-if="excelProgress === true" indeterminate color="white">
                                        </v-progress-circular> Generate Excel
                                    </v-btn>
                                </v-col>
                                <v-col cols="2 ml-2 me-4">
                                    <v-btn color="primary" dark @click="getMWDFile">
                                        <v-progress-circular v-if="downloadingSheet === true" indeterminate color="white">
                                        </v-progress-circular>
                                        Generate Txt
                                    </v-btn>
                                </v-col>   
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
import { isNotEmpty, isNotNumber, validMemberId } from "@/util/rules";
import fileDownload from "js-file-download";

export default {
    name: "ExistingLoan",
    data() {
        return {
            hintMe: "Member ID Not Found, Enter Manually",
            resBtn: false,
            showData: false,
            memberid: null,
            excelProgress: false,
            form3AExcel: false,
            form3APdf: false,
            downloadingSheet: false,
            member: false,
            mid: "",
            responseView: false,
            mdi: "mdi-content-paste",
            dashboardTitle: "Generate MWD Text File",
            btnText: "Summary Service",
            display: true,
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
            // in use
            displayDetails: false,
            notFound: "",
            acknowledgementNo: "",
            category: "",
            dob: "",
            doj: "",
            dol: "",
            employeeId: "",
            memberId: "",
            name: "",
            ppNo: "",
            submittedOn: "",
            uanNo: "",
            rules: {
                pfNumberRules: [
                    v => isNotEmpty(v, "Member ID is Required"),
                    v => isNotNumber(v, "Please Enter Valid Member ID"),
                    v => validMemberId(v, "Member ID length must be 22")
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
                { text: '(2) Wage Month & Year', sortable: false, value: 'wageMonthYear' },
                { text: '(3) Wages on which PF contribution was paid', sortable: false, value: 'pfBase' },
                { text: '(4) Pension Contribution from employer 8.33%', sortable: false, value: 'pensionContribution' },
                { text: '(5) Pension Contribution from employee @ 1.16%', sortable: false, value: 'adminCharges' },
                { text: '(6) Pension Contribution Paid by the employer earlier', sortable: false, value: 'pensionContributionEmployerEarlier' },
                { text: '(7) Pension Contribution to be paid along with interest', sortable: false, value: 'amountToBePaid' },
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

            this.showProgress = true
            this.member = true
            this.$store.dispatch("HpcModule/getMwdData", this.memberId)
                .then(response => {
                    this.contributions = response.pfbaseList
                    this.contributionLength = this.contributions.length
                    this.showProgress = false
                    this.responseView = false
                    // this.pfNumber = null
                    this.memberid = null
                })
                .catch(error => {
                    console.log(error)
                    this.contributions= []
                    this.contributionLength = 0
                    this.responseView = false
                })
        },
        getMemberId() {

            if (this.memberId != null) {
                this.$store.dispatch("HpcModule/getEmployee", this.memberId)
                    .then(response => {

                        let today = new Date(response.dob);
                        let today1 = new Date(response.doj);
                        let today2 = new Date(response.dol == null?"-":response.dol);
                        let today3 = new Date(response.submittedOn);

                        const yyyy = today.getFullYear();
                        let mm = today.getMonth() + 1; // Months start at 0!
                        let dd = today.getDate();
                        
                        const yyyy1 = today1.getFullYear();
                        let mm1= today1.getMonth() + 1; // Months start at 0!
                        let dd1 = today1.getDate();
                        
                        const yyyy2 = today2.getFullYear();
                        let mm2 = today2.getMonth() + 1; // Months start at 0!
                        let dd2 = today2.getDate();

                        const yyyy3 = today3.getFullYear();
                        let mm3 = today3.getMonth() + 1; // Months start at 0!
                        let dd3 = today3.getDate();

                        if (dd < 10) dd = '0' + dd;
                        if (mm < 10) mm = '0' + mm;
                        if (dd1 < 10) dd1 = '0' + dd1;
                        if (mm1< 10) mm1 = '0' + mm1;
                        if (dd2 < 10) dd2 = '0' + dd2;
                        if (mm2 < 10) mm2 = '0' + mm2;
                        if (dd3 < 10) dd3 = '0' + dd3;
                        if (mm3 < 10) mm3 = '0' + mm3;

                        const formattedToday = dd + '-' + mm + '-' + yyyy;
                        const formattedToday1 = dd1 + '-' + mm1 + '-' + yyyy1;
                        const formattedToday2 = dd2 + '-' + mm2 + '-' + yyyy2;
                        const formattedToday3 = dd3 + '-' + mm3 + '-' + yyyy3;
                        console.log(formattedToday)

                        this.acknowledgementNo = response.acknowledgementNo
                        this.category = response.category
                        this.dob = formattedToday
                        this.doj = formattedToday1
                        if(formattedToday2 == "NaN-NaN-NaN"){
                            this.dol = "NA"
                        }else{
                            this.dol = formattedToday2
                        }
                        
                        this.employeeId = response.employeeId
                        this.memberId = response.memberId
                        this.name = response.name
                        this.ppNo = response.ppNo
                        this.submittedOn = formattedToday3
                        this.uanNo = response.uanNo
                        this.notFound = ""
                        this.displayDetails = true
                        this.member = true
                        this.responseView = true
                        console.log(response)
                    })
                    .catch(error => {
                        console.log(error)
                        this.notFound = "Member Not Found"
                        this.contributions= []
                        this.contributionLength = 0
                        this.displayDetails = false
                        this.member = true
                        this.responseView = true
                        
                    })
            }
        },
        saveMid() {
            if (this.pfNumber != null) {
                if (this.memberid == null || this.memberid == "") {
                    this.hintMe = "Please Enter Member ID"
                } else {
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
            this.$store.dispatch("HpcModule/getMwdTextFile", this.memberId)
                .then(response => {
                    let fileName = response.headers["x-suggested-filename"]
                    fileDownload(response.data, fileName)
                    this.downloadingSheet = false
                    // this.selectPaymentDateDialog = false
                })
                .catch(error => {
                    console.log(error)
                    this.downloadingSheet = true
                })
        },
        getMWDExcel() {
            // this.downloadingSheet = true
            this.excelProgress = true
            this.$store.dispatch("HpcModule/getMwdExcelFile", this.memberId)
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
        getForm3APdf() {
            this.form3APdf = true
            this.$store.dispatch("HpcModule/getForm3APdf", this.memberId)
                .then(response => {
                    let fileName = response.headers["x-suggested-filename"]
                    fileDownload(response.data, fileName)
                    console.log(response)
                    this.form3APdf = false
                    // this.selectPaymentDateDialog = false
                })
                .catch(error => {
                    console.log(error)
                    this.form3APdf = false
                })
        },
        getForm3AExcel() {
            // this.downloadingSheet = true
            this.form3AExcel = true
            this.$store.dispatch("HpcModule/getForm3AExcel", this.memberId)
                .then(response => {
                    let fileName = response.headers["x-suggested-filename"]
                    fileDownload(response.data, fileName)
                    console.log(response)
                    this.form3AExcel = false
                    // this.selectPaymentDateDialog = false
                })
                .catch(error => {
                    console.log(error)
                    this.form3AExcel = false
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
        // this.$store.dispatch("CustomerModule/getPfNumber")
        //     .then(response => {
        //         console.log(response)
        //     })
        //     .catch(error => console.log(error))


    }
}
</script>
  
<style scoped>
a {
    color: #000;
}</style>