<template>
  <titled-page title="کیف پول شما">
    <div>
      <bitra-banner v-for="(i, key) in walletsBanners" :item="i" :key="key" />

      <v-simple-table>
        <thead>
          <tr>
            <th class="pr-16">ارز</th>
            <th class="text-center">موجودی</th>
            <th class="text-center">موجودی در دسترس</th>
            <th class="text-center">سفارش در جریان</th>
            <th class="text-center">عملیات</th>
          </tr>
        </thead>
        <tbody>
          <crypto-address-tr
            :withdraw-disabled="withdrawConstraints"
            :deposit-disabled="depositConstraints"
            namad="تومان"
            type="irr"
            :balanceObj="balances.IRR"
          />

          <crypto-address-tr
            :withdraw-disabled="withdrawConstraints"
            :deposit-disabled="depositConstraints"
            namad="بیت کوین"
            type="btc"
            :balanceObj="balances.BTC"
          />
          <crypto-address-tr
            :withdraw-disabled="withdrawConstraints"
            :deposit-disabled="depositConstraints"
            namad="بایننس"
            type="bnb"
            :balanceObj="balances.BNB"
          />
          <crypto-address-tr
            :withdraw-disabled="withdrawConstraints"
            :deposit-disabled="depositConstraints"
            namad="اتریوم"
            type="eth"
            :balanceObj="balances.ETH"
          />
          <crypto-address-tr
            :withdraw-disabled="withdrawConstraints"
            :deposit-disabled="depositConstraints"
            namad="لایت کوین"
            type="ltc"
            :balanceObj="balances.LTC"
          />
          <crypto-address-tr
            :withdraw-disabled="withdrawConstraints"
            :deposit-disabled="depositConstraints"
            namad="تتر"
            type="usdt"
            :balanceObj="balances.USDT"
          />
          <crypto-address-tr
            :withdraw-disabled="withdrawConstraints"
            :deposit-disabled="depositConstraints"
            namad="ترون"
            type="trx"
            :balanceObj="balances.TRX"
          />
          <crypto-address-tr
            :withdraw-disabled="withdrawConstraints"
            :deposit-disabled="depositConstraints"
            namad="بیت کوین کش"
            type="bch"
            :balanceObj="balances.BCH"
          />
          <crypto-address-tr
            :withdraw-disabled="withdrawConstraints"
            :deposit-disabled="depositConstraints"
            namad="دوج کوین"
            type="doge"
            :balanceObj="balances.DOGE"
          />
        </tbody>
      </v-simple-table>
    </div>
  </titled-page>
</template>

<script>
import balances, { refresh } from "../balanceService"
import {
  init as initConstraints,
  withdrawConstraints,
  depositConstraints,
} from "~/models/constraintService"
import CryptoAddressTr from "~/components/CryptoAddressTr"
import { banners } from "~/models/bannerService"
import BitraBanner from "~/components/BitraBanner"
import TitledPage from "~/components/TitledPage.vue"

export default {
  name: "CryptoAddresses",
  components: { TitledPage, BitraBanner, CryptoAddressTr },
  computed: {
    balances,
    withdrawConstraints,
    depositConstraints,
    walletsBanners: () => banners("wallets"),
    user_id() {
      return this.$route.params.user_id
    },
  },
  mounted() {
    refresh(this.$axios, this.user_id)
    initConstraints(this.$axios)
  },
}
</script>
