<template>
  <v-container>
    <v-row>
      <v-col>
      <v-data-table
          :headers="headers"
          :items="templates"
          :options.sync="options"
          :server-items-length="total"
          class="elevation-1"
          :loading="loading"
          loading-text="Loading... Please wait"
          :footer-props="footerOptions"
          key="id"
      >
        <template v-slot:top>
          <v-toolbar
              flat
          >
            <v-toolbar-title>Email Templates</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="secondary" small dark>Add Template</v-btn>
          </v-toolbar>
        </template>

        <template v-slot:[`item.actions`]="{item}">
          <v-btn small color="secondary" :to="'loans/details/' + item.id">
            view
          </v-btn>
        </template>

      </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "TenantEmailDesigns",
  data() {
    return {
      total: 0,
      templates: [],
      loading: true,
      options: {
        itemsPerPage: 10,
        page: 1
      },
      headers: [
        {
          text: 'Template Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Created At', sortable: false, value: 'createdAt' },
        { text: 'Updated At', sortable: false, value: 'updatedAt' },
        { text: 'Created By', sortable: false, value: 'createdBy' },
        { text: 'Updated By', sortable: false, value: 'updatedBy' },
        {text: 'Actions', sortable: false, value: 'actions'}
      ],
      footerOptions: {
        "items-per-page-options": [10,25,100],
      },
      supportedTemplates: []
    }
  },
  methods: {
    getTemplates(){
      this.$store.dispatch("tenantModule/fetchEmailTemplates")
          .then(res => {
            let response = JSON.parse(res);
            this.templates = response.emailDesigns;
            this.supportedTemplates = response.supportedTemplates
            this.total = this.templates.length
            this.loading = false
          })
          .catch(err => {
            console.log(err)
          })
    }
  },
  mounted() {
    this.getTemplates()
  }
}
</script>
