<template>
  <v-row>
    <v-col cols="12">
      <v-simple-table>
        <thead>
        <tr>
          <th>رمزارز</th>
          <th>آدرس</th>
          <th>موجودی</th>
          <th>عملیات</th>
        </tr>
        </thead>
        <tbody>
        <crypto-address-tr type="BTC" :address="addresses.BTC" :balance="balances.BTC"/>
        <crypto-address-tr type="ETH" :address="addresses.ETH" :balance="balances.ETH"/>
        <crypto-address-tr type="LTC" :address="addresses.LTC" :balance="balances.LTC"/>
        </tbody>
      </v-simple-table>
      <!--      <v-card outlined>-->
      <!--        <address-show-create type="ETH" :address="addresses.ETH"/>-->
      <!--        <address-show-create type="BTC" :address="addresses.BTC"/>-->
      <!--        <address-show-create type="LTC" :address="addresses.LTC"/>-->
      <!--      </v-card>-->
    </v-col>
  </v-row>
</template>

<script>
import collect from 'collect.js'
import CryptoAddressTr from "@/components/CryptoAddressTr";

export default {
  name: "CryptoAddresses",
  components: {CryptoAddressTr},
  data() {
    return {
      snackBar: false,
      snackMsg: 'fake',
      addresses: [],
      balances: []
    }
  },
  async fetch() {
    let addresses = await this.$axios.$get('/profiles/me/addresses')
    this.addresses = collect(addresses)
        .map(item => ({[item.type]: item.address}))
        .reduce((_acc, item) => ({..._acc, ...item})) ?? []

    let balances = (await this.$axios.$get('/profiles/me/stellar')).balances
    this.balances = collect(balances)
        .map(item => ({[item.asset_code]: item.balance}))
        .reduce((_acc, item) => ({..._acc, ...item})) ?? []
    console.log(this.balances)
  },
  methods: {
    onSnack(value) {
      this.snackMsg = value
      this.snackBar = true
    }
  }
}
</script>

