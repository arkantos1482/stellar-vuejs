<template>
  <div>
    <h3>{{ type }}</h3>
    <p v-if="address">{{ address }}</p>
    <v-btn v-else @click="createCrypto" :loading="loading">create</v-btn>
  </div>
</template>

<script>
export default {
  name: "AddressShowCreate",
  props: ['type', 'address'],
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
    }
  }
}
</script>

<style scoped>

</style>