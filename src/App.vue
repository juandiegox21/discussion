<template>
  <div id="app">
    <b-navbar>

      <template slot="brand">
        <b-navbar-item tag="router-link" :to="(userIsLoggedIn) ? { path: '/dashboard' } : { path: '/' }">
          <img
            src="https://raw.githubusercontent.com/buefy/buefy/dev/static/img/buefy-logo.png"
            alt="Lightweight UI components for Vue.js based on Bulma"
          >
        </b-navbar-item>
      </template>

      <template slot="start">
        <b-navbar-item>
            <router-link to="/dashboard" v-if="userIsLoggedIn">Dashboard</router-link>
            <router-link to="/" v-else>Home</router-link>
        </b-navbar-item>
      </template>

      <template slot="end">
        <b-navbar-item tag="div">
          <!-- When the user is not logged in -->
          <div class="buttons" v-if="!userIsLoggedIn">

            <router-link to="/signup">
              <b-button type="is-primary">
                <strong>Sign Up</strong>
              </b-button>              
            </router-link>

            <router-link to="/login">
              <b-button type="is-light">Log In</b-button>
            </router-link>
          </div>
          <!-- When the user is logged in -->
          <div class="buttons" v-else>

            <router-link to="/settings">
              <b-button type="is-primary">
                <strong>Settings</strong>
              </b-button>              
            </router-link>

            <router-link to="/logout">
              <b-button type="is-light">Log out</b-button>
            </router-link>
          </div>
        </b-navbar-item>
      </template>

    </b-navbar>

    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    userIsLoggedIn() 
    {
      return Object.keys(this.$store.state.userProfile).length > 0
    }
  }
}
</script>

<style lang="scss">
  .content {
    padding: 10px;
  }
</style>
