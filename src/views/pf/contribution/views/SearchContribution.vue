<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
            :headers="headers"
            :items="contributions"
            :options.sync="options"
            :server-items-length="totalContributions"
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
              <v-toolbar-title>Search Contributions</v-toolbar-title>
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
                    Generate Contributions Report
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
                            v-model="selectedReportType"
                            :items="reportType"
                            label="Select Report Type"
                            chips
                        ></v-select>

                        <v-menu
                            :close-on-content-click="false"
                            transition="scale-transition"
                            min-width="auto"
                            v-model="monthMenu"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="monthRangeText"
                                label="Select Month"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                v-show="selectedReportType === 'Monthly'"
                            ></v-text-field>
                          </template>

                          <v-card max-width="300px">
                            <v-toolbar flat v-show="selectYearMonth === 2">
                              <v-btn
                                  class="ma-2"
                                  text
                                  icon
                                  color="black"
                                  @click="selectYearMonth = 1"
                              >
                                <v-icon>mdi-chevron-left</v-icon>
                              </v-btn>
                              <v-toolbar-title class="ymsl ml-5">select year</v-toolbar-title>
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
                                         :text="!(months.indexOf(k) > -1)"
                                         :color="months.indexOf(k) > -1 ? 'success' : 'indigo'"
                                         @click="selectMonth(k)">{{v}}</v-btn>
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
                                label="Select Recovery Date"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                v-show="selectedReportType === 'Recovery Date'"
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
                                  Selected Count ({{selectedUnitCodes.length}})
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
                               small
                               @click="generateReport"
                        >Download</v-btn>

                        <div v-if="unitCodes.length === 0" class="text-body-2">
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

<!--          <template v-slot:[`item.pernNumber`]="{item}">-->
<!--            <a href="#">-->
<!--              {{ item.pernNumber }}-->
<!--            </a>-->
<!--          </template>-->

        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import fileDownload from "js-file-download";

export default {
  name: "SearchContribution",
  data () {
    return {
      totalContributions: 0,
      contributions: [],
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
        { text: 'Recovery Date', sortable: false, value: 'recoveryDate' },
        { text: 'Year', sortable: false, value: 'year' },
        { text: 'Month', sortable: false, value: 'month' },
        { text: 'Member Contr', sortable: false, value: 'memberContribution' },
        { text: 'Company Contr', sortable: false, value: 'companyContribution' },
        { text: 'VPF Contr', sortable: false, value: 'vpfContribution' },
        { text: 'Total Contr', sortable: false, value: 'totalContribution' },
      ],
      footerOptions: {
        "items-per-page-options": [10,25,100],
      },
      search: "",
      dialog: false,
      selectedUnitCodes: [],
      interval: null,
      reportType: ["Monthly", "Recovery Date"],
      selectedReportType: "Monthly",
      menu: false,
      dates: [],
      downloading: false,
      downloadingError: false,
      selectedContributionStatusList: [],
      months: [],
      monthMenu: false,
      selectedYear: null,
      selectYearMonth: 1,
    }
  },
  watch: {
    options: {
      handler () {

        if(parseInt(this.$route.query.size) !== this.options.itemsPerPage
            || parseInt(this.$route.query.page) !== this.options.page){
          this.$router.push({path: this.$route.path, query: {size: this.options.itemsPerPage, page: this.options.page}})
        }

        this.getContributions()
      },
      deep: true,
    },
    search() {
      if(this.search !== null && this.search !== undefined && (this.search.trim().length > 3 || this.search.trim().length === 0)){
        this.getContributions()
      }
    }
  },
  methods: {
    getContributions() {
      this.$store.dispatch("contributionModule/fetchContributions", {
        size: this.options.itemsPerPage,
        page: this.options.page,
        search: this.search
      })
          .then(response => {
            this.contributions = response.content
            this.totalContributions = response.totalElements
            this.loading = false
          })
          .catch(error => {
            console.log(error)
          })
    },
    download(fileName){
      this.$store.dispatch("contributionModule/downloadEmployeeReport", fileName)
          .then(response => {
            fileDownload(response.data, fileName)
            this.downloading = false
            this.dialog = false
            this.selectedUnitCodes = []
            this.dates = []
            this.selectedContributionStatusList = []
            this.months = []
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
          "reportType": this.selectedReportType,
          "dates": this.dates,
          "months": this.months,
          "year": this.selectedYear
        })
      }

      this.$store.dispatch("contributionModule/startReportJob", data)
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
      this.$store.dispatch("contributionModule/fetchJobDetails", jobId)
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
    selectYear(year){
      this.selectedYear = year
      this.selectYearMonth = 2
    },
    selectMonth(month){
      let index = this.months.indexOf(month)
      if(index > -1){
        this.months.splice(index, 1);
      }else {
        this.months.push(month)
      }
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
      return this.$store.state.contributionModule.unitCodes.map(code => code.unitCode)
    },
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
    contributionStatusList() {
      return this.$store.state.contributionModule.contributionStatusList
    },
    monthRangeText () {
      return this.months.map(month => {
        let split = month.split("-")
        return `${this.selectedYear}-${split[0]}`
      }).join(' ~ ')
    },
    years() {
      return this.$store.state.contributionModule.years
    },
    financialMonths() {
      return this.$store.state.contributionModule.months
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
      this.$store.dispatch("contributionModule/fetchCommons")
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
  .ymsl {
    font-size: 16px !important;
    text-align: center !important;
  }
</style>