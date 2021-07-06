<template>
  <div>
    <v-data-table :headers="headers" :items="items" :items-per-page="200" hide-default-footer/>
    <div class="text-center mt-8">
      <v-btn @click="d.send=true">ارسال پیام گروهی</v-btn>
    </div>

    <v-dialog width="400" v-model="d.send">
      <v-card class="pa-6 text-center">
        <a-text-field label="تیتر" v-model="message.title"/>
        <v-textarea outlined label="توضیح" v-model="message.desc" class="mt-4"/>
        <v-select outlined label="نوع" :items="categories" v-model="message.category"/>
        <v-btn :loading="l.send" @click="sendBroadcastMessage">ارسال</v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  computed: {
    categories: () => ['news', 'activities']
  },
  data() {
    return {
      headers: [
        {value: 'title', text: 'تیتر'},
        {value: 'desc', text: 'متن'},
        {value: 'category', text: 'نوع'},
        {value: 'created_at', text: 'زمان'},
      ],
      items: [],
      message: {title: '', desc: '', category: 'news'},
      d: {send: false},
      l: {send: false}
    }
  },
  async mounted() {
    await this.getData()
  },
  methods: {
    async sendBroadcastMessage() {
      this.l.send = true
      await this.$axios.$post('/messages/broadcast', this.message)
      this.l.send = false
      this.d.send = false
      await this.getData()
    },
    async getData() {
      this.items = await this.$axios.$get('/messages/broadcast');
    }
  }
}
</script>

<style scoped>

</style>