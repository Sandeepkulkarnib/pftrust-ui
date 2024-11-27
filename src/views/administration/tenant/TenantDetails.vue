<template>
  <v-card>
    <v-card-title>Tenant Details</v-card-title>
    <v-divider></v-divider>
    <v-card-text class="ma-0 pa-0">
      <v-container fluid fill-height v-if="data !== null">
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.id}}</p>
              <p>ID</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.code}}</p>
              <p>Code</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.name}}</p>
              <p>Name</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="font-weight-black mb-0 pb-0">{{data.description}}</p>
              <p>Description</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <h2>Logo Image</h2>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <div class="mt-5">
              <v-img :src="data.logo"
                     :width="data.width"
                     :height="data.height"
                     :class="data.styleClasses"
              ></v-img>
            </div>
          </v-col>
          <v-col>
            <div>
              <v-file-input
                  label="Upload New Logo Image"
                  outlined
                  dense
                  v-model="newLogo"
              ></v-file-input>
              <div>
                <v-text-field
                    v-model="newLogoHeight"
                    label="Logo Height (in px)"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="newLogoWidth"
                    label="Logo Width (in px)"
                    required
                ></v-text-field>
              </div>
            </div>
            <v-btn color="primary" small @click="uploadLogoImage" :loading="updatingLogo">update image</v-btn>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <h2>Colors Theme</h2>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0">
          <v-col>
            <v-chip
                class="ma-2"
                v-for="key in Object.keys(colorTheme)"
                :key="key"
                :color="colorTheme[key]"
                dark
            >
              {{key}}
            </v-chip>
          </v-col>
          <v-col>
            <v-textarea
                outlined
                name="input-7-4"
                label="Update Color Theme (use hash code)"
                v-model="newColorTheme"
                :error-messages="colorThemeError"
            ></v-textarea>
            <v-btn color="primary" small @click="updateTheme">update theme</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "TenantDetails",
  data() {
    return {
      data: null,
      colorTheme: null,
      newColorTheme: null,
      colorThemeError: null,
      newLogo: null,
      newLogoHeight: 0,
      newLogoWidth: 0,
      updatingLogo: false,
      updatingColorTheme: false
    }
  },
  methods: {
    getTenantDetails(){
      this.$store.dispatch("tenantModule/fetchTenantDetails")
          .then(response => {
            this.data = JSON.parse(response)
            this.colorTheme = JSON.parse(this.data.theme)
            this.newColorTheme = JSON.stringify(this.colorTheme)
            this.newLogoWidth = this.data.width
            this.newLogoHeight = this.data.height
          })
          .catch(error => {
            console.log(error)
          })
    },
    uploadLogoImage(){

      if(this.newLogo === null || this.newLogo === undefined){
        this.updateLogo("", this.newLogoWidth, this.newLogoHeight)
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        let rawImg = reader.result;
        this.updateLogo(rawImg, this.newLogoWidth, this.newLogoHeight)
      }
      reader.readAsDataURL(this.newLogo);

    },
    updateLogo(image, width, height){

      this.updatingLogo = true

      this.$store.dispatch("tenantModule/uploadTenantLogoImage", {
        "logoImage": image,
        "logoWidth": width,
        "logoHeight": height
      })
      .then(response => {
        this.updatingLogo = false
        let result = JSON.parse(response)
        this.data.logo = result.logoImage
        this.data.height = result.logoHeight
        this.data.width = result.logoWidth
        this.$store.commit("administrationModule/updateTenantLogoImage", {
          "logo": result.logoImage,
          "width": result.logoWidth,
          "height": result.logoHeight,
        })
        this.newLogo = null
      })
      .catch(error => {
        console.log(error)
      })
    },
    updateTheme(){
      let newTheme = JSON.parse(this.newColorTheme)
      if(Object.keys(newTheme).length < 7){
        this.colorThemeError = "Please Provide hash codes for all the 7 Colors."
        return
      }
      this.colorThemeError = ""
      this.updatingColorTheme = true
      this.$store.dispatch("tenantModule/updateTenantTheme", {
        "colorTheme": this.newColorTheme
      })
      .then(res => {

        let newTheme = JSON.parse(res).colorTheme
        let theme = JSON.parse(newTheme)
        this.$vuetify.theme.themes.light["primary"] = theme["primary"]
        this.$vuetify.theme.themes.light["secondary"] = theme["secondary"]
        this.$vuetify.theme.themes.light["accent"] = theme["accent"]
        this.$vuetify.theme.themes.light["error"] = theme["error"]
        this.$vuetify.theme.themes.light["warning"] = theme["warning"]
        this.$vuetify.theme.themes.light["info"] = theme["info"]
        this.$vuetify.theme.themes.light["success"] = theme["success"]
        this.colorTheme = theme
        this.updatingColorTheme = false
      })
      .catch(err => {
        console.log(err)
        this.updatingColorTheme = false
      })

    }
  },
  mounted() {
    this.getTenantDetails()
  }
}
</script>

<style scoped>

</style>