<template>
  <nav class="navbar navbar-toggleable-md navbar-inverse bg-primary">
    <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <a class="navbar-brand" href="#">SmartURI</a>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <router-link tag="li" to="/">
          <a class="nav-link">Home</a>
        </router-link>
        <router-link tag="li" to="/redirect" v-if="loggedIn">
          <a class="nav-link">Add Redirect</a>
        </router-link>
      </ul>
      <ul class="navbar-nav ml-auto">
        <router-link tag="li" to="/register" v-if="!loggedIn">
          <a class="nav-link">Register</a>
        </router-link>
        <router-link tag="li" to="/login" v-if="!loggedIn">
          <a class="nav-link">Login</a>
        </router-link>
        <li v-if="loggedIn">
          <a class="nav-link" href="#" v-on:click.prevent='logout'>Logout</a>
        </li>
      </ul>
    </div>
  </nav>
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
