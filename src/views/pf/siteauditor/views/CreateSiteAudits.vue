<template>
  <v-container>
    <v-row>
      <v-col>
        <v-snackbar
            v-model="snackBar"
            app
            color="success"
            top
            :timeout="1000"
        >
          Audit Request Created Successfully.
        </v-snackbar>

        <v-card>
          <v-card-title>
            Create Audit Request
          </v-card-title>

          <v-form
              ref="form"
              v-model="valid"
              lazy-validation
          >
          <v-container fluid fill-height>
              <v-row >
                <v-col cols="6">
                    <v-text-field
                        v-model="documentName"
                        :rules="rules.documentNameRules"
                        label="Document Name"
                        required
                        dense
                    ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                      v-model="establishmentName"
                      :rules="rules.establishmentName"
                      label="Establishment Name"
                      required
                      dense
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                      v-model="establishmentAddress"
                      :rules="rules.establishmentAddress"
                      label="Establishment Address"
                      required
                      dense
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                      v-model="documentNumber"
                      :rules="rules.documentNumber"
                      label="Document No."
                      required
                      dense
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                      v-model="branchName"
                      :rules="rules.branchName"
                      label="Branch Name"
                      required
                      dense
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                      v-model="branchAddress"
                      :rules="rules.branchAddress"
                      label="Branch Address"
                      required
                      dense
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-menu
                      ref="validFromDateMenu"
                      v-model="validFromDateMenu"
                      :close-on-content-click="false"
                      :return-value.sync="validFrom"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                          v-model="validFrom"
                          label="Valid From"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          :rules="rules.validFrom"
                          dense
                      ></v-text-field>
                    </template>
                    <v-date-picker
                        v-model="validFrom"
                        no-title
                        scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                          text
                          color="primary"
                          @click="validFromDateMenu = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                          text
                          color="primary"
                          @click="$refs.validFromDateMenu.save(validFrom)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="6">
                  <v-menu
                      ref="validUpToDateMenu"
                      v-model="validUpToDateMenu"
                      :close-on-content-click="false"
                      :return-value.sync="validUpto"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                          v-model="validUpto"
                          label="Valid Upto"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          :rules="rules.validUpTo"
                          dense
                      ></v-text-field>
                    </template>
                    <v-date-picker
                        v-model="validUpto"
                        no-title
                        scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                          text
                          color="primary"
                          @click="validUpToDateMenu = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                          text
                          color="primary"
                          @click="$refs.validUpToDateMenu.save(validUpto)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                      v-model="othersField1"
                      label="Others Field 1"
                      required
                      dense
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                      v-model="othersField2"
                      label="Others Field 2"
                      required
                      dense
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-file-input
                      color="primary"
                      label="Upload Document"
                      @change="selectFile($event)"
                      dense
                  ></v-file-input>
                </v-col>
                <v-col cols="6">
                  <v-btn
                      :disabled="!valid"
                      color="primary"
                      class="mr-4"
                      @click="validate"
                      small
                  >
                    Create Request
                  </v-btn>
                </v-col>
              </v-row>
          </v-container>
          </v-form>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {isNotEmpty} from "@/util/rules";
import fileDownload from "js-file-download";

export default {
  name: "CreateSiteAudits",
  data () {
    return {
      snackBar: false,
      documentName: "",
      establishmentName: "",
      establishmentAddress: "",
      documentNumber: "",
      branchName: "",
      branchAddress: "",
      validFrom: "",
      validUpto: "",
      othersField1: "",
      othersField2: "",
      othersField3: "",
      othersField4: "",
      othersField5: "",
      othersField6: "",
      documentPath: "",
      valid: false,
      validFromDateMenu: false,
      validUpToDateMenu: false,
      rules: {
        documentNameRules: [
          v => isNotEmpty(v, "Document Name is Required")
        ],
        establishmentName: [
          v => isNotEmpty(v, "Est Name is Required")
        ],
        establishmentAddress: [
          v => isNotEmpty(v, "Est Address is Required")
        ],
        documentNumber: [
          v => isNotEmpty(v, "Document No. is Required")
        ],
        validFrom: [
          v => isNotEmpty(v, "Valid From Date is Required")
        ],
        validUpTo: [
          v => isNotEmpty(v, "Valid Upto Date is Required")
        ],
        branchName: [
          v => isNotEmpty(v, "Branch Name is Required")
        ],
        branchAddress: [
          v => isNotEmpty(v, "Branch Address is Required")
        ]
      },
      files: {},
    }
  },
  methods : {
    download(fileName){
      this.$store.dispatch("siteAuditModule/downloadDocument", fileName)
          .then(response => {
            fileDownload(response.data, fileName)
          })
          .catch(error => {
            console.log(error)
          })
    },
    validate () {
      let isValid = this.$refs.form.validate();

      if(isValid) {

        this.uploadFiles()
            .then(response => {

              let data = {
                "documentName": this.documentName,
                "establishmentName": this.establishmentName,
                "establishmentAddress": this.establishmentAddress,
                "documentNumber": this.documentNumber,
                "branchName": this.branchName,
                "branchAddress": this.branchAddress,
                "validFrom": this.validFrom,
                "validUpto": this.validUpto,
                "othersField1": this.othersField1,
                "othersField2": this.othersField2,
                "othersField3": this.othersField3,
                "othersField4": this.othersField4,
                "othersField5": this.othersField5,
                "othersField6": this.othersField6
              }

              let documents = response.map(uploadedDocument => {
                let doc = JSON.parse(uploadedDocument)
                return {
                  "path": doc.path
                }
              })

              data["documentPath"] = documents[0]["path"]

              return this.$store.dispatch("siteAuditModule/createAudits", data)
            })
            .then(response => {
              console.log(response)
              this.snackBar = true
              this.$refs.form.reset()
            })
            .catch(error => {
              console.log(error)
            })

      }

    },
    selectFile($event){
      this.$set(this.files, "document", $event)
    },
    uploadFiles(){

      let keys = Object.keys(this.files);

      return new Promise((resolve, reject) => {

        Promise.all(keys.map(this.uploadFile))
            .then(response => {
              resolve(response)
            })
            .catch(error => {
              console.log(error)
              reject(error)
            })

      })

    },
    uploadFile(){

      const formData = new FormData();

      formData.append("document", this.files["document"])

      return this.$store.dispatch("siteAuditModule/uploadDocuments", {
        form: formData
      })

    }
  }
}
</script>

<style scoped>

</style>