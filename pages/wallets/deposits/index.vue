<template>
  <div class="pa-4">
    <div class="text-h4 mb-6 text-right">{{ title }}</div>
    <v-card width="100%" height="100%" class="pa-6">
      <a-table-header :list="['همه','IRT', 'BCH', 'BTC']"
                      list_name="نوع" from_name="تاریخ واریز از" to_name="تاریخ واریز تا"/>
      <v-simple-table class="text-center">
        <thead>
        <tr>
          <th class="text-center">رمزارز</th>
          <th class="text-center">مقدار</th>
          <th class="text-center">زمان</th>
          <th class="text-center">وضعیت</th>
          <th class="text-center">توضیحات</th>
        </tr>
        </thead>
        <tbody v-if="deposits.length">
        <tr v-for="item in deposits" :key="item.id">
          <td>{{ item.coin|toFarsiCoin }}</td>
          <td>{{ item.amount|toFloat|separated }}</td>
          <td>{{ item.updated_at|toFarsiDate }}</td>
          <td :class="item.status|toFarsiColor">{{ item.status|toFarsiTitle }}</td>
          <td>
            <p v-if="item.coin === 'IRR'">{{ 'کد رهگیری= ' + item.track_code }}</p>
            <a v-else v-show="item.track_code" :href="item.track_code" target="_blank">لینک پیگیری</a>
          </td>
        </tr>
        </tbody>
        <no-data v-else cols="5" title="واریزی انجام نشده است."/>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script>
import collect from "collect.js";

export default {
  name: "Deposits",
  props: {
    title: {type: String, default: 'لیست واریزها'},
    userId: {type: String, default: 'me'},
    type: String
  },
  filters: {
    toFarsiTitle(val) {
      return (val === 'success') ? 'موفقیت آمیز' : 'ناموفق'
    },
    toFarsiColor(val) {
      return (val === 'success') ? 'success--text' : 'error--text'
    }
  },
  data() {
    return {
      deposits: [],
    }
  },
  async mounted() {
    let list1 = (await this.$axios.$get('/payments/deposits/' + this.userId))
    let list2 = collect(list1)
    if (this.type) list2 = list2.filter(item => this.type.toUpperCase() === item.coin)
    this.deposits = list2.all()
  }
}
</script>

<style scoped>

</style>