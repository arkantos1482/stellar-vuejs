<template>
  <v-app class="text-right">
    <v-app-bar fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" color="red" />
      <router-link to="/">
        <v-img
          class="mr-n4"
          max-width="128"
          max-height="48"
          contain
          :src="require('../assets/images/bitak-vertical.png')"
        />
      </router-link>

      <!--      <div v-show="!isAdmin">-->
      <!--        <v-menu>-->
      <!--          <template v-slot:activator="{ on, attrs }">-->
      <!--            <v-btn text v-bind="attrs" v-on="on" to="/offers/reg">بازار </v-btn>-->
      <!--          </template>-->
      <!--        </v-menu>-->
      <!--        <v-btn text target="_blank" href="https://bitra.market/tokenAmin">-->
      <!--          سرمایه گذاری</v-btn-->
      <!--        >-->
      <!--        <v-btn text target="_blank" href="https://bitra.market/investorsClub"-->
      <!--          >جامعه توکن داران</v-btn-->
      <!--        >-->
      <!--        <v-btn text target="_blank" href="https://bitra.market/news"-->
      <!--          >اخبار</v-btn-->
      <!--        >-->
      <!--        <v-menu offset-y>-->
      <!--          <template v-slot:activator="{ on, attrs }">-->
      <!--            <v-btn v-bind="attrs" v-on="on" text>پشتیبانی</v-btn>-->
      <!--          </template>-->
      <!--          <v-list>-->
      <!--            <v-list-item target="_blank" href="https://bitra.market/terms/"-->
      <!--              >قوانین</v-list-item-->
      <!--            >-->
      <!--            <v-list-item target="_blank" href="https://bitra.market/faq/"-->
      <!--              >سوالات متداول</v-list-item-->
      <!--            >-->
      <!--            <v-list-item-->
      <!--              target="_blank"-->
      <!--              href="https://bitra.market/registerGuide/"-->
      <!--              >راهنمای ثبت نام</v-list-item-->
      <!--            >-->
      <!--          </v-list>-->
      <!--        </v-menu>-->
      <!--        <v-btn text target="_blank" href="https://bitra.market/about"-->
      <!--          >درباره ما</v-btn-->
      <!--        >-->
      <!--        <v-btn text target="_blank" href="https://bitra.market/contact"-->
      <!--          >تماس با ما</v-btn-->
      <!--        >-->
      <!--      </div>-->
      <v-spacer />
      <!--      WALLETS-->
      <v-menu>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on" to="/wallets/me">کیف پول</v-btn>
        </template>
      </v-menu>
      <!--      OFFERS-->
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">سفارشات</v-btn>
        </template>
        <v-list>
          <v-list-item to="/offers/reg">ثبت سفارش</v-list-item>
          <v-list-item to="/offers/active/me">سفارشات در جریان</v-list-item>
          <v-list-item to="/offers/me">تاریخچه سفارشات</v-list-item>
          <v-list-item to="/trades/me">معاملات</v-list-item>
        </v-list>
      </v-menu>

      <!--      PROFILE-->
      <v-menu offset-y>
        <template v-slot:activator="menu">
          <v-tooltip bottom>
            <template v-slot:activator="tooltip">
              <div v-on="tooltip.on" v-bind="tooltip.attrs">
                <v-btn icon v-on="menu.on" v-bind="menu.attrs">
                  <v-icon>mdi-account-outline</v-icon>
                </v-btn>
              </div>
            </template>
            <span>پروفایل</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item>
            <a-row class="align-center">
              <p class="mb-0 ml-8 primary--text">{{ user.email }}</p>
              <v-icon color="primary">mdi-chevron-left</v-icon>
            </a-row>
          </v-list-item>
          <v-divider />
          <!--          <v-list-item>حسابداری مالی</v-list-item>-->
          <!--          <v-list-item>اطلاعات</v-list-item>-->
          <!--          <v-list-item>جوایز و تخفیف ها</v-list-item>-->
          <!--          <v-list-item>تنظیمات</v-list-item>-->
          <!--          <v-list-item>دعوت از دوستان</v-list-item>-->
          <v-list-item to="/users/me">پروفایل</v-list-item>
          <v-list-item to="/Security">امنیت</v-list-item>
          <v-divider />
          <v-list-item @click="logout">خروج</v-list-item>
        </v-list>
      </v-menu>

      <!--      MESSAGES-->
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" to="/messages">
            <v-badge
              overlap
              left
              :content="newMessages.length"
              :value="newMessages.length"
            >
              <v-icon>mdi-bell-outline</v-icon>
            </v-badge>
          </v-btn>
        </template>
        <span>اعلان</span>
      </v-tooltip>

      <!--      DOCUMENT CHECK-->
      <v-menu nudge-width="128" offset-y>
        <template v-slot:activator="menu">
          <v-tooltip bottom>
            <template v-slot:activator="tooltip">
              <div v-on="tooltip.on" v-bind="tooltip.attrs">
                <v-btn icon v-on="menu.on" v-bind="menu.attrs">
                  <v-icon>mdi-text-box-check-outline</v-icon>
                </v-btn>
              </div>
            </template>
            <span>بررسی اطلاعات</span>
          </v-tooltip>
        </template>
        <v-list class="pa-4">
          <div
            v-for="(item, idx) in translateVerify"
            :key="idx"
            class="d-flex justify-space-between"
          >
            <p>{{ item.name }}:</p>
            <p :class="item.value | farsiBoolClass">
              {{ item.value | toFarsiBool }}
            </p>
          </div>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute right temporary>
      <v-list v-if="isAdmin">
        <v-list-item
          v-for="(item, index) in admin_drawer_items"
          :key="index"
          :to="item.to"
        >
          <v-icon>{{ item.icon }}</v-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-list v-else nav dense flat>
        <v-list-item-group color="primary">
          <v-list-item to="/">
            <v-icon class="ml-2">mdi-monitor-dashboard</v-icon>
            <v-list-item-title>داشبورد</v-list-item-title>
          </v-list-item>

          <v-list-item to="/wallets/me">
            <v-icon class="ml-2">mdi-wallet-outline</v-icon>
            <v-list-item-title>کیف پول</v-list-item-title>
          </v-list-item>

          <v-expansion-panels flat>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-list-item>
                  <v-icon class="ml-2"
                    >mdi-card-account-details-star-outline
                  </v-icon>
                  <v-list-item-title>سفارشات</v-list-item-title>
                </v-list-item>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-list-item to="/offers/reg">ثبت سفارش</v-list-item>
                <v-list-item to="/offers/active/me"
                  >سفارشات در جریان
                </v-list-item>
                <v-list-item to="/offers/me">تاریخچه سفارشات</v-list-item>
                <v-list-item to="/trades/me">معاملات</v-list-item>

                <!--                <v-list-item to="/wallets/withdraws">-->
                <!--                  <v-list-item-title>گزارش برداشت</v-list-item-title>-->
                <!--                </v-list-item>-->
                <!--                <v-list-item to="/wallets/deposits">-->
                <!--                  <v-list-item-title>گزارش واریز</v-list-item-title>-->
                <!--                </v-list-item>-->
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-expansion-panels flat>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-list-item>
                  <v-icon class="ml-2"
                    >mdi-badge-account-horizontal-outline
                  </v-icon>
                  <v-list-item-title>حسابداری مالی</v-list-item-title>
                </v-list-item>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-list-item to="/wallets/me/withdraws"
                  >گزارش برداشت
                </v-list-item>
                <v-list-item to="/wallets/me/deposits">گزارش واریز</v-list-item>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-expansion-panels flat>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-list-item>
                  <v-icon class="ml-2">mdi-inbox-full</v-icon>
                  <v-list-item-title>پیام ها</v-list-item-title>
                </v-list-item>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-list-item to="/messages">همه پیام ها</v-list-item>
                <v-list-item to="/messages/news">اخبار و رویدادها</v-list-item>
                <v-list-item to="/messages/events">فعالیت ها</v-list-item>
                <v-list-item to="/messages/settings"
                  >مدیریت اعلان ها
                </v-list-item>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-list-item to="/users/me">
            <v-icon class="ml-2">mdi-card-account-details-outline</v-icon>
            <v-list-item-title>پروفایل</v-list-item-title>
          </v-list-item>

          <v-list-item to="/Security">
            <v-icon class="ml-2">mdi-security</v-icon>
            <v-list-item-title>امنیت</v-list-item-title>
          </v-list-item>

          <!--          <v-list-item to="/coming-soon">-->
          <!--            <v-icon class="ml-2">mdi-account-cash</v-icon>-->
          <!--            <v-list-item-title>جوایز و تخفیف ها</v-list-item-title>-->
          <!--          </v-list-item>-->

          <v-list-item to="/Referral">
            <v-icon class="ml-2">mdi-account-plus</v-icon>
            <v-list-item-title>دعوت از دوستان</v-list-item-title>
          </v-list-item>

          <v-list-item @click="logout">
            <v-icon class="ml-2">mdi-logout</v-icon>
            <v-list-item-title>خروج</v-list-item-title>
          </v-list-item>

          <v-list-item
            v-if="this.user.email === 'bitrabtc@gmail.com'"
            to="/offers/reg/bulk"
          >
            <v-icon class="ml-2">mdi-account-plus</v-icon>
            <v-list-item-title>ثبت دسته ای سفارش</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="py-4 px-0">
        <bitra-banner
          v-for="(i, key) in allPagesBanners"
          :item="i"
          :key="key"
        />
        <nuxt />
      </v-container>
      <v-snackbar v-model="snackBar.normal.show"
        >{{ snackBar.normal.msg }}
      </v-snackbar>
      <v-snackbar color="green" v-model="snackBar.success.show"
        >{{ snackBar.success.msg }}
      </v-snackbar>
      <v-snackbar color="red" v-model="snackBar.fail.show"
        >{{ snackBar.fail.msg }}
      </v-snackbar>
    </v-main>

    <!--    <v-footer class="d-block">-->
    <!--      <BitraBottomBar/>-->
    <!--      <v-divider class="my-4"/>-->
    <!--      <div class="text-center">-->
    <!--        <p class="mb-1"> تمامی حقوق محفوظ و متعلق به شرکت بیترا می باشد.</p>-->
    <!--      </div>-->
    <!--    </v-footer>-->
  </v-app>
</template>

<script>
import { banners, refresh as refreshBanners } from "../models/bannerService"
import BitraBanner from "../components/BitraBanner"

export default {
  components: { BitraBanner },
  errorCaptured(err, vm, info) {
    //todo resolve by status code (err.response.status)
    this.snackBar.fail.show = true

    // if (err.response.data.error.msg?.my_node?.extras?.result_codes?.operations?.[1]) {
    //   this.snackBar.fail.msg = err.response.data.error.msg?.my_node?.extras?.result_codes?.operations?.[1]
    // }
    if (err?.response?.data?.error?.msg?.my_node) {
      this.snackBar.fail.msg = "اشکالی رخ داده است."
    } else {
      this.snackBar.fail.msg = err?.response?.data?.error?.msg
    }
    return false
  },
  filters: {
    toFarsiBool(value) {
      return value ? "تایید شده" : "عدم تایید"
    },
    farsiBoolClass(value) {
      return value ? "success--text" : "error--text"
    },
  },
  data() {
    return {
      btn_toggle: "",
      user: "",
      userVerify: "",
      snackBar: {
        normal: { show: false, msg: "" },
        success: { show: false, msg: "" },
        fail: { show: false, msg: "" },
      },
      clipped: false,
      drawer: false,
      fixed: false,
      admin_drawer_items: [
        {
          icon: "mdi-chart-bubble",
          title: "مدیریت پروفایل کاربران",
          to: "/Users",
        },
        {
          icon: "mdi-chart-bubble",
          title: "مدیریت تغییرات پروفایل",
          to: "/admin/profile-states",
        },
        {
          icon: "mdi-chart-bubble",
          title: "مدیریت مالی کاربران",
          to: "/admin/transactions",
        },
        {
          icon: "mdi-chart-bubble",
          title: "تعیین کارمزدهای کاربران",
          to: "/admin/user-trade-fees",
        },
        {
          icon: "mdi-chart-bubble",
          title: "گزارش موجودی ها",
          to: "/admin/accounts",
        },
        {
          icon: "mdi-chart-bubble",
          title: "پرداخت های رمزارزی",
          to: "/admin/payment/CryptoReport",
        },
        {
          icon: "mdi-chart-bubble",
          title: "پرداخت های تومانی",
          to: "/admin/payment/TomanReport",
        },
        {
          icon: "mdi-chart-bubble",
          title: "لیست تصحیح تراکنش ها",
          to: "/admin/tx-corrections",
        },
        {
          icon: "mdi-chart-bubble",
          title: "تصحیح واریزهای جامانده",
          to: "/admin/fix-deposit",
        },
        {
          icon: "mdi-chart-bubble",
          title: "گزارشات جامع",
          to: "/admin/aggregatedReports",
        },
        {
          icon: "mdi-chart-bubble",
          title: "کارمزد برداشت ها",
          to: "/admin/withdraw-fee",
        },
        {
          icon: "mdi-chart-bubble",
          title: "مدیریت حساب های بانک",
          to: "/admin/bank-accounts",
        },
        {
          icon: "mdi-chart-bubble",
          title: " سطوح بهره برداری",
          to: "/admin/access",
        },
        {
          icon: "mdi-chart-bubble",
          title: " مینیمم برداشت ها",
          to: "/admin/access/min-withdraws",
        },
        {
          icon: "mdi-chart-bubble",
          title: " مینیمم معاملات",
          to: "/admin/access/min-trades",
        },
        {
          icon: "mdi-chart-bubble",
          title: "مدیریت پیام ها",
          to: "/admin/messages/broadcast",
        },
        {
          icon: "mdi-chart-bubble",
          title: "مدیریت بات ها",
          to: "/admin/bots",
        },
        {
          icon: "mdi-chart-bubble",
          title: "لیست اپراتورهای گارد",
          to: "/admin/operators",
        },
        {
          icon: "mdi-chart-bubble",
          title: "مدیریت بنر ها",
          to: "/admin/messages/banners",
        },
        {
          icon: "mdi-chart-bubble",
          title: "محدودیت موقت فیچرهای اصلی",
          to: "/admin/access/feature-constraints",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      newMessages: [],
      interval: { msg: null },
    }
  },
  async mounted() {
    this.$bus.$on("snack", (msg, level) => {
      this.showErrorSnack(msg, level)
    })

    this.$bus.$on("drawer", (show) => {
      this.drawer = show
    })

    refreshBanners(this.$axios)

    try {
      this.user = await this.$axios.$get("/profiles/me")
      this.$store.commit("auth/profile", this.user)
      if (this.isAdmin) {
        await this.$router.push("/Users")
      }
      this.userVerify = await this.$axios.$get("/profiles/me/verifies")
    } catch (e) {}
    await this.loadMessages()
    this.startRecurrentJob()

    document.addEventListener("visibilitychange", this.onVizChange, false)
  },
  computed: {
    allPagesBanners: () => banners("all"),
    isAdmin() {
      return this.user.role === "admin"
    },
    title() {
      return this.user.name
      // return this.user.name + '  ' + this.user.access_level
    },
    accessLevel() {
      return this.user.access_level
    },
    translateVerify() {
      return Object.keys(this.userVerify).map((key) => ({
        name: this.$options.filters.verifyToFarsi(key),
        value: this.userVerify[key],
      }))
    },
  },
  methods: {
    async logout() {
      await this.$axios.$post("/logout")
      this.$store.commit("auth/logout")
      await this.$router.push("/login")
    },
    showErrorSnack(msg, level) {
      if (level === "success") {
        this.snackBar.success.show = true
        this.snackBar.success.msg = msg
      } else if (level === "error") {
        this.snackBar.fail.show = true
        this.snackBar.fail.msg = msg
      } else {
        this.snackBar.normal.show = true
        this.snackBar.normal.msg = msg
      }
    },
    async loadMessages() {
      this.newMessages = await this.$axios.$get("/messages/me/new-messages")
    },
    startRecurrentJob() {
      // this.interval.msg = setInterval(() => {
      //   this.loadMessages()
      // }, 30 * 1000)
    },
    cleanUp() {
      // if (this.interval.msg) clearInterval(this.interval.msg)
    },
    onVizChange(e) {
      if (document.hidden) {
        this.cleanUp()
      } else {
        this.startRecurrentJob()
      }
    },
  },
  beforeDestroy() {
    document.removeEventListener("visibilitychange", this.onVizChange)
    this.cleanUp()
  },
}
</script>
