<template>
  <div v-if="balance" class="d-flex align-center">
    <v-icon small class="mb-4 ml-2" color="primary">mdi-circle</v-icon>
    <p class="grey--text">{{ balance.symbol|toFarsiCoin }}</p>
    <v-spacer/>
    <p>{{ adjustDp(balance.actual_balance)|toFloat|separated }}</p>
    <p class="grey--text">&nbsp&nbsp{{ balance.symbol|irtFix }}</p>
  </div>
</template>
<script>
import {safeDecimal} from "~/models/NumberUtil";
import {getDp} from "~/models/cryptoPrecision";

export default {
  name: 'DashWalletRow',
  props: ['balance'],
  methods: {
    adjustDp(val) {
      return safeDecimal(val).todp(getDp(this.balance.symbol))
    }
  }
}
</script>