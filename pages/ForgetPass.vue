<template>
  <two-sided-panel title="بازیابی رمز عبور">
    <template v-slot:pic>
      <v-img max-width="280px" max-height="280px"
             :src="require('../assets/images/Bitra_Logo_Final_Edition-18@3x.png')"/>
    </template>
    <div dir="ltr">
      <v-form v-model="form" @submit.prevent="onSubmit" ref="form">
        <a-text-field eng :rules="[rules.required, rules.email]"
                      v-model="email" label="ایمیل"
                      class="mt-8"/>
        <v-btn type="submit" :loading="l.submit"
               block color="primary" class="mt-16 mb-8">ارسال ایمیل بازیابی
        </v-btn>
      </v-form>
      <div>
        <span class="">رمزتان را به خاطر دارید؟</span>
        <nuxt-link class="" to="/Login">ورود</nuxt-link>
      </div>
    </div>
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