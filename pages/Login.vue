<template>
  <two-sided-panel title="ورود به حساب کاربری">
    <div dir="ltr" style="padding-top: 96px">
      <v-form @submit.prevent="login" v-model="form" ref="form">
        <a-text-field
          :rules="[rules.required]"
          eng
          class="a-field"
          v-model="email"
          label="ایمیل"
        />
        <a-text-field
          :rules="[rules.required]"
          eng
          v-model="password"
          label="رمز عبور"
          :type="showPass ? 'text' : 'password'"
        >
          <v-icon class="px-2 py-1" size="20px" @click="showPass = !showPass">
            {{ showPass ? "mdi-eye" : "mdi-eye-off" }}
          </v-icon>
        </a-text-field>
        <div class="text-left mt-4">
          <nuxt-link class="pa-0 text-body-2" to="/ForgetPass"
            >رمز عبور خود را فراموش کرده ام
          </nuxt-link>
        </div>

        <v-btn
          type="submit"
          :loading="l.login"
          block
          color="primary"
          class="mt-12"
          >ورود
        </v-btn>
      </v-form>
      <a-row class="justify-center align-center mt-4">
        <nuxt-link to="/Register" class="pa-0 text-body-2"
          >ثبت نام کنید</nuxt-link
        >
        <p class="mb-0 text-body-2">&nbsp کاربر جدید هستید؟</p>
      </a-row>
    </div>

    <!--    <v-dialog v-model="notDesktopAlert">-->
    <!--      <v-card class="pt-12 pb-8 px-8 text-center" elevation=2>-->
    <!--        <div class="text-h3">توجه</div>-->
    <!--        <div class="mt-4  grey&#45;&#45;text text&#45;&#45;darken-1">طراحی نسخه موبایل در دست اقدام است.-->
    <!--          لطفا از نسخه دسکتاپ استفاده نمایید.-->
    <!--        </div>-->
    <!--        <v-btn text small class="mt-16" @click="notDesktopAlert = !notDesktopAlert">متوجه شدم</v-btn>-->
    <!--      </v-card>-->
    <!--    </v-dialog>-->
  </two-sided-panel>
</template>

<script>
import captcha from "@/mixins/captcha"
import ATextField from "@/components/ATextField"
import LoginRegCard from "@/components/LoginRegCard"

export default {
  components: { LoginRegCard, ATextField },
  mixins: [captcha],
  layout: "noToolbar",
  computed: {
    notDesktopAlert() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    },
  },
  data() {
    return {
      form: false,
      showPass: false,
      l: { login: false },
      email: "",
      password: "",
      rules: {
        required: (value) => !!value || "الزامی است",
        counter: (value) => value.length >= 6 || "حداقل ۶ کاراکتر",
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || "ایمیل درست نیست"
        },
        password: (value) => {
          // at least number - small - capital
          const pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).+$/
          return (
            pattern.test(value) ||
            "شامل حداقل یک حرف کوچک، یک حرف بزرگ، و یک عدد باشد"
          )
        },
      },
    }
  },
  methods: {
    async login() {
      this.$refs.form.validate()
      if (this.form) {
        this.l.login = true
        try {
          await this.getCaptcha()
          await this.$axios.$get("/csrf-cookie")
          const loginState = await this.$axios.$post("/login", {
            email: this.email,
            password: this.password,
            captcha_token: this.captcha_token,
          })
          if (loginState.meta === "success") {
            await this.$router.replace("/")
          } else if (loginState.meta === "token_needed") {
            this.$store.commit("credentials/set", {
              email: this.email,
              password: this.password,
            })
            await this.$router.push("/LoginOtp")
          }
        } finally {
          this.l.login = false
        }
      }
    },
  },
}
</script>

<style scoped>
.a-field fieldset {
  border: 1px solid #eee !important;
}
</style>
