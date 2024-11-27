<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-fab-transition>
          <router-view></router-view>
        </v-fab-transition>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "EmployeeView"
}
</script>

<style scoped>

</style>