<template>
  <div>
    <p class="text-center">{{ title }}</p>
    <json-viewer dir="ltr" :value="res" expand-depth="5" boxed/>
    <div class="text-center">
      <v-btn class="mt-2" outlined color="primary" @click="queryKyc" :loading="l.query">درخواست</v-btn>
    </div>
  </div>
</template>

<script>
import ps from '@/mixins/pstopper'

export default {
  name: "KycItem",
  props: ['title', 'linkSuffix', 'userId'],
  mixins: [ps],
  data() {
    return {
      res: '',
      l: {query: false}
    }
  },
  methods: {
    async queryKyc() {
      this.l.query = true
      this.res = await this.$axios.$get('/kyc/' + this.userId + this.linkSuffix)
      this.l.query = false
    }
  }

}
</script>

<style scoped>

</style>