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
              Start a new Fetch Loans Job
              <v-spacer></v-spacer>
              <v-icon
                  dark
                  color="black darken-2"
                  @click.stop="newJobDialog = false"
              >
                mdi-close
              </v-icon>
              <span class="text-md-body-2">Make sure Employees are fetched for the selected unit codes</span>
            </v-card-title>
            <v-container fluid fill-height>
              <v-row >
                <v-col>
                  <v-select
                      v-model="selectedUnitCodes"
                      :items="unitcodes"
                      label="Select UnitCodes to Fetch Loans from"
                      multiple
                      chips
                      deletable-chips
                      v-if="unitcodes.length > 0"
                  >
                    <template v-slot:prepend-item>
                      <v-list-item
                          ripple
                          @mousedown.prevent
                          @click="toggle"
                      >
                        <v-list-item-action>
                          <v-icon :color="selectedUnitCodes.length > 0 ? 'primary' : ''">
                            {{ icon }}
                          </v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title>
                            Select All
                          </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-content>
                          <v-list-item-title>
                            Selected Count({{selectedUnitCodes.length}})
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider class="mt-2"></v-divider>
                    </template>
                  </v-select>
                  <div>
                    <p class="text-md-body-2 error--text">Press Esc, to close Select Box</p>
                  </div>
                  <v-btn dark color="indigo" class="float-right"
                         :disabled="selectedUnitCodes.length === 0 || startingJob"
                         :loading="startingJob"
                          @click="startJob"
                  >Start</v-btn>
                  <div v-if="unitcodes.length === 0" class="ml-5">
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
          </v-card>
        </v-dialog>
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
              <v-toolbar-title>Fetch Loan Jobs Execution History</v-toolbar-title>
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
                  </v-card-title>

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
export default {
  name: "FetchLoanJobView",
  data () {
    return {
      loading: false,
      startingJob: false,
      jobType: "fetch_loan_job",
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
        { text: 'Duration(Sec)', sortable: true, value: 'duration' },
        { text: 'Action', sortable: false, value: 'actions' },
      ],
      jobDetailHeaders: [
        {text: 'Unit Code', align: 'start', sortable: true, value: 'unitCode'},
        {text: 'Started At', sortable: true, value: 'startedAt'},
        {text: 'Completed At', sortable: true, value: 'completedAt'},
        {text: 'Duration', sortable: true, value: 'duration'},
        {text: 'Status', sortable: true, value: 'status'},
        {text: 'Total', sortable: true, value: 'total'},
        {text: 'Success', sortable: true, value: 'success'},
        {text: 'Failed', sortable: true, value: 'failed'},
      ],
      jobDetails: null,
      items: [],
      selectedUnitCodes: [],
      interval: null
    }
  },
  computed: {
    jobs () {
      return this.$store.state.jobModule.jobs
    },
    unitcodes () {
      return this.$store.state.backofficeModule.unitcodes
          .map(code => code.unitCode)
    },
    selectedAllUnitCodes () {
      return this.selectedUnitCodes.length === this.unitcodes.length
    },
    selectedSomeUnitCodes () {
      return this.selectedUnitCodes.length > 0 && !this.selectedAllUnitCodes
    },
    icon () {
      if (this.selectedAllUnitCodes) return 'mdi-close-box'
      if (this.selectedSomeUnitCodes) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    }
  },
  methods: {
    showDetails(details) {
      this.jobDetails = details
      this.dialog = true
      this.jobInProgress = details.status === 'started'
    },
    getJobs() {
      this.$store.dispatch("jobModule/fetchJobs", this.jobType)
          .then(response => {
            console.log(response)
            this.loading = false;
            if(this.$route.query["job-id"]){
              let job = this.jobs.filter(job => job.entityId === this.$route.query["job-id"])

              if(job.length > 0){
                this.jobDetails = job[0]
                this.dialog = true
                this.jobInProgress = this.jobDetails.status === 'started'
              }
            }
          })
          .catch(error => {
            console.log(error)
          })
    },
    startJob() {
      this.startingJob = true

      let data = {
        "type": this.jobType,
        "params": JSON.stringify({
          "unitcodes": this.selectedUnitCodes
        })
      }

      this.$store.dispatch("jobModule/startJob", data)
          .then(response => {
            console.log(response)
            this.startingJob = false
            this.newJobDialog = false
            this.getJobs()
          })
          .catch(error => {
            console.log(error)
          })
    },
    toggle () {
      this.$nextTick(() => {
        if (this.selectedAllUnitCodes) {
          this.selectedUnitCodes = []
        } else {
          this.selectedUnitCodes = this.unitcodes.slice()
        }
      })
    }
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
    }
  },
  mounted() {
      this.loading = true
      this.getJobs()

      this.interval = setInterval(() => {
        this.loading = true
        this.getJobs()
      }, (30*1000))

    if(this.unitcodes.length < 1){
      this.$store.dispatch("backofficeModule/fetchUnitCodes")
          .then(response => {
            console.log(response)
          })
          .catch(error => {
            console.log(error)
          })
    }
  },
  beforeDestroy() {
    console.log("clear interval")
    clearInterval(this.interval)
  }
}
</script>

<style scoped>

</style>