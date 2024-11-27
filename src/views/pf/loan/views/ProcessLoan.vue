<template>
  <v-row justify="center">
    <v-col>
      <v-dialog
          v-model="propModel"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar color="primary" dark flat>
            <v-btn icon small @click="propModel = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Process New Loan Applications</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn small color="indigo" class="ml-5" dark
                   @click="downloadTemplate">Download Template</v-btn>
          </v-toolbar>
          <v-container class="pa-0 ma-0 pt-5">
            <v-row class="pa-0 ma-0">
              <v-col cols="4">
                <v-file-input
                    show-size
                    label="Select Loan Applications File"
                    @change="loanData"
                    @click:clear="loanApplications = []"
                    dense
                ></v-file-input>
              </v-col>
              <v-col cols="4" offset="4">
                <v-btn small color="secondary" @click="processApplications"
                       v-if="isEligibleApplicationsExist">Process Eligible Applications</v-btn>
              </v-col>
            </v-row>
          </v-container>
          <div>
            <v-alert
                dense
                type="error"
                class="mt-5 ml-3 mr-3 text-body-2"
            >
              Please Upload Required Documents for all the Loan Applications
            </v-alert>
          </div>
          <v-data-table
              :headers="headers"
              :items="loanApplications"
              class="elevation-1 mt-10"
              item-key="applicationId"
              :loading="loading"
              loading-text="Please wait while we are processing the Loan Applications"
          >
            <template v-slot:[`item.S.NO.`]="{ item }">
              <v-chip
                  :color="item.status === 'success' ? 'success' : 'error'"
                  dark
                  title="click to view application"
                  style="cursor: pointer"
              >
                {{ item["status"] }}
              </v-chip>
            </template>

            <template v-slot:[`item.actions`]="{item}">
              <div v-if="item.status === 'success'">
                <v-btn x-small color="gray" icon title="view application" class="mr-2"
                       @click="viewApplication(item)">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn x-small color="gray" icon title="upload documents"
                       @click="uploadDocuments(item)">
                  <v-icon v-if="item.uploadedFiles === undefined || item.uploadedFiles === null">mdi-cloud-upload</v-icon>
                  <v-icon v-else color="success" small>mdi-check</v-icon>
                </v-btn>
              </div>
              <span v-else>-</span>
            </template>

          </v-data-table>
        </v-card>
      </v-dialog>
      <application-details :dialog="dialog2"
                           :details="singleLoanApplication"
                           :details-properties="detailsProperties"
                           @update:dialog="closeDetailsDialog"
      >
      </application-details>
      <file-upload-component :dialog="dialog3"
                             :documents="loanDocuments"
                             @update:fileUploadDialog="closeDocumentsDialog"
                             @update:uploaded="setUploadedFiles"
      >
      </file-upload-component>
      <application-progress-component :dialog="dialog4"
                                      :loading="processingApplications"
                                      :applications="processedApplications"
                                      :headers="detailsHeaders"
                                      @update:applicationProgressDialog="closeApplicationProgressDialog"
                                      base-u-r-l="/loans/details/"
      >

      </application-progress-component>
    </v-col>
  </v-row>
</template>

<script>
import * as XLSX from 'xlsx'
import fileDownload from "js-file-download";
import ApplicationDetails from "@/components/custom/ApplicationDetails";
import FileUploadComponent from "@/components/custom/FileUploadComponent";
import ApplicationProgressComponent from "@/components/custom/ApplicationProgressComponent";

export default {
  name: "ProcessLoan",
  components: {ApplicationProgressComponent, FileUploadComponent, ApplicationDetails},
  props: {
    dialog: Boolean
  },
  data () {
    return {
      loading: false,
      startingJob: false,
      jobType: "process_loan_job",
      dialog2: false,
      dialog3: false,
      interval: null,
      totalApplications: 0,
      loanApplications: [],
      errors: [],
      singleLoanApplication: null,
      headers: [
        { text: 'Pern No.', sortable: false, value: 'Pern No' },
        { text: 'Name', sortable: false, value: 'name' },
        { text: 'Loan Type', sortable: false, value: 'appliedLoanType' },
        { text: 'Status', sortable: false, value: 'reason' },
        {text: 'Total Cost', sortable: false, value: 'Total Cost'},
        {text: 'Applying For', sortable: false, value: 'Applying For'},
        {text: 'Eligible Amount', sortable: false, value: 'eligibleLoanAmount.amounts.eligibleAmount'},
        { text: 'Actions', sortable: false, value: 'actions' },
      ],
      detailsProperties: [
          {text: 'Pern No', value: "Pern No"},
          {text: 'PF No', value: "pfNumber"},
          {text: 'Name', value: "name"},
          {text: 'Alternate Mobile No', value: "Alternate Mobile No"},
          {text: 'Alternate Email Id', value: "Alternate Email Id"},
          {text: 'Loan Application Received Date', value: "Loan Application Received Date"},
          {text: 'Loan Type', value: "Loan Type"},
          {text: 'Applied Loan Type', value: "appliedLoanType"},
          {text: 'Total Cost', value: "Total Cost"},
          {text: 'Applying For', value: "Applying For"},
          {text: 'Property Estimated Price', value: "Property Estimated Price"},
          {text: 'Stamp Duty', value: "Stamp Duty"},
          {text: 'Registration', value: "Registration"},
          {text: 'Insurance', value: "Insurance"},
          {text: 'Date of Completion of House', value: "Date of Completion of House"},
          {text: 'Others', value: "Others"},
          {text: 'Total', value: "Total"},
          {text: 'Financial Institute Name', value: "Financial Institute Name"},
          {text: 'Bank Name', value: "Bank Name"},
          {text: 'Bank Branch', value: "Bank Branch"},
          {text: 'Account No', value: "Account No"},
          {text: 'IFSC Code', value: "IFSC Code"},
          {text: 'MICR Code', value: "MICR Code"},
          {text: 'Employee Bank Name', value: "Employee Bank Name"},
          {text: 'Employee Bank Account No', value: "Employee Bank Account No"},
          {text: 'Employee Bank Branch', value: "Employee Bank Branch"},
          {text: 'Employee Bank IFSC Code', value: "Employee Bank IFSC Code"},
          {text: 'Employee Bank MICR Code', value: "Employee Bank MICR Code"},
          {text: 'Application Status', value: "status"},
          {text: 'Reason', value: "reason"}
      ],
      detailsHeaders: [
        {text: 'Pern No.', sortable: false, value: 'pernNumber'},
        {text: 'Name', sortable: false, value: 'name'},
        {text: 'Applied Amount', sortable: false, value: 'appliedAmount'},
        {text: 'Eligible Amount', sortable: false, value: 'loanAmount'},
        {text: 'Remark', sortable: false, value: 'message'},
        {text: 'Status', sortable: false, value: 'status'},
        {text: 'Action', sortable: false, value: 'actions'},
      ],
      dialog4: false,
      processingApplications: false,
      job: null
    }
  },
  watch: {

  },
  computed: {
    loanDocuments(){
      return this.singleLoanApplication === null ? [] : this.singleLoanApplication.loanDocuments
    },
    isEligibleApplicationsExist(){
      return this.loanApplications.filter((application) => application.status === "success").length > 0
    },
    processedApplications(){
      if(this.job === null) {
        return []
      }
      return this.job.processedApplications
    },
    propModel: {
      get () { return this.dialog },
      set (value) { this.$emit('update:dialog', value) },
    },
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

            json.splice(json.length-1, 1);

            this.$store.dispatch("loanModule/checkLoanApplicationEligibility", {
              "applications": json
            })
            .then(res => {
              this.loanApplications = JSON.parse(res);
              this.totalApplications = this.loanApplications.length
              this.loading = false;
            })
            .catch(err => {
              console.log(err)
            })

          })
          .catch(error => {
            console.log(error)
          })

    },
    downloadTemplate(){
      this.$store.dispatch("loanModule/downloadLoanApplicationTemplate", "LoanProcessingTemplate")
        .then(response => {
          fileDownload(response.data, "Template.xlsx")
        })
        .catch(error => {
          console.log(error)
        })
    },
    viewApplication(application){
      this.singleLoanApplication = application
      this.dialog2 = true
    },
    uploadDocuments(application){
      this.singleLoanApplication = application
      this.dialog3 = true
    },
    closeDetailsDialog(value){
      this.dialog2 = value
    },
    closeDocumentsDialog(value){
      this.dialog3 = value
    },
    closeApplicationProgressDialog(value){
      this.dialog4 = value
    },
    setUploadedFiles(files){

      let uploadedFiles = {}

      files.forEach(file => {
        let fileObj = JSON.parse(file)
        uploadedFiles[fileObj["entityId"]] = fileObj
      })

      this.singleLoanApplication["uploadedFiles"] = uploadedFiles

    },
    processApplications(){

      this.processingApplications = true

      let applications = this.loanApplications
          .filter((application) => application.status === "success")
          .map((application) => this.prepareApplication(application))

      this.$store.dispatch("loanModule/processLoanApplications", {
        "params": JSON.stringify({
          "applications": applications
        }),
        "type": "process_loan_applications_job"
      })
      .then(res => {
        this.dialog4 = true
        console.log(res)
        // let interval = setInterval(() => {
        //   this.getStats(res.entityId)
        //   if(this.job !== null && this.job.status === "completed"){
        //     clearInterval(interval)
        //     this.processingApplications = false
        //   }
        // }, 500)

      })
      .catch(err => console.log(err))

    },
    prepareApplication(application){

      let data = {
        "pernNumber": application["Pern No"],
        "altContactNumber": application["Alternate Mobile No"],
        "altEmailId": application["Alternate Email Id"],
        "selectedLoanType": application["loanTypeId"],
        "totalCost": application["Total Cost"],
        "appliedAmount": application["Applying For"],
        "dateOfCompletionOfHouse": application["Date of Completion of House"],
        "propertyEstimatedPrice": application["Property Estimated Price"],
        "stampDuty": application["Stamp Duty"],
        "propertyRegistration": application["Registration"],
        "insurance": application["Insurance"],
        "others": application["Others"],
        "total": application["Total"],
        "financialInstituteName": application["Financial Institute Name"],
        "repaymentBank": application["Bank Name"],
        "repaymentBankBranch": application["Bank Branch"],
        "repaymentBankAccountNumber": application["Account No"],
        "repaymentBankIfscCode": application["IFSC Code"],
        "repaymentBankMicrCode": application["MICR Code"],
        "employeeBank": application["Employee Bank Name"],
        "employeeAccountNumber": application["Employee Bank Account No"],
        "employeeBankBranch": application["Employee Bank Branch"],
        "employeeBankIfscCode": application["Employee Bank IFSC Code"],
        "employeeBankMicrCode": application["Employee Bank MICR Code"],
        "loanApplicationReceivedDate": application["Loan Application Received Date"]
      }

      data["documents"] = Object.values(application.uploadedFiles)

      return data

    },
    getStats(jobId){

      this.$store.dispatch("loanModule/getProcessLoanApplicationsJobStatus", jobId)
        .then(res => {
          this.job = JSON.parse(res)
        })
        .catch(err => {
          console.log(err)
        })

    }

  },
}

</script>
