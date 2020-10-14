<template>
  <v-row justify="center">
    <v-col cols="12">
<!--      <json-viewer :value="withdraws" dir="ltr"/>-->
      <v-simple-table>
        <thead>
        <tr>
          <th>رمزارز</th>
          <th>مقدار</th>
          <th>زمان</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in withdraws" :key="item.id">
          <td>{{ item.asset_code }}</td>
          <td>{{ item.amount }}</td>
          <td>{{ item.created_at }}</td>
        </tr>
        </tbody>
      </v-simple-table>
    </v-col>
  </v-row>
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