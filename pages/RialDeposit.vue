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
import ps from '@/mixins/pstopper'

export default {
  mixins: [ps],
  data() {
    return {
      amount: '',
      link: '',
      l: {deposit: false}
    }
  },
  methods: {
    async onDeposit() {
      this.l.deposit = true
      this.link = await this.$axios.$post('/irr/deposit', {amount: this.amount})
      window.open(this.link,'_blank')
      this.l.deposit = false
    }
  }
}
</script>

<style scoped>

</style>