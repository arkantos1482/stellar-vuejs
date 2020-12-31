<template>
  <v-card width="100%" class="text-center pa-4">
    <div class="text-h4 mb-4 text-right">لیست برداشت ها</div>
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
        <td>{{ item.created_at }}</td>
      </tr>
      </tbody>
    </v-simple-table>
  </v-card>
</template>

<script>
import collect from 'collect.js'

export default {
  name: "Withdraws",
  data() {
    return {
      withdraws: []
    }
  },
  async mounted() {
    let list = (await this.$axios.$get('/effects'))._embedded.records;
    this.withdraws = collect(list).filter(item => item.type === 'account_debited').all();
  }
}
</script>

<style scoped>

</style>