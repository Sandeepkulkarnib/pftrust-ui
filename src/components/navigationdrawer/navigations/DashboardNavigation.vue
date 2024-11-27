<template>
  <v-navigation-drawer app>
    <v-card color="primary" class="rounded-0" height="65px" to="/">
      <v-img :src="logo" :width="logoWidth" :height="logoHeight"
             :class="logoStyleClasses"></v-img>
    </v-card>
    <v-divider></v-divider>

    <v-list
        dense
        nav
    >
      <v-list-item
          v-for="item in defaultItems"
          :key="item.label"
          link
          :to="item.path"
          exact
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.label }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
          v-for="item in items"
          :key="item.label"
          link
          :to="item.path"
          exact
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.label }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-group
          v-for="item in itemGroups"
          :key="item.label"
          :value="false"
          :prepend-icon="item.icon"
      >
        <template v-slot:activator>
          <v-list-item-title>{{ item.label }}</v-list-item-title>
        </template>

        <v-list-item
            v-for="(sub, i) in item.subDepartments"
            :key="i"
            link
            :to="item.path + sub.path"
            exact
        >
          <v-list-item-icon>
            <v-icon>{{ sub.mdiIcon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ sub.label }}</v-list-item-title>
          </v-list-item-content>


        </v-list-item>

      </v-list-group>

    </v-list>

  </v-navigation-drawer>
</template>

<script>
export default {
  name: "DashboardNavigation",
  data: () => ({
    type: 'pf',
    defaultItems: [
    ],
  }),
  computed: {
    items () {

      if(this.$store.state.administrationModule.permissions == null){
        return []
      }

      return this.$store.state.administrationModule.permissions
          .filter(permission => permission.type === this.type)
          .filter(permission => permission.subDepartments.length === 0)
    },
    itemGroups () {

      if(this.$store.state.administrationModule.permissions == null){
        return []
      }

      return this.$store.state.administrationModule.permissions
          .filter(permission => permission.type === this.type)
          .filter(permission => permission.subDepartments.length > 0)
    },
    logo(){
      return this.$store.state.administrationModule.logo
    },
    logoWidth(){
      return this.$store.state.administrationModule.logoWidth
    },
    logoHeight(){
      return this.$store.state.administrationModule.logoHeight
    },
    logoStyleClasses(){
      return this.$store.state.administrationModule.logoStyleClasses
    }
  }
}
</script>

<style scoped>

</style>