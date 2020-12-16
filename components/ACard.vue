<template>
  <v-card class="py-4 px-8" elevation="6">
    <div class="text-h6 mb-2">{{ title }}</div>
    <v-divider v-show="divider" class="mb-2"/>
    <slot></slot>
  </v-card>
</template>

<script>
export default {
  name: "LoginRegCard",
  props: {
    title: String,
    divider: {type: Boolean, default: false}
  }
}
</script>

<style scoped>

</style>