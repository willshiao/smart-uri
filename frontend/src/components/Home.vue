<template>
<div class="container">
  <div v-if="loggedIn">
    <p>Hello! You are logged in as {{user.email}}.</p>
    <p>Get started by adding a redirect <router-link to="/redirect">here</router-link>.</p>
  </div>
  <div v-else>
    Welcome to SmartURI.
  </div>
</div>
</template>

<script>
import store from '@/store';

export default {
  name: 'home',
  data() {
    return {
      user: store.getters.user,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
