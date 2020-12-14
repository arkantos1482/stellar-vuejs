<template>
  <v-row>
    <v-col>
      <otp @send="onSubmit" v-model="token"/>
    </v-col>
  </v-row>
</template>

<script>
import captcha from "@/mixins/captcha";
import Otp from "@/components/Otp";
import pstopper from "@/mixins/pstopper";

export default {
  components: {Otp},
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
      await this.$router.push('/')
      this.l.submit = false
    }
  }
}
</script>

<style scoped>

</style>