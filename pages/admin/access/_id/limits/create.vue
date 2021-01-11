<template>
  <v-row justify="center">
    <v-col cols="4">
      <v-select filled label="منبع" v-model="limit.resource" :items="choices.resource"/>
      <v-select filled label="عمل" v-model="limit.action" :items="choices.action"/>
      <v-select filled label="مدت زمان اعمال" v-model="limit.period" :items="choices.period"/>
      <a-text-field filled label="سقف" v-model="limit.max"/>
      <v-btn @click="create" :loading="l.create" color="primary">اعمال</v-btn>
      <v-btn @click="$router.back()">بازگشت</v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      levelId: this.$route.params.id,
      choices: {
        resource: ['CRYPTO', 'IRR'],
        action: ['withdraw', 'deposit'],
        period: ['daily', 'monthly'],
      },
      limit: {
        resource: 'IRR',
        action: 'withdraw',
        period: 'daily',
        max: ''
      },
      l: {create: false}
    }
  },
  methods: {
    async create() {
      this.l.create = true
      this.limit = await this.$axios.$post('/access/' + this.levelId + '/limits', this.limit)
      this.l.create = false
      this.$router.back()
    }
  }
}
</script>

<style scoped>

</style>