<template>
  <div class="fullscreen d-flex justify-center align-center">
    <v-card width="85vw" height="85vh" light>
      <a-row>
        <v-col cols="6" class="theback">
          <v-img width="100%" height="100%" :src="require('../assets/images/logo.png')"/>
        </v-col>
        <v-col cols="6">
          <slot></slot>
        </v-col>
      </a-row>
    </v-card>
  </div>

</template>

<script>
export default {
  name: "TwoSidedPanel",
}
</script>

<style>
.fullscreen {
  width: 100vw;
  height: 100vh;
}
</style>