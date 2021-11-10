<template>
  <div>
    <v-alert :color="color" class="text-display-2 px-12" :colored-border="isColoredBorder" border="left" elevation="2">
      <p v-if="item.title" class="text-h5 mb-1">{{ item.title }}</p>
      {{ item.body }}
    </v-alert>
  </div>
</template>

<script>
export default {
  name: "BitraBanner",
  props: ['item'],
  computed: {
    color() {
      let color = this.$vuetify.theme.currentTheme.primary

      if (this.item.type.includes('green')) {
        color = this.$vuetify.theme.currentTheme.success
      } else if (this.item.type.includes('red')) {
        color = this.$vuetify.theme.currentTheme.error
      }

      return color
    },
    isColoredBorder() {
      let flag = true

      if (this.item.type.includes('green')) {
        flag = false
      } else if (this.item.type.includes('red')) {
        flag = false
      }

      return flag
    },

  }
}
</script>

<style scoped>

</style>