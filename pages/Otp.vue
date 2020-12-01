<template>
  <v-row justify="center">
    <v-col cols="4">
      <v-text-field v-model="otp" outlined label="رمز یکبار مصرف"></v-text-field>
      <v-btn color="primary" @click="onSend" :loading="l.send">تایید</v-btn>
      <v-btn @click="reSend" :loading="l.resend">توکن مجدد</v-btn>
    </v-col>
  </v-row>
</template>

<script>
import {mapState} from "vuex";

export default {
  layout: 'noToolbar',
  computed: mapState({
    url: state => state.otp.url,
    data: state => state.otp.data,
    route: state => state.otp.route
  }),
  data() {
    return {
      l: {send: false, resend: false},
      otp: ''
    }
  },
  methods: {
    async onSend() {
      this.l.send = true
      try {
        await this.$axios.$post(this.url, {...this.data, otp: this.otp})
        await this.$router.push(this.route)
      } catch (e) {
      } finally {
        this.l.send = false
      }
    },
    async reSend() {
      this.l.resend = true
      try {
        await this.$axios.$post('/otp-send', {email: this.data.email})
      } catch (e) {
      } finally {
        this.l.resend = false
      }
    }
  }
}
</script>

<style scoped>

</style>