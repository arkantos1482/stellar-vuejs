<template>
  <a-row class="my-6" style="padding-left: 256px;padding-right: 256px">
    <v-col cols="6">
      <a-row class="mb-4">
        <v-icon color="primary" class="mx-2">mdi-map-marker</v-icon>
        <p class="mb-0">تهران خیابان شریعتی خیابان گل نبی پلاک ۴۹ شرکت بیترا</p>
      </a-row>
      <a-row class="mb-4">
        <v-icon color="primary" class="mx-2">mdi-phone</v-icon>
        <p class="mb-0">021-91092027</p>
      </a-row>
      <a-row class="mb-4">
        <v-icon color="primary" class="mx-2">mdi-email</v-icon>
        <p class="mb-0">Office@bitra.market</p>
      </a-row>
    </v-col>

    <v-col cols="6">
      <p>ما را در شبکه های اجتماعی دنبال کنید:</p>
      <a-row>
        <div v-for="(item,idx) in socialList">
          <v-icon color="primary">{{ item.icon }}</v-icon>
          <v-divider v-if="idx !== socialList.length-1" vertical class="mx-2"/>
        </div>
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