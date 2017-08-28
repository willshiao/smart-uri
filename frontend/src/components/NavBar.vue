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
        <router-link tag="li" to="/redirect">
          <a class="nav-link">Add Redirect</a>
        </router-link>
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
};
</script>


<style scoped>
</style>