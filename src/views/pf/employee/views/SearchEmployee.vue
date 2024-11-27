<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
            :headers="headers"
            :items="employees"
            :options.sync="options"
            :server-items-length="totalEmployees"
            class="elevation-1"
            :loading="loading"
            loading-text="Loading... Please wait"
            :footer-props="footerOptions"
            key="entityId"
        >
          <template v-slot:top>
            <v-toolbar
                flat
            >
              <v-toolbar-title>Search Employees</v-toolbar-title>
              <v-text-field
                  hide-details
                  single-line
                  placeholder="search"
                  class="ml-4"
                  v-model="search"
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-btn small color="primary" @click="dialog = true">Generate Report</v-btn>

              <v-dialog
                  v-model="dialog"
                  max-width="500px"
                  :persistent="downloading"
              >
                <v-card>
                  <v-card-title>
                    Generate Employee Report
                    <v-spacer></v-spacer>
                    <v-icon
                        small
                        color="black darken-2"
                        @click="dialog = false"
                    >
                      mdi-close
                    </v-icon>
                  </v-card-title>

                  <v-container fluid fill-height>
                    <v-row >
                      <v-col md="10" offset="1">
                        <v-select
                            v-model="selectedContributionStatusList"
                            :items="contributionStatusList"
                            item-text="description"
                            item-value="id"
                            label="Select Employee Status"
                            multiple
                            chips
                            deletable-chips
                            v-if="contributionStatusList.length > 0"
                            value="id"
                        >
                        </v-select>
                        <v-select
                            v-model="selectedDateType"
                            :items="dateType"
                            label="Select Date Type"
                            chips
                        >
                        </v-select>
                        <v-menu
                            ref="menu"
                            v-model="menu"
                            :close-on-content-click="false"
                            :return-value.sync="dates"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="dateRangeText"
                                label="Picker in menu"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                              v-model="dates"
                              no-title
                              scrollable
                              range
                          >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="menu = false"
                            >
                              Cancel
                            </v-btn>
                            <v-btn
                                text
                                color="primary"
                                @click="$refs.menu.save(dates)"
                            >
                              OK
                            </v-btn>
                          </v-date-picker>
                        </v-menu>
                        <v-select
                            v-model="selectedUnitCodes"
                            :items="unitCodes"
                            label="Select UnitCodes"
                            multiple
                            chips
                            deletable-chips
                            v-if="unitCodes.length > 0"
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
                                  Select Count ({{selectedUnitCodes.length}})
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-divider class="mt-2"></v-divider>
                          </template>
                        </v-select>

                        <div>
                          <p class="text-md-body-2 error--text">Press Esc, to close Select Box</p>
                        </div>

                        <div v-show="downloadingError">
                          <p class="text-md-body-2 error--text">Something went wrong, Please try again</p>
                        </div>

                        <v-btn dark color="indigo" class="float-right"
                               :loading="downloading"
                               @click="generateReport"
                               small
                        >Download</v-btn>

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

                </v-card>

              </v-dialog>


            </v-toolbar>
          </template>

          <template v-slot:[`item.pernNumber`]="{item}">


            <v-btn text color="primary"
                   :to="'/employees/details/' + item.entityId">
              {{item.pernNumber}}
            </v-btn>

          </template>

        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import fileDownload from 'js-file-download'

export default {
  name: "SearchEmployee",
  data () {
    return {
      totalEmployees: 0,
      employees: [],
      loading: true,
      options: {
        itemsPerPage: 10,
        page: 1
      },
      headers: [
        {
          text: 'Pernr No.',
          align: 'start',
          sortable: false,
          value: 'pernNumber',
        },
        { text: 'Pf No.', sortable: false, value: 'pfNumber' },
        { text: 'Token No', sortable: false, value: 'tokenNumber' },
        { text: 'Name', sortable: false, value: 'name' },
        { text: 'UnitCode', sortable: false, value: 'unitCode' },
        { text: 'Status', sortable: false, value: 'status' },
        { text: 'DOB', sortable: false, value: 'dateOfBirth' },
        { text: 'DOJ', sortable: false, value: 'dateOfJoining' },
        { text: 'DOJ Pf', sortable: false, value: 'dateOfJoiningPF' },
      ],
      footerOptions: {
        "items-per-page-options": [10,25,100],
      },
      search: "",
      dialog: false,
      selectedUnitCodes: [],
      interval: null,
      dateType: ["Date of Joining PF", "Date of Joining Service"],
      selectedDateType: "Date of Joining PF",
      menu: false,
      dates: [],
      downloading: false,
      downloadingError: false,
      selectedContributionStatusList: []
    }
  },
  watch: {
    options: {
      handler () {

        if(parseInt(this.$route.query.size) !== this.options.itemsPerPage
            || parseInt(this.$route.query.page) !== this.options.page){
          this.$router.push({path: this.$route.path, query: {size: this.options.itemsPerPage, page: this.options.page}})
        }

        this.getEmployees()
      },
      deep: true,
    },
    search() {
      if(this.search !== null && this.search !== undefined && (this.search.trim().length > 0 || this.search.trim().length === 0)){
        this.getEmployees()
      }
    }
  },
  methods: {
    getEmployees() {
      this.$store.dispatch("employeeModule/fetchEmployees", {
        size: this.options.itemsPerPage,
        page: this.options.page,
        search: this.search
      })
      .then(response => {
        this.employees = response.content
        this.totalEmployees = response.totalElements
        this.loading = false
      })
      .catch(error => {
        console.log(error)
      })
    },
    download(fileName){
      this.$store.dispatch("employeeModule/downloadEmployeeReport", fileName)
          .then(response => {
            fileDownload(response.data, fileName)
            this.downloading = false
            this.dialog = false
            this.selectedUnitCodes = []
            this.dates = []
            this.selectedContributionStatusList = []
          })
          .catch(error => {
            console.log(error)
          })
    },
    generateReport() {

      this.downloading = true

      let data = {
        "params": JSON.stringify({
          "unitCodes": this.selectedUnitCodes,
          "dateType": this.selectedDateType,
          "dates": this.dates,
          "contributionStatusList": this.selectedContributionStatusList
        })
      }

      this.$store.dispatch("employeeModule/startReportJob", data)
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
  computed: {
    unitCodes () {
      return this.$store.state.employeeModule.unitCodes.map(code => code.unitCode)
    },
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
    contributionStatusList() {
      return this.$store.state.employeeModule.contributionStatusList
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
  mounted() {
    this.options = {
      itemsPerPage: this.$route.query.size === undefined ? 10 : parseInt(this.$route.query.size),
      page: this.$route.query.page === undefined ? 1 : parseInt(this.$route.query.page)
    }

    if(this.unitCodes.length < 1){
      this.$store.dispatch("employeeModule/fetchCommons")
          .then(response => console.log(response))
          .catch(error => console.log(error))
    }

  }

}




</script>

<style scoped>
  a {
    color: #000;
  }
</style>