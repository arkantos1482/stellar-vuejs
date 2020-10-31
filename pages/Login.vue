<template>
  <v-row justify="center">
    <v-col cols="6">
      <h1> ورود </h1>
      <v-text-field v-model="email" label="ایمیل"/>
      <v-text-field v-model="password" label="رمز عبور" type="password"/>
      <v-btn @click="login" :loading="loading" color="primary">ورود</v-btn>
      <v-btn to="/Register">ثبت نام</v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  auth: false,
  layout: 'noToolbar',
  data() {
    return {
      loading: false,
      email: '',
      password: ''
    }
  },
  methods: {
    async login() {
      this.loading = true
      try {
        await this.$auth.login({data: {email: this.email, password: this.password}});
        await this.$router.replace('/')
      } catch (e) {
        this.logLoading = false
      }
    },
  }
}
</script>

<style scoped>

</style>