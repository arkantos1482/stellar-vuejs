<template>
  <div>
    <a-text-field
        @input="$emit('otp',$event)"
        :label="label"/>
    <div class="text-h6"> {{ counterToString }}</div>
    <div v-show="codeFailure" class="mt-8 text-h6">
      <span class="grey--text">کد تایید دریافت نشد؟</span>
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
      counter: 150,
      codeFailure: false,
      counterToString: ''
    }
  },
  mounted() {
    this.setTimer()
  },
  methods: {
    setTimer() {
      this.counter = 150
      this.codeFailure = false
      const interval = setInterval(() => {
        if (this.counter > 0) {
          this.counter--
          let remainder = this.counter % 60;
          let remainToString = (remainder < 10) ? ('0' + remainder) : remainder
          this.counterToString = Math.floor(this.counter / 60) + ':' + remainToString
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