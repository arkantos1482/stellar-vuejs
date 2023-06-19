<template>
  <titled-page title="معاملات">
    <my-trades-table :query="filterQuery" />
  </titled-page>
</template>

<script>
import MyTradesTable from "@/components/MyTradesTable"
import { coinList } from "~/models/coinList"
import TitledPage from "@/components/TitledPage.vue"

export default {
  name: "myTrades",
  components: { TitledPage, MyTradesTable },
  computed: {
    coinList: () => ["", ...coinList.filter((i) => i !== "USDT_TRON")],
    filterQuery() {
      return [
        { type: "time", key: "after", name: "بعد از", value: "" },
        { type: "time", key: "before", name: "قبل از", value: "" },
        {
          type: "enum",
          key: "op_type",
          name: "نوع",
          value: "",
          options: ["", "buy", "sell"],
        },
        {
          type: "enum",
          key: "counter_asset_code",
          name: "رمزارز پایه",
          value: "",
          options: this.coinList,
        },
        {
          type: "enum",
          key: "base_asset_code",
          name: "رمزارز مقابل",
          value: "",
          options: this.coinList,
        },
      ]
    },
  },
}
</script>

<style scoped></style>
