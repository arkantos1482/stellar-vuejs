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
          <th class="text-center">لغو</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,idx) in offers" :key="idx">
          <td :class="item|toColor">{{ item|toFarsi }}</td>
          <td>{{ item|cryptoPair|toFarsiCoinPair }}</td>
          <td>{{ item|price }}</td>
          <td>{{ item|amount }}</td>
          <td>{{ item|total }}</td>
          <td>{{ item.created_at|toFarsiDate }}</td>
          <td>
            <v-btn ref="deleteBtn"
                   @click="cancel(item,idx)"
                   outlined small color="red">لغو
            </v-btn>
          </td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
    <!--      <json-viewer :value="offers" dir="ltr"/>-->
  </v-card>
</template>

<script>
import pstopper from "@/mixins/pstopper";
import {safeDecimal, toSeparated} from "@/models/NumberUtil";
import {getDp} from "@/models/cryptoPrecision";

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
      let price = safeDecimal(item.price_r?.n).div(safeDecimal(item.price_r?.d))
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
      let total = safeDecimal(item.amount)
          .times(safeDecimal(item.price_r?.n))
          .div(safeDecimal(item.price_r?.d))
          .todp(getDp(coin))
      return toSeparated(total)
      // return item.type === 'buy'
      //     ? total + item.buying_asset_code
      //     : total + item.selling_asset_code
    }
  },
  computed: {
    offers() {
      return this.$store.state.offers.activeOffers
    }
  },
  async mounted() {
    await this.$store.dispatch("offers/refresh")
  },
  methods: {
    async cancel(item, index) {
      this.$refs.deleteBtn[index].loading = true
      await this.$store.dispatch("offers/delete", {
        id: item.offer_id,
        type: item.type,
        sell: item.selling_asset_code,
        buy: item.buying_asset_code,
        price: item.price
      })
      await new Promise(r => setTimeout(r, 2000))
      await this.$store.dispatch("offers/refresh")
      await new Promise(r => setTimeout(r, 2000))
      await this.$store.dispatch("offers/refresh")
      await new Promise(r => setTimeout(r, 2000))
      await this.$store.dispatch("offers/refresh")
    }
  }
}
</script>

<style scoped>

</style>