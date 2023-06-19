<template>
  <titled-page title="تاریخچه سفارشات">
    <a-paged-table
      :url="'offers/' + userId"
      :adapter="adapter"
      :headers="headers"
      :filter-query="filterQuery"
    >
      <template v-slot:item.offer_type="{ item }">
        <p :class="item.offer_type_color">{{ item.offer_type }}</p>
      </template>
      <template v-slot:item.cancel_text="{ item }">
        <p :class="item.cancel_color">{{ item.cancel_text }}</p>
      </template>
    </a-paged-table>
  </titled-page>
</template>

<script>
import pstopper from "@/mixins/pstopper"
import { toSeparated } from "@/models/NumberUtil"
import { getDp } from "@/models/cryptoPrecision"
import APagedTable from "~/components/APagedTable"
import { safeDecimal } from "~/models/NumberUtil"
import { toFarsiDate } from "~/models/utils"
import TitledPage from "~/components/TitledPage.vue"

export default {
  components: { TitledPage, APagedTable },
  mixins: [pstopper],
  name: "Offers",
  methods: {
    adapter(item) {
      let coin = item.side === "buy" ? item.base_asset : item.quote_asset
      return {
        offer_type: item.side === "buy" ? "خرید" : "فروش",
        offer_type_color: item.side === "buy" ? "success--text" : "error--text",
        pair_asset: item.base_asset + "/" + item.quote_asset,
        price: toSeparated(safeDecimal(item.price)),
        amount: toSeparated(safeDecimal(item.amount)),
        total: toSeparated(
          safeDecimal(item.amount).times(item.price).todp(getDp(coin))
        ),
        created_at: toFarsiDate(item.created_at),
        cancel_text: item.cancelled ? "لغو شده" : "ثبت شده",
        cancel_color: item.cancelled ? "error--text" : "success--text",
      }
    },
  },
  data() {
    return {
      userId: this.$route.params.userId,
      headers: [
        { value: "offer_type", text: "نوع", align: "center", sortable: false },
        {
          value: "pair_asset",
          text: "رمزارزها",
          align: "center",
          sortable: false,
        },
        { value: "price", text: "قیمت", align: "center", sortable: false },
        { value: "amount", text: "مقدار", align: "center", sortable: false },
        { value: "total", text: "مجموع", align: "center", sortable: false },
        {
          value: "created_at",
          text: "تاریخ",
          align: "center",
          sortable: false,
        },
        {
          value: "cancel_text",
          text: "وضعیت",
          align: "center",
          sortable: false,
        },
      ],
      filterQuery: [
        { type: "time", key: "after", name: "بعد از", value: "" },
        { type: "time", key: "before", name: "قبل از", value: "" },
      ],
    }
  },
}
</script>

<style scoped></style>
