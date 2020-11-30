<template>
  <v-row>
    <v-col cols="12">
      <v-simple-table>
        <thead>
        <tr>
          <th>نوع سفارش</th>
          <th>مقدار</th>
          <th>مبلغ واحد</th>
          <th>رمزارز خرید</th>
          <th>رمزارز فروش</th>
          <th>زمان</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in offers" :key="item.id">
          <td>{{ item.type | toFarsi }}</td>
          <td>{{ item.amount }}</td>
          <td>{{ item.price }}</td>
          <td>{{ item.selling_asset_code }}</td>
          <td>{{ item.buying_asset_code }}</td>
          <td>{{ item.created_at }}</td>
        </tr>
        </tbody>
      </v-simple-table>
    </v-col>
  </v-row>
</template>

<script>
import collect from "collect.js";

export default {
  name: "Offers",
  filters: {
    toFarsi(value) {
      let type = 'نامشخص'
      if (value === 'manage_sell_offer') type = 'فروش'
      if (value === 'manage_buy_offer') type = 'خرید'
      return type
    }
  },
  data() {
    return {offers: []}
  },
  async mounted() {
    let list = (await this.$axios.$get('/operations'))._embedded.records;
    this.offers = collect(list)
        .filter(item => parseFloat(item.amount) !== 0.0)
        .filter(item => item.type === 'manage_buy_offer' || item.type === 'manage_sell_offer').all();
  }
}
</script>

<style scoped>

</style>