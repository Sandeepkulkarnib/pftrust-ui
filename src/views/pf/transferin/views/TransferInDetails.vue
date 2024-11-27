<template>
  <v-card>

    <v-dialog
        v-model="rejectDialog"
        max-width="500px"
    >
      <v-card>
        <v-card-title>
          Reject Transfer In Application
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
                    Please confirm that you want to reject this Transfer In Request
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
                 @click="rejectTransferIn"
          >
            Reject
          </v-btn>
        </v-card-actions>

      </v-card>

    </v-dialog>

    <v-dialog
        v-model="annexurkDialog"
        max-width="700px"
    >
      <v-card>
        <v-card-title>
          AnnexureK Details for Transfer In Application
          <v-spacer></v-spacer>
          <v-icon
              small
              color="black darken-2"
              @click="annexurkDialog = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>

        <v-form
            ref="annexureKForm"
            v-model="isValidAnnexureKForm"
            lazy-validation
        >
          <v-container fluid fill-height>
            <v-row>
              <v-col cols="4">
                <v-text-field
                    v-model="memberContribution"
                    label="Member Contribution"
                    :rules="rules.memberContributionRules"
                    required
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                    v-model="companyContribution"
                    label="Company Contribution"
                    :rules="rules.companyContributionRules"
                    required
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                    v-model="totalContributions"
                    label="Total Contribution"
                    readonly
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-menu
                    ref="postingDateMenu"
                    v-model="postingDateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="postingDate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="postingDate"
                        label="Date of Posting"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="rules.postingDateRules"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                      v-model="postingDate"
                      no-title
                      scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="primary"
                        @click="postingDateMenu = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                        text
                        color="primary"
                        @click="$refs.postingDateMenu.save(postingDate)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="4">
                <v-menu
                    ref="dateOfJoiningPriorMenu"
                    v-model="dateOfJoiningPriorMenu"
                    :close-on-content-click="false"
                    :return-value.sync="dateOfJoiningPrior"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="dateOfJoiningPrior"
                        label="Date of Joining Prior"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="rules.dateOfJoiningPriorRules"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                      v-model="dateOfJoiningPrior"
                      no-title
                      scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="primary"
                        @click="dateOfJoiningPriorMenu = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                        text
                        color="primary"
                        @click="$refs.dateOfJoiningPriorMenu.save(dateOfJoiningPrior)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="4">
                <v-text-field
                    v-model="bank"
                    label="Bank"
                    required
                    :rules="rules.bankRules"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                    v-model="chequeNumber"
                    label="Cheque Number"
                    required
                    :rules="rules.chequeNumberRules"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                    v-model="referenceNumber"
                    label="Reference Number"
                    required
                    :rules="rules.referenceNumberRules"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-file-input
                    v-model="annexureKFile"
                    color="deep-purple accent-4"
                    counter
                    label="Select Transfer In AnnexureK"
                    placeholder="Upload AnnexureK"
                    :show-size="1000"
                >
                  <template v-slot:selection="{ index, text }">
                    <v-chip
                        v-if="index < 2"
                        color="deep-purple accent-4"
                        dark
                        label
                        small
                    >
                      {{ text }}
                    </v-chip>
                  </template>
                </v-file-input>
              </v-col>
              <v-col cols="6">
                <v-file-input
                    v-model="dispatchLetterFile"
                    color="deep-purple accent-4"
                    counter
                    label="Select Transfer In Dispatch Letter"
                    placeholder="Upload Dispatch Letter"
                    :show-size="1000"
                >
                  <template v-slot:selection="{ index, text }">
                    <v-chip
                        v-if="index < 2"
                        color="deep-purple accent-4"
                        dark
                        label
                        small
                    >
                      {{ text }}
                    </v-chip>
                  </template>
                </v-file-input>
              </v-col>
              <v-col cols="12">
                <v-checkbox
                    v-model="sendConfirmationEmail"
                    label="Send Confirmation Email to Employee"
                ></v-checkbox>
              </v-col>
              <v-col cols="12">
                <v-checkbox
                    v-model="confirmAnnexureKDetails"
                    label="Update the AnnexureK Details and Close Application"
                    required
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-container>
        </v-form>

        <v-card-actions>
          <p v-show="message !== null"
             :class="annexureKDetailsRequestStatus === 'success' ? 'success--text' : 'error--text'">{{message}}</p>
          <v-spacer></v-spacer>
          <v-btn color="primary"
                 :disabled="!confirmAnnexureKDetails"
                 dark
                 :loading="requestingAnnexureKDetailsUpload"
                 v-if="itemForDetails !== null && itemForDetails.isInProgress"
                 @click="uploadAnnexureK"
          >
            Upload
          </v-btn>
        </v-card-actions>

      </v-card>

    </v-dialog>

    <v-card-title>
      Transfer In Details
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
          :color="statusChipColor"
      >
        {{itemForDetails === null ? "" : itemForDetails.status}}
      </v-chip>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="ma-0 pa-0">
      <v-container fluid fill-height v-if="itemForDetails !== null">
        <v-row class="ma-0 pa-0">
          <v-col>
            <h4 class="text-decoration-underline">Basic Info:</h4>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.pernNumber}}</p>
              <p>Pern Number</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.pfNumber}}</p>
              <p>PF Number</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.tokenNumber}}</p>
              <p>Token Number</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.name}}</p>
              <p>Employee Name</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.dateOfJoiningService}}</p>
              <p>Date of Joining</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.dateOfJoiningPf}}</p>
              <p>Date of Joining PF</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.email}}</p>
              <p>Email</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.contactNumber}}</p>
              <p>Contact No.</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.unitCode}}</p>
              <p>Unit Code</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="ma-0 pa-0">
          <v-col>
            <h4 class="text-decoration-underline">Employee Alternate Contact Info:</h4>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">

          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.altEmailId}}</p>
              <p>Alternate Email ID</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.altContactNumber}}</p>
              <p>Alternate Contact Number</p>
            </div>
          </v-col>
          <v-col>

          </v-col>

        </v-row>
        <v-row class="ma-0 pa-0">
          <v-col>
            <h4 class="text-decoration-underline">Previous Account Details:</h4>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.prevPfNumber}}</p>
              <p>PF Account No:</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.prevEPSNumber}}</p>
              <p>Pension Fund Account No:</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.prevAccountHolder}}</p>
              <p>PF Account is held by:</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.prevDateOfJoining}}</p>
              <p>Date Of Joining:</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.prevDateOfLeaving}}</p>
              <p>Date Of Leaving:</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.addressLine1}}</p>
              <p>Address Line 1:</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.addressLine2}}</p>
              <p>Address Line 2:</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.addressLine3}}</p>
              <p>Address Line 3:</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.addressLine4}}</p>
              <p>Address Line 4:</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="ma-0 pa-0">
          <v-col>
            <h4 class="text-decoration-underline">Previous Company Details:</h4>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.prevCompanyName}}</p>
              <p>Company Name:</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.prevCompanyDateOfJoining}}</p>
              <p>Date Of Joining:</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.prevCompanyDateOfLeaving}}</p>
              <p>Date Of Leaving:</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.prevCompanyAddressLine1}}</p>
              <p>Address Line 1:</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.prevCompanyAddressLine2}}</p>
              <p>Address Line 2:</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.prevCompanyAddressLine3}}</p>
              <p>Address Line 3:</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.prevCompanyAddressLine4}}</p>
              <p>Address Line 4:</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="ma-0 pa-0">
          <v-col>
            <h4 class="text-decoration-underline">Details Of Present Account:</h4>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.presPfNumber}}</p>
              <p>PF Account No:</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.presEPSNumber}}</p>
              <p>Pension Fund Account No:</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.dateOfJoiningService}}</p>
              <p>Date Of Joining:</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.createdAt}}</p>
              <p>Request Created At:</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="ma-0 pa-0" v-if="itemForDetails.isInProgress">
          <v-col>
            <h4 class="text-decoration-underline">Request Letter & Reminder:</h4>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0" v-if="itemForDetails.isInProgress">
          <v-col>
            <div>
              <v-btn text small
                     color="indigo"
                     :loading="requestingDownloadRequestLetter"
                     @click="downloadRequestLetter">download Request Letter</v-btn>
            </div>
          </v-col>
          <v-col>
            <div>
              <v-btn text small color="indigo"
                     :loading="requestingGenerateReminder"
                     @click="generateReminder"
              >Generate Reminder</v-btn>
            </div>
          </v-col>
          <v-col>

          </v-col>
        </v-row>
        <v-row class="ma-0 pa-0" v-if="itemForDetails.isCompleted">
          <v-col>
            <h4 class="text-decoration-underline">Transfer In Documents:</h4>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0" v-if="itemForDetails.isCompleted">
          <v-col>
            <div>
              <v-btn text small color="indigo">download AnnexureK</v-btn>
            </div>
          </v-col>
          <v-col>
            <div>
              <v-btn text small color="indigo">download Dispatch Letter</v-btn>
            </div>
          </v-col>
          <v-col>
          </v-col>
        </v-row>
        <v-row class="ma-0 pa-0" v-if="itemForDetails.isCompleted">
          <v-col>
            <h4 class="text-decoration-underline">Contribution Details:</h4>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0" v-if="itemForDetails.isCompleted">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.memberContribution}}</p>
              <p>Member Contribution:</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.companyContribution}}</p>
              <p>Company Contribution:</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{itemForDetails.totalContribution}}</p>
              <p>Total Contribution:</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-divider v-if="itemForDetails !== null && itemForDetails.isInProgress"></v-divider>
    <v-card-actions v-if="itemForDetails !== null && itemForDetails.isInProgress">
      <v-spacer></v-spacer>
      <v-btn
          color="indigo"
          dark
          small
          :to="'/transfer-ins/' + $route.params.entityId + '/update'"
      >
        Edit Application
      </v-btn>
      <v-btn
          color="indigo"
          dark
          small
          @click="annexurkDialog = true"
      >
        Upload AnnexureK Details
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
import {isNotEmpty, isNumber, shouldBeGreaterThan} from "@/util/rules";
import fileDownload from "js-file-download";

export default {
  name: "TransferInDetails",
  data() {
    return {
      loading: true,
      tab: null,
      items: [
        'Employee Details', 'Transfer In Details', 'Account Holder', 'Contribution Details', 'Company Details'
      ],
      data: null,
      itemForDetails: null,
      rejectDialog: false,
      annexurkDialog: false,
      confirmReject: false,
      requestingReject: false,
      message: null,
      rejectRequestStatus: null,
      annexureKDialog: false,
      annexureKFile: null,
      dispatchLetterFile: null,
      memberContribution: 0,
      companyContribution: 0,
      postingDate: null,
      postingDateMenu: false,
      dateOfJoiningPrior: null,
      dateOfJoiningPriorMenu: false,
      bank: null,
      referenceNumber: null,
      chequeNumber: null,
      annexureKDetailsRequestStatus: null,
      requestingAnnexureKDetailsUpload: false,
      confirmAnnexureKDetails: false,
      sendConfirmationEmail: true,
      annexureKDetailsFormStage: 1,
      isValidAnnexureKForm: true,
      rules: {
        memberContributionRules: [
            v => isNotEmpty(v, "Member Contribution is Required"),
            v => isNumber(v, "Please enter a valid number"),
            v => shouldBeGreaterThan(v, 0, "Please enter a valid Contribution")
        ],
        companyContributionRules: [
            v => isNotEmpty(v, "Company Contribution is Required"),
            v => isNumber(v, "Please enter a valid number"),
            v => shouldBeGreaterThan(v, 0, "Please enter a valid Contribution")
        ],
        postingDateRules: [
            v => isNotEmpty(v, "Posting Date is Required")
        ],
        dateOfJoiningPriorRules: [
            v => isNotEmpty(v, "Joining Prior Date is Required")
        ],
        chequeNumberRules: [
          v => isNotEmpty(v, "Cheque Number is Required")
        ],
        referenceNumberRules: [
          v => isNotEmpty(v, "Reference Number is Required")
        ],
        bankRules: [
          v => isNotEmpty(v, "Bank is Required")
        ]
      },
      requestingDownloadRequestLetter: false,
      requestingGenerateReminder: false
    }
  },
  computed: {
    totalContributions() {
      let memberCntr = isNaN(this.memberContribution) ? 0 : this.memberContribution
      let companyCntr = isNaN(this.companyContribution) ? 0 : this.companyContribution
      return isNaN(parseFloat(memberCntr) + parseFloat(companyCntr)) ? 0 : parseFloat(memberCntr) + parseFloat(companyCntr)
    },
    statusChipColor() {
      if(this.itemForDetails === null){
        return ""
      }
      return this.itemForDetails.isCompleted ? 'success' : this.itemForDetails.isInProgress ? 'indigo' : 'danger'
    }
  },
  watch: {
    rejectDialog(){
      if(this.rejectDialog === false){
        this.confirmReject = false
      }
    }
  },
  methods: {
    rejectTransferIn() {
      this.requestingReject = true
      this.$store.dispatch("transferInModule/rejectTransferIn", this.$route.params.entityId)
          .then(response => {
            this.requestingReject = false
            this.message = response
            this.rejectRequestStatus = "success"
            this.getDetails()
            this.rejectDialog = false
          })
          .catch(error => {
            this.message = error
            this.rejectRequestStatus = "failed"
            this.requestingReject = false
          })
    },
    getDetails() {
      this.$store.dispatch("transferInModule/fetchTransferInDetails", this.$route.params.entityId)
          .then(response => {
            this.itemForDetails = JSON.parse(response)
            this.loading = false
          })
          .catch(error => console.log(error))
    },
    uploadAnnexureK() {

      const isValid = this.$refs.annexureKForm.validate()

      if (isValid) {

        const formData = new FormData();

        formData.append("memberContribution", parseFloat(this.memberContribution));
        formData.append("companyContribution", parseFloat(this.companyContribution));

        formData.append("postingDate", this.postingDate)
        formData.append("dateOfJoiningPrior", this.dateOfJoiningPrior)

        formData.append("bank", this.bank);
        formData.append("referenceNumber", this.referenceNumber);
        formData.append("chequeNumber", this.chequeNumber);

        formData.append("annexureKFile", this.annexureKFile)
        formData.append("dispatchLetterFile", this.dispatchLetterFile)
        formData.append("sendConfirmationEmail", this.sendConfirmationEmail)

        this.requestingAnnexureKDetailsUpload = true

        this.$store.dispatch("transferInModule/uploadAnnexureKDetails", {
          entityId: this.$route.params.entityId,
          form: formData
        })
        .then(response => {
          this.requestingAnnexureKDetailsUpload = false
          this.getDetails()
          this.message = response
          this.annexureKDetailsRequestStatus = "success"
        })
        .catch(error => {
          this.message = error
          this.annexureKDetailsRequestStatus = "failed"
          this.requestingAnnexureKDetailsUpload = false
        })

      }

    },
    downloadRequestLetter() {

      this.requestingDownloadRequestLetter = true

      this.$store.dispatch("transferInModule/downloadRequestLetter", this.itemForDetails.reminderId)
          .then(response => {
            let fileName = response.headers["x-suggested-filename"]
            fileDownload(response.data, fileName)
            this.requestingDownloadRequestLetter = false
          })
          .catch(error => {
            console.log(error)
          })
    },
    generateReminder(){

      this.requestingGenerateReminder = true

      this.$store.dispatch("transferInModule/generateTransferInReminder", {
        entityId: this.$route.params.entityId,
        reminderId: this.itemForDetails.reminderId
      })
          .then(response => {
            this.requestingGenerateReminder = false
            this.itemForDetails.reminderId = response.reminderId
            this.downloadRequestLetter()
          })
          .catch(error => {
            console.log(error)
          })

    }
  },
  mounted() {
    this.getDetails()
  }
}
</script>

<style scoped>

</style>