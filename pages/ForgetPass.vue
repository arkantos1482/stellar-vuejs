<template>
  <v-row justify="center">
    <v-col cols="4">
      <v-text-field v-model="email" filled label="ایمیل"/>
      <v-btn @click="onSubmit">ثبت</v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      email: ''
    }
  },
  methods: {
    onSubmit() {
      this.$store.commit("otp/setEmail", this.email)
      this.$router.push('/ResetPass')
    }
  }
}
</script>

<style scoped>

</style>