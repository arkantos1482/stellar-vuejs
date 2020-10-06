<template>
  <v-row justify="center">
    <v-col cols="6">
      <h1> کیف پول ها </h1>
      <v-card outlined>
        {{ addresses }}
      </v-card>
      <address-show-create type="ETH" :address="addresses.ETH"/>
      <address-show-create type="BTC" :address="addresses.BTC"/>
      <address-show-create type="LTC" :address="addresses.LTC"/>
    </v-col>
  </v-row>
</template>

<script>
import AddressShowCreate from "~/components/AddressShowCreate";
import collect from 'collect.js'

export default {
  name: "CryptoAddresses",
  components: {AddressShowCreate},
  data() {
    return {
      addresses: [],
      dd: null
    }
  },
  async mounted() {
    let list = await this.$axios.$get('/profiles/addresses');
    this.addresses = collect(list)
        .map(item => {
          return {[item.type]: item.address}
        }).reduce(((_carry, item) => {
          return {..._carry, ...item}
        }))
  }
}
</script>

<style scoped>

</style>