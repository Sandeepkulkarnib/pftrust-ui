<template>
  <v-card>

    <v-dialog
          v-model="loanStatus"
          max-width="500"
      >
        <v-card>
          <v-card-title>
            Application Status
            <v-spacer></v-spacer>
            <v-icon
                small
                color="black darken-2"
                @click="loanStatus = false"
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
                 @click="loanStatus = false"
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
          Approve Loan Application
          <v-spacer></v-spacer>
          <v-icon
              small
              color="black darken-2"
              @click="concentDialog = false,confirmReject = false"
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
                    Please confirm that you want to reject this Loan Application
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
                 v-if="data !== null && data.isInProgress"
                 @click="approveApplication();concentDialog = false,confirmReject = false"
          >
            Approve
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
          Reject Loan Application
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
                    Please confirm that you want to reject this Loan Application
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
                 @click="rejectLoan"
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
                    ref="approvalDateMenu"
                    v-model="approvalDateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="approvalDate"
                    transition="scale-transition"
                    min-width="auto"
                    offset-y
                    top
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="approvalDate"
                        label="Approval Date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        dense
                        :rules="rules.paymentDateRules"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                      v-model="approvalDate"
                      no-title
                      scrollable
                      :max="maxDate"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="primary"
                        @click="approvalDateMenu = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                        text
                        color="primary"
                        @click="$refs.approvalDateMenu.save(approvalDate)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
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
                      :max="maxDate"
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
      Loan Details
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
        {{data === null ? "" : data.loanStatus}}
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
              <p class="font-weight-black mb-0 pb-0">{{data.status}}</p>
              <p>Contribution Status</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.dateOfBirth}}</p>
              <p>Date of Birth</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.dateOfJoiningPrior}}</p>
              <p>Date of Joining Prior</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.email}}</p>
              <p>Email Id</p>
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
              <p class="font-weight-black mb-0 pb-0">{{data.pfBase}}</p>
              <p>PF Base</p>
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
              <p class="font-weight-black mb-0 pb-0">{{data.age}}</p>
              <p>Age</p>
            </div>
          </v-col>
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
            <h4 class="text-decoration-underline">Employee Bank Details:</h4>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.employeeBankName}}</p>
              <p>Bank Name</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.employeeBankBranch}}</p>
              <p>Bank Branch</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.employeeAccountNumber}}</p>
              <p>Account No.</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.employeeBankIfscCode}}</p>
              <p>IFSC Code</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.employeeBankMicrCode}}</p>
              <p>MICR Code</p>
            </div>
          </v-col>
          <v-col>
          </v-col>
        </v-row>
        <v-row class="ma-0 pa-0">
          <v-col>
            <h4 class="text-decoration-underline">Loan Details:</h4>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.loanType}}</p>
              <p>Loan Type</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.applicationReceivedDate}}</p>
              <p>Application Received Date</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.applicationDate}}</p>
              <p>Application Date</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.approvalDate}}</p>
              <p>Approval Date</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.disbursalDate}}</p>
              <p>Disbursal Date</p>
            </div>
          </v-col>
          <v-col>
          </v-col>
        </v-row>
        <v-row class="ma-0 pa-0">
          <v-col>
            <h4 class="text-decoration-underline">Other Details</h4>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col cols="4" v-if="data.dateOfCompletionOfHouse !== ''">
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.dateOfCompletionOfHouse}}</p>
              <p>Date of Completion of House</p>
            </div>
          </v-col>
          <v-col cols="4" v-if="data.dateOfFirstAlteration !== ''">
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.dateOfFirstAlteration}}</p>
              <p>Date of first Alteration</p>
            </div>
          </v-col>
          <v-col cols="4" v-if="data.propertyEstimatedPrice !== '0.00'">
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.propertyEstimatedPrice}}</p>
              <p>Property Estimated Price</p>
            </div>
          </v-col>
          <v-col cols="4" v-if="data.stampDuty !== '0.00'">
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.stampDuty}}</p>
              <p>Stamp Duty</p>
            </div>
          </v-col>
          <v-col  cols="4" v-if="data.propertyRegistration !== '0.00'">
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.propertyRegistration}}</p>
              <p>Property Registration</p>
            </div>
          </v-col>
          <v-col  cols="4" v-if="data.insurance !== '0.00'">
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.insurance}}</p>
              <p>Insurance</p>
            </div>
          </v-col>
          <v-col cols="4" v-if="data.other !== '0.00'">
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.other}}</p>
              <p>Other</p>
            </div>
          </v-col>
          <v-col  cols="4" v-if="data.total !== '0.00'">
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.total}}</p>
              <p>Total</p>
            </div>
          </v-col>
          <v-col  cols="4" v-if="data.financialInstName !== undefined">
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.financialInstName}}</p>
              <p>Financial Institute Name</p>
            </div>
          </v-col>
          <v-col  cols="4" v-if="data.repaymentBank !== undefined">
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.repaymentBank}}</p>
              <p>Repayment Bank</p>
            </div>
          </v-col>
          <v-col  cols="4" v-if="data.repaymentBankBranch !== undefined">
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.repaymentBankBranch}}</p>
              <p>Repayment Bank Branch</p>
            </div>
          </v-col>
          <v-col  cols="4" v-if="data.repaymentBankAccountNumber !== undefined">
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.repaymentBankAccountNumber}}</p>
              <p>Repayment Account Number</p>
            </div>
          </v-col>
          <v-col  cols="4" v-if="data.repaymentBankIfscCode !== undefined">
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.repaymentBankIfscCode}}</p>
              <p>Repayment IFSC Code</p>
            </div>
          </v-col>
          <v-col  cols="4" v-if="data.repaymentBankMicrCode !== undefined">
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.repaymentBankMicrCode}}</p>
              <p>Repayment MICR Code</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="ma-0 pa-0">
          <v-col>
            <h4 class="text-decoration-underline">Loan Payment Details</h4>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.paymentDate}}</p>
              <p>Payment Date</p>
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
              <p class="font-weight-black mb-0 pb-0">{{data.amountDisbursed}}</p>
              <p>Amount Disbursed</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="ma-0 pa-0">
          <v-col>
            <h4 class="text-decoration-underline">Loan Documents</h4>
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
            <h4 class="text-decoration-underline">Download Documents</h4>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col cols="3">
            <div>
              <v-btn text small color="indigo"
                     :loading="downloadingWorksheet"
                     @click="downloadWorksheet()"
              >Download WorkSheet</v-btn>
            </div>
          </v-col>
          <v-col v-if="data !== null && data.isCompleted">
            <div>
              <v-btn text small color="indigo"
                     :loading="downloadingReceipt"
                     @click="downloadReceipt()"
              >Download Receipt</v-btn>
            </div>
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
          :to="'/loans/' + $route.params.entityId + '/update'"
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
import {isNotEmpty} from "@/util/rules";
import fileDownload from "js-file-download";

export default {
  name: "LoanDetails",
  data() {
    return {
      statusMessage: "",
      concent : false,
      loanStatus: false,
      concentDialog: false,
      loading: true,
      data: null,
      rejectDialog: false,
      confirmReject: false,
      message: null,
      rejectRequestStatus: false,
      requestingReject: false,
      isValidForm: true,
      paymentDetailsRequestStatus: null,
      confirmPaymentDetails: false,
      requestingPaymentDetailsUpdate: false,
      approvalDate: null,
      approvalDateMenu: false,
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
        approvalDateRules: [
          v => isNotEmpty(v, "Approval Date is Required")
        ],
        paymentDateRules: [
          v => isNotEmpty(v, "Payment Date is Required")
        ]
      },
      approvalDialog: false,
      downloadingWorksheet: false,
      downloadingReceipt: false,
      maxDate: null
    }
  },
  computed: {

  },
  methods: {
    getDetails() {
      this.$store.dispatch("loanModule/fetchLoanDetails", this.$route.params.entityId)
          .then(response => {
            this.data = JSON.parse(response)
            this.paymentModes = this.data.paymentModes
            this.banks = this.data.banks
            this.loading = false

            let bankObj = this.banks.find(o => o.name === this.data.paymentBank)
            this.selectedBank = bankObj.entityId
            let paymentModeObj =  this.paymentModes.find(o => o.name === this.data.paymentMode)
            this.selectedPaymentMode = paymentModeObj.entityId
          })
          .catch(error => console.log(error))
    },
    statusChipColor() {
      if(this.data === null){
        return "indigo"
      }
      return this.data.isCompleted ? 'success' : this.data.isInProgress ? 'indigo' : 'danger'
    },
    rejectLoan(){
      this.requestingReject = true

      this.$store.dispatch("loanModule/rejectLoanApplication", this.$route.params.entityId)
          .then(response => {
            this.requestingReject = false
            this.getDetails()
            this.message = response
            this.rejectRequestStatus = "success"
            this.rejectDialog = false
          })
          .catch(error => {
            this.requestingReject = false
            this.message = error
            this.rejectRequestStatus = "failed"
          })
    },
    updatePaymentDetails() {

      const isValid = this.$refs.form.validate()

      if(isValid){
        this.requestingPaymentDetailsUpdate = true
        let data = {
          paymentDate : this.paymentDate,
          approvalDate: this.approvalDate,
          referenceNumber : this.referenceNumber,
          bank: this.selectedBank,
          paymentMode: this.selectedPaymentMode,
          sendConfirmationMail: this.sendConfirmationEmail,
          entityId: this.$route.params.entityId
        }
        this.$store.dispatch("loanModule/savePaymentDetails", data)
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

      this.$store.dispatch("loanModule/downloadLoanWorksheet", this.$route.params.entityId)
          .then(response => {
            let fileName = response.headers["x-suggested-filename"]
            fileDownload(response.data, fileName)
            this.downloadingWorksheet = false
          })
          .catch(error => {
            console.log(error)
          })
    },
    downloadReceipt() {

      this.downloadingReceipt = true

      this.$store.dispatch("loanModule/downloadLoanReceipt", this.$route.params.entityId)
          .then(response => {
            let fileName = response.headers["x-suggested-filename"]
            fileDownload(response.data, fileName)
            this.downloadingReceipt = false
          })
          .catch(error => {
            console.log(error)
          })
    },
    downloadFile(document){
      this.$store.dispatch("loanModule/downloadLoanDocument", document.path)
          .then(response => {
            let fileName = response.headers["x-suggested-filename"]
            fileDownload(response.data, fileName)
          })
          .catch(error => {
            console.log(error)
          })
    },
    approveApplication(){
       
       this.$store.dispatch("loanModule/approveApplication", this.$route.params.entityId)
           .then(response => {
             this.getDetails()
             this.statusMessage = response
             this.loanStatus = true
           })
           .catch(error => {
             this.statusMessage = error
             this.loanStatus = true
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