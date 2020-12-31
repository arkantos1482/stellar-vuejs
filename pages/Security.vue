<template>
  <div>
    <p class="text-h4 primary--text">با فعال سازی شناسایی دوعاملی، امنیت تراکنش ها و دارایی های خود را افزایش دهید.</p>
    <a-card divider title="شناسایی دو عاملی">
      <p class="text-h5">شناسایی دوعاملی برای حساب کاربری شما
        <span :class="statusClass">{{ statusText }}</span>
        است.</p>
      <div class="text-center mt-12">
        <v-btn @click="onToggle" :loading="l.toggle"
               :color="btnColor" depressed :class="btnClass">
          {{ btnText }}
        </v-btn>
      </div>
    </a-card>
  </div>

</template>

<script>
import ACard from "@/components/ACard";
import pstopper from "@/mixins/pstopper";

export default {
  components: {ACard},
  mixins: [pstopper],
  computed: {
    mfaIsEnabled() {
      return this.mfa_method === 'sms'
    },
    getInverted() {
      return this.mfaIsEnabled ? 'none' : 'sms'
    },
    btnText() {
      return this.mfaIsEnabled ? 'لغو شناسایی دو عاملی' : 'فعال سازی شناسایی دو عاملی'
    },
    btnColor() {
      return this.mfaIsEnabled ? 'F849601E' : '#02c0761E'
    },
    statusText() {
      return this.mfaIsEnabled ? 'فعال' : 'غیرفعال'
    },
    statusClass() {
      return this.mfaIsEnabled ? 'success--text' : 'error--text'
    },
    btnClass() {
      return this.mfaIsEnabled ? 'error--text' : 'success--text'
    }
  },
  data() {
    return {
      mfa_method: '',
      l: {toggle: false}
    }
  },
  async mounted() {
    this.mfa_method = (await this.$axios.$get('/profiles/me')).mfa_method
  },
  methods: {
    async onToggle() {
      this.l.toggle = true
      this.mfa_method = await this.$axios.$post('/profiles/me/mfa', {
        mfa_method: this.getInverted
      })
      this.l.toggle = false
    }
  }
}
</script>

<style scoped>

</style>