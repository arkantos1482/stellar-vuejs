<template>
  <login-reg-card title="ایجاد رمز عبور جدید">
    <a-text-field :rules="[rules.required, rules.password, rules.counter]"
                  hint="رمز عبور بایستی ترکیبی از اعداد و حروف کوچک و بزرگ و بزرگتر از ۶ حرف باشد"
                  type="password" v-model="password" label="رمز عبور"
                  class="mt-16"/>
    <a-text-field type="password" v-model="passwordConfirm" label="تکرار رمز عبور"/>
    <v-btn :loading="l.send" @click="onSend"
           block color="primary" class="mt-8">تایید
    </v-btn>
  </login-reg-card>
</template>

<script>
import captcha from "@/mixins/captcha";
import pstopper from "@/mixins/pstopper";
import ATextField from "@/components/ATextField";
import LoginRegCard from "@/components/LoginRegCard";

export default {
  components: {LoginRegCard, ATextField},
  mixins: [captcha, pstopper],
  layout: 'noToolbar',
  data() {
    return {
      l: {send: false},
      password: '',
      passwordConfirm: '',
      rules: {
        required: value => !!value || 'الزامی است',
        counter: value => value.length >= 6 || 'حداقل ۶ کاراکتر',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'ایمیل درست نیست.'
        },
        password: value => {
          // at least number - small - capital
          const pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).+$/
          return pattern.test(value) || 'شامل حداقل یک حرف کوچک، یک حرف بزرگ، و یک عدد باشد.'
        },
      }
    }
  },
  methods: {
    async onSend() {
      if (this.password === this.passwordConfirm
          && typeof this.rules.required(this.password !== 'string')
          && typeof this.rules.password(this.password) !== 'string') {
        this.loading = true
        await this.getCaptcha()
        await this.$axios.$post('/reset-pass', {
          email: this.$store.state.credentials.email,
          password: this.password,
          otp: this.$store.state.credentials.otp,
          captcha_token: this.captcha_token
        })
        this.$store.commit('credentials/reset')
        await this.$router.push('/Login')
        this.loading = false
      } else {
        this.$bus.$emit('snack', 'رمز عبور نامناسب است ویا با تکرار رمز عبور تطابق ندارند', 'error')
      }
    }
  }
}
</script>

<style scoped>

</style>