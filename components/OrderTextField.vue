<template>
  <div>
    <div class="rounded grey lighten-4 d-flex align-center text-h6" style="padding: 6px 12px">
      <span class="grey--text">{{ prepend }}</span>
      <input dir="ltr" :disabled="readonly" class="px-2" style="outline: none;width: 100%"
             :value="myText"
             @input="emit">
      <span class="grey--text">{{ append }}</span>
    </div>
    <p class="red--text text-body-2 mt-1">
      &nbsp;&nbsp;<span v-show="shouldValidate">{{ errorBucket[0] }}</span></p>
  </div>
</template>
<script>
import VTextField from 'vuetify/lib/components/VTextField/VTextField'
import {safeDecimal} from "@/models/NumberUtil";

export default {
  name: 'order-text-field',
  extends: VTextField,
  props: ['prepend', 'append', 'readonly', 'type'],
  data() {
    return {
      temp: '',
    }
  },
  watch: {
    value(newValue, oldValue) {
      console.log('value watcher :' + newValue)
      this.myText = newValue
    }
  },
  computed: {
    myText: {
      set(v) {
        console.log('setter :' + v)
        this.temp = Math.random()
        if (this.type === 'IRR') {
          this.temp = safeDecimal(v).todp(0)
        } else if (this.type === 'USDT') {
          this.temp = safeDecimal(v).todp(2)
        } else {
          this.temp = safeDecimal(v).todp(6)
        }
      },
      get() {
        console.log('getter :' + this.temp)
        return this.temp
      }
    }
  },
  methods: {
    emit(event) {
      console.log('event :' + event.target.value)
      this.$emit('input', event.target.value)
    }
  },
}
</script>
