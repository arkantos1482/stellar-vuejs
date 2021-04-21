<template>
  <v-sheet class="text-center">
    <div class="text-h3">{{ title }}</div>
    <div class="mt-4 mx-6 text-h6 grey--text text--darken-1">{{ subtitle }}</div>
    <slot></slot>
  </v-sheet>
</template>

<script>
export default {
  name: "LoginRegCard",
  props: ['title', 'subtitle']
}
</script>

<style scoped>

</style>