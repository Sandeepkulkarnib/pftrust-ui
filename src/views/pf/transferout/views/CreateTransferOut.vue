<template>
  <v-card>
    <v-card-title>
      Create New Transfer Out Application
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
            Creating New Transfer Out Application
            <v-spacer></v-spacer>
            <v-icon
                small
                color="black darken-2"
                @click="requestStatusDialog = false"
                v-if="requestStatus === null || requestStatus === 'failed'"
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
                   :to="'/transfer-outs/details/' + applicationId"
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
              <p class="text-decoration-underline font-weight-black">FROM ACCOUNT DETAILS:</p>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="4">
              <v-text-field
                  v-model="fromPfNumber"
                  label="From PF No."
                  required
                  dense
                  :rules="rules.fromPfNumberRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="fromEpsNumber"
                  label="From EPS No."
                  required
                  dense
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="fromUanNumber"
                  label="From UAN No."
                  required
                  dense
                  :rules="rules.fromUanNumberRules"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0 mt-5">
            <v-col>
              <p class="text-decoration-underline font-weight-black">TO ACCOUNT DETAILS:</p>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="4">
              <v-text-field
                  v-model="toPfNumber"
                  label="To PF No."
                  required
                  dense
                  :rules="rules.toPfNumberRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="toEpsNumber"
                  label="To EPS No."
                  required
                  dense
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="toUanNumber"
                  label="To UAN No."
                  required
                  dense
                  :rules="rules.toUanNumberRules"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0 mt-5">
            <v-col>
              <p class="text-decoration-underline font-weight-black">TRUST/RPFC BANK DETAILS:</p>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="4">
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
            <v-col cols="4">
              <v-text-field
                  v-model="bankName"
                  label="Bank Name"
                  required
                  dense
                  :rules="rules.bankNameRules"
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
                  v-model="accountNumber"
                  label="Account No."
                  :required="!notRequired"
                  :disabled="notRequired"
                  dense
                  :rules="!notRequired ? rules.accountNumberRules:[]"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="ifscCode"
                  label="IFSC Code"
                  :required="!notRequired"
                  :disabled="notRequired"
                  dense
                  :rules="!notRequired ? rules.ifscCodeRules:[]"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="micrCode"
                  label="MICR Code"
                  :required="!notRequired"
                  :disabled="notRequired"
                  dense
                  :rules="!notRequired ? rules.micrCodeRules:[]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0 mt-5">
            <v-col>
              <p class="text-decoration-underline font-weight-black">TRANSFER OUT DETAILS:</p>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="4">
              <v-select
                  :items="transferOutTypes"
                  item-value="entityId"
                  item-text="title"
                  label="Select Transfer Out Type"
                  v-model="selectedTransferOutType"
                  dense
                  @input="getDocuments"
                  :rules="rules.transferOutTypeRules"
              ></v-select>
            </v-col>
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
                      @click="$refs.dateOfLeavingServiceMenu.save(dateOfLeavingService)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>

            </v-col>
            <v-col cols="4">
              <v-menu
                  ref="dateOfTransferOutMenu"
                  v-model="dateOfTransferOutMenu"
                  :close-on-content-click="false"
                  :return-value.sync="dateOfTransferOut"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      :value = "formattedDueDate"
                      label="Due Date"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      dense
                      :rules="rules.dateOfTransferOutRules"
                  ></v-text-field>
                </template>
                <v-date-picker
                    v-model="dateOfTransferOut"
                    no-title
                    scrollable
                    :min="nowDate"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                      text
                      color="primary"
                      @click="dateOfTransferOutMenu = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                      text
                      color="primary"
                      @click="$refs.dateOfTransferOutMenu.save(dateOfTransferOut)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
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
                  v-model="addressLine1"
                  label="Address Line 1"
                  required
                  dense
                  :rules="rules.addressLine1Rules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="addressLine2"
                  label="Address Line 2"
                  required
                  dense
                  :rules="rules.addressLine2Rules"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
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
                          color="primary"
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
              <p class="text-decoration-underline font-weight-black">CURRENT EMPLOYER DETAILS:</p>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="4">
              <v-text-field
                  v-model="currentEmployerName"
                  label="Name"
                  required
                  dense
                  :rules="rules.bankNameRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="currentEmployerAddressLine1"
                  label="Address Line 1"
                  required
                  dense
                  :rules="rules.accountNumberRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="currentEmployerAddressLine2"
                  label="Address Line 2"
                  required
                  dense
                  :rules="rules.branchRules"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="4">
              <v-text-field
                  v-model="currentEmployerAddressLine3"
                  label="Address Line 3"
                  required
                  dense
                  :rules="rules.branchRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="currentEmployerAddressLine4"
                  label="Address Line 4"
                  required
                  dense
                  :rules="rules.branchRules"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="pt-5 pb-5">
      <v-spacer></v-spacer>
      <v-btn color="primary" small dark @click="save">Create Transfer Out</v-btn>
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
  name: "CreateTransferOut",
  data() {
    return {
      incomeTax: 0,
      educationCess: 0,
      banks: [],
      selectedBank: null,
      paymentId:"",
      paymentModes: [],
      selectedPaymentMode: null,
      warningMessage:'',
      dialog1:false,
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
      transferOutTypes: [],
      inputFields: ["Payee Name","Bank Name","Branch","Account No","IFSC Code","MICR Code"],
      alternateMobileNumber: null,
      alternateEmailId: null,
      fromPfNumber: null,
      fromEpsNumber: "",
      fromUanNumber: null,
      toPfNumber: null,
      toEpsNumber: "",
      toUanNumber: null,
      selectedTransferOutType: null,
      dateOfLeavingService: null,
      dateOfLeavingServiceMenu: false,
      dateOfTransferOut: null,
      dateOfTransferOutMenu: false,
      payeeName: null,
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      addressLine4: null,
      bankName: null,
      accountNumber: null,
      branch: null,
      ifscCode: null,
      micrCode: null,
      currentEmployerName: null,
      currentEmployerAddressLine1: null,
      currentEmployerAddressLine2: null,
      currentEmployerAddressLine3: null,
      currentEmployerAddressLine4: null,
      maxDate: null,
      unitCode: null,
      loadingDocuments: false,
      documents: [],
      nowDate: new Date().toISOString().slice(0,10),
      rules: {
        bankRules: [
          v => isNotEmpty(v, "Please select a Bank")
        ],
        paymentModeRules: [
          v => isNotEmpty(v, "Please select a Payment Mode")
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
        dateOfTransferOutRules: [
          v => isNotEmpty(v, "Date of Transfer Out is Required"),
        ],
        transferOutTypeRules: [
          v => isNotEmpty(v, "Transfer Out Type is Required"),
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
        fromPfNumberRules: [
          v => isNotEmpty(v, "From PF No. is Required"),
        ],
        // fromEpsNumberRules: [
        //   v => isNotEmpty(v, "From EPS No. is Required"),
        // ],
        fromUanNumberRules: [
          v => isNotEmpty(v, "From UAN No. is Required"),
        ],
        toPfNumberRules: [
          v => isNotEmpty(v, "To PF No. is Required"),
        ],
        // toEpsNumberRules: [
        //   v => isNotEmpty(v, "To EPS No. is Required"),
        // ],
        toUanNumberRules: [
          v => isNotEmpty(v, "To UAN No. is Required"),
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
        ]
      },
      files: {},
      documentsError: null,
      requestStatusDialog: false,
      requestingSettlementApplication: false,
      requestStatus: null,
      message: null,
      applicationId: null,
      progressStage: 1
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
      console.log(year,month,day)

      return day+"-"+month+"-"+year
    },
    formattedDueDate(){

      let dueDate = this.dateOfTransferOut;

      if(!dueDate) return ""

      let [year, month, day] = dueDate.split('-')
      console.log(year,month,day)

      return day+"-"+month+"-"+year
    },
    notRequired(){

      let obj = this.paymentModes.find(o => o.entityId === this.selectedPaymentMode);

      if(!obj) return true

      if(obj.name === "Cheque" || obj.name === "DEMAND DRAFT") return true;

      return false
    }
  },
  watch: {

  },
  methods: {

    getDetails() {

      this.loadingEmployeeDetails = true

      this.$store.dispatch("transferOutModule/getEmployeeDetails", this.pernNumber)
          .then(res => {
            const response = JSON.parse(res)
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
            this.yearEndProcessError = response.yearEndProcessError
            this.error = response.yearEndProcessErrorMessage
            this.transferOutTypes = response.transferOutTypes
            this.maxDate = response.maxDate
            this.unitCode = response.unitCode
            this.paymentModes = response.paymentModes
            this.banks = response.banks
          })
          .catch(error => {
            this.loadingEmployeeDetails = false
            this.error = error
          })

    },
    getDetailsByPf() {

      this.loadingEmployeeDetails = true

      this.$store.dispatch("transferOutModule/getEmployeeDetailsByPf", this.pfNumber)
          .then(res => {
            const response = JSON.parse(res)
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
            this.yearEndProcessError = response.yearEndProcessError
            this.error = response.yearEndProcessErrorMessage
            this.transferOutTypes = response.transferOutTypes
            this.maxDate = response.maxDate
            this.unitCode = response.unitCode
            this.paymentModes = response.paymentModes
            this.banks = response.banks
          })
          .catch(error => {
            this.loadingEmployeeDetails = false
            this.error = error
          })

    },
    getDocuments(){
      this.loadingDocuments = true

      this.$store.dispatch("transferOutModule/getDocumentsList", this.selectedTransferOutType)
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
      const date2 = new Date(this.dateOfTransferOut);

      if(date1 < date2){

        let isValid = this.$refs.settlementForm.validate();

        if(Object.keys(this.files).length < this.documents.length) {
          this.documentsError = "Please upload all the required documents"
          return
        }

        if(isValid){

          this.requestStatusDialog = true
          this.requestingSettlementApplication = true
          this.progressStage = 1

          let obj = this.paymentModes.find(code => code.entityId === this.selectedPaymentMode)

          if(!this.accountNumber){
            this.accountNumber = "0"
          }

          if(!this.ifscCode){
            this.ifscCode = "NA"
          }

          if(!this.micrCode){
            this.micrCode = "NA"
          }

          console.log("payment mode is "+obj.id)

          this.paymentId = obj.id.toString()

          console.log(this.paymentId)

          this.uploadFiles()
              .then(response => {

                this.progressStage = 2

                let data = {
                  "dateOfLeavingService": this.dateOfLeavingService,
                  "dueDate": this.dateOfTransferOut,
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
                  "fromPfNumber": this.fromPfNumber,
                  "fromEpsNumber": this.fromEpsNumber==""? "":this.fromEpsNumber,
                  "fromUanNumber": this.fromUanNumber,
                  "toPfNumber": this.toPfNumber,
                  "toEpsNumber": this.toEpsNumber==""? "":this.toEpsNumber,
                  "toUanNumber": this.toUanNumber,
                  "currentEmployerName": this.currentEmployerName,
                  "currentEmployerAddressLine1": this.currentEmployerAddressLine1,
                  "currentEmployerAddressLine2": this.currentEmployerAddressLine2,
                  "currentEmployerAddressLine3": this.currentEmployerAddressLine3,
                  "currentEmployerAddressLine4": this.currentEmployerAddressLine4,
                  "pernNumber": this.pernNumber,
                  "transferOutType": this.selectedTransferOutType,
                  "entityId": obj.entityId,
                  "paymentModeId": this.paymentId,
                  "paymentBank": this.selectedBank,
                  "incomeTax": this.incomeTax,
                  "eduCess": this.educationCess,
                }

                data["documents"] = response.map(uploadedDocument => {
                  let doc = JSON.parse(uploadedDocument)
                  return {
                    "path": doc.path,
                    "entityId": doc.entityId
                  }
                })

                return this.$store.dispatch("transferOutModule/createTransferOutApplication", data)

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
      } else if(date1 > date2){
        this.warningMessage="Due date cannot be less then Date of leaving"
        this.dialog1 = true;
      }else{
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

      return this.$store.dispatch("transferOutModule/uploadDocument", {
        entityId: filteredDocument.entityId,
        form: formData
      })

    }
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>