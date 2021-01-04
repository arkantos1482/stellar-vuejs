<template>
  <div>
    <!--    <a-text-field-->
    <!--        @input="$emit('otp',$event)"-->
    <!--        :label="label"/>-->

    <div class="text-center my-8">
      <PincodeInput
          dir="ltr"
          v-model="code"
          @input="$emit('otp',$event)"
          length=6
      />
    </div>
    <div class="text-h6 text-center mt-4"> {{ counterToString }}</div>
    <div v-show="codeFailure" class="mt-8 text-h6 text-center">
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
import PincodeInput from 'vue-pincode-input'

export default {
  name: 'otp',
  components: {ATextField, PincodeInput},
  props: ['label', 'loading'],
  data() {
    return {
      code: '',
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