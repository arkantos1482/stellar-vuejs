<template>
  <titled-page title="امنیت">
    <div class="py-8 px-12">
      <a-row class="align-center">
        <v-icon color="grey" large>mdi-google</v-icon>
        <div class="mr-4" style="margin-left: 240px">
          <p class="mb-2">کد دو عاملی</p>
          <p class="mb-0 text-body-2 grey--text">
            برای برداشت و اصلاحات امنیتی استفاده می شود
          </p>
        </div>
        <v-btn
          :loading="l.toggleTotp"
          @click="onTotpToggle"
          small
          outlined
          color="primary"
          class="px-6"
        >
          {{ totpBtnText }}
        </v-btn>
      </a-row>

      <v-divider class="my-6" />

      <a-row class="align-center">
        <v-icon color="grey" large>mdi-google</v-icon>
        <div class="mr-4" style="margin-left: 240px">
          <p class="mb-2">احراز هویت از طریق پیامک</p>
          <p class="mb-0 text-body-2 grey--text">
            برای برداشت و اصلاحات امنیتی استفاده می شود
          </p>
        </div>
        <v-btn
          @click="onSmsToggle"
          :loading="l.toggleSms"
          small
          outlined
          color="primary"
          class="px-6"
        >
          {{ smsBtnText }}
        </v-btn>
      </a-row>
    </div>

    <a-row class="pt-3">
      <v-col cols="6" class="pr-0">
        <v-card width="100%" class="pa-6">
          <card-title-with-chevron
            title="مدیریت دستگاه ها"
            icon="mdi-monitor-cellphone"
          />
        </v-card>
      </v-col>

      <v-col cols="6" class="pl-0">
        <v-card width="100%" class="pa-6" @click="d.changePass = true">
          <card-title-with-chevron title="تغییر رمز عبور" icon="mdi-lock" />
        </v-card>
      </v-col>
    </a-row>

    <!--    TOTP DIALOG-->
    <v-dialog v-model="d.totp" width="600">
      <v-card class="px-12 py-6">
        <div class="text-center">
          <p>
            کیوآرکد زیر را در نرم افزار Google Authenticator یا Authy یا شبیه آن
            اسکن نمایید.
          </p>
          <vue-qrcode :value="totp_url" />
          <v-divider class="my-4" />
          <p>
            اگر در اسکن مشکلی دارید، می توانید کد زیر را به صورت دستی وارد کنید.
            شما می توانید این کد را در جایی امن ذخیره نموده و در صورت گم کردن
            گوشی همراه خود در گوشی جدید وارد کنید.
          </p>
          <p class="mt-4">{{ totp_secret }}</p>
          <v-divider class="my-4" />
          <p>برای فعال سازی، رمز یکبار مصرف را وارد نمایید.</p>
          <div>
            <PincodeInput
              class="dark"
              dir="ltr"
              v-model="totp_code"
              :length="6"
            />
          </div>
          <v-btn
            :loading="l.toggleTotp"
            @click="activateTotp"
            color="primary"
            class="mt-2"
            >فعال سازی
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!--    CHANGE PASS DIALOG-->
    <v-dialog v-model="d.changePass">
      <a-card divider class="mt-4" title="تغییر رمز عبور">
        <v-row justify="center">
          <v-col cols="4">
            <v-form @submit.prevent="changePass" v-model="form" ref="form">
              <a-text-field
                eng
                :type="showPass ? 'text' : 'password'"
                label="رمز عبور فعلی"
                v-model="dto.old_password"
              >
                <v-icon
                  class="px-2 py-1"
                  size="20px"
                  @click="showPass = !showPass"
                >
                  {{ showPass ? "mdi-eye" : "mdi-eye-off" }}
                </v-icon>
              </a-text-field>

              <a-text-field
                eng
                :type="showPass ? 'text' : 'password'"
                :rules="[rules.required, rules.password, rules.counter]"
                label="رمز عبور جدید"
                v-model="dto.new_password"
              >
                <v-icon
                  class="px-2 py-1"
                  size="20px"
                  @click="showPass = !showPass"
                >
                  {{ showPass ? "mdi-eye" : "mdi-eye-off" }}
                </v-icon>
              </a-text-field>
              <a-text-field
                eng
                :type="showPass ? 'text' : 'password'"
                label="تکرار رمز عبور جدید"
                v-model="repeatNewPass"
              >
                <v-icon
                  class="px-2 py-1"
                  size="20px"
                  @click="showPass = !showPass"
                >
                  {{ showPass ? "mdi-eye" : "mdi-eye-off" }}
                </v-icon>
              </a-text-field>

              <div class="text-center mt-8">
                <v-btn
                  type="submit"
                  :loading="l.changePass"
                  color="error"
                  depressed
                >
                  تغییر رمز عبور
                </v-btn>
              </div>
            </v-form>
          </v-col>
        </v-row>
      </a-card>
    </v-dialog>
  </titled-page>
</template>

<script>
import VueQrcode from "vue-qrcode"
import ACard from "@/components/ACard"
import pstopper from "@/mixins/pstopper"
import ATextField from "@/components/ATextField"
import { error, success } from "@/models/snackBus"
import PincodeInput from "vue-pincode-input"
import TitledPage from "~/components/TitledPage.vue"

export default {
  components: { TitledPage, ATextField, ACard, VueQrcode, PincodeInput },
  mixins: [pstopper],
  computed: {
    getSmsToggled() {
      return this.mfa_method === "sms" ? "none" : "sms"
    },
    // getTotpToggled() {
    //   return this.mfa_method === 'totp' ? 'none' : 'totp'
    // },
    smsBtnText() {
      return this.mfa_method === "sms" ? "غیرفعال سازی" : "فعال سازی"
    },
    totpBtnText() {
      return this.mfa_method === "totp" ? "غیرفعال سازی" : "فعال سازی"
    },
  },
  data() {
    return {
      mfa_method: "",
      totp_url: "",
      totp_secret: "",
      totp_code: "",
      dto: {
        old_password: "",
        new_password: "",
      },
      repeatNewPass: "",
      showPass: false,
      form: false,
      l: { toggleSms: false, changePass: false, toggleTotp: false },
      d: { changePass: false, totp: false },
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
  async mounted() {
    this.mfa_method = (await this.$axios.$get("/profiles/me")).mfa_method
  },
  methods: {
    async onSmsToggle() {
      this.l.toggleSms = true
      this.mfa_method = await this.$axios.$post("/profiles/me/mfa", {
        mfa_method: this.getSmsToggled,
      })
      this.l.toggleSms = false
    },
    async onTotpToggle() {
      if (this.mfa_method === "totp") {
        this.l.toggleTotp = true
        this.mfa_method = await this.$axios.$post("/profiles/me/mfa", {
          mfa_method: "none",
        })
        this.l.toggleTotp = false
      } else {
        let totp = await this.$axios.$get("/profiles/me/mfa/totp")
        this.totp_url = totp.url
        this.totp_secret = totp.secret
        this.d.totp = true
      }
    },
    async activateTotp() {
      this.l.toggleTotp = true
      this.mfa_method = await this.$axios.$post("/profiles/me/mfa", {
        mfa_method: "totp",
        totp_code: this.totp_code,
      })
      this.l.toggleTotp = false
      this.d.totp = false
    },

    async changePass() {
      this.$refs.form.validate()
      if (this.form) {
        if (this.dto.new_password === this.repeatNewPass) {
          this.l.changePass = true
          await this.$axios.$post("/change-pass", this.dto)
          this.l.changePass = false
          success("رمز عبور با موفقیت تغییر داده شد.")
        } else {
          error("رمز عبور با تکرار تطابق ندارد.")
        }
      }
    },
  },
}
</script>

<style scoped></style>
