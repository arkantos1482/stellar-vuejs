<template>
  <a-row>
    <v-col cols="6" class="my-4">
      <a-row>
        <v-icon color="primary">mdi-map-marker</v-icon>
        <p class="mb-0">تهران خیابان شریعتی خیابان گل نبی پلاک ۴۹ شرکت بیترا</p>
      </a-row>
      <a-row>
        <v-icon color="primary">mdi-phone</v-icon>
        <p class="mb-0">021-91092027 021-91010110</p>
      </a-row>
      <a-row>
        <v-icon color="primary">mdi-email</v-icon>
        <p class="mb-0">Office@bitra.market</p>
      </a-row>
    </v-col>
    <v-col cols="6">
      <p>ما را در شبکه های اجتماعی دنبال کنید:</p>
      <a-row>
        <v-icon v-for="item in socialList" color="primary">{{ item.icon }}</v-icon>
      </a-row>
    </v-col>
  </a-row>
</template>

<script>
export default {
  name: "BitraBottomBar",
  data() {
    return {
      socialList: [
        {icon: 'mdi-youtube', link: ''},
        {icon: 'mdi-linkedin', link: ''},
        {icon: 'mdi-instagram', link: ''},
        {icon: 'mdi-twitter', link: ''},
        {icon: 'mdi-whatsapp', link: ''},
      ]
    }
  },
}
</script>

<style scoped>

</style>