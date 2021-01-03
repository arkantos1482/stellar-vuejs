<template>
  <v-card width="100%" class="text-center">
    <v-simple-table>
      <thead class="grey lighten-3">
      <tr>
        <th class="text-center">نوع سفارش</th>
        <th class="text-center">مقدار</th>
        <th class="text-center">مبلغ واحد</th>
        <th class="text-center">رمزارز فروش</th>
        <th class="text-center">رمزارز خرید</th>
        <th class="text-center">زمان</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in offers" :key="item.id">
        <td>{{ item.type | toFarsi }}</td>
        <td>{{ parseFloat(item.amount) }}</td>
        <td>{{ parseFloat(item.price_r.d) }}</td>
        <td>{{ item.selling_asset_code }}</td>
        <td>{{ item.buying_asset_code }}</td>
        <td>{{ item.created_at|toFarsiDate }}</td>
      </tr>
      </tbody>
    </v-simple-table>
  </v-card>
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