<template>
  <login-reg-card title="بازیابی رمز عبور"
                  subtitle="برای بازیابی رمز عبور ایمیلی که با آن ثبت نام نموده اید را وارد نمایید.">
    <a-text-field v-model="email" label="ایمیل"
                  class="mt-8"/>
    <v-btn @click="onSubmit" :loading="l.submit"
           block color="primary" class="mt-8">تایید
    </v-btn>
  </login-reg-card>
</template>

<script>
import captcha from "@/mixins/captcha";
import pstopper from "@/mixins/pstopper";
import LoginRegCard from "@/components/LoginRegCard";
import ATextField from "@/components/ATextField";

export default {
  components: {ATextField, LoginRegCard},
  mixins: [captcha, pstopper],
  layout: 'noToolbar',
  data() {
    return {
      l: {submit: false},
      email: ''
    }
  },
  methods: {
    async onSubmit() {
      this.l.submit = true
      await this.getCaptcha()
      await this.$axios.$get('/csrf-cookie')
      await this.$axios.$post('/forget-pass', {
        email: this.email,
        captcha_token: this.captcha_token
      })
      this.$store.commit("credentials/set", {email: this.email})
      this.l.submit = false
      await this.$router.push('/ForgetPassVerify')
    }
  }
}
</script>

<style scoped>

</style>