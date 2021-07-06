<template>
  <div>
    <!--    <a-text-field-->
    <!--        @input="$emit('otp',$event)"-->
    <!--        :label="label"/>-->

    <v-form @submit.prevent="onSend">
      <div class="text-center my-8">
        <PincodeInput
            dir="ltr"
            v-model="code"
            @input="$emit('otp',$event)"
            length=6
        />
      </div>
      <p class="text-center mt-12 secondary--text text-body-2"> {{ counterToString }}</p>
      <div v-show="codeFailure" class="mt-8  text-center">
        <a @click="onResend">ارسال مجدد کد تایید</a>
      </div>
      <v-btn type="submit" :loading="loading"
             block color="primary" class="mt-16">تایید
      </v-btn>
    </v-form>
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