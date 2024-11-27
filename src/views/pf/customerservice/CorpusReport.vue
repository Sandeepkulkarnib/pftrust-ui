<template>
    <v-container>
        <v-row>
            <v-col>
                <v-toolbar flat>
                    <v-toolbar-title>Corpus Report</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </v-col>
            <v-spacer></v-spacer>
        </v-row>
        <v-row class="ma-0 pa-0">
            <v-col cols="3">
                <v-select :items="establishmentCodes" item-value="code" item-text="code" label="Select Establishment"
                    v-model="selectedEstablishmentCode" v-on:change="buttonDisplay = true" dense></v-select>
            </v-col>
            <v-col class="me-2" cols="2" v-if="this.buttonDisplay">
                <v-btn color="primary" density="compact" v-on:click="getCorpusReport">generate report</v-btn>
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
                <v-toolbar-title>Corpus Report Jobs Execution History</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-btn small dark
                     :color="item.status === 'completed' ? 'success' : 'indigo'"
                     :loading="item.status === 'started'"
                     @click="downloadReport(item)"
              >
                {{item.status === 'completed' ? "Download Report" : "Generating"}}
              </v-btn>
            </template>

          </v-data-table>
        </v-col>
      </v-row>

    </v-container>
</template>
  
<script>
import { isNotEmpty, isNumber } from "@/util/rules";
import fileDownload from "js-file-download";

export default {
    name: "CorpusSummary",
    data() {
        return {
          dis: false,
          buttonDisplay: false,
          selectedEstablishmentCode: null,
          rules: {
              pfNumberRules: [
                  v => isNotEmpty(v, "PF No. is Required"),
                  v => isNumber(v, "Please Enter Valid PF Number")
              ]
          },
          establishmentCodes: [],
          loading: false,
          startingJob: false,
          jobType: "fetch_employees_job",
          dialog: false,
          newJobDialog: false,
          jobInProgress: false,
          jobs: [],
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
    methods: {
      showDetails(details) {
        this.jobDetails = details
        this.dialog = true
        this.jobInProgress = details.status === 'started'
      },
      validate() {
          this.$refs.form.validate()
          if (this.$refs.form.validate()) {
              this.save()
          }
      },
      getCorpusReport() {
          let job = {
            "type": this.jobType,
            "params": this.selectedEstablishmentCode
          }
          this.$store.dispatch("CustomerModule/startCorpusReportJob", job)
              .then(response => {
                this.trackJobForDownload(response.entityId)
                this.getJobs()
              })
              .catch(error => {
                  console.log(error)
              })
      },
      getJobs() {
        this.$store.dispatch("CustomerModule/getCorpusReportJobs")
            .then(response => {
              this.jobs = response
            })
            .catch(error => console.log(error))
      },
      getEstablishmentCodes(){
        this.$store.dispatch("CustomerModule/getEstablishmentCodes")
            .then(response => {
              this.establishmentCodes = response
            })
            .catch(error => console.log(error))
      },
      downloadReport(item){
        this.$store.dispatch("CustomerModule/downloadReport", item.fileName)
            .then(response => {
              fileDownload(response.data, item.fileName)
            })
            .catch(error => {
              console.log(error)
            })
      },
      trackJobForDownload(jobId){
        let track = setInterval(() => this.trackJob(jobId, track), 5000)
      },
      trackJob(jobId, track) {
        this.$store.dispatch("CustomerModule/fetchJobDetails", jobId)
            .then(response => {
              if(response.status === "completed"){
                clearInterval(track)
                this.getJobs()
              }
            })
            .catch(error => {
              console.log(error)
              this.downloading = false
              this.downloadingError = true
              clearInterval(track)
            })
      },
    },
    mounted() {
      this.getEstablishmentCodes()
      this.getJobs()
    }
}

</script>
  
<style scoped>
a {
    color: #000;
}
</style>