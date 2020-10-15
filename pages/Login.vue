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
      logLoading: false,
      regLoading: false,
      email: '',
      password: ''
    }
  },
  methods: {
    async login() {
      try {
        this.logLoading = true
        await this.$auth.login({data: {email: this.email, password: this.password}});
        this.logLoading = false
        await this.$router.replace('/')
      } catch (e) {
        this.logLoading = false
      }
    },
    async register() {
      try {
        this.logLoading = true
        let token = await this.$axios.$post('/register', {email: this.email, password: this.password});
        await this.$auth.setUserToken(token)
        this.logLoading = false
        await this.$router.replace('/')
      } catch (e) {
        this.logLoading = false
      }
    }
  }
}
</script>

<style scoped>

</style>