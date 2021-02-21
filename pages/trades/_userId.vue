<template>
  <v-card width="100%" class="text-center">
    <v-simple-table>
      <thead class="grey lighten-3">
      <tr>
        <th class="text-center">نوع</th>
        <th class="text-center">رمزارزها</th>
        <th class="text-center">قیمت</th>
        <th class="text-center">مقدار</th>
        <th class="text-center">مجموع</th>
        <th class="text-center">کارمزد</th>
        <th class="text-center">تاریخ</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in trades" :key="item.id">
        <td :class="item|toColor">{{ item|toFarsiSellOrBuy }}</td>
        <td>{{ item|cryptoPair|toFarsiCoinPair }}</td>
        <td>{{ item|price }}</td>
        <td>{{ item|amount }}</td>
        <td>{{ item|total }}</td>
        <td>{{ item|fee }} <span>{{ item|feeCoin|toFarsiCoin }}</span></td>
        <td>{{ item.ledger_closed_at|toFarsiDate }}</td>
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
  name: "Trades",
  filters: {
    toFarsiSellOrBuy: (val) => val.op_type === 'buy' ? 'خرید' : 'فروش',
    toColor(val) {
      return val.op_type === 'buy' ? 'success--text' : 'error--text'
    },
    cryptoPair(item) {
      return item.counter_asset_code + '/' + item.base_asset_code
    },
    price(item) {
      return toSeparated(new Decimal(item.price_d).div(item.price_n))
    },
    amount(item) {
      return toSeparated(parseFloat(item.counter_amount))
    },
    total(item) {
      return toSeparated(safeDecimal(item.base_amount).todp(getDp(item.base_asset_code)))
    },
    fee(item) {
      // if ((item.op_type !== 'buy' && item.base_asset_code === 'IRR')
      //     || (item.op_type === 'buy' && item.counter_asset_code === 'IRR')) {
      //   return 0
      // }
      return item.op_type === 'buy'
          ? toSeparated(safeDecimal(item.counter_amount).times(0.002))
          : toSeparated(safeDecimal(item.base_amount).times(0.002))
    },
    feeCoin(item) {
      return item.op_type === 'buy'
          ? item.counter_asset_code
          : item.base_asset_code
    }
  },

  data() {
    return {
      userId: this.$route.params.userId,
      trades: []
    }
  },
  async mounted() {
    this.trades = (await this.$axios.$get('/trades/' + this.userId))
    // let list = (await this.$axios.$get('/effects'))._embedded.records;
    // this.trades = collect(list)
    //     .filter(item => item.type === 'trade')
    //     .all();
  }
}
</script>

<style scoped>

</style>