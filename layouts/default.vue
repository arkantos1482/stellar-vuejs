<template>
  <v-app class="text-right">
    <v-navigation-drawer v-show="isAdmin" v-model="drawer" fixed right app>
      <v-list>
        <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="item.to"
            router
            exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"/>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-img max-width="128" max-height="48"
             :src="require('../assets/images/logo.png')"/>
      <v-app-bar-nav-icon v-show="isAdmin" @click.stop="drawer = !drawer"/>
      <v-tabs v-show="!isAdmin">
        <v-tab to="/">ثبت سفارش</v-tab>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-tab v-bind="attrs" v-on="on"> کیف پول</v-tab>
          </template>
          <v-list>
            <v-list-item to="/wallets">کیف پول</v-list-item>
            <v-list-item to="/wallets/deposits"> واریزها</v-list-item>
            <v-list-item to="/wallets/withdraws"> برداشت ها</v-list-item>
          </v-list>
        </v-menu>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-tab v-bind="attrs" v-on="on"> سفارشات</v-tab>
          </template>
          <v-list>
            <v-list-item to="/offers/me"> سفارشات</v-list-item>
            <v-list-item to="/offers/active/me"> سفارشات در جریان</v-list-item>
          </v-list>
        </v-menu>
        <v-tab to="/trades/me">معاملات</v-tab>
        <v-tab to="/Referral">دعوت از دوستان</v-tab>
      </v-tabs>
      <!--      <v-spacer/>-->
      <v-menu>
        <template v-slot:activator="{on,attrs}">
          <v-btn class="grey--text text--darken-2" text v-bind="attrs" v-on="on">{{ title }}
            <v-icon>mdi-account-outline</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/users/me">پروفایل</v-list-item>
          <v-list-item to="/Security">امنیت</v-list-item>
          <v-list-item class="text-h6" @click="logout">خروج</v-list-item>
        </v-list>
      </v-menu>
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
      items: [
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
