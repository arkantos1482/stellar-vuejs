<template>
  <div>
    <a-text-field
        @input="$emit('otp',$event)"
        :label="label"/>
    <div> 00:{{ counter }}</div>
    <div v-show="codeFailure" class="mt-8 grey--text">
      <span>کد تایید دریافت نشد؟</span>
      <a @click="onResend">ارسال مجدد</a>
    </div>
    <v-btn @click="onSend" :loading="loading"
           block color="primary" class="mt-8">تایید
    </v-btn>
  </div>
</template>

<script>

import ATextField from "@/components/ATextField";

export default {
  name: 'otp',
  components: {ATextField},
  props: ['label', 'loading'],
  data() {
    return {
      counter: 59,
      codeFailure: false
    }
  },
  mounted() {
    this.setTimer()
  },
  methods: {
    setTimer() {
      this.counter = 59
      this.codeFailure = false
      const interval = setInterval(() => {
        if (this.counter > 0) {
          this.counter--
        } else {
          this.codeFailure = true
          clearInterval(interval)
        }
      }, 1000);
    },
    onSend() {
      this.$emit('send')
    },
    onResend() {
      this.setTimer()
    }
  }
}
</script>

<style scoped>

</style>