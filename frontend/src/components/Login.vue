<template>
  <div class="container">
    <h3>Login</h3>
    <b-form @submit="onSubmit">
      <b-form-group label="Email" label-for="email">
        <b-form-input id="email" type="email" v-model="form.email" required placeholder="Enter email"></b-form-input>
      </b-form-group>

      <b-form-group label="Password" label-for="password">
        <b-form-input id="password" type="password" v-model="form.password" required placeholder="Enter password"></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </div>
</template>

<script>
import api from '@/lib/api';
// import router from '@/router';

export default {
  name: 'login',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      api.login(this.form)
        .then((res) => {
          if(res.data.status === 'success') {
            this.$store.commit('logIn', res.data.data.jwt);
            this.$router.push('/');
            return;
          }
          this.$swal(res.data.message, 'warning');
        });
    },
  },
};
</script>

<style scoped>
</style>
