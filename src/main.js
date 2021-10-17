import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { auth } from './firebase'
import { firestorePlugin } from 'vuefire'
import moment from 'moment'
import Buefy from 'buefy'
import './assets/scss/app.scss'

Vue.use(firestorePlugin)
Vue.use(Buefy)

Vue.prototype.$moment = moment
Vue.config.productionTip = false

let app
auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }

  if (user) {
    store.dispatch('fetchUserProfile', user)
  }
})
