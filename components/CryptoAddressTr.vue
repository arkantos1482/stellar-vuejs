<template>
  <tr>
    <td>
      <div class="d-flex align-center">
        <v-img
          class="ml-2"
          max-width="36"
          max-height="36"
          :src="type | toCoinIcon"
        />
        {{ namad }}&nbsp({{ type.toUpperCase() | irtFix }})
      </div>
    </td>
    <td v-if="balanceObj">
      {{ adjustDp(balanceObj.total_balance) | toFloat | separated }}
    </td>
    <td v-else></td>
    <td v-if="balanceObj">
      {{ adjustDp(balanceObj.actual_balance) | toFloat | separated }}
    </td>
    <td v-else></td>
    <td v-if="balanceObj">
      {{ adjustDp(balanceObj.locked_balance) | toFloat | separated }}
    </td>
    <td v-else></td>
    <!--    <td></td>-->
    <td>
      <v-btn
        :disabled="isDepositDisabled"
        small
        text
        color="accent"
        @click="onDeposit"
      >
        {{ depositLabel }}
      </v-btn>
      <v-btn
        :disabled="isWithdrawDisabled"
        small
        text
        color="accent"
        class="mx-8"
        @click="onWithdraw"
      >
        {{ withdrawLabel }}
      </v-btn>
      <v-btn
        :disabled="isRefreshDisabled"
        icon
        @click="onSync"
        :loading="l.sync"
      >
        <v-icon color="accent">mdi-refresh</v-icon>
      </v-btn>
    </td>
  </tr>
</template>
<script>
import ps from "@/mixins/pstopper"
import { safeDecimal } from "@/models/NumberUtil"
import { getDp } from "@/models/cryptoPrecision"
import { refresh } from "~/pages/wallets/balanceService"

export default {
  mixins: [ps],
  name: "CryptoAddressTr",
  props: ["type", "balanceObj", "namad", "withdrawDisabled", "depositDisabled"],
  computed: {
    user_id() {
      return this.$route.params.user_id
    },
    isRefreshDisabled() {
      return ["AMN", "EBG", "SHA", "ART", "ZRK", "TLS", "WIT", "IRR"].includes(
        this.type.toUpperCase()
      )
    },
    isDepositDisabled() {
      return this.depositDisabled?.includes(this.type.toUpperCase())
    },
    isWithdrawDisabled() {
      return this.withdrawDisabled?.includes(this.type.toUpperCase())
    },
    withdrawLabel() {
      return this.isInternal() ? "ارسال" : "برداشت"
    },
    depositLabel() {
      return this.isInternal() ? "دریافت" : "واریز"
    },
  },
  data() {
    return {
      l: { create: false, sync: false },
    }
  },
  methods: {
    async onDeposit() {
      await this.$router.push({
        path: `/wallets/${this.user_id}/deposits/${this.type}`,
      })
    },
    async onWithdraw() {
      await this.$router.push({
        path: `/wallets/${this.user_id}/withdraws/${this.type}`,
      })
    },
    async onSync() {
      this.l.sync = true
      await this.$axios.$post(`/crypto/sync/${this.user_id}`, {
        crypto: this.type,
      })
      await refresh(this.$axios, this.user_id)
      this.l.sync = false
    },
    isInternal() {
      return ["AMN", "EBG", "SHA", "ART", "ZRK", "TLS", "WIT"].includes(
        this.type.toUpperCase()
      )
    },
    adjustDp(val) {
      return safeDecimal(val).todp(getDp(this.type))
    },
  },
}
</script>
