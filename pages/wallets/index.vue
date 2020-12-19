<template>
  <v-row class="text-center">
    <v-col cols="12">
      <v-simple-table>
        <thead class="grey lighten-3">
        <tr>
          <th>رمزارز</th>
          <th class="text-center">نماد</th>
          <th class="text-center">موجودی</th>
          <th class="text-center">عملیات</th>
        </tr>
        </thead>
        <tbody>
        <crypto-address-tr namad="امین" :icon="require('@/assets/images/AminToken.svg')" type="amin"
                           :balance="balances.AMIN"/>
        <crypto-address-tr namad="برگ" :icon="require('@/assets/images/AminToken.svg')" type="barg"
                           :balance="balances.BARG"/>
        <crypto-address-tr namad="ریال" :icon="require('@/assets/images/IRR.png')" type="irr" :balance="balances.IRR"/>
        <crypto-address-tr namad="بیت کوین" :icon="require('@/assets/images/BTC.svg')" type="btc"
                           :balance="balances.BTC"/>
        <crypto-address-tr namad="اتریوم" :icon="require('@/assets/images/ETH.svg')" type="eth"
                           :balance="balances.ETH"/>
        <crypto-address-tr namad="لایت کوین" :icon="require('@/assets/images/LTC.svg')" type="ltc"
                           :balance="balances.LTC"/>
        <crypto-address-tr namad="تتر" :icon="require('@/assets/images/USDT.svg')" type="usdt"
                           :balance="balances.USDT"/>
        <crypto-address-tr namad="بیت کوین کش" :icon="require('@/assets/images/AminToken.svg')" type="bch"
                           :balance="balances.BCH"/>
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

