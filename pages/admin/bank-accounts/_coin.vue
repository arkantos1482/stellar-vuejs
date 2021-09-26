<template>
  <div>
    <json-viewer dir="ltr" :value="list"/>
  </div>
</template>

<script>
export default {
  name: "_id",
  data() {
    return {
      list: []
    }
  },
  computed: {
    coin() {
      return this.$route.params.coin
    }
  },
  async mounted() {
    this.list = await this.$axios.$get('/bank-accounts/hd-transactions?coin=' + this.coin?.toLowerCase())
  }
}
</script>

<style scoped>

</style>