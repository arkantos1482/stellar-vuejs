<template>
  <div class="d-flex align-items-stretch mt-8">

    <a-card class="ml-4 pb-8" width="30%" title="برداشت">
      <a-text-field readonly v-model="type" label="نوع ارز"
                    class="mt-8"/>
      <a-text-field readonly v-model="balance" label="موجودی"/>
      <a-text-field v-model="amount" label="مبلغ"/>
      <a-text-field v-model="destAddress" label="آدرس کیف پول مقصد"/>
      <p class="mt-4 grey--text"> کارمزد تراکنش <span class="black--text">{{ withdrawFee }}</span> است.</p>
      <v-btn @click="withdraw" :loading="l.withdraw"
             block color="primary" class="mt-4">تایید
      </v-btn>
    </a-card>

    <a-card class="ml-4" width="70%" title="لیست برداشت ها">
      <withdraws/>
    </a-card>
  </div>
</template>

<script>
import Withdraws from "@/pages/wallets/withdraws/index";
import ACard from "@/components/ACard";
import ATextField from "@/components/ATextField";
import collect from "collect.js";

export default {
  components: {Withdraws, ACard, ATextField},
  data() {
    return {
      type: this.$route.params.type.toUpperCase(),
      balance: '',
      destAddress: '',
      amount: '',
      withdrawFee: '',
      l: {withdraw: false}
    }
  },
  async mounted() {
    let arrayedBalances = (await this.$axios.$get('/profiles/me/stellar')).balances
    let keyValuedBalances = collect(arrayedBalances)
        .map(item => ({[item.asset_code]: item.balance}))
        .reduce((_acc, item) => ({..._acc, ...item})) ?? []
    this.balance = keyValuedBalances[this.type]

    this.$axios.$get('/crypto/fees/' + this.type.toLowerCase())
        .then(res => this.withdrawFee = res);
  },
  methods: {
    async withdraw() {
      this.l.withdraw = true
      await this.$axios.$post(`/crypto/${this.type}/withdraw`, {
        to: this.destAddress,
        amount: this.amount
      })
      this.l.withdraw = false
    },
  }
}
</script>

<style scoped>

</style>