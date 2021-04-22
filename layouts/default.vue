<template>
  <v-app class="text-right">
    <v-navigation-drawer v-model="drawer" fixed right app>
      <v-list nav dense flat>
        <v-list-item-group color="primary">
          <v-list-group prepend-icon="mdi-chart-bubble" append-icon="" no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>حسابداری مالی</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item to="/wallets/withdraws">
              <v-list-item-title>گزارش برداشت</v-list-item-title>
            </v-list-item>
            <v-list-item to="/wallets/deposits">
              <v-list-item-title>گزارش واریز</v-list-item-title>
            </v-list-item>
          </v-list-group>

          <v-list-item to="/Security">
            <v-icon>mdi-chart-bubble</v-icon>
            <v-list-item-title>امنیت</v-list-item-title>
          </v-list-item>

          <v-list-item to="/coming-soon">
            <v-icon>mdi-chart-bubble</v-icon>
            <v-list-item-title>جوایز و تخفیف ها</v-list-item-title>
          </v-list-item>

          <v-list-item to="/Referral">
            <v-icon>mdi-chart-bubble</v-icon>
            <v-list-item-title>دعوت از دوستان</v-list-item-title>
          </v-list-item>

          <v-list-item to="/">
            <v-icon>mdi-chart-bubble</v-icon>
            <v-list-item-title>داشبورد</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-img max-width="128" max-height="48"
             :src="require('../assets/images/Bitra_Logo_Final_Edition-18@2x.png')"/>
      <v-tabs v-show="!isAdmin">
        <v-tab to="/">بازار</v-tab>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-tab v-bind="attrs" v-on="on"> سرمایه گذاری</v-tab>
          </template>
          <v-list>
            <v-list-item to="/coming-soon">سرمایه ۱</v-list-item>
            <v-list-item to="/coming-soon">سرمایه ۲</v-list-item>
          </v-list>
        </v-menu>
        <v-tab>جامعه توکن داران</v-tab>
        <v-tab>اخبار</v-tab>
        <v-tab>پشتیبانی</v-tab>
        <v-tab>درباره ما</v-tab>
        <v-tab>تماس با ما</v-tab>
      </v-tabs>
      <!--      <v-spacer/>-->
      <!--      WALLETS-->
      <v-menu>
        <template v-slot:activator="{on,attrs}">
          <v-btn class="grey--text text--darken-2"
                 text v-bind="attrs" v-on="on"
                 to="/wallets">کیف پول
          </v-btn>
        </template>
      </v-menu>
      <!--      OFFERS-->
      <v-menu>
        <template v-slot:activator="{on,attrs}">
          <v-btn class="grey--text text--darken-2" text v-bind="attrs" v-on="on">سفارشات
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/offers/reg">ثبت سفارش</v-list-item>
          <v-list-item to="/offers/active/me">سفارشات در جریان</v-list-item>
          <v-list-item to="/offers/me">تاریخچه سفارشات</v-list-item>
          <v-list-item to="/trades/me">معاملات</v-list-item>
        </v-list>
      </v-menu>
      <!--      PROFILE-->
      <v-menu>
        <template v-slot:activator="{on,attrs}">
          <v-btn class="grey--text text--darken-2" text v-bind="attrs" v-on="on">{{ title }}
            <v-icon>mdi-account-outline</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/users/me">پروفایل</v-list-item>
          <v-list-item to="/Security">امنیت</v-list-item>
          <v-list-item class="" @click="logout">خروج</v-list-item>
        </v-list>
      </v-menu>
      <!--      NOTIFICATION-->
      <v-menu nudge-width="96">
        <template v-slot:activator="{on,attrs}">
          <v-btn class="grey--text text--darken-2" text v-bind="attrs" v-on="on">{{ accessLevel }}
            <v-icon>mdi-bell-outline</v-icon>
          </v-btn>
        </template>
        <v-list class="pa-4">
          <div v-for="(item,idx) in translateVerify" :key="idx" class="d-flex justify-space-between">
            <p>{{ item.name }}:</p>
            <p :class="item.value|farsiBoolClass">{{ item.value|toFarsiBool }}</p>
          </div>
        </v-list>
      </v-menu>
    </v-app-bar>


    <v-main>
      <v-container fluid class="pa-4">
        <nuxt/>
      </v-container>
      <v-snackbar v-model="snackBar.normal.show">{{ snackBar.normal.msg }}</v-snackbar>
      <v-snackbar color="green" v-model="snackBar.success.show">{{ snackBar.success.msg }}</v-snackbar>
      <v-snackbar color="red" v-model="snackBar.fail.show">{{ snackBar.fail.msg }}</v-snackbar>
    </v-main>

    <v-footer style="z-index: 0">
      <div>
        <BitraBottomBar/>
        <v-divider class="my-4"/>
        <p class="mb-1"> تمامی حقوق محفوظ و متعلق به شرکت بیترا می باشد.</p>
      </div>
    </v-footer>
  </v-app>
</template>

<script>

export default {
  errorCaptured(err, vm, info) {
    //todo resolve by status code (err.response.status)
    this.snackBar.fail.show = true

    if (err.response.data.error.msg?.my_node?.extras?.result_codes?.operations?.[1]) {
      this.snackBar.fail.msg = err.response.data.error.msg?.my_node?.extras?.result_codes?.operations?.[1]
    } else {
      this.snackBar.fail.msg = err.response.data.error.msg
    }
    return false
  },
  filters: {
    toFarsiBool(value) {
      return value ? 'تایید شده' : 'عدم تایید'
    },
    farsiBoolClass(value) {
      return value ? 'success--text' : 'error--text'
    }
  },
  data() {
    return {
      btn_toggle: '',
      user: '',
      userVerify: '',
      snackBar: {
        normal: {show: false, msg: ''},
        success: {show: false, msg: ''},
        fail: {show: false, msg: ''}
      },
      clipped: false,
      drawer: false,
      fixed: false,
      user_drawer_items: [
        // {
        //   icon: 'mdi-chart-bubble',
        //   title: 'داشبورد',
        //   to: '/',
        //   items: [],
        // },
        // {
        //   icon: 'mdi-chart-bubble',
        //   title: 'حسابداری مالی',
        //   items: [{
        //     title: 'گزارش برداشت',
        //     to: '/wallets/withdraws'
        //   }, {
        //     title: 'گزارش واریز',
        //     to: '/wallets/deposits'
        //   }, {
        //     title: 'گزارش تراکنش ها',
        //     to: ''
        //   }],
        // },
        // {
        //   icon: 'mdi-chart-bubble',
        //   title: 'امنیت',
        //   to: '/Security',
        //   items: [],
        // },
        // {
        //   icon: 'mdi-chart-bubble',
        //   title: 'جوایز و تخفیف ها',
        //   to: '/coming-soon',
        //   items: [],
        // },
        // {
        //   icon: 'mdi-chart-bubble',
        //   title: 'تنظیمات',
        //   items: [{
        //     title: 'مدیریت API',
        //     to: '/coming-soon'
        //   }, {
        //     title: 'مدیریت اعلان ها',
        //     to: '/coming-soon'
        //   }],
        // },
        // {
        //   icon: 'mdi-chart-bubble',
        //   title: 'دعوت از دوستان',
        //   to: '/Referral',
        //   items: [],
        // },
        /*  {
            icon: 'mdi-chart-bubble',
            title: 'کیف پول',
            to: '/wallets',
            items: [],
          },
          {
            icon: 'mdi-chart-bubble',
            title: 'سفارشات',
            items: [{
              title: 'ثبت سفارش',
              to: '/offers/reg'
            }, {
              title: 'سفارشات در جریان',
              to: '/offers/active/me'
            }, {
              title: 'تاریخچه سفارشات',
              to: '/offers/me'
            }, {
              title: 'معاملات',
              to: '/trades/me'
            }],
          }*/
      ],
      admin_drawer_items: [
        {
          icon: 'mdi-chart-bubble',
          title: 'مدیریت پروفایل کاربران',
          to: '/Users'
        }, {
          icon: 'mdi-chart-bubble',
          title: 'مدیریت مالی کاربران',
          to: '/admin/transactions'
        }, {
          icon: 'mdi-chart-bubble',
          title: 'گزارش موجودی ها',
          to: '/admin/accounts'
        }, {
          icon: 'mdi-chart-bubble',
          title: 'پرداخت های رمزارزی',
          to: '/admin/payment/CryptoReport'
        }, {
          icon: 'mdi-chart-bubble',
          title: 'پرداخت های تومانی',
          to: '/admin/payment/TomanReport'
        }, {
          icon: 'mdi-chart-bubble',
          title: 'کارمزد برداشت ها',
          to: '/admin/withdraw-fee'
        }, {
          icon: 'mdi-chart-bubble',
          title: ' سطوح بهره برداری',
          to: '/admin/access'
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
    }
  },
  async mounted() {
    this.$bus.$on('snack', (msg, level) => {
      this.showErrorSnack(msg, level)
    })

    try {
      this.user = await this.$axios.$get('/profiles/me')
      this.$store.commit("auth/profile", this.user)
      if (this.isAdmin) {
        await this.$router.push('/Users')
      }
      this.userVerify = await this.$axios.$get('/profiles/me/verifies')
    } catch (e) {
    }
  },
  computed: {
    isAdmin() {
      return this.user.role === 'admin'
    },
    title() {
      return this.user.name
      // return this.user.name + '  ' + this.user.access_level
    },
    accessLevel() {
      return this.user.access_level
    },
    translateVerify() {
      return Object.keys(this.userVerify)
          .map((key) => ({
            name: this.$options.filters.verifyToFarsi(key),
            value: this.userVerify[key]
          }))
    }
  },
  methods: {
    async logout() {
      await this.$axios.$post('/logout')
      this.$store.commit('auth/logout')
      await this.$router.push('/login')
    },
    showErrorSnack(msg, level) {
      if (level === 'success') {
        this.snackBar.success.show = true
        this.snackBar.success.msg = msg
      } else if (level === 'error') {
        this.snackBar.fail.show = true
        this.snackBar.fail.msg = msg
      } else {
        this.snackBar.normal.show = true
        this.snackBar.normal.msg = msg
      }
    },
  }
}
</script>
