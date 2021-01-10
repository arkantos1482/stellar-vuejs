<template>
  <div>
    <div class="rounded grey lighten-4 d-flex align-center text-h6 mt-3" style="padding: 6px 12px">
      <span class="grey--text">{{ prepend }}</span>
      <input dir="ltr" :disabled="readonly" class="px-2" style="outline: none;width: 100%" :value="value"
             @input="$emit('input', $event.target.value)">
      <span class="grey--text">{{ append }}</span>
    </div>
    <p v-show="shouldValidate" class="red--text text-body-2 mt-2">{{ errorBucket[0] }}</p>
  </div>
</template>
<script>
import VTextField from 'vuetify/lib/components/VTextField/VTextField'

export default {
  name: 'order-text-field',
  extends: VTextField,
  props: ['prepend', 'value', 'append', 'readonly']
}
</script>
