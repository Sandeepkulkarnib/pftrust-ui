<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
            :headers="headers"
            :items="list"
            class="elevation-1"
            :loading="loading"
            loading-text="Loading... Please wait"
            show-select
            v-model="selected"
            item-key="entityId"
        >
          <template v-slot:top>
            <v-toolbar
                flat
            >
              <v-toolbar-title>Send Confirmation Emails for Transfer Outs</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="indigo" small dark :disabled="selected.length === 0" @click="sendEmailsDialog = true">Send Emails</v-btn>
              <p v-show="message !== null"
                 :class="sendEmailRequestStatus === 'success' ? 'success--text' : 'error--text'">{{message}}</p>
            </v-toolbar>

            <v-dialog
                v-model="sendEmailsDialog"
                max-width="500px"
            >
              <v-card>
                <v-card-title>
                  Send Emails
                  <v-spacer></v-spacer>
                  <v-icon
                      small
                      color="black darken-2"
                      @click="sendEmailsDialog = false"
                  >
                    mdi-close
                  </v-icon>
                </v-card-title>

                <v-container fluid fill-height>
                  <v-row>
                    <v-col>
                      <div class="ma-3">
                        You have selected {{selected.length}} records for Sending Transfer Out confirmation Emails.
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-checkbox v-model="confirmSend" color="primary">
                        <template v-slot:label>
                          <div>
                            Please confirm that you want to send Transfer Out Completion Emails.
                          </div>
                        </template>
                      </v-checkbox>
                    </v-col>
                  </v-row>
                </v-container>

                <v-card-actions>
                  <p v-show="message !== null"
                     :class="sendEmailRequestStatus === 'success' ? 'success--text' : 'error--text'">{{message}}</p>
                  <v-spacer></v-spacer>
                  <v-btn color="primary"
                         :disabled="!confirmSend"
                         dark
                         :loading="requestingSend"
                         @click="sendEmails"
                  >
                    Send
                  </v-btn>
                </v-card-actions>

              </v-card>

            </v-dialog>

          </template>

        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: "SendEmailForTransferOut",
  data () {
    return {
      list: [],
      loading: false,
      search: null,
      headers: [
        { text: 'Pf No.', sortable: true, value: 'fromPfAccount' },
        { text: 'Name', sortable: false, value: 'employeeName' },
        { text: 'Unit Code', sortable: false, value: 'unitCode' },
        { text: 'Email ID', sortable: false, value: 'emailId' },
        { text: 'Payment Date', sortable: false, value: 'paymentDate' },
        { text: 'Net Credit', sortable: false, value: 'totalContribution' },
      ],
      selected: [],
      sendEmailsDialog: false,
      sendEmailRequestStatus: null,
      message: null,
      confirmSend: false,
      requestingSend: false
    }
  },
  watch: {

  },
  methods: {
    getData(){
      this.loading = true
      this.$store.dispatch("transferOutModule/fetchTransferOutEmailList")
          .then(response => {
            this.list = response
            this.loading = false
          })
          .catch(error => {
            console.log(error)
          })
    },
    sendEmails(){
      const entityIds = this.selected.map(item => item.entityId)
      this.requestingSend = true
      this.$store.dispatch("transferOutModule/sendTransferOutCompletionEmails", entityIds)
          .then(response => {
            this.message = response
            this.sendEmailRequestStatus = "success"
            this.requestingSend = false
            this.selected = []
            this.sendEmailsDialog = false
            this.getData()
          })
          .catch(error => {
            this.sendEmailRequestStatus = "failed"
            this.message = error
            this.requestingSend = false
          })

    }
  },
  computed: {

  },
  mounted() {
    this.getData()
  }

}

</script>

<style scoped>
  a {
    color: #000;
  }
</style>