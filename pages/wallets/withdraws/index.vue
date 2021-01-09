<template>
  <v-card width="100%" class="text-center pa-4">
    <div class="text-h4 mb-4 text-right">{{ title }}</div>
    <v-simple-table>
      <thead class="grey lighten-3">
      <tr>
        <th class="text-center">رمزارز</th>
        <th class="text-center">مقدار</th>
        <th class="text-center">زمان</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in withdraws" :key="item.id">
        <td>{{ item.asset_code }}</td>
        <td>{{ parseFloat(item.amount) }}</td>
        <td>{{ item.created_at|toFarsiDate }}</td>
      </tr>
      </tbody>
    </v-simple-table>
  </v-card>
</template>

<script>
import collect from 'collect.js'

export default {
  name: "Withdraws",
  props: {title: {type: String, default: 'لیست برداشت ها'},type: String},
  data() {
    return {
      withdraws: [],
      type: this.$route.params.type,
    }
  },
  async mounted() {
    let list1 = (await this.$axios.$get('/effects'))._embedded.records;
    let list2 = collect(list1)
        .filter(item => item.type === 'account_debited')
    if (this.type) list2 = list2.filter(item => this.type.toUpperCase() === item.asset_code)
    this.withdraws = list2.all()
  }
}
</script>

<style scoped>

</style>