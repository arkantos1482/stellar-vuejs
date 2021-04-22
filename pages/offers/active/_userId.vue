<template>
  <div class="pa-4">
    <div class="text-h4 mb-6 text-right">سفارشات در جریان</div>
    <v-card width="100%" class="pa-6">
      <a-table-header :list="['همه','IRT', 'BCH', 'BTC']"
                      list_name="نوع" from_name="تاریخ از" to_name="تاریخ تا"/>
      <my-active-offers-table/>
    </v-card>
  </div>
</template>

<script>

export default {
  name: 'ActiveOffers'
}
</script>

<style scoped>

</style>