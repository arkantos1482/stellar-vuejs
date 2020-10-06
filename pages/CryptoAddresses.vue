<template>
  <v-row justify="center" class="text-center">
    <v-col cols="6">
      <h1> کیف پول ها </h1>
      <v-card outlined>
        <address-show-create type="ETH" :address="addresses.ETH"/>
        <address-show-create type="BTC" :address="addresses.BTC"/>
        <address-show-create type="LTC" :address="addresses.LTC"/>
      </v-card>
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
        }).reduce(((_acc, item) => {
          return {..._acc, ...item}
        }))
  }
}
</script>

<style scoped>

</style>