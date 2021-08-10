<template>
  <div>
    <v-card>
      <v-row justify="center">
        <v-col cols="7">
          <v-form v-model="form" ref="form">
            <p class="mt-6 mb-2 primary--text">اطلاعات شخصی</p>
            <v-divider class="mb-4"/>

            <!--1st-->
            <two-column-row>
              <template v-slot:right>
                <a-text-field :rules="[rules.required,rules.persian]"
                              v-model="user.name" label="نام"
                              hint="احمد"
                              :disabled="verifyState.ssn"/>
              </template>
              <template v-slot:left>
                <a-text-field :rules="[rules.required,rules.persian]"
                              v-model="user.last_name" label="نام خانوادگی"
                              hint="برزین"
                              :disabled="verifyState.ssn"/>
              </template>
            </two-column-row>

            <!--2nd-->
            <two-column-row>
              <template v-slot:right>
                <a-text-field :rules="[rules.required,rules.elevenDigit]"
                              mask="###########"
                              v-model="user.cell_phone" label="شماره موبایل"
                              hint="09121234567"
                              :disabled="verifyState.cell_phone">
                  <v-btn @click="requestMobileOtp" :loading="l.mobileRequest"
                         tile depressed small class="inside-btn" color="primary">
                    دریافت کد تایید
                  </v-btn>
                </a-text-field>
              </template>
              <template v-slot:left>
                <a-text-field :rules="[rules.required,rules.tenDigit]"
                              mask="##########"
                              hint="1234567890"
                              v-model="user.ssn" label="کد ملی"
                              :disabled="verifyState.ssn"/>
              </template>
            </two-column-row>

            <!--3rd-->
            <two-column-row class="mt-4">
              <template v-slot:right>
                <p class="grey--text mb-1 text-body-2">جنسیت</p>
                <v-select dense outlined flat
                          :items="genderList" v-model="user.gender"
                          :disabled="verifyState.ssn"/>
              </template>
              <template v-slot:left>
                <p class="grey--text mb-1 text-body-2">تاریخ تولد</p>
                <custom-date-picker v-model="user.birth_date" :disabled="verifyState.ssn">
                  <template slot="label">
                  </template>
                </custom-date-picker>
              </template>
            </two-column-row>

            <!--4th-->
            <two-column-row class="mt-n4">
              <template v-slot:right>
                <p class="grey--text mb-3 text-body-2">تصویر کارت ملی</p>
                <vue2-dropzone id="ssn_id"
                               :options="dropzoneOptions.ssn" :useCustomSlot=true>
                  <div>
                    <v-icon style="font-size: 64px" color="primary">mdi-file-upload</v-icon>
                    <p class="grey--text text-body-2 mb-0 mt-2">فایل مورد نظر را انتخاب و در این قسمت رها کنید</p>
                  </div>
                </vue2-dropzone>
              </template>
              <!--              <template v-slot:left>-->
              <!--                <p class="grey&#45;&#45;text mb-2 text-body-2">-->
              <!--                  تصویر تایید هویت-->
              <!--                  <span>&nbsp<v-icon @click="onGuide" color="success">mdi-alert-circle-outline</v-icon></span>-->
              <!--                </p>-->
              <!--                <vue2-dropzone id="bank_card_id"-->
              <!--                               :options="dropzoneOptions.bankCard" :useCustomSlot=true>-->
              <!--                  <div>-->
              <!--                    <v-icon style="font-size: 64px" color="primary">mdi-file-upload</v-icon>-->
              <!--                    <p class="grey&#45;&#45;text text-body-2 mb-0 mt-2">فایل مورد نظر را انتخاب و در این قسمت رها کنید</p>-->
              <!--                  </div>-->
              <!--                </vue2-dropzone>-->
              <!--              </template>-->
              <template v-slot:left>
                <p class="grey--text">حجم تصویر حداکثر ۵۰۰ کیلوبایت و با فرمت های jpg یا pdf ارسال شود.</p>
                <a href="https://www.videosmaller.com/" target="_blank">لینک فشرده سازی ویدیو</a>
              </template>
            </two-column-row>


            <!--            UPLOAD VIDEO-->
            <p class="mt-12 mb-2 primary--text">بارگذاری ویدیو</p>
            <v-divider class="mb-4"/>
            <two-column-row class="align-center">
              <template v-slot:right>
                <!--                <p class="grey&#45;&#45;text mb-3 text-body-2">بارگذاری ویدیو</p>-->
                <vue2-dropzone id="video_id"
                               :options="dropzoneOptions.video" :useCustomSlot=true>
                  <div>
                    <v-icon style="font-size: 64px" color="primary">mdi-file-upload</v-icon>
                    <p class="grey--text text-body-2 mb-0 mt-2">فایل مورد نظر را انتخاب و در این قسمت رها کنید</p>
                  </div>
                </vue2-dropzone>
              </template>
              <template v-slot:left>
                <p class="grey--text">متنی که در ویدیوی ارسالی باید گفته شود:</p>
                <p class="grey--text">اینجانب "نام" و "نام خانوادگی" با اطلاع از قوانین و مقررات کارگزاری رمزارزی بیترا
                  این ویدیو را
                  جهت احراز
                  هویت ارسال می‌کنم.</p>
                <p class="grey--text">حجم ویدیو حداکثر ۵ مگابایت و مدت زمان آن حداکثر ۲۰ ثانیه باشد. از این لینک می
                  توانید برای فشرده سازی ویدیو استفاده نمایید:</p>
                <a href="https://www.videosmaller.com/" target="_blank">لینک فشرده سازی ویدیو</a>
              </template>
            </two-column-row>


            <p class="mt-12 mb-2 primary--text">اطلاعات بانکی</p>
            <v-divider class="mb-4"/>
            <v-row justify="center">
              <v-col cols="6" class="py-0" dir="ltr">
                <a-text-field
                    :rules="[rules.required]"
                    mask="################"
                    hint="6037991234567890"
                    v-model="user.bank_card" label="شماره کارت"
                    :disabled="verifyState.bank_card"/>
                <a-text-field
                    mask="################"
                    hint="6037991234567890"
                    v-model="user.bank_card_2" label="شماره کارت۲"
                    :disabled="verifyState.bank_card_2"/>
                <a-text-field
                    :rules="[rules.required]"
                    mask="IR########################"
                    hint="IR123456789012345678901234"
                    v-model="user.bank_shaba" label="شماره شبا"
                    :disabled="verifyState.bank_shaba"/>
                <a-text-field
                    mask="IR########################"
                    hint="IR123456789012345678901234"
                    v-model="user.bank_shaba_2" label="شماره شبا۲"
                    :disabled="verifyState.bank_shaba_2"/>
              </v-col>
            </v-row>


            <p class="mt-12 mb-2 primary--text">تایید هویت</p>
            <v-divider class="mb-4"/>
            <!--            1st-->
            <two-column-row class="mb-0">
              <template v-slot:right>
                <p class="grey--text mb-1 text-body-2">استان</p>
                <v-select dense outlined flat :rules="[rules.required]"
                          :items="provinceList" v-model="user.province"
                          :disabled="verifyState.address"/>
              </template>
              <template v-slot:left>
                <p class="grey--text mb-1 text-body-2">شهر</p>
                <v-select dense outlined flat :rules="[rules.required]"
                          :items="cityList(user.province)" v-model="user.city"
                          :disabled="verifyState.address"/>
              </template>
            </two-column-row>

            <!--            2nd-->
            <two-column-row class="mt-n6">
              <template v-slot:right>
                <a-text-field
                    :rules="[rules.required]"
                    v-model="user.address" label="آدرس"
                    :disabled="verifyState.address"/>
              </template>
              <template v-slot:left>
                <a-text-field
                    :rules="[rules.required, rules.tenDigit ]"
                    mask="##########"
                    hint="1234567890"
                    v-model="user.postal_code" label="کدپستی"
                    :disabled="verifyState.address"/>
              </template>
            </two-column-row>

            <!--            3rd-->
            <two-column-row>
              <!--              <template v-slot:right>-->
              <!--                <div class="mt-4">-->
              <!--                  <p class="grey&#45;&#45;text mb-1 text-body-2">تصویر قبض تلفن یا قبوض خدماتی</p>-->
              <!--                  <vue2-dropzone id="bill_id"-->
              <!--                                 :options="dropzoneOptions.bill" :useCustomSlot=true>-->
              <!--                    <div>-->
              <!--                      <v-icon style="font-size: 64px" color="primary">mdi-file-upload</v-icon>-->
              <!--                      <p class="grey&#45;&#45;text text-body-2 mb-0 mt-2">فایل مورد نظر را انتخاب و در این قسمت رها کنید</p>-->
              <!--                    </div>-->
              <!--                  </vue2-dropzone>-->
              <!--                </div>-->
              <!--              </template>-->
              <template v-slot:right>
                <a-text-field hint="02112345678"
                              mask="###############"
                              :rules="[rules.required]"
                              v-model="user.phone" label="تلفن ثابت"
                              :disabled="verifyState.phone">
                  <!--                  <v-btn tile depressed small class="inside-btn" color="primary"-->
                  <!--                         @click="requestPhoneOtp" :loading="l.phoneRequest">دریافت کد تایید-->
                  <!--                  </v-btn>-->
                </a-text-field>
              </template>
            </two-column-row>
          </v-form>

          <!--BTNS-->
          <div class="d-flex py-4 justify-end">
            <v-btn class="px-16 ml-2" outlined color="primary" @click=prev text>
              انصراف
            </v-btn>
            <v-btn class="px-16" @click=next :loading="l.send" color="primary"> ثبت</v-btn>
            <v-btn class="mr-4" v-show="isAdmin" :to="`/admin/verify/`+userId" color="red">تایید مدارک (ادمین)</v-btn>
          </div>

        </v-col>
      </v-row>
    </v-card>

    <div>
      <v-dialog v-model="dialog.mobileOtp" max-width="400">
        <a-card title="احراز اصالت موبایل"
                subtitle="کد تایید ۶رقمی ارسال شده به شماره موبایل خود را وارد کنید.">
          <otp :loading="l.mobileSubmit" class="dark mt-8" @send="submitMobileOtp" @otp="mobile.otp=$event"
               label="کد تایید"/>
        </a-card>
      </v-dialog>
      <v-dialog v-model="dialog.phoneOtp" max-width="400">
        <a-card title="احراز اصالت تلفن ثابت"
                subtitle="کد تایید ۶رقمی ارسال شده به شماره تلفن ثابت خود را وارد کنید.">
          <otp :loading="l.phoneSubmit" class="dark mt-8" @send="submitPhoneOtp" @otp="phone.otp=$event"
               label="کد تایید"/>
        </a-card>
      </v-dialog>
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
import plist from '@/models/provinceList'
import collect from 'collect.js'

export default {
  mixins: [pstopper],
  components: {vue2Dropzone, Otp, ACard, ATextField},
  computed: {
    provinceList() {
      return collect(plist).pluck('province').all()
    },
    dropzoneOptions() {
      return {
        ssn: {
          ...this.baseDropZoneConfig,
          maxFilesize: 0.5,
          paramName: 'ssn',
        },
        bill: {
          ...this.baseDropZoneConfig,
          maxFilesize: 0.5,
          paramName: 'bill',
        },
        bankCard: {
          ...this.baseDropZoneConfig,
          maxFilesize: 0.5,
          paramName: 'bank-card',
        },
        video: {
          ...this.baseDropZoneConfig,
          timeout: 90000,
          maxFilesize: 5,
          acceptedFiles: '.mpg,.flv,.avi,.mp4,.3gp,.mkv',
          paramName: 'video',
        },
      }
    }
  },
  data() {
    return {
      rules: {
        required: value => !!value || 'الزامی است',
        persian: value => {
          let pattern = /^[\u06A9\u06AF\u06C0\u06CC\u060C\u062A\u062B\u062C\u062D\u062E\u062F\u063A\u064A\u064B\u064C\u064D\u064E\u064F\u067E\u0670\u0686\u0698\u200C\u0621-\u0629\u0630-\u0639\u0641-\u0654\s]+$/
          return pattern.test(value) || 'الزاما فارسی وارد شود'
        },
        tenDigit: value => !!value && value.length === 10 || 'میبایست ۱۰ رقم باشد',
        elevenDigit: value => !!value && value.length === 11 || 'میبایست ۱۱ رقم باشد',
      },
      form: false,
      genderList: ['خانم', 'آقا'],
      ssn: '',
      bill: '',
      bankCard: '',
      mobile: {otp: ''},
      phone: {otp: ''},
      baseDropZoneConfig: {
        url: this.$axios.defaults.baseURL + '/profiles/me/docs',
        withCredentials: true,
        headers: {'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN')},
        // acceptedFiles: 'image/jpeg,image/png',
        maxFiles: 1,
        addRemoveLinks: true,
        thumbnailWidth: 128,
        thumbnailHeight: 128,
        dictRemoveFile: 'لغو ارسال',
        dictMaxFilesExceeded: 'تنها یک تصویر',
        dictFileTooBig: 'حجم غیرمجاز',
        dictInvalidFileType: 'نوع فایل غیرمجاز',
        dictResponseError: 'پذیرفته نشد'
      },
      l: {
        mobileSubmit: false, mobileRequest: false,
        phoneSubmit: false, phoneRequest: false,
        send: false
      },

      userId: this.$route.params.user,
      isAdmin: this.$store.state.auth.profile?.role === 'admin',
      dialog: {send: false, mobileOtp: false, phoneOtp: false},
      user: {
        name: '',
        last_name: '',
        ssn: '',
        cell_phone: '',
        province: '',
        gender: '',
        birth_date: '',
        city: '',
        address: '',
        postal_code: '',
        phone: '',
        bank_card: '',
        bank_card_2: '',
        bank_shaba: '',
        bank_shaba_2: '',
        bank_account: ''
      },
      verifyState: {
        email: false,
        cell_phone: false,
        phone: false,
        ssn: false,
        address: false,
        bank_card: false,
        bank_card_2: false,
        bank_shaba: false,
        bank_shaba_2: false,
        bank_account: false
      },
    }
  },
  async mounted() {
    this.user = await this.$axios.$get('/profiles/' + this.userId);
    this.$refs.form.resetValidation()

    let id = this.isAdmin ? this.userId : 'me'
    this.verifyState = await this.$axios.$get('/profiles/' + id + '/verifies');
  },
  methods: {
    cityList(province) {
      return collect(plist)
          .filter(item => item.province === province)
          .pluck('city')
          .all()
    },
    async send() {
      this.l.send = true
      await this.$axios.$put('/profiles/' + this.userId, this.user)
      this.l.send = false
      this.$bus.$emit('snack', 'با موفقیت ثبت شد.', 'success')
    },
    async next() {
      this.$refs.form.validate()
      if (this.form) {
        await this.send()
      }
    },
    async prev() {
      await this.$router.push('/')
    },
    async requestMobileOtp() {
      if (!!this.user.cell_phone && this.user.cell_phone.length === 11) {
        this.l.mobileRequest = true
        await this.$axios.$post('/otp-m', {cell_phone: this.user.cell_phone})
        this.l.mobileRequest = false
        this.dialog.mobileOtp = true
      }
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
    onGuide() {
      window.open('https://bitra.market/registerGuide/', '_blank')
    }
  }
}
</script>

<style scoped>
</style>