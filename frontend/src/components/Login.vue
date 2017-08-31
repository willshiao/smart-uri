<template>
<div class="d-flex align-items-center flex-column justify-content-center h-100 bg-dark text-white" id="header">
    <h3>Login</h3>
    <b-form @submit="onSubmit" class="col-3 mx-auto">
        <div class="form-group">
          <b-form-input id="email" type="email" v-model="form.email" required placeholder="Email" class="form-control-lg"></b-form-input>
        </div>
        <div class="form-group">
            <b-form-input id="password" type="password" v-model="form.password" required placeholder="Password" class="form-control-lg"></b-form-input>
        </div>
        <div class="form-group">
          <b-button type="submit" variant="primary" class="btn-lg btn-block" v-bind:class="{ disabled: loginPending }">Sign In</b-button>
        </div>
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
      loginPending: false,
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.loginPending = true;
      api.login(this.form)
        .then((res) => {
          if(res.data.status === 'success') {
            this.$store.commit('logIn', res.data.data.jwt);
            this.$router.push('/');
            return;
          }
          this.loginPending = false;
          this.$swal({
            title: 'Failed to log in',
            text: res.data.message,
            type: 'warning',
          });
        });
    },
  },
};
</script>

<style scoped>
#header {
  padding-top: 10%;
}
#header > h3 {
  color: black;
}
</style>
