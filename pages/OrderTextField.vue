<template>
  <div class="rounded grey lighten-4 d-flex align-center text-h6 mt-3" style="padding: 6px 12px">
    <span class="grey--text">{{ prepend }}</span>
    <input dir="ltr" :disabled="readonly" class="px-2" style="outline: none;width: 100%" :value="value"
           @input="$emit('input', $event.target.value)">
    <span class="grey--text">{{ append }}</span>
  </div>
</template>
<script>
export default {
  name: 'order-text-field',
  props: ['prepend', 'value', 'append', 'readonly']
}
</script>
