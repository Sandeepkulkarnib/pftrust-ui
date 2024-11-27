<template>
  <v-dialog
      v-model="propModel"
      max-width="1000px"
  >
    <v-card>
      <v-card-title>
        Upload Files
        <v-spacer></v-spacer>
        <v-btn icon small @click="propModel = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div>
          <v-alert
              dense
              type="error"
              class="mt-5 ml-3 mr-3 text-body-2"
              v-show="fileCountError"
          >
            Please Upload All the Required Documents.
          </v-alert>
          <v-alert
              dense
              type="success"
              class="mt-5 ml-3 mr-3 text-body-2"
              v-show="fileUploadSuccess"
          >
            All Files Uploaded Successfully.
          </v-alert>
        </div>
        <v-simple-table v-if="documents.length > 0">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  Document
                </th>
                <th class="text-left">
                  Upload
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                  v-for="(document) in documents"
                  :key="document.entityId"
              >
                <td>{{ document.name }}</td>
                <td>
                  <v-file-input
                      prepend-icon="mdi-cloud-upload"
                      color="primary"
                      hide-input
                      @change="selectFile($event, document)"
                      v-if="files[document.entityId] === undefined"
                  ></v-file-input>
                  <v-chip color="primary" dark close @click:close="unSelectFile(document)"
                          v-if="files[document.entityId] !== undefined"
                  >{{files[document.entityId].name}}</v-chip>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small color="secondary" @click="uploadFiles" :loading="uploadingFiles">upload documents</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "FileUploadComponent",
  data(){
    return {
      files: {},
      fileCountError: false,
      fileUploadSuccess: false,
      uploadingFiles: false
    }
  },
  props: {
    dialog: Boolean,
    documents: Array[Object],
  },
  computed: {
    propModel: {
      get () { return this.dialog },
      set (value) {
        this.$emit('update:fileUploadDialog', value)
        this.files = {}
        this.fileCountError = false
        this.fileUploadSuccess = false
        this.uploadingFiles = false
      },
    }
  },
  methods: {
    selectFile($event, document){
      this.$set(this.files, document.entityId, $event)
    },
    unSelectFile(document){
      this.$set(this.files, document.entityId, undefined)
    },
    uploadFiles(){

      if(Object.keys(this.files).length < this.documents.length){
        this.fileCountError = true;
        return;
      }
      this.fileCountError = false;

      let keys = Object.keys(this.files);

      this.uploadingFiles = true

      Promise.all(keys.map(this.uploadFile))
          .then(response => {
            this.fileUploadSuccess = true
            this.uploadingFiles = false
            this.$emit("update:uploaded", response)
          })
          .catch(error => {
            console.log(error)
          })

    },
    uploadFile(key){

      let filteredDocument = this.documents.filter(document => document.entityId === key)[0];

      let formattedName = filteredDocument.name.toLowerCase().replace(" ", "_");
      formattedName = filteredDocument.name.toLowerCase().replace("/", "_");

      const formData = new FormData();

      formData.append(formattedName, this.files[filteredDocument.entityId])

      return this.$store.dispatch("loanModule/uploadDocuments", {
        entityId: filteredDocument.entityId,
        form: formData
      })

    }
  }
}
</script>

<style scoped>

</style>