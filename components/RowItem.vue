<template>
  <div class="d-flex">
    <p class="grey--text">{{ title }}</p>
    <v-spacer/>
    <p>{{ value }}</p>
  </div>
</template>
<script>
export default {
  name: 'RowItem',
  props: ['title', 'value']
}
</script>