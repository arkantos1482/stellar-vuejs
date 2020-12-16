<template>
  <v-row justify="center">
    <v-card width="100%" class="py-4 px-8" elevation="6">
      <div class="text-h6">{{ title }}</div>
      <slot></slot>
    </v-card>
  </v-row>
</template>

<script>
export default {
  name: "LoginRegCard",
  props: ['title']
}
</script>

<style scoped>

</style>