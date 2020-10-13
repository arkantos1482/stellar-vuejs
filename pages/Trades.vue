<template>
  <v-row justify="center">
    <v-col cols="6">
      <json-viewer :value="trades" dir="ltr"/>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Trades",
  data() {
    return {
      trades: []
    }
  },
  async mounted() {
    this.trades = (await this.$axios.$get('/trades'))._embedded.records
  }
}
</script>

<style scoped>

</style>