<template>
  <div style="  background-color: #eaeaea; height: 100vh">
    <v-img style="display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;" :src="require('../assets/images/underconstructionF.jpg')"/>
  </div>
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