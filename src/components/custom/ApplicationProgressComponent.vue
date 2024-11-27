<template>
  <v-dialog
      v-model="propModel"
      max-width="1000px"
  >
    <v-card>
      <v-card-title>
        Applications Getting Processed
        <v-spacer></v-spacer>
        <v-btn icon small @click="propModel = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-data-table
          :headers="headers"
          :items="applications"
          :items-per-page="10"
          class="elevation-1"
          :loading="loading"
          loading-text="Loading... Please wait"
          item-key="id"
      >

        <template v-slot:[`item.actions`]="{item}">
          <v-btn small color="primary" :to="baseURL + item.id">
            view
          </v-btn>
        </template>

      </v-data-table>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ApplicationProgressComponent",
  data(){
    return {

    }
  },
  props: {
    loading: Boolean,
    dialog: Boolean,
    applications: Array[Object],
    headers: Array[Object],
    baseURL: String
  },
  computed: {
    propModel: {
      get () { return this.dialog },
      set (value) {
        this.$emit('update:applicationProgressDialog', value)
      },
    }
  },
  methods: {

  }

}
</script>

<style scoped>

</style>