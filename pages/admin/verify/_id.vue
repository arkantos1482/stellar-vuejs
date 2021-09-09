<template>
  <v-row justify="center">
    <v-col cols="9">
      <v-carousel>
        <v-carousel-item contain :src="docs.ssn"/>
        <v-carousel-item contain :src="docs.bill"/>
        <v-carousel-item contain :src="docs.bank_card"/>
      </v-carousel>

      <div class="text-center mt-8">
        <v-btn v-if="hasVideo" @click="downloadVideo"
               :loading="l.downloadVideo" color="primary">دانلود ویدیو
        </v-btn>
      </div>

      <h1 class="mt-8 mb-2">مشخصات استعلامی</h1>
      <v-row>
        <v-col v-for="(item,idx) in kycList" :key="idx" cols="6">
          <kyc-item :user-id="userId" :title="item.name" :link-suffix="item.ls"/>
        </v-col>
      </v-row>

      <h1 class="mt-16">تایید مدارک</h1>
      <v-row>
        <v-col cols="4">
          <h3>اطلاعات شخصی</h3>
          <v-switch label="ایمیل" v-model="state.email"/>
          <v-switch label="موبایل" v-model="state.cell_phone"/>
          <v-switch label="کارت ملی" v-model="state.ssn"/>
          <v-switch label="تصویر هویت" v-model="state.bank_account"/>
        </v-col>

        <v-col cols="4">
          <h3>اطلاعات تکمیلی</h3>
          <v-switch label="تلفن ثابت" v-model="state.phone"/>
          <v-switch label="آدرس" v-model="state.address"/>
        </v-col>

        <v-col cols="4">
          <h3>اطلاعات مالی</h3>
          <v-switch label="شماره کارت" v-model="state.bank_card"/>
          <v-switch label="شماره کارت ۲" v-model="state.bank_card_2"/>
          <v-switch label="شبا" v-model="state.bank_shaba"/>
          <v-switch label="شبا ۲" v-model="state.bank_shaba_2"/>
        </v-col>
      </v-row>

      <div class="text-center">
        <v-btn @click="apply" :loading="l.apply" color="red">اعمال تغییر</v-btn>
        <v-btn @click="$router.back()">بازگشت</v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import ps from '@/mixins/pstopper'
import KycItem from "../../../components/KycItem";
import ARow from "../../../components/ARow";

export default {
  components: {ARow, KycItem},
  mixins: [ps],
  computed: {
    kycList() {
      return [
        {name: 'آدرس پستی', ls: '/postal-code'},
        {name: 'کارت بانکی ۱', ls: '/bank-card'},
        {name: 'کارت بانکی ۲', ls: '/bank-card-2'},
        {name: 'شبا ۱', ls: '/bank-shaba'},
        {name: 'شبا ۲', ls: '/bank-shaba-2'},
        {name: 'شبای متصل به کارت ۱', ls: '/shaba-by-card-1'},
        {name: 'شبای متصل به کارت ۲', ls: '/shaba-by-card-2'},
        {name: 'تطبیق کد ملی و موبایل', ls: '/match-ssn-mobile'},
        {name: 'تطبیق کد ملی و شبا و تاریخ تولد', ls: '/match-shaba-ssn-birthdate'},
        {name: 'تطبیق کد ملی و کارت بانکی و تاریخ تولد', ls: '/match-card-ssn-birthdate'},
        {name: 'تطبیق نام و شبا', ls: '/match-shaba-name'},
        {name: 'تطبیق نام و کارت بانکی', ls: '/match-card-name'},
        {name: 'اطلاعات هویتی بر حسب کد ملی و تاریخ تولد', ls: '/identity-by-ssn-birthdate'},
        {name: 'شباهت کد ملی و نام و نام خانوادگی و تاریخ تولد', ls: '/identity-similarity'},
      ]
    }

  },
  data() {
    return {
      l: {apply: false, downloadVideo: false},
      state: {
        email: false,
        cell_phone: false,
        phone: false,
        ssn: false,
        address: false,
        bank_card: false,
        bank_card_2: false,
        bank_shaba: false,
        bank_shaba_2: false,
        bank_account: false
      },
      userId: this.$route.params.id,
      docs: {ssn: '', bill: '', bank_card: ''},
      hasVideo: false,
      verifyList: []
    }
  },
  async mounted() {
    this.$axios.$get('/profiles/' + this.userId + '/verifies')
        .then(res => this.state = res)

    this.$axios.$get('/profiles/' + this.userId + '/docs/has-video')
        .then(res => this.hasVideo = res.has_video)

    this.$axios.$get('/profiles/' + this.userId + '/docs/ssn')
        .then(res => this.docs.ssn = res)
    this.$axios.$get('/profiles/' + this.userId + '/docs/bill')
        .then(res => this.docs.bill = res)
    this.$axios.$get('/profiles/' + this.userId + '/docs/bank-card')
        .then(res => this.docs.bank_card = res)
  },
  methods: {
    async apply() {
      this.l.apply = true
      await this.$axios.$put('/profiles/' + this.userId + '/verifies', this.state)
      this.l.apply = false
    },
    async downloadVideo() {
      this.l.downloadVideo = true
      let response = await this.$axios.get('/profiles/' + this.userId + '/docs/video', {
        responseType: 'arraybuffer'
      })
      let fileURL = window.URL.createObjectURL(new Blob([response.data]));
      let fileLink = document.createElement('a');

      fileLink.href = fileURL;
      fileLink.setAttribute('download', 'profile.mp4');
      document.body.appendChild(fileLink);

      fileLink.click();
      this.l.downloadVideo = false
    }
  }
}
</script>

<style scoped>

</style>

