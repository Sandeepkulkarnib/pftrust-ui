<template>
  <v-card>
    
    <v-dialog
          v-model="settlementStatus"
          max-width="500"
      >
        <v-card>
          <v-card-title>
            Application Status
            <v-spacer></v-spacer>
            <v-icon
                small
                color="black darken-2"
                @click="settlementStatus = false"
            >
              mdi-close
            </v-icon>
          </v-card-title>
          <v-card-text class="pa-5">
            <p v-html="statusMessage"></p>
          </v-card-text>
          <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary"
                 dark
                 @click="settlementStatus = false"
          >
            OK
          </v-btn>
        </v-card-actions>
        </v-card>
      </v-dialog>

    <v-dialog
        v-model="concentDialog"
        max-width="500px"
    >
      <v-card>
        <v-card-title>
          Please check the concent !.
          <v-spacer></v-spacer>
          <v-icon
              small
              color="black darken-2"
              @click="concentDialog = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>

        <v-container fluid fill-height>
          <v-row>
            <v-col>
              <v-checkbox v-model="confirmReject" color="primary">
                <template v-slot:label>
                  <div>
                    Please double-check the details to make sure they are correct before submitting.
                  </div>
                </template>
              </v-checkbox>
            </v-col>
          </v-row>
        </v-container>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary"
                 :disabled="!confirmReject"
                 dark
                 @click="approveApplication();concentDialog = false,confirmReject=false"
          >
            Submit
          </v-btn>
        </v-card-actions>

      </v-card>

    </v-dialog>

    <v-dialog
        v-model="rejectDialog"
        max-width="500px"
    >
      <v-card>
        <v-card-title>
          Reject Settlement Application
          <v-spacer></v-spacer>
          <v-icon
              small
              color="black darken-2"
              @click="rejectDialog = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>

        <v-container fluid fill-height>
          <v-row>
            <v-col>
              <v-checkbox v-model="confirmReject" color="primary">
                <template v-slot:label>
                  <div>
                    Please confirm that you want to reject this Settlement Application
                  </div>
                </template>
              </v-checkbox>
            </v-col>
          </v-row>
        </v-container>

        <v-card-actions>
          <p v-show="message !== null"
             :class="rejectRequestStatus === 'success' ? 'success--text' : 'error--text'">{{message}}</p>
          <v-spacer></v-spacer>
          <v-btn color="primary"
                 :disabled="!confirmReject"
                 dark
                 :loading="requestingReject"
                 v-if="data !== null && (data.isInProgress || data.isPaymentPending)"
                 @click="rejectSettlement"
          >
            Reject
          </v-btn>
        </v-card-actions>

      </v-card>

    </v-dialog>

    <v-dialog
        v-model="approvalDialog"
        max-width="500px"
    >
      <v-card>
        <v-card-title>
          Add Payment Details and Approve Application
          <v-spacer></v-spacer>
          <v-icon
              small
              color="black darken-2"
              @click="approvalDialog = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>

        <v-form
            ref="form"
            v-model="isValidForm"
            lazy-validation
        >
          <v-container fluid fill-height>
            <v-row>
              <v-col cols="12">
                <v-select
                    :items="banks"
                    item-value="entityId"
                    item-text="name"
                    label="Select Payment Bank"
                    dense
                    v-model="selectedBank"
                    :rules="rules.bankRules"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-select
                    :items="paymentModes"
                    item-value="entityId"
                    item-text="name"
                    label="Select Payment Mode."
                    dense
                    v-model="selectedPaymentMode"
                    :rules="rules.paymentModeRules"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                    v-model="referenceNumber"
                    label="Check No./UTR No./RRN Sr. No/IFT Ref No./DD No."
                    required
                    dense
                    :rules="rules.referenceNumberRules"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-menu
                    ref="paymentDateMenu"
                    v-model="paymentDateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="paymentDate"
                    transition="scale-transition"
                    min-width="auto"
                    offset-y
                    top
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="paymentDate"
                        label="Payment Date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        dense
                        :rules="rules.paymentDateRules"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                      v-model="paymentDate"
                      no-title
                      scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="primary"
                        @click="paymentDateMenu = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                        text
                        color="primary"
                        @click="$refs.paymentDateMenu.save(paymentDate)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-checkbox
                    v-model="sendConfirmationEmail"
                    label="Send Confirmation Email to Employee"
                    dense
                    hide-details
                ></v-checkbox>
              </v-col>
              <v-col cols="12">
                <v-checkbox
                    v-model="confirmPaymentDetails"
                    label="Update Payment Details and Close Application"
                    required
                    dense
                    hide-details
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-container>
        </v-form>

        <v-card-actions>
          <p v-show="message !== null"
             :class="paymentDetailsRequestStatus === 'success' ? 'success--text' : 'error--text'">{{message}}</p>
          <v-spacer></v-spacer>
          <v-btn color="primary"
                 :disabled="!confirmPaymentDetails"
                 dark
                 :loading="requestingPaymentDetailsUpdate"
                 v-if="data !== null && data.isPaymentPending"
                 @click="updatePaymentDetails"
                 small
          >
            Update & Approve
          </v-btn>
        </v-card-actions>

      </v-card>

    </v-dialog>

    <v-card-title>
      Settlement Details
      <v-progress-circular
          indeterminate
          :size="30"
          color="primary"
          class="ml-4"
          v-show="loading"
      ></v-progress-circular>
      <v-spacer></v-spacer>
      <v-chip
          class="ma-2"
          dark
          :color="statusChipColor()"
      >
        {{data === null ? "" : data.settlementStatus}}
      </v-chip>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="ma-0 pa-0">
      <v-container fluid fill-height v-if="data !== null">
        <v-row class="ma-0 pa-0">
          <v-col>
            <h4 class="text-decoration-underline">Basic Info:</h4>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.pernNumber}}</p>
              <p>Pern Number</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.pfNumber}}</p>
              <p>PF Number</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.tokenNumber}}</p>
              <p>Token Number</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.name}}</p>
              <p>Employee Name</p>
            </div>
          </v-col>
          <v-col>
            <div>
                <p class="font-weight-black mb-0 pb-0">{{data.dateOfJoining}}</p>
              <p>Date of Joining</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.dateOfJoiningPf}}</p>
              <p>Date of Joining PF</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.email}}</p>
              <p>Email</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.contactNumber}}</p>
              <p>Contact No.</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.dateOfLeaving}}</p>
              <p>Date Leaving:</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.membershipYears}}</p>
              <p>No.of Years of Membership</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.dateOfJoiningPrior}}</p>
              <p>Date of Joining Prior</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.dateOfBirth}}</p>
              <p>Date of Birth</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.status}}</p>
              <p>Status</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.age}}</p>
              <p>Age</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.netCredit}}</p>
              <p>Net Credit Amount</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.unitCode}}</p>
              <p>Unit Code</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="ma-0 pa-0">
          <v-col>
            <h4 class="text-decoration-underline">Employee alternate Info:</h4>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.altEmailId}}</p>
              <p>Alternate Email ID</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.altContactNumber}}</p>
              <p>Alternate Contact No</p>
            </div>
          </v-col>
          <v-col></v-col>
        </v-row>
        <v-row class="ma-0 pa-0">
          <v-col>
            <h4 class="text-decoration-underline">Settlement Info:</h4>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.settlementType}}</p>
              <p>Settlement Type</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.dateOfLeavingService}}</p>
              <p>Date Of leaving Service</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.settlementDate}}</p>
              <p>Settlement Date(Due Date)</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.addressLine1}}</p>
              <p>Address Line 1</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.addressLine2}}</p>
              <p>Address Line 2</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.addressLine3}}</p>
              <p>Address Line 3</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.addressLine4}}</p>
              <p>Address Line 4</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="ma-0 pa-0">
          <v-col>
            <h4 class="text-decoration-underline">Employee Tax Info:</h4>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.incomeTax}}</p>
              <p>Income Tax</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.eduCess}}</p>
              <p>Educ.Cess</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.tds}}</p>
              <p>TDS</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="ma-0 pa-0">
          <v-col>
            <h4 class="text-decoration-underline">Employee Bank Info:</h4>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.bankName}}</p>
              <p>Bank Name</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.accountNumber}}</p>
              <p>Account No</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.payeeName}}</p>
              <p>Payee Name</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.micrCode}}</p>
              <p>MICR Code</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.ifscCode}}</p>
              <p>IFSC Code</p>
            </div>
          </v-col>
          <v-col>
          </v-col>
        </v-row>
        <v-row class="ma-0 pa-0">
          <v-col>
            <h4 class="text-decoration-underline">Payment Bank Info:</h4>
          </v-col>
        </v-row>
        <v-row class="ma-0 pa-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.paymentBank}}</p>
              <p>Bank Name</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.paymentMode}}</p>
              <p>Payment Mode</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.paymentNumber==null? "NA":data.paymentNumber}}</p>
              <p>No. Cheque/UTR/RRN/IFT/DD</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="ma-0 pa-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.paymentDate}}</p>
              <p>Payment Date</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="ma-0 pa-0">
          <v-col>
            <h4 class="text-decoration-underline">Uploaded Documents</h4>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0" v-if="data.uploadedDocuments !== undefined && data.uploadedDocuments !== null
        && data.uploadedDocuments.length > 0">
          <v-col cols="12">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                <tr>
                  <th class="text-left">
                    Document
                  </th>
                  <th class="text-left">
                    Download
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="document in data.uploadedDocuments" :key="document.name">
                  <td>{{ document.name }}</td>
                  <td>
                    <v-btn icon color="success" text small class="mt-4" @click="downloadFile(document)">
                      <v-icon>mdi-cloud-download</v-icon>
                    </v-btn>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
        <v-row class="ma-0 pa-0">
          <v-col>
            <h4 class="text-decoration-underline">Settlement Documents:</h4>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <v-btn text small color="indigo"
                     :loading="downloadingWorksheet"
                     @click="downloadWorksheet()"
              >Download WorkSheet</v-btn>
            </div>
          </v-col>
          <v-col>
            <div>
              <v-btn text small color="indigo"
              :loading="downloadingDispatchLetter"
              @click="downloadDispatchLetter()"
              v-if="data.isCompleted">Download Dispatch Letter</v-btn>
            </div>
          </v-col>
          <v-col>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-divider v-if="data !== null && data.isInProgress"></v-divider>
    <v-card-actions v-if="data !== null && data.isInProgress">
      <v-spacer></v-spacer>
      <v-btn
          color="indigo"
          dark
          small
          :to="'/settlements/' + $route.params.entityId + '/update'"
      >
        Edit Application
      </v-btn>
      <v-btn
          color="indigo"
          dark
          small
          @click="concentDialog = true"
      >
        Approve Application
      </v-btn>
      <v-btn
          color="indigo"
          dark
          small
          @click="rejectDialog = true"
      >
        Reject Application
      </v-btn>
    </v-card-actions>
    <v-divider v-if="data !== null && data.isPaymentPending"></v-divider>
    <v-card-actions v-if="data !== null && data.isPaymentPending">
      <v-spacer></v-spacer>
      <v-btn
          color="indigo"
          dark
          small
          @click="approvalDialog = true"
      >
        Add Payment Details
      </v-btn>
      <v-btn
          color="indigo"
          dark
          small
          @click="rejectDialog = true"
      >
        Reject Application
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>

import fileDownload from "js-file-download";
import {isNotEmpty} from "@/util/rules";

export default {
  name: "SettlementDetails",
  data() {
    return {
      statusMessage: "",
      settlementStatus: false,
      concent : false,
      concentDialog: false,
      minDate : "",
      loading: false,
      data: null,
      isValidForm: true,
      paymentDetailsRequestStatus: null,
      confirmPaymentDetails: false,
      requestingPaymentDetailsUpdate: false,
      paymentDate: null,
      paymentDateMenu: false,
      banks: [],
      selectedBank: null,
      paymentModes: [],
      selectedPaymentMode: null,
      referenceNumber: null,
      sendConfirmationEmail: false,
      rules: {
        bankRules: [
          v => isNotEmpty(v, "Please select a Bank")
        ],
        paymentModeRules: [
          v => isNotEmpty(v, "Please select a Payment Mode")
        ],
        referenceNumberRules: [
          v => isNotEmpty(v, "Reference No. is Required")
        ],
        paymentDateRules: [
          v => isNotEmpty(v, "Payment Date is Required")
        ]
      },
      rejectDialog: false,
      approvalDialog: false,
      confirmReject: false,
      rejectRequestStatus: null,
      message: null,
      requestingReject: false,
      downloadingWorksheet: false,
      downloadingDispatchLetter: false
    }
  },
  computed: {
    maxDate(){
      const date = new Date()
      const month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`
      const fdate = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`
      return `${date.getFullYear()}-${month}-${fdate}`
    }
  },
  watch: {

  },
  methods: {
    getDetails(){
      this.loading = true
      this.$store.dispatch("settlementModule/fetchSettlementDetails", this.$route.params.entityId)
          .then(response => {
            this.loading = false
            this.data = JSON.parse(response)
            this.paymentModes = this.data.paymentModes
            this.banks = this.data.banks
            this.minDate = new Date(this.data.dateOfSettlement.slice(0,10))
            this.minDate = this.minDate.toISOString().slice(0,10)
            let bankObj = this.banks.find(o => o.name === this.data.paymentBank)
            this.selectedBank = bankObj.entityId
            let paymentModeObj =  this.paymentModes.find(o => o.name === this.data.paymentMode)
            this.selectedPaymentMode = paymentModeObj.entityId
          })
          .catch(error => {
            console.log(error)
          })
    },
    statusChipColor() {
      if(this.data === null){
        return "indigo"
      }
      return this.data.isCompleted ? 'success' : this.data.isInProgress ? 'indigo' : 'danger'
    },
    rejectSettlement(){
      this.requestingReject = true

      this.$store.dispatch("settlementModule/rejectSettlementApplication", this.$route.params.entityId)
          .then(response => {
            this.requestingReject = false
            this.getDetails()
            this.message = response
            this.rejectRequestStatus = "success"
          })
          .catch(error => {
            this.requestingReject = false
            this.message = error
            this.rejectRequestStatus = "failed"
          })
    },
    updatePaymentDetails(){
      const isValid = this.$refs.form.validate()
      if(isValid){
        this.requestingPaymentDetailsUpdate = true
        let data = {
          paymentDate : this.paymentDate,
          referenceNumber : this.referenceNumber,
          bank: this.selectedBank,
          paymentMode: this.selectedPaymentMode,
          sendConfirmationMail: this.sendConfirmationEmail,
          entityId: this.$route.params.entityId
        }
        this.$store.dispatch("settlementModule/savePaymentDetails", data)
            .then(response => {
              this.requestingPaymentDetailsUpdate = false
              this.getDetails()
              this.message = response
              this.paymentDetailsRequestStatus = "success"
            })
            .catch(error => {
              this.requestingPaymentDetailsUpdate = false
              this.message = error
              this.paymentDetailsRequestStatus = "failed"
            })
      }
    },
    downloadWorksheet() {

      this.downloadingWorksheet = true

      this.$store.dispatch("settlementModule/downloadSettlementWorksheet", this.$route.params.entityId)
          .then(response => {
            let fileName = response.headers["x-suggested-filename"]
            fileDownload(response.data, fileName)
            this.downloadingWorksheet = false
          })
          .catch(error => {
            console.log(error)
          })
    },
    downloadDispatchLetter() {

      this.downloadingDispatchLetter = true

      this.$store.dispatch("settlementModule/downloadSettlementDispatchLetter", this.$route.params.entityId)
          .then(response => {
            let fileName = response.headers["x-suggested-filename"]
            fileDownload(response.data, fileName)
            this.downloadingDispatchLetter = false
          })
          .catch(error => {
            console.log(error)
          })
    },
    downloadFile(document){

      this.$store.dispatch("settlementModule/downloadSettlementDocument", document.path)
          .then(response => {
            let fileName = response.headers["x-suggested-filename"]
            fileDownload(response.data, fileName)
          })
          .catch(error => {
            console.log(error)
          })

    },
    approveApplication(){
       
      this.$store.dispatch("settlementModule/approveApplication", this.$route.params.entityId)
          .then(response => {
            this.requestingPaymentDetailsUpdate = false
            this.getDetails()
            this.statusMessage = response
            this.paymentDetailsRequestStatus = "success"
            this.settlementStatus = true
          })
          .catch(error => {
            this.requestingPaymentDetailsUpdate = false
            this.statusMessage = error
            this.paymentDetailsRequestStatus = "failed"
            this.settlementStatus = true
          })
      },
  },
  mounted() {
    this.getDetails()
  }
}
</script>

<style scoped>

</style>