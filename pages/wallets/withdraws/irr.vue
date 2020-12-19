<template>
  <div class="d-flex align-items-stretch mt-8">

    <a-card class="ml-4 pb-8" width="30%" title="برداشت">
      <a-text-field readonly value="IRR" label="نوع ارز" class="mt-8"/>
      <a-text-field readonly v-model="balance" label="موجودی"/>
      <a-text-field v-model="amount" label="مبلغ"/>
      <v-btn @click="onWithdraw" :loading="l.withdraw"
             block color="primary" class="mt-4">تایید
      </v-btn>
    </a-card>

    <a-card class="ml-4" width="70%" title="لیست برداشت ها">
      <withdraws/>
    </a-card>
  </div>
</template>

<script>
import ps from '@/mixins/pstopper'
import Withdraws from "@/pages/wallets/withdraws/index";
import ACard from "@/components/ACard";
import ATextField from "@/components/ATextField";
import collect from "collect.js";

export default {
  mixins: [ps],
  components: {Withdraws, ACard, ATextField},
  data() {
    return {
      amount: '',
      balance: '',
      l: {withdraw: false}
    }
  },
  async mounted() {
    let arrayedBalances = (await this.$axios.$get('/profiles/me/stellar')).balances
    let keyValuedBalances = collect(arrayedBalances)
        .map(item => ({[item.asset_code]: item.balance}))
        .reduce((_acc, item) => ({..._acc, ...item})) ?? []
    this.balance = keyValuedBalances.IRR
  },
  methods: {
    async onWithdraw() {
      if (this.balance >= this.amount) {
        this.l.withdraw = true
        await this.$axios.$post('/irr/withdraw', {amount: this.amount, type: this.type})
        this.l.withdraw = false
      }
    },
  }
}
</script>

<style scoped>

</style>