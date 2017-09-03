<template>
  <b-navbar toggleable="lg" type="dark" variant="primary">
    <b-nav-toggle target="nav_collapse"></b-nav-toggle>

    <b-navbar-brand to="/">Smart URI</b-navbar-brand>

    <b-collapse is-nav id="nav_collapse">

      <b-nav is-nav-bar>
        <b-nav-item to="/home">Home</b-nav-item>
        <b-nav-item v-if="loggedIn" to="/redirect">Add Redirect</b-nav-item>
      </b-nav>

      <b-nav is-nav-bar class="ml-auto">
        <b-nav-item v-if="!loggedIn" to="/login">Login</b-nav-item>
        <b-nav-item v-if="!loggedIn" to="/register">Register</b-nav-item>

        <b-nav-item-dropdown right v-if="loggedIn">
          <template slot="button-content">
            User
          </template>
          <b-dropdown-item v-on:click.prevent='logout'>Log Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-nav>

    </b-collapse>
  </b-navbar>
</template>


<script>
export default {
  name: 'navbar',
  data() {
    return {};
  },
  methods: {
    logout() {
      this.$store.commit('logOut');
    },
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
  },
};
</script>


<style scoped>
</style>
