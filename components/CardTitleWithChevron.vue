<template>
  <a-row>
    <v-icon color="primary">{{ icon }}</v-icon>
    <p class="primary--text mb-0 mx-2">{{ title }}</p>
    <v-spacer/>
    <v-icon v-show="!simple" color="primary">mdi-chevron-left</v-icon>
  </a-row>
</template>
<script>
export default {
  name: 'card-title-with-chevron',
  props: ['icon', 'title', 'simple']
}
</script>