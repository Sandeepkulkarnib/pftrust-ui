<template>
  <v-card max-width="450"
          class="mx-auto mt-5">
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
                :value="userProfile.username"
                disabled
                label="Username"
                required
            ></v-text-field>
            <v-text-field
                v-model="firstName"
                :rules="firstNameRule"
                label="First Name"
                required
            ></v-text-field>
            <v-text-field
                v-model="lastName"
                :rules="lastNameRule"
                label="Last Name"
                required
            ></v-text-field>
            <v-text-field
                :value="userProfile.email"
                disabled
                label="E-mail"
                required
            ></v-text-field>
            <v-btn
                :disabled="!valid"
                color="primary"
                class="mr-4"
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

export default {
  name: "EditProfileView",
  data: () => ({
    valid: true,
    firstName: null,
    firstNameRule: [
      v => !!v || 'First Name is required',
    ],
    lastName: null,
    lastNameRule: [
      v => !!v || 'Last Name is required',
    ],
    snackBar: false
  }),
  computed: {
    userProfile () {
      return this.$store.state.administrationModule.user.profile;
    },
    inProgress () {
      return this.$store.state.administrationModule.request.inProgress;
    },
    isFailed () {
      return this.$store.state.administrationModule.request.isFailed;
    },
    message () {
      return this.$store.state.administrationModule.request.message;
    },
    userFirstName () {
      return this.$store.state.administrationModule.user.profile.firstName;
    },
    userLastName () {
      return this.$store.state.administrationModule.user.profile.lastName;
    },
  },
  methods: {
    validate () {
      let validate = this.$refs.form.validate();

      if(validate){
        this.$store.dispatch("administrationModule/updateUserProfile", {
          firstName: this.firstName,
          lastName: this.lastName
        })
        .then(response => {
          console.log(response)
        })
        .catch(error => console.log(error))
      }

    },
  },
  watch: {
    message () {
      this.snackBar = this.message !== null && this.message !== ""
    },
    userFirstName () {
      this.firstName = this.userFirstName
    },
    userLastName () {
      this.lastName = this.userLastName
    }
  },
  mounted() {
    this.firstName = this.$store.state.administrationModule.user.profile.firstName
    this.lastName = this.$store.state.administrationModule.user.profile.lastName
  }
}
</script>

<style scoped>

</style>