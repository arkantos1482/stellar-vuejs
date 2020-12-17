<template>
  <v-row class="text-center">
    <v-col cols="12">
      <v-simple-table>
        <thead class="grey lighten-3">
        <tr>
          <th class="text-center">رمزارز</th>
          <th class="text-center">موجودی</th>
          <th class="text-center">عملیات</th>
        </tr>
        </thead>
        <tbody>
        <crypto-address-tr type="irr" :balance="balances.IRR"/>
        <crypto-address-tr type="btc" :balance="balances.BTC"/>
        <crypto-address-tr type="eth" :balance="balances.ETH"/>
        <crypto-address-tr type="ltc" :balance="balances.LTC"/>
        <crypto-address-tr type="usdt" :balance="balances.USDT"/>
        <crypto-address-tr type="amin" :balance="balances.AMIN"/>
        <crypto-address-tr type="barg" :balance="balances.BARG"/>
        <crypto-address-tr type="bch" :balance="balances.BCH"/>
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
      balances: []
    }
  },
  async mounted() {
    let balances = (await this.$axios.$get('/profiles/me/stellar')).balances
    this.balances = collect(balances)
        .map(item => ({[item.asset_code]: item.balance}))
        .reduce((_acc, item) => ({..._acc, ...item})) ?? []
  }
}
</script>

