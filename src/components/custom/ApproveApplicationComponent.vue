<template>
  <v-dialog
      v-model="propModel"
  >
    <v-card>
      <v-card-title>
        {{label}}
        <v-spacer></v-spacer>
        <v-btn small color="indigo" class="mr-5" dark
               @click="downloadTemplate">Download Template</v-btn>
        <v-icon
            small
            color="black darken-2"
            @click="propModel = false"
        >
          mdi-close
        </v-icon>
      </v-card-title>
      <v-divider></v-divider>
      <div class="pa-1 ma-3 mt-4" style="width: 30%">
        <v-file-input
            show-size
            label="Select Applications File for Approval"
            @change="getData"
            dense
            @click:clear="$emit('clear:applications')"
        ></v-file-input>
      </div>

      <v-data-table
          :headers="headers"
          :items="applications"
          :server-items-length="totalApplications"
          :loading="loadingApplications"
          loading-text="Loading... Please wait"
          key="id"
      >

        <template v-slot:[`item.actions`]="{item}">
          <v-btn small color="secondary" :to="'loans/details/' + item.id" v-if="item.status === 'success'">
            view
          </v-btn>
          <p v-else>-</p>
        </template>

      </v-data-table>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small dark color="secondary" class="mt-2 mb-2">Approve Eligible Applications</v-btn>
      </v-card-actions>

    </v-card>

  </v-dialog>
</template>

<script>
import * as XLSX from "xlsx";

export default {
  name: "ApproveApplicationComponent",
  props: {
    label: String,
    dialog: Boolean,
    loadingApplications: Boolean,
    applications: Array[Object],
    headers: Array[Object],
    totalApplications: Number
  },
  computed: {
    propModel: {
      get () { return this.dialog },
      set (value) { this.$emit('update:dialog', value) },
    },
  },
  methods: {
    downloadTemplate(){
      this.$emit("click:downloadTemplate")
    },
    getData(files){

      if(files === null || files === undefined){
        return;
      }

      files.arrayBuffer()
          .then(data => {

            let workBook = XLSX.read(data, { type: 'binary', cellText: false, cellDates: true });

            let workSheet = workBook.Sheets[workBook.SheetNames[0]];

            let json = XLSX.utils.sheet_to_json(workSheet,
                { header: 0, raw: false, dateNF: 'dd-mm-yyyy' });

            json.splice(json.length-1, 1);

            this.$emit("load:applicationsData", {
              "applications": json
            })

          })
          .catch(error => {
            console.log(error)
          })

    },
  }
}
</script>

<style scoped>

</style>