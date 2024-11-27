<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col>
        <v-toolbar flat>
          <v-toolbar-title>Hire New Employees</v-toolbar-title>
          <v-btn small color="indigo" class="ml-5" dark
                 @click="downloadEmployeeHiringTemplate">Download Template</v-btn>
          <v-spacer></v-spacer>
          <v-file-input
              show-size
              label="Select Data File"
              @change="loanData"
          ></v-file-input>

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

          <v-dialog
              v-model="employeeDetailsDialog"
              max-width="1000px"
          >
            <v-card>
              <v-card-title>Employee Details</v-card-title>
              <v-simple-table
                  fixed-header
                  height="300px"
                  v-if="employeeForDetails !== null"
              >
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th class="text-left">
                      Employee Profile Property
                    </th>
                    <th class="text-left">
                      Value
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                      v-for="(value, key) in employeeDetails"
                      :key="key"
                  >
                    <td>{{ key }}</td>
                    <td>{{ value }}</td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>

          </v-dialog>

        </v-toolbar>
      </v-col>
    </v-row>
    <v-row v-show="Object.keys(errors).length > 0">
      <v-col v-for="(error, key) in errors" :key="key" cols="4">
        <p class="text-body-2">
          <v-chip
              :color="error.color"
              dark
          >

          </v-chip>
          {{error.message}}</p>
      </v-col>
    </v-row>
    <v-row v-show="employees.length > 0 && Object.keys(errors).length < 1">
      <v-col>
        <p class="text-body-2">Data Processing Completed Successfully,
          {{employees.length}} New Employees can be hired. Click on below button to complete the hiring process.</p>
        <v-btn color="success" dark @click="startJob">Hire Employees</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
            :headers="headers"
            :items="sortedEmployees"
            class="elevation-1"
            key="S.NO."
            :loading="loading"
            loading-text="Please wait while we are processing the data"
        >
          <template v-slot: [`item.S.NO.`]="{ item }">
            <v-chip
                :color="item.color"
                dark
                @click="showDetails(item)"
            >
              {{ item["S.NO."] }}
            </v-chip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as XLSX from 'xlsx'
import fileDownload from "js-file-download";

export default {
  name: "HireEmployee",
  data () {
    return {
      loading: false,
      startingJob: false,
      jobType: "hire_new_employees_job",
      dialog: false,
      interval: null,
      totalEmployees: 0,
      employees: [],
      errors: [],
      employeeDetailsDialog: false,
      employeeForDetails: null,
      headers: [
        {
          text: 'Sr No.',
          align: 'start',
          sortable: false,
          value: 'S.NO.',
        },
        { text: 'Provident Fund', sortable: false, value: 'Provident Fund' },
        { text: 'Employee No (PERN NUMBER)', sortable: false, value: 'Employee No (PERN NUMBER)' },
        { text: 'Employee Name', sortable: false, value: 'Employee Name' },
        { text: 'Token Number', sortable: false, value: 'Token Number' },
        { text: 'Unit Code', sortable: false, value: 'Unit Code' },
        { text: 'DOB', sortable: false, value: 'DOB' },
        { text: 'DOJ PF TRUST', sortable: false, value: 'DOJ PF TRUST' },
        { text: 'DOJ SERVICE', sortable: false, value: 'DOJ SERVICE' },
      ],
      data: null,
      jobInProgress: false,
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
      jobId: null
    }
  },
  watch: {

  },
  methods: {
    loanData(files){

      if(files === null || files === undefined){
        this.employees = []
        this.errors = []
        return;
      }

      this.loading = true;

      files.arrayBuffer()
          .then(data => {
            let workBook = XLSX.read(data, { type: 'binary', cellText: false, cellDates: true });

            let workSheet = workBook.Sheets[workBook.SheetNames[0]];

            let json = XLSX.utils.sheet_to_json(workSheet,
                { header: 0, raw: false, dateNF: 'dd-mm-yyyy' });

            this.data = json

            this.$store.dispatch("employeeModule/validateNewEmployees", {
              "data": json
            })
            .then(response => {
              console.log(response)
              this.employees = response.data
              this.errors = response.errors
              this.loading = false
            })
            .catch(error => {
              console.log(error)
            })

          })
          .catch(error => {
            console.log(error)
          })

    },
    isValid(item){
      return item.isValidUnitCode && item.isValidPernNumber && item.isValidPfNumber && item.isValidTokenNumber
    },
    startJob() {
      this.loading = true
      this.$store.dispatch("employeeModule/hireNewEmployees", {
        "data": this.data
      })
      .then(response => {
        this.jobId = response.entityId
        this.getJobDetails()
        this.dialog = true
        this.interval = setInterval(() => {
          this.getJobDetails()
        }, (1000))
        this.loading = false
      })
      .catch(error => {
        console.log(error)
      })
    },
    getJobDetails() {
      this.$store.dispatch("employeeModule/fetchJobDetails", this.jobId)
      .then(response => {
        this.jobDetails = response
        this.jobInProgress = response.status === 'started'
        if(!this.jobInProgress){
          clearInterval(this.interval)
          this.errors = []
          this.employees = []
        }
      })
      .catch(error => {
        console.log(error)
      })
    },
    showDetails(employee){
      this.employeeForDetails = employee
      this.employeeDetailsDialog = true
    },
    downloadEmployeeHiringTemplate(){
      this.$store.dispatch("employeeModule/downloadEmployeeHiringTemplate")
          .then(response => {
            fileDownload(response.data, "New-Employee-Hiring-Template.xlsx")
          })
          .catch(error => {
            console.log(error)
          })
    },
  },
  computed: {
    sortedEmployees () {
      if(this.employees.length === 0){
        return [];
      }

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.employees.sort((a, b) => {
        if(!this.isValid(a)){
          return -1
        }else if(!this.isValid(b)) {
          return +1
        }
        return 0
      })
    },
    employeeDetails(){
      let exclude = ["S.NO.", "color"]
      let newObj = {}
      Object.keys(this.employeeForDetails).forEach((item) => {
        if(!exclude.includes(item)){
          newObj[item] = this.employeeForDetails[item]
        }
      })
      return newObj;
    }
  },
  beforeDestroy() {
    if(this.interval !== null){
      clearInterval(this.interval)
    }
  }
}

</script>

<style scoped>
  .note {
    font-size: 12px;
  }
</style>