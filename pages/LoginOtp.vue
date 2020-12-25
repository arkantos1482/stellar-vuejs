<template>
  <login-reg-card title="تایید کد دو عاملی"
                  subtitle="برای ایمن سازی حساب کاربری کد ۶رقمی که به موبایل شما ارسال شده را در کادر زیر وارد نمایید.">
    <otp :loading="l.submit" class="mt-8" @send="onSubmit" @otp="token=$event" label="کد تایید"/>
  </login-reg-card>
</template>

<script>
import captcha from "@/mixins/captcha";
import Otp from "@/components/Otp";
import pstopper from "@/mixins/pstopper";
import LoginRegCard from "@/components/LoginRegCard";

export default {
  components: {LoginRegCard, Otp},
  mixins: [captcha, pstopper],
  layout: 'noToolbar',
  data() {
    return {
      l: {submit: false},
      token: ''
    }
  },
  methods: {
    async onSubmit() {
      this.l.submit = true
      await this.getCaptcha()
      await this.$axios.$post('/login', {
        email: this.$store.state.credentials.email,
        password: this.$store.state.credentials.password,
        otp: this.token,
        captcha_token: this.captcha_token
      })
      this.$store.commit('credentials/reset')
      await this.$router.push('/')
      this.l.submit = false
    }
  }
}
</script>

<style scoped>

</style>