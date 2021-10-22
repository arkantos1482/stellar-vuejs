<template>
  <div class="pa-4">
    <div class="text-h4 mb-6 text-right">معاملات</div>
    <my-trades-table :query="filterQuery"/>
  </div>
</template>

<script>
import MyTradesTable from "../../components/MyTradesTable";
import {coinList} from "../../models/coinList";

export default {
  name: "myTrades",
  components: {MyTradesTable},
  computed: {
    coinList: () => ['', ...coinList.filter(i => i !== 'USDT_TRON')],
    filterQuery() {
      return [
        {type: 'time', key: 'after', name: 'بعد از', value: ''},
        {type: 'time', key: 'before', name: 'قبل از', value: ''},
        {type: 'enum', key: 'op_type', name: 'نوع', value: '', options: ['', 'buy', 'sell']},
        {type: 'enum', key: 'counter_asset_code', name: 'رمزارز پایه', value: '', options: this.coinList},
        {type: 'enum', key: 'base_asset_code', name: 'رمزارز مقابل', value: '', options: this.coinList},
      ]
    }
  },
}
</script>

<style scoped>

</style>