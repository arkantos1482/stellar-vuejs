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
            <v-list-item to="/Offers"> سفارشات</v-list-item>
            <v-list-item to="/ActiveOffers"> سفارشات در جریان</v-list-item>
          </v-list>
        </v-menu>
        <v-tab to="/Trades">معاملات</v-tab>
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
          <v-list-item to="/Users/me">پروفایل</v-list-item>
          <v-list-item to="/Security">امنیت</v-list-item>
          <v-list-item class="text-h6" @click="logout">خروج</v-list-item>
        </v-list>
      </v-menu>
      <v-btn text small>
        <v-icon color="grey darken-2">mdi-bell-outline</v-icon>
      </v-btn>
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
    this.snackBar.fail.msg = err.response.data.error.msg
    return false
  },
  data() {
    return {
      btn_toggle: '',
      user: '',
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
          title: 'مدیریت کاربران',
          to: '/Users'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'کارمزد برداشت ها',
          to: '/admin/withdraw-fee'
        }, {
          icon: 'mdi-chart-bubble',
          title: ' سطوح بهره برداری',
          to: '/admin/access'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'api test',
          to: '/admin/ApiTest'
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      // title: 'My Exchange'
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
