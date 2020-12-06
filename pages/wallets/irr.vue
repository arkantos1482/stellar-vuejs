<template>
  <v-row justify="center">
    <v-col cols="6">
      <v-select v-model="type" filled :items="items"/>
      <v-text-field v-model="amount" filled label="مقدار ریال"></v-text-field>
      <v-btn color="primary" @click="onWithdraw" :loading="l.withdraw">برداشت</v-btn>
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
      items: ['card', 'shaba'],
      type: 'card',
      amount: '',
      l: {withdraw: false}
    }
  },
  methods: {
    async onWithdraw() {
      this.l.withdraw = true
      this.link = await this.$axios.$post('/irr/withdraw', {amount: this.amount, type: this.type})
      this.l.withdraw = false
    },
  }
}
</script>

<style scoped>

</style>