<template>
  <json-viewer v-model="list" dir="ltr"/>
</template>

<script>
export default {
  name: "payment",
  data() {
    return {
      list: []
    }
  },
  async mounted() {
    this.list = await this.$axios.$get('/payments')
  }
}
</script>

<style scoped>

</style>