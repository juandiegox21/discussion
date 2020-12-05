import Vue from 'vue'
import Vuex from 'vuex'
import { auth, authProviders, db } from '../firebase'
import router from '../router/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userProfile: {}
  },

  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val
    }
  },

  actions: {
    async login({ dispatch }, form) {
      // Sign in with email and password (Default)-
      // when a provider is not specified
      if (!authProviders[form.provider]) {
        // Sign user in
        const { user } = await auth.signInWithEmailAndPassword(form.email, form.password)

        // Fetch user profile and set in state
        dispatch('fetchUserProfile', user)
      } else {
        // Sign in with third party apps
        const { user } = await auth.signInWithPopup(authProviders[form.provider])

        // Create user profile object in userCollections
        await db.collection('users').doc(user.uid).set({
          name: user.displayName
        })
      }      
    },

    async fetchUserProfile({ commit }, user) {
      // Fetch user profile
      const userProfile = await db.collection('users').doc(user.uid).get()
      // Set user profile in state
      commit('setUserProfile', userProfile.data())

      router.push('/dashboard')
    },

    async signup({ dispatch }, form) {
      // Sign user up
      const { user } = await auth.createUserWithEmailAndPassword(form.email, form.password)

      // Create user profile object in userCollections
      await db.collection('users').doc(user.uid).set({
        name: form.name
      })

      // Fetch user profile and set in state
      dispatch('fetchUserProfile', user)
    },

    async logout({ commit }) {
      await auth.signOut()

      // clear userProfile and redirect to /login
      commit('setUserProfile', {})
      router.push('/login')
    }
  },

  modules: {
  }
})
