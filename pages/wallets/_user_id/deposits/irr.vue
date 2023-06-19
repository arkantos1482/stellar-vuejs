<template>
  <div class="mt-0">
    <v-alert
      color="primary"
      class="text-display-2 px-12"
      colored-border
      border="left"
      elevation="2"
    >
      <ul>
        <li>
          جهت افزایش اعتبار کیف پول تومانی خود با استفاده از کارت‌های بانکی عضو
          شبکه شتاب و از طریق درگاه پرداخت اینترنتی اقدام نمایید.
        </li>
        <li>
          به آدرس صفحه‌ درگاه بانکی دقت نموده و تنها پس از اطمینان از حضور در
          سایت‌های سامانه‌ی شاپرک مشخصات کارت بانکی خود را وارد نمایید.
        </li>
        <li>در صفحه درگاه دقت کنید که حتما مبلغ نمایش داده شده درست باشد.</li>
        <li>
          جهت واریز وجه، حتما باید از کارت‌ بانکی به نام خودتان که در
          پروفایل‌تان ثبت و تایید شده است، استفاده نمایید.
        </li>
      </ul>
    </v-alert>

    <a-row class="align-stretch">
      <v-col cols="4" class="pa-4 d-flex flex-column">
        <div class="text-h4 primary--text mb-6 text-right">واریز</div>
        <v-card class="px-16 py-12 flex-grow-1" width="100%">
          <crypto-upper :balance="balance" :type="type" />
          <p class="text-display-2 ma-0">
            باقی مانده واریز روزانه:<span class="font-weight-medium"
              >&nbsp{{ daily_rem_usage }}</span
            >
          </p>
          <p class="text-display-2 ma-0">
            باقی مانده واریز ماهیانه:
            <span class="font-weight-medium">&nbsp{{ monthly_rem_usage }}</span>
          </p>

          <v-form
            class="mt-12"
            @submit.prevent="onDeposit"
            v-model="v.deposit"
            ref="form"
          >
            <a-text-field
              separated
              mask="####################"
              :rules="[rules.required, rules.moreThanBillion]"
              hint="حداقل میزان واریز ۱۰۰هزار تومان می باشد."
              v-model="amount"
              filled
              label="مقدار تومان"
            />

            <p class="grey--text mt-2 mb-1 text-body-2">کارت بانکی</p>
            <v-select dense outlined flat :items="cardList" v-model="bank_card">
              <template v-slot:no-data>کارت بانکی وارد نشده است.</template>
            </v-select>

            <v-btn
              type="submit"
              :loading="l.deposit"
              block
              color="primary"
              class="my-4"
              >واریز
            </v-btn>
            <v-btn block color="primary" outlined @click="$router.back()"
              >بازگشت</v-btn
            >
          </v-form>
        </v-card>
      </v-col>

      <v-col cols="8" class="pa-0">
        <deposits :type="type" />
      </v-col>
    </a-row>
  </div>
</template>

<script>
import ps from "@/mixins/pstopper"
import Deposits from "@/pages/wallets/_user_id/deposits/index"
import ACard from "@/components/ACard"
import ATextField from "@/components/ATextField"
import CryptoUpper from "@/components/CryptoUpper"
import { toSeparated } from "@/models/NumberUtil"
import balances, { refresh } from "../../balanceService"

export default {
  mixins: [ps],
  components: { CryptoUpper, Deposits, ACard, ATextField },
  computed: {
    user_id() {
      return this.$route.params.user_id
    },
    balances,
    balance() {
      return this.balances[this.type]?.actual_balance
    },
  },
  data() {
    return {
      v: { deposit: false },
      rules: {
        required: (value) => !!value || "الزامی است",
        moreThanBillion: (value) =>
          (!!value && parseFloat(value) >= 100 * 1000) ||
          "حداقل باید بیشتر از ۱۰۰ هزار تومان باشد",
      },
      type: "IRR",
      cardList: [],
      amount: "",
      link: "",
      bank_card: "",
      l: { deposit: false },
    }
  },
  mounted() {
    refresh(this.$axios, this.user_id)
    this.$axios
      .$post("/access/limits/remained/" + this.user_id, {
        resource: "irr",
        action: "deposit",
      })
      .then((res) => {
        this.daily_rem_usage =
          res.daily_rem_usage !== -1
            ? toSeparated(res.daily_rem_usage) + "تومان"
            : "نامحدود"
        this.monthly_rem_usage =
          res.monthly_rem_usage !== -1
            ? toSeparated(res.monthly_rem_usage) + "تومان"
            : "نامحدود"
      })

    this.initCard()
  },
  methods: {
    async onDeposit() {
      this.$refs.form.validate()
      if (this.v.deposit) {
        this.l.deposit = true
        this.link = await this.$axios.$post("/irr/deposit/" + this.user_id, {
          amount: this.amount,
          bank_card: this.bank_card,
        })
        window.open(this.link, "_blank")
        this.l.deposit = false
      }
    },
    async initCard() {
      this.profile = await this.$axios.$get("/profiles/" + this.user_id)
      this.cardList = ["", "_2", "_3", "_4", "_5"]
        .map((i) => this.profile["bank_card" + i])
        .filter((i) => i)
      this.bank_card = this.cardList[0]
    },
  },
}
</script>

<style scoped></style>
