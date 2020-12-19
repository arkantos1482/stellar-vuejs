<template>
  <login-reg-card title="ایجاد حساب کاربری"
                  subtitle="خوش آمدید">
    <v-card-text>
      <v-tabs>
        <v-tab>حقیقی</v-tab>
        <v-tab>حقوقی</v-tab>
      </v-tabs>
      <v-divider/>
      <a-text-field class="mt-4" label="ایمیل" v-model="email"/>
      <a-text-field type="password" label="رمز عبور" v-model="password"
                    hint="رمز عبور بایستی ترکیبی از اعداد و حروف کوچک و بزرگ و بزرگتر از ۶ حرف باشد"/>
      <a-text-field type="password" label="تکرار رمز عبور" v-model="passwordConfirm"/>
      <a-text-field filled label="کد معرف(اختیاری)" v-model="referral_code"/>
      <v-checkbox v-model="terms" class="mt-0">
        <template v-slot:label>
          <a @click="dialog.terms=true">قوانین و شرایط</a>
          <span>&nbsp;بیترا را می پذیرم.</span>
        </template>
      </v-checkbox>
      <v-btn @click="register" :loading="l.reg"
             class="mb-8" color="primary" block> تایید
      </v-btn>
      <span>قبلا ثبت نام کرده اید؟</span>
      <nuxt-link to="/Login">ورود</nuxt-link>
    </v-card-text>

    <v-dialog v-model="dialog.terms" max-width="400">
      <v-card>
        <v-card-title>شرایط و قوانین</v-card-title>
        <v-card-text>
          مجموعه قوانین به شرح زیر است
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog.terms=false" text color="primary">بله</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </login-reg-card>
</template>

<script>
import captcha from "@/mixins/captcha";
import pstopper from "@/mixins/pstopper";
import ATextField from "@/components/ATextField";
import LoginRegCard from "@/components/LoginRegCard";

export default {
  components: {ATextField, LoginRegCard},
  mixins: [captcha, pstopper],
  layout: 'noToolbar',
  data() {
    return {
      email: '',
      password: '',
      passwordConfirm: '',
      referral_code: this.$route.query.referral_code,
      terms: false,
      l: {reg: false},
      dialog: {terms: false}
    }
  },
  methods: {
    async register() {
      if (this.password !== '' && this.password === this.passwordConfirm) {
        if (this.terms === true) {
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
        } else {
          this.$bus.$emit('snack', 'شرایط و قوانین پذیرفته نشده است.', 'error')
        }
      } else {
        this.$bus.$emit('snack', 'رمز عبور و تکرار رمز عبور تطابق ندارند', 'error')
      }
    }
  }
}
</script>

<style scoped>

</style>