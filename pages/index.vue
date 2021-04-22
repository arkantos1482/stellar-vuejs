<template>
  <div>
    <a-row>
      <v-col v-for="item in [1,2,3,4,5,6,7,8]" cols="3">
        <CryptoMinMaxCard/>
      </v-col>
    </a-row>

    <a-row class="align-stretch">
      <!--      ACCOUNT-->
      <v-col cols="6">
        <v-card width="100%" height="100%" class="pa-6">
          <card-title-with-chevron icon="mdi-account" title="وضعیت حساب کاربری"/>
          <v-divider class="my-6"/>
          <RowItem title="برداشت روزانه ریال" value="۰از۰تومان"/>
          <RowItem title="برداشت روزانه ریال" value="۰از۰تومان"/>
          <RowItem title="برداشت روزانه ریال" value="۰از۰تومان"/>
          <RowItem title="برداشت روزانه ریال" value="۰از۰تومان"/>
          <RowItem title="برداشت روزانه ریال" value="۰از۰تومان"/>
          <RowItem title="برداشت روزانه ریال" value="۰از۰تومان"/>
          <RowItem title="برداشت روزانه ریال" value="۰از۰تومان"/>
          <v-divider class="my-6"/>
          <p class="primary--text">سطح کاربری:</p>
          <a-row class="justify-center">
            <v-icon>mdi-star</v-icon>
            <p class="mb-0 mx-4">سطح یک</p>
            <v-btn color="primary" outlined small class="px-4">ارتقا</v-btn>
          </a-row>
        </v-card>
      </v-col>

      <!--      WALLET-->
      <v-col cols="6">
        <v-card width="100%" height="100%" class="pa-6">
          <card-title-with-chevron icon="mdi-wallet" title="کیف پول های شما"/>
          <v-divider class="my-6"/>
          <RowItem title="برداشت روزانه ریال" value="۰از۰تومان"/>
          <RowItem title="برداشت روزانه ریال" value="۰از۰تومان"/>
          <RowItem title="برداشت روزانه ریال" value="۰از۰تومان"/>
          <RowItem title="برداشت روزانه ریال" value="۰از۰تومان"/>
          <RowItem title="برداشت روزانه ریال" value="۰از۰تومان"/>
          <RowItem title="برداشت روزانه ریال" value="۰از۰تومان"/>
          <RowItem title="برداشت روزانه ریال" value="۰از۰تومان"/>
          <v-divider class="my-6"/>
          <p class="primary--text">ارزش تخمینی دارایی ها:</p>
          <RowItem title="پیشنهادهای خرید" value="۱۲۳.۱۲۳.۱۲۳ تومان"/>
          <RowItem title="پیشنهادهای فروش" value="۱۲۳.۱۲۳.۱۲۳ تومان"/>
        </v-card>
      </v-col>
    </a-row>


    <a-row class="align-stretch">
      <v-col cols="6">
        <v-card width="100%" class="pa-6">
          <card-title-with-chevron icon="mdi-clipboard-text-play" title="سفارشات در جریان"/>
          <v-divider class="mt-6"/>
          <my-active-offers-table/>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card width="100%" class="pa-6">
          <card-title-with-chevron icon="mdi-clipboard-text" title="معاملات اخیر"/>
          <v-divider class="mt-6"/>
          <my-trades-table/>
        </v-card>
      </v-col>
    </a-row>
  </div>
</template>

<script>
import RowItem from "@/components/RowItem";
import DashboardCardTitle from "@/components/CardTitleWithChevron";
import MyTrades from "@/pages/trades/_userId";

export default {
  name: "index",
  components: {MyTrades, DashboardCardTitle, RowItem}
}
</script>
