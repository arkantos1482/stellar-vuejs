<template>
  <v-row justify="center">
    <v-col cols="6">
      <v-text-field v-model="amount" filled label="مقدار ریال"></v-text-field>
      <v-btn color="primary" @click="onDeposit" :loading="l.deposit">واریز</v-btn>
      <v-btn @click="$router.back()">بازگشت</v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      amount: '',
      link: '',
      l: {deposit: false}
    }
  },
  methods: {
    async onDeposit() {
      this.link
    }
  }
}
</script>

<style scoped>

</style>