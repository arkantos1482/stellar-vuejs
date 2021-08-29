<template>
  <v-card width="100%" height="100%" class="text-center pa-6">
    <card-title-with-chevron simple icon="mdi-clipboard-text" title="معاملات"/>
    <v-simple-table>
      <thead>
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
        <td>{{ total(item) }}</td>
      </tr>
      </tbody>
    </v-simple-table>
  </v-card>
</template>

<script>

import Decimal from "decimal.js-light";
import {safeDecimal, toSeparated} from "@/models/NumberUtil";
import {getDp, getMarketDp} from "@/models/cryptoPrecision";
import collect from "collect.js";

export default {
  name: 'PairAssetTrades',
  props: ['base', 'counter'],
  filters: {
    toColor(item) {
      return item.operation.type === 12 ? 'success--text' : 'error--text'
    },
    price(item) {
      return toSeparated(safeDecimal(item.operation.details.price))
    },
    amount(item) {
      return toSeparated(safeDecimal(item.operation.details.amount))
    }
  },
  watch: {
    base() {
      this.refresh()
    },
    counter() {
      this.refresh()
    }
  },
  data() {
    return {
      trades: []
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await this.$axios.$get('/trades-pair-asset', {
        params: {base: this.base, counter: this.counter}
      })
      this.trades = collect(res).unique('history_operation_id').all()
    },
    total(item) {
      let result = safeDecimal(item.operation.details.price * item.operation.details.amount)
      return toSeparated(result.todp(getMarketDp(this.base, this.counter)))
    },
  },
}
</script>

<style scoped>

</style>