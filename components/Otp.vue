<template>
  <v-row justify="center">
    <v-col cols="4">
      {{ title }}
      {{ desc }}
      <v-text-field outlined
                    @change="$emit('input',$event)"
                    :value="value"
                    :label="label"/>
      <v-btn color="primary" @click="$emit('send')" :loading="loading">تایید</v-btn>
      <v-btn @click="$emit('resend')">توکن مجدد</v-btn>
    </v-col>
  </v-row>
</template>

<script>

export default {
  name: 'otp',
  props: ['value', 'title', 'desc', 'label', 'loading'],
  data() {
    return {}
  },
  methods: {
    async onSend() {

      // this.loading = true
      // try {
      //   await this.$axios.$post(this.url, {...this.data, otp: this.otp})
      //   await this.$router.push(this.route)
      // } catch (e) {
      // } finally {
      //   this.loading = false
      // }
    },
    async reSend() {
      // this.l.resend = true
      // try {
      //   await this.$axios.$post('/otp-send', {email: this.data.email})
      // } catch (e) {
      // } finally {
      //   this.l.resend = false
      // }
    }
  }
}
</script>

<style scoped>

</style>