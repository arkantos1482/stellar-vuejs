<template>
  <v-simple-table class="text-center">
    <template>
      <thead>
        <tr>
          <th class="text-center">نوع</th>
          <th class="text-center">رمزارزها</th>
          <th class="text-center">قیمت</th>
          <th class="text-center">مقدار</th>
          <th class="text-center">مجموع</th>
          <th class="text-center">پرشده</th>
          <th class="text-center">تاریخ</th>
          <th class="text-center">لغو</th>
        </tr>
      </thead>
      <tbody v-if="offers">
        <tr v-for="(item, idx) in offers" :key="idx">
          <td :class="item | toColor">{{ item | toFarsi }}</td>
          <td>{{ item | cryptoPair | toFarsiCoinPair }}</td>
          <td>{{ item | price }}</td>
          <td>{{ item | amount }}</td>
          <td>{{ item | total }}</td>
          <td>{{ item | percent }}</td>
          <td>{{ item.created_at | toFarsiDate }}</td>
          <td>
            <v-btn
              ref="deleteBtn"
              @click="cancel(item, idx)"
              outlined
              small
              color="red"
              >لغو
            </v-btn>
          </td>
        </tr>
      </tbody>
      <no-data v-else cols="7" title="سفارشی ثبت نشده است." />
    </template>
  </v-simple-table>
</template>

<script>
import pstopper from "@/mixins/pstopper"
import { safeDecimal, toSeparated } from "@/models/NumberUtil"
import { getDp, getMarketDp } from "@/models/cryptoPrecision"

export default {
  mixins: [pstopper],
  name: "MyActiveOffersTable",
  filters: {
    toFarsi(val) {
      return val.side === "buy" ? "خرید" : "فروش"
    },
    toColor(val) {
      return val.side === "buy" ? "success--text" : "error--text"
    },
    cryptoPair(item) {
      return item.base_asset + "/" + item.quote_asset
    },
    percent(item) {
      let filled = safeDecimal(item.amount).minus(
        safeDecimal(item.unmatched_amount)
      )
      return (
        filled
          .div(safeDecimal(item.amount))
          .times(100)
          .toFixed(0) + "%"
      )
    },
    price(item) {
      return toSeparated(safeDecimal(item.price))
    },
    amount(item) {
      return toSeparated(safeDecimal(item.amount))
    },
    total(item) {
      let total = safeDecimal(item.amount)
        .times(safeDecimal(item.price))
        .todp(getMarketDp(item.base_asset, item.quote_asset))

      return toSeparated(total)
    }
  },
  data() {
    return {
      userId: this.$route.params.userId
    }
  },
  computed: {
    offers() {
      return this.$store.state.offers.activeOffers
    }
  },
  async mounted() {
    await this.$store.dispatch("offers/refresh", this.userId)
  },
  methods: {
    async cancel(item, index) {
      this.$refs.deleteBtn[index].loading = true
      this.$refs.deleteBtn
        .filter(i => i !== index)
        .every(i => (i.disabled = true))
      await this.$store.dispatch("offers/delete", {
        id: item.id
      })
      this.$refs.deleteBtn.every(i => (i.disabled = false))
    }
  }
}
</script>

<style scoped></style>
