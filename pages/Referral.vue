<template>
  <div class="px-16">
    <a-row class="align-center">
      <v-col cols="6">
        <p class="text-h4">با دعوت از دوستان خود
          <br>
          سود بیشتری برای یکدیگر کسب کنید.</p>
        <p class="bluegrey--text my-12">با هر معامله ای که دوستان شما در بیترا انجام دهند
          <span>۲۰٪ کارمزد</span>
          به شما تعلق می گیرد</p>
        <v-btn color="primary" class="px-4">دعوت از دوستان</v-btn>
      </v-col>

      <v-col cols="6">
        <v-card width="100%" class="px-12 py-6">
          <a-row class="justify-space-between align-center">
            <p class="bluegrey--text mb-0">کد دعوت</p>
            <v-btn @click="d.create = true" text color="primary">
              <v-icon small color="primary">mdi-plus-thick</v-icon>
              ایجاد لینک دعوت اختصاصی
            </v-btn>
          </a-row>

          <div v-if="myLink">
            <a-row class="align-center">
              <p class="text-h4 mb-0">{{ myCode }}</p>
              <v-btn icon @click="copy(myCode)">
                <v-icon small color="primary">mdi-clipboard-text-multiple-outline</v-icon>
              </v-btn>
            </a-row>
            <p class="bluegrey--text mt-8 mb-0">لینک دعوت</p>
            <a-row class="align-center">
              <p class="mb-0" style="font-family: sans-serif !important;">{{ myLink }}</p>
              <v-btn icon @click="copy(myLink)">
                <v-icon small color="primary">mdi-clipboard-text-multiple-outline</v-icon>
              </v-btn>
            </a-row>
          </div>

          <v-sheet class="text-center mt-6 pa-6" color="#141633">
            <a-row>
              <v-col>
                <p class="bluegrey--text">درصد دریافتی شما</p>
                <p class="mb-0">{{ myPercent + "درصد" }}</p>
              </v-col>
              <v-divider vertical/>
              <v-col class="text-center">
                <p class="bluegrey--text">درصد دریافتی دوستان</p>
                <p class="mb-0">{{ guestPercent + "درصد" }}</p>
              </v-col>
            </a-row>
          </v-sheet>
        </v-card>
      </v-col>
    </a-row>

    <v-dialog v-model="d.create" width="520px">
      <v-card class="px-12 py-6 text-center">
        <p class="primary--text text-right">ایجاد لینک دعوت</p>
        <v-btn-toggle v-model="myPercent" color="primary" class="mt-10">
          <v-btn value="0">0%</v-btn>
          <v-btn value="5">5%</v-btn>
          <v-btn value="10">10%</v-btn>
          <v-btn value="15">15%</v-btn>
          <v-btn disabled>20%</v-btn>
          <v-btn disabled>50%</v-btn>
        </v-btn-toggle>
        <v-sheet class="mt-6 pa-6" color="#141633">
          <a-row>
            <v-col>
              <p class="bluegrey--text">درصد دریافتی شما</p>
              <p class="mb-0">{{ myPercent + "درصد" }}</p>
            </v-col>
            <v-divider vertical/>
            <v-col class="text-center">
              <p class="bluegrey--text">درصد دریافتی دوستان</p>
              <p class="mb-0">{{ guestPercent + "درصد" }}</p>
            </v-col>
          </a-row>
        </v-sheet>
        <a-text-field class="mt-6" v-model="tokenText" label="متن"/>
        <v-checkbox class="mt-6" v-model="defaultToken" label="انتخاب به عنوان کد دعوت پیش فرض"/>
        <div class="text-left">
          <v-btn @click="submitMyPercent" :loading="l.percent"
                 depressed color="primary">ایجاد لینک دعوت
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

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
      l: {percent: false, hostCode: false},
      d: {create: false},
      defaultToken: true,
      tokenText: 'کد پیش فرض'
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