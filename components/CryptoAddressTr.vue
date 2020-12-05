<template>
  <tr>
    <td>{{ type }}</td>
    <td v-if="type==='irr'">
      <v-btn to="/RialDeposit" :loading="loading">واریز</v-btn>
    </td>
    <td v-else-if="!address">
      <v-btn @click="createCrypto" :loading="loading">ایجاد</v-btn>
    </td>
    <td v-else>{{ address }}</td>
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
      this.address = await this.$axios.$post('/crypto/' + this.type + '/address/create')
      this.loading = false
    },
    async more() {
      await this.$router.push({path: '/wallets/' + this.type})
    }
  }
}
</script>
