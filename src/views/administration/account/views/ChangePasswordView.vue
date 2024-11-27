<template>
  <v-card       max-width="450"
                class="mx-auto  mt-5">
    <v-container>
      <v-row>
        <v-col>
          <v-snackbar
              v-model="snackBar"
              timeout="10000"
              app
              dark
              :color="isFailed ? 'error' : 'success' "
              top
          >
            {{ message }}
          </v-snackbar>
          <v-form
              ref="form"
              v-model="valid"
              lazy-validation
          >
            <v-text-field
                type="password"
                v-model="currentPassword"
                :rules="currentPasswordRule"
                label="Current Password"
                required
            ></v-text-field>
            <v-text-field
                type="password"
                v-model="newPassword"
                :rules="newPasswordRule"
                label="New Password"
                required
            ></v-text-field>
            <v-text-field
                type="password"
                v-model="confirmPassword"
                :rules="confirmPasswordRule"
                label="Confirm Password"
                required
            ></v-text-field>

            <v-btn
                :disabled="!valid"
                color="primary"
                class="mr-4 mt-4"
                dark
                @click="validate"
                :loading="inProgress"
            >
              Update
            </v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>

import router from "@/router";

export default {
  name: "EditProfileView",
  data: () => ({
    valid: true,
    currentPassword: '',
    currentPasswordRule: [
      v => !!v || 'Password is required',
    ],
    newPassword: '',
    newPasswordRule: [
      v => !!v || 'New Password is required',
    ],
    confirmPassword: '',
    confirmPasswordRule: [
      v => !!v || 'Confirm New Password'
    ],
    snackBar: false
  }),
  computed: {
    userProfile() {
      return this.$store.state.administrationModule.user.profile;
    },
    message () {
      return this.$store.state.administrationModule.request.message;
    },
    inProgress () {
      return this.$store.state.administrationModule.request.inProgress;
    },
    isFailed () {
      return this.$store.state.administrationModule.request.isFailed;
    },
  },
  methods: {
    validate () {
      if(this.$refs.form.validate()){
        this.$store.dispatch("administrationModule/changeUserPassword", {
          currentPassword: this.currentPassword,
          newPassword: this.newPassword,
          confirmPassword: this.confirmPassword
        })
            .then(response => {
              if(response){
                this.snackBar = true;
                setTimeout(() => router.push("/logout?changepassword=success"), 2000)
              }
            })
            .catch(error => {
              console.log(error)
              this.snackBar = true
            })
      }
    }
  }
}
</script>

<style scoped>

</style>