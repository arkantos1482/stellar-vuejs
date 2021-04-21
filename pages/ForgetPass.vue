<template>
  <two-sided-panel>
    <login-reg-card dir="ltr" title="بازیابی رمز عبور">
      <v-form v-model="form" @submit.prevent="onSubmit" ref="form">
        <a-text-field eng :rules="[rules.required, rules.email]"
                      v-model="email" label="ایمیل"
                      class="mt-8"/>
        <v-btn type="submit" :loading="l.submit"
               block color="primary" class="mt-16 mb-8">ارسال ایمیل بازیابی
        </v-btn>
      </v-form>
      <div>
        <span class="text-h6">رمزتان را به خاطر دارید؟</span>
        <nuxt-link class="text-h6" to="/Login">ورود</nuxt-link>
      </div>
    </login-reg-card>
  </two-sided-panel>
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
      form: false,
      email: '',
      rules: {
        required: value => !!value || 'الزامی است',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'ایمیل درست نیست'
        },
      }
    }
  },
  methods: {
    async onSubmit() {
      this.$refs.form.validate()
      if (this.form) {
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
}
</script>

<style scoped>

</style>