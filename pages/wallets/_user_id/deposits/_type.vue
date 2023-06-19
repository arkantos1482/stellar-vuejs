<template>
  <div>
    <a-row class="align-stretch">
      <v-col cols="4" class="pa-4 d-flex flex-column">
        <div class="text-h4 primary--text mb-6 text-right">
          {{ actionTitle }}
        </div>
        <v-card class="py-12 flex-grow-1" height="100%">
          <div v-if="type === 'USDT'" class="text-center mb-8">
            <v-btn-toggle mandatory dense color="primary" v-model="usdtNetwork">
              <v-btn value="trx">ترون</v-btn>
              <v-btn value="eth">اتریوم</v-btn>
            </v-btn-toggle>
          </div>

          <div v-show="address !== 'not_loaded'">
            <crypto-upper class="mx-16" :balance="balance" :type="type" />

            <div v-if="address !== 'no_address'" class="mt-12 text-center">
              <vue-qrcode :value="address | bchFix" />
              <v-row class="my-4" justify="center" align="center">
                <v-btn icon @click="copy(fixBchMethod(address))">
                  <v-icon small color="primary"
                    >mdi-clipboard-text-multiple-outline</v-icon
                  >
                </v-btn>
                <p class="mb-0" style="font-family: serif; font-size: 1.6rem">
                  {{ address | bchFix }}
                </p>
              </v-row>
            </div>
            <div v-else class="px-16">
              <v-btn
                @click="d.create = true"
                :loading="l.create"
                class="mt-16 mb-4"
                block
                color="primary"
                >ایجاد
              </v-btn>
            </div>
            <div class="px-16">
              <v-btn block color="primary" outlined @click="$router.back()"
                >بازگشت</v-btn
              >
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="8" class="pa-0">
        <deposits :type="type" :title="listTitle" />
      </v-col>
    </a-row>

    <v-dialog v-model="d.create" width="520px">
      <v-card class="px-12 py-6">
        <p class="primary--text text-h4 text-center">تحقیق برعهده شماست</p>
        <p class="text-display-1 text-center">
          شما در حال ایجاد کیف پول توکن شرکت‌های خصوصی هستید.
        </p>
        <ul class="text-display-2">
          <li>
            عرضه توکن‌های خصوصی بخشی از خدمات بیترا است. آنچه درمورد ویژگی‌ها و
            امتیازات آن‌ها در سایت و شبکه‌های اجتماعی بیترا ارائه می‌شود، فقط
            برای اطلاعات عمومی ارائه شده است و به‌هیچ‌وجه پیشنهاد خرید یا فروش و
            توصیه به سرمایه‌گذاری در آن نمی‌باشد. هرگونه اظهارنظر در خصوص آن‌ها
            نظر شخصی گوینده است و هیچ تضمینی برای کامل بودن یا صحت آن وجود
            ندارد.
          </li>
          <li>
            بیترا در قبال زیان احتمالی ناشی از سرمایه‌گذاری در آن‌ها و صحت
            اطلاعاتی که از سوی ناشر در خصوص آن‌ها گفته می‌شود هیچ‌گونه مسئولیتی
            ندارد. به همه کاربران صرف‌نظر از تجربه و دانش، اکیداً توصیه می‌شود
            قبل از آزمایش هر یک از محصولات ارائه‌شده توسط شرکت‌های خصوصی،
            تحقیقات خود را انجام دهند. اگر کاربر پس از تحقیق هنوز به اطمینان
            نرسیده است، توصیه می‌شود از ورود به این بازارها خودداری نماید.
          </li>
          <li>
            کاربر تأیید می‌نماید معامله برخی از توکن‌ها می‌تواند پرریسک باشد،
            لذا از همه کاربران خواسته می‌شود دوباره شرایط و قوانین بیترا را
            مطالعه نموده و با قبول قوانین و مقررات نسبت به معامله در بازار
            توکنها اقدام‌نمایند.
          </li>
        </ul>
        <p>متن بالا مطالعه و مورد تأیید است.</p>
        <div class="text-center">
          <v-btn color="primary" @click="createCrypto">تایید</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import VueQrcode from "vue-qrcode"
import ACard from "@/components/ACard"
import Deposits from "@/pages/wallets/_user_id/deposits/index"
import pstopper from "@/mixins/pstopper"
import CryptoUpper from "@/components/CryptoUpper"
import balances from "../../balanceService"

export default {
  mixins: [pstopper],
  components: { CryptoUpper, Deposits, VueQrcode, ACard },
  filters: {
    bchFix: (address) => address.replace("bitcoincash:", ""),
  },
  computed: {
    network() {
      return this.type === "USDT" ? this.usdtNetwork : this.type
    },
    user_id() {
      return this.$route.params.user_id
    },
    balances,
    balance() {
      return this.balances[this.type]?.actual_balance
    },
    actionTitle() {
      return this.isInternal() ? "دریافت" : "واریز"
    },
    listTitle() {
      return this.isInternal() ? "لیست دریافت ها" : "لیست واریزها"
    },
  },
  watch: {
    usdtNetwork(val) {
      this.initAddress()
    },
  },
  data() {
    return {
      usdtNetwork: "trx",
      type: this.$route.params.type.toUpperCase(),
      address: "not_loaded",
      l: { create: false },
      d: { create: false },
    }
  },
  mounted() {
    this.initAddress()
  },
  methods: {
    async initAddress() {
      this.address = "not_loaded"
      const res = await this.$axios.$get("/crypto/address/" + this.user_id, {
        params: {
          crypto: this.type,
          network: this.network,
        },
      })
      this.address = res.address ? res.address : "no_address"
    },
    async createCrypto() {
      this.d.create = false
      this.l.create = true
      const res = await this.$axios.$post(
        "/crypto/address/create/" + this.user_id,
        { crypto: this.type, network: this.network }
      )
      this.address = res.address
      this.l.create = false
    },
    isInternal() {
      return ["AMN", "EBG", "SHA", "ART", "ZRK", "TLS", "WIT"].includes(
        this.type.toUpperCase()
      )
    },
    fixBchMethod: (address) => address.replace("bitcoincash:", ""),
    copy(value) {
      let tempInput = document.createElement("input")
      tempInput.value = value
      document.body.appendChild(tempInput)
      tempInput.select()
      document.execCommand("copy")
      document.body.removeChild(tempInput)
    },
  },
}
</script>
