<template>
  <div class="pa-4">
    <div class="text-h4 mb-6 text-right">معاملات</div>
    <a-paged-table
        :url="'/trades/' + userId"
        :adapter="adapter"
        :headers="headers"
        :filter-query="filterQuery">
      <template v-slot:item.trade_type="{item}">
        <p :class="item.trade_type_color">{{ item.trade_type }}</p>
      </template>
    </a-paged-table>
  </div>
</template>

<script>

import APagedTable from "../../components/APagedTable";
import {safeDecimal, toSeparated} from "../../models/NumberUtil";
import {toFarsiCoin, toFarsiCoinPair, toFarsiDate} from "../../models/utils";
import {getMarketDp} from "../../models/cryptoPrecision";

export default {
  name: "myTrades",
  components: {APagedTable},
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
        {value: 'fee', text: 'کارمزد', align: 'center', sortable: false},
        {value: 'ledger_closed_at', text: 'تاریخ', align: 'center'},
      ],
      filterQuery: [
        {type: 'time', key: 'after', name: 'بعد از', value: ''},
        {type: 'time', key: 'before', name: 'قبل از', value: ''},
      ]
    }
  },
  methods: {
    adapter(item) {
      return {
        trade_type: item.op_type === 'buy' ? 'خرید' : 'فروش',
        trade_type_color: item.op_type === 'buy' ? 'success--text' : 'error--text',
        pair_asset: toFarsiCoinPair(item.counter_asset_code + '/' + item.base_asset_code),
        price: toSeparated(safeDecimal(item.price_d).div(item.price_n)),
        amount: toSeparated(parseFloat(item.counter_amount)),
        total: toSeparated(safeDecimal(item.base_amount)
            .todp(getMarketDp(item.base_asset_code, item.counter_asset_code))),
        ledger_closed_at: toFarsiDate(item.ledger_closed_at),
        fee: this.fee(item) + ' ' + toFarsiCoin(this.feeCoin(item)),
      }
    },
    fee(item) {
      // if ((item.op_type !== 'buy' && item.base_asset_code === 'IRR')
      //     || (item.op_type === 'buy' && item.counter_asset_code === 'IRR')) {
      //   return 0
      // }
      return item.op_type === 'buy'
          ? toSeparated(this.adjustDp(safeDecimal(item.counter_amount).times(0.003),
              item.base_asset_code, item.counter_asset_code))
          : toSeparated(this.adjustDp(safeDecimal(item.base_amount).times(0.003),
              item.counter_asset_code, item.base_asset_code))
    },
    adjustDp(val, base, ctr) {
      return safeDecimal(val).todp(getMarketDp(base, ctr))
    },
    feeCoin(item) {
      return item.op_type === 'buy'
          ? item.counter_asset_code
          : item.base_asset_code
    }
  },
}
</script>

<style scoped>

</style>