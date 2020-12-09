import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { auth } from './firebase'
import './assets/scss/app.scss'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import { firestorePlugin } from 'vuefire'

Vue.use(firestorePlugin)
Vue.use(Buefy)

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
});
