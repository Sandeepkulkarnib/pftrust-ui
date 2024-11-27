<template>
  <v-card class="mx-auto mt-5" max-width="450">
    <v-card-title class="v">Create New User</v-card-title>
    <v-container class="ctn">
      <v-row class="ctn">
        <v-col class="ctn">
          <v-form
              ref="form"
              v-model="valid"
              lazy-validation
          >
            <v-text-field
                label="Username"
                v-model="username"
                :rules="userNameRule"
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
                label="E-mail"
                v-model="email"
                :rules="emailRule"
                required
            ></v-text-field>
            <v-combobox
                v-model="selectedRoles"
                :items="departments"
                item-text="name"
                item-value="entity"
                label="Select Roles for User"
                multiple
            ></v-combobox>
            <p class="text-md-body-2 error--text mt-5" v-show="isErrored">Please Select the Roles</p>
            <p class="text-md-body-2 error--text mt-5" v-show="isFailed">{{message}}</p>
            <v-btn color="indigo" dark
                   class="float-right mt-5"
                   @click="validate"
                   :loading="inProgress">Create User</v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar
        v-model="snackBar"
        timeout="10000"
        app
        dark
        color="success"
        top
    >
      {{ message }}
    </v-snackbar>
  </v-card>
</template>

<script>
export default {
  name: "CreateUser",
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
    username: null,
    userNameRule: [
      v => !!v || 'User Name is required',
      v => (!!v && v.length > 6) || 'User Name should be at least 6 characters long'
    ],
    email: null,
    emailRule: [
      v => !!v || 'Email is required',
      v => {
        if(v !== null && !v.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
          return "Please enter a valid email"
        }
        return true;
      }
    ],
    snackBar: false,
    isErrored: false,
    column: null,
    departments: [],
    selectRoles: false,
    selectedRoles: [],
    rolesList: []
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
    validate () {
      let validate = this.$refs.form.validate();
      let every = Object.keys(this.selectedRoles).every(key => this.selectedRoles[key] === null);

      if(every){
        this.isErrored = true
      }else {
        this.isErrored = false
      }

      if(validate && !every){
        this.createUser();
      }

    },
    clearRoles () {
      for(let i=0; i<this.departments.length; i++){
        this.$set(this.selectedRoles, this.departments[i].name, null)
      }
    },
    createUser(){

      let roles = this.selectedRoles.map(role => role.entity);

      let data = {
        "username": this.username,
        "email": this.email,
        "firstName": this.firstName,
        "lastName": this.lastName,
        "roles": roles
      }

      this.$store.dispatch("userModule/createUser", data)
          .then(response => {
            console.log(response)
            this.$refs.form.reset()
            this.snackBar = true;
          })
          .catch(error => console.log(error))

    }
  },
  mounted() {
    this.$store.dispatch("userModule/fetchDepartments")
        .then(response => {
          if(response){
            this.departments = response
          }
        })
        .catch(error => {
          console.log(error)
        })
  }
}
</script>

<style scoped>
  .cnt {
    height: 400px;
    overflow-y: scroll;
  }
  .cnt div {
    font-size: 12px !important;
  }
  .ctn {
    padding-top: 0 !important;
  }
</style>