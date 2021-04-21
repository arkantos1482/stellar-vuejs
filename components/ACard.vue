<template>
  <v-card :width="width" class="py-4 px-8" elevation="2">
    <div class="text-h4 mb-2">{{ title }}</div>
    <div class="mt-4  grey--text text--darken-1">{{ subtitle }}</div>
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
    subtitle: String,
    divider: {type: Boolean, default: false}
  }
}
</script>

<style scoped>

</style>