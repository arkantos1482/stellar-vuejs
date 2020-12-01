<template>
  <v-row justify="center">
    <v-col cols="6">
      <h1> ورود </h1>
      <v-text-field v-model="email" label="ایمیل"/>
      <v-text-field v-model="password" label="رمز عبور" type="password"/>
      <v-btn @click="login" :loading="loading" color="primary">ورود</v-btn>
      <v-btn to="/Register">ثبت نام</v-btn>
      <div class="mt-4">
        <nuxt-link to="/ForgetPass">فراموشی رمز عبور</nuxt-link>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
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
        await this.$axios.$get('/csrf-cookie')
        await this.$axios.$post('/otp-send', {email: this.email})
        this.$store.commit('otp/set', {
          url: '/login',
          data: {email: this.email, password: this.password},
          route: '/'
        })
        await this.$router.push('/Otp')
        // await this.$auth.login({data: {email: this.email, password: this.password}});
        // await this.$router.replace('/')
      } finally {
        this.loading = false
      }
    },
  }
}
</script>

<style scoped>

</style>