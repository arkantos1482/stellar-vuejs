<template>
  <v-row justify="center">
    <v-col cols="6">
      <v-row>
        <v-file-input label="کارت ملی" show-size @change="ssn=$event"/>
        <v-btn :loading="l.ssn" @click="uploadSsn">ارسال</v-btn>
      </v-row>

      <v-row>
        <v-file-input label="قبض تلفن" show-size @change="bill=$event"/>
        <v-btn :loading="l.bill" @click="uploadBill">ارسال</v-btn>
      </v-row>

      <v-card>
        <v-card-title>احراز اصالت موبایل</v-card-title>
        <v-card-text>
          <v-text-field v-model="mobile.otp" outlined label="رمز یکبار مصرف"/>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="primary" @click="submitMobileOtp" :loading="l.mobileSubmit">تایید توکن</v-btn>
          <v-btn text @click="requestMobileOtp" :loading="l.mobileRequest">تقاضای توکن</v-btn>
        </v-card-actions>
      </v-card>

      <v-card class="mt-8 mb-8">
        <v-card-title>احراز اصالت تلفن ثابت</v-card-title>
        <v-card-text>
          <v-text-field v-model="phone.otp" outlined label="رمز یکبار مصرف"/>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="primary" @click="submitPhoneOtp" :loading="l.phoneSubmit">تایید توکن</v-btn>
          <v-btn text @click="requestPhoneOtp" :loading="l.phoneRequest">تقاضای توکن</v-btn>
        </v-card-actions>
      </v-card>

      <div class="text-center">
        <v-btn @click="$router.back()">بازگشت</v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      ssn: '',
      bill: '',
      mobile: {otp: ''},
      phone: {otp: ''},
      config: {headers: {"Content-Type": "multipart/form-data"}},
      l: {
        ssn: false, bill: false,
        mobileSubmit: false, mobileRequest: false,
        phoneSubmit: false, phoneRequest: false,
      },
    }
  },
  methods: {
    async uploadSsn() {
      this.l.ssn = true
      const formData = new FormData();
      formData.append('ssn', this.ssn)
      await this.$axios.$post('/profiles/me/docs', formData, this.config)
      this.l.ssn = false
    },
    async uploadBill() {
      this.l.bill = true
      const formData = new FormData();
      formData.append('bill', this.bill)
      await this.$axios.$post('/profiles/me/docs', formData, this.config)
      this.l.bill = false
    },
    async submitMobileOtp() {

    },
    async requestMobileOtp() {

    },
    async submitPhoneOtp() {

    },
    async requestPhoneOtp() {

    },
  }
}
</script>

<style scoped>

</style>