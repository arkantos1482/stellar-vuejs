<template>
  <v-row justify="center" class="text-center">
    <v-col cols="6">
      <h1 class="mb-8">ثبت نام</h1>
      <v-text-field filled label="ایمیل" v-model="email"/>
      <v-text-field filled type="password" label="رمز عبور" v-model="password"/>
      <v-btn @click="register" color="primary" :loading="l.reg">ثبت نام</v-btn>
      <v-btn to="/Login">ورود</v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'noToolbar',
  data() {
    return {
      email: '',
      password: '',
      l: {reg: false}
    }
  },
  methods: {
    async register() {
      this.l.reg = true
      try {
        await this.$axios.$get('/csrf-cookie')
        await this.$axios.$post('/otp-send', {email: this.email})
        this.$store.commit('otp/set', {
          url: '/register',
          data: {email: this.email, password: this.password},
          route: '/'
        })
        await this.$router.push('/Otp')
      } finally {
        this.l.reg = false
      }
    }
  }
}
</script>

<style scoped>

</style>