<template>
  <div>
    <v-row justify="center">
      <v-col cols="4">
        <h3>اطلاعات شخصی</h3>
        <a-text-field filled :background-color="verifyState.ssn|toColor"
                      v-model="user.name" label="نام"/>
        <a-text-field filled :background-color="verifyState.ssn|toColor"
                      v-model="user.last_name" label="نام خانوادگی"/>
        <a-text-field filled :background-color="verifyState.ssn|toColor"
                      v-model="user.ssn" label="کد ملی"/>
        <a-text-field filled :background-color="verifyState.cell_phone|toColor"
                      v-model="user.cell_phone" label="موبایل"/>
      </v-col>

      <v-col cols="4">
        <h3>اطلاعات تکمیلی</h3>
        <a-text-field filled :background-color="verifyState.address|toColor"
                      v-model="user.city" label="شهر"/>
        <a-text-field filled :background-color="verifyState.address|toColor"
                      v-model="user.address" label="آدرس"/>
        <a-text-field filled :background-color="verifyState.address|toColor"
                      v-model="user.postal_code" label="کدپستی"/>
        <a-text-field filled :background-color="verifyState.phone|toColor"
                      v-model="user.phone" label="تلفن ثابت"/>
      </v-col>

      <v-col cols="4">
        <h3>اطلاعات مالی</h3>
        <a-text-field filled :background-color="verifyState.bank_card|toColor"
                      v-model="user.bank_card" label="شماره کارت"/>
        <a-text-field filled :background-color="verifyState.bank_shaba|toColor"
                      v-model="user.bank_shaba" label="شماره شبا"/>
        <a-text-field filled :background-color="verifyState.bank_account|toColor"
                      v-model="user.bank_account" label="شماره حساب"/>
      </v-col>
    </v-row>

    <div class="text-center">
      <v-btn :loading="l.send" @click="send" color="primary">ثبت</v-btn>
      <v-btn v-show="!isAdmin" to="/Verification">مدارک</v-btn>
      <v-btn v-show="isAdmin" :to="`/admin/verify/`+userId" color="red">تایید مدارک (ادمین)</v-btn>
      <v-btn @click="$router.back()">بازگشت</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    toColor: value => value ? 'green' : 'red'
  },
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
      this.l.send = true
      await this.$axios.$put('/profiles/' + this.userId, this.user)
      this.l.send = false
    }
  }
}
</script>

<style scoped>

</style>