<template>
  <div>
    <a-paged-table
        ref="table"
        url="/bots"
        :headers="headers"
        :hide-filter="true"
        :hidePaginate="true"
        :filter-query="[]"
        default-sort-by="created_at"
        :default-sort-desc="true">
      <template v-slot:item.created_at="{value}">{{ value|toFarsiDate }}</template>
      <template v-slot:item.actions="{item}">
        <v-btn outlined small color="primary" @click="editDialog(item)">ویرایش</v-btn>
        <v-btn outlined small color="error" @click="remove(item.id)">حذف</v-btn>
      </template>
    </a-paged-table>

    <div class="text-center mt-4">
      <v-btn color="primary" @click="createDialog" outlined>اضافه کردن بات</v-btn>
    </div>

    <v-dialog width="400" v-model="d.bot">
      <v-card class="pa-6 text-center">
        <v-select outlined label="base_asset" :items="coinList" v-model="bot.base_asset"/>
        <v-select outlined label="counter_asset" :items="coinList" v-model="bot.counter_asset"/>
        <a-text-field label="email" v-model="bot.email"/>
        <a-text-field label="frequency" v-model="bot.frequency"/>
        <a-text-field label="sell_step" v-model="bot.sell_step"/>
        <a-text-field label="buy_step" v-model="bot.buy_step"/>
        <a-text-field label="sell_fee" v-model="bot.sell_fee"/>
        <a-text-field label="buy_fee" v-model="bot.buy_fee"/>
        <a-text-field label="sell_deviation" v-model="bot.sell_deviation"/>
        <a-text-field label="buy_deviation" v-model="bot.buy_deviation"/>
        <a-text-field label="min_amount" v-model="bot.min_amount"/>
        <a-text-field label="max_amount" v-model="bot.max_amount"/>
        <a-text-field label="amount_precision" v-model="bot.amount_precision"/>
        <!--        <a-text-field label="usdt_rate" v-model="bot.usdt_rate"/>-->
        <!--        <a-text-field label="feed" v-model="bot.feed"/>-->
        <v-btn @click="create_edit" :loading="l.send" class="mt-4" color="primary" outlined>ارسال</v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import APagedTable from "../../components/APagedTable";
import ATextField from "../../components/ATextField";
import {coinList} from "../../models/coinList";
import ps from '@/mixins/pstopper'
import ARow from "../../components/ARow";
import {emptyArray} from "../../models/utils";


export default {
  name: "Bots",
  components: {ARow, ATextField, APagedTable},
  mixins: [ps],
  data() {
    return {
      bot: {
        id: null,
        email: '',
        base_asset: '',
        counter_asset: '',
        frequency: '',
        sell_step: '',
        buy_step: '',
        sell_fee: '',
        buy_fee: '',
        sell_deviation: '',
        buy_deviation: '',
        min_amount: '',
        max_amount: '',
        usdt_rate: '',
        feed: '',
        amount_precision: '',
      },
      d: {bot: false},
      l: {send: false},
    }
  },
  computed: {
    coinList: () => coinList,
    headers: () => [
      {value: 'email', text: 'email', align: 'center'},
      {value: 'base_asset', text: 'base_asset', align: 'center'},
      {value: 'counter_asset', text: 'counter_asset', align: 'center'},
      {value: 'frequency', text: 'frequency', align: 'center'},
      {value: 'sell_step', text: 'sell_step', align: 'center'},
      {value: 'buy_step', text: 'buy_step', align: 'center'},
      {value: 'sell_fee', text: 'sell_fee', align: 'center'},
      {value: 'buy_fee', text: 'buy_fee', align: 'center'},
      {value: 'sell_deviation', text: 'sell_deviation', align: 'center'},
      {value: 'buy_deviation', text: 'buy_deviation', align: 'center'},
      {value: 'min_amount', text: 'min_amount', align: 'center'},
      {value: 'max_amount', text: 'max_amount', align: 'center'},
      // {value: 'usdt_rate', text: 'usdt_rate', align: 'center'},
      // {value: 'feed', text: 'feed', align: 'center'},
      {value: 'amount_precision', text: 'amount_precision', align: 'center'},
      {value: 'actions', text: 'actions', align: 'center', width: '180'},
    ]
  },
  methods: {
    async create_edit() {
      this.l.send = true

      if (this.bot.id) {
        await this.$axios.post('/bots/' + this.bot.id, this.bot)
      } else {
        await this.$axios.post('/bots', this.bot)
      }

      await this.$refs.table.refresh()
      this.d.bot = false
      this.l.send = false
    },
    editDialog(item) {
      this.bot = item
      this.d.bot = true
    },
    createDialog() {
      this.bot = emptyArray(this.bot)
      this.bot.feed = 'nobitex'
      this.bot.usdt_rate = '0.0'
      this.d.bot = true
    },
    async remove(id) {
      await this.$axios.post('/bots/' + id + '/delete')
      await this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped>

</style>