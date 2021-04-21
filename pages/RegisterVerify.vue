<template>
  <two-sided-panel title="کد تایید ایمیل">
    <template v-slot:pic>
      <v-img max-width="280px" max-height="280px"
             :src="require('../assets/images/Bitra_Logo_Final_Edition-18@3x.png')"/>
    </template>
    <div>
      <otp :loading="l.submit" class="mt-8" @send="onSubmit" @otp="token=$event" label="کد تایید"/>
    </div>
  </two-sided-panel>
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
        password: this.$store.state.credentials.password,
        referral_code: this.$store.state.credentials.referral_code,
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