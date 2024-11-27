<template>
  <v-card
      max-width="450"
      class="mx-auto mt-5"
  >
    <v-container>
      <v-row>
        <v-col class="col-4 offset-4">
          <v-img
              :src="userProfile.profileImage"
              width="500px"
              dark
              class="rounded-t-circle rounded-b-circle align-center"
          >
          </v-img>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-list two-line>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{userProfile.username}}</v-list-item-title>
                <v-list-item-subtitle>username</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ userProfile.firstName }}</v-list-item-title>
                <v-list-item-subtitle>first name</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ userProfile.lastName }}</v-list-item-title>
                <v-list-item-subtitle>last name</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{userProfile.email}}</v-list-item-title>
                <v-list-item-subtitle>email</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item v-for="role in userProfile.roles" :key="role">
              {{role}}
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "ProfileView",
  computed: {
    userProfile () {
      return this.$store.state.administrationModule.user.profile;
    }
  }
}
</script>

<style scoped>

</style>