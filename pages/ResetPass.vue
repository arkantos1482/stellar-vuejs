<template>
  <login-reg-card dir="ltr" title="ایجاد رمز عبور جدید">
    <v-form v-model="form" @submit.prevent="onSend" ref="form">
      <a-text-field eng :rules="[rules.required, rules.password, rules.counter]"
                    :type="showPass ? 'text' : 'password'" v-model="password" label="رمز عبور"
                    class="mt-16">
        <v-icon class="px-2 py-1" size="20px" @click="showPass = !showPass">
          {{ showPass ? 'mdi-eye' : 'mdi-eye-off' }}
        </v-icon>
      </a-text-field>
      <a-text-field eng :type="showPass ? 'text' : 'password'" v-model="passwordConfirm" label="تکرار رمز عبور">
        <v-icon class="px-2 py-1" size="20px" @click="showPass = !showPass">
          {{ showPass ? 'mdi-eye' : 'mdi-eye-off' }}
        </v-icon>
      </a-text-field>
      <v-btn :loading="l.send" type="submit"
             block color="primary" class="mt-8">تایید
      </v-btn>
    </v-form>
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
      showPass: false,
      l: {send: false},
      password: '',
      passwordConfirm: '',
      form: false,
      rules: {
        required: value => !!value || 'الزامی است',
        counter: value => value.length >= 6 || 'حداقل ۶ کاراکتر',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'ایمیل درست نیست'
        },
        password: value => {
          // at least number - small - capital
          const pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).+$/
          return pattern.test(value) || 'شامل حداقل یک حرف کوچک، یک حرف بزرگ، و یک عدد باشد'
        },
      }
    }
  },
  methods: {
    async onSend() {
      this.$refs.form.validate()
      if (this.form) {
        if (this.password === this.passwordConfirm) {
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
          this.$bus.$emit('snack', 'رمز عبور با تکرار رمز تطابق ندارند', 'error')
        }
      }
    }
  }
}
</script>

<style scoped>

</style>