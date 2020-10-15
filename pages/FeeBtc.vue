<template>
  <v-col class="text-center">
    <h1> Fee Calculator</h1>
    <btc-account-list @list="outputs=$event"/>
    <p>{{ outputs }}</p>

    <v-btn @click="send" class="mt-8">bytes</v-btn>
    <h3>bytes = {{ bytes }}</h3>

    <v-card outlined class="mt-8">{{ costList }}</v-card>
    <h3>cost (bytes * slow) = {{ fee }}</h3>

    <v-btn @click="withdraw" class="mt-8">Withdraw</v-btn>
    <v-card outlined>{{ withdrawResult }}</v-card>
  </v-col>
</template>

<script>
import BtcAccountList from "~/components/BtcAccountList";

export default {
  name: "FeeBtc",
  components: {BtcAccountList},
  data() {
    return {
      outputs: [],
      costList: '',
      bytes: '0',
      withdrawResult: ''
    }
  },
  computed: {
    fee() {
      return Number(this.bytes) * Number(this.costList.slow_fee_per_byte);
    }
  },
  async fetch() {
    let fee = (await this.$axios.$get('http://site1.test/api/crypto/fee/btc')).payload;
    this.costList = {
      average_fee_per_byte: fee.average_fee_per_byte,
      slow_fee_per_byte: fee.slow_fee_per_byte,
      standard_fee_per_byte: fee.standard_fee_per_byte
    }
  },
  methods: {
    async send() {
      let post = await this.$axios.$post('http://site1.test/api/crypto/fee/btc/size',
          {outputs: this.outputs});
      this.bytes = post.payload.tx_size_bytes
    },
    async withdraw() {
      this.withdrawResult = await this.$axios.$post('http://site1.test/api/crypto/btc/withdraw',
          {fee: this.fee, outputs: this.outputs})
    }
  }
}
</script>

