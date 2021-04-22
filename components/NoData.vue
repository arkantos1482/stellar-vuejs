<template>
  <th :colspan="cols" style="padding: 128px">
    <v-icon x-large color="grey">mdi-text-box-remove-outline</v-icon>
    <p class="grey--text mt-2">{{ title }}</p>
  </th>
</template>

<script>
export default {
  name: "NoData",
  props: ['cols', 'title']
}
</script>

<style scoped>

</style>