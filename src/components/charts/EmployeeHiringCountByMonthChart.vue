<template>
  <highcharts class="hc" :options="chartOptions" ref="hiringChart"></highcharts>
</template>

<script>
import Highcharts from 'highcharts'
import exportingInit from 'highcharts/modules/exporting'
import drilldown from 'highcharts/modules/drilldown'

exportingInit(Highcharts)

drilldown(Highcharts)

export default {
  name: "EmployeeHiringCountByMonthChart",
  props: ["seriesProp", "loadingProp", "pointStartDateProp", "titleProp", "yAxisTitle", "xAxisTitle",
    "pointIntervalUnit", "xAxisType"],
  data() {
    return {

    }
  },
  computed: {
    chartOptions() {
      return {
        title: {
          text: this.titleProp
        },
        xAxis: {
          title: {
            text: this.xAxisTitle
          },
          type: this.xAxisType
        },
        yAxis: {
          title: {
            text: this.yAxisTitle
          }
        },
        plotOptions: {
          series: {
            pointStart: this.pointStartDateProp,
            pointIntervalUnit: this.pointIntervalUnit
          }
        },
        series: [{
          name: "Employees",
          colorByPoint: true,
          data: this.seriesProp
        }],
        legend: {
          enabled: false
        },
      }
    }
  },
  watch: {
    loadingProp(){
      if(this.loadingProp){
        this.$refs.hiringChart.chart.showLoading()
      }else {
        this.$refs.hiringChart.chart.hideLoading()
      }
    }
  },
  mounted() {
    window.dispatchEvent(new Event('resize'));
  }
}
</script>

<style scoped>

</style>