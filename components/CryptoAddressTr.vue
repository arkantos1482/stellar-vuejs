<template>
  <tr>
    <td>{{ type }}</td>
    <td v-if="address">{{ address }}</td>
    <td v-else>
      <v-btn @click="createCrypto" :loading="loading">{{ btnName }}</v-btn>
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
  computed: {
    btnName() {
      return this.type !== 'irr' ? 'ایجاد' : 'واریز'
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async createCrypto() {
      if (this.type === 'irr') {
        await this.$router.push('/RialDeposit')
      } else {
        this.loading = true
        this.address = await this.$axios.$post('/crypto/' + this.type + '/address/create')
        this.loading = false
      }
    },
    async more() {
      await this.$router.push({path: '/wallets/' + this.type})
    }
  }
}
</script>
