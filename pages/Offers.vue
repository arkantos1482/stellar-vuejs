<template>
  <v-card width="100%" class="text-center">
    <v-simple-table>
      <template>
        <thead class="grey lighten-3">
        <tr>
          <th class="text-center">نوع</th>
          <th class="text-center">رمزارزها</th>
          <th class="text-center">قیمت</th>
          <th class="text-center">مقدار</th>
          <th class="text-center">مجموع</th>
          <th class="text-center">تاریخ</th>
          <th class="text-center">وضعیت</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,idx) in offers" :key="idx">
          <td :class="item|toColor">{{ item|toFarsi }}</td>
          <td>{{ item|cryptoPair }}</td>
          <td>{{ item|price }}</td>
          <td>{{ item|amount }}</td>
          <td>{{ item|total }}</td>
          <td>{{ item.created_at|toFarsiDate }}</td>
          <td :class="item|cancelColor">{{ item|cancelText }}</td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script>
import pstopper from "@/mixins/pstopper";
import Decimal from "decimal.js-light";
import {toSeparated} from "@/models/NumberUtil";

export default {
  mixins: [pstopper],
  name: 'ActiveOffers',
  filters: {
    toFarsi(val) {
      return val.type === 'buy' ? 'خرید' : 'فروش'
    },
    toColor(val) {
      return val.type === 'buy' ? 'success--text' : 'error--text'
    },
    cryptoPair(item) {
      return item.type === 'buy'
          ? item.buying_asset_code + '/' + item.selling_asset_code
          : item.selling_asset_code + '/' + item.buying_asset_code
    },
    price(item) {
      let price = new Decimal(item.price_r.n).div(item.price_r.d)
      return toSeparated(price)
      // return item.type === 'buy'
      //     ? price + item.buying_asset_code
      //     : price + item.selling_asset_code
    },
    amount(item) {
      let amount = parseFloat(item.amount)
      return toSeparated(amount)
      // return item.type === 'buy'
      //     ? amount + item.buying_asset_code
      //     : amount + item.selling_asset_code
    },
    total(item) {
      let total = new Decimal(item.amount).times(item.price_r.n).div(item.price_r.d)
      return toSeparated(total)
      // return item.type === 'buy'
      //     ? total + item.buying_asset_code
      //     : total + item.selling_asset_code
    },
    cancelText(item) {
      return parseFloat(item.amount) === 0 ? 'لغو شده' : 'موفقیت آمیز'
    },
    cancelColor(item) {
      return parseFloat(item.amount) === 0 ? 'error--text' : 'success--text'
    }
  },
  data() {
    return {offers: []}
  },
  async mounted() {
    this.offers = await this.$axios.$get('/offers')
  }
}
</script>

<style scoped>

</style>