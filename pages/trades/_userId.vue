<template>
  <div class="pa-4">
    <div class="text-h4 mb-6 text-right">معاملات</div>
    <v-card width="100%" class="pa-6">
      <a-table-header :list="['همه','IRT', 'BCH', 'BTC']"
                      list_name="نوع" from_name="تاریخ معامله از" to_name="تاریخ معامله تا"/>
      <my-trades-table/>
    </v-card>
  </div>
</template>

<script>

export default {
  name: "myTrades",

}
</script>

<style scoped>

</style>