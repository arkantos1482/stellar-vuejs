<template>
  <a-row class="mb-2 justify-space-between">
    <v-col cols="6" class="py-0 pl-8">
      <slot name="right"/>
    </v-col>
    <v-col cols="6" class="py-0 pr-8">
      <slot name="left"/>
    </v-col>
  </a-row>
</template>

<script>
export default {
  name: "TwoColumnRow"
}
</script>

<style scoped>

</style>