<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
            :headers="headers"
            :items="audits"
            :options.sync="options"
            :server-items-length="totalAudits"
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
              <v-toolbar-title>Search Site Audits</v-toolbar-title>
            </v-toolbar>

          </template>

          <template v-slot:[`item.actions`]="{item}">
            <v-btn small color="primary" @click="download(item.documentPath)">
              Download Document
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
  name: "SearchSiteAudit",
  data () {
    return {
      totalAudits: 0,
      audits: [],
      loading: true,
      options: {
        itemsPerPage: 10,
        page: 1
      },
      headers: [
        {
          text: 'Doc Name',
          align: 'start',
          sortable: false,
          value: 'documentName',
        },
        { text: 'Est Name', sortable: false, value: 'establishmentName' },
        { text: 'Branch Name', sortable: false, value: 'branchName' },
        { text: 'Branch Address', sortable: false, value: 'branchAddress' },
        { text: 'Auditor Name', sortable: false, value: 'auditedByUser' },
        {text: 'Audit Date', sortable: false, value: 'auditDate'},
        {text: 'QR Matched', sortable: false, value: 'qrMatched'},
        {text: 'Actions', sortable: false, value: 'actions'},
      ],
      footerOptions: {
        "items-per-page-options": [10,25,100],
      },
      search: ""
    }
  },
  watch: {
    options: {
      handler () {

        if(parseInt(this.$route.query.size) !== this.options.itemsPerPage
            || parseInt(this.$route.query.page) !== this.options.page){
          this.$router.push({path: this.$route.path, query: {size: this.options.itemsPerPage, page: this.options.page}})
        }

        this.getLoans()
      },
      deep: true,
    }
  },
  methods: {
    getLoans() {
      this.$store.dispatch("siteAuditModule/fetchAudits", {
        size: this.options.itemsPerPage,
        page: this.options.page,
        search: this.search
      })
          .then(response => {
            this.audits = response.content
            this.totalAudits = response.totalElements
            this.loading = false
          })
          .catch(error => {
            console.log(error)
          })
    },
    download(fileName){
      this.$store.dispatch("siteAuditModule/downloadDocument", fileName)
          .then(response => {
            fileDownload(response.data, fileName)
          })
          .catch(error => {
            console.log(error)
          })
    }
  },
  mounted() {
    this.options = {
      itemsPerPage: this.$route.query.size === undefined ? 10 : parseInt(this.$route.query.size),
      page: this.$route.query.page === undefined ? 1 : parseInt(this.$route.query.page)
    }
  }

}




</script>

<style scoped>
  a {
    color: #000
  }
</style>