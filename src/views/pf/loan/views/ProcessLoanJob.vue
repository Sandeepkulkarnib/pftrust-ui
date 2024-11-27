<template>
  <v-container>
    <v-row>
      <v-col>
        <process-loan :dialog="processLoansDialog"
                      @update:dialog="closeProcessLoansDialog"
        ></process-loan>

        <v-data-table
            :headers="jobHeaders"
            :items="jobs"
            :items-per-page="10"
            class="elevation-1"
            :loading="loading"
            loading-text="Loading... Please wait"
        >
          <template v-slot:top>
            <v-toolbar
                flat
            >
              <v-toolbar-title>Process Loan Jobs Execution History</v-toolbar-title>
              <v-spacer></v-spacer>

              <v-btn small color="secondary" dark @click="processLoansDialog=true">Process Loan</v-btn>

              <v-dialog
                  v-model="dialog"
                  max-width="1000px"
              >
                <v-card>
                  <v-card-title>Processed Loan Applications
                    <v-progress-circular
                        indeterminate
                        :size="30"
                        color="primary"
                        class="ml-4"
                        v-show="jobInProgress"
                    ></v-progress-circular>
                  </v-card-title>

                  <v-data-table
                      v-if="jobDetails !== null"
                      :headers="jobDetailHeaders"
                      :items="jobDetails"
                      :items-per-page="10"
                      class="elevation-1"
                      :loading="loading"
                      loading-text="Loading... Please wait"
                  >

                    <template v-slot:[`item.action`]="{ item }">
                      <v-btn small dark :color="item.status === 'completed' ? 'success' : 'indigo'"
                      :to="'/loans/details/' + item.id">
                        view
                      </v-btn>
                    </template>

                  </v-data-table>

                </v-card>

              </v-dialog>

            </v-toolbar>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-btn small dark :color="item.status === 'completed' ? 'success' : 'indigo'"
                   @click="showDetails(item)">
              Details
              <v-progress-circular indeterminate size="20" class="ml-1"
                                   width="2"
                                   v-show="item.status === 'started'"
              ></v-progress-circular>
            </v-btn>
          </template>

        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ProcessLoan from "@/views/pf/loan/views/ProcessLoan";
export default {
  name: "ProcessLoanJob",
  components: {ProcessLoan},
  data () {
    return {
      loading: false,
      jobs: [],
      startingJob: false,
      jobType: "process_loan_applications_job",
      dialog: false,
      newJobDialog: false,
      jobInProgress: false,
      jobHeaders: [
        {
          text: 'Job',
          align: 'start',
          sortable: true,
          value: 'name',
        },
        { text: 'Started At', sortable: true, value: 'startedAt' },
        { text: 'Completed At', sortable: true, value: 'completedAt' },
        { text: 'Status', sortable: true, value: 'status' },
        { text: 'Duration(Sec)', sortable: true, value: 'duration' },
        { text: 'Action', sortable: false, value: 'actions' },
      ],
      jobDetailHeaders: [
        {text: 'Pern No.', align: 'start', sortable: true, value: 'pernNumber'},
        {text: 'Name', sortable: true, value: 'name'},
        {text: 'Applied Amount', sortable: true, value: 'appliedAmount'},
        {text: 'Loan Amount', sortable: true, value: 'loanAmount'},
        {text: 'Action', sortable: true, value: 'action'},
      ],
      jobDetails: null,
      items: [],
      selectedUnitCodes: [],
      interval: null,
      processLoansDialog: false
    }
  },
  methods: {
    showDetails(details) {
      this.jobDetails = JSON.parse(details.params)
      this.dialog = true
      this.jobInProgress = details.status === 'started'
    },
    getJobs() {
      this.$store.dispatch("loanModule/getProcessLoanJobs")
          .then(response => {
            this.jobs = response
            this.loading = false;
          })
          .catch(error => {
            console.log(error)
          })
    },
    closeProcessLoansDialog(value){
      this.processLoansDialog = value
    },
  },
  mounted() {
    this.loading = true
    this.getJobs()

    // this.interval = setInterval(() => {
    //   this.loading = true
    //   this.getJobs()
    // }, (30*1000))
  },
  beforeDestroy() {
    clearInterval(this.interval)
  }
}
</script>

<style scoped>

</style>