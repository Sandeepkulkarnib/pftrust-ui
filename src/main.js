import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from "@/store/store";
import axios from "axios";
import HighchartsVue from "highcharts-vue";
import PermissionValidator from "@/security/PermissionValidator";
import moment from 'moment'

Vue.prototype.$moment = moment

// const baseURL = 'http://localhost:8089/api/v1'

// const baseURL = 'http://3.110.35.227:8086/api/v1'
//
// const baseURL = 'https://hpcpftrust.coreintegra.com/api/v1'
const baseURL = 'http://localhost:8089/api/v1'


// const baseURL = 'https://developerspftrust.coreintegra.com/api/v1'

// const baseURL = 'https://pftrustbodemo.coreintegra.com/api/v1'

axios.defaults.baseURL = baseURL

Vue.baseURL = baseURL
Vue.prototype.$baseURL = baseURL

Vue.config.productionTip = false

Vue.use(HighchartsVue);

Vue.use(PermissionValidator, store)

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App),
}).$mount('#app')
