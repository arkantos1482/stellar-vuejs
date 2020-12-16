<template>
  <div>
    <div class="d-flex align-items-stretch">
      <a-card class="ml-4" width="40%" divider title="ایجاد کد دعوت">
        <p class="text-body-2 grey--text text--darken-1">
          نرخ کارمزد ۲۰درصد به شما تعلق گرفته است، سهم دوستان خود را مشخص کنید.
        </p>
        <v-row>
          <v-col class="text-center">
            <p>درصد شما</p>
            <p>{{ myPercent + "درصد" }}</p>
          </v-col>
          <v-divider vertical/>
          <v-col class="text-center">
            <p>درصد دوستان</p>
            <p>{{ guestPercent + "درصد" }}</p>
          </v-col>
        </v-row>
        <v-slider v-model="myPercent"
                  min="0" max="20" step="5" track-color="accent"
                  ticks thumb-label/>
        <div class="text-center">
          <v-btn @click="submitMyPercent" :loading="l.percent"
                 color="primary">اعمال
          </v-btn>
        </div>
      </a-card>

      <a-card width="60%" divider title="کد دعوت شما">
        <p class="text-body-2 grey--text text--darken-1">
          برای پیوستن دوستان خود به بیترا، کد زیر را با آنها به اشتراک بگذارید.
        </p>
        <div class="d-flex justify-space-between">
          <p>لینک دعوت</p>
          <p>{{ myLink }}</p>
        </div>
        <div class="d-flex justify-space-between">
          <p>کد دعوت</p>
          <p>{{ myCode }}</p>
        </div>
      </a-card>
    </div>

    <a-card class="mt-4" divider title="کد دعوت کننده شما">
      <p class="text-body-2 grey--text text--darken-1">
        چنانچه از طریق یکی از کاربران بیترا با ما آشنا شده اید. با وارد کد این کار به عتوان معرف خود، درصدی از کارمزد
        معاملات شما بدون هزینه اضافه برای شما، به معرف شما تخصیص داده میشود.
      </p>
      <div class="d-flex justify-center mt-12">
        <a-text-field class="flex-grow-0 mx-2" filled label="کد معرف" v-model="myHostCode"/>
        <v-btn @click="submitTheHostCode" :loading="l.hostCode"
               color="primary">تایید
        </v-btn>
      </div>
    </a-card>
  </div>
</template>

<script>
import ACard from "@/components/ACard";
import ATextField from "@/components/ATextField";
import pstopper from "@/mixins/pstopper";

export default {
  components: {ATextField, ACard},
  mixins: [pstopper],
  computed: {
    guestPercent() {
      return 20 - this.myPercent
    }
  },
  data() {
    return {
      myCode: '',
      myLink: '',
      myPercent: 15,
      myHostCode: '',
      l: {percent: false, hostCode: false}
    }
  },
  async mounted() {
    let referral = await this.$axios.$get('/referrals/me')
    this.myCode = referral.code
    this.myLink = referral.link
    this.myPercent = referral.host_percent

    this.myHostCode = await this.$axios.$get('/referrals/me/my-host')
  },
  methods: {
    async submitMyPercent() {
      this.l.percent = true
      this.myPercent = await this.$axios.$post('/referrals/me', {host_percent: this.myPercent})
      this.l.percent = false
    },
    async submitTheHostCode() {
      this.l.hostCode = true
      await this.$axios.$post('/referrals/me/my-host', {referral_code: this.myHostCode})
      this.l.hostCode = false
    }
  }
}
</script>

<style scoped>

</style>