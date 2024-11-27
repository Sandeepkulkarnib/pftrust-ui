<template>
  <v-container>

    <v-row justify="center">
      <v-col>
        <v-dialog
            v-model="createNewUnitCode"
            max-width="500px"
        >
          <v-card>
            <v-card-title>
              Create a new UnitCode
              <v-spacer></v-spacer>
              <v-icon
                  dark
                  color="black darken-2"
                  @click.stop="createNewUnitCode = false"
              >
                mdi-close
              </v-icon>
              <span class="text-md-body-2">Please maintain the format of unit code numbering</span>
            </v-card-title>
            <v-container fluid fill-height>
              <v-row >
                <v-col>
                  <v-text-field
                      v-model="newUnitCode"
                      label="Create UnitCode"
                      :rules="rules"
                  ></v-text-field>
                  <div v-show="isFailed">
                    <p class="text-md-body-2 error--text">{{message}}</p>
                  </div>
                  <div v-show="isSuccess">
                    <p class="text-md-body-2 success--text">{{message}}</p>
                  </div>
                  <v-btn dark color="primary" class="float-right mt-5 mb-2"
                         small
                         :disabled="newUnitCode.length !== 6"
                         @click="saveUnitCode"
                         :loading="inProgress"
                  >Save UnitCode</v-btn>
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
            :items="unitcodes"
            :items-per-page="10"
            class="elevation-1"
            :loading="false"
            loading-text="Loading... Please wait"
        >
          <template v-slot:top>
            <v-toolbar
                flat
            >
              <v-toolbar-title>Unit Codes</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  small
                  @click="createNewUnitCode = true"
              >
                Create UnitCode
              </v-btn>
            </v-toolbar>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: "UnitCodeView",
  data () {
    return {
      headers: [
        {
          text: 'Unit Code',
          align: 'start',
          sortable: true,
          value: 'unitCode',
        },
        { text: 'Created At', sortable: true,  value: 'createdAt' },
        { text: 'Active', sortable: true, value: 'isActive' },
        { text: 'Updated At', sortable: true, value: 'updatedAt' },
      ],
      createNewUnitCode: false,
      newUnitCode: '',
      rules: [v => v.length === 6 || 'Enter a valid unit code.'],
    }
  },
  computed: {
    unitcodes () {
      return this.$store.state.backofficeModule.unitcodes
    },
    inProgress () {
      return this.$store.state.backofficeModule.request.inProgress;
    },
    isFailed () {
      return this.$store.state.backofficeModule.request.isFailed;
    },
    message () {
      return this.$store.state.backofficeModule.request.message;
    },
    isSuccess () {
      return this.$store.state.backofficeModule.request.isSuccess;
    }
  },
  watch: {
    createNewUnitCode() {
      if(!this.createNewUnitCode){
        this.$store.commit("backofficeModule/setRequestStatus", {
          inProgress: false,
          isSuccess: false,
          isFailed: false,
          message: ""
        })
      }
    },
  },
  methods: {
    saveUnitCode() {
      this.$store.dispatch("backofficeModule/saveUnitCode", {
        "unitCode": this.newUnitCode
      })
          .then(response => {
            if(response){
              setTimeout(() => this.createNewUnitCode = false, 500)
            }
          })
          .catch(error => {
            console.log(error)
          })
    },
  },
  mounted() {

    if(this.unitcodes.length < 1){
      this.$store.dispatch("backofficeModule/fetchUnitCodes")
          .then(response => {
            console.log(response)
          })
          .catch(error => {
            console.log(error)
          })
    }
  }
}
</script>

<style scoped>

</style>