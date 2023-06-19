<template>
  <div class="fullscreen d-flex justify-center align-center">
    <v-card width="85vw" height="85vh" light>
      <a-row class="align-stretch" style="height: 100%">
        <v-col cols="6" class="theback d-flex align-center justify-center">
          <v-img
            max-width="280px"
            max-height="280px"
            :src="require('../assets/images/Bitak-logos_transparent.png')"
          />
          <!--          <slot name="pic"></slot>-->
        </v-col>
        <v-col cols="6">
          <div class="text-center py-12 px-16">
            <div class="px-8">
              <div class="text-h4 primary--text">{{ title }}</div>
              <slot></slot>
            </div>
          </div>
        </v-col>
      </a-row>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "TwoSidedPanel",
  props: ["title"],
}
</script>

<style>
.fullscreen {
  width: 100vw;
  height: 100vh;
}
</style>
