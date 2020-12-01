<template>
  hello return
  {{ amount }}
</template>

<script>
export default {
  data() {
    return {
      amount: this.$route.query.amount
    }
  }
}
</script>

<style scoped>

</style>