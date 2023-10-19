<template>
  <!--  <div style="  background-color: #eaeaea; height: 100vh">-->
  <!--    <v-img style="display: block;-->
  <!--  margin-left: auto;-->
  <!--  margin-right: auto;-->
  <!--  width: 50%;" :src="require('../assets/images/underconstructionF.jpg')"/>-->
  <!--  </div>-->
  <div>
    <div v-if="isMobile"><unsupported-mobile /></div>
    <div v-else>
      <v-app>
        <v-main class="grey lighten-5">
          <v-container fluid class="pa-0">
            <nuxt />
          </v-container>
          <v-snackbar v-model="snackBar.normal.show">{{ snackBar.normal.msg }}</v-snackbar>
          <v-snackbar color="green" v-model="snackBar.success.show">{{ snackBar.success.msg }}</v-snackbar>
          <v-snackbar color="red" v-model="snackBar.fail.show">{{ snackBar.fail.msg }}</v-snackbar>
        </v-main>
      </v-app>
    </div>
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
  computed: {
    isMobile: function () {
      return this.$vuetify.breakpoint.width < 750
    }
  },
  data() {
    return {
      snackBar: {
        normal: { show: false, msg: '' },
        success: { show: false, msg: '' },
        fail: { show: false, msg: '' }
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
  },
}
</script>

<style scoped></style>