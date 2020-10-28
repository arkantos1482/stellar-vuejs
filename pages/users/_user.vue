<template>
  <v-row justify="center">
    <v-col cols="6">
      <h1>hello {{ userId }}</h1>
      <v-text-field v-model="name" label="نام"/>
      <v-text-field v-model="lastName" label="نام خانوادگی"/>
      <v-text-field v-model="cellPhone" label="موبایل"/>
      <v-text-field v-model="ssn" label="کد ملی"/>
      <v-text-field v-model="bankAccount" label="شماره حساب"/>
      <v-text-field v-model="address" label="آدرس"/>
      <v-btn @click="send" color="primary">ارسال</v-btn>
      <v-btn :to="`/admin/verify/`+userId">ارتقا سطح دسترسی</v-btn>
      <v-btn to="/Verification" color="red">تایید مدارک (ادمین)</v-btn>
    </v-col>
  </v-row>

</template>

<script>
export default {
  data() {
    return {
      userId: this.$route.params.user,
      name: '',
      lastName: '',
      cellPhone: '',
      ssn: '',
      bankAccount: '',
      address: ''
    }
  },
  fetch() {

  },
  methods: {
    send() {

    }
  }
}
</script>

<style scoped>

</style>