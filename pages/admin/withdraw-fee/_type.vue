<template>
  <div>
    <v-col offset="3" cols="6" class="text-center">
      <h3>{{ coin }}</h3>
      <a-text-field filled v-model="withdrawFee" label="کارمزد برداشت"/>
      <v-btn color="red" @click="setFee" :loading="l.setFee">اعمال</v-btn>
    </v-col>

    <div class="d-flex mt-12">
      <v-card width="50%" outlined class="px-8 ml-8">
        <h3 class="text-center">اطلاعات شبکه : </h3>
        <json-viewer dir="ltr" :value="externalNetworkFee"/>
      </v-card>

      <v-card width="50%" outlined class="text-center px-8 pt-12">
        <a-text-field v-model="destAddress" label="حساب مقصد"/>
        <a-text-field v-model="amount" label="مقدار"/>
        <v-btn @click="getTxSize" :loading="l.txSize">Tx Size</v-btn>
        <p class="pink--text mt-8">{{ txSize }}</p>
      </v-card>
    </div>
  </div>
</template>

<script>
import pstopper from "@/mixins/pstopper";

export default {
  mixins: [pstopper],
  data() {
    return {
      coin: this.$route.params.type,
      withdrawFee: '',
      externalNetworkFee: '',
      txSize: '',
      destAddress: '',
      amount: '',
      l: {setFee: false, txSize: false}
    }
  },
  async mounted() {
    try {
      this.externalNetworkFee = await this.$axios.$get('/crypto/fees/' + this.coin.toLowerCase() + '/network');
    } catch (e) {

    }
    this.withdrawFee = await this.$axios.$get('/crypto/fees/' + this.coin.toLowerCase())
  },
  methods: {
    setFee() {
      this.l.setFee = true
      this.$axios.put('/crypto/fees/' + this.coin.toLowerCase(), {amount: this.withdrawFee})
          .finally(() => this.l.setFee = false)
    },
    async getTxSize() {
      this.l.txSize = true
      let res = await this.$axios.$post('/crypto/fees/' + this.coin.toLowerCase() +
          '/network/tx-bytes', {
        to: this.destAddress,
        amount: this.amount
      })
      this.txSize = res.tx_size_bytes
      this.l.txSize = false
    }
  }
}
</script>

<style scoped>

</style>