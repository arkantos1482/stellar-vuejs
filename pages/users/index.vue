<template>
  <json-viewer dir=ltr :value="profileList"/>
</template>

<script>
export default {
  data() {
    return {
      profileList: []
    }
  },
  async fetch() {
    this.profileList = await this.$axios.$get('/profiles');
  }
}
</script>

<style scoped>

</style>