<template>
  <v-app id="app">

    <v-overlay :value="overlay" z-index="10000" color="primary" opacity="1">
      <v-progress-circular
          indeterminate
          size="64"
      ></v-progress-circular>
    </v-overlay>

    <dashboard-navigation/>

    <app-bar/>

    <v-main>
      <router-view></router-view>
    </v-main>

    <footer-bar/>

  </v-app>
</template>

<script>
// @ is an alias to /src

import FooterBar from "@/components/footer/FooterBar";
import AppBar from "@/components/appbar/AppBar";
import router from "@/router";
import DashboardNavigation from "@/components/navigationdrawer/navigations/DashboardNavigation";

export default {
  name: 'HomeView',
  data: () => ({
    overlay: true,
  }),
  components: {DashboardNavigation, AppBar, FooterBar},
  mounted() {
    if(this.$store.state.administrationModule.user.isLoggedIn
        && (this.$store.state.administrationModule.permissions === null
            || this.$store.state.administrationModule.permissions.length < 1)){

      this.$store.dispatch("administrationModule/getUserPermissions")
          .then(response => {
            if(response){

              let theme = JSON.parse(response.response.theme)

              this.$vuetify.theme.themes.light["primary"] = theme["primary"]
              this.$vuetify.theme.themes.light["secondary"] = theme["secondary"]
              this.$vuetify.theme.themes.light["accent"] = theme["accent"]
              this.$vuetify.theme.themes.light["error"] = theme["error"]
              this.$vuetify.theme.themes.light["warning"] = theme["warning"]
              this.$vuetify.theme.themes.light["info"] = theme["info"]
              this.$vuetify.theme.themes.light["success"] = theme["success"]

              return this.$store.dispatch("administrationModule/getUserProfile")

            }
          })
          .then(response => {
            if(response){
              this.overlay = false
            }
          })
          .catch(error => {
            console.log(error)
            router.push("/login")
          })

    }else {
      this.overlay = false
    }
  }
}
</script>
