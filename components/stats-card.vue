<template>
  <div class="pa-4">
    <a-row class="justify-center align-center">
      <v-icon :color="iconColor">
        {{ icon }}
      </v-icon>
      <div class="text-center">
        <p class="mb-0 mr-2">{{ title }}</p>
      </div>
    </a-row>
    <v-divider class="mt-2 mx-8" />
    <p class="text-center mt-6">{{ body }}</p>
  </div>
</template>

<script>
import ARow from "./ARow.vue"

export default {
  name: "stats-card",
  components: { ARow },
  props: ["icon", "iconColor", "title", "body"],
}
</script>

<style scoped></style>
