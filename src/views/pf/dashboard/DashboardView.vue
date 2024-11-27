<template>
  <v-container fluid>
    <v-row v-if="employeeCountByStatuses.length > 0 || employeeHiringCountByMonth.length > 0 || contributionByMonth.length > 0">
      <v-col cols="4">
        <v-card class="chart-wrapper" v-show="employeeCountByStatuses.length > 0">
          <employee-count-by-status-chart :series-prop="employeeCountByStatuses"
                                          :loading-prop="employeeChartsLoading" />
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card v-show="employeeHiringCountByMonth.length > 0">
          <employee-hiring-count-by-month-chart :loading-prop="employeeChartsLoading"
          :series-prop="employeeHiringCountByMonth" title-prop="Last 12 Month Employee Hiring"
                                                y-axis-title="Employee Count"
                                                x-axis-title="Months"
                                                x-axis-type="datetime"
                                                point-interval-unit="month"
          :point-start-date-prop="employeeHiringCountStartPoint"/>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card v-show="contributionByMonth.length > 0">
          <employee-hiring-count-by-month-chart :loading-prop="employeeChartsLoading"
                                                :series-prop="contributionByMonth" title-prop="Last 12 Month Contributions"
                                                y-axis-title="Total Contributions"
                                                x-axis-title="Months"
                                                x-axis-type="datetime"
                                                point-interval-unit="month"
                                                :point-start-date-prop="contributionStartPoint"/>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <h1>Dashboard</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>


import EmployeeCountByStatusChart from "@/components/charts/EmployeeCountByStatusChart";
import EmployeeHiringCountByMonthChart from "@/components/charts/EmployeeHiringCountByMonthChart";

export default {
  name: "DashboardView",
  components: {
    employeeCountByStatusChart: EmployeeCountByStatusChart,
    employeeHiringCountByMonthChart: EmployeeHiringCountByMonthChart
  },
  data () {
    return {
      employeeCountByStatuses: [],
      employeeChartsLoading: false,
      employeeHiringCountByMonth: [],
      employeeHiringCountStartPoint: null,
      contributionByMonth: [],
      contributionStartPoint: null
    }
  },
  mounted() {
    this.employeeChartsLoading = true
    this.$store.dispatch("dashboardModule/fetchEmployeesCount")
        .then(response => {
          if(response){

            if(response.employeeCountByStatuses.length > 0){
              this.employeeCountByStatuses = response.employeeCountByStatuses.map((data) => {
                return {
                  name: data.name,
                  y: data.count
                }
              });
            }

            let employeeHiringCount = response.employeeHiringCountByMonths;

            if(employeeHiringCount.length > 0){
              this.employeeHiringCountStartPoint = Date.UTC(employeeHiringCount[0].year,
                  employeeHiringCount[0].month - 1)

              this.employeeHiringCountByMonth = employeeHiringCount.map((data) => data.count);
            }

            let contributionByMonth = response.contributionByMonths;

            if(contributionByMonth.length > 0){
              this.contributionStartPoint = Date.UTC(contributionByMonth[0].year, contributionByMonth[0].month-1)

              this.contributionByMonth = contributionByMonth.map(data => data.contribution)
            }

            this.employeeChartsLoading = false
          }
        })
        .catch(error => console.log(error))
  }
}
</script>

<style scoped>

</style>