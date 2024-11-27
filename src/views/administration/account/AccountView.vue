<template>
  <v-app id="app">

    <v-overlay :value="overlay" z-index="10000" color="primary" opacity="1">
      <v-progress-circular
          indeterminate
          size="64"
      ></v-progress-circular>
    </v-overlay>

    <accounts-navigation/>

    <app-bar/>

    <v-main>
      <v-container fluid>
        <v-row>
          <v-col>
            <v-fab-transition>
              <router-view></router-view>
            </v-fab-transition>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <footer-bar/>

  </v-app>

</template>

<script>
import AppBar from "@/components/appbar/AppBar";
import FooterBar from "@/components/footer/FooterBar";
import AccountsNavigation from "@/components/navigationdrawer/navigations/AccountsNavigation";
import router from "@/router";
export default {
  name: "AccountView",
  components: {AccountsNavigation, FooterBar, AppBar},
  department: "Account",
  data: () => ({
    overlay: true,
  }),
  computed: {

  },
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

<style scoped>

</style>