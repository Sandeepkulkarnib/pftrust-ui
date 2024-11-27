<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
            :headers="headers"
            :items="settlements"
            class="elevation-1"
            :loading="loading"
            loading-text="Loading... Please wait"
            show-select
            v-model="selected"
            item-key="entityId"
            :no-data-text="error"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Generate Bank Sheet for Transfer Outs for NEFT Payment</v-toolbar-title>
            </v-toolbar>

            <v-container>
              <v-row>
                <v-col cols="3">
                  <v-menu
                      ref="dateMenu"
                      v-model="dateMenu"
                      :close-on-content-click="false"
                      :return-value.sync="dateRange"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                          v-model="dateRange"
                          label="Select Date Range"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          dense
                      ></v-text-field>
                    </template>
                    <v-date-picker
                        v-model="dateRange"
                        no-title
                        scrollable
                        range
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                          text
                          color="primary"
                          @click="dateMenu = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                          text
                          color="primary"
                          @click="$refs.dateMenu.save(dateRange)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="3">
                  <v-select
                      :items="banks"
                      label="Select Bank"
                      dense
                      item-text="name"
                      item-value="entityId"
                      v-model="bankId"
                  ></v-select>
                </v-col>
                <v-col cols="3">
                  <v-btn small color="primary" :loading="loading"
                         @click="getSettlements">load</v-btn>
                </v-col>
              </v-row>
            </v-container>

            <v-dialog
                v-model="selectPaymentDateDialog"
                max-width="500px"
            >
              <v-card>
                <v-card-title>
                  Select Payment Date for Selected Records
                  <v-spacer></v-spacer>
                  <v-icon
                      small
                      color="black darken-2"
                      @click="selectPaymentDateDialog = false"
                  >
                    mdi-close
                  </v-icon>
                </v-card-title>

                <v-container fluid fill-height>
                  <v-row>
                    <v-col>
                      <div class="ma-3">
                        You have selected {{selected.length}} records for Generating Bank Sheet, Please select Payment Date.
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-menu
                          ref="paymentDateMenu"
                          v-model="paymentDateMenu"
                          :close-on-content-click="false"
                          :return-value.sync="paymentDate"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                              v-model="paymentDate"
                              label="Select Payment Date"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              dense
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
                  </v-row>
                </v-container>

                <v-card-actions>
                  <p v-show="message !== null"
                     :class="requestStatus === 'success' ? 'success--text' : 'error--text'">{{message}}</p>
                  <v-spacer></v-spacer>
                  <v-btn color="primary"
                         :disabled="paymentDate === null"
                         dark
                         :loading="downloadingBankSheet"
                         small
                         @click="generateBankSheet"
                  >
                    Generate
                  </v-btn>
                </v-card-actions>

              </v-card>

            </v-dialog>

          </template>

          <template v-slot:[`footer.prepend`]>
            <v-btn color="primary" small dark
                   v-if="selected.length > 0"
                   @click="selectPaymentDateDialog = true">
              Select Payment Date & Generate</v-btn>
          </template>

        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import fileDownload from "js-file-download";

export default {
  name: "GenerateBankSheet",
  data () {
    return {
      settlements: [],
      loading: false,
      search: null,
      headers: [
        { text: 'Pf No.', sortable: true, value: 'pfNumber' },
        { text: 'Pern No.', sortable: true, value: 'pernNumber' },
        { text: 'Name', sortable: false, value: 'name' },
        { text: 'Unit Code', sortable: false, value: 'unitCode' },
        { text: 'Date of Leaving', sortable: false, value: 'dateOfLeavingService' },
        { text: 'Date of Settlement', sortable: false, value: 'dateOfSettlement' },
        { text: 'Net Credit', sortable: false, value: 'netCredit' },
        { text: 'Status', sortable: false, value: 'status' },
      ],
      selected: [],
      sendEmailsDialog: false,
      requestStatus: null,
      message: "",
      confirmSend: false,
      requestingSend: false,
      dateRange: null,
      dateMenu: false,
      banks: [],
      bankId: null,
      error: "",
      paymentDate: null,
      selectPaymentDateDialog: false,
      paymentDateMenu: false,
      downloadingBankSheet: false
    }
  },
  methods: {
    getSettlements(){
      const data = {
        "startDate": this.dateRange[0],
        "endDate": this.dateRange[1],
        "bankId": this.bankId
      }
      this.loading = true
      this.$store.dispatch("transferOutModule/getTransferOutsForBankSheet", data)
          .then(response => {
            this.loading = false
            this.settlements = response
            this.requestStatus = "success"
          })
          .catch(error => {
            this.loading = false
            this.error = error
            this.requestStatus = "failed"
            this.settlements = []
          })
    },
    getBanks(){
      this.$store.dispatch("transferOutModule/getBanks")
          .then(res => {
            this.banks = JSON.parse(res)
          })
          .catch(error => {
            console.log(error)
          })
    },
    generateBankSheet(){
      this.downloadingBankSheet = true
      this.$store.dispatch("transferOutModules/generateBankSheet", {
        "paymentDate": this.paymentDate,
        "entityIds": this.selected.map(settlement => settlement.entityId)
      })
      .then(response => {
        let fileName = response.headers["x-suggested-filename"]
        fileDownload(response.data, fileName)
        this.downloadingBankSheet = true
        this.selectPaymentDateDialog = true
      })
      .catch(error => {
        console.log(error)
      })
    }
  },
  mounted() {
    this.getBanks()
  }
}
</script>

<style scoped>

</style>