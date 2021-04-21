<template>
  <div>
    <p class="text-h4 primary--text">با دعوت از دوستان خود سود بیشتری کسب کنید.</p>
    <div class="d-flex align-items-stretch">
      <a-card class="ml-4" width="40%" divider title="ایجاد کد دعوت">
        <p class="text-h5 grey--text text--darken-1">
          نرخ کارمزد ۲۰درصد به شما تعلق گرفته است، سهم دوستان خود را مشخص کنید.
        </p>
        <v-row>
          <v-col class="text-center">
            <p class="">درصد شما</p>
            <p class="text-h5">{{ myPercent + "درصد" }}</p>
          </v-col>
          <v-divider vertical/>
          <v-col class="text-center">
            <p class="">درصد دوستان</p>
            <p class="text-h5">{{ guestPercent + "درصد" }}</p>
          </v-col>
        </v-row>
        <v-slider v-model="myPercent"
                  min="0" max="20" step="5" track-color="accent"
                  ticks thumb-label/>
        <div class="text-center">
          <v-btn @click="submitMyPercent" :loading="l.percent"
                 small depressed class="primary--text px-12 py-4"
                 color="primary lighten-4">اعمال
          </v-btn>
        </div>
      </a-card>

      <a-card width="60%" divider title="کد دعوت شما">
        <p class="text-h5 grey--text text--darken-1">
          برای پیوستن دوستان خود به بیترا، کد زیر را با آنها به اشتراک بگذارید.
        </p>
        <div v-if="myLink">
          <div class="d-flex justify-space-between align-center">
            <p class="text-h5 ma-0">لینک دعوت</p>
            <p style="font-family: sans-serif !important;"
               class="d-flex align-center text-h5 ma-0">
              <v-btn icon @click="copy(myLink)">
                <v-icon color="primary">mdi-clipboard-text-multiple-outline</v-icon>
              </v-btn>
              {{ myLink }}
            </p>
          </div>
          <div class="d-flex justify-space-between align-center">
            <p class="text-h5 ma-0">کد دعوت</p>
            <p style="font-family: sans-serif !important;"
               class="d-flex align-center text-h5 ma-0">
              <v-btn icon @click="copy(myCode)">
                <v-icon color="primary">mdi-clipboard-text-multiple-outline</v-icon>
              </v-btn>
              {{ myCode }}
            </p>
          </div>
        </div>
      </a-card>
    </div>

    <a-card class="mt-4" divider title="کد دعوت کننده شما">
      <p class="text-h5 grey--text text--darken-1">
        چنانچه از طریق یکی از کاربران بیترا با ما آشنا شده اید. با وارد کد این کار به عتوان معرف خود، درصدی از کارمزد
        معاملات شما بدون هزینه اضافه برای شما، به معرف شما تخصیص داده میشود.
      </p>
      <div class="d-flex justify-center mt-4">
        <a-text-field class="flex-grow-0 mx-2" filled label="کد معرف" v-model="myHostCode">
          <v-btn @click="submitTheHostCode" :loading="l.hostCode"
                 outlined tile depressed small class="inside-btn primary--text px-12" color="primary lighten-4">تایید
          </v-btn>
        </a-text-field>

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
    },
    copy(value) {
      let tempInput = document.createElement("input");
      tempInput.value = value;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
    }
  }
}
</script>

<style scoped>

</style>