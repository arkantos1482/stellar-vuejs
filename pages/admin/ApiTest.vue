<template>
  <v-row justify="center" class="text-center">
    <v-col cols="6">
      <p class="mt-8">{{ res }}</p>
      <v-btn @click="call">ltc basic</v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "ApiTest",
  data() {
    return {
      res: 'empty',
    }
  }, methods: {
    async call() {
      this.res = await this.$axios.$get('/action');
    }
  }
}
</script>

<style scoped>

</style>