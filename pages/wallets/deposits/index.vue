<template>
  <v-card width="100%" class="text-center pa-4">
    <div class="text-h4 mb-4 text-right">{{ title }}</div>
    <v-simple-table>
      <thead class="grey lighten-3">
      <tr>
        <th class="text-center">رمزارز</th>
        <th class="text-center">مقدار</th>
        <th class="text-center">زمان</th>
        <th class="text-center">وضعیت</th>
        <th class="text-center">توضیحات</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in deposits" :key="item.id">
        <td>{{ item.coin }}</td>
        <td>{{ item.amount|toFloat|separated }}</td>
        <td>{{ item.updated_at|toFarsiDate }}</td>
        <td :class="item.status|toFarsiColor">{{ item.status|toFarsiTitle }}</td>
        <td>
          <a v-show="item.track_code" :href="item.track_code ">لینک پیگیری</a>
        </td>
      </tr>
      </tbody>
    </v-simple-table>
  </v-card>
</template>

<script>
import collect from "collect.js";

export default {
  name: "Deposits",
  props: {title: {type: String, default: 'لیست واریزها'}, type: String},
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
    let list1 = (await this.$axios.$get('/reports/deposits'))
    let list2 = collect(list1)
    if (this.type) list2 = list2.filter(item => this.type.toUpperCase() === item.asset_code)
    this.deposits = list2.all()
  }
}
</script>

<style scoped>

</style>