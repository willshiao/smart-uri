<template>
  <div class="container">
    <h3>Register</h3>

    <div class="alert alert-danger" role="alert" v-if="errorMessage">
      {{errorMessage}}
    </div>

    <b-form @submit="onSubmit">
      <b-form-group label="Email" label-for="email">
        <b-form-input id="email" type="email" v-model="form.email" required placeholder="Enter email"></b-form-input>
      </b-form-group>

      <b-form-group label="Password" label-for="password">
        <b-form-input id="password" type="password" v-model="form.password" required placeholder="Enter password"></b-form-input>
      </b-form-group>

      <b-form-group label="Confirm Password" label-for="confirm-password">
        <b-form-input id="confirm-password" type="password" v-model="form.confirmPassword" required placeholder="Confirm password" :state="confirmPasswordState"></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="secondary">Reset</b-button>
    </b-form>
  </div>
</template>

<script>
import api from '@/lib/api';

export default {
  name: 'register',
  data() {
    return {
      form: {
        email: '',
        password: '',
        confirmPassword: '',
      },
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      if(!this.errorMessage) {
        api.register(this.form)
          .then((res) => {
            if(res.data.status === 'success') {
              this.$swal({
                title: 'Success',
                text: 'Registered successfully.',
                type: 'success',
              })
                .then(() => {
                  this.$store.commit('logIn', res.data.data.jwt);
                  this.$router.push('/');
                });
            } else {
              this.$swal({
                title: 'Failed to register',
                text: res.data.message,
                type: 'warning',
              });
            }
          });
      }
    },
  },
  computed: {
    errorMessage() {
      if(this.form.confirmPassword && this.form.password !== this.form.confirmPassword) return 'Passwords don\'t match';
      return false;
    },
  },
};
</script>

<style scoped>
</style>
