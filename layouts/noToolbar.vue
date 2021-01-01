<template>
  <v-app>
    <v-app-bar app>
      <v-img max-width="128" max-height="48"
             :src="require('../assets/images/logo.jpeg')"/>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt/>
      </v-container>
      <v-snackbar v-model="snackBar.normal.show">{{ snackBar.normal.msg }}</v-snackbar>
      <v-snackbar color="green" v-model="snackBar.success.show">{{ snackBar.success.msg }}</v-snackbar>
      <v-snackbar color="red" v-model="snackBar.fail.show">{{ snackBar.fail.msg }}</v-snackbar>
    </v-main>

    <v-footer class="text-h6 grey--text d-flex justify-center" style="z-index: 0" app>
      <p class="mb-1"> کلیه حقوق برای بیترا محفوظ است.</p>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "noToolbar",
  errorCaptured(err, vm, info) {
    //todo resolve by status code (err.response.status)
    this.snackBar.fail.show = true
    this.snackBar.fail.msg = err.response.data.error.msg
    return false
  },
  data() {
    return {
      snackBar: {
        normal: {show: false, msg: ''},
        success: {show: false, msg: ''},
        fail: {show: false, msg: ''}
      },
    }
  },
  async mounted() {
    this.$bus.$on('snack', (msg, level) => {
      this.showErrorSnack(msg, level)
    })
  },
  methods: {
    showErrorSnack(msg, level) {
      if (level === 'success') {
        this.snackBar.success.show = true
        this.snackBar.success.msg = msg
      } else if (level === 'error') {
        this.snackBar.fail.show = true
        this.snackBar.fail.msg = msg
      } else {
        this.snackBar.normal.show = true
        this.snackBar.normal.msg = msg
      }
    },
  }
}
</script>

<style scoped>

</style>