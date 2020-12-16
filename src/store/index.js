import { reject, resolve } from 'core-js/fn/promise'
import Vue from 'vue'
import Vuex from 'vuex'
import { auth, authProviders, db, storage } from '../firebase'
import router from '../router/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userProfile: {}
  },

  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val
    },

    setUserProfilePicture(state, val) {
      state.userProfile.profilePictureURL = val
    },
  },

  actions: {
    async login({ dispatch, commit }, form) {
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
        
        const userRef = db.collection('users').doc(user.uid)
        const userDoc = await userRef.get()

        if (userDoc.exists) {
          await userRef.update({
            uid: user.uid,
            email: user.email,
            name: user.displayName,
          })

          commit('setUserProfile', {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            profilePictureURL: userDoc.data().profilePictureURL
          })

          router.push('/dashboard')
        } else {
          // Create user profile object in users collection
          await userRef.set({
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            profilePictureURL: user.photoURL
          })

          commit('setUserProfile', {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            profilePictureURL: user.photoURL
          })

          router.push('/dashboard')
        }
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
        uid: user.uid,
        name: form.name,
        email: user.email,
        profilePictureURL: ''
      })
    },

    async logout({ commit }) {
      await auth.signOut()

      // clear userProfile and redirect to /login
      commit('setUserProfile', {})
      router.push('/login')
    },

    // Update profile picture
    async updateProfilePicture({ commit }, file) {
      // Ensures that the profile picture is an image
      if (file.type.split('/')[0] !== 'image') {
        throw ('Unsupported file type, please select an image')
      }

      // User ID
      const uid = this.state.userProfile.uid
      // Storage Path
      const path = `${uid}/profilePicture/${new Date().getTime()}_${file.name}` 
      
      const storageRef = storage.ref()
      const fileRef = storageRef.child(path)
      
      // Upload picture with user id as the meta data
      await fileRef.put(file)
      // File URL
      const fileUrl = await fileRef.getDownloadURL()
      // Update user's profile picture
      await db.doc(`users/${uid}`).update({
        profilePictureURL: fileUrl
      })
      
      commit('setUserProfilePicture', fileUrl)
    }
  },

  modules: {
  }
})
