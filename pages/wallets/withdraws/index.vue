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
        <th class="text-center">آدرس برداشت کننده</th>
        <th class="text-center">توضیحات</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in withdraws" :key="item.id">
        <td>{{ item.coin|toFarsiCoin }}</td>
        <td>{{ item.amount|toFloat|separated }}</td>
        <td>{{ item.updated_at|toFarsiDate }}</td>
        <td :class="item.status|toFarsiColor">{{ item.status|toFarsiTitle }}</td>
        <td>{{ item.destination }}</td>
        <td>
          <div v-show="item.track_code">
            <p v-if="item.coin === 'IRR'">{{ item.track_code }}کد رهگیری= </p>
            <a v-else :href="item.track_code" target="_blank">لینک پیگیری</a>
          </div>
        </td>
      </tr>
      </tbody>
    </v-simple-table>
  </v-card>
</template>

<script>
import collect from 'collect.js'

export default {
  name: "Withdraws",
  props: {title: {type: String, default: 'لیست برداشت ها'}, type: String},
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
      withdraws: [],
      type: this.$route.params.type,
    }
  },
  async mounted() {
    let list1 = (await this.$axios.$get('/payments/withdraws'))
    let list2 = collect(list1)
    if (this.type) list2 = list2.filter(item => this.type.toUpperCase() === item.coin)
    this.withdraws = list2.all()
  }
}
</script>

<style scoped>

</style>