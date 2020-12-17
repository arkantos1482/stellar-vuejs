<template>
  <div>
    <v-row>
      <v-col cols="4">
        <h3>اطلاعات شخصی</h3>
        <v-switch label="ایمیل" v-model="rule.email"/>
        <v-switch label="موبایل" v-model="rule.cell_phone"/>
        <v-switch label="کارت ملی" v-model="rule.ssn"/>
      </v-col>

      <v-col cols="4">
        <h3>اطلاعات تکمیلی</h3>
        <v-switch label="تلفن ثابت" v-model="rule.phone"/>
        <v-switch label="آدرس" v-model="rule.address"/>
      </v-col>

      <v-col cols="4">
        <h3>اطلاعات مالی</h3>
        <v-switch label="شماره کارت" v-model="rule.bank_card"/>
        <v-switch label="شبا" v-model="rule.bank_shaba"/>
        <v-switch label="شماره حساب" v-model="rule.bank_account"/>
      </v-col>
    </v-row>

    <div class="text-center">
      <v-btn @click="updateOrCreate" :loading="l.update" color="primary">اعمال</v-btn>
      <v-btn @click="$router.back()">بازگشت</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      levelId: this.$route.params.id,
      rule: {
        email: false,
        cell_phone: false,
        phone: false,
        ssn: false,
        address: false,
        bank_card: false,
        bank_shaba: false,
        bank_account: false
      },
      l: {update: false}
    }
  },
  async mounted() {
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