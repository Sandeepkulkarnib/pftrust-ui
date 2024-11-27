<template>
  <v-app id="app">
    <v-main>
      <v-container fluid fill-height>
        <v-row justify-md="center">
          <v-col md="4">
            <v-card height="250">
              <v-container>
                <v-row>
                  <v-col class="pa-10">
                    <div class="text-center" v-show="inProgress">
                      <p class="text-body-1 mb-15">Please wait while we're verifying your details</p>
                      <v-progress-circular
                          :size="50"
                          color="primary"
                          indeterminate
                      ></v-progress-circular>
                    </div>
                    <div class="text-center" v-show="isSuccess">
                      <p>Your account is verified successfully.</p>
                      <p>We have sent the login details to the registered email id, please login using the credentials.</p>
                      <v-btn color="primary" dark to="/login">Login</v-btn>
                    </div>
                    <div class="text-center" v-show="isFailed">
                      <p>Something went wrong, please contact Admin</p>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
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
  name: "VerifyUserView",
  components: {FooterBar},
  data: () => ({
    overlay: false,
    snackBar: true,
  }),
  computed: {
    inProgress () {
      return this.$store.state.userModule.request.inProgress;
    },
    isFailed () {
      return this.$store.state.userModule.request.isFailed;
    },
    message () {
      return this.$store.state.userModule.request.message;
    },
    isSuccess () {
      return this.$store.state.userModule.request.isSuccess;
    }
  },
  methods: {

  },
  mounted() {

    let query = this.$route.query;

    if(query === null || query.token === null || query.token === undefined){
      this.$store.commit("userModule/setRequestStatus", {
        inProgress: false,
        isSuccess: false,
        isFailed: true,
        message: ""
      })
    }else {

      let data = {
        token: query.token
      }

      this.$store.dispatch("userModule/verifyUser", data)
          .then(response => console.log(response))
          .catch(error => console.log(error))

    }

  }
}
</script>
<style scoped>

</style>