<template>
  <v-row justify="center">
    <v-col cols="6">
      {{ coin }}
      <v-text-field filled v-model="withdrawFee" placeholder="کارمزد برداشت"/>
      <v-btn color="red" @click="setFee" :loading="l.setFee">اعمال</v-btn>
      <p class="mt-12">پیشنهاد شبکه : </p>
      {{ externalNetworkFee }}
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      coin: this.$route.params.type,
      withdrawFee: '',
      externalNetworkFee: '',
      l: {setFee: false}
    }
  },
  async fetch() {
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
    }
  }
}
</script>

<style scoped>

</style>