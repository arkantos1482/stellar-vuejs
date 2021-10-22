<template>
  <div class="pa-4">
    <a-paged-table
        ref="trades"
        :url="'/trades/' + userId"
        :adapter="adapter"
        :headers="headers"
        :filter-query="query"
        :hide-paginate="hidePaginate"
        :hide-filter="hideFilter"
        default-sort-by="ledger_closed_at"
        :default-sort-desc="true"
    >
      <template v-slot:item.trade_type="{item}">
        <p :class="tradeTypeColor(item.trade_type)">{{ item.trade_type }}</p>
      </template>
    </a-paged-table>

    <div v-if="!hideExport" class="text-center mt-6">
      <v-btn @click="exportCsv" color="primary" outlined>CSV Export</v-btn>
    </div>

  </div>
</template>

<script>

import APagedTable from "../components/APagedTable";
import {safeDecimal, toSeparated} from "../models/NumberUtil";
import {toFarsiCoin, toFarsiCoinPair, toFarsiDate} from "../models/utils";
import {getMarketDp} from "../models/cryptoPrecision";
import {exportCSVFile} from "../models/csvUtil";
import {collect} from "collect.js";

export default {
  name: "myTradesTable",
  components: {APagedTable},
  props: ['query', 'hidePaginate', 'hideFilter', 'hideExport'],
  computed: {
    userId() {
      return this.$route.params.userId || 'me'
    }
  },
  data() {
    return {
      headers: [
        {value: 'trade_type', text: 'نوع', align: 'center', sortable: false},
        {value: 'pair_asset', text: 'رمزارزها', align: 'center', sortable: false},
        {value: 'price', text: 'قیمت', align: 'center', sortable: false},
        {value: 'amount', text: 'مقدار', align: 'center', sortable: false},
        {value: 'total', text: 'مجموع', align: 'center', sortable: false},
        {value: 'fee_ratio', text: 'ضریب کارمزد', align: 'center', sortable: false},
        {value: 'fee', text: 'کارمزد', align: 'center', sortable: false},
        {value: 'ledger_closed_at', text: 'تاریخ', align: 'center'},
      ],
    }
  },
  methods: {
    adapter(item) {
      return {
        trade_type: item.op_type === 'buy' ? 'خرید' : 'فروش',
        pair_asset: toFarsiCoinPair(item.counter_asset_code + '/' + item.base_asset_code),
        price: toSeparated(safeDecimal(item.price_d).div(item.price_n)),
        amount: toSeparated(parseFloat(item.counter_amount)),
        total: toSeparated(safeDecimal(item.base_amount)
            .todp(getMarketDp(item.base_asset_code, item.counter_asset_code))),
        fee_ratio: safeDecimal(item.fee_ratio),
        fee: this.fee(item) + ' ' + toFarsiCoin(this.feeCoin(item)),
        ledger_closed_at: toFarsiDate(item.ledger_closed_at),
      }
    },
    export_adapter(item) {
      return {
        trade_type: item.op_type === 'buy' ? 'خرید' : 'فروش',
        pair_asset: toFarsiCoinPair(item.counter_asset_code + '/' + item.base_asset_code),
        price: (safeDecimal(item.price_d).div(item.price_n)),
        amount: (parseFloat(item.counter_amount)),
        total: (safeDecimal(item.base_amount)
            .todp(getMarketDp(item.base_asset_code, item.counter_asset_code))),
        fee_ratio: safeDecimal(item.fee_ratio),
        fee: this.fee(item) + ' ' + toFarsiCoin(this.feeCoin(item)),
        ledger_closed_at: toFarsiDate(item.ledger_closed_at),
      }
    },
    export_total(list) {
      return {
        trade_type: ' ',
        pair_asset: ' ',
        price: ' ',
        amount: list.reduce((c, i) => c.plus(i.amount), safeDecimal(0)),
        total: list.reduce((c, i) => c.plus(i.total), safeDecimal(0)),
        fee_ratio: ' ',
        fee: ' ',
        ledger_closed_at: ' ',
      }
    },
    tradeTypeColor: (type) => type === 'خرید' ? 'success--text' : 'error--text',
    fee(item) {
      // if ((item.op_type !== 'buy' && item.base_asset_code === 'IRR')
      //     || (item.op_type === 'buy' && item.counter_asset_code === 'IRR')) {
      //   return 0
      // }
      return item.op_type === 'buy'
          ? toSeparated(this.adjustDp(safeDecimal(item.counter_amount).times(safeDecimal(item.fee_ratio)),
              item.base_asset_code, item.counter_asset_code))
          : toSeparated(this.adjustDp(safeDecimal(item.base_amount).times(safeDecimal(item.fee_ratio)),
              item.counter_asset_code, item.base_asset_code))
    },
    adjustDp(val, base, ctr) {
      return safeDecimal(val).todp(getMarketDp(base, ctr))
    },
    feeCoin(item) {
      return item.op_type === 'buy'
          ? item.counter_asset_code
          : item.base_asset_code
    },
    exportCsv() {
      let items = this.$refs.trades.raw_data.map(this.export_adapter)
      let total = this.export_total(items)
      items.push(total)
      exportCSVFile(
          collect(this.headers).pluck('text').all(),
          items,
          'trades')
    }
  },
}
</script>

<style scoped>

</style>