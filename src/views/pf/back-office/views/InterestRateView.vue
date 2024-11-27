<template>
  <v-container>

    <v-row justify="center">
      <v-col>
        <v-dialog
            v-model="addNewInterestRate"
            max-width="500px"
        >
          <v-card>
            <v-card-title>
              Add New Interest Rate
              <v-spacer></v-spacer>
              <v-icon
                  dark
                  color="black darken-2"
                  @click="reset"
                  @click.stop="addNewInterestRate = false"
              >
                mdi-close
              </v-icon>
            </v-card-title>
            <v-container fluid fill-height>
              <v-row >
                <v-col>
                  <v-text-field
                      type="number"
                      v-model="interestRate"
                      :rules="interestRateRule"
                      label="Interest Rate In %"
                      required
                      dense
                      class="ml-4 mr-4 mt-4"
                  ></v-text-field>
                  <div v-show="isFailed">
                    <p class="text-md-body-2 error--text">{{message}}</p>
                  </div>
                  <div v-show="isSuccess">
                    <p class="text-md-body-2 success--text">{{message}}</p>
                  </div>
                  <div>
                    <p class="text-md-body-2 error--text">Note: Current Active Interest Rate will be
                      deactivated, after adding new Interest Rate.</p>
                  </div>
                  <v-btn dark color="primary" class=" mt-5 mb-2"
                         small
                         @click="reset"
                         @click.stop="addNewInterestRate = false"
                  >Cancel</v-btn>
                  <v-btn dark color="primary" class="float-right mt-5 mb-2"
                         small
                         :disabled="interestRate === null"
                         :loading="inProgress"
                         @click="saveInterestRate"
                  >Save</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>


    <v-row>
      <v-col>
        <v-data-table
            :headers="headers"
            :items="interestRates"
            :items-per-page="10"
            class="elevation-1"
            :loading="false"
            loading-text="Loading... Please wait"
        >

          <template v-slot:top>
            <v-toolbar
                flat
            >
              <v-toolbar-title>Interest Rates</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  small
                  @click="addNewInterestRate = true"
              >
                Add New
              </v-btn>
            </v-toolbar>
          </template>


        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import {isDecimal, isNotEmpty, shouldBeLessThan} from "@/util/rules";

export default {
  name: "InterestRateView",
  data () {
    return {
      headers: [
        {
          text: 'Description',
          align: 'start',
          sortable: true,
          value: 'description',
        },
        {text: 'Rate', sortable: true, value: 'interestRate'},
        {text: 'Year', sortable: true, value: 'year'},
        { text: 'Created At', sortable: true,  value: 'createdAt' },
        { text: 'Created By', sortable: true,  value: 'createdBy' },
        { text: 'Active', sortable: true, value: 'isActive' },
        { text: 'Updated At', sortable: true, value: 'updatedAt' },
        { text: 'Updated By', sortable: true, value: 'updatedBy' },
      ],
      interestRate:'',
      interestRateRule:[
        v => isNotEmpty(v, "Please enter a value"),
        v => isDecimal(v,"please enter a decimal number"),
        v => shouldBeLessThan(v, 101, "Number Should not be Greater than 100")
      ],
      addNewInterestRate: false,
      newInterestRate: 0,
      rules: [v => v > 0 || 'Enter a valid interest rate.'],
    }
  },
  computed: {
    interestRates () {
      return this.$store.state.backofficeModule.interestRates
    },
    inProgress () {
      return this.$store.state.backofficeModule.request.inProgress;
    },
    isFailed () {
      return this.$store.state.backofficeModule.request.isFailed;
    },
    message () {
      return this.$store.state.backofficeModule.request.message;
    },
    isSuccess () {
      return this.$store.state.backofficeModule.request.isSuccess;
    }
  },
  watch: {
    interestRates(){
      let activeInterestRate = this.interestRates.filter(interestRate => interestRate.isActive)
      this.newInterestRate = activeInterestRate[0].interestRate;
    },
    addNewInterestRate(){
      if(!this.addNewInterestRate){
        let activeInterestRate = this.interestRates.filter(interestRate => interestRate.isActive)
        this.newInterestRate = activeInterestRate[0].interestRate;
        this.$store.commit("backofficeModule/setRequestStatus", {
          inProgress: false,
          isSuccess: false,
          isFailed: false,
          message: ""
        })
      }
    }
  },
  methods: {
    saveInterestRate() {
      this.$store.dispatch("backofficeModule/saveInterestRate", {
        "interestRate": this.interestRate
      })
          .then(response => {
            if(response){
              setTimeout(() => this.addNewInterestRate = false, 500)
            }
          })
          .catch(error => {
            console.log(error)
          })
    },
  },
  mounted() {
    if(this.interestRates.length < 1){
      this.$store.dispatch("backofficeModule/fetchInterestRates")
          .then(response => {
            console.log(response)
          })
          .catch(error => {
            console.log(error)
          })
    }
  }
}
</script>

<style scoped>

</style>