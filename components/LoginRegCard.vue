<template>
  <v-row justify="center" class="text-center">
    <v-col cols="4">
      <v-card class="pt-12 pb-8 px-8" elevation="6">
        <div class="text-h3">{{ title }}</div>
        <div class="mt-4 mx-6 text-h6 grey--text text--darken-1">{{ subtitle }}</div>
        <slot></slot>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "LoginRegCard",
  props: ['title', 'subtitle']
}
</script>

<style scoped>

</style>