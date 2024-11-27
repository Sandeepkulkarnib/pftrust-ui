<template>
  <v-card>
    <v-card-title>
      Update New Loan Application
      <v-spacer></v-spacer>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>

      <v-dialog
          v-model="gettingLoanDialog"
          persistent
          max-width="500"
      >
        <v-card>
          <v-card-text class="pa-5">
            <div class="text-center">
              <v-progress-circular
                  :size="70"
                  :width="5"
                  color="primary"
                  indeterminate
              ></v-progress-circular>
              <h3 class="mt-5">Please wait while we get the Loan Application Details...</h3>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog
          v-model="requestStatusDialog"
          :persistent="requestStatus === 'success'"
          max-width="500"
      >
        <v-card>
          <v-card-title>
            Update New Loan Application
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
            <div class="text-center" v-show="requestingLoanApplication">
              <v-progress-circular
                  :size="70"
                  :width="5"
                  color="primary"
                  indeterminate
              ></v-progress-circular>
              <h3 class="mt-5">{{progressMessage}}</h3>
            </div>
            <div v-show="!requestingLoanApplication">
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
          <v-card-actions v-show="!requestingLoanApplication">
            <v-spacer></v-spacer>
            <v-btn color="indigo" small dark
                   :to="'/loans/details/' + applicationId"
                   v-if="requestStatus === 'success'">View Details</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-form  ref="loanForm"
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
                  readonly
                  :rules="rules.pernNumberRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="pfNumber"
                  label="PF No."
                  required
                  dense
                  readonly
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
                  v-model="pfBase"
                  label="PF Base"
                  required
                  dense
                  readonly
              ></v-text-field>
            </v-col>
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
            <v-col cols="4">
              <v-btn color="primary" small outlined
                     v-show="pernNumber !== null && pernNumber !== ''"
                     @click="downloadLoanHistory" :loading="downloadingHistorySheet">
                Download Employee Loan History
              </v-btn>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col>
              <p>
                <span class="text-decoration-underline font-weight-black">ALTERNATE CONTACT INFORMATION:</span>
              </p>
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
            <v-col cols="4">
              <v-menu
                  ref="loanApplicationReceivedDate"
                  v-model="loanApplicationReceivedDateMenu"
                  :close-on-content-click="false"
                  :return-value.sync="loanApplicationReceivedDate"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      v-model="loanApplicationReceivedDate"
                      label="Loan Application Received Date"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      dense
                      :rules="rules.dateOfLeavingServiceRules"
                  ></v-text-field>
                </template>
                <v-date-picker
                    v-model="loanApplicationReceivedDate"
                    no-title
                    scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn
                      text
                      color="primary"
                      @click="loanApplicationReceivedDateMenu = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                      text
                      color="primary"
                      @click="$refs.loanApplicationReceivedDate.save(loanApplicationReceivedDate)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col>
              <p>
                <span class="text-decoration-underline font-weight-black">SELECT LOAN TYPE:</span>
              </p>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="4">
              <v-select
                  :items="loanTypes"
                  item-value="entityId"
                  item-text="name"
                  label="Select Loan Type"
                  v-model="selectedLoanType"
                  @input="getDocuments"
                  dense
              ></v-select>
            </v-col>
            <v-col cols="3">
              <v-text-field
                  v-model="totalCost"
                  label="Total Cost."
                  required
                  dense
                  :rules="rules.totalCostRules"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                  v-model="appliedAmount"
                  label="Applying For"
                  required
                  dense
                  :rules="rules.appliedAmountRules"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-btn small color="primary" dark @click="checkEligibility"
                     v-show="selectedLoanType !== null && totalCost !== 0 && appliedAmount !== 0"
                     :loading="checkingEligibility">Check Eligibility</v-btn>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col>
              <p>
                <span class="text-decoration-underline font-weight-black">ELIGIBLE AMOUNT DETAILS:</span>
                <v-progress-circular indeterminate
                                     color="primary" size="30"
                                     class="ml-3"
                                     v-show="checkingEligibility"
                ></v-progress-circular>
                <span class="ml-5 error--text" v-if="eligibleAmountError !== null">{{eligibleAmountError}}</span>
              </p>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col>
              <v-simple-table v-if="eligibleAmount !== null">
                <template>
                  <tbody>
                  <tr v-if="eligibleAmount.loanAmountBasedOnSalary !== 0">
                    <td>PF Base Salary ({{loanAmountCondition.pfSalary}}) months:</td>
                    <td>{{eligibleAmount.loanAmountBasedOnSalary}}</td>
                  </tr>
                  <tr v-if="eligibleAmount.loanAmountBasedPfBalance !== 0">
                    <td v-if="loanAmountCondition.totalPfBalance !== 0">
                      Total PF Accumulated Balance:
                    </td>
                    <td v-if="loanAmountCondition.totalPfBalance !== 0">
                      {{eligibleAmount.loanAmountBasedPfBalance}}
                    </td>

                    <td v-if="loanAmountCondition.ownAccountPfBalance !== 0">
                      Member PF Accumulated Balance ({{loanAmountCondition.ownAccountPfBalance}}%):
                    </td>
                    <td v-if="loanAmountCondition.ownAccountPfBalance !== 0">
                      {{eligibleAmount.loanAmountBasedPfBalance}}
                    </td>
                  </tr>
                  <tr>
                    <td>Total Cost:</td>
                    <td>{{totalCost}}</td>
                  </tr>
                  <tr>
                    <td>Applied Amount:</td>
                    <td>{{appliedAmount}}</td>
                  </tr>
                  <tr>
                    <td>Eligible Amount:</td>
                    <td>{{eligibleAmount.eligibleAmount}}</td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
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
                    <th class="text-left">
                      Download
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
          <v-row class="ma-0 pa-0 mt-5">
            <v-col>
              <p>
                <span class="text-decoration-underline font-weight-black">OTHER DETAILS:</span>
              </p>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0 mt-5" v-if="loanCode !== null && loanCode === '02'">
            <v-col cols="4">
              <v-menu
                  ref="dateOfCompletionOfHouseMenu"
                  v-model="dateOfCompletionOfHouseMenu"
                  :close-on-content-click="false"
                  :return-value.sync="dateOfCompletionOfHouse"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      v-model="dateOfCompletionOfHouse"
                      label="Date of Completion of House"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      dense
                      :rules="rules.dateOfLeavingServiceRules"
                  ></v-text-field>
                </template>
                <v-date-picker
                    v-model="dateOfCompletionOfHouse"
                    no-title
                    scrollable
                    :max="maxDate"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                      text
                      color="primary"
                      @click="dateOfCompletionOfHouseMenu = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                      text
                      color="primary"
                      @click="$refs.dateOfCompletionOfHouseMenu.save(dateOfCompletionOfHouse)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0" v-if="loanCode !== null && (loanCode === '01' || loanCode === '12' || loanCode === '11')">
            <v-col cols="4">
              <v-text-field
                  v-model="propertyEstimatedPrice"
                  label="Property Estimated Price."
                  required
                  dense
                  :rules="rules.propertyEstimatedPriceRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="stampDuty"
                  label="Stamp Duty."
                  required
                  dense
                  :rules="rules.stampDutyRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="registration"
                  label="Registration."
                  required
                  dense
                  :rules="rules.propertyEstimatedPriceRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="insurance"
                  label="Insurance."
                  required
                  dense
                  :rules="rules.insuranceRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="others"
                  label="Others."
                  required
                  dense
                  :rules="rules.othersRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="total"
                  label="Total."
                  readonly
                  dense
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0" v-if="loanCode !== null && (loanCode === '13')">
            <v-col cols="4">
              <v-text-field
                  v-model="financialInstituteName"
                  label="Financial Institute Name."
                  required
                  dense
                  :rules="rules.financialInstituteNameRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="bank"
                  label="Bank Name."
                  required
                  dense
                  :rules="rules.bankRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="branch"
                  label="Bank Branch."
                  required
                  dense
                  :rules="rules.branchRules"
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
            <v-col cols="4">
              <v-text-field
                  v-model="ifscCode"
                  label="IFSC Code."
                  required
                  dense
                  :rules="rules.ifscCodeRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="micrCode"
                  label="MICR Code."
                  required
                  dense
                  :rules="rules.micrCodeRules"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0 mt-5">
            <v-col>
              <p>
                <span class="text-decoration-underline font-weight-black">EMPLOYEE BANK DETAILS:</span>
              </p>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="4">
              <v-text-field
                  v-model="employeeBankName"
                  label="Bank Name."
                  required
                  dense
                  :rules="rules.bankRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="employeeAccountNumber"
                  label="Account No."
                  required
                  dense
                  :rules="rules.accountNumberRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="employeeBankBranch"
                  label="Branch"
                  required
                  dense
                  :rules="rules.bankRules"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="4">
              <v-text-field
                  v-model="employeeIfscCode"
                  label="IFSC Code."
                  required
                  dense
                  :rules="rules.ifscCodeRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="employeeMicrCode"
                  label="MICR Code."
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
      <v-btn color="primary" small dark @click="save">Update Loan</v-btn>
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
import fileDownload from "js-file-download";

export default {
  name: "CreateLoan",
  data() {
    return {
      isValid: true,
      error: null,
      loadingEmployeeDetails: false,
      pernNumber: null,
      pfNumber: null,
      tokenNumber: null,
      name: null,
      emailId: null,
      contactNumber: null,
      dateOfJoiningService: null,
      dateOfJoiningPf: null,
      dateOfJoiningPrior: null,
      membershipYears: 0,
      dateOfBirth: null,
      age: 0,
      status: null,
      unitCode: null,
      pfBase: 0,
      yearEndProcessError: false,
      yearEndProcessErrorMessage: null,
      maxDate: null,
      rules: {
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
        dateOfCompletionOfHouseRule: [
          v => isNotEmpty(v, "Date of Completion of House is Required")
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
        loanApplicationReceivedDateRules: [
          v => isNotEmpty(v, "Loan Application Received Date is Required"),
        ],
        dateOfLeavingServiceRules: [
          v => isNotEmpty(v, "Date of Leaving is Required"),
        ],
        dateOfSettlementRules: [
          v => isNotEmpty(v, "Date of Settlement is Required"),
        ],
        loanTypeRules: [
          v => isNotEmpty(v, "Loan Type is Required"),
        ],
        totalCostRules: [
          v => isNotEmpty(v, "Total is Required"),
          v => isNumber(v, "Please enter a valid number"),
          v => shouldBeGreaterThan(v, 0, "Please enter a valid Amount")
        ],
        appliedAmountRules: [
          v => isNotEmpty(v, "Applied Amount is Required"),
          v => isNumber(v, "Please enter a valid number"),
          v => shouldBeGreaterThan(v, 0, "Please enter a valid Amount")
        ],
        propertyEstimatedPriceRules: [
          v => isNotEmpty(v, "Property Estimated Price is Required"),
          v => isNumber(v, "Please enter a valid number"),
          v => shouldBeGreaterThan(v, 0, "Please enter a valid Amount")
        ],
        stampDutyRules: [
          v => isNotEmpty(v, "Stamp Duty is Required"),
          v => isNumber(v, "Please enter a valid number"),
          v => shouldBeGreaterThan(v, 0, "Please enter a valid Amount")
        ],
        registrationRules: [
          v => isNotEmpty(v, "Registration Price is Required"),
          v => isNumber(v, "Please enter a valid number"),
          v => shouldBeGreaterThan(v, 0, "Please enter a valid Amount")
        ],
        insuranceRules: [
          v => isNotEmpty(v, "Insurance is Required"),
          v => isNumber(v, "Please enter a valid number"),
          v => shouldBeGreaterThan(v, 0, "Please enter a valid Amount")
        ],
        othersRules: [
          v => isNumber(v, "Please enter a valid number"),
          v => shouldBeGreaterThan(v, 0, "Please enter a valid Amount")
        ],
        financialInstituteNameRules: [
          v => isNotEmpty(v, "Financial Institute Name is Required"),
        ],
        bankRules: [
          v => isNotEmpty(v, "Bank is Required"),
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
        ]
      },
      alternateMobileNumber: null,
      alternateEmailId: null,
      loanTypes: [],
      selectedLoanType: null,
      downloadingHistorySheet: false,
      totalCost: 0,
      appliedAmount: 0,
      checkingEligibility: false,
      loanAmountCondition: null,
      eligibleAmount: null,
      eligibleAmountError: null,
      documentsError: null,
      loadingDocuments: false,
      documents: [],
      files: {},
      dateOfCompletionOfHouse: null,
      dateOfCompletionOfHouseMenu: false,
      propertyEstimatedPrice: 0,
      stampDuty: 0,
      registration: 0,
      insurance: 0,
      others: 0,
      total: 0,
      financialInstituteName: null,
      bank: null,
      branch: null,
      accountNumber: null,
      ifscCode: null,
      micrCode: null,
      employeeBankName: null,
      employeeAccountNumber: null,
      employeeBankBranch: null,
      employeeIfscCode: null,
      employeeMicrCode: null,
      requestingLoanApplication: false,
      progressStage: 1,
      requestStatusDialog: false,
      requestStatus: null,
      message: null,
      progressMessage: null,
      applicationId: null,
      loanApplicationReceivedDate: null,
      loanApplicationReceivedDateMenu: false,
      gettingLoanDialog: false
    }
  },
  methods: {
    getLoan() {

      this.gettingLoanDialog = true

      this.$store.dispatch("loanModule/getLoanDetails", this.$route.params.entityId)
          .then(res => {
            const response = JSON.parse(res)
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
            this.unitCode = response.unitCode
            this.yearEndProcessError = response.yearEndProcessError
            this.error = response.yearEndProcessErrorMessage
            this.loanTypes = response.loanTypes
            this.pfBase = response.pfBase
            this.selectedLoanType = response.selectedLoanType
            this.alternateMobileNumber = response.alternateMobileNumber
            this.alternateEmailId = response.alternateEmailId
            this.totalCost = response.totalCost
            this.appliedAmount = response.appliedAmount
            this.dateOfCompletionOfHouse = response.dateOfCompletionOfHouse
            this.propertyEstimatedPrice = response.propertyEstimatedPrice
            this.stampDuty = response.stampDuty
            this.registration = response.registration
            this.insurance = response.insurance
            this.others = response.others
            this.total = response.total
            this.financialInstituteName = response.financialInstituteName
            this.bank = response.bank
            this.branch = response.branch
            this.accountNumber = response.accountNumber
            this.ifscCode = response.ifscCode
            this.micrCode = response.micrCode
            this.employeeBankName = response.employeeBankName
            this.employeeAccountNumber = response.employeeAccountNumber
            this.employeeBankBranch = response.employeeBankBranch
            this.employeeIfscCode = response.employeeIfscCode
            this.employeeMicrCode = response.employeeMicrCode
            this.loanAmountCondition = response.eligibleLoanAmount.loanAmountConditions
            this.eligibleAmount = response.eligibleLoanAmount.amounts

            this.uploadedDocuments = response.uploadedDocuments
            this.applicationId = this.$route.params.entityId
            this.documents = response.documents

            this.gettingLoanDialog = false

          })
          .catch(error => {
            this.loadingEmployeeDetails = false
            this.error = error
          })

    },
    downloadLoanHistory() {

      this.downloadingHistorySheet = true

      this.$store.dispatch("loanModule/downloadLoanHistorySheet", this.pernNumber)
          .then(response => {
            let fileName = response.headers["x-suggested-filename"]
            fileDownload(response.data, fileName)
            this.downloadingHistorySheet = false
          })
          .catch(error => {
            console.log(error)
          })
    },
    checkEligibility() {

      this.checkingEligibility = true

      let data = {
        "pernNumber": this.pernNumber,
        "appliedAmount": this.appliedAmount,
        "totalCost": this.totalCost,
        "loanType": this.selectedLoanType
      }

      this.$store.dispatch("loanModule/checkLoanEligibility", data)
          .then(res => {
            const response = JSON.parse(res)
            this.checkingEligibility = false
            this.loanAmountCondition = response.loanAmountConditions
            this.eligibleAmount = response.amounts
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
    getDocuments(){
      this.loadingDocuments = true

      this.$store.dispatch("loanModule/getDocumentsList", this.selectedLoanType)
          .then(response => {
            this.loadingDocuments = false
            this.documents = JSON.parse(response)
          })
          .catch(error => {
            console.log(error)
          })
    },
    save(){

      let isValid = this.$refs.loanForm.validate();

      if(isValid){

        this.requestStatusDialog = true
        this.requestingLoanApplication = true
        this.progressStage = 1

        this.uploadFiles()
            .then(response => {

              this.progressStage = 2

              let data = {
                "applicationId": this.applicationId,
                "pernNumber": this.pernNumber,
                "altContactNumber": this.alternateMobileNumber,
                "altEmailId": this.alternateEmailId,
                "selectedLoanType": this.selectedLoanType,
                "totalCost": this.totalCost,
                "appliedAmount": this.appliedAmount,
                "dateOfCompletionOfHouse": this.dateOfCompletionOfHouse,
                "propertyEstimatedPrice": this.propertyEstimatedPrice,
                "stampDuty": this.stampDuty,
                "propertyRegistration": this.registration,
                "insurance": this.insurance,
                "others": this.others,
                "total": this.total,
                "financialInstituteName": this.financialInstituteName,
                "repaymentBank": this.bank,
                "repaymentBankBranch": this.branch,
                "repaymentBankAccountNumber": this.accountNumber,
                "repaymentBankIfscCode": this.ifscCode,
                "repaymentBankMicrCode": this.micrCode,
                "employeeBank": this.employeeBankName,
                "employeeAccountNumber": this.employeeAccountNumber,
                "employeeBankBranch": this.employeeBankBranch,
                "employeeBankIfscCode": this.employeeIfscCode,
                "employeeBankMicrCode": this.employeeMicrCode,
                "loanApplicationReceivedDate": this.loanApplicationReceivedDate
              }

              let newUploadedDocuments = response.map(uploadedDocument => {
                let doc = JSON.parse(uploadedDocument)
                return {
                  "path": doc.path,
                  "entityId": doc.entityId
                }
              })

              data["documents"] = this.uploadedDocuments.map(uploadedDocument => {

                let filter = newUploadedDocuments.filter(document => document.entityId === uploadedDocument.documentId);

                if(filter.length > 0){
                  uploadedDocument.path = filter[0].path
                }

                return uploadedDocument;

              })

              return this.$store.dispatch("loanModule/updateLoanApplication", data)

            })
            .then(res => {
              this.requestingLoanApplication = false
              let response = JSON.parse(res)
              this.message = response.message
              this.requestStatus = "success"
              this.applicationId = response.id
            })
            .catch(error => {
              this.requestingLoanApplication = false
              this.message = error
              this.requestStatus = "failed"
            })

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
      formattedName = filteredDocument.name.toLowerCase().replace("/", "_");

      const formData = new FormData();

      formData.append(formattedName, this.files[filteredDocument.entityId])

      return this.$store.dispatch("loanModule/uploadDocuments", {
        entityId: filteredDocument.entityId,
        form: formData
      })

    },
    downloadFile(document){
      let path = this.uploadedDocuments.filter(uploadedDocument => uploadedDocument.documentId === document.entityId)[0].path

      this.$store.dispatch("loanModule/downloadLoanDocument", path)
          .then(response => {
            let fileName = response.headers["x-suggested-filename"]
            fileDownload(response.data, fileName)
          })
          .catch(error => {
            console.log(error)
          })

    }
  },
  computed: {
    loanCode(){
      let loanType = this.loanTypes.filter(loan => loan.entityId === this.selectedLoanType)
      if(loanType.length > 0) {
        return loanType[0].code
      }
      return null
    }
  },
  mounted() {
    this.getLoan()
  }
}
</script>

<style scoped>

</style>