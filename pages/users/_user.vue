<template>
  <v-row justify="center">
    <v-col cols="6">
      <h1>hello {{ userId }}</h1>
      <v-text-field v-model="user.name" label="نام"/>
      <v-text-field v-model="user.last_name" label="نام خانوادگی"/>
      <v-text-field v-model="user.cell_phone" label="موبایل"/>
      <v-text-field v-model="user.ssn" label="کد ملی"/>
      <v-text-field v-model="user.bank_account" label="شماره حساب"/>
      <v-text-field v-model="user.address" label="آدرس"/>
      <v-btn :loading="lSend" @click="send" color="primary">ارسال</v-btn>
      <v-btn to="/Verification">ارسال مدارک</v-btn>
      <v-btn v-show="isAdmin" :to="`/admin/verify/`+userId" color="red">تایید مدارک (ادمین)</v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      userId: this.$route.params.user,
      isAdmin: this.$auth.user.role === 'admin',
      lSend: false,
      user: {
        name: '',
        last_name: '',
        cell_phone: '',
        ssn: '',
        bank_account: '',
        address: ''
      }
    }
  },
  async fetch() {
    this.user = await this.$axios.$get('/profiles/' + this.userId);
  },
  methods: {
    async send() {
      this.lSend = true
      await this.$axios.$put('/profiles/' + this.userId, this.user)
      this.lSend = false
    }
  }
}
</script>

<style scoped>

</style>