import vuex from 'vuex'
import Vue from "vue";

import administrationModule from './modules/adminstration/index'
import backofficeModule from './modules/pf/backoffice/index'
import jobModule from './modules/pf/job/index'
import employeeModule from './modules/pf/employee/index'
import loanModule from './modules/pf/loan/index'
import transferInModule from './modules/pf/transferin/index'
import transferOutModule from './modules/pf/transferout/index'
import settlementModule from './modules/pf/settlement/index'
import userModule from './modules/adminstration/user/index'
import contributionModule from './modules/pf/contribution/index'
import dashboardModule from './modules/pf/dashboard/index'
import yearEndModule from './modules/pf/yearend/index'
import tenantModule from './modules/adminstration/tenant/index'
import CustomerModule from './modules/pf/customerservice/index'
import siteAuditModule from './modules/pf/siteauditor/index'
import HpcModule from './modules/pf/hpcservice/index'
import CalculationModule from './modules/pf/calculation/index'

Vue.use(vuex)

const modules = {
    administrationModule,
    backofficeModule,
    jobModule,
    employeeModule,
    loanModule,
    transferInModule,
    transferOutModule,
    settlementModule,
    userModule,
    contributionModule,
    dashboardModule,
    yearEndModule,
    tenantModule,
    CustomerModule,
    HpcModule,
    siteAuditModule,
    CalculationModule
}

export default new vuex.Store({
    modules
})