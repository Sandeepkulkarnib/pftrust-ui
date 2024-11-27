<template>
  <v-app id="app">
    <v-main class="mb-0">
      <v-container fluid class="pa-0 ma-0">
        <v-row no-gutters>
          <v-col cols="9" style="margin-bottom: -10px !important;">
            <v-img max-height="657" src="../../../assets/bg-auth-overlay.png"></v-img>
          </v-col>
          <v-col cols="3">
            <div class="pa-10">
              <div class="mb-16">
                <v-img max-width="200px" src="../../../assets/PF_Trust_Logo.png"></v-img>
              </div>
              <div style="color: #dc3545">
                <h3>Welcome to <br>
                  PF Trust !</h3>
              </div>
              <div class="mt-5">
                <v-snackbar
                    v-model="snackBar"
                    app
                    dark
                    color="warning"
                    top
                    class="mt-16"
                    v-show="$route.query.changepassword === 'success'"
                    timeout="10000"
                >
                  Password updated successfully, Please login with new password.
                </v-snackbar>
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                >
                  <v-text-field
                      v-model="username"
                      :rules="usernameRules"
                      label="Username"
                      required
                      v-show="step === 1"
                      outlined
                      dense
                  ></v-text-field>

                  <v-select
                      v-model="selectedTenant"
                      :rules="selectedTenantRules"
                      :items="tenants"
                      item-text="name"
                      item-value="tenantId"
                      label="Select Tenant"
                      persistent-hint
                      return-object
                      single-line
                      v-show="step === 2"
                      dense
                      outlined
                  ></v-select>

                  <v-text-field
                      v-model="password"
                      :rules="passwordRules"
                      label="Password"
                      required
                      type="password"
                      v-show="step === 2"
                      dense
                      outlined
                  ></v-text-field>
                  <p v-show="isFailed" class="error--text">{{message}}</p>
                  <v-btn
                      :disabled="!validUserName"
                      color="#dc3545"
                      dark
                      @click="validateUserName"
                      :loading="inProgress"
                      v-show="step === 1"
                      style="padding-left: 110px; padding-right: 110px"
                  >
                    Next
                  </v-btn>

                  <v-btn
                      :disabled="!valid"
                      color="#dc3545"
                      dark
                      class="mr-4"
                      @click="validate"
                      :loading="inProgress"
                      v-show="step === 2"
                      style="padding-left: 110px; padding-right: 110px"
                  >
                    Login
                  </v-btn>
                </v-form>
              </div>
              <div class="mt-10" style="font-size: 12px; color: rgb(26 66 170); text-align: center;">
                <p>
                  Copyright @ CoreIntegra Consulting Services Pvt. Ltd 2022
                </p>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: "LoginView",
  data: () => ({
    overlay: false,
    snackBar: true,
    step: 1,
    valid: true,
    validUserName: true,
    username: '',
    usernameRules: [
      v => !!v || 'username is required'
    ],
    password: '',
    passwordRules: [
      v => !!v || 'password is required'
    ],
    selectedTenant: null,
    selectedTenantRules: [
        v => !!v || 'tenant is required'
    ]
  }),
  computed: {
    title () {
      return this.$store.state.administrationModule.loginForm.title;
    },
    tenants () {
      return this.$store.state.administrationModule.tenants;
    },
    inProgress () {
      return this.$store.state.administrationModule.request.inProgress;
    },
    isFailed () {
      return this.$store.state.administrationModule.request.isFailed;
    },
    message () {
      return this.$store.state.administrationModule.request.message;
    }
  },
  methods: {
    validate () {
      let validation = this.$refs.form.validate()
      if(validation){
        this.$store.dispatch("administrationModule/login", {
          username: this.username,
          password: this.password,
          tenantId: this.selectedTenant.tenantId
        })
          .then(response => {
            if(response){
              return this.$store.dispatch("administrationModule/getUserPermissions")
            }
          })
            .then(response => {
              if(response){
                window.location.href = "/dashboard"
              }
            })
          .catch(error => console.log(error))
      }
    },
    validateUserName () {
      if(this.username === null || this.username === ""){
        this.$refs.form.validate();
        return;
      }
      this.$store.dispatch("administrationModule/getTenants", this.username)
          .then(response => {
            if(response){
              this.step = 2
            }
          })
          .catch(error => {
            if(error){
              console.log(error)
            }
          })
    }
  },
  mounted() {

  }
}
</script>
<style scoped>

</style>