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
  name: "JobView",
  data: () => ({
    type: 'pf',
  }),
}
</script>

<style scoped>

</style>