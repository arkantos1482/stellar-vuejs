<template>
  <div>
    <v-row justify="center">
      <v-col cols="4">
        <h3>اطلاعات شخصی</h3>
        <v-text-field filled v-model="user.name" label="نام"/>
        <v-text-field filled v-model="user.last_name" label="نام خانوادگی"/>
        <v-text-field filled v-model="user.ssn" label="کد ملی"/>
        <v-text-field filled v-model="user.cell_phone" label="موبایل"/>
      </v-col>

      <v-col cols="4">
        <h3>اطلاعات تکمیلی</h3>
        <v-text-field filled v-model="user.city" label="شهر"/>
        <v-text-field filled v-model="user.address" label="آدرس"/>
        <v-text-field filled v-model="user.postal_code" label="کدپستی"/>
        <v-text-field filled v-model="user.phone" label="تلفن ثابت"/>
      </v-col>

      <v-col cols="4">
        <h3>اطلاعات مالی</h3>
        <v-text-field filled v-model="user.bank_card" label="شماره کارت"/>
        <v-text-field filled v-model="user.bank_shaba" label="شماره شبا"/>
        <v-text-field filled v-model="user.bank_account" label="شماره حساب"/>
      </v-col>
    </v-row>

    <div class="text-center">
      <v-btn :loading="l.send" @click="send" color="primary">ثبت</v-btn>
      <v-btn v-show="!isAdmin" to="/Verification">ارسال مدارک</v-btn>
      <v-btn v-show="isAdmin" :to="`/admin/verify/`+userId" color="red">تایید مدارک (ادمین)</v-btn>
      <v-btn @click="$router.back()">بازگشت</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId: this.$route.params.user,
      isAdmin: this.$store.state.auth.profile.role === 'admin',
      l: {send: false},
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
      }
    }
  },
  async mounted() {
    this.user = await this.$axios.$get('/profiles/' + this.userId);
  },
  methods: {
    async send() {
      this.l.send = true
      await this.$axios.$put('/profiles/' + this.userId, this.user)
      this.l.send = false
    }
  }
}
</script>

<style scoped>

</style>