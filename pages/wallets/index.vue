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
        <crypto-address-tr type="irr" :address="addresses.IRR" :balance="balances.IRR"/>
        <crypto-address-tr type="btc" :address="addresses.BTC" :balance="balances.BTC"/>
        <crypto-address-tr type="eth" :address="addresses.ETH" :balance="balances.ETH"/>
        <crypto-address-tr type="ltc" :address="addresses.LTC" :balance="balances.LTC"/>
        <crypto-address-tr type="usdt" :address="addresses.USDT" :balance="balances.USDT"/>
        <crypto-address-tr type="amin" :address="addresses.AMIN" :balance="balances.AMIN"/>
        <crypto-address-tr type="barg" :address="addresses.BARG" :balance="balances.BARG"/>
        <crypto-address-tr type="bch" :address="addresses.BCH" :balance="balances.BCH"/>
        </tbody>
      </v-simple-table>
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
      addresses: [],
      balances: []
    }
  },
  async mounted() {
    let addresses = await this.$axios.$get('/profiles/me/addresses')
    this.addresses = collect(addresses)
        .map(item => ({[item.type]: item.address}))
        .reduce((_acc, item) => ({..._acc, ...item})) ?? []

    let balances = (await this.$axios.$get('/profiles/me/stellar')).balances
    this.balances = collect(balances)
        .map(item => ({[item.asset_code]: item.balance}))
        .reduce((_acc, item) => ({..._acc, ...item})) ?? []
  }
}
</script>

