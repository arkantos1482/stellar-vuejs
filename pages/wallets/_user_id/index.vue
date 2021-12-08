<template>
  <div class="pa-4">
    <p class="text-h4 mb-6 text-right">کیف پول شما</p>
    <bitra-banner v-for="i in walletsBanners" :item="i"/>

    <v-card width="100%" height="100%" class="px-8 py-4">
      <v-simple-table>
        <thead>
        <tr>
          <th class="pr-16">ارز</th>
          <th class="text-center">موجودی</th>
          <th class="text-center">موجودی در دسترس</th>
          <th class="text-center">سفارش در جریان</th>
          <!--          <th class="text-center">ارزش BTC</th>-->
          <th class="text-center">عملیات</th>
        </tr>
        </thead>
        <tbody>
        <crypto-address-tr
            :withdraw-disabled="withdrawConstraints"
            :deposit-disabled="depositConstraints"
            namad="امین" type="amn" :balance="balances.AMN"/>
        <crypto-address-tr
            :withdraw-disabled="withdrawConstraints"
            :deposit-disabled="depositConstraints"
            namad="آرت کوین" type="art" :balance="balances.ART"/>
        <crypto-address-tr
            :withdraw-disabled="withdrawConstraints"
            :deposit-disabled="depositConstraints"
            namad="شکوفه آلو" type="sha" :balance="balances.SHA"/>
<!--        <crypto-address-tr-->
<!--            :withdraw-disabled="withdrawConstraints"-->
<!--            :deposit-disabled="depositConstraints"-->
<!--            namad="تلاش" type="tls" :balance="balances.TLS"/>-->
        <crypto-address-tr
            :withdraw-disabled="withdrawConstraints"
            :deposit-disabled="depositConstraints"
            namad="وی توکن" type="wit" :balance="balances.WIT"/>
        <crypto-address-tr
            :withdraw-disabled="withdrawConstraints"
            :deposit-disabled="depositConstraints"
            namad="تومان" type="irr" :balance="balances.IRR"/>

        <crypto-address-tr
            :withdraw-disabled="withdrawConstraints"
            :deposit-disabled="depositConstraints"
            namad="بیت کوین" type="btc" :balance="balances.BTC"/>
        <crypto-address-tr
            :withdraw-disabled="withdrawConstraints"
            :deposit-disabled="depositConstraints"
            namad="بایننس" type="bnb" :balance="balances.BNB"/>
        <crypto-address-tr
            :withdraw-disabled="withdrawConstraints"
            :deposit-disabled="depositConstraints"
            namad="دریک توکن" type="drc" :balance="balances.DRC"/>
        <crypto-address-tr
            :withdraw-disabled="withdrawConstraints"
            :deposit-disabled="depositConstraints"
            namad="اتریوم" type="eth" :balance="balances.ETH"/>
        <crypto-address-tr
            :withdraw-disabled="withdrawConstraints"
            :deposit-disabled="depositConstraints"
            namad="لایت کوین" type="ltc" :balance="balances.LTC"/>
        <crypto-address-tr
            :withdraw-disabled="withdrawConstraints"
            :deposit-disabled="depositConstraints"
            namad="تتر" type="usdt" :balance="balances.USDT"/>
        <crypto-address-tr
            :withdraw-disabled="withdrawConstraints"
            :deposit-disabled="depositConstraints"
            namad="ترون" type="trx" :balance="balances.TRX"/>
        <crypto-address-tr
            :withdraw-disabled="withdrawConstraints"
            :deposit-disabled="depositConstraints"
            namad="بیت کوین کش" type="bch" :balance="balances.BCH"/>
        <crypto-address-tr
            :withdraw-disabled="withdrawConstraints"
            :deposit-disabled="depositConstraints"
            namad="دوج کوین" type="doge" :balance="balances.DOGE"/>
        </tbody>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script>

import balances, {refresh} from '../balanceService'
import {init as initConstraints, withdrawConstraints, depositConstraints} from "../../../models/constraintService"
import CryptoAddressTr from "../../../components/CryptoAddressTr";
import {banners} from "../../../models/bannerService";
import BitraBanner from "../../../components/BitraBanner";

export default {
  name: "CryptoAddresses",
  components: {BitraBanner, CryptoAddressTr},
  computed: {
    balances,
    withdrawConstraints,
    depositConstraints,
    walletsBanners: () => banners('wallets'),
    user_id() {
      return this.$route.params.user_id
    }
  },
  mounted() {
    refresh(this.$axios, this.user_id)
    initConstraints(this.$axios)
  }
}
</script>

