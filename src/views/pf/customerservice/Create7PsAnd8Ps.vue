<template>
    <v-container>
        <v-dialog v-model="responseView" max-width="50%">
            <v-card max-width="100%">
                <v-card-title>
                    Higher Pension Calculation Details
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark @click="get7PsExcel">
                        <v-progress-circular v-if="show7PsProgress === true" indeterminate color="white">
                        </v-progress-circular><v-icon class="ti-download"></v-icon> 7PS Excel
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark @click="get8PsExcel">
                        <v-progress-circular v-if="show8PsProgress === true" indeterminate color="white">
                        </v-progress-circular> <v-icon class="ti-download"></v-icon> 8PS Excel
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-icon small color="black darken-2" @click="responseView = false">
                        mdi-close
                    </v-icon>
                </v-card-title>
                <v-row class="pa-0 ma-4">
                    <v-col cols="4">
                        <v-card>
                            <v-card-text>
                                <b> Pf-Number : <p v-html="pfNumber"></p></b>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="4" v-if="member === true">
                        <v-card>
                            <v-card-text>
                                <b> Member ID : <p v-html="mid"></p></b>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="4" v-if="member === false">
                        <!-- <v-card> -->
                        <!-- <v-card-text> -->
                        <v-text-field v-model="memberid" label="Member ID" required dense :hint="hintMe"
                            persistent-hint></v-text-field>
                        <!-- </v-card-text> -->
                        <!-- </v-card> -->
                    </v-col>
                    <v-col cols="4">
                        <v-card>
                            <v-card-text>
                                <b> Name : <p v-html="memberName"></p></b>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="4">
                        <v-card>
                            <v-card-text>
                                <b> Father's / Husband's Name : <p v-html="fatherName"></p></b>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="4">
                        <v-card>
                            <v-card-text>
                                <b> Establishment Name & Address : <p v-html="establishmentName"></p></b>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="4">
                        <v-card>
                            <v-card-text>
                                <b> Establishment Code : <p v-html="establishmentCode"></p></b>
                            </v-card-text>
                        </v-card>
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
                <v-card-actions v-if="member === true">
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark @click="get7PsZip">
                        <v-progress-circular v-if="get7PsZipProgress === true" indeterminate color="white">
                        </v-progress-circular> <v-icon class="ti-download"></v-icon> 7PS Zip
                    </v-btn>
                    <v-btn color="primary" dark @click="get8PsZip">
                        <v-progress-circular v-if="get8PsZipProgress === true" indeterminate color="white">
                        </v-progress-circular> <v-icon class="ti-download"></v-icon> 8PS Zip
                    </v-btn>
                    <v-btn color="primary" dark @click="get7PsConsolidated">
                        <v-progress-circular v-if="consolidated7psProgress === true" indeterminate color="white">
                        </v-progress-circular> <v-icon class="ti-download"></v-icon> 7PS Consolidated
                    </v-btn>
                    <v-btn color="primary" dark @click="get8PsConsolidated">
                        <v-progress-circular v-if="consolidated8psProgress === true" indeterminate color="white">
                        </v-progress-circular> <v-icon class="ti-download"></v-icon> 8PS Consolidated
                    </v-btn>
                </v-card-actions>
                <!-- <v-card-actions v-if="member === true">
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark @click="getDetails">
                        <v-progress-circular v-if="showProgress === true" indeterminate color="white">
                        </v-progress-circular> Load Data
                    </v-btn>
                </v-card-actions> -->
            </v-card>
        </v-dialog>
        <v-dialog v-model="formDialog" max-width="50%">
            <v-card max-width="100%">
                <v-card-title>
                    Enter Member Details
                    <v-spacer></v-spacer>
                    <v-icon small color="black darken-2" @click="formDialog = false">
                        mdi-close
                    </v-icon>
                </v-card-title>
                <v-row class="pa-0 ma-4">
                    <v-col cols="5">
                        <v-text-field v-model="memberid" label="Accoount Number" required dense :hint="hintMe"
                            persistent-hint :rules="rules.memberidRules"></v-text-field>
                    </v-col>
                    <v-col cols="5">
                        <v-text-field v-model="memberName" label="Name" required dense :hint="memberNameHint"
                            persistent-hint :rules="rules.memberNameRules"></v-text-field>
                    </v-col>
                    <v-col cols="5">
                        <v-text-field v-model="fatherName" label="Father's / Husband's Name" required dense
                            :hint="fatherNameHint" persistent-hint :rules="rules.fatherNameRules"></v-text-field>
                    </v-col>
                     <v-col cols="5">
                        <v-text-field v-model="establishmentName" label="Establishment Name & Address" required dense :hint="establishmentNameHint"
                            persistent-hint :rules="rules.establishmentNameRule"></v-text-field>
                    </v-col>
                     <v-col cols="5">
                        <v-text-field v-model="establishmentCode" label="Establishment Code" required dense :hint="rateOfContributionHint"
                            persistent-hint :rules="rules.establishmentCodeRule"></v-text-field>
                    </v-col>

                    <v-col cols="5">
                        <v-menu ref="retirementDate" v-model="retirementDateMenu" :close-on-content-click="false"
                            :return-value.sync="retirementDate" transition="scale-transition" offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="retirementDate" label="Retirement Date" readonly v-bind="attrs"
                                    v-on="on" dense ></v-text-field>
                            </template>
                            <v-date-picker v-model="retirementDate" no-title scrollable>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="retirementDateMenu = false">
                                    Cancel
                                </v-btn>
                                <v-btn text color="primary" @click="$refs.retirementDate.save(retirementDate)">
                                    OK
                                </v-btn>
                            </v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="5">
                        <v-select :items="settlementTypes" item-value="entityId" item-text="title" label="Reason Of Leaving"
                            v-model="selectedSettlementType" dense 
                        ></v-select>
                    </v-col>
                    <v-col cols="5">
                        <v-select :items="fiscalYears" item-value="entityId" item-text="title"
                            label="Select Retired Fiscal Year" v-model="selectedFiscalYear" dense 
                            ></v-select>
                    </v-col>

                    <v-col cols="12">
                        <span style="color: red;">{{ check }}</span>
                    </v-col>
                </v-row>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark @click="setMemberDetails">
                        <v-progress-circular v-if="show7PsProgress === true" indeterminate color="white">
                        </v-progress-circular><v-icon class="ti-download"></v-icon> Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="statusView" max-width="30%">
            <v-card max-width="100%">
                <v-card-title>
                    Member Details Saving Staus
                    <v-spacer></v-spacer>
                    <v-icon small color="black darken-2" @click="statusView = false">
                        mdi-close
                    </v-icon>
                </v-card-title>
                <v-card-text>
                    <p> {{ savingStatus }} </p>
                </v-card-text>
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
                    <v-card-text style="color: red"> ** Only data from November 1995 is considered for 7PS and 8PS file
                        generation.</v-card-text>
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
    </v-container>
</template>
  
<script>
import { isNotEmpty, isNumber } from "@/util/rules";
import fileDownload from "js-file-download";

export default {
    name: "ExistingLoan",
    data() {
        return {
            check: "",
            statusView: false,
            savingStatus: "",
            hintMe: "Member ID Not Found, Enter Manually",
            resBtn: false,
            showData: false,
            memberid: null,
            excelProgress: false,
            downloadingSheet: false,
            member: false,
            mid: "",
            responseView: false,
            mdi: "mdi-content-paste",
            dashboardTitle: "Generate 7PS And 8PS",
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
            show7PsProgress: false,
            show8PsProgress: false,
            get7PsZipProgress: false,
            get8PsZipProgress: false,
            consolidated7psProgress: false,
            consolidated8psProgress: false,
            formDialog: false,
            memberName: "",
            fatherName: "",
            establishmentName: "",
            rateOfContribution: "",
            memberNameHint: "",
            fatherNameHint: "",
            establishmentNameHint: "",
            rateOfContributionHint: "",
            retirementDate: null,
            retirementDateMenu: null,
            establishmentCode: null,
            settlementTypes: [
                { title: "Death", entityId: "Death" },
                { title: "Retirement VRS", entityId: "Retirement VRS" },
                { title: "Retirement", entityId: "Retirement" },
                { title: "Resignation", entityId: "Resignation" },
                { title: "Termination", entityId: "Termination" },
                { title: "Migration", entityId: "Migration" },
                { title: "Dismissal", entityId: "Dismissal" },
                { title: "Superannuation", entityId: "Superannuation"},
                { title: "Transfer", entityId: "Transfer"},
                { title: "Migration to Abroad", entityId: "Migration to Abroad"},
                { title: "Permanent Disablement", entityId: "Permanent Disablement"},
                { title: "Closure of Establishment", entityId: "Closure of Establishment" }
            ],
            selectedSettlementType: null,
            fiscalYears: [
                { title: "FY1995-1996", entityId: "FY1995-1996" },
                { title: "FY1996-1997", entityId: "FY1996-1997" },
                { title: "FY1997-1998", entityId: "FY1997-1998" },
                { title: "FY1998-1999", entityId: "FY1998-1999" },
                { title: "FY1999-2000", entityId: "FY1999-2000" },
                { title: "FY2000-2001", entityId: "FY2000-2001" },
                { title: "FY2001-2002", entityId: "FY2001-2002" },
                { title: "FY2002-2003", entityId: "FY2002-2003" },
                { title: "FY2003-2004", entityId: "FY2003-2004" },
                { title: "FY2004-2005", entityId: "FY2004-2005" },
                { title: "FY2005-2006", entityId: "FY2005-2006" },
                { title: "FY2006-2007", entityId: "FY2006-2007" },
                { title: "FY2007-2008", entityId: "FY2007-2008" },
                { title: "FY2008-2009", entityId: "FY2008-2009" },
                { title: "FY2009-2010", entityId: "FY2009-2010" },
                { title: "FY2010-2011", entityId: "FY2010-2011" },
                { title: "FY2011-2012", entityId: "FY2011-2012" },
                { title: "FY2012-2013", entityId: "FY2012-2013" },
                { title: "FY2013-2014", entityId: "FY2013-2014" },
                { title: "FY2014-2015", entityId: "FY2014-2015" },
                { title: "FY2015-2016", entityId: "FY2015-2016" },
                { title: "FY2016-2017", entityId: "FY2016-2017" },
                { title: "FY2017-2018", entityId: "FY2017-2018" },
                { title: "FY2018-2019", entityId: "FY2018-2019" },
                { title: "FY2019-2020", entityId: "FY2019-2020" },
                { title: "FY2020-2021", entityId: "FY2020-2021" },
                { title: "FY2021-2022", entityId: "FY2021-2022" },
                { title: "FY2022-2023", entityId: "FY2022-2023" },
                { title: "FY2023-2024", entityId: "FY2023-2024" },
            ],
            selectedFiscalYear: null,
            rules: {
                pfNumberRules: [
                    v => isNotEmpty(v, "PF No. is Required"),
                    v => isNumber(v, "Please Enter Valid PF Number")
                ],
                dateOfLeavingServiceRules: [
                    v => isNotEmpty(v, "Retirement Date is Required"),
                ],
                settlementTypeRules: [
                    v => isNotEmpty(v, "Settlement Type is Required"),
                ],
                fiscalYearRules: [
                    v => isNotEmpty(v, "Fiscal Year is Required"),
                ],
                memberidRules: [
                    v => isNotEmpty(v, "Accoount Number is Required"),
                ],
                memberNameRules: [
                    v => isNotEmpty(v, "Member Name is Required"),
                ],
                fatherNameRules: [
                    v => isNotEmpty(v, "Father Name is Required"),
                ],
                establishmentNameRule:[
                v => isNotEmpty(v, "Establishment Name is Required"),
                ],
                establishmentCodeRule:[
                v => isNotEmpty(v, "Establishment Code is Required"),
                ],
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

            if (this.memberid == '' || this.memberid == null) {
                this.hintMe = "Please enter Accoount Number and save before proceeding"

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
        get7PsExcel() {
            this.show7PsProgress = true;
            if (this.memberid == '' || this.memberid == null) {
                this.hintMe = "Please enter Accoount Number and save before proceeding"

            }

            if ((this.pfNumber !== '' && this.pfNumber !== null) && (this.mid !== '' && this.mid !== null)) {
                this.showProgress = true
                this.member = true
                this.$store.dispatch("CustomerModule/get7PsExcel", this.pfNumber)
                    .then(response => {
                        this.showProgress = false;
                        this.responseView = false;
                        let fileName = response.headers["x-suggested-filename"];
                        fileDownload(response.data, fileName);
                        this.downloadingSheet = false;
                        this.show7PsProgress = false;
                        // this.pfNumber = null
                    })
                    .catch(error => {
                        console.log(error)
                        this.responseView = false
                        this.show7PsProgress = false;
                    })
            }
            else {
                this.member = false
            }
        },
        get8PsExcel() {
            this.show8PsProgress = true;
            if (this.memberid == '' || this.memberid == null) {
                this.hintMe = "Please enter Accoount Number and save before proceeding"

            }

            if ((this.pfNumber !== '' && this.pfNumber !== null) && (this.mid !== '' && this.mid !== null)) {
                this.showProgress = true
                this.member = true
                this.$store.dispatch("CustomerModule/get8PsExcel", this.pfNumber)
                    .then(response => {
                        this.showProgress = false
                        this.responseView = false
                        let fileName = response.headers["x-suggested-filename"]
                        fileDownload(response.data, fileName)
                        this.downloadingSheet = false
                        this.show8PsProgress = false
                        // this.pfNumber = null
                    })
                    .catch(error => {
                        console.log(error)
                        this.responseView = false
                        this.show8PsProgress = false
                    })
            }
            else {
                this.member = false
            }
        },
        get7PsZip() {
            this.get7PsZipProgress = true;
            if (this.memberid == '' || this.memberid == null) {
                this.hintMe = "Please enter Accoount Number and save before proceeding"

            }

            if ((this.pfNumber !== '' && this.pfNumber !== null) && (this.mid !== '' && this.mid !== null)) {
                this.showProgress = true
                this.member = true
                this.$store.dispatch("CustomerModule/get7PsZip", this.pfNumber)
                    .then(response => {
                        this.showProgress = false
                        this.responseView = false
                        let fileName = response.headers["x-suggested-filename"]
                        fileDownload(response.data, fileName)
                        this.downloadingSheet = false
                        this.get7PsZipProgress = false;
                        // this.pfNumber = null
                    })
                    .catch(error => {
                        console.log(error)
                        this.responseView = false
                        this.get7PsZipProgress = false;
                    })
            }
            else {
                this.member = false
            }
        },
        get7PsConsolidated() {
            this.consolidated7psProgress = true;
            if (this.memberid == '' || this.memberid == null) {
                this.hintMe = "Please enter Accoount Number and save before proceeding"

            }

            if ((this.pfNumber !== '' && this.pfNumber !== null) && (this.mid !== '' && this.mid !== null)) {
                this.showProgress = true
                this.member = true
                this.$store.dispatch("CustomerModule/get7PsConsolidated", this.pfNumber)
                    .then(response => {
                        this.showProgress = false
                        this.responseView = false
                        let fileName = response.headers["x-suggested-filename"]
                        fileDownload(response.data, fileName)
                        this.downloadingSheet = false
                        this.consolidated7psProgress = false;
                        // this.pfNumber = null
                    })
                    .catch(error => {
                        console.log(error)
                        this.responseView = false
                        this.consolidated7psProgress = false;
                    })
            }
            else {
                this.member = false
            }
        },
        get8PsZip() {
            this.get8PsZipProgress = true;
            if (this.memberid == '' || this.memberid == null) {
                this.hintMe = "Please enter Accoount Number and save before proceeding"

            }

            if ((this.pfNumber !== '' && this.pfNumber !== null) && (this.mid !== '' && this.mid !== null)) {
                this.showProgress = true
                this.member = true
                this.$store.dispatch("CustomerModule/get8PsZip", this.pfNumber)
                    .then(response => {
                        this.showProgress = false
                        this.responseView = false
                        let fileName = response.headers["x-suggested-filename"]
                        fileDownload(response.data, fileName)
                        this.downloadingSheet = false
                        this.get8PsZipProgress = false;
                        // this.pfNumber = null
                    })
                    .catch(error => {
                        console.log(error)
                        this.responseView = false
                        this.get8PsZipProgress = false;
                    })
            }
            else {
                this.member = false
            }
        },
        get8PsConsolidated() {
            this.consolidated8psProgress = true;
            if (this.memberid == '' || this.memberid == null) {
                this.hintMe = "Please enter Accoount Number and save before proceeding"

            }

            if ((this.pfNumber !== '' && this.pfNumber !== null) && (this.mid !== '' && this.mid !== null)) {
                this.showProgress = true
                this.member = true
                this.$store.dispatch("CustomerModule/get8PsConsolidated", this.pfNumber)
                    .then(response => {
                        this.showProgress = false
                        this.responseView = false
                        let fileName = response.headers["x-suggested-filename"]
                        fileDownload(response.data, fileName)
                        this.downloadingSheet = false
                        this.consolidated8psProgress = false;
                        // this.pfNumber = null
                    })
                    .catch(error => {
                        console.log(error)
                        this.responseView = false
                        this.consolidated8psProgress = false;
                    })
            }
            else {
                this.member = false
            }
        },
        getMemberId() {
            this.memberid = null
            this.memberName = null
            this.fatherName = null
            this.retirementDate = null
            this.selectedSettlementType = null
            this.selectedFiscalYear = null
            this.establishmentName = null
            this.establishmentCode = null
            if (this.pfNumber != null) {
                // this.$store.dispatch("CustomerModule/getMemberId", this.pfNumber)
                //     .then(response => {
                //         if (response.memberId !== "failed") {
                //             this.mid = response.memberId
                //             this.member = true
                //             this.responseView = true
                //         } else {
                //             this.memberid = null
                //             this.hintMe = "Member ID Not Found, Please Enter Manually"
                //             this.member = false
                //             this.responseView = true
                //         }

                //     })
                //     .catch(error => {
                //         console.log(error)
                //     })
                this.$store.dispatch("CustomerModule/getMemberDetails", this.pfNumber)
                    .then(response => {
                        this.mid = response.memberId
                        this.memberName = response.name
                        this.fatherName = response.fatherName
                        this.establishmentName = response.address
                        this.establishmentCode = response.code
                        this.member = true
                        this.responseView = true

                    })
                    .catch(error => {
                        console.log(error)
                        this.memberid = null
                        // this.hintMe = "Member ID Not Found, Please Enter Manually"
                        this.member = false
                        this.formDialog = true
                    })
            }
        },
        saveMid() {
            if (this.pfNumber != null) {
                if (this.memberid == null || this.memberid == "") {
                    this.hintMe = "Please Enter Accoount Number"
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
                                this.hintMe = "Accoount Number Saved Successfully.."
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
        setMemberDetails() {
            let payload = {
                memberId: this.memberid,
                name: this.memberName,
                fatherName: this.fatherName,
                retirementDate: this.retirementDate,
                retirementType: this.selectedSettlementType,
                leavingFiscalYear: this.selectedFiscalYear,
                pfNumber: this.pfNumber,
                establishmentName: this.establishmentName,
                establishmentCode: this.establishmentCode
            }
            console.log(payload)
            if (this.pfNumber != null) {
                if (this.memberid == null || this.memberid == "") {
                    this.hintMe = "Please Enter Member ID"
                } 
                if( this.retirementDate != null && (this.selectedSettlementType == null || this.selectedFiscalYear == null)){
                    this.check = "You selected Retirement date so please Enter reason of leaving and retired fiscal year"
                } else if ( this.selectedSettlementType !== null && (this.retirementDate == null || this.selectedFiscalYear == null)){
                    this.check = "You selected reason of leaving so please Enter Retirement date and retired fiscal year"
                }else if( this.selectedFiscalYear !== null && (this.retirementDate == null || this.selectedSettlementType  == null)){
                    this.check = "You selected retired fiscal year so please Enter Retirement date and reason of leaving"
                }
                else {
                    this.$store.dispatch("CustomerModule/setMemberDetails", payload)
                        .then(response => {
                            console.log(response.status)
                            if (response.status == "true") {
                                this.savingStatus = "Details Saved Successfully !.."
                                this.formDialog = false
                                this.statusView = true
                                this.memberid = null
                                this.memberName = null
                                this.fatherName = null
                                this.retirementDate = null
                                this.selectedSettlementType = null
                                this.selectedFiscalYear = null
                                this.pfNumber = null
                                this.establishmentName = null
                                this.establishmentCode = null
                                this.responseView = false
                                this.check = ""
                            } else {
                                this.formDialog = false
                                this.responseView = false
                                this.savingStatus = "Unable To Save The Details !.."
                                this.statusView = true
                                this.memberid = null
                                this.memberName = null
                                this.fatherName = null
                                this.retirementDate = null
                                this.establishmentName = null
                                this.establishmentCode = null
                                this.selectedSettlementType = null
                                this.selectedFiscalYear = null
                                this.pfNumber = null
                                this.check = ""
                            }
                        })
                        .catch(error => {
                            console.log(error)
                            this.formDialog = false
                            this.savingStatus = "Some Error Occured While Saving The Details !.. \n You might left any of the mandatory field as empty. Please, fill all mandatory field and try again."
                            this.statusView = true
                            this.memberid = null
                            this.memberName = null
                            this.fatherName = null
                            this.retirementDate = null
                            this.selectedSettlementType = null
                            this.selectedFiscalYear = null
                            this.pfNumber = null
                            this.pfNumber = null
                            this.memberid = null
                            this.establishmentName = null
                            this.establishmentCode = null
                            this.responseView = false
                            this.check = ""
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