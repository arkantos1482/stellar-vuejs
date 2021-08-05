<template>
  <v-simple-table class="text-center">
    <thead>
    <tr>
      <th>نوع</th>
      <th>رمزارزها</th>
      <th>قیمت</th>
      <th>مقدار</th>
      <th>مجموع</th>
      <th>کارمزد</th>
      <th>تاریخ</th>
    </tr>
    </thead>
    <tbody v-if="trades.length">
    <tr v-for="item in trades" :key="item.id">
      <td :class="item|toColor">{{ item|toFarsiSellOrBuy }}</td>
      <td>{{ item|cryptoPair|toFarsiCoinPair }}</td>
      <td>{{ item|price }}</td>
      <td>{{ item|amount }}</td>
      <td>{{ item|total }}</td>
      <td>{{ fee(item) }} <span>{{ item|feeCoin|toFarsiCoin }}</span></td>
      <td>{{ item.ledger_closed_at|toFarsiDate }}</td>
    </tr>
    </tbody>
    <no-data v-else cols="7" title="معامله ای ثبت نشده است."/>
  </v-simple-table>
</template>

<script>
import {safeDecimal, toSeparated} from "@/models/NumberUtil";
import Decimal from "decimal.js-light";
import {getDp, getMarketDp} from "@/models/cryptoPrecision";

export default {
  name: "MyTradesTable",
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
      return toSeparated(
          safeDecimal(item.base_amount)
              .todp(getMarketDp(item.base_asset_code, item.counter_asset_code)))
    },
    feeCoin(item) {
      return item.op_type === 'buy'
          ? item.counter_asset_code
          : item.base_asset_code
    }
  },

  data() {
    return {
      userId: this.$route.params.userId || 'me',
      trades: []
    }
  },
  async mounted() {
    this.trades = (await this.$axios.$get('/trades/' + this.userId))
    // let list = (await this.$axios.$get('/effects'))._embedded.records;
    // this.trades = collect(list)
    //     .filter(item => item.type === 'trade')
    //     .all();
  },
  methods: {
    fee(item) {
      // if ((item.op_type !== 'buy' && item.base_asset_code === 'IRR')
      //     || (item.op_type === 'buy' && item.counter_asset_code === 'IRR')) {
      //   return 0
      // }
      return item.op_type === 'buy'
          ? toSeparated(this.adjustDp(safeDecimal(item.counter_amount).times(0.002),
              item.counter_asset_code, item.base_asset_code))
          : toSeparated(this.adjustDp(safeDecimal(item.base_amount).times(0.002),
              item.base_asset_code, item.counter_asset_code))
    },
    adjustDp(val, base, ctr) {
      return safeDecimal(val).todp(getMarketDp(base, ctr))
    }
  }
}
</script>

<style scoped>

</style>