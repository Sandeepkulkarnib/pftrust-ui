<template>
  <v-container>
    <v-row>
      <v-col>
        <v-toolbar flat>
          <v-toolbar-title>{{ dashboardTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-col>
      <v-col cols="8">
        <v-card>
          <v-card-subtitle>
            NOTE :
          </v-card-subtitle>
          <v-card-text style="color: red"> 1. Only data from November 1995 is considered for text file genertion.<br>2.
            Text file is generated based on the input given in the excel file.<br>3. This is the Excel to text file
            convertor utility, Not a calculator.<br>4. Please do not edit the column headers.<br>5. Date must be in text format.</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="ma-0 pa-0">
      <v-col cols="3">
        <v-file-input show-size label="Select Data File" @change="loadData" v-model="dataFile"></v-file-input>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="3">
        <v-btn color="primary" small class="mr-1 ml-5" dark @click = "downloadMWDTemplate"
          >
          Download Template
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="this.display === true">
        <v-data-table :headers="headers" :items="contributions" class="elevation-3" :loading="loading"
          loading-text="Loading... Please wait" key="id">
          <template v-slot:top>
            <v-toolbar flat>
              <v-row>
                <v-col cols="8">
                  <p class="error--text" v-show="inValidMemberIdCount > 0">There are in valid Member IDs in the file.</p>
                  <p class="error--text" v-show="inValidContributionCount > 0">There are invalid contributions data in the
                    file, Please Correct and reload the file</p>
                </v-col>
                <v-col cols="4">
                  <v-btn color="primary" small class="mr-1 ml-5" v-show="contributions.length > 0 && showButtons" dark
                    @click="reset">
                    Reset
                  </v-btn>
                  <v-btn color="primary" small v-show="contributions.length > 0 && showButtons" dark @click="getMWDFile">
                    <v-progress-circular v-if="downloadingSheet === true" indeterminate
                      color="white"></v-progress-circular>
                    Generate Txt
                  </v-btn>
                </v-col>
              </v-row>
            </v-toolbar>
          </template>

          <template v-slot: [`item.memberId`]="{ item }">
            <div
              :class="!item.isValid.isValidMemberId ? 'in-valid-member-id' : !item.isValid.isValidContribution ? 'in-valid-contribution' : ''">
              {{ item["memberId"] }}</div>
          </template>

        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
  
<script>
import { isNotEmpty, isNumber } from "@/util/rules";
import fileDownload from "js-file-download";
import * as XLSX from 'xlsx'

export default {
  name: "ExistingLoan",
  data() {
    return {
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
      dashboardTitle: "Generate Manual MWD Text File",
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
      dialog: false,
      dialog2: false,
      message: "<p></p>",
      stausMessage: "<p></p>",
      dataFile: null,
      isValid: false,
      isValidMemberId: false,
      isValidContribution: false,
      inValidMemberIdCount: 0,
      inValidContributionCount: 0
    }
  },
  methods: {
    loadData(files) {

      this.inValidContributionCount = 0;
      this.inValidMemberIdCount = 0;

      if (files === null || files === undefined) {
        this.contributions = []
        this.errors = []
        return;
      }

      this.loading = true;

      files.arrayBuffer()
        .then(data => {
          let workBook = XLSX.read(data, { type: 'binary', cellText: false, cellDates: true });

          let workSheet = workBook.Sheets[workBook.SheetNames[0]];

          let json = XLSX.utils.sheet_to_json(workSheet,
            { header: 0, raw: false, dateNF: 'dd-mm-yyyy' });

          this.contributions = json.map(record => {
            let contribution = {
              "memberId": record["(1) Member ID"],
              "yearAndMonth": record["(2) Wage Month & Year"],
              "pfBase": record["(3) Wages on which PF contribution was paid"],
              "companyContribution": record["(4) Pension Contribution from employer 8.33%"],
              "admin_interest": record["(5) Pension Contribution from employee @ 1.16%"],
              "eps": record["(6) Pension Contribution Paid by the employer earlier"],
              "totalAmount": record["(7) Pension Contribution to be paid along with interest"],
              "interestRate": record["(8) Yearly PF Interest rate"]
            }
            contribution["isValid"] = this.validate(contribution)
            return contribution
          }).sort((a, b) => {
            let isValidA = a.isValid.isValidMemberId && a.isValid.isValidContribution ? 1 : 0
            let isValidB = b.isValid.isValidMemberId && b.isValid.isValidContribution ? 1 : 0
            return isValidA - isValidB
          })

          this.loading = false;
          console.log(JSON.stringify([this.contributions[0], this.contributions[1]]))
        })
        .catch(error => {
          console.log(error)
        })

    },
    getMWDFile() {
      let data = this.contributions

      this.$store.dispatch("CustomerModule/generateManualMwdExcel", data
      )
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
    downloadMWDTemplate(){
      this.$store.dispatch("CustomerModule/mwdTemplate")
          .then(response => {
            fileDownload(response.data, "MWD_File_Template.xlsx")
          })
          .catch(error => {
            console.log(error)
          })
    },
    reset() {
      this.contributions = []
      this.dataFile = null
    },
    validate(contribution) {

      let isValidMemberId = contribution["memberId"].length === 22

      let isValidContribution = contribution["pfBase"] >= 0
        && contribution["companyContribution"] >= 0
        && contribution["admin_interest"] >= 0
        && contribution["eps"] >= 0
        && contribution["totalAmount"] >= 0
        && contribution["interestRate"] >= 0

      this.isValid = isValidContribution && isValidMemberId
      this.isValidContribution = isValidContribution
      this.isValidMemberId = isValidMemberId

      if (!isValidMemberId) {
        this.inValidMemberIdCount++
      }

      if (!isValidContribution) {
        this.inValidContributionCount++
      }

      return {
        isValidMemberId: isValidMemberId,
        isValidContribution: isValidContribution
      }
    }
  },
  mounted() {

  },
  computed: {
    showButtons() {
      return !(this.inValidMemberIdCount > 0 || this.inValidContributionCount > 0);
    }
  }
}




</script>
  
<style scoped>
a {
  color: #000;
}

.in-valid-member-id {
  border-left: 5px solid red;
}

.in-valid-contribution {
  border-left: 5px solid red;
}</style>