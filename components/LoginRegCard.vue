<template>
  <div class="text-center">
    <div class="text-h4">{{ title }}</div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "LoginRegCard",
  props: ['title']
}
</script>

<style scoped>

</style>