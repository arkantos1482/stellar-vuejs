<template>
  <div>

    <v-row class="justify-center">
      <v-col cols="6">
        <v-text-field v-model="destAddress" label="حساب مقصد"/>
        <v-text-field v-model="amount" label="مقدار"/>
        <p></p>
        <p>{{ "کارمزد انتقال:  " + withdrawFee }}</p>
        <v-btn @click="withdraw" :loading="wLoading">برداشت</v-btn>
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
    <v-btn @click="syncDeposits" :loading="rLoading" class="mt-2">sync deposits</v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      asset: this.$route.params.type,
      wLoading: false,
      destAddress: '',
      amount: '',
      account: '',
      txs: '',
      rLoading: false,
      syncResult: '',
      withDrawResult: '',
      withdrawFee: ''
    }
  },
  async mounted() {
    try {
      this.withdrawFee = await this.$axios.$get('/crypto/fees/' + this.asset)
      this.account = await this.$axios.$get(`/crypto/${this.asset}/address`)
      this.txs = await this.$axios.$get(`/crypto/${this.asset}/txs/basic`)
    } catch (e) {
      this.account = 'خطایی رخ داده است.'
      this.txs = 'خطایی رخ داده است.'
    }
  },
  methods: {
    async syncDeposits() {
      this.rLoading = true
      this.syncResult = await this.$axios.$get(`/crypto/${this.asset}/sync`)
      this.rLoading = false
    },
    async withdraw() {
      this.wLoading = true
      this.withDrawResult = await this.$axios.$post(`/crypto/${this.asset}/withdraw`, {
        to: this.destAddress,
        amount: this.amount
      })
      this.wLoading = false
    },
  }
}
</script>

<style scoped>

</style>