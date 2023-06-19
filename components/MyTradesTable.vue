<template>
  <div>
    <a-paged-table
      ref="trades"
      :url="'/trades/' + userId"
      :adapter="adapter"
      :headers="headers"
      :filter-query="query"
      :hide-paginate="hidePaginate"
      :hide-filter="hideFilter"
      default-sort-by="created_at"
      :default-sort-desc="true"
    >
      <template v-slot:item.trade_type="{ item }">
        <p :class="tradeTypeColor(item.trade_type)">{{ item.trade_type }}</p>
      </template>
    </a-paged-table>

    <div v-if="!hideExport" class="text-center mt-6">
      <v-btn
        @click="externalExport"
        color="primary"
        outlined
        :loading="l.export"
      >
        Excel Export
      </v-btn>
    </div>
  </div>
</template>

<script>
import APagedTable from "../components/APagedTable"
import { safeDecimal, toSeparated } from "~/models/NumberUtil"
import { axiosDownload, toFarsiCoinPair, toFarsiDate } from "~/models/utils"
import { getMarketDp } from "~/models/cryptoPrecision"

export default {
  name: "myTradesTable",
  components: { APagedTable },
  props: ["query", "hidePaginate", "hideFilter", "hideExport"],
  computed: {
    userId() {
      return this.$route.params.userId || "me"
    },
  },
  data() {
    return {
      headers: [
        { value: "trade_type", text: "نوع", align: "center", sortable: false },
        {
          value: "pair_asset",
          text: "رمزارزها",
          align: "center",
          sortable: false,
        },
        { value: "price", text: "قیمت", align: "center", sortable: false },
        { value: "amount", text: "مقدار", align: "center", sortable: false },
        { value: "total", text: "مجموع", align: "center", sortable: false },
        // {
        //   value: "fee_ratio",
        //   text: "ضریب کارمزد",
        //   align: "center",
        //   sortable: false
        // },
        // { value: "fee", text: "کارمزد", align: "center", sortable: false },
        { value: "created_at", text: "تاریخ", align: "center" },
      ],
      l: { export: false },
    }
  },
  methods: {
    adapter(item) {
      return {
        trade_type: item.maker_side === "buy" ? "خرید" : "فروش",
        pair_asset: toFarsiCoinPair(item.base_asset + "/" + item.quote_asset),
        price: toSeparated(safeDecimal(item.price)),
        amount: toSeparated(parseFloat(item.amount)),
        total: toSeparated(
          safeDecimal(item.amount)
            .mul(safeDecimal(item.price))
            .todp(getMarketDp(item.base_asset, item.quote_asset))
        ),
        // fee_ratio: safeDecimal(item.fee_ratio),
        // fee: this.fee(item) + " " + toFarsiCoin(this.feeCoin(item)),
        created_at: toFarsiDate(item.created_at),
      }
    },
    // export_total(list) {
    //   return {
    //     trade_type: " ",
    //     pair_asset: " ",
    //     price: " ",
    //     amount: list.reduce((c, i) => c.plus(i.amount), safeDecimal(0)),
    //     total: list.reduce((c, i) => c.plus(i.total), safeDecimal(0)),
    //     fee_ratio: " ",
    //     fee: " ",
    //     ledger_closed_at: " "
    //   }
    // },
    tradeTypeColor: (type) =>
      type === "خرید" ? "success--text" : "error--text",
    adjustDp(val, base, ctr) {
      return safeDecimal(val).todp(getMarketDp(base, ctr))
    },
    async externalExport() {
      this.l.export = true
      let link = `${this.$axios.defaults.baseURL}/trades/${this.userId}/export`
      await axiosDownload(this.$axios, link, "trades.xlsx")
      this.l.export = false
    },
  },
}
</script>

<style scoped></style>
