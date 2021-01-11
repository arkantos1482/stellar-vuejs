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
        <th class="text-center">تاریخ</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in trades" :key="item.id">
        <td>{{ item.base_is_seller|toFarsiSellOrBuy }}</td>
        <td>{{ item|cryptoPair }}</td>
        <td>{{ item|price }}</td>
        <td>{{ item|amount }}</td>
        <td>{{ item|total }}</td>
        <td>{{ item.ledger_close_time|toFarsiDate }}</td>
      </tr>
      </tbody>
    </v-simple-table>
  </v-card>
</template>

<script>

import Decimal from "decimal.js-light";
import {toSeparated} from "@/models/NumberUtil";

export default {
  name: "Trades",
  filters: {
    toFarsiSellOrBuy: (val) => val ? 'فروش' : 'خرید',
    cryptoPair(item) {
      return item.base_is_seler
          ? item.base_asset_code + '/' + item.counter_asset_code
          : item.counter_asset_code + '/' + item.base_asset_code
    },
    price(item) {
      return item.base_is_seler
          ? toSeparated(new Decimal(item.price.n).div(item.price.d))
          : toSeparated(new Decimal(item.price.d).div(item.price.n))
    },
    amount(item) {
      return item.base_is_seler
          ? toSeparated(parseFloat(item.base_amount))
          : toSeparated(parseFloat(item.counter_amount))
    },
    total(item) {
      return item.base_is_seler
          ? toSeparated(new Decimal(item.base_amount).times(item.price.n).div(item.price.d))
          : toSeparated(new Decimal(item.counter_amount).times(item.price.d).div(item.price.n))
    }
  },

  data() {
    return {
      trades: []
    }
  },
  async mounted() {
    this.trades = (await this.$axios.$get('/trades'))._embedded.records
    // let list = (await this.$axios.$get('/effects'))._embedded.records;
    // this.trades = collect(list)
    //     .filter(item => item.type === 'trade')
    //     .all();
  }
}
</script>

<style scoped>

</style>