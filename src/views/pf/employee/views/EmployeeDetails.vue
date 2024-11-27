<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col>
        <v-toolbar flat>
          <v-toolbar-title>Employee Details
            <v-progress-circular
                indeterminate
                color="primary"
                v-show="loading"
            ></v-progress-circular>
          </v-toolbar-title>
        </v-toolbar>
        <v-tabs
            fixed-tabs
            v-model="tab"
        >
          <v-tab
              v-for="item in items"
              :key="item"
          >
            {{ item }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item v-if="basicDetails !== null"
          >
            <v-card
                flat
            >
              <v-card-text>
                <v-container>
                  <v-row class="rw">
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{basicDetails.pernNumber}}</v-list-item-title>
                          <v-list-item-subtitle>PERN Number</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{basicDetails.tokenNumber}}</v-list-item-title>
                          <v-list-item-subtitle>Token Number</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{basicDetails.pfNumber}}</v-list-item-title>
                          <v-list-item-subtitle>PF Acc Number</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{basicDetails.unitCode}}</v-list-item-title>
                          <v-list-item-subtitle>Unit Code</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                  <v-row class="rw">
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{basicDetails.dateOfJoiningPf}}</v-list-item-title>
                          <v-list-item-subtitle>Date of Joining PF</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{basicDetails.dateOfJoiningService}}</v-list-item-title>
                          <v-list-item-subtitle>Date of Joining Service</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{basicDetails.contributionStatus}}</v-list-item-title>
                          <v-list-item-subtitle>Contribution Status</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{basicDetails.lastRecoveryDate}}</v-list-item-title>
                          <v-list-item-subtitle>Last Recovery Date</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                  <v-row class="rw">
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{basicDetails.name}}</v-list-item-title>
                          <v-list-item-subtitle>Name</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{basicDetails.age}}</v-list-item-title>
                          <v-list-item-subtitle>AGE</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{basicDetails.gender}}</v-list-item-title>
                          <v-list-item-subtitle>Gender</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{basicDetails.dob}}</v-list-item-title>
                          <v-list-item-subtitle>Date of Birth</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                  <v-row class="rw">
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{basicDetails.payrollArea}}</v-list-item-title>
                          <v-list-item-subtitle>Payroll Area</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{basicDetails.designation}}</v-list-item-title>
                          <v-list-item-subtitle>Designation</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{basicDetails.department}}</v-list-item-title>
                          <v-list-item-subtitle>Department</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{basicDetails.location}}</v-list-item-title>
                          <v-list-item-subtitle>Location</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                  <v-row class="rw">
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{basicDetails.epfNumber}}</v-list-item-title>
                          <v-list-item-subtitle>EPF Number</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{basicDetails.panNumber}}</v-list-item-title>
                          <v-list-item-subtitle>PAN Number</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{basicDetails.aadharNumber}}</v-list-item-title>
                          <v-list-item-subtitle>AADHAR Number</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{basicDetails.uanNumber}}</v-list-item-title>
                          <v-list-item-subtitle>UAN Number</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                  <v-row class="rw">
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{basicDetails.email}}</v-list-item-title>
                          <v-list-item-subtitle>Email</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{basicDetails.personalEmail}}</v-list-item-title>
                          <v-list-item-subtitle>Alternate Email</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{basicDetails.contactNumber}}</v-list-item-title>
                          <v-list-item-subtitle>Contact Number</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{basicDetails.alternateContactNumber}}</v-list-item-title>
                          <v-list-item-subtitle>Alternate Contact Number</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item v-if="otherDetails !== null">
            <v-card flat>
              <v-card-text>
                <v-container>
                  <v-row class="rw" v-for="nominee in otherDetails.nominees" :key="nominee.name">
                    <v-col cols="4">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{nominee.name}}</v-list-item-title>
                          <v-list-item-subtitle>Name</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="4">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{nominee.relationship}}</v-list-item-title>
                          <v-list-item-subtitle>Relationship</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="4">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{nominee.share}}</v-list-item-title>
                          <v-list-item-subtitle>Share</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item v-if="otherDetails !== null">
            <v-card flat>
              <v-card-text>
                <v-container>
                  <v-row class="rw" v-for="bank in otherDetails.bankDetailsDTOS" :key="bank.name">
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{bank.name}}</v-list-item-title>
                          <v-list-item-subtitle>Bank Name</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{bank.accountNumber}}</v-list-item-title>
                          <v-list-item-subtitle>Account Number</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{bank.ifscCode}}</v-list-item-title>
                          <v-list-item-subtitle>IFSC Code</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="3">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{bank.micrCode}}</v-list-item-title>
                          <v-list-item-subtitle>MICR Code</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item v-if="otherDetails !== null">
            <v-card flat>
              <v-card-text>
                <v-container>
                  <v-row class="rw" v-for="address in otherDetails.addressDetailsDTOS" :key="address.addressLine1">
                    <v-col cols="12">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{address.addressLine1}}</v-list-item-title>
                          <v-list-item-subtitle>Address Line 1</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="12">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{address.addressLine2}}</v-list-item-title>
                          <v-list-item-subtitle>Address Line 2</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="6">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{address.addressLine3}}</v-list-item-title>
                          <v-list-item-subtitle>Address Line 3</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="6">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{address.addressLine4}}</v-list-item-title>
                          <v-list-item-subtitle>Address Line 4</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item v-if="transferInDetails !== null">
            <v-card class="mt-5">
              <v-data-table
                  :headers="transferInDetailHeaders"
                  :items="transferInDetails"
                  :items-per-page="10"
                  class="elevation-1"
                  :loading="loading"
                  loading-text="Loading... Please wait"
              >

                <template v-slot:[`item.actions`]="{item}">
                  <v-btn text color="primary" :to="'/transfer-ins/details/' + item.entityId">
                    Details
                  </v-btn>
                </template>

              </v-data-table>
            </v-card>
          </v-tab-item>
          <v-tab-item v-if="loanDetails !== null">
            <v-card class="mt-5">
              <v-data-table
                  :headers="loanDetailHeaders"
                  :items="loanDetails"
                  :items-per-page="10"
                  class="elevation-1"
                  :loading="loading"
                  loading-text="Loading... Please wait"
              >

                <template v-slot:[`item.actions`]="{item}">
                  <v-btn text color="primary" :to="'/loans/details/' + item.entityId">
                    Details
                  </v-btn>
                </template>

              </v-data-table>
            </v-card>
          </v-tab-item>
          <v-tab-item v-if="settlementDetails !== null">
            <v-card class="mt-5">
              <v-data-table
                  :headers="settlementDetailHeaders"
                  :items="settlementDetails"
                  :items-per-page="10"
                  class="elevation-1"
                  :loading="loading"
                  loading-text="Loading... Please wait"
              >
                <template v-slot:[`item.actions`]="{item}">
                  <v-btn v-if="item.settlement" text color="primary" :to="'/settlements/details/' + item.entityId">
                    Details
                  </v-btn>
                  <v-btn v-if="!item.settlement" text color="primary" :to="'/transfer-outs/details/' + item.entityId">
                    Details
                  </v-btn>
                </template>
              </v-data-table>
            </v-card>
          </v-tab-item>
          <v-tab-item v-if="basicDetails !== null">
            <v-card flat>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="6">
                      <v-select
                          v-model="selectedYear"
                          :items="years"
                          label="Select Years"
                          chips
                          deletable-chips
                      >
                      </v-select>
                    </v-col>
                    <v-col cols="6">
                      <v-btn color="primary" dark class="mt-8 float-right mr-5"
                             small
                             :loading="loadingMonthlyStatement"
                             @click="$refs.myPdfComponent.print(100, monthlyStatementFileName)">Download</v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <vue-pdf-embed v-if="pdfsrc !== null" :source="pdfsrc" ref="myPdfComponent" />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item v-if="basicDetails !== null">
            <v-card flat>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="6">
                      <v-select
                          v-show="annualStatementYears.length > 0"
                          v-model="selectedAnnualStatementYear"
                          :items="annualStatementYears"
                          label="Select Years"
                          chips
                          deletable-chips
                      >
                      </v-select>
                    </v-col>
                    <v-col cols="6">
                      <v-btn color="primary" dark class="mt-8 float-right mr-5"
                             v-show="annualStatementYears.length > 0"
                             small
                             :loading="loadingAnnualStatement"
                             @click="$refs.myAnnualPdfComponent.print(100, monthlyStatementFileName)">Download</v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <vue-pdf-embed v-if="annualStatementPdfSrc !== null"
                                     :source="annualStatementPdfSrc" ref="myAnnualPdfComponent" />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VuePdfEmbed from 'vue-pdf-embed/dist/vue2-pdf-embed'

export default {
  name: "EmployeeDetails",
  components: {
    VuePdfEmbed
  },
  data () {
    return {
      tab: null,
      items: [
        'Basic Details', 'Nominee Details', 'Bank Details', 'Address Details', 'TransferIn History', 'Loan History',
        'Settlement/Transfer Out History', 'Monthly Statements', 'Annual Statements'
      ],
      loading: true,
      data: null,
      pdfsrc: null,
      monthlyStatementFileName: null,
      loadingMonthlyStatement: true,
      loanDetailHeaders: [
        {text: 'Loan Type', align: 'start', value: 'type'},
        {text: 'Application Date', sortable: true, value: 'applicationDate'},
        {text: 'Applied Amount', sortable: true, value: 'appliedAmount'},
        {text: 'Status', sortable: true, value: 'status'},
        {text: 'Approval Date', sortable: true, value: 'approvalDate'},
        {text: 'Eligible Amount', sortable: true, value: 'eligibleAmount'},
        {text: 'Disbursal Date', sortable: true, value: 'disbursalDate'},
        {text: 'Document No', sortable: true, value: 'documentNo'},
        {text: 'Actions', sortable: false, value: 'actions'},
      ],
      transferInDetailHeaders: [
        {text: 'Company', align: 'start', value: 'company'},
        {text: 'PF Number', sortable: true, value: 'pfNumber'},
        {text: 'Pension Acc No.', sortable: true, value: 'pensionAccountNumber'},
        {text: 'Date of Joining', sortable: true, value: 'dateOfJoining'},
        {text: 'Date of Leaving', sortable: true, value: 'dateOfLeaving'},
        {text: 'Account Holder', sortable: true, value: 'accountHolder'},
        {text: 'Status', sortable: true, value: 'status'},
        {text: 'Posting Date', sortable: true, value: 'postingDate'},
        {text: 'Document No', sortable: true, value: 'documentNumber'},
        {text: 'Actions', sortable: false, value: 'actions'},
      ],
      settlementDetailHeaders: [
        {text: 'Payee Name', align: 'start', value: 'payeeName'},
        {text: 'Date of Leaving', sortable: true, value: 'dateLeavingService'},
        {text: 'Date of Settlement', sortable: true, value: 'dateOfSettlement'},
        {text: 'Type', sortable: true, value: 'type'},
        {text: 'Status', sortable: true, value: 'status'},
        {text: 'Payment Date', sortable: true, value: 'paymentDate'},
        {text: 'Total Contribution', sortable: true, value: 'totalContribution'},
        {text: 'Net Credit Amount', sortable: true, value: 'netCreditAmount'},
        {text: 'Document No.', sortable: true, value: 'documentNumber'},
        {text: 'Actions', sortable: false, value: 'actions'},
      ],
      selectedYear: null,
      selectedAnnualStatementYear: null,
      loadingAnnualStatement: true,
      annualStatementPdfSrc: null,
      annualStatementFileName: null
    }
  },
  methods: {
    getMonthlyStatement() {
      this.loadingMonthlyStatement = true
      this.$store.dispatch("employeeModule/fetchMonthlyStatementPdf", {
        entityId: this.$route.params.entityId,
        year: this.selectedYear
      })
      .then(response => {
        console.log("Success", response);
        this.monthlyStatementFileName = response.headers["x-suggested-filename"]
        const blob = new Blob([response.data]);
        this.pdfsrc = URL.createObjectURL(blob);
        this.loadingMonthlyStatement = false
      })
      .catch(error => {
        console.log(error)
      })
    },
    getAnnualStatement() {
      this.loadingAnnualStatement = true
      this.$store.dispatch("employeeModule/fetchAnnualStatementPdf", {
        entityId: this.$route.params.entityId,
        year: this.selectedAnnualStatementYear
      })
          .then(response => {
            console.log("Success", response);
            this.annualStatementFileName = response.headers["x-suggested-filename"]
            const blob = new Blob([response.data]);
            this.annualStatementPdfSrc = URL.createObjectURL(blob);
            this.loadingAnnualStatement = false
          })
          .catch(error => {
            console.log(error)
          })
    },
  },
  computed: {
    unitCodes () {
      return this.$store.state.employeeModule.unitCodes.map(code => code.unitCode)
    },
    years() {
      return this.$store.state.employeeModule.years
    },
    financialMonths() {
      return this.$store.state.employeeModule.months
    },
    basicDetails() {
      if(this.data === null) return null;
      return this.data.basicDetailsDTO;
    },
    otherDetails() {
      if(this.data === null) return null;
      return this.data.otherDetailsDTO
    },
    loanDetails() {
      if(this.data === null) return null;
      return this.data.loanDetailsDTOS;
    },
    transferInDetails() {
      if(this.data === null) return null;
      return this.data.transferInDetailsDTOS;
    },
    settlementDetails() {
      if(this.data === null) return null;
      return this.data.settlementDetailsDTOS;
    },
    annualStatementYears() {
      if(this.data === null) return [];
      return this.data.annualStatementYears;
    }
  },
  watch: {
    selectedYear() {
      this.getMonthlyStatement();
    },
    selectedAnnualStatementYear() {
      this.getAnnualStatement()
    },
    annualStatementYears() {
      if(this.annualStatementYears !== null && this.annualStatementYears.length > 0){
        this.selectedAnnualStatementYear = this.annualStatementYears[0]
        this.getAnnualStatement()
      }
    }
  },
  mounted() {

    if(this.years.length < 1){
      this.$store.dispatch("employeeModule/fetchCommons")
          .then(response => {
            this.selectedYear = response.years[0]
            this.getMonthlyStatement();
          })
          .catch(error => console.log(error))
    }else {
      this.selectedYear = this.years[0]
      this.getMonthlyStatement();
    }

    this.$store.dispatch("employeeModule/fetchEmployeeDetails", this.$route.params.entityId)
        .then(response => {
          this.data = response
          this.loading = false
        })
        .catch(error => console.log(error))

  },
  beforeDestroy() {
    URL.revokeObjectURL(this.pdfsrc)
  }
}
</script>

<style scoped>
  .rw {
    border-bottom: 1px solid #f6ecec;
  }
</style>