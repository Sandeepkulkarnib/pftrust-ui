<template>
  <v-data-table
      :headers="headers"
      :items="tenants"
      :items-per-page="10"
      class="elevation-1 mt-5"
  ></v-data-table>
</template>

<script>
export default {
  name: "TenantsView",
  data () {
    return {
      headers: [
        {
          text: 'Id',
          align: 'start',
          sortable: false,
          value: 'tenantId',
        },
        { text: 'Name', value: 'name' },
        { text: 'Assigned At', value: 'assignedAt'}
      ],
    }
  },
  computed: {
    tenants () {
      return this.$store.state.administrationModule.tenants;
    }
  }
}
</script>

<style scoped>

</style>