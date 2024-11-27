<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
            :headers="headers"
            :items="loanTypes"
            :options.sync="options"
            :server-items-length="totalLoans"
            class="elevation-1"
            :loading="loading"
            loading-text="Loading... Please wait"
            :footer-props="footerOptions"
            key="id"
        >
          <template v-slot:top>
            <v-toolbar
                flat
            >
              <v-toolbar-title>Loan Types</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                  color="primary"
                  dark
                  @click.stop="dialog = true"
              >
                <v-icon > mdi-plus </v-icon> Loan Type
              </v-btn>

              <v-dialog
                  v-model="dialog"
                  max-width="500"
              >
                <v-card>
                  <div>
                    <v-card-title class="text-h5">
                      Add New Loan Type <v-spacer></v-spacer>
                      <v-icon
                          dark
                          color="black darken-2"
                          @click="reset"
                          @click.stop="dialog = false"
                      >
                        mdi-close
                      </v-icon>
                    </v-card-title>

                  </div>

                  <v-form
                      ref="form"
                      v-model="valid"
                      lazy-validation
                  >
                  <v-text-field
                      v-model="loanCode"
                      :rules="loanGroupRules"
                      label="Loan Code"
                      required
                      dense
                      class="ml-4 mr-4 mt-4"
                  ></v-text-field>
                    <v-text-field
                        v-model="loanGroup"
                        :rules="loanGroupRules"
                        label="Loan Group"
                        required
                        dense
                        class="ml-4 mr-4 mt-4"
                    ></v-text-field>
                  <v-text-field
                      v-model="loanTitle"
                      :rules="loanTitleRules"
                      label="Loan Title"
                      required
                      dense
                      class="ml-4 mr-4 mt-4"
                  ></v-text-field>

                  <v-text-field
                      v-model="tenure"
                      :rules="tenureRules"
                      label="Minimum Membership Tenure In Month"
                      required
                      dense
                      class="ml-4 mr-4 mt-4"
                  ></v-text-field>

                  <v-text-field
                      v-model="withdrawal"
                      :rules="withdrawalRules"
                      label="Maximum No.of Withdrawals"
                      required
                      dense
                      class="ml-4 mr-4 mt-4"
                  ></v-text-field>
                    <v-text-field
                        v-model="retirementDate"
                        :rules="numberRules"
                        label="From Retirement Date in years"
                        required
                        dense
                        class="ml-4 mr-4 mt-4"
                    ></v-text-field>
                    <v-text-field
                        v-model="nextEligibility"
                        :rules="numberRules"
                        label="Next Eligibility in years"
                        required
                        dense
                        class="ml-4 mr-4 mt-4"
                    ></v-text-field>
                    <v-text-field
                        v-model="pfBaseSalary"
                        :rules="numberRules"
                        label="PF Base Salary In Month"
                        required
                        dense
                        class="ml-4 mr-4 mt-4"
                    ></v-text-field>
                    <v-text-field
                        v-model="memberContribution"
                        :rules="numberRules"
                        label="Member Contribution %"
                        required
                        dense
                        class="ml-4 mr-4 mt-4"
                    ></v-text-field>
                    <v-text-field
                        v-model="companyContribution"
                        :rules="numberRules"
                        label="Company Contribution %"
                        required
                        dense
                        class="ml-4 mr-4 mt-4"
                    ></v-text-field>
                    <v-text-field
                        v-model="vpfContribution"
                        :rules="numberRules"
                        label="VPF Contribution %"
                        required
                        dense
                        class="ml-4 mr-4 mt-4"
                    ></v-text-field>
                    <v-text-field
                        v-model="totalCost"
                        :rules="amountRules"
                        label="Total Cost in %"
                        required
                        dense
                        class="ml-4 mr-4 mt-4"
                    ></v-text-field>
                    <v-text-field
                        v-model="appliedAmount"
                        :rules="amountRules"
                        label="Applied Amount in %"
                        required
                        dense
                        class="ml-4 mr-4 mt-4"
                    ></v-text-field>

                  <div>
                    <p class="text-md-body-2 error--text ml-4">Press Esc, to close Select Box</p>
                  </div>


                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        color="primary"
                        dark
                        @click="reset"
                        @click.stop="dialog = false"
                    >
                      Cancel
                    </v-btn>

                    <v-btn
                        color="primary"
                        dark
                        @click="validate"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                  </v-form>
                </v-card>
              </v-dialog>

              <v-dialog
                  v-model="dialog2"
                  max-width="400"
              >
                <v-card>
                  <v-card-title class="text-h5" >
                    <span v-html="stausMessage"></span>
                  </v-card-title>

                  <v-card-text color="primary">
                    <span v-html="message"></span>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        text
                        v-on:click="reFresh();dialog2=false,dialog=false"
                    >
                      OK
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              </v-toolbar>
          </template>

        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import {isNotEmpty, isNumber, shouldBeGreaterThan, shouldBeLessThan} from "@/util/rules";

export default {
  name: "ExistingLoan",
  data () {
    return {
      valid: true,
      loanCode: '',
      loanGroup: '',
      loanGroupRules: [
        v => isNotEmpty(v, "Please enter a value"),

      ],
      loanTitle: '',
      loanTitleRules: [
        v => isNotEmpty(v, "Please enter a value"),
      ],
      tenure: '',
      tenureRules: [
        v => isNotEmpty(v, "Please enter a value"),
        v => isNumber(v, "Please enter a valid number"),
      ],
      withdrawal: '',
      withdrawalRules: [
        v => isNotEmpty(v, "Please enter a value"),
        v => isNumber(v, "Please enter a valid number"),
        v => shouldBeGreaterThan(v, 0, "Number Should be Greater than 0"),
        v => shouldBeLessThan(v, 101, "Number Should not be Greater than 100")
      ],
      numberRules:[
        v => isNotEmpty(v, "Please enter a value"),
        v => isNumber(v, "Please enter a valid number"),
        v => shouldBeLessThan(v, 101, "Number Should not be Greater than 100")
      ],
      amountRules:[
        v => isNotEmpty(v, "Please enter a value"),
        v => isNumber(v, "Please enter a valid number"),
        v => shouldBeLessThan(v, 101, "Number Should not be Greater than 100")
      ],
      retirementDate: '',
      nextEligibility: '',
      pfBaseSalary: '',
      memberContribution: '',
      companyContribution: '',
      vpfContribution: '',
      totalLoans: 0,
      loanTypes: [],
      loading: true,
      totalCost:'',
      appliedAmount:'',
      options: {
        itemsPerPage: 10,
        page: 1
      },
      headers: [
        {
          text: 'Title',
          align: 'start',
          sortable: false,
          value: 'title',
        },
        {text: 'Code', sortable: false, value: 'code'},
        {text: 'Loan Group', sortable: false, value: 'group'},
        {text: 'Minimum Tenure (in month)', sortable: false, value: 'minimumTenure'},
        {text: 'Maximum No.of Withdrawals', sortable: false, value: 'maximumNumberOfWithdrawals'}
      ],
      footerOptions: {
        "items-per-page-options": [10, 25, 100],
      },
      dialog: false,
      dialog2: false,
      message: "<p></p>",
      stausMessage: "<p></p>"
    }
  },
  methods :{
    validate () {
      this.$refs.form.validate()

      if (this.$refs.form.validate()){
        this.save()
      }
    },
    reset () {
      this.$refs.form.reset()

    },
    save (){
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
        totalCost:this.totalCost,
        appliedAmount:this.appliedAmount
      }
      let success = false
      this.$store.dispatch("loanModule/saveLoanType", data)
          .then(response => {
            success=true;
            console.log(response)
            if(success){
              this.stausMessage='<p>Success</p>'
              this.message='<p>New Loan Type is added successfully.</p>'
              this.dialog2=true;
            }
          })
          .catch(error =>{
            console.log(error)
            this.stausMessage='<p>Unable to save Loan Type</p>'
            this.message='<p>Loan Type with the same loan Code is already exists.</p>'
            this.dialog2=true;
          })
      this.$refs.form.reset()
    },
    reFresh(){
      this.$store.dispatch("loanModule/getLoanTypes")
        .then(response => {
          this.loading=false
          this.loanTypes=response
          this.totalLoans=response.length
        })
        .catch(error => console.log(error))
    },
  },
  mounted() {
      this.$store.dispatch("loanModule/getLoanTypes")
          .then(response => {
            this.loading=false
            this.loanTypes=response
            this.totalLoans=response.length
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