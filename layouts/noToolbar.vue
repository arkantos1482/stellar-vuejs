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
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "noToolbar"
}
</script>

<style scoped>

</style>