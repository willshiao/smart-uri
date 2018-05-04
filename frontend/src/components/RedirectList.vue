<template>
  <div class="container">
    <h3>Redirects</h3>
    <b-table striped hover :items="redirects" :fields='fields'></b-table>
  </div>
</template>

<script>
import api from '@/lib/api';

export default {
  name: 'redirect-list',
  data() {
    return {
      redirects: [],
      fields: [
        'name',
        'slug',
        'enabled',
      ],
    };
  },
  mounted() {
    api.request('api/redirects', {
      method: 'GET',
    }).then((res) => {
      if(res.data.status === 'success') {
        this.redirects = res.data.data;
      }
    });
  },
};
</script>

<style scoped>
</style>