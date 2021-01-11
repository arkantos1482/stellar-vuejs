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
          <td>{{ item.type|toFarsi }}</td>
          <td>{{ item|cryptoPair }}</td>
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
import Decimal from "decimal.js-light";
import {toSeparated} from "@/models/NumberUtil";

export default {
  mixins: [pstopper],
  name: 'ActiveOffers',
  filters: {
    toFarsi(val) {
      return val === 'buy' ? 'خرید' : 'فروش'
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