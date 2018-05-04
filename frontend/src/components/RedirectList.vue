<template>
  <div class="container">
    <h3>Redirects</h3>
    <b-table striped hover :items="redirects" :fields='fields'>
      <template slot="delete" scope="data">
        <b-button variant="danger" v-on:click="deleteRow(data.item._id)" :disabled="deleteDisabled">Delete</b-button>
      </template>

      <template slot="owner" scope="data">
        {{data.item.owner.email}}
      </template>
    </b-table>
  </div>
</template>

<script>
import api from '@/lib/api';
import store from '@/store';

export default {
  name: 'redirect-list',
  data() {
    const data = {
      redirects: [],
      fields: [
        { key: 'name', sortable: true },
        { key: 'slug', sortable: true },
        { key: 'enabled', sortable: true },
        'delete',
      ],
      deleteDisabled: false,
      user: store.getters.user,
    };
    if(data.user.role >= 10) {
      data.fields.splice(3, 0, { key: 'owner', sortable: true });
    }
    return data;
  },
  methods: {
    deleteRow(id) {
      this.deleteDisabled = true;
      api.request(`api/redirects/${id}`, { method: 'DELETE' })
        .then((res) => {
          if(res.data.status === 'success') {
            this.redirects = this.redirects.filter(redir => redir._id !== id);
          } else {
            this.$swal({ type: 'error', title: 'Failed to delete redirect', text: res.data.message || 'Failed to delete redirect.' });
          }
          this.deleteDisabled = false;
        });
    },
  },
  mounted() {
    api.request('api/redirects', { method: 'GET' })
      .then((res) => {
        if(res.data.status === 'success') {
          this.redirects = res.data.data;
        } else {
          this.$swal({ type: 'error', title: 'Failed to fetch list', text: res.data.message || 'Failed to fetch list.' });
        }
      });
  },
};
</script>

<style scoped>
</style>