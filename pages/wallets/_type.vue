<template>
  <div>

    <v-row class="justify-center">
      <v-col cols="6">
        <a-text-field v-model="destAddress" label="حساب مقصد"/>
        <a-text-field v-model="amount" label="مقدار"/>
        <p></p>
        <p>{{ "کارمزد انتقال:  " + withdrawFee }}</p>
        <v-btn @click="withdraw" :loading="l.withdraw">برداشت</v-btn>
        <p>{{ withDrawResult }}</p>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="6">
        <json-viewer dir="auto" :value="txs"/>
      </v-col>
      <v-col cols="6">
        <json-viewer dir="auto" :value="account"/>
      </v-col>
    </v-row>

    <json-viewer dir="auto" :value="syncResult"/>
    <v-btn @click="syncDeposits" :loading="l.sync" class="mt-2">sync deposits</v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      asset: this.$route.params.type,
      l: {sync: false, withdraw: false},
      destAddress: '',
      amount: '',
      account: '',
      txs: '',
      syncResult: '',
      withDrawResult: '',
      withdrawFee: ''
    }
  },
  async mounted() {
    this.$axios.$get('/crypto/fees/' + this.asset)
        .then(res => this.withdrawFee = res)
    this.$axios.$get(`/crypto/${this.asset}/address`)
        .then(res => this.account = res)
    this.$axios.$get(`/crypto/${this.asset}/txs/basic`)
        .then(res => this.txs = res)
  },
  methods: {
    async syncDeposits() {
      this.l.sync = true
      this.syncResult = await this.$axios.$get(`/crypto/${this.asset}/sync`)
      this.l.sync = false
    },
    async withdraw() {
      this.l.withdraw = true
      this.withDrawResult = await this.$axios.$post(`/crypto/${this.asset}/withdraw`, {
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