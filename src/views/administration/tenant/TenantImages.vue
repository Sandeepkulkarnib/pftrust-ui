<template>
  <v-card>
    <v-card-title>Tenant Images</v-card-title>
    <v-divider></v-divider>
    <v-card-text class="ma-0 pa-0">
      <v-container fluid fill-height>
        <v-row class="pa-0 ma-0">
          <v-col>
            <v-file-input
                label="Upload Image"
                outlined
                dense
                v-model="image"
            ></v-file-input>
          </v-col>
          <v-col>
            <v-btn color="primary" dark @click="uploadImage"
                   :loading="uploading">upload</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col
              v-for="image in uploadedImages"
              :key="image.id"
              class="d-flex child-flex"
              cols="2"
          >
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-img
                    :src="$baseURL + '/auth/downloadDocuments?document=' + image.path"
                    aspect-ratio="1"
                    contain
                    class="images"
                    v-bind="attrs"
                    v-on="on"
                    @click="copyPath($baseURL + '/auth/downloadDocuments?document=' + image.path)"
                >
                  <template v-slot:placeholder>
                    <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                    >
                      <v-progress-circular
                          indeterminate
                          color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </template>
              <span>{{tooltipText}}</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "TenantImages",
  data() {
    return {
      image: null,
      uploading: false,
      uploadedImages: [],
      tooltipText: "click to copy path"
    }
  },
  methods: {
    uploadImage(){
      const formData = new FormData();
      formData.append("image", this.image)
      this.uploading = true
      this.$store.dispatch("tenantModule/upload", {
        form: formData
      })
      .then(res => {
        console.log(res)
        this.uploading = false
        this.getImages()
      })
      .catch(err => {
        this.uploading = false
        console.log(err)
      })

    },
    getImages(){
      this.$store.dispatch("tenantModule/fetchTenantImages")
        .then(res => {
          this.uploadedImages = JSON.parse(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    copyPath(image){
      navigator.clipboard.writeText(image);
      this.tooltipText = "copied"
      let interval = setInterval(() => {
        this.tooltipText = "click to copy path"
        clearInterval(interval)
      }, 1000)
    }
  },
  mounted() {
    this.getImages()
  }
}
</script>

<style scoped>
  .images {
    border: 1px solid gray
  }
  .images:hover {
    cursor: pointer;
  }
</style>