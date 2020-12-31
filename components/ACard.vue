<template>
  <v-card :width="width" class="py-4 px-8" elevation="4">
    <div class="text-h4 mb-2">{{ title }}</div>
    <v-divider v-show="divider" class="mb-2"/>
    <slot></slot>
  </v-card>
</template>

<script>
export default {
  name: "LoginRegCard",
  props: {
    width: String,
    title: String,
    divider: {type: Boolean, default: false}
  }
}
</script>

<style scoped>

</style>