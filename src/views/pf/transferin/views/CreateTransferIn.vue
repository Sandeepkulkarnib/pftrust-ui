<template>
  <v-card>
    <v-card-title>
      Create New TransferIn Application
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
            <div class="text-center" v-show="requestingTransferInApplication">
              <v-progress-circular
                  :size="70"
                  :width="5"
                  color="primary"
                  indeterminate
              ></v-progress-circular>
              <h3 class="mt-5">Please wait while the TransferIn Application is getting Processed...</h3>
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
          <v-card-actions v-show="!requestingTransferInApplication">
            <v-spacer></v-spacer>
            <v-btn color="indigo" small dark
                   :to="'/transfer-ins/details/' + applicationId">View Details</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-form  ref="transferInForm"
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
                  label="Employee Name"
                  required
                  dense
                  readonly
                  :rules="rules.nameRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="mobileNumber"
                  label="Mobile No."
                  required
                  dense
                  readonly
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="email"
                  label="Email Id"
                  required
                  dense
                  readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
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
          <v-row class="ma-0 pa-0 mt-10">
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
          <v-row class="ma-0 pa-0 mt-10">
            <v-col>
              <p class="text-decoration-underline font-weight-black">PREVIOUS ACCOUNT DETAILS:</p>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="4">
              <v-text-field
                  v-model="prevPfNumber"
                  label="PF Account No."
                  required
                  dense
                  :rules="rules.prevPfNumberRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="prevEpsNumber"
                  label="Pension Fund Account No."
                  required
                  dense
                  :rules="rules.prevEpsNumberRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-select
                  :items="pfAccountHolders"
                  item-value="code"
                  item-text="name"
                  label="PF Account Held By."
                  dense
                  :rules="rules.prevAccountHolderRules"
                  v-model="prevAccountHolder"
              ></v-select>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="4">
              <v-text-field
                  v-model="addressLine1"
                  label="Address Line 1"
                  required
                  dense
                  :rules="rules.addressRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="addressLine2"
                  label="Address Line 2"
                  required
                  dense
                  :rules="rules.addressRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="addressLine3"
                  label="Address Line 3"
                  required
                  dense
                  :rules="rules.addressRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="addressLine4"
                  label="Address Line 4"
                  required
                  dense
                  :rules="rules.addressRules"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0 mt-10">
            <v-col>
              <p class="text-decoration-underline font-weight-black">PREVIOUS COMPANY DETAILS:</p>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="4">
              <v-text-field
                  v-model="companyName"
                  label="Company Name"
                  required
                  dense
                  :rules="rules.companyNameRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-menu
                  ref="dateOfJoiningMenu"
                  v-model="dateOfJoiningMenu"
                  :close-on-content-click="false"
                  :return-value.sync="companyDateOfJoining"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      :value="formattedDateofJoining"
                      label="Date of Joining"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      dense
                      :rules="rules.companyDateOfJoiningRules"
                  ></v-text-field>
                </template>
                <v-date-picker
                    v-model="companyDateOfJoining"
                    no-title
                    scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn
                      text
                      color="primary"
                      @click="dateOfJoiningMenu = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                      text
                      color="primary"
                      @click="$refs.dateOfJoiningMenu.save(companyDateOfJoining)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="4">
              <v-menu
                  ref="dateOfLeavingMenu"
                  v-model="dateOfLeavingMenu"
                  :close-on-content-click="false"
                  :return-value.sync="companyDateOfLeaving"
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
                      :rules="rules.companyDateOfLeavingRules"
                  ></v-text-field>
                </template>
                <v-date-picker
                    v-model="companyDateOfLeaving"
                    no-title
                    scrollable
                    :min="companyDateOfJoining"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                      text
                      color="primary"
                      @click="dateOfLeavingMenu = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                      text
                      color="primary"
                      @click="$refs.dateOfLeavingMenu.save(companyDateOfLeaving)"
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
                  v-model="prevAddressLine1"
                  label="Address Line 1"
                  required
                  dense
                  :rules="rules.addressRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="prevAddressLine2"
                  label="Address Line 2"
                  required
                  dense
                  :rules="rules.addressRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="prevAddressLine3"
                  label="Address Line 3"
                  required
                  dense
                  :rules="rules.addressRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="prevAddressLine4"
                  label="Address Line 4"
                  required
                  dense
                  :rules="rules.addressRules"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0 mt-10">
            <v-col>
              <p class="text-decoration-underline font-weight-black">DETAILS OF PRESENT ACCOUNT:</p>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="4">
              <v-text-field
                  v-model="pfAccountNumber"
                  label="PF Account No."
                  required
                  dense
                  :rules="rules.pfAccountNumberRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="epsAccountNumber"
                  label="Pension Fund Account No."
                  required
                  dense
                  :rules="rules.epsAccountNumberRules"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-menu
                  ref="presDateOfJoiningMenu"
                  v-model="presDateOfJoiningMenu"
                  :close-on-content-click="false"
                  :return-value.sync="dateOfJoining"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      v-model="dateOfJoining"
                      label="Date of Joining"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      dense
                      :rules="rules.dateOfJoiningRules"
                  ></v-text-field>
                </template>
                <v-date-picker
                    v-model="dateOfJoining"
                    no-title
                    scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn
                      text
                      color="primary"
                      @click="presDateOfJoiningMenu = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                      text
                      color="primary"
                      @click="$refs.presDateOfJoiningMenu.save(dateOfJoining)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="pt-5 pb-5">
      <v-spacer></v-spacer>
      <v-btn color="primary" small dark @click="save">Create Transfer In</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>

import {isNotEmpty, validEmailId, validMobileNumber, validPern} from "@/util/rules";

export default {
  name: "CreateTransferIn",
  data() {
    return {
      isValid: true,
      pernNumber: null,
      pfNumber: null,
      tokenNumber: null,
      name: null,
      mobileNumber: null,
      email: null,
      unitCode: null,
      alternateMobileNumber: null,
      alternateEmailId: null,
      prevPfNumber: null,
      prevEpsNumber: null,
      prevAccountHolder: null,
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      addressLine4: null,
      companyName: null,
      companyDateOfJoining: null,
      dateOfJoiningMenu: false,
      dateOfLeavingMenu: false,
      companyDateOfLeaving: null,
      prevAddressLine1: null,
      prevAddressLine2: null,
      prevAddressLine3: null,
      prevAddressLine4: null,
      pfAccountNumber: null,
      epsAccountNumber: null,
      dateOfJoining: null,
      presDateOfJoiningMenu: false,
      loadingEmployeeDetails: false,
      pfAccountHolders: [
        {name: "RPFC", code: "06"},
        {name: "TRUST", code: "07"}
      ],
      error: null,
      requestingTransferInApplication: false,
      requestStatus: "success",
      message: null,
      requestStatusDialog: false,
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
        alternateMobileNumberRules: [
            v => isNotEmpty(v, "Alternate Mobile No. is Required"),
            v => validMobileNumber(v, "Provide Valid Mobile Number")
        ],
        alternateEmailIdRules: [
            v => isNotEmpty(v, "Alternate Email ID is Required"),
            v => validEmailId(v, "Provide Valid Email ID")
        ],
        prevPfNumberRules: [
            v => isNotEmpty(v, "Prev. PF No. is Required"),
        ],
        prevEpsNumberRules: [
            v => isNotEmpty(v, "Prev. EPS No. is Required"),
        ],
        prevAccountHolderRules: [
            v => isNotEmpty(v, "Select Prev. Account Holder"),
        ],
        addressRules: [
            v => isNotEmpty(v, "Please Enter Address"),
        ],
        companyNameRules: [
            v => isNotEmpty(v, "Company Name is Required"),
        ],
        companyDateOfJoiningRules: [
            v => isNotEmpty(v, "Date of Joining is Required"),
        ],
        companyDateOfLeavingRules: [
          v => isNotEmpty(v, "Date of Leaving is Required"),
        ],
        pfAccountNumberRules: [
            v => isNotEmpty(v, "PF. Account No. is Required")
        ],
        epsAccountNumberRules: [
          v => isNotEmpty(v, "EPS. Account No. is Required")
        ],
        dateOfJoiningRules: [
          v => isNotEmpty(v, "Date of Joining is Required")
        ],
      },
      applicationId: null
    }
  },
  computed: {
    formattedDateofJoining(){

      let dateOfLeaving = this.companyDateOfJoining;

      if(!dateOfLeaving) return ""

      let [year, month, day] = dateOfLeaving.split('-')
      console.log(year,month,day)

      return day+"-"+month+"-"+year
    },
    formattedDateofLeaving(){

      let dueDate = this.companyDateOfLeaving;

      if(!dueDate) return ""

      let [year, month, day] = dueDate.split('-')
      console.log(year,month,day)

      return day+"-"+month+"-"+year
    }
  },
  watch: {

  },
  methods: {
    getDetails() {

      this.loadingEmployeeDetails = true

      this.$store.dispatch("transferInModule/getEmployeeDetailsForTransferIn", this.pernNumber)
          .then(response => {
            let details = JSON.parse(response.details)
            this.pfNumber = details.pfNumber
            this.tokenNumber = details.tokenNumber
            this.name = details.name
            this.mobileNumber = details.mobileNumber
            this.email = details.emailId
            this.unitCode = details.unitCode
            this.pfAccountNumber = details.pfNumber
            this.epsAccountNumber = details.epsNumber
            this.dateOfJoining = details.dateOfJoining
            this.loadingEmployeeDetails = false
            this.error = null
          })
          .catch(error => {
            this.error = error
            this.loadingEmployeeDetails = false
            console.log(error)
          })
    },
    getDetailsByPf() {

      this.loadingEmployeeDetails = true

      this.$store.dispatch("transferInModule/getEmployeeDetailsForTransferInByPf", this.pfNumber)
          .then(response => {
            let details = JSON.parse(response.details)
            this.pernNumber = details.pernNumber
            this.pfNumber = details.pfNumber
            this.tokenNumber = details.tokenNumber
            this.name = details.name
            this.mobileNumber = details.mobileNumber
            this.email = details.emailId
            this.unitCode = details.unitCode
            this.pfAccountNumber = details.pfNumber
            this.epsAccountNumber = details.epsNumber
            this.dateOfJoining = details.dateOfJoining
            this.loadingEmployeeDetails = false
            this.error = null
          })
          .catch(error => {
            this.error = error
            this.loadingEmployeeDetails = false
            console.log(error)
          })
    },
    save(){
      let isValid = this.$refs.transferInForm.validate();
      if(isValid){

        this.requestStatusDialog = true
        this.requestingTransferInApplication = true

        const data = {
          pernNumber: this.pernNumber,
          alternateMobileNumber: this.alternateMobileNumber,
          alternateEmailId: this.alternateEmailId,
          prevPfNumber: this.prevPfNumber,
          prevEpsNumber: this.prevEpsNumber,
          prevAccountHolder: this.prevAccountHolder,
          addressLine1: this.addressLine1,
          addressLine2: this.addressLine2,
          addressLine3: this.addressLine3,
          addressLine4: this.addressLine4,
          previousCompany: {
            companyName: this.companyName,
            companyDateOfJoining: this.companyDateOfJoining,
            companyDateOfLeaving: this.companyDateOfLeaving,
            addressLine1: this.prevAddressLine1,
            addressLine2: this.prevAddressLine2,
            addressLine3: this.prevAddressLine3,
            addressLine4: this.prevAddressLine4,
          },
          pfAccountNumber: this.pfAccountNumber,
          epsAccountNumber: this.epsAccountNumber,
          dateOfJoining: this.dateOfJoining,
        }

        this.$store.dispatch("transferInModule/createTransferInApplication", data)
            .then(response => {
              const data = JSON.parse(response);
              this.message = data.message
              this.requestStatus = "success"
              this.applicationId = data.id
              this.requestingTransferInApplication = false
            })
            .catch(error => {
              console.log(error)
              this.message = error
              this.requestStatus = "failed"
              this.requestingTransferInApplication = false
            })

      }
    }
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>