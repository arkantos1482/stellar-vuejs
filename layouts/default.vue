<template>
  <v-app>
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
      <v-app-bar-nav-icon v-show="isAdmin" @click.stop="drawer = !drawer"/>
      <v-tabs>
        <v-tab to="/OffersBook">ثبت سفارش</v-tab>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-tab v-bind="attrs" v-on="on"> کیف پول</v-tab>
          </template>
          <v-list>
            <v-list-item to="/Wallets">کیف پول</v-list-item>
            <v-list-item to="/Deposits"> واریزها</v-list-item>
            <v-list-item to="/Withdraws"> برداشت ها</v-list-item>
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
          <v-btn text v-bind="attrs" v-on="on">{{ title }}
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/Users/me">پروفایل</v-list-item>
          <v-list-item to="/Security">امنیت</v-list-item>
          <v-list-item @click="logout">خروج</v-list-item>
        </v-list>
      </v-menu>
      <v-btn text small>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt/>
      </v-container>
      <v-snackbar v-model="snackBar.show">{{ snackBar.msg }}</v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
export default {
  errorCaptured(err, vm, info) {
    this.snackBar.show = true
    this.snackBar.msg = err.message
    return false
  },
  data() {
    return {
      btn_toggle: '',
      user: '',
      snackBar: {show: false, msg: ''},
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-chart-bubble',
          title: 'داشبورد',
          to: '/'
        }, {
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
    try {
      this.user = await this.$axios.$get('/profiles/me')
      this.$store.commit("auth/profile", this.user)
    } catch (e) {
    }
  },
  computed: {
    isAdmin() {
      return this.user.role === 'admin'
    },
    title() {
      return this.user.name
    }
  },
  methods: {
    async logout() {
      await this.$axios.$post('/logout')
      this.$store.commit('auth/logout')
      await this.$router.push('/login')
    }
  }
}
</script>
