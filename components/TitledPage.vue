<template>
  <div style="background: #00061a" class="py-4 px-8">
    <p class="text-h4 text-right primary--text">{{ title }}</p>
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "TitledPage",
  props: ["title"],
}
</script>

<style scoped></style>
