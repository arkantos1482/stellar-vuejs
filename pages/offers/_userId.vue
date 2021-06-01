<template>
  <div class="pa-4">
    <div class="text-h4 mb-6 text-right">تاریخچه سفارشات</div>
    <v-card width="100%" class="pa-6">
      <a-table-header :list="['همه','IRT', 'BCH', 'BTC']"
                      list_name="نوع" from_name="تاریخ از" to_name="تاریخ تا"/>
      <v-simple-table class="text-center">
        <template>
          <thead>
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
          <tbody v-if="offers.length">
          <tr v-for="(item,idx) in offers" :key="idx">
            <td :class="item|toColor">{{ item|toFarsi }}</td>
            <td>{{ item|cryptoPair|toFarsiCoinPair }}</td>
            <td>{{ item|price }}</td>
            <td>{{ item|amount }}</td>
            <td>{{ item|total }}</td>
            <td>{{ item.created_at|toFarsiDate }}</td>
            <td :class="item|cancelColor">{{ item|cancelText }}</td>
          </tr>
          </tbody>
          <no-data v-else cols="7" title="تاریخچه ای وجود ندارد."/>
        </template>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script>
import pstopper from "@/mixins/pstopper";
import Decimal from "decimal.js-light";
import {toSeparated} from "@/models/NumberUtil";
import {getDp} from "@/models/cryptoPrecision";

export default {
  mixins: [pstopper],
  name: 'Offers',
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
      let coin = item.type === 'buy' ? item.selling_asset_code : item.buying_asset_code
      let total = new Decimal(item.amount).times(item.price_r.n).div(item.price_r.d)
          .todp(getDp(coin))
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
    return {
      userId: this.$route.params.userId,
      offers: []
    }
  },
  async mounted() {
    this.offers = await this.$axios.$get('/offers/' + this.userId)
  }
}
</script>

<style scoped>

</style>