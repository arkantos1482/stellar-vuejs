<template>
  <div>
    <a-row class="align-center mx-16">
      <v-col cols="6">
        <p class="text-h4 primary--text">
          با دعوت از دوستان خود
          <br />
          سود بیشتری برای یکدیگر کسب کنید.
        </p>
        <p class="bluegrey--text my-12">
          با هر معامله ای که دوستان شما در بیترا انجام دهند
          <span>{{ defaultCode.myPercent }}٪ کارمزد</span>
          به شما تعلق می گیرد
        </p>
        <v-btn color="primary" class="px-4">دعوت از دوستان</v-btn>
      </v-col>

      <v-col cols="6">
        <v-card width="100%" class="px-12 py-6">
          <a-row class="justify-space-between align-center">
            <p class="bluegrey--text mb-0">کد دعوت</p>
            <v-btn @click="d.create = true" text color="primary">
              <v-icon small color="primary">mdi-plus-thick</v-icon>
              ایجاد لینک دعوت
            </v-btn>
          </a-row>

          <div v-if="defaultCode.link">
            <a-row class="align-center">
              <p class="text-h4 primary--text mb-0">{{ defaultCode.code }}</p>
              <v-btn icon @click="copy(defaultCode.code)">
                <v-icon small color="primary"
                  >mdi-clipboard-text-multiple-outline
                </v-icon>
              </v-btn>
            </a-row>
            <p class="bluegrey--text mt-8 mb-0">لینک دعوت</p>
            <a-row class="align-center">
              <p class="mb-0" style="font-family: sans-serif !important">
                {{ defaultCode.link }}
              </p>
              <v-btn icon @click="copy(defaultCode.link)">
                <v-icon small color="primary"
                  >mdi-clipboard-text-multiple-outline
                </v-icon>
              </v-btn>
            </a-row>
          </div>

          <v-sheet class="text-center mt-6 pa-6">
            <a-row>
              <v-col>
                <p class="bluegrey--text">درصد دریافتی شما</p>
                <p class="mb-0">{{ defaultCode.myPercent + "درصد" }}</p>
              </v-col>
              <v-divider vertical />
              <v-col class="text-center">
                <p class="bluegrey--text">درصد دریافتی دوستان</p>
                <p class="mb-0">{{ guestPercent + "درصد" }}</p>
              </v-col>
            </a-row>
          </v-sheet>
        </v-card>
      </v-col>
    </a-row>

    <p class="text-center text-h6 mb-8 mt-16">آمار کلی دعوت از دوستان</p>

    <v-row style="background: white" class="px-12">
      <v-col cols="4">
        <stats-card
          title="سود دریافتی از دعوت دوستان"
          icon="mdi-finance"
          icon-color="green"
          :body="totalProfit"
        />
      </v-col>
      <v-col cols="4">
        <stats-card
          title="تعداد کل دوستان"
          icon="mdi-account-multiple"
          icon-color="pink"
          :body="totalMembers"
        />
      </v-col>
      <v-col cols="4">
        <stats-card
          title="تعداد معاملات دوستان"
          icon="mdi-clipboard-list"
          icon-color="yellow"
          :body="totalTrades"
        />
      </v-col>
      <!--      <v-col cols="3">-->
      <!--        <stats-card title="رتبه شما" icon="mdi-star" icon-color="blue" :body="stats.rank"/>-->
      <!--      </v-col>-->
    </v-row>

    <p class="text-center text-h6 mt-16 mb-n2">لیست لینک های دعوت</p>

    <div class="text-left px-12">
      <v-btn text color="primary" @click="d.create = true">
        <v-icon> mdi-plus</v-icon>
        ایجاد لینک دعوت
      </v-btn>
    </div>
    <v-data-table
      class="px-12"
      :headers="codes.headers"
      :items="codes.items"
      hide-default-footer
    >
      <template v-slot:item.guest_count="{ item }">
        {{ item.guests.length }}
      </template>
      <template v-slot:item.percents="{ item }">
        {{ `${item.host_percent}% / ${item.guest_percent}%` }}
      </template>
      <template v-slot:item.edit="{ item }">
        <v-btn icon color="yellow">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.delete="{ item }">
        <v-btn icon color="pink">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <p class="text-center text-h6 mt-16">لیست دوستان</p>
    <v-data-table
      :headers="members.headers"
      :items="members.items"
      hide-default-footer
      class="mb-12 px-12"
    >
      <template v-slot:item.user_created_at="{ value }">
        {{ value | toFarsiDate }}
      </template>
    </v-data-table>

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
        <v-sheet class="mt-6 pa-6">
          <a-row>
            <v-col>
              <p class="bluegrey--text">درصد دریافتی شما</p>
              <p class="mb-0">{{ myPercent + "درصد" }}</p>
            </v-col>
            <v-divider vertical />
            <v-col class="text-center">
              <p class="bluegrey--text">درصد دریافتی دوستان</p>
              <p class="mb-0">{{ guestPercent + "درصد" }}</p>
            </v-col>
          </a-row>
        </v-sheet>
        <a-text-field class="mt-6" v-model="codeDesc" label="متن" />
        <!--        <v-checkbox class="mt-6" v-model="defaultToken" label="انتخاب به عنوان کد دعوت پیش فرض"/>-->
        <div class="text-left">
          <v-btn
            @click="createCode"
            :loading="l.create"
            depressed
            color="primary"
            >ایجاد لینک دعوت
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <a-card v-if="false" class="mt-4" divider title="کد دعوت کننده شما">
      <p class="text-h5 grey--text text--darken-1">
        چنانچه از طریق یکی از کاربران بیترا با ما آشنا شده اید. با وارد کد این
        کار به عتوان معرف خود، درصدی از کارمزد معاملات شما بدون هزینه اضافه برای
        شما، به معرف شما تخصیص داده میشود.
      </p>
      <div class="d-flex justify-center mt-4">
        <a-text-field
          class="flex-grow-0 mx-2"
          filled
          label="کد معرف"
          v-model="myHostCode"
        >
          <v-btn
            @click="submitTheHostCode"
            :loading="l.hostCode"
            outlined
            tile
            depressed
            small
            class="inside-btn primary--text px-12"
            color="primary lighten-4"
            >تایید
          </v-btn>
        </a-text-field>
      </div>
    </a-card>
  </div>
</template>

<script>
import ACard from "@/components/ACard"
import ATextField from "@/components/ATextField"
import pstopper from "@/mixins/pstopper"
import StatsCard from "@/components/stats-card"
import { collect } from "collect.js"

export default {
  components: { StatsCard, ATextField, ACard },
  mixins: [pstopper],
  computed: {
    defaultGuestPercent() {
      return 20 - this.defaultCode.myPercent
    },
    guestPercent() {
      return 20 - this.myPercent
    },
    totalTrades() {
      return collect(this.members.items).reduce((c, i) => c + i.trade_count, 0)
    },
    totalMembers() {
      return this.members.items.length
    },
    totalProfit() {
      return collect(this.members.items).reduce((c, i) => c + i.profit, 0)
    },
  },
  data() {
    return {
      defaultCode: {
        code: "",
        link: "",
        myPercent: "",
      },
      myPercent: 15,
      myHostCode: "",
      defaultToken: true,
      codeDesc: "",
      l: { create: false, hostCode: false },
      d: { create: false },
      codes: {
        headers: [
          { value: "code", text: "کد دعوت", align: "center", sortable: false },
          {
            value: "percents",
            text: "درصد دریافتی شما/دریافتی دوستان",
            align: "center",
            sortable: false,
          },
          { value: "desc", text: "متن", align: "center", sortable: false },
          {
            value: "guest_count",
            text: "دوستان",
            align: "center",
            sortable: false,
          },
          // {value: 'edit', text: 'ویرایش', align: 'center', sortable: false},
          // {value: 'delete', text: 'حذف', align: 'center', sortable: false},
        ],
        items: [],
      },
      members: {
        headers: [
          // {text: 'کد', value: 'code', align: 'center', sortable: false},
          { text: "ایمیل", value: "email", align: "center", sortable: false },
          {
            text: "زمان ثبت نام",
            value: "user_created_at",
            align: "center",
            sortable: false,
          },
          {
            text: "سود دریافتی شما",
            value: "profit",
            align: "center",
            sortable: false,
          },
          {
            text: "تعداد معاملات",
            value: "trade_count",
            align: "center",
            sortable: false,
          },
        ],
        items: [],
      },
    }
  },
  mounted() {
    this.refreshCodesList()

    this.$axios
      .$get("/referrals/me/my-host")
      .then((res) => (this.myHostCode = res))

    this.$axios
      .$get("/referrals/me/members")
      .then((res) => (this.members.items = res))
  },
  methods: {
    async refreshCodesList() {
      let items = await this.$axios.$get("/referrals/me/codes")
      this.codes.items = items.data
      let lastItem = items.data.at(-1)
      this.defaultCode.code = lastItem.code
      this.defaultCode.link =
        items.base_url + "/Register?referral_code=" + lastItem.code
      this.defaultCode.myPercent = lastItem.host_percent
    },
    async createCode() {
      this.l.create = true
      await this.$axios.$post("/referrals/me/codes", {
        host_percent: this.myPercent,
        desc: this.codeDesc,
      })
      await this.refreshCodesList()
      this.l.create = false
      this.d.create = false
    },
    async submitTheHostCode() {
      this.l.hostCode = true
      await this.$axios.$post("/referrals/me/my-host", {
        referral_code: this.myHostCode,
      })
      this.l.hostCode = false
    },
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

<style scoped></style>
