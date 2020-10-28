<template>
  <h1>hello {{ userId }}</h1>
</template>

<script>
export default {
  data() {
    return {
      userId: this.$route.params.id,
    }
  }
}
</script>

<style scoped>

</style>