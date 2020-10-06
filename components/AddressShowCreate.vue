<template>
  <div>
    <h3>{{ type }}</h3>
    <p v-if="address">{{ address }}</p>
    <v-btn v-else @click="createCrypto">create</v-btn>
  </div>
</template>

<script>
export default {
  name: "AddressShowCreate",
  props: ['type', 'address'],
  methods: {
    async createCrypto() {
      if (this.type === 'ETH') {
        this.address = await this.$axios.$post('/crypto/eth/create')
      } else if (this.type === 'BTC') {
        this.address = await this.$axios.$post('/crypto/btc/create')
      } else if (this.type === 'LTC') {
        this.address = await this.$axios.$post('/crypto/ltc/create')
      }
    }
  }
}
</script>

<style scoped>

</style>