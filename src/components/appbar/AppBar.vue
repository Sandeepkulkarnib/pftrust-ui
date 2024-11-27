<template>
  <v-app-bar app color="primary" dark>
    <div class="float-left">
      <iframe :src="clock" frameborder="0" width="383" height="23"></iframe>
    </div>
    <v-spacer></v-spacer>
    <v-menu offset-y v-if="activeJobs.length > 0">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            text
            dark
            v-bind="attrs"
            v-on="on"
            class="mr-1"
        >
          <v-icon class="mr-3">mdi-account-hard-hat</v-icon>
          Active Jobs
        </v-btn>

      </template>
      <v-list nav dense>
        <v-list-item v-for="(job, index) in activeJobs" :key="job.entityId"
                     :to="job.to"
        >
          <v-list-item-content>
           {{index + 1}}.  {{job.type.replaceAll("_", " ")}}
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            text
            dark
            v-bind="attrs"
            v-on="on"
            class="mr-1"
        >
          <v-icon class="mr-3">mdi-account</v-icon>
          {{userProfile.username}}
        </v-btn>

      </template>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="https://cdn.vuetifyjs.com/images/john.png"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              {{userProfile.username}}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title>
              {{userProfile.tenant}}
            </v-list-item-title>
            <v-list-item-subtitle>{{ userProfile.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item v-for="role in userProfile.roles" :key="role">
          <v-list-item-content>
            {{role}}
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list
          nav
          dense
      >
        <v-list-item-group
            v-model="selectedItem"
            color="primary"
        >
          <v-list-item
              v-for="(item, i) in userMenu"
              :key="i"
              @click="action(item.action)"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import router from "@/router";

export default {
  name: "AppBar",
  data: () => ({
    selectedItem: null,
    userMenu: [
      { text: 'Accounts', icon: 'mdi-account', action: 'accounts' },
      { text: 'Logout', icon: 'mdi-logout', action: 'logout'}
    ]
  }),
  computed: {
    userProfile () {
      return this.$store.state.administrationModule.user.profile;
    },
    activeJobs () {
      return this.$store.state.administrationModule.activeJobs;
    },
    clock () {
      return this.$store.state.administrationModule.clock;
    },
  },
  methods: {
    action (action) {

      switch (action){
        case 'logout':
          localStorage.clear();
          window.location.href = "/"
          break
        case 'accounts':
          if(this.$route.path !== "/accounts"){
            router.push("/accounts")
          }
          break
        default:
          break
      }

    }
  }
}
</script>

<style scoped>
  #t1 {
    color: #fff !important;
    font-size: 20px;
  }
</style>