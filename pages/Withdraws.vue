<template>
  <v-row justify="center">
    <v-col cols="6">
      <json-viewer :value="withdraws" dir="ltr"/>
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