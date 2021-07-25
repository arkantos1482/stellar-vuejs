<script>
import {Doughnut} from "vue-chartjs";

export default {
  extends: Doughnut,
  name: "WalletDoughnut",
  props: {
    chartData: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.options)
  },
  watch: {
    chartData(val) {
      this.renderChart(val, this.options)
    }
  }
}
</script>

<style scoped>

</style>