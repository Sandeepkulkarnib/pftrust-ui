<template>
  <v-card>
    <v-card-title>
      Create New Settlement Application
      <v-spacer></v-spacer>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>

      <v-dialog
          v-model="requestStatusDialog"
          :persistent="requestStatus === 'success'"
          max-width="500"
      >
        <v-card>
          <v-card-title>
            Creating New Settlement Application
            <v-spacer></v-spacer>
            <v-icon
                small
                color="black darken-2"
                @click="requestStatusDialog = false"
            >
              mdi-close
            </v-icon>
          </v-card-title>
          <v-card-text class="pa-5">
            <div class="text-center" v-show="requestingSettlementApplication">
              <v-progress-circular
                  :size="70"
                  :width="5"
                  color="primary"
                  indeterminate
              ></v-progress-circular>
              <h3 class="mt-5">{{progressMessage}}</h3>
            </div>
            <div v-show="!requestingSettlementApplication">
              <div style="display: block; margin-left: auto; margin-right: auto; width: 20%">
                <v-btn
                    class="ma-2"
                    color="green"
                    fab
                    dark
                    v-if="requestStatus === 'success'"
                >
                  <v-icon>mdi-thumb-up</v-icon>
                </v-btn>
                <v-btn
                    class="ma-2"
                    color="red"
                    fab
                    dark
                    v-if="requestStatus === 'failed'"
                >
                  <v-icon>mdi-thumb-down</v-icon>
                </v-btn>
              </div>
              <h4 :class="requestStatus === 'success' ? 'success--text' : 'error--text'"
                  class="text-center">
                <span v-if="requestStatus === 'failed'">Request Failed due below Error</span>
                <br>
                <br>
                {{message}}
              </h4>
            </div>
          </v-card-text>
          <v-card-actions v-show="!requestingSettlementApplication">
            <v-spacer></v-spacer>
            <v-btn color="indigo" small dark
                   :to="'/settlements/details/' + applicationId"
                   v-if="requestStatus === 'success'">View Details</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
          v-model="dialog1"
          max-width="500"
      >
        <v-card>
          <v-card-title>
            Warning !.
            <v-spacer></v-spacer>
            <v-icon
                small
                color="black darken-2"
                @click="dialog1 = false"
            >
              mdi-close
            </v-icon>
          </v-card-title>
          <v-card-text class="pa-5">
            <p v-html="warningMessage"></p>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-form  ref="settlementForm"
             v-model="isValid"
             lazy-validation
    >
        <v-container fluid fill-height>
          <v-row class="ma-0 pa-0">
            <v-col>
              <p>
                <span class="text-decoration-underline font-weight-black">BASIC INFORMATION:</span>
                <v-progress-circular indeterminate color="primary" size="30"
                                     class="ml-3"
                                     v-show="loadingEmployeeDetails"
                ></v-progress-circular>
                <span class="ml-5 error--text">{{error}}</span>
              </p>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="4">
              <v-text-field
                  v-model="pernNumber"
                  label="Pern No."
                  required
                  dense
                  hint="Press Enter to load Employee Details"
                  persistent-hint
                  @keydown.enter.native="getDetails"
                  :rules="rules.pernNumberRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="pfNumber"
                  label="PF No."
                  required
                  dense
                  hint="Press Enter to load Employee Details"
                  persistent-hint
                  @keydown.enter.native="getDetailsByPf"
                  :rules="rules.pfNumberRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="tokenNumber"
                  label="Token No."
                  required
                  dense
                  readonly
                  :rules="rules.tokenNumberRules"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="4">
              <v-text-field
                  v-model="name"
                  label="Name"
                  required
                  dense
                  readonly
                  :rules="rules.nameRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="emailId"
                  label="Email Id"
                  required
                  dense
                  readonly
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="contactNumber"
                  label="Contact Number"
                  required
                  dense
                  readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="4">
              <v-text-field
                  v-model="dateOfJoiningService"
                  label="Date of Joining Service"
                  required
                  dense
                  readonly
                  :rules="rules.dateOfJoiningServiceRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="dateOfJoiningPf"
                  label="Date of Joining PF"
                  required
                  dense
                  readonly
                  :rules="rules.dateOfJoiningPfRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="dateOfJoiningPrior"
                  label="Date of Joining Prior"
                  required
                  dense
                  readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="4">
              <v-text-field
                  v-model="dateOfBirth"
                  label="Date of Birth"
                  required
                  dense
                  readonly
                  :rules="rules.dateOfBirthRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="age"
                  label="Age"
                  required
                  dense
                  readonly
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="membershipYears"
                  label="No.of Years of Membership"
                  required
                  dense
                  readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="4">
              <v-text-field
                  v-model="status"
                  label="Status"
                  required
                  dense
                  readonly
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="unitCode"
                  label="Unit Code"
                  required
                  dense
                  readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col>
              <p>
                <span class="text-decoration-underline font-weight-black">NOMINATION DETAILS:</span>
              </p>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0" v-for="nominee in nominees" :key="nominee.entityId">
            <v-col cols="4">
              <v-text-field
                  v-model="nominee.name"
                  label="Name"
                  required
                  dense
                  readonly
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="nominee.relationship"
                  label="Relationship"
                  required
                  dense
                  readonly
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="nominee.share"
                  label="Share"
                  required
                  dense
                  readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0 mt-5">
            <v-col>
              <p class="text-decoration-underline font-weight-black">EMPLOYEE ALTERNATE CONTACT INFORMATION:</p>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="4">
              <v-text-field
                  v-model="alternateMobileNumber"
                  label="Alternate Mobile No."
                  required
                  dense
                  :rules="rules.alternateMobileNumberRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="alternateEmailId"
                  label="Alternate Email Id"
                  required
                  dense
                  :rules="rules.alternateEmailIdRules"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0 mt-5">
            <v-col>
              <p class="text-decoration-underline font-weight-black">SETTLEMENT DETAILS:</p>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="4">
              <v-select
                  :items="settlementTypes"
                  item-value="entityId"
                  item-text="title"
                  label="Select Settlement Type"
                  v-model="selectedSettlementType"
                  dense
                  @input="getDocuments"
                  :rules="rules.settlementTypeRules"
              ></v-select>
            </v-col>
            <v-col cols="4">
                <v-select
                    :items="paymentModes"
                    item-value="id"
                    item-text="name"
                    label="Select Payment Mode."
                    dense
                    v-model="selectedPaymentMode"
                    :rules="rules.paymentModeRules"
                ></v-select>
              </v-col>
            <v-col cols="4">
              <v-select
                    :items="banks"
                    item-value="name"
                    item-text="name"
                    label="Select Payment Bank"
                    dense
                    v-model="selectedBank"
                    :rules="rules.bankRules"
                ></v-select>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="4">
              <v-menu
                  ref="dateOfLeavingServiceMenu"
                  v-model="dateOfLeavingServiceMenu"
                  :close-on-content-click="false"
                  :return-value.sync="dateOfLeavingService"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      :value="formattedDateofLeaving"
                      label="Date of Leaving"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      dense
                      :rules="rules.dateOfLeavingServiceRules"
                  ></v-text-field>
                </template>
                <v-date-picker
                    v-model="dateOfLeavingService"
                    no-title
                    scrollable
                    :max="maxDate"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                      text
                      color="primary"
                      @click="dateOfLeavingServiceMenu = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                      text
                      color="primary"
                      @click="minDate();$refs.dateOfLeavingServiceMenu.save(dateOfLeavingService)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="4">
              <v-menu
                  ref="dateOfSettlementMenu"
                  v-model="dateOfSettlementMenu"
                  :close-on-content-click="false"
                  :return-value.sync="dateOfSettlement"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      :value="formattedDueDate"
                      label="Date of Settlement"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      :hint="dateMessage"
                      persistent-hint
                      dense
                      :rules="rules.dateOfSettlementRules"
                  ></v-text-field>
                </template>
                <v-date-picker
                    v-model="dateOfSettlement"
                    no-title
                    scrollable
                    :min="nowDate"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                      text
                      color="primary"
                      @click="dateOfSettlementMenu = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                      text
                      color="primary"
                      @click="$refs.dateOfSettlementMenu.save(dateOfSettlement)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="addressLine1"
                  label="Address Line 1"
                  required
                  dense
                  :rules="rules.addressLine1Rules"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="4">
              <v-text-field
                  v-model="addressLine2"
                  label="Address Line 2"
                  required
                  dense
                  :rules="rules.addressLine2Rules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="addressLine3"
                  label="Address Line 3"
                  required
                  dense
                  :rules="rules.addressLine3Rules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="addressLine4"
                  label="Address Line 4"
                  required
                  dense
                  :rules="rules.addressLine4Rules"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0 mt-5">
            <v-col>
              <p>
                <span class="text-decoration-underline font-weight-black">UPLOAD REQUIRED DOCUMENTS:</span>
                <v-progress-circular indeterminate color="primary" size="30"
                                     class="ml-3"
                                     v-show="loadingDocuments"
                ></v-progress-circular>
                <span class="ml-5 error--text" v-if="documentsError !== null">{{documentsError}}</span>
              </p>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="12">
              <v-simple-table v-if="documents.length > 0">
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th class="text-left">
                      Document
                    </th>
                    <th class="text-left">
                      Upload
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                      v-for="(document) in documents"
                      :key="document.entityId"
                  >
                    <td>{{ document.name }}</td>
                    <td>
                      <v-file-input
                          prepend-icon="mdi-cloud-upload"
                          :rules="rules"
                          color="primary"
                          accept="image/png, image/jpeg, image/bmp, application/pdf, application/vnd.ms-doc,
                                   application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                                    application/msword"
                          hide-input
                          @change="selectFile($event, document)"
                          v-if="files[document.entityId] === undefined"
                      ></v-file-input>
                      <v-chip color="primary" dark close @click:close="unSelectFile(document)"
                      v-if="files[document.entityId] !== undefined"
                      >{{files[document.entityId].name}}</v-chip>
                    </td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0 mt-5">
            <v-col>
              <p class="text-decoration-underline font-weight-black">EMPLOYEE TAX DETAILS:</p>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="4">
              <v-text-field
                  v-model="incomeTax"
                  label="Income Tax"
                  required
                  dense
                  :rules="rules.incomeTaxRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="educationCess"
                  label="Edu.cess"
                  required
                  dense
                  :rules="rules.educationCessRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="tds"
                  label="TDS"
                  required
                  readonly
                  dense
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0 mt-5">
            <v-col>
              <p class="text-decoration-underline font-weight-black">EMPLOYEE BANK DETAILS</p>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="4">
              <v-text-field
                  v-model="payeeName"
                  label="Payee Name"
                  required
                  dense
                  :rules="rules.payeeNameRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="bankName"
                  label="Bank Name"
                  required
                  dense
                  :rules="rules.bankNameRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="accountNumber"
                  label="Account No."
                  required
                  dense
                  :rules="rules.accountNumberRules"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="4">
              <v-text-field
                  v-model="branch"
                  label="Bank Branch"
                  required
                  dense
                  :rules="rules.branchRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="ifscCode"
                  label="IFSC Code"
                  required
                  dense
                  :rules="rules.ifscCodeRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="micrCode"
                  label="MICR Code"
                  required
                  dense
                  :rules="rules.micrCodeRules"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="pt-5 pb-5">
      <v-spacer></v-spacer>
      <v-btn color="primary" small dark @click="save">Create Settlement</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>


import {
  isNotEmpty,
  isNumber,
  shouldBeGreaterThan,
  validEmailId,
  validIfscCode, validMicrCode,
  validMobileNumber,
  validPern
} from "@/util/rules";

export default {
  name: "CreateSettlement",
  data() {
    return {
      paymentModes: [],
      selectedPaymentMode: null,
      banks: [],
      selectedBank: null,
      dateMessage: '',
      dialog1: false,
      warningMessage: '',
      isValid: true,
      loadingEmployeeDetails: false,
      error: null,
      pernNumber: null,
      pfNumber: null,
      tokenNumber: null,
      name: null,
      emailId: null,
      contactNumber: null,
      dateOfJoiningService: null,
      dateOfJoiningPf: null,
      dateOfJoiningPrior: null,
      dateOfJoiningPriorMenu: false,
      membershipYears: 0,
      dateOfBirth: null,
      age: 0,
      status: null,
      nominees: [],
      yearEndProcessError: false,
      yearEndProcessErrorMessage: null,
      settlementTypes: [],
      alternateMobileNumber: null,
      alternateEmailId: null,
      selectedSettlementType: null,
      dateOfLeavingService: null,
      dateOfLeavingServiceMenu: false,
      dateOfSettlement: null,
      dateOfSettlementMenu: false,
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      addressLine4: null,
      incomeTax: 0,
      educationCess: 0,
      payeeName: null,
      bankName: null,
      accountNumber: null,
      branch: null,
      ifscCode: null,
      micrCode: null,
      maxDate: '',
      unitCode: null,
      loadingDocuments: false,
      documents: [],
      nowDate: new Date().toISOString().slice(0,10),
      rules: {
        paymentModeRules: [
          v => isNotEmpty(v, "Please select a Payment Mode")
        ],
        bankRules: [
          v => isNotEmpty(v, "Please select a Bank")
        ],
        pernNumberRules: [
          v => isNotEmpty(v, "Pern No. is Required"),
          v => validPern(v, "Please Enter valid Pern No")
        ],
        pfNumberRules: [
          v => isNotEmpty(v, "PF No. is Required"),
        ],
        tokenNumberRules: [
          v => isNotEmpty(v, "Token No. is Required"),
        ],
        nameRules: [
          v => isNotEmpty(v, "Name is Required"),
        ],
        dateOfJoiningServiceRules: [
            v => isNotEmpty(v, "Date of Joining Service is Required")
        ],
        dateOfJoiningPfRules: [
          v => isNotEmpty(v, "Date of Joining PF is Required")
        ],
        dateOfBirthRules: [
          v => isNotEmpty(v, "Date of Birth Service is Required")
        ],
        alternateMobileNumberRules: [
          v => isNotEmpty(v, "Alternate Mobile No. is Required"),
          v => validMobileNumber(v, "Provide Valid Mobile Number")
        ],
        alternateEmailIdRules: [
          v => isNotEmpty(v, "Alternate Email ID is Required"),
          v => validEmailId(v, "Provide Valid Email ID")
        ],
        dateOfLeavingServiceRules: [
          v => isNotEmpty(v, "Date of Leaving is Required"),
        ],
        dateOfSettlementRules: [
          v => isNotEmpty(v, "Date of Settlement is Required"),
        ],
        settlementTypeRules: [
          v => isNotEmpty(v, "Settlement Type is Required"),
        ],
        addressLine1Rules: [
          v => isNotEmpty(v, "Address Line 1 is Required"),
        ],
        addressLine2Rules: [
          v => isNotEmpty(v, "Address Line 2 is Required"),
        ],
        addressLine3Rules: [
          v => isNotEmpty(v, "Address Line 3 is Required"),
        ],
        addressLine4Rules: [
          v => isNotEmpty(v, "Address Line 4 is Required"),
        ],
        incomeTaxRules: [
          v => isNotEmpty(v, "Income Tax is Required"),
          v => isNumber(v, "Please enter a valid number"),
          v => shouldBeGreaterThan(v, -1, "Please enter a valid Tax")
        ],
        educationCessRules: [
          v => isNotEmpty(v, "Edu.Cess is Required"),
          v => isNumber(v, "Please enter a valid number"),
          v => shouldBeGreaterThan(v, -1, "Please enter a valid Cess")
        ],
        payeeNameRules: [
          v => isNotEmpty(v, "Payee Name is Required"),
        ],
        bankNameRules: [
          v => isNotEmpty(v, "Bank Name is Required"),
        ],
        accountNumberRules: [
          v => isNotEmpty(v, "Account No. is Required"),
        ],
        branchRules: [
          v => isNotEmpty(v, "Bank Branch is Required"),
        ],
        ifscCodeRules: [
          v => isNotEmpty(v, "IFSC Code is Required"),
          v => validIfscCode(v, "Please Enter a Valid IFSC Code")
        ],
        micrCodeRules: [
          v => isNotEmpty(v, "MICR Code is Required"),
          v => validMicrCode(v, "Please Enter a Valid MICR Code")
        ],
        rules: [
          value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
        ],
      },
      files: {},
      documentsError: null,
      requestStatusDialog: false,
      requestingSettlementApplication: false,
      requestStatus: null,
      message: null,
      applicationId: null,
      progressStage: 1,
      fromDateOfLeaving:''
    }
  },
  computed: {
    tds() {
      let incomeTax = isNaN(this.incomeTax) ? 0 : this.incomeTax
      let educationCess = isNaN(this.educationCess) ? 0 : this.educationCess
      return isNaN(parseFloat(incomeTax) + parseFloat(educationCess)) ? 0 : parseFloat(incomeTax) + parseFloat(educationCess)
    },
    progressMessage(){
      if(this.progressStage === 1){
        return "We are uploading the Settlement Documents..."
      }
      return "Please wait while the Settlement Application is getting Processed..."
    },
    formattedDateofLeaving(){

      let dateOfLeaving = this.dateOfLeavingService;

      if(!dateOfLeaving) return ""

      let [year, month, day] = dateOfLeaving.split('-')

      return day+"-"+month+"-"+year
    },
    formattedDueDate(){

      let dueDate = this.dateOfSettlement;

      if(!dueDate) return ""

      let [year, month, day] = dueDate.split('-')

      return day+"-"+month+"-"+year
    }
  },
  watch: {

  },
  methods: {
    getDetails() {

      this.loadingEmployeeDetails = true

      this.$store.dispatch("settlementModule/getEmployeeDetails", this.pernNumber)
          .then(res => {
            const response = JSON.parse(res)
            console.log(response)
            this.loadingEmployeeDetails = false
            this.pernNumber = response.pernNumber
            this.pfNumber = response.pfNumber
            this.tokenNumber = response.tokenNumber
            this.name = response.name
            this.emailId = response.emailId
            this.contactNumber = response.contactNumber
            this.dateOfJoiningService = response.dateOfJoiningService
            this.dateOfJoiningPf = response.dateOfJoiningPf
            this.dateOfJoiningPrior = response.dateOfJoiningPrior
            this.membershipYears = response.membershipYears
            this.dateOfBirth = response.dateOfBirth
            this.age = response.age
            this.status = response.status
            this.nominees = response.nominees
            this.yearEndProcessError = response.yearEndProcessError
            this.error = response.yearEndProcessErrorMessage
            this.settlementTypes = response.settlementTypes
            this.maxDate = response.maxDate
            this.unitCode = response.unitCode
            this.banks = response.banks
            this.paymentModes = response.paymentModes
          })
          .catch(error => {
            this.loadingEmployeeDetails = false
            this.error = error
          })

    },
    getDetailsByPf() {

      this.loadingEmployeeDetails = true

      this.$store.dispatch("settlementModule/getEmployeeDetailsByPf", this.pfNumber)
          .then(res => {
            const response = JSON.parse(res)
            console.log(response)
            this.loadingEmployeeDetails = false
            this.pernNumber = response.pernNumber
            this.pfNumber = response.pfNumber
            this.tokenNumber = response.tokenNumber
            this.name = response.name
            this.emailId = response.emailId
            this.contactNumber = response.contactNumber
            this.dateOfJoiningService = response.dateOfJoiningService
            this.dateOfJoiningPf = response.dateOfJoiningPf
            this.dateOfJoiningPrior = response.dateOfJoiningPrior
            this.membershipYears = response.membershipYears
            this.dateOfBirth = response.dateOfBirth
            this.age = response.age
            this.status = response.status
            this.nominees = response.nominees
            this.yearEndProcessError = response.yearEndProcessError
            this.error = response.yearEndProcessErrorMessage
            this.settlementTypes = response.settlementTypes
            this.maxDate = response.maxDate
            this.unitCode = response.unitCode
            this.banks = response.banks
            this.paymentModes = response.paymentModes
          })
          .catch(error => {
            this.loadingEmployeeDetails = false
            this.error = error
          })

    },
    getDocuments(){
      this.loadingDocuments = true

      this.$store.dispatch("settlementModule/getDocumentsList", this.selectedSettlementType)
          .then(response => {
            this.loadingDocuments = false
            this.documents = JSON.parse(response)
          })
          .catch(error => {
            console.log(error)
          })
    },
    selectFile($event, document){
      this.$set(this.files, document.entityId, $event)
    },
    unSelectFile(document){
      this.$set(this.files, document.entityId, undefined)
    },
    save(){

      // Due Date
      const date1 = new Date(this.dateOfLeavingService);

      // Date Of Leaving
      const date2 = new Date(this.dateOfSettlement);

      if(date1 > date2){

        this.warningMessage="Due date cannot be less then Date of leaving"
        this.dialog1 = true;
      }
      else if(date1 < date2) {

        let isValid = this.$refs.settlementForm.validate();

        if (Object.keys(this.files).length < this.documents.length) {
          this.documentsError = "Please upload all the required documents"
          return
        }

        if (isValid) {

          this.requestStatusDialog = true
          this.requestingSettlementApplication = true
          this.progressStage = 1

          this.uploadFiles()
              .then(response => {

                this.progressStage = 2

                let data = {
                  "dateOfLeavingService": this.dateOfLeavingService,
                  "dateOfSettlement": this.dateOfSettlement,
                  "altEmailId": this.alternateEmailId,
                  "altContactNumber": this.alternateMobileNumber,
                  "payeeName": this.payeeName,
                  "addressLine1": this.addressLine1,
                  "addressLine2": this.addressLine2,
                  "addressLine3": this.addressLine3,
                  "addressLine4": this.addressLine4,
                  "bankName": this.bankName,
                  "branch": this.branch,
                  "accountNumber": this.accountNumber,
                  "ifscCode": this.ifscCode,
                  "micrCode": this.micrCode,
                  "incomeTax": this.incomeTax,
                  "eduCess": this.educationCess,
                  "pernNumber": this.pernNumber,
                  "settlementType": this.selectedSettlementType,
                  "swift": "",
                  "paymentBank": this.selectedBank,
                  "paymentModeId": this.selectedPaymentMode
                }

                data["documents"] = response.map(uploadedDocument => {
                  let doc = JSON.parse(uploadedDocument)
                  return {
                    "path": doc.path,
                    "entityId": doc.entityId
                  }
                })

                return this.$store.dispatch("settlementModule/createSettlementApplication", data)

              })
              .then(res => {
                this.requestingSettlementApplication = false
                let response = JSON.parse(res)
                this.message = response.message
                this.requestStatus = "success"
                this.applicationId = response.id
              })
              .catch(error => {
                this.requestingSettlementApplication = false
                this.message = error
                this.requestStatus = "failed"
              })
        }
      }else {
        this.warningMessage="Due date and Date of leaving should not be same"
        this.dialog1 = true;
      }

    },
    uploadFiles(){

      let keys = Object.keys(this.files);

      return new Promise((resolve, reject) => {

        Promise.all(keys.map(this.uploadFile))
            .then(response => {
              resolve(response)
            })
            .catch(error => {
              console.log(error)
              reject(error)
            })

      })

    },
    uploadFile(key){

      let filteredDocument = this.documents.filter(document => document.entityId === key)[0];

      let formattedName = filteredDocument.name.toLowerCase().replace(" ", "_");

      const formData = new FormData();

      formData.append(formattedName, this.files[filteredDocument.entityId])

      return this.$store.dispatch("settlementModule/uploadDocument", {
        entityId: filteredDocument.entityId,
        form: formData
      })

    },
    minDate(){
      
      let obj = this.settlementTypes.find(o => o.entityId === this.selectedSettlementType);

      let tomorrow = new Date(this.dateOfLeavingService)

      if(!obj.fromDateOfLeaving){
        obj.fromDateOfLeaving = 0
      }


      tomorrow.setDate(tomorrow.getDate() + obj.fromDateOfLeaving)

      this.nowDate=tomorrow.toISOString().slice(0,10)

      if(new Date() < tomorrow){
        this.dateMessage = "Statutory period is not completed."
      }else{
        this.dateMessage = ""
      }

    }
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>