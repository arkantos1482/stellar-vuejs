<template>
  <v-row justify="center" class="text-center">
    <v-col cols="6">
      <h1 class="mb-8"> ورود </h1>
      <v-text-field filled v-model="email" label="ایمیل"/>
      <v-text-field filled v-model="password" label="رمز عبور" type="password"/>
      <v-btn @click="login" :loading="l.login" color="primary">ورود</v-btn>
      <v-btn to="/Register">ثبت نام</v-btn>
      <div class="mt-4">
        <nuxt-link to="/ForgetPass">فراموشی رمز عبور</nuxt-link>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import captcha from "@/mixins/captcha";

export default {
  mixins: [captcha],
  layout: 'noToolbar',
  data() {
    return {
      l: {login: false},
      email: '',
      password: '',
    }
  },
  methods: {
    async login() {
      this.l.login = true
      try {
        await this.$axios.$get('/csrf-cookie')
        const loginState = await this.$axios.$post('/login',
            {email: this.email, password: this.password, captcha_token: this.captcha_token});
        if (loginState.meta === 'success') {
          await this.$router.replace('/')
        } else if (loginState.meta === 'token_needed') {
          this.$store.commit('login/set', {email: this.email, password: this.password})
          await this.$router.push('/LoginOtp')
        }

        // await this.$axios.$post('/otp-send', {email: this.email})
        // this.$store.commit('otp/set', {
        //   url: '/login',
        //   data: {email: this.email, password: this.password, captcha_token: this.captcha_token},
        //   route: '/'
        // })
      } finally {
        this.l.login = false
      }
    },
  }
}
</script>

<style scoped>

</style>