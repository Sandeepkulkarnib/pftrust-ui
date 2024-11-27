<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
            :headers="headers"
            :items="logs"
            :options.sync="options"
            :server-items-length="totalLogs"
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
              <v-toolbar-title>Activity Logs</v-toolbar-title>
              <v-text-field
                  hide-details
                  single-line
                  placeholder="search"
                  class="ml-4"
                  v-model="search"
              ></v-text-field>

            </v-toolbar>
          </template>

        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "SearchLog",
  data() {
    return {
      headers: [
        { text: 'Trace ID', sortable: false, value: 'traceId' },
        { text: 'Tenant ID', sortable: false, value: 'tenantId' },
        { text: 'User Name', sortable: false, value: 'username' },
        { text: 'Request Path', sortable: false, value: 'path' },
        { text: 'Time', sortable: false, value: 'createdAt' },
      ],
      footerOptions: {
        "items-per-page-options": [10,25,100],
      },
      totalLogs: 0,
      logs: [],
      loading: true,
      options: {
        itemsPerPage: 10,
        page: 1
      },
      search: "",
    }
  },
  watch: {
    options: {
      handler () {

        if(parseInt(this.$route.query.size) !== this.options.itemsPerPage
            || parseInt(this.$route.query.page) !== this.options.page){
          this.$router.push({path: this.$route.path, query: {size: this.options.itemsPerPage, page: this.options.page}})
        }

        this.getLogs()
      },
      deep: true,
    },
    search() {
      if(this.search !== null && this.search !== undefined && (this.search.trim().length > 3 || this.search.trim().length === 0)){
        this.getLogs()
      }
    }
  },
  methods: {
    getLogs() {
      this.loading = true
      this.$store.dispatch("administrationModule/getActivityLogs", {
        size: this.options.itemsPerPage,
        page: this.options.page,
        search: this.search
      })
      .then(response => {
        this.logs = response.content
        this.totalLogs = response.totalElements
        this.loading = false
      })
      .catch(error => {
        console.log(error)
      })
    },
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

</style>