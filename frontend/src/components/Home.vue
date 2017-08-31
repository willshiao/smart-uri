<template>
  <div class="container">Hello {{loggedIn}}</div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {};
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
