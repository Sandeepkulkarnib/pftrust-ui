<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
            :headers="headers"
            :items="settlements"
            :options.sync="options"
            :server-items-length="totalSettlements"
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
              <v-toolbar-title>Search Settlements</v-toolbar-title>
              <v-text-field
                  hide-details
                  single-line
                  placeholder="search"
                  class="ml-4"
                  v-model="search"
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  small
                  @click="dialog = true"
              >
                Export Report
              </v-btn>

              <v-dialog
                  v-model="dialog"
                  max-width="500px"
                  :persistent="downloading"
              >
                <v-card>
                  <v-card-title>
                    Generate Settlement Report
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

                        <v-select
                            v-model="selectedDateType"
                            :items="dateType"
                            label="Select Date Type"
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
                                         :text="!(months.indexOf(parseInt(k)) > -1)"
                                         :color="months.indexOf(parseInt(k)) > -1 ? 'success' : 'indigo'"
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
                                label="Select Date"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                v-show="selectedReportType === 'Date Wise'"
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
                            v-model="selectedSettlementTypes"
                            :items="types"
                            label="Select Settlement Types"
                            item-text="type"
                            item-value="entityId"
                            multiple
                            chips
                            deletable-chips
                        >
                          <template v-slot:prepend-item>
                            <v-list-item
                                ripple
                                @mousedown.prevent
                                @click="toggle1"
                            >
                              <v-list-item-action>
                                <v-icon :color="selectedSettlementTypes.length > 0 ? 'primary' : ''">
                                  {{ iconSettlementTypes }}
                                </v-icon>
                              </v-list-item-action>
                              <v-list-item-content>
                                <v-list-item-title>
                                  Select All
                                </v-list-item-title>
                              </v-list-item-content>
                              <v-list-item-content>
                                <v-list-item-title>
                                  Selected Count({{selectedSettlementTypes.length}})
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-divider class="mt-2"></v-divider>
                          </template>
                        </v-select>

                        <v-select
                            v-model="selectedSettlementStatus"
                            :items="statusList"
                            item-text="status"
                            item-value="entityId"
                            label="Select Status Status"
                            multiple
                            chips
                            deletable-chips
                        >
                        </v-select>

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

          <template v-slot:[`item.actions`]="{item}">
            <v-btn small color="primary" :to="'settlements/details/' + item.entityId">
              view
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
  name: "SearchSettlement",
  data () {
    return {
      totalSettlements: 0,
      settlements: [],
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
        { text: 'Name', sortable: false, value: 'name' },
        { text: 'Unit Code', sortable: false, value: 'unitCode' },
        { text: 'Payment Date', sortable: false, value: 'paymentDate' },
        { text: 'Status', sortable: false, value: 'status' },
        {text: 'Actions', sortable: false, value: 'actions'}
      ],
      footerOptions: {
        "items-per-page-options": [10,25,100],
      },
      search: "",
      dialog: false,
      selectedUnitCodes: [],
      interval: null,
      reportType: ["Monthly", "Date Wise"],
      selectedReportType: "Monthly",
      menu: false,
      dates: [],
      downloading: false,
      downloadingError: false,
      months: [],
      monthMenu: false,
      selectedYear: null,
      selectYearMonth: 1,
      dateType: ["Created Date", "Updated Date", "Cessation Date", "Due Date", "Bank Payment Date"],
      selectedDateType: "Created Date",
      selectedSettlementTypes: [],
      selectedSettlementStatus: [],
      firstSelectedMonth: -1,
      lastSelectedMonth: -1
    }
  },
  watch: {
    options: {
      handler () {

        if(parseInt(this.$route.query.size) !== this.options.itemsPerPage
            || parseInt(this.$route.query.page) !== this.options.page){
          this.$router.push({path: this.$route.path, query: {size: this.options.itemsPerPage, page: this.options.page}})
        }

        this.getSettlements()
      },
      deep: true,
    },
    search() {
      if(this.search !== null && this.search !== undefined && (this.search.trim().length > 3 || this.search.trim().length === 0)){
        this.getSettlements()
      }
    }
  },
  methods: {
    getSettlements() {
      this.$store.dispatch("settlementModule/fetchSettlements", {
        size: this.options.itemsPerPage,
        page: this.options.page,
        search: this.search
      })
          .then(response => {
            this.settlements = response.content
            this.totalSettlements = response.totalElements
            this.loading = false
          })
          .catch(error => {
            console.log(error)
          })
    },
    download(fileName){
      this.$store.dispatch("settlementModule/downloadSettlementReport", fileName)
          .then(response => {
            fileDownload(response.data, fileName)
            this.downloading = false
            this.dialog = false
            this.selectedUnitCodes = []
            this.dates = []
            this.months = []
            this.selectedLoanStatus = []
            this.selectedLoanTypes = []
          })
          .catch(error => {
            console.log(error)
            this.downloading = false
            this.downloadingError = true
          })
    },
    generateReport() {

      this.downloading = true

      console.log("selected settlement Type "+this.selectedSettlementTypes)
      console.log("selected Unit Code "+this.selectedUnitCodes)

      let data = {
        "params": JSON.stringify({
          "unitCodes": this.selectedUnitCodes,
          "reportType": this.selectedReportType,
          "dates": this.dates,
          "months": this.months,
          "year": this.selectedYear,
          "dateType": this.selectedDateType,
          "statusList": this.selectedSettlementStatus,
          "types": this.selectedSettlementTypes
        })
      }

      this.$store.dispatch("settlementModule/startReportJob", data)
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
      this.$store.dispatch("settlementModule/fetchJobDetails", jobId)
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

      if(this.firstSelectedMonth !== -1 && this.lastSelectedMonth !== -1){
        this.firstSelectedMonth = month
        this.months = [month]
        this.lastSelectedMonth = -1
        return
      }

      if(this.firstSelectedMonth !== -1 && month !== this.firstSelectedMonth){
        this.lastSelectedMonth = month
        this.months.push(month)

        let i = Math.min(this.firstSelectedMonth, this.lastSelectedMonth)+1
        let k = Math.max(this.firstSelectedMonth, this.lastSelectedMonth)

        for (; i<k; i++){
          this.months.push(i)
        }
        return;
      }

      this.firstSelectedMonth = month
      this.months = [month]
    },
    toggle () {
      this.$nextTick(() => {
        if (this.selectedAllUnitCodes) {
          this.selectedUnitCodes = []
        } else {
          this.selectedUnitCodes = this.unitCodes.slice()
        }
      })
    },
    toggle1 () {
      this.$nextTick(() => {
        if (this.selectedAllSettlementTypes) {
          this.selectedSettlementTypes = []
          console.log("selected all"+this.selectedAllSettlementTypes)
        } else {
          console.log(" types "+this.types1)
          this.selectedSettlementTypes = this.types1.slice()
          console.log("selected Some"+this.selectedSomeSettlementTypes)
        }
      })
    }
  },
  computed: {
    unitCodes () {
      return this.$store.state.settlementModule.unitCodes.map(code => code.unitCode)
    },
    dateRangeText () {
      return this.dates.map(date => {
        console.log()
        return date.split("-").reverse().join("-")
      }).join(' ~ ')
    },
    monthRangeText () {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      let selected = this.months.sort((a, b) => a-b).map(month => {
        return `${this.financialMonths[month]}`
      }).join(' , ')

      if(selected === null || selected === ""){
        return ""
      }

      return `${this.selectedYear}(${selected})`
    },
    years() {
      return this.$store.state.settlementModule.years
    },
    financialMonths() {
      return this.$store.state.settlementModule.months
    },
    statusList() {
      return this.$store.state.settlementModule.statusList
    },
    types() {
      return this.$store.state.settlementModule.types
    },
    types1 () {
      return this.$store.state.settlementModule.types.map(code => code.entityId)
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
    },
    selectedAllSettlementTypes () {
      return this.selectedSettlementTypes.length === this.types.length
    },
    selectedSomeSettlementTypes () {
      return this.selectedSettlementTypes.length > 0 && !this.selectedAllSettlementTypes
    },
    iconSettlementTypes () {
      if (this.selectedAllSettlementTypes) return 'mdi-close-box'
      if (this.selectedSomeSettlementTypes) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    }
  },
  mounted() {
    this.options = {
      itemsPerPage: this.$route.query.size === undefined ? 10 : parseInt(this.$route.query.size),
      page: this.$route.query.page === undefined ? 1 : parseInt(this.$route.query.page)
    }

    if(this.unitCodes.length < 1){
      this.$store.dispatch("settlementModule/fetchSettlementEssentials")
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