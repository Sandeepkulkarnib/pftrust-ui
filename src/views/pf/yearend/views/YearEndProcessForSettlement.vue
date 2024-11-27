<template>
  <v-container>
    <v-row justify="center">
      <v-col>
        <v-dialog
            v-model="newJobDialog"
            max-width="500px"
        >
          <v-card>
            <v-card-title>
              Start a new Year End Process For Settlement Job
              <p class="error--text text-body-2">select unit code or enter employee pern nos.</p>
              <v-spacer></v-spacer>
              <v-icon
                  dark
                  color="black darken-2"
                  @click.stop="newJobDialog = false"
              >
                mdi-close
              </v-icon>
            </v-card-title>
            <v-container fluid fill-height v-show="stage === 1">
              <v-row>
                <v-col>
                  <v-alert dense type="warning" v-show="interestRate > 1">
                    {{interestRate}} is the current interest rate, for financial year {{financialYear}}.
                  </v-alert>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-select
                      v-model="selectedUnitCodes"
                      :items="unitCodes"
                      label="Select UnitCodes"
                      multiple
                      chips
                      deletable-chips
                      v-if="unitCodes.length > 0"
                  >
                  </v-select>
                  <v-combobox
                      v-model="selectedPernNumbers"
                      label="Add Employee Pern No."
                      deletable-chips
                      chips
                      multiple
                  ></v-combobox>
                  <div>
                    <p class="text-md-body-2 error--text">Press Enter, to add multiple Pern Nos.</p>
                  </div>
                  <v-btn color="indigo" dark class="float-right"
                         v-show="selectedUnitCodes.length > 0 || selectedPernNumbers.length > 0"
                         @click="stage = 2">confirm</v-btn>
                  <div v-if="unitCodes.length === 0" class="ml-5">
                    Loading UnitCodes Please Wait
                    <v-progress-circular
                        indeterminate
                        :size="30"
                        color="primary"
                        class="ml-4"
                    ></v-progress-circular>
                  </div>
                </v-col>
              </v-row>
            </v-container>
            <v-container fluid fill-height v-show="stage === 2">
              <v-row>
                <v-col class="pa-5">
                  <div>
                    <v-alert dense type="warning" v-show="interestRate > 1">
                      {{interestRate}} is the current interest rate, for financial year {{financialYear}}.
                    </v-alert>
                    <v-alert dense type="error" v-show="interestRate < 1">
                      There is no active interest rate for current financial year {{financialYear}}, please contact admin.
                    </v-alert>
                  </div>
                  <div v-show="selectedUnitCodes.length > 0">
                    <h5>Selected UnitCodes</h5>
                    <v-chip
                        class="ma-2"
                        color="primary"
                        v-for="unitCode in selectedUnitCodes"
                        :key="unitCode"
                    >
                      {{unitCode}}
                    </v-chip>
                  </div>

                  <div v-show="selectedPernNumbers.length > 0">
                    <h5>Selected Employee Pern Nos.</h5>
                    <v-chip
                        class="ma-2"
                        color="primary"
                        v-for="pern in selectedPernNumbers"
                        :key="pern"
                    >
                      {{pern}}
                    </v-chip>
                  </div>

                  <div class="mb-5">
                    <v-switch
                        v-model="dryRun"
                        inset
                        :label="runMessage"
                    ></v-switch>
                  </div>
                  <v-btn color="indigo" dark @click="stage = 1">Back</v-btn>
                  <v-btn dark color="indigo" class="float-right"
                         :disabled="!(selectedUnitCodes.length !== 0 || selectedPernNumbers.length !== 0 ) || startingJob || interestRate < 1"
                         :loading="startingJob"
                         @click="startJob"
                  >Start</v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <div v-show="downloadingError">
                    <p class="text-md-body-2 error--text">{{errorMessage}}</p>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-show="interestRate < 1">
        <v-alert dense type="error">
          There is no active interest rate for current financial year {{financialYear}}, please contact admin.
        </v-alert>
      </v-col>
      <v-col v-show="interestRate > 1">
        <v-alert dense type="warning">
          {{interestRate}} is the current interest rate, for financial year {{financialYear}}.
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
            :headers="headers"
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
              <v-toolbar-title>YearEnd Process For Settlement Execution History</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  small
                  @click="newJobDialog = true"
              >
                Start
              </v-btn>
              <v-dialog
                  v-model="dialog"
                  max-width="1000px"
              >
                <v-card>
                  <v-card-title>Job Details
                    <v-progress-circular
                        indeterminate
                        :size="30"
                        color="primary"
                        class="ml-4"
                        v-show="jobInProgress"
                    ></v-progress-circular>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" small @click="generateReport" :loading="downloading">Generate Report</v-btn>

                  </v-card-title>

                  <div class="pa-5" v-show="jobDetails !== null && jobDetails.dryRun">
                    <v-alert dense type="warning">
                      This was a DryRun and the interests calculated were not published to employee accounts.
                    </v-alert>
                  </div>

                  <div class="pa-5" v-show="jobDetails !== null && jobDetails.dryRun !== null && !jobDetails.dryRun">
                    <v-alert dense type="warning">
                      This was not a DryRun and the interests calculated were published to employee accounts.
                    </v-alert>
                  </div>

                  <v-data-table
                      v-if="jobDetails !== null"
                      :headers="jobDetailHeaders"
                      :items="jobDetails.jobDetailsList"
                      :items-per-page="10"
                      class="elevation-1"
                      :loading="loading"
                      loading-text="Loading... Please wait"
                  >
                  </v-data-table>

                  <div v-show="downloadingError">
                    <p class="text-md-body-2 error--text">{{errorMessage}}</p>
                  </div>

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

import fileDownload from "js-file-download";

export default {
  name: "YearEndProcessForLoan",
  data () {
    return {
      loading: false,
      startingJob: false,
      dialog: false,
      newJobDialog: false,
      jobInProgress: false,
      headers: [
        {
          text: 'Job',
          align: 'start',
          sortable: true,
          value: 'name',
        },
        { text: 'Started At', sortable: true, value: 'startedAt' },
        { text: 'Completed At', sortable: true, value: 'completedAt' },
        { text: 'Status', sortable: true, value: 'status' },
        {text: 'Is DryRun', sortable: false, value: 'dryRun'},
        { text: 'Duration(Sec)', sortable: true, value: 'duration' },
        { text: 'Action', sortable: false, value: 'actions' },
      ],
      jobDetailHeaders: [
        {text: 'Run Id', align: 'start', sortable: true, value: 'unitCode'},
        {text: 'Started At', sortable: true, value: 'startedAt'},
        {text: 'Completed At', sortable: true, value: 'completedAt'},
        {text: 'Duration', sortable: true, value: 'duration'},
        {text: 'Status', sortable: true, value: 'status'},
        {text: 'Total', sortable: true, value: 'total'},
        {text: 'Success', sortable: true, value: 'success'},
        {text: 'Failed', sortable: true, value: 'failed'},
      ],

      jobDetails: null,
      jobDetailsParams: null,
      items: [],
      selectedUnitCodes: [],
      selectedPernNumbers: [],
      interval: null,
      dryRun: true,
      downloading: false,
      stage: 1,
      downloadingError: false,
      errorMessage: null
    }
  },
  computed: {
    jobs () {
      return this.$store.state.yearEndModule.jobs
    },
    unitCodes () {
      return this.$store.state.yearEndModule.unitCodes.map(code => code.unitCode)
    },
    interestRate() {
      return this.$store.state.yearEndModule.interestRate
    },
    financialYear() {
      return this.$store.state.yearEndModule.financialYear
    },
    runMessage() {
      if(this.dryRun){
        return "Execute a Dry Run/Calculated interests will not be published."
      }
      return "Not a Dry Run/Calculated interests will be published immediately."
    },
  },
  methods: {
    showDetails(details) {
      this.jobDetails = details
      this.dialog = true
      this.jobInProgress = details.status === 'started'
      this.jobDetailsParams = JSON.parse(this.jobDetails.params);
    },
    getJobs() {
      this.$store.dispatch("yearEndModule/fetchJobs", "settlement")
          .then(response => {
            console.log(response)
            this.loading = false;
          })
          .catch(error => {
            this.downloadingError = true
            this.errorMessage = error
          })
    },
    startJob() {
      this.startingJob = true

      let data = {
        "params": JSON.stringify({
          "unitcodes": this.selectedUnitCodes,
          "isDryRun": this.dryRun,
          "pernNumbers": this.selectedPernNumbers,
        }),
        path: "settlement"
      }

      this.$store.dispatch("yearEndModule/startYearEndJob", data)
          .then(response => {
            console.log(response)
            this.startingJob = false
            this.newJobDialog = false
            this.getJobs()
          })
          .catch(error => {
            this.downloadingError = true
            this.errorMessage = error
          })
    },
    generateReport() {

      this.downloading = true

      let data = {
        "params": JSON.stringify({
          "jobId": this.jobDetails.entityId,
        })
      }

      this.$store.dispatch("yearEndModule/startReportJob", data)
          .then(response => {
            this.trackJobForDownload(response.entityId)
          })
          .catch(error => {
            console.log(error)
            this.downloading = false
            this.downloadingError = true
            this.errorMessage = error
          })

    },
    trackJobForDownload(jobId){
      let track = setInterval(() => this.trackJob(jobId, track), 5000)
    },
    trackJob(jobId, track) {
      this.$store.dispatch("yearEndModule/fetchJobDetails", jobId)
          .then(response => {
            if(response.status === "completed"){
              clearInterval(track)
              this.download(response.fileName)
            }
          })
          .catch(error => {
            console.log(error)
            this.downloading = false
            this.downloadingError = true
            clearInterval(track)
          })
    },
    download(fileName){
      this.$store.dispatch("yearEndModule/downloadYearEndReport", fileName)
          .then(response => {
            fileDownload(response.data, fileName)
            this.downloading = false
            this.selectedUnitCodes = []
            this.dryRun = true
          })
          .catch(error => {
            this.downloadingError = true
            this.errorMessage = error
          })
    },
  },
  watch: {
    jobs() {
      if(this.jobDetails !== null){
        let job = this.jobs.filter(job => job.entityId === this.jobDetails.entityId)
        if(job.length > 0){
          this.jobDetails = job[0]
          this.jobInProgress = this.jobDetails.status === 'started'
        }
      }
    },
  },
  mounted() {

    this.loading = true
    this.getJobs()

    this.interval = setInterval(() => {
      this.loading = true
      this.getJobs()
    }, (30*1000))

    if(this.unitCodes.length < 1){
      this.$store.dispatch("yearEndModule/fetchCommons")
          .then(response => console.log(response))
          .catch(error => console.log(error))
    }
  },
  beforeDestroy() {
    clearInterval(this.interval)
  }
}
</script>

<style scoped>

</style>