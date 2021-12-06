<template>
  <div class="text-center mt-16">
    <v-btn :href="link">دریافت تمام معاملات</v-btn>
  </div>
</template>

<script>
export default {
  name: "trades",
  computed: {
    link() {
      return this.$axios.defaults.baseURL + '/trades/all/export';
    }
  }

}
</script>

<style scoped>

</style>