<template>
  <div>
    <v-card class="d-flex align-stretch" style="height: 80vh">
      <v-col cols="3" class="secondary d-flex justify-end">
        <div class="text-h4 d-flex flex-column justify-space-between align-end ml-n5 mb-16">
          <v-row align="center">
            <div class="ml-6" :class="stepTextColor(0)">اطلاعات شخصی</div>
            <v-avatar :class="circleTextColor(0)" :color="circleColor(0)" size="42">1</v-avatar>
          </v-row>
          <v-row align="center">
            <div class="ml-6" :class="stepTextColor(1)">اطلاعات مالی</div>
            <v-avatar :class="circleTextColor(1)" :color="circleColor(1)" size="42">2</v-avatar>
          </v-row>
          <v-row align="center">
            <div class="ml-6" :class="stepTextColor(2)">اطلاعات تکمیلی</div>
            <v-avatar :class="circleTextColor(2)" :color="circleColor(2)" size="42">3</v-avatar>
          </v-row>
        </div>
      </v-col>

      <v-col cols="9">
        <v-window vertical reverse v-model="stepNum" style="padding: 32px 96px ">
          <v-window-item>
            <v-row>
              <v-col cols="6">
                <a-text-field
                    v-model="user.name" label="نام"/>
                <a-text-field
                    v-model="user.last_name" label="نام خانوادگی"/>
              </v-col>
              <v-col cols="6">
                <a-text-field
                    v-model="user.ssn" label="کد ملی"/>

                <a-text-field
                    v-model="user.cell_phone" label="موبایل">
                  <v-btn @click="requestMobileOtp" :loading="l.mobileRequest"
                         outlined tile depressed small class="primary--text py-4" color="primary lighten-4">دریافت کد
                    تایید
                  </v-btn>
                </a-text-field>

              </v-col>
            </v-row>
            <v-row class="mt-n4">
              <v-col cols="6">
                <div>
                  <p class="text-h6 mb-1 mt-2">تصویر کارت ملی</p>
                  <vue2-dropzone :options="dropzoneOptions.ssn" :useCustomSlot=true>
                    <v-row align="center">
                      <v-icon color="primary">mdi-camera</v-icon>
                      <div class="text-h6 mr-2">تصویر مربوطه را بارگذاری نمایید.</div>
                    </v-row>
                  </vue2-dropzone>
                </div>

              </v-col>
            </v-row>
          </v-window-item>
          <v-window-item>
            <v-row justify="center">
              <v-col cols="6">
                <a-text-field
                    v-model="user.bank_card" label="شماره کارت"/>
                <a-text-field
                    v-model="user.bank_shaba" label="شماره شبا"/>
              </v-col>
              <v-col cols="6">
                <a-text-field
                    v-model="user.bank_account" label="شماره حساب"/>
                <v-row class="mt-n4">
                  <v-col>
                    <div>
                      <p class="text-h6 mb-1 mt-6">تصویر کارت بانکی</p>
                      <vue2-dropzone :options="dropzoneOptions.bankCard" :useCustomSlot=true>
                        <v-row align="center">
                          <v-icon color="primary">mdi-camera</v-icon>
                          <div class="text-h6 mr-2">تصویر مربوطه را بارگذاری نمایید.</div>
                        </v-row>
                      </vue2-dropzone>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-window-item>
          <v-window-item>
            <v-row>
              <v-col cols="6">
                <a-text-field
                    v-model="user.city" label="شهر"/>
                <a-text-field
                    v-model="user.address" label="آدرس"/>
              </v-col>
              <v-col cols="6">
                <a-text-field
                    v-model="user.postal_code" label="کدپستی"/>
                <a-text-field v-model="user.phone" label="تلفن ثابت">
                  <v-btn outlined tile depressed small class="primary--text py-4" color="primary lighten-4"
                         @click="requestPhoneOtp" :loading="l.phoneRequest">دریافت کد تایید
                  </v-btn>
                </a-text-field>

              </v-col>
            </v-row>
            <v-row class="mt-n4">
              <v-col cols="6">
                <div>
                  <p class="text-h6 mb-1 mt-2">تصویر قبض تلفن یا قبوض خدماتی</p>
                  <vue2-dropzone :options="dropzoneOptions.bill" :useCustomSlot=true>
                    <v-row align="center">
                      <v-icon color="primary">mdi-camera</v-icon>
                      <div class="text-h6 mr-2">تصویر مربوطه را بارگذاری نمایید.</div>
                    </v-row>
                  </vue2-dropzone>
                </div>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
        <!--        <div>-->
        <div style=" position: absolute; bottom: 0; width: 100%">
          <v-divider class="my-0 ml-6"/>
          <div class="d-flex py-4">
            <v-btn style="border: 1px solid #0074ff" class="px-16 ml-2" outlined color="primary" @click=prev text>
              {{ prevLabel }}
            </v-btn>
            <v-btn class="px-16" @click=next :loading="l.send" color="primary"> {{ nextLabel }}</v-btn>
          </div>
        </div>
      </v-col>
    </v-card>

    <div>
      <v-dialog v-model="dialog.send" max-width="400">
        <a-card title="ارسال مشخصات"
                subtitle="آیا از ارسال مشخصات خود اطمینان دارید؟ در صورت ارسال مشخصات فرایند تایید مدارک مجددا انجام خواهند شد.">
          <v-card-actions class="mt-12 pa-0">
            <v-btn text color="primary" @click="send">ارسال</v-btn>
            <v-btn text @click="dialog.send=false">انصراف</v-btn>
          </v-card-actions>
        </a-card>
      </v-dialog>

      <v-dialog v-model="dialog.mobileOtp" max-width="400">
        <a-card title="احراز اصالت موبایل"
                subtitle="برای ایمن سازی حساب کاربری کد ۶رقمی که به موبایل  شما ارسال شده را در کادر زیر وارد نمایید.">
          <otp :loading="l.mobileSubmit" class="mt-8" @send="submitMobileOtp" @otp="mobile.otp=$event"
               label="کد تایید"/>
        </a-card>
      </v-dialog>

      <v-dialog v-model="dialog.phoneOtp" max-width="400">
        <a-card title="احراز اصالت تلفن ثابت"
                subtitle="برای ایمن سازی حساب کاربری کد ۶رقمی با تماس تلفنی برای شما قرایت شده را در کادر زیر وارد نمایید.">
          <otp :loading="l.phoneSubmit" class="mt-8" @send="submitPhoneOtp" @otp="phone.otp=$event" label="کد تایید"/>
        </a-card>
      </v-dialog>

      <div class="text-center">
        <v-btn v-show="isAdmin" :to="`/admin/verify/`+userId" color="red">تایید مدارک (ادمین)</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

import pstopper from "@/mixins/pstopper";
import ATextField from "@/components/ATextField";
import ACard from "@/components/ACard";
import Otp from "@/components/Otp";

export default {
  mixins: [pstopper],
  components: {vue2Dropzone, Otp, ACard, ATextField},
  filters: {
    toColor: value => value
  },
  computed: {
    totalSteps: () => 3,
  },
  data() {
    return {
      ssn: '',
      bill: '',
      bankCard: '',
      mobile: {otp: ''},
      phone: {otp: ''},
      config: {headers: {"Content-Type": "multipart/form-data"}},
      dropzoneOptions: {
        ssn: {
          url: this.$axios.defaults.baseURL + '/profiles/me/docs',
          paramName: 'ssn',
          withCredentials: true,
          headers: {'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN')},
          maxFiles: 1,
          thumbnailWidth: 64,
          thumbnailHeight: 64,
          maxFilesize: 0.5,
        },
        bill: {
          url: this.$axios.defaults.baseURL + '/profiles/me/docs',
          paramName: 'bill',
          withCredentials: true,
          thumbnailWidth: 150,
          maxFilesize: 0.5,
        },
        bankCard: {
          url: this.$axios.defaults.baseURL + '/profiles/me/docs',
          paramName: 'bank-card',
          withCredentials: true,
          thumbnailWidth: 150,
          maxFilesize: 0.5,
        }
      },
      l: {
        ssn: false, bill: false, bankCard: false,
        mobileSubmit: false, mobileRequest: false,
        phoneSubmit: false, phoneRequest: false,

        send: false
      },

      userId: this.$route.params.user,
      isAdmin: this.$store.state.auth.profile?.role === 'admin',
      stepNum: 0,
      dialog: {send: false, mobileOtp: false, phoneOtp: false},
      nextLabel: 'بعدی',
      prevLabel: 'قبلی',
      user: {
        name: '',
        last_name: '',
        ssn: '',
        cell_phone: '',
        city: '',
        address: '',
        postal_code: '',
        phone: '',
        bank_card: '',
        bank_shaba: '',
        bank_account: ''
      },
      verifyState: {
        email: false,
        cell_phone: false,
        phone: false,
        ssn: false,
        address: false,
        bank_card: false,
        bank_shaba: false,
        bank_account: false
      },
    }
  },
  async mounted() {
    this.user = await this.$axios.$get('/profiles/' + this.userId);
    let id = this.isAdmin ? this.userId : 'me'
    this.verifyState = await this.$axios.$get('/profiles/' + id + '/verifies');
  },
  methods: {
    async send() {
      this.dialog.send = false
      this.l.send = true
      await this.$axios.$put('/profiles/' + this.userId, this.user)
      this.l.send = false
      this.$bus.$emit('snack', 'مشخصات شما با موفقیت ثبت شد.', 'success')
    },
    next() {
      if (this.stepNum === this.totalSteps - 1) {
        this.dialog.send = true
      } else {
        this.stepNum++
        this.setBtnState()
      }
    },
    async prev() {
      if (this.stepNum === 0) {
        // await $router.push('/')
      } else {
        this.stepNum--
        this.setBtnState()
      }
    },
    setBtnState() {
      if (this.stepNum === this.totalSteps - 1) {
        this.nextLabel = 'ارسال'
        this.prevLabel = 'قبلی'
      } else if (this.stepNum === 0) {
        this.nextLabel = 'بعدی'
        this.prevLabel = 'قبلی'
      } else {
        this.nextLabel = 'بعدی'
        this.prevLabel = 'قبلی'
      }
    },
    circleColor(step) {
      if (step === this.stepNum) {
        return 'primary'
      } else if (step > this.stepNum) {
        return 'white'
      } else {
        return 'secondary'
      }
    },
    circleTextColor(step) {
      if (this.stepNum === step) {
        return 'white--text'
      } else if (step > this.stepNum) {
        return 'grey--text'
      } else {
        return 'white--text'
      }
    },
    stepTextColor(step) {
      return this.stepNum === step ? 'white--text' : 'grey--text';
    },


    async uploadSsn(file) {
      // this.l.ssn = true
      const formData = new FormData();
      formData.append('ssn', file)
      await this.$axios.$post('/profiles/me/docs', formData, this.config)
      // this.l.ssn = false
      this.$bus.$emit('snack', 'تصویر کارت ملی با موفیت ارسال شد.', 'success')
    },
    async uploadBill() {
      this.l.bill = true
      const formData = new FormData();
      formData.append('bill', this.bill)
      await this.$axios.$post('/profiles/me/docs', formData, this.config)
      this.l.bill = false
      this.$bus.$emit('snack', 'تصویر قبض تلفن با موفقیت انجام شد.', 'success')
    },
    async uploadBankCard() {
      this.l.bankCard = true
      const formData = new FormData();
      formData.append('bank-card', this.bankCard)
      await this.$axios.$post('/profiles/me/docs', formData, this.config)
      this.l.bankCard = false
      this.$bus.$emit('snack', 'تصویر کارت بانکی با موفیت انجام شد', 'success')
    },
    async requestMobileOtp() {
      this.l.mobileRequest = true
      await this.$axios.$post('/otp-m', {cell_phone: this.user.cell_phone})
      this.l.mobileRequest = false
      this.dialog.mobileOtp = true
    },
    async submitMobileOtp() {
      this.l.mobileSubmit = true
      await this.$axios.$post('/otp-m/verify', {otp: this.mobile.otp})
      this.mobile.otp = ''
      this.l.mobileSubmit = false
      this.dialog.mobileOtp = false
      this.$bus.$emit('snack', 'احراز اصالت موبایل با موفقیت انجام شد.', 'success')
    },
    async requestPhoneOtp() {
      this.l.phoneRequest = true
      await this.$axios.$post('/otp-c', {phone: this.user.phone})
      this.l.phoneRequest = false
      this.dialog.phoneOtp = true
    },
    async submitPhoneOtp() {
      this.l.phoneSubmit = true
      await this.$axios.$post('/otp-c/verify', {otp: this.phone.otp})
      this.phone.otp = ''
      this.l.phoneSubmit = false
      this.dialog.phoneOtp = false
      this.$bus.$emit('snack', 'احراز اصالت تلفن ثابت با موفقیت انجام شد.', 'success')
    },
  }
}
</script>

<style scoped>

</style>