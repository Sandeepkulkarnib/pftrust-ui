<template>
  <v-app id="app">
    <v-main>
      <v-container fluid fill-height>
        <v-row justify-md="center">
          <v-col md="4">
            <h1>Page Not Found</h1>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <footer-bar/>

  </v-app>

</template>

<script>
import FooterBar from "@/components/footer/FooterBar";

export default {
  name: "NotFoundView",
  components: {FooterBar},
}
</script>
<style scoped>
  h1 {
    text-align: center;
  }
</style>