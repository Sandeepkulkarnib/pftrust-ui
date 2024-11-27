<template>
  <v-container>

    <v-row justify="center">
      <v-col>
        <v-dialog
            v-model="viewUserDetails"
            max-width="500px"
        >
          <v-card>
            <v-card-title>
              User Details
            </v-card-title>
            <v-container fluid fill-height>
              <v-row >
                <v-col>
                  <v-tabs
                  v-model="currentItem" fixed-tabs>
                    <v-tab key="details" href="#details">Details</v-tab>
                    <v-tab key="roles" href="#roles">Roles</v-tab>

                    <v-tabs-items v-model="currentItem">
                      <v-tab-item key="details" value="details">
                        <v-list two-line>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>{{userForDetails.active ? 'Active' : 'In Active'}}</v-list-item-title>
                              <v-list-item-subtitle>status</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>{{userForDetails.username}}</v-list-item-title>
                              <v-list-item-subtitle>username</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>{{ userForDetails.firstName }}</v-list-item-title>
                              <v-list-item-subtitle>first name</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>{{ userForDetails.lastName }}</v-list-item-title>
                              <v-list-item-subtitle>last name</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>{{userForDetails.email}}</v-list-item-title>
                              <v-list-item-subtitle>email</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>{{userForDetails.createdAt}}</v-list-item-title>
                              <v-list-item-subtitle>created at</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item v-if="userForDetails.createdBy !== ''">
                            <v-list-item-content>
                              <v-list-item-title>{{userForDetails.createdBy}}</v-list-item-title>
                              <v-list-item-subtitle>created by</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>{{userForDetails.updatedAt}}</v-list-item-title>
                              <v-list-item-subtitle>updated at</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item v-if="userForDetails.updatedBy !== ''">
                            <v-list-item-content>
                              <v-list-item-title>{{userForDetails.updatedBy}}</v-list-item-title>
                              <v-list-item-subtitle>updated by</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-tab-item>
                      <v-tab-item key="roles" value="roles">
                        <v-list>
                          <v-list-item v-for="role in userForDetails.roles" :key="role">
                            <v-list-item-content>
                              <v-list-item-title v-text="role" class="text-md-body-2"></v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-tab-item>
                    </v-tabs-items>

                  </v-tabs>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>


    <v-row>
      <v-col>
        <v-data-table
            :headers="headers"
            :items="users"
            :options.sync="options"
            :server-items-length="totalUsers"
            class="elevation-1"
            :loading="loading"
            loading-text="Loading... Please wait"
            :footer-props="footerOptions"
            key="entityId"
            single-expand
        >
          <template v-slot:top>
            <v-toolbar
                flat
            >
              <v-toolbar-title>Users</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn to="/accounts/users/create" small color="primary">Create User</v-btn>
            </v-toolbar>
          </template>

          <template v-slot:[`item.entityId`]="{item}">
            <v-btn x-small color="primary" dark @click="view(item)">View</v-btn>
          </template>

        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "UserView",
  data () {
    return {
      totalUsers: 0,
      users: [],
      loading: true,
      options: {
        itemsPerPage: 10,
        page: 1
      },
      headers: [
        {
          text: 'User Name',
          align: 'start',
          sortable: false,
          value: 'username',
        },
        { text: 'Name', sortable: false, value: 'name' },
        { text: 'Email', sortable: false, value: 'email' },
        { text: 'Created At', sortable: false, value: 'createdAt' },
        { text: 'Updated At', sortable: false, value: 'updatedAt' },
        { text: 'Status', sortable: false, value: 'active' },
        {text: 'view', value: 'entityId'}
      ],
      footerOptions: {
        "items-per-page-options": [10,25,100],
      },
      search: "",
      viewUserDetails: false,
      currentItem: 'tab-Web',
      userForDetails: {}
    }
  },
  watch: {
    options: {
      handler () {

        if(parseInt(this.$route.query.size) !== this.options.itemsPerPage
            || parseInt(this.$route.query.page) !== this.options.page){
          this.$router.push({path: this.$route.path, query: {size: this.options.itemsPerPage, page: this.options.page}})
        }

        this.getUsers()
      },
      deep: true,
    },
    search() {
      if(this.search !== null && this.search !== undefined && (this.search.trim().length > 3 || this.search.trim().length === 0)){
        this.getUsers()
      }
    }
  },
  methods: {
    getUsers() {
      this.$store.dispatch("userModule/fetchUsers", {
        size: this.options.itemsPerPage,
        page: this.options.page,
        search: this.search
      })
          .then(response => {
            this.users = response.content
            this.totalUsers = response.totalElements
            this.loading = false
          })
          .catch(error => {
            console.log(error)
          })
    },
    view(user){
      console.log(user)
      this.userForDetails = user
      this.viewUserDetails = true
    }
  },
  mounted() {
    this.options = {
      itemsPerPage: this.$route.query.size === undefined ? 10 : parseInt(this.$route.query.size),
      page: this.$route.query.page === undefined ? 1 : parseInt(this.$route.query.page)
    }
  }
}
</script>

<style scoped>

</style>