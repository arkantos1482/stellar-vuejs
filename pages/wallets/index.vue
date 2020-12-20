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
        <crypto-address-tr namad="امین" type="amin"
                           :balance="balances.AMIN"/>
        <crypto-address-tr namad="برگ" type="barg"
                           :balance="balances.BARG"/>
        <crypto-address-tr namad="ریال" type="irr"
                           :balance="balances.IRR"/>
        <crypto-address-tr namad="بیت کوین" type="btc"
                           :balance="balances.BTC"/>
        <crypto-address-tr namad="اتریوم" type="eth"
                           :balance="balances.ETH"/>
        <crypto-address-tr namad="لایت کوین" type="ltc"
                           :balance="balances.LTC"/>
        <crypto-address-tr namad="تتر" type="usdt"
                           :balance="balances.USDT"/>
        <crypto-address-tr namad="بیت کوین کش" type="bch"
                           :balance="balances.BCH"/>
        </tbody>
      </v-simple-table>
    </v-col>
  </v-row>
</template>

<script>
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
    await this.$store.dispatch('balances/refresh')
    this.balances = this.$store.state.balances.balances
  }
}
</script>

