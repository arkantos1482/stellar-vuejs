<template>
  <v-app>
    <v-navigation-drawer v-model="drawer"
                         fixed right app>
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
    <v-app-bar :clipped-left="clipped"
               fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-spacer/>
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
      user: '',
      snackBar: {show: false, msg: ''},
      clipped: false,
      drawer: false,
      fixed: false,
      userItems: [
        {
          icon: 'mdi-chart-bubble',
          title: 'داشبورد',
          to: '/'
        }, {
          icon: 'mdi-chart-bubble',
          title: 'پروفایل',
          to: '/Users/me'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'کیف های من',
          to: '/Wallets'
        }, {
          icon: 'mdi-chart-bubble',
          title: 'واریزها',
          to: '/Deposits'
        }, {
          icon: 'mdi-chart-bubble',
          title: 'برداشت ها',
          to: '/Withdraws'
        }, {
          icon: 'mdi-chart-bubble',
          title: 'ثبت سفارش (پیشخوان)',
          to: '/OffersBook'
        }, {
          icon: 'mdi-chart-bubble',
          title: 'سفارشات باز',
          to: '/ActiveOffers'
        }, {
          icon: 'mdi-chart-bubble',
          title: 'سفارشات',
          to: '/Offers'
        }, {
          icon: 'mdi-chart-bubble',
          title: 'معاملات',
          to: '/Trades'
        }, {
          icon: 'mdi-chart-bubble',
          title: 'api test',
          to: '/admin/ApiTest'
        },
      ],
      adminItems: [
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
    items() {
      return this.user.role === 'admin'
          ? this.adminItems
          : this.userItems
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
