<template>
  <v-btn :loading="loadingState" @click="onPromise"></v-btn>
</template>

<script>
import ps from '@/mixins/progress.stopper'

export default {
  mixins: [ps],
  name: "PromiseBtn",
  props: {
    promise: Promise,
    func: Function
  },
  data() {
    return {
      loadingState: false
    }
  },
  methods: {
    onPromise() {
      this.loadingState = true
      this.promise
          .then(res => this.func(res))
          .finally(() => this.loadingState = false)
    }
  }
}
</script>

<style scoped>

</style>