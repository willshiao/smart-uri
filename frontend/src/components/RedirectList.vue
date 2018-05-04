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
    <b-button v-if="isAdmin" v-on:click="downloadRequests">Download Requests</b-button>
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
        { key: 'defaultTarget', sortable: true, name: 'Default Target' },
        'delete',
      ],
      deleteDisabled: false,
      user: store.getters.user,
      isAdmin: store.getters.user.role >= 10,
    };
    if(data.isAdmin) {
      data.fields.splice(3, 0, { key: 'owner', sortable: true });
    }
    return data;
  },
  methods: {
    downloadRequests() {
      api.request('api/requests', { responseType: 'blob' })
        .then((res) => {
          const timeStr = (new Date())
            .toDateString()
            .split(' ')
            .join('_');
          const dataUrl = URL.createObjectURL(res.data);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.style = 'display: none';
          a.href = dataUrl;
          a.download = `requests-${timeStr}.txt`;
          a.click();
          a.remove();
          URL.revokeObjectURL(dataUrl);
        });
    },
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