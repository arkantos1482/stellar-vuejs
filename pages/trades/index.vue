<template>
  <div class="text-center pa-6">
    <card-title-with-chevron simple icon="mdi-clipboard-text" title="معاملات" />
    <v-simple-table>
      <thead>
        <tr>
          <th class="text-center">قیمت</th>
          <th class="text-center">مقدار</th>
          <th class="text-center">مجموع</th>
          <th class="text-center">تاریخ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in trades" :key="item.id" :class="item | toColor">
          <td>{{ item | price }}</td>
          <td>{{ item | amount }}</td>
          <td>{{ total(item) }}</td>
          <td>{{ item.created_at | toFarsiDate }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
import { safeDecimal, toSeparated } from "@/models/NumberUtil"
import { getMarketDp } from "@/models/cryptoPrecision"
import CardTitleWithChevron from "~/components/CardTitleWithChevron.vue"

export default {
  name: "PairAssetTrades",
  components: { CardTitleWithChevron },
  props: ["base", "counter"],
  filters: {
    toColor(item) {
      return item.maker_side === "sell" ? "error--text" : "success--text"
    },
    price(item) {
      return toSeparated(safeDecimal(item.price))
    },
    amount(item) {
      return toSeparated(safeDecimal(item.amount))
    },
  },
  watch: {
    base() {
      this.refresh()
    },
    counter() {
      this.refresh()
    },
  },
  data() {
    return {
      trades: [],
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let trades = await this.$axios.$get("/trades-pair-asset", {
        params: { base: this.base, counter: this.counter },
      })
      this.trades = trades.data
    },
    total(item) {
      let result = safeDecimal(item.price * item.amount)
      return toSeparated(result.todp(getMarketDp(this.base, this.counter)))
    },
  },
}
</script>

<style scoped></style>
