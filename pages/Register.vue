<template>
  <v-row justify="center" class="text-center">
    <v-col cols="6">
      <h1 class="mb-8">ثبت نام</h1>
      <v-text-field filled label="ایمیل" v-model="email"/>
      <v-text-field filled type="password" label="رمز عبور" v-model="password"/>
      <v-text-field filled label="کد معرف" v-model="referral_code"/>
      <v-btn @click="register" color="primary" :loading="l.reg">ثبت نام</v-btn>
      <v-btn to="/Login">ورود</v-btn>
    </v-col>
  </v-row>
</template>

<script>
import captcha from "@/mixins/captcha";
import pstopper from "@/mixins/pstopper";

export default {
  mixins: [captcha, pstopper],
  layout: 'noToolbar',
  data() {
    return {
      email: '',
      password: '',
      referral_code: null,
      l: {reg: false}
    }
  },
  methods: {
    async register() {
      this.l.reg = true

      await this.getCaptcha()
      await this.$axios.$get('/csrf-cookie')
      await this.$axios.$post('/register', {
        email: this.email,
        password: this.password,
        referral_code: this.referral_code,
        captcha_token: this.captcha_token
      })
      this.$store.commit('credentials/set', {email: this.email})
      await this.$router.push('/RegisterVerify')
      this.l.reg = false
    }
  }
}
</script>

<style scoped>

</style>