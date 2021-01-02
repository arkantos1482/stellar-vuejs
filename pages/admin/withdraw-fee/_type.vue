<template>
  <div>
    <v-row justify="center" align="end">
      <v-col cols="6" class="text-center">
        <h3>{{ coin }}</h3>
        <p v-show="isEthOrUsdt" class="red--text">enter in WEI unit<br/>not Gwei or Ether</p>
        <a-text-field filled v-model="withdrawFee" label="کارمزد برداشت"/>
        <v-btn color="red" @click="setFee" :loading="l.setFee">اعمال</v-btn>
      </v-col>

      <v-col v-show="isEthOrUsdt" cols="6" class="text-center">
        <h3>Gas Limit</h3>
        <a-text-field filled v-model="gasLimit" label="gas limit"/>
        <v-btn color="red" @click="setGasLimit" :loading="l.gasLimit">اعمال</v-btn>
      </v-col>
    </v-row>

    <div class="d-flex mt-12">
      <v-card width="50%" outlined class="px-8 ml-8">
        <h3 class="text-center">اطلاعات شبکه : </h3>
        <json-viewer dir="ltr" :value="externalNetworkFee"/>
      </v-card>

      <v-card width="50%" outlined class="text-center px-8 pt-12">
        <a-text-field v-model="destAddress" label="حساب مقصد"/>
        <a-text-field v-model="amount" label="مقدار"/>
        <v-btn @click="getTxSize" :loading="l.txInfo">Tx Info</v-btn>
        <p class="pink--text mt-8">{{ txInfo }}</p>
      </v-card>
    </div>
  </div>
</template>

<script>
import pstopper from "@/mixins/pstopper";
import ATextField from "@/components/ATextField";

export default {
  mixins: [pstopper],
  components: {ATextField},
  computed: {
    isEthOrUsdt() {
      return ('ETH' === this.coin.toUpperCase() || 'USDT' === this.coin.toUpperCase())
    }
  },
  data() {
    return {
      coin: this.$route.params.type,
      withdrawFee: '',
      externalNetworkFee: '',
      txInfo: '',
      destAddress: '',
      amount: '',
      gasLimit: '',
      l: {setFee: false, txInfo: false, gasLimit: false}
    }
  },
  async mounted() {
    this.$axios.$get('/crypto/fees/' + this.coin.toLowerCase() + '/network')
        .then(res => this.externalNetworkFee = res)

    this.$axios.$get('/crypto/fees/' + this.coin.toLowerCase() + '/fee-or-gas')
        .then(res => this.withdrawFee = res)

    if (this.isEthOrUsdt) {
      this.$axios.$get('/crypto/fees/' + this.coin.toLowerCase() + '/gas-limit')
          .then(res => this.gasLimit = res)
    }
  },
  methods: {
    setFee() {
      this.l.setFee = true
      this.$axios.put('/crypto/fees/' + this.coin.toLowerCase(), {amount: this.withdrawFee})
          .finally(() => this.l.setFee = false)
    },
    async setGasLimit() {
      this.l.gasLimit = true
      this.gasLimit = await this.$axios.$post('/crypto/fees/'
          + this.coin.toLowerCase() + '/gas-limit', {amount: this.gasLimit})
      this.l.gasLimit = false
    },
    async getTxSize() {
      this.l.txInfo = true
      let res = await this.$axios.$post('/crypto/fees/' + this.coin.toLowerCase() +
          '/network/tx-info', {
        to: this.destAddress,
        amount: this.amount
      })
      this.txInfo = res.tx_size_bytes
      this.l.txInfo = false
    }
  }
}
</script>

<style scoped>

</style>