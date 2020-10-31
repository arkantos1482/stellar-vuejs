<template>
  <v-row justify="center">
    <v-col cols="6">
      <v-card class="pa-8">
        <h1>ثبت نام</h1>
        <v-text-field label="ایمیل" v-model="user.email"/>
        <v-text-field type="password" label="رمز عبور" v-model="user.password"/>
        <v-text-field label="نام" v-model="user.name"/>
        <v-text-field label="نام خانوادگی" v-model="user.last_name"/>
        <v-text-field label="موبایل" v-model="user.mobile"/>
        <v-btn @click="register" color="primary" :loading="l.reg">ثبت نام</v-btn>
        <v-btn to="/Login">ورود</v-btn>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  auth: false,
  layout: 'noToolbar',
  data() {
    return {
      user: {
        name: '',
        last_name: '',
        email: '',
        password: '',
        mobile: ''
      },
      l: {reg: false}
    }
  },
  methods: {
    async register() {
      this.l.reg = true
      try {
        let token = await this.$axios.$post('/register', this.user);
        await this.$auth.setUserToken(token)
        await this.$router.replace('/')
      } catch (e) {
        this.l.reg = false
      }
    }
  }
}
</script>

<style scoped>

</style>