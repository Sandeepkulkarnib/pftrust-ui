<template>
  <v-dialog
      v-model="propModel"
      max-width="1000px"
  >
    <v-card>
      <v-card-title>
        Application Details
        <v-spacer></v-spacer>
        <v-btn icon small @click="propModel = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-simple-table
          fixed-header
          height="300px"
          v-if="details !== null"
      >
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-left">
              Application Field
            </th>
            <th class="text-left">
              Value
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="applicationProp in application" :key="applicationProp.text">
            <td>{{applicationProp.text}}</td>
            <td>{{applicationProp.value}}</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ApplicationDetails",
  props: {
    dialog: Boolean,
    details: Object,
    detailsProperties: Array[Object]
  },
  computed: {
    propModel: {
      get () { return this.dialog },
      set (value) { this.$emit('update:dialog', value) },
    },
    application(){

      let application = []

      this.detailsProperties.forEach((prop) => {
        if(this.details[prop.value] !== null && this.details[prop.value] !== undefined){
          application.push({
            text: prop.text,
            value: this.details[prop.value]
          })
        }
      })

      return application

    }
  }
}
</script>

<style scoped>

</style>