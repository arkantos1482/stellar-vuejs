<template>
  <v-row justify="center">
    <v-col cols="6">
      <json-viewer dir="ltr" :value="offers"/>
    </v-col>
  </v-row>
</template>

<script>
import collect from "collect.js";

export default {
  name: "Offers",
  data() {
    return {offers: []}
  },
  async mounted() {
    let list = (await this.$axios.$get('/operations'))._embedded.records;
    this.offers = collect(list).filter(item => item.type === 'manage_buy_offer' || item.type === 'manage_sell_offer').all();
  }
}
</script>

<style scoped>

</style>