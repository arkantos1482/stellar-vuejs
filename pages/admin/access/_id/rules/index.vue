<template>
  <v-row>
    <v-col>
      <v-switch label="موبایل" v-model="rule.cell_phone"/>
      <v-switch label="کارت ملی" v-model="rule.ssn"/>
      <v-switch label="آدرس" v-model="rule.address"/>
      <v-switch label="حساب بانکی" v-model="rule.bank_account"/>
      <v-btn @click="updateOrCreate" :loading="l.update" color="primary">اعمال</v-btn>
      <v-btn @click="$router.back()">بازگشت</v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      levelId: this.$route.params.id,
      rule: {cell_phone: false, ssn: false, address: false, bank_account: false},
      l: {update: false}
    }
  },
  async fetch() {
    let rule = await this.$axios.$get('/access/' + this.levelId + '/rule')
    if (rule) this.rule = rule
  },
  methods: {
    async updateOrCreate() {
      this.l.update = true
      try {
        await this.$axios.$put('/access/' + this.levelId + '/rule', this.rule)
      } catch (e) {

      }
      this.l.update = false
    }
  }
}
</script>

<style scoped>

</style>