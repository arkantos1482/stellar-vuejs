<template>
  <div class="pa-4">
    <div class="text-h4 mb-6 text-right">تاریخچه سفارشات</div>
    <a-paged-table
        :url="'offers/' + userId"
        :adapter="adapter"
        :headers="headers"
        :filter-query="filterQuery">
      <template v-slot:item.offer_type="{item}">
        <p :class="item.offer_type_color">{{ item.offer_type }}</p>
      </template>
      <template v-slot:item.cancel_text="{item}">
        <p :class="item.cancel_color">{{ item.cancel_text }}</p>
      </template>
    </a-paged-table>
  </div>
</template>

<script>
import pstopper from "@/mixins/pstopper";
import {toSeparated} from "@/models/NumberUtil";
import {getDp} from "@/models/cryptoPrecision";
import APagedTable from "../../components/APagedTable";
import {safeDecimal} from "../../models/NumberUtil";
import {toFarsiDate} from "../../models/utils";

export default {
  components: {APagedTable},
  mixins: [pstopper],
  name: 'Offers',
  methods: {
    adapter(item) {
      let coin = item.type === 'buy' ? item.selling_asset_code : item.buying_asset_code
      return {
        offer_type: item.type === 'buy' ? 'خرید' : 'فروش',
        offer_type_color: item.type === 'buy' ? 'success--text' : 'error--text',
        pair_asset: item.type === 'buy'
            ? item.buying_asset_code + '/' + item.selling_asset_code
            : item.selling_asset_code + '/' + item.buying_asset_code,
        price: toSeparated(safeDecimal(item.price_r.n).div(item.price_r.d)),
        amount: toSeparated(parseFloat(item.amount)),
        total: toSeparated(safeDecimal(item.amount).times(item.price_r.n).div(item.price_r.d)
            .todp(getDp(coin))),
        created_at: toFarsiDate(item.created_at),
        cancel_text: parseFloat(item.amount) === 0 ? 'لغو شده' : 'موفقیت آمیز',
        cancel_color: parseFloat(item.amount) === 0 ? 'error--text' : 'success--text'
      }
    }
  },
  data() {
    return {
      userId: this.$route.params.userId,
      headers: [
        {value: 'offer_type', text: 'نوع', align: 'center', sortable: false},
        {value: 'pair_asset', text: 'رمزارزها', align: 'center', sortable: false},
        {value: 'price', text: 'قیمت', align: 'center', sortable: false},
        {value: 'amount', text: 'مقدار', align: 'center', sortable: false},
        {value: 'total', text: 'مجموع', align: 'center', sortable: false},
        {value: 'created_at', text: 'تاریخ', align: 'center', sortable: false},
        {value: 'cancel_text', text: 'وضعیت', align: 'center', sortable: false},
      ],
      filterQuery: [
        {type: 'time', key: 'after', name: 'بعد از', value: ''},
        {type: 'time', key: 'before', name: 'قبل از', value: ''},
      ]
    }
  }
}
</script>

<style scoped>

</style>