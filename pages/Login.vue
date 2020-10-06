<template>
  <v-row justify="center">
    <v-col cols="6">
      <h1> ورود </h1>
      <v-text-field v-model="email" label="ایمیل"/>
      <v-text-field v-model="password" label="رمز عبور" type="password"/>
      <v-btn @click="login" color="primary">ورود</v-btn>
      <v-btn @click="register">ثبت نام</v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  auth: false,
  name: "Login",
  layout: 'noToolbar',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async login() {
      await this.$auth.loginWith('local', {data: {email: this.email, password: this.password}});
      await this.$router.replace('/')
    },
    register() {
      this.$axios.$post('/register', {name: 'fake', email: this.email, password: this.password})
    }
  }
}
</script>

<style scoped>

</style>