<template>
  <v-app>
    <v-app-bar app>
      <v-img max-width="128" max-height="48"
             :src="require('../assets/images/Bitra_Logo.png')"/>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt/>
      </v-container>
      <v-snackbar v-model="snackBar.show">{{ snackBar.msg }}</v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "noToolbar",
  errorCaptured(err, vm, info) {
    //todo resolve by status code (err.response.status)
    this.snackBar.show = true
    this.snackBar.msg = err.response.data.error.msg
    return false
  },
  data() {
    return {
      snackBar: {show: false, msg: ''},
    }
  }
}
</script>

<style scoped>

</style>