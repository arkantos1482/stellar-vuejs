<template>
  <tr>
    <td>{{ type }}</td>
    <td v-if="address">{{ address }}</td>
    <td v-else>
      <v-btn @click="createCrypto" :loading="loading">ایجاد</v-btn>
    </td>
    <td>{{ balance }}</td>
    <td>
      <v-btn @click="more">More</v-btn>
      <!--      <nuxt-link to="/Wallet">go to wallet</nuxt-link>-->
    </td>
  </tr>
</template>
<script>
export default {
  name: 'CryptoAddressTr',
  props: ['type', 'address', 'balance'],
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async createCrypto() {
      this.loading = true
      if (this.type === 'ETH') {
        this.address = await this.$axios.$post('/crypto/eth/address/create')
      } else if (this.type === 'BTC') {
        this.address = await this.$axios.$post('/crypto/btc/address/create')
      } else if (this.type === 'LTC') {
        this.address = await this.$axios.$post('/crypto/ltc/address/create')
      }
      this.loading = true
    },
    async more() {
      if (this.type === 'ETH') {
        await this.$router.push({path: '/wallets/eth'})
        // this.address = await this.$axios.$post('/crypto/eth/address/create')
      } else if (this.type === 'BTC') {
        await this.$router.push({path: '/wallets/btc'})
        // this.address = await this.$axios.$post('/crypto/btc/address/create')
      } else if (this.type === 'LTC') {
        await this.$router.push({path: '/wallets/ltc'})
        // this.address = await this.$axios.$post('/crypto/ltc/address/create')
      }
    }
  }
}
</script>
