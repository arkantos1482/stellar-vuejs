<template>
  <div class="TVChartContainer" :id="containerId" />
</template>

<script>
import { widget } from "static/libs/charting_library"
import { UDFCompatibleDatafeed } from "static/libs/datafeeds/udf/lib/udf-compatible-datafeed"
// import datafeed from "../models/datafeed"

export default {
  name: "TVChartContainer",
  props: {
    symbol: {
      default: "BTCIRT",
      type: String,
    },
    interval: {
      default: "60",
      type: String,
    },
    containerId: {
      default: "tv_chart_container",
      type: String,
    },
    isReady: {
      default: false,
      type: Boolean,
    },
  },
  watch: {
    symbol(val) {
      if (this.isReady) {
        this.tvWidget.setSymbol(val, this.interval, null)
      }
    },
  },
  tvWidget: null,
  mounted() {
    const tvWidget = new widget({
      locale: "fa",
      // debug: true,
      symbol: this.symbol,
      // BEWARE: no trailing slash is expected in feed URL
      // datafeed: datafeed(this.$axios),
      datafeed: new UDFCompatibleDatafeed(
        "https://chart.nobitex.ir" + "/market/udf",
        60 * 1000
      ),
      interval: this.interval,
      container_id: this.containerId,
      library_path: "/libs/charting_library/",
      // preset:"mobile",
      theme: "Dark",
      timezone: "Asia/Tehran",
      // disabled_features: ['use_localstorage_for_settings'],
      // enabled_features: ['study_templates'],
      // charts_storage_url: 'https://saveload.tradingview.com',
      // charts_storage_api_version: '1.1',
      // client_id: 'tradingview.com,
      // user_id: 'public_user_id,
      fullscreen: false,
      autosize: true,
      // studies_overrides: 'this.studiesOverrides',
    })
    this.tvWidget = tvWidget

    tvWidget.onChartReady(() => {
      this.isReady = true
      tvWidget.headerReady().then(() => {
        // ------------------CREATE BTN SAMPLE---------------------
        // const button = tvWidget.createButton();
        //
        // button.setAttribute('title', 'Click to show a notification popup');
        // button.classList.add('apply-common-tooltip');
        //
        // button.addEventListener('click', () => tvWidget.showNoticeDialog({
        //   title: 'Notification',
        //   body: 'TradingView Charting Library API works correctly',
        //   callback: () => {
        //     // eslint-disable-next-line no-console
        //     console.log('Noticed!');
        //   },
        // }));
        //
        // button.innerHTML = 'Check API';
        //  ----------------------------------------------------------------
      })
    })
  },
  destroyed() {
    if (this.tvWidget !== null) {
      this.tvWidget.remove()
      this.tvWidget = null
    }
  },
}
</script>

<style lang="scss" scoped>
.TVChartContainer {
  //height: calc(100vh - 80px);
  height: 75vh;
}
</style>
