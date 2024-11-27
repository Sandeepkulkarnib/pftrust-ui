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
              Start a new Monthly Status Process Job
              <v-spacer></v-spacer>
              <v-icon
                  dark
                  color="black darken-2"
                  @click.stop="newJobDialog = false"
              >
                mdi-close
              </v-icon>
              <span class="text-md-body-2">Make sure all the contributions are fetched for current month</span>

            </v-card-title>
            <v-container fluid fill-height v-show="stage === 1">
              <v-row >
                <v-col>
                  <v-select
                      id="unit"
                      v-model="selectedUnitCodes"
                      :items="unitCodes"
                      label="Select UnitCodes"
                      multiple
                      chips
                      deletable-chips
                      v-if="unitCodes.length > 0"
                      :menu-props="{
                        closeOnClick: false,
                        closeOnContentClick: false
                      }"
                  >
                    <template v-slot:prepend-item>
                      <v-list-item
                          v-model="selectedUnitCodes"
                          ripple

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
                            Selected Count ({{selectedUnitCodes.length}})
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider class="mt-2"></v-divider>
                    </template>
                  </v-select>

                  <v-menu
                      :close-on-content-click="false"
                      transition="scale-transition"
                      min-width="auto"
                      v-model="monthMenu"
                      top
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                          v-model="monthRangeText"
                          label="Select Year and Month"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                      ></v-text-field>
                    </template>

                    <v-card max-width="300px">
                      <v-toolbar flat v-show="selectYearMonth === 2">
                        <v-btn
                            class="ma-2"
                            text
                            icon
                            color="black"
                            v-show="years.length > 1"
                            @click="selectYearMonth = 1"
                        >
                          <v-icon>mdi-chevron-left</v-icon>
                        </v-btn>
                        <v-toolbar-title class="ymsl ml-5">{{this.selectedYear}}</v-toolbar-title>
                      </v-toolbar>
                      <v-container v-show="selectYearMonth === 1">
                        <v-row>
                          <v-col cols="4" v-for="year in years" :key="year">
                            <v-btn depressed :text="selectedYear !== year"
                                   :color="selectedYear === year ? 'success' : 'indigo'"
                                   @click="selectYear(year)">{{ year }}</v-btn>
                          </v-col>
                        </v-row>
                      </v-container>
                      <v-container v-show="selectYearMonth === 2">
                        <v-row>
                          <v-col cols="4" v-for="(v, k) in financialMonths"
                                 class="text-body-2"
                                 :key="v">
                            <v-btn depressed
                                   :text="month === null || month !== parseInt(k)"
                                   :color="month === parseInt(k) ? 'success' : 'indigo'"
                                   @click="selectMonth(parseInt(k))">{{v}}</v-btn>
                          </v-col>
                        </v-row>
                      </v-container>
                      <v-card-actions v-show="selectYearMonth === 2">
                        <v-spacer></v-spacer>
                        <v-btn
                            text
                            color="primary"
                            @click="monthMenu = false"
                        >
                          OK
                        </v-btn>
                      </v-card-actions>
                    </v-card>

                  </v-menu>
                  <div>
                    <p class="text-md-body-2 error--text">Press Esc, to close Select Box</p>
                  </div>
                  <v-btn color="indigo" dark class="float-right"
                         v-show="selectedUnitCodes.length > 0 && selectedYear !== null && month !== null"
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
                  <div>
                    <h5>Selected Year and Month</h5>
                    <v-chip
                        class="ma-2"
                        color="primary"
                    >
                      {{selectedYear}}
                    </v-chip>
                    <v-chip
                        class="ma-2"
                        color="primary"
                    >
                      {{monthLabel}}
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
                         :disabled="selectedUnitCodes.length === 0 || startingJob"
                         :loading="startingJob"
                         @click="startJob"
                  >Start</v-btn>
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
              <v-toolbar-title>Monthly Status Process Execution History</v-toolbar-title>
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
import fileDownload from "js-file-download";

export default {
  name: "MonthlyStatusProcess",
  data () {
    return {
      loading: false,
      startingJob: false,
      jobType: "fetch_employees_job",
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
      items: [],
      selectedUnitCodes: [],
      interval: null,
      dryRun: true,
      downloading: false,
      month: null,
      monthMenu: false,
      selectedYear: null,
      selectYearMonth: 1,
      firstSelectedMonth: -1,
      lastSelectedMonth: -1,
      stage: 1
    }
  },
  computed: {
    jobs () {
      return this.$store.state.employeeModule.monthlyStatusProcessJobs
    },
    unitCodes () {
      return this.$store.state.employeeModule.unitCodes.map(code => code.unitCode)
    },
    years() {
      console.log(this.$store.state.employeeModule.years)

      var yearCopy = [...this.$store.state.employeeModule.years]

      var finYear=[];
      var year1;
      var year2;
      for(let i=0;i<yearCopy.length;i++){

        year1=yearCopy[i].toString().slice(-2)-1;
        year2=yearCopy[i].toString().slice(-2);

        finYear.push('FY'+year1+"-"+year2)
      }

      // return this.$store.state.employeeModule.years;
      return finYear;
    },
    financialMonths() {
      return this.$store.state.employeeModule.months;
    },
    runMessage() {
      if(this.dryRun){
        return "Execute a Dry Run/Status of the Employees will not be changed."
      }
      return "Not a Dry Run/Status of employees will be published immediately."
    },
    monthRangeText () {
      return `${this.selectedYear === null ? "" : this.selectedYear}(${this.month === null ? "" : this.month})`
    },
    monthLabel(){
      return this.financialMonths[this.month]
    },
    selectedAllUnitCodes () {
      return this.selectedUnitCodes.length === this.unitCodes.length
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
      this.$store.dispatch("employeeModule/fetchMonthlyStatusProcessJobs", this.jobType)
          .then(response => {
            console.log(response)
            this.loading = false;
          })
          .catch(error => {
            console.log(error)
          })
    },
    startJob() {
      this.startingJob = true

      var year=Number(this.selectedYear.toString().slice(-2))
      year+=2000;

      console.log("this is slice"+ year)
      let data = {
        "params": JSON.stringify({
          "unitcodes": this.selectedUnitCodes,
          "isDryRun": this.dryRun,
          "year": year,
          "month": this.month
        })
      }

      this.$store.dispatch("employeeModule/startMonthlyProcessJob", data)
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
    generateReport() {

      this.downloading = true

      let data = {
        "params": JSON.stringify({
          "jobId": this.jobDetails.entityId,
        })
      }

      this.$store.dispatch("employeeModule/startMonthlyStatusReportJob", data)
          .then(response => {
            this.trackJobForDownload(response.entityId)
          })
          .catch(error => {
            console.log(error)
            this.downloading = false
            this.downloadingError = true
          })

    },
    trackJobForDownload(jobId){
      let track = setInterval(() => this.trackJob(jobId, track), 5000)
    },
    trackJob(jobId, track) {
      this.$store.dispatch("employeeModule/fetchJobDetails", jobId)
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
      this.$store.dispatch("employeeModule/downloadEmployeeReport", fileName)
          .then(response => {
            fileDownload(response.data, fileName)
            this.downloading = false
            this.selectedUnitCodes = []
            this.dryRun = true
          })
          .catch(error => {
            console.log(error)
          })
    },
    selectYear(year){
      this.selectedYear = year
      this.selectYearMonth = 2
    },
    selectMonth(month){
      this.month = month
    },
    toggle () {
      this.$nextTick(() => {
        if (this.selectedAllUnitCodes) {
          this.selectedUnitCodes = []
        } else {
          this.selectedUnitCodes = this.unitCodes.slice()
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
    },
    years() {
      if(this.years.length === 1){
        this.selectedYear = this.years[0]
        this.selectYearMonth = 2
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

    if(this.unitCodes.length < 1){
      this.$store.dispatch("employeeModule/fetchCommons")
          .then(response => console.log(response))
          .catch(error => console.log(error))
    }
  },
  beforeDestroy() {

  }
}
</script>

<style scoped>

</style>