<template>
  <login-reg-card title="کد تایید ایمیل"
                  subtitle="کد تایید ۶رقمی ارسال شده به ایمیل خود را وارد کنید.">
    <otp :loading="l.submit" class="mt-8" @send="onSubmit" @otp="token=$event" label="کد تایید"/>
  </login-reg-card>
</template>

<script>
import captcha from "@/mixins/captcha";
import Otp from "@/components/Otp";
import pstopper from "@/mixins/pstopper";
import LoginRegCard from "@/components/LoginRegCard";

export default {
  components: {Otp, LoginRegCard},
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
      await this.$axios.$post('/verify-email', {
        email: this.$store.state.credentials.email,
        otp: this.token,
        captcha_token: this.captcha_token
      })

      this.$store.commit('credentials/reset')
      await this.$router.push('/users/me')
      this.l.submit = false
    }
  }
}
</script>

<style scoped>

</style>