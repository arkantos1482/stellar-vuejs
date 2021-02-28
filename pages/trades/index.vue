<template>
  <v-card width="100%" class="text-center">
    <v-simple-table>
      <thead class="grey lighten-3">
      <tr>
        <th class="text-center">تاریخ</th>
        <th class="text-center">قیمت</th>
        <th class="text-center">مقدار</th>
        <th class="text-center">مجموع</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in trades" :key="item.id" :class="item|toColor">
        <td>{{ item.ledger_closed_at|toFarsiDate }}</td>
        <td>{{ item|price }}</td>
        <td>{{ item|amount }}</td>
        <td>{{ item|total }}</td>
      </tr>
      </tbody>
    </v-simple-table>
  </v-card>
</template>

<script>

import Decimal from "decimal.js-light";
import {safeDecimal, toSeparated} from "@/models/NumberUtil";
import {getDp} from "@/models/cryptoPrecision";

export default {
  props: ['base', 'counter'],
  filters: {
    toColor(item) {
      return item.operation.type === 12 ? 'success--text' : 'error--text'
    },
    price(item) {
      return toSeparated(new Decimal(item.price_d).div(item.price_n))
    },
    amount(item) {
      return toSeparated(parseFloat(item.counter_amount))
    },
    total(item) {
      return toSeparated(safeDecimal(item.base_amount).todp(getDp(this.base)))
    },
  },
  data() {
    return {
      trades: []
    }
  },
  async mounted() {
    this.trades = await this.$axios.$get('/trades-pair-asset', {
      params: {base: this.base, counter: this.counter}
    })
  }
}
</script>

<style scoped>

</style>