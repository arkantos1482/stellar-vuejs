<template>
  <v-row justify="center">
    <v-col cols="6">
      <v-row>
        <v-file-input label="کارت ملی" show-size @change="ssn=$event"/>
        <v-btn :loading="l.ssn" @click="uploadSsn">ارسال</v-btn>
      </v-row>

      <v-row>
        <v-file-input label="قبض تلفن" show-size @change="bill=$event"/>
        <v-btn :loading="l.bill" @click="uploadBill">ارسال</v-btn>
      </v-row>

    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      ssn: '',
      bill: '',
      config: {headers: {"Content-Type": "multipart/form-data"}},
      l: {ssn: false, bill: false},
    }
  },
  methods: {
    async uploadSsn() {
      this.l.ssn = true
      const formData = new FormData();
      formData.append('ssn', this.ssn)
      await this.$axios.$post('/profiles/me/docs', formData, this.config)
      this.l.ssn = false
    },
    async uploadBill() {
      this.l.bill = true
      const formData = new FormData();
      formData.append('bill', this.bill)
      await this.$axios.$post('/profiles/me/docs', formData, this.config)
      this.l.bill = false
    }
  }
}
</script>

<style scoped>

</style>