import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/pf/HomeView.vue'
import LoginView from "@/views/administration/login/LoginView";

import store from "@/store/store";
import AccountView from "@/views/administration/account/AccountView";
import ProfileView from "@/views/administration/account/views/ProfileView";
import EditProfileView from "@/views/administration/account/views/EditProfileView";
import ChangePasswordView from "@/views/administration/account/views/ChangePasswordView";
import DashboardView from "@/views/pf/dashboard/DashboardView";
import EmployeeView from "@/views/pf/employee/EmployeeView";
import ContributionView from "@/views/pf/contribution/ContributionView";
import LoanView from "@/views/pf/loan/LoanView";
import BackOfficeView from "@/views/pf/back-office/BackOfficeView";
import UnitCodeView from "@/views/pf/back-office/views/UnitCodeView";
import InterestRateView from "@/views/pf/back-office/views/InterestRateView";
import JobView from "@/views/pf/job/JobView";
import FetchEmployeeJobView from "@/views/pf/job/views/FetchEmployeeJobView";
import FetchLoanJobView from "@/views/pf/job/views/FetchLoanJobView";
import FetchTransferInJobView from "@/views/pf/job/views/FetchTransferInJobView";
import FetchSettlementJobView from "@/views/pf/job/views/FetchSettlementJobView";
import FetchContributionJobView from "@/views/pf/job/views/FetchContributionJobView";
import SearchEmployee from "@/views/pf/employee/views/SearchEmployee";
import SearchLoan from "@/views/pf/loan/views/SearchLoan";
import TransferInView from "@/views/pf/transferin/TransferInView";
import SearchTransferIn from "@/views/pf/transferin/views/SearchTransferIn";
import TransferOutView from "@/views/pf/transferout/TransferOutView";
import SearchTransferOut from "@/views/pf/transferout/views/SearchTransferOut";
import SettlementView from "@/views/pf/settlement/SettlementView";
import SearchSettlement from "@/views/pf/settlement/views/SearchSettlement";
import NotFoundView from "@/views/NotFoundView";
import UserView from "@/views/administration/user/UserView";
import CreateUser from "@/views/administration/user/CreateUser";
import VerifyUserView from "@/views/administration/login/VerifyUserView";
import HireEmployee from "@/views/pf/employee/views/HireEmployee";
import HireNewEmployees from "@/views/pf/employee/views/HireNewEmployees";
import SearchContribution from "@/views/pf/contribution/views/SearchContribution";
import MonthlyStatusProcess from "@/views/pf/employee/views/MonthlyStatusProcess";
import EmployeeDetails from "@/views/pf/employee/views/EmployeeDetails";
import LoanDetails from "@/views/pf/loan/views/LoanDetails";
import TransferInDetails from "@/views/pf/transferin/views/TransferInDetails";
import TransferOutDetails from "@/views/pf/transferout/views/TransferOutDetails";
import SettlementDetails from "@/views/pf/settlement/views/SettlementDetails";
import YearEndProcessView from "@/views/pf/yearend/YearEndProcessView";
import YearEndProcessForLoan from "@/views/pf/yearend/views/YearEndProcessForLoan";
import YearEndProcessForSettlement from "@/views/pf/yearend/views/YearEndProcessForSettlement";
import SendEmailForTransferIn from "@/views/pf/transferin/views/SendEmailForTransferIn";
import CreateTransferIn from "@/views/pf/transferin/views/CreateTransferIn";
import UpdateTransferIn from "@/views/pf/transferin/views/UpdateTransferIn";
import SearchLog from "@/views/administration/account/views/SearchLog";
import SendEmailForSettlement from "@/views/pf/settlement/views/SendEmailForSettlement";
import SendEmailForTransferOut from "@/views/pf/transferout/views/SendEmailForTransferOut";
import CreateSettlement from "@/views/pf/settlement/views/CreateSettlement";
import CreateTransferOut from "@/views/pf/transferout/views/CreateTransferOut";
import UpdateSettlement from "@/views/pf/settlement/views/UpdateSettlement";
import UpdateTransferOut from "@/views/pf/transferout/views/UpdateTransferOut";
import CreateLoan from "@/views/pf/loan/views/CreateLoan";
import UpdateLoan from "@/views/pf/loan/views/UpdateLoan";
import SendEmailForLoan from "@/views/pf/loan/views/SendEmailForLoan";
import TenantDetails from "@/views/administration/tenant/TenantDetails";
import TenantImages from "@/views/administration/tenant/TenantImages";
import TenantEmailDesigns from "@/views/administration/tenant/TenantEmailDesigns";
import TenantPdfDesigns from "@/views/administration/tenant/TenantPdfDesigns";

import ProcessLoanJob from "@/views/pf/loan/views/ProcessLoanJob";
import existingLoan from "@/views/pf/loan/views/ExistingLoan.vue";
import GenerateBankSheetForTransferOut from "@/views/pf/transferout/views/GenerateBankSheetForTransferOut";
import GenerateBankSheet from "@/views/pf/settlement/views/GenerateBankSheet";
import CustomerServiceDashboard from "@/views/pf/customerservice/CustomerServiceDashboard";
import CustomerServiceHome from "@/views/pf/customerservice/CustomerServiceHome";
import Last5YrContribution from "@/views/pf/customerservice/Last5YrContribution";
import ManualCalculator from "@/views/pf/customerservice/ManualCalculator"
import ServiceSummary from "@/views/pf/customerservice/ServiceSummary"
import MonthlyCorpus from "@/views/pf/customerservice/MonthlyCorpus"
import CreateMWDFile from "@/views/pf/customerservice/CreateMWDFile"
import CreateManualMWDFile from "@/views/pf/customerservice/CreateManualMWDFile";
import CorpusSummary from "@/views/pf/customerservice/CorpusSummary";
import SiteAuditorView from "@/views/pf/siteauditor/SiteAuditorView";
import SearchSiteAudits from "@/views/pf/siteauditor/views/SearchSiteAudits";
import CorpusReport from "@/views/pf/customerservice/CorpusReport"

import HpcCreateMWDFile from "@/views/pf/hpcservice/HpcCreateMWDFile";
import CreateSiteAudits from "@/views/pf/siteauditor/views/CreateSiteAudits";
import Create7PsAnd8Ps from "@/views/pf/customerservice/Create7PsAnd8Ps";
import Calculator from "@/views/pf/calculation/Calculator";
// HpcCreateMWDFile.vue
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardView,
        beforeEnter: (to, from, next) => {
          can("DASHBOARD", null, next)
        }
      },
      {
        path: 'employees',
        id: 'EMPLOYEE',
        component: EmployeeView,
        children: [
          {
            path: '',
            name: 'search',
            component: SearchEmployee,
            beforeEnter: (to, from, next) => {
              can("EMPLOYEE", "SEARCH_EMPLOYEES", next)
            }
          },
          {
            path: 'hire',
            name: 'hire',
            component: HireNewEmployees,
            beforeEnter: (to, from, next) => {
              can("EMPLOYEE", "HIRE_NEW_EMPLOYEES", next)
            }
          },
          {
            path: 'hire/new',
            name: 'newHiring',
            component: HireEmployee,
            beforeEnter: (to, from, next) => {
              can("EMPLOYEE", "HIRE_NEW_EMPLOYEES", next)
            }
          },
          {
            path: 'monthly-status-process',
            name: 'monthly-status-process',
            component: MonthlyStatusProcess,
            beforeEnter: (to, from, next) => {
              can("EMPLOYEE", "MONTHLY_STATUS_PROCESS", next)
            }
          },
          {
            path: 'details/:entityId',
            name: 'details',
            component: EmployeeDetails,
            beforeEnter: (to, from, next) => {
              can("EMPLOYEE", "SEARCH_EMPLOYEES", next)
            }
          }
        ]
      },
      {
        path: 'calculation-service',
        id: 'CALCULATION_SERVICE',
        component: Calculator,
      },
      {
        path: '/hpc-service',
        id: 'HPC_SERVICE',
        component:  HpcCreateMWDFile,
      },
      {
        path: 'customer-service/employee-search',
        id: 'CUSTOMER_SERVICE',
        component:  CustomerServiceHome,
      },
      {
        path: 'customer-service/generate-mwd',
        id: 'CUSTOMER_SERVICE',
        component:  CreateMWDFile,
      },
      {
        path: 'customer-service/monthly-details',
        id: 'CUSTOMER_SERVICE',
        component: CustomerServiceDashboard,
      },
      {
        path: 'customer-service/sixty-month-contribution',
        id: 'CUSTOMER_SERVICE',
        component: Last5YrContribution,
      },
      {
        path: 'customer-service/manual-calculator',
        id: 'CUSTOMER_SERVICE',
        component: ManualCalculator,
      },
      {
        path: 'customer-service/service-summary',
        id: 'CUSTOMER_SERVICE',
        component: ServiceSummary,
      },
      {
        path: 'customer-service/corpus-summary',
        id: 'CUSTOMER_SERVICE',
        component: CorpusSummary
      },
      {
        path: 'customer-service/monthly-corpus',
        id: 'CUSTOMER_SERVICE',
        component: MonthlyCorpus,
      },
      {
        path: 'customer-service/generate-7ps-8ps',
        id: 'CUSTOMER_SERVICE',
        component:  Create7PsAnd8Ps,
      },
      {
        path: 'mwd-service',
        id: 'MWD_SERVICE',
        component: CreateManualMWDFile
      },
      {
        path: 'mwd-service/manual-calculator',
        id: 'MWD_SERVICE',
        component: ManualCalculator,
      },
      {
        path: 'customer-service/corpus-report',
        id: 'CUSTOMER_SERVICE',
        component: CorpusReport
      },
      {
        path: 'contributions',
        id: 'CONTRIBUTION',
        component: ContributionView,
        children: [
          {
            path: '',
            name: 'search-contributions',
            component: SearchContribution,
            beforeEnter: (to, from, next) => {
              can("CONTRIBUTION", "CONTRIBUTIONS", next)
            }
          }
        ]
      },
      {
        path: 'loans',
        id: 'LOAN',
        component: LoanView,
        children: [
          {
            path: '',
            name: 'search',
            component: SearchLoan,
            beforeEnter: (to, from, next) => {
              can("LOAN", "SEARCH_LOANS", next)
            }
          },
          {
            path: 'loan-types',
            name: 'List',
            component: existingLoan,
            beforeEnter: (to, from, next) => {
              can("LOAN", "SEARCH_LOANS", next)
            }
          },
          {
            path: 'details/:entityId',
            name: 'loanDetails',
            component: LoanDetails,
            beforeEnter: (to, from, next) => {
              can("LOAN", "SEARCH_LOANS", next)
            }
          },
          {
            path: 'create',
            name: 'createLoan',
            component: CreateLoan,
            beforeEnter: (to, from, next) => {
              can("LOAN", "CREATE_LOANS", next)
            }
          },
          {
            path: ':entityId/update',
            name: 'updateLoan',
            component: UpdateLoan,
            beforeEnter: (to, from, next) => {
              can("LOAN", "CREATE_LOANS", next)
            }
          },
          {
            path: 'send-emails',
            name: 'sendEmails',
            component: SendEmailForLoan,
            beforeEnter: (to, from, next) => {
              can("LOAN", "SEND_EMAILS", next)
            }
          },
          {
            path: 'process-loans',
            name: 'processLoans',
            component: ProcessLoanJob,
            beforeEnter: (to, from, next) => {
              can("LOAN", "CREATE_LOANS", next)
            }
          },
        ]
      },
      {
        path: 'transfer-ins',
        id: 'TRANSFER_IN',
        component: TransferInView,
        children: [
          {
            path: '',
            name: 'search',
            component: SearchTransferIn,
            beforeEnter: (to, from, next) => {
              can("TRANSFER_IN", "SEARCH_TRANSFER_IN", next)
            }
          },
          {
            path: 'details/:entityId',
            name: 'transferInDetails',
            component: TransferInDetails,
            beforeEnter: (to, from, next) => {
              can("TRANSFER_IN", "SEARCH_TRANSFER_IN", next)
            }
          },
          {
            path: 'send-emails',
            name: 'sendEmails',
            component: SendEmailForTransferIn,
            beforeEnter: (to, from, next) => {
              can("TRANSFER_IN", "SEND_EMAILS", next)
            }
          },
          {
            path: 'create',
            name: "createTransferIn",
            component: CreateTransferIn,
            beforeEnter: (to, from, next) => {
              can("TRANSFER_IN", "CREATE_TRANSFER_IN", next)
            }
          },
          {
            path: ':entityId/update',
            name: 'updateTransferIn',
            component: UpdateTransferIn,
            beforeEnter: (to, from, next) => {
              can("TRANSFER_IN", "CREATE_TRANSFER_IN", next)
            }
          }
        ]
      },
      {
        path: 'transfer-outs',
        id: 'TRANSFER_OUT',
        component: TransferOutView,
        children: [
          {
            path: '',
            name: 'search',
            component: SearchTransferOut,
            beforeEnter: (to, from, next) => {
              can("TRANSFER_OUT", "SEARCH_TRANSFER_OUT", next)
            }
          },
          {
            path: 'details/:entityId',
            name: 'transferOutDetails',
            component: TransferOutDetails,
            beforeEnter: (to, from, next) => {
              can("TRANSFER_OUT", "SEARCH_TRANSFER_OUT", next)
            }
          },
          {
            path: 'send-emails',
            name: 'sendEmails',
            component: SendEmailForTransferOut,
            beforeEnter: (to, from, next) => {
              can("TRANSFER_OUT", "SEND_EMAILS", next)
            }
          },
          {
            path: 'create',
            name: 'createTransferOut',
            component: CreateTransferOut,
            beforeEnter: (to, from, next) => {
              can("TRANSFER_OUT", "CREATE_TRANSFER_OUT", next)
            }
          },
          {
            path: ':entityId/update',
            name: 'transferOutUpdate',
            component: UpdateTransferOut,
            beforeEnter: (to, from, next) => {
              can("TRANSFER_OUT", "CREATE_TRANSFER_OUT", next)
            }
          },
          {
            path: 'generate-bank-sheet',
            name: 'generateBankSheetForTransferOut',
            component: GenerateBankSheetForTransferOut,
            beforeEnter: (to, from, next) => {
              can("SETTLEMENT", "CREATE_SETTLEMENTS", next)
            }
          },
        ]
      },
      {
        path: 'settlements',
        id: 'SETTLEMENT',
        component: SettlementView,
        children: [
          {
            path: '',
            name: 'search',
            component: SearchSettlement,
            beforeEnter: (to, from, next) => {
              can("SETTLEMENT", "SEARCH_SETTLEMENTS", next)
            }
          },
          {
            path: 'details/:entityId',
            name: 'settlementDetails',
            component: SettlementDetails,
            beforeEnter: (to, from, next) => {
              can("SETTLEMENT", "SEARCH_SETTLEMENTS", next)
            }
          },
          {
            path: 'send-emails',
            name: 'sendEmails',
            component: SendEmailForSettlement,
            beforeEnter: (to, from, next) => {
              can("SETTLEMENT", "SEND_EMAILS", next)
            }
          },
          {
            path: 'create',
            name: 'createSettlement',
            component: CreateSettlement,
            beforeEnter: (to, from, next) => {
              can("SETTLEMENT", "CREATE_SETTLEMENTS", next)
            }
          },
          {
            path: ':entityId/update',
            name: 'updateSettlement',
            component: UpdateSettlement,
            beforeEnter: (to, from, next) => {
              can("SETTLEMENT", "CREATE_SETTLEMENTS", next)
            }
          },
          {
            path: 'generate-bank-sheet',
            name: 'generateBankSheetForSettlement',
            component: GenerateBankSheet,
            beforeEnter: (to, from, next) => {
              can("SETTLEMENT", "CREATE_SETTLEMENTS", next)
            }
          },
        ]
      },
      {
        path: 'back-office',
        id: 'BACK_OFFICE',
        component: BackOfficeView,
        children: [
          {
            path: 'unitcodes',
            name: 'unitcodes',
            component: UnitCodeView,
            beforeEnter: (to, from, next) => {
              can("BACK_OFFICE", "UNIT_CODES", next)
            }
          },
          {
            path: 'interest-rates',
            name: 'interestRates',
            component: InterestRateView,
            beforeEnter: (to, from, next) => {
              can("BACK_OFFICE", "INTEREST_RATES", next)
            }
          }
        ]
      },
      {
        path: 'jobs',
        id: 'JOBS',
        component: JobView,
        children: [
          {
            path: 'fetch-employees',
            name: 'fetchEmployees',
            component: FetchEmployeeJobView,
            beforeEnter: (to, from, next) => {
              can("JOBS", "FETCH_EMPLOYEES", next)
            }
          },
          {
            path: 'fetch-contributions',
            name: 'fetchContributions',
            component: FetchContributionJobView,
            beforeEnter: (to, from, next) => {
              can("JOBS", "FETCH_CONTRIBUTIONS", next)
            }
          },
          {
            path: 'fetch-loans',
            name: 'fetchLoans',
            component: FetchLoanJobView,
            beforeEnter: (to, from, next) => {
              can("JOBS", "FETCH_LOANS", next)
            }
          },
          {
            path: 'fetch-transfer-in',
            name: 'fetchTransferIns',
            component: FetchTransferInJobView,
            beforeEnter: (to, from, next) => {
              can("JOBS", "FETCH_TRANSFER_INS", next)
            }
          },
          {
            path: 'fetch-settlements',
            name: 'fetchSettlement',
            component: FetchSettlementJobView,
            beforeEnter: (to, from, next) => {
              can("JOBS", "FETCH_SETTLEMENTS", next)
            }
          }
        ]
      },
      {
        path: 'year-end-process',
        id: 'YEAR_END_PROCESS',
        component: YearEndProcessView,
        children: [
          {
            path: 'loan',
            name: 'yearEndProcessForLoan',
            component: YearEndProcessForLoan,
            beforeEnter: (to, from, next) => {
              can("YEAR_END_PROCESS", "FOR_LOAN", next)
            }
          },
          {
            path: 'settlement',
            name: 'yearEndProcessForSettlement',
            component: YearEndProcessForSettlement,
            beforeEnter: (to, from, next) => {
              can("YEAR_END_PROCESS", "FOR_SETTLEMENT", next)
            }
          }
        ]
      },
      {
        path: 'site-audit-service',
        id: 'SITE_AUDIT_SERVICE',
        component: SiteAuditorView,
        children: [
          {
            path: '',
            name: 'search-audits',
            component: SearchSiteAudits,
          },
          {
            path: 'create',
            name: 'create-audits',
            component: CreateSiteAudits
          }
        ]
      }
    ],
    redirect: () => {
      return "/dashboard"
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    beforeEnter: (to, from, next) => {
      store.commit("administrationModule/logout")
      next()
    }
  },
  {
    path: '/verify',
    name: 'verify',
    component: VerifyUserView
  },
  {
    path: '/accounts',
    id: 'ACCOUNT',
    component: AccountView,
    children: [
      {
        path: '',
        name: 'profile',
        component: ProfileView,
        beforeEnter: (to, from, next) => {
          can("ACCOUNT", "PROFILE", next)
        }
      },
      {
        path: 'edit',
        name: 'editProfile',
        component: EditProfileView,
        beforeEnter: (to, from, next) => {
          can("ACCOUNT", "EDIT PROFILE", next)
        }
      },
      {
        path: 'change-password',
        name: 'changePassword',
        component: ChangePasswordView,
        beforeEnter: (to, from, next) => {
          can("ACCOUNT", "CHANGE PASSWORD", next)
        }
      },
      {
        path: 'users',
        name: 'users',
        component: UserView,
        beforeEnter: (to, from, next) => {
          can("USERS", "USERS", next)
        }
      },
      {
        path: 'users/create',
        name: 'createUser',
        component: CreateUser,
        beforeEnter: (to, from, next) => {
          can("USERS", "CREATE_USERS", next)
        }
      },
      {
        path: 'logs',
        name: 'logs',
        component: SearchLog,
        beforeEnter: (to, from, next) => {
          can("ACTIVITY_LOGS", null, next)
        }
      },
      {
        path: 'tenant/details',
        name: 'tenantDetails',
        component: TenantDetails,
        beforeEnter: (to, from, next) => {
          can("TENANTS", "TENANT_DETAILS", next)
        }
      },
      {
        path: 'tenant/images',
        name: 'tenantImages',
        component: TenantImages,
        beforeEnter: (to, from, next) => {
          can("TENANTS", "TENANT_IMAGES", next)
        }
      },
      {
        path: 'tenant/email-designs',
        name: 'tenantEmailDesigns',
        component: TenantEmailDesigns,
        beforeEnter: (to, from, next) => {
          can("TENANTS", "TENANT_EMAIL_DESIGNS", next)
        }
      },
      {
        path: 'tenant/pdf-designs',
        name: 'TenantPdfDesigns',
        component: TenantPdfDesigns,
        beforeEnter: (to, from, next) => {
          can("TENANTS", "TENANT_PDF_DESIGNS", next)
        }
      }
    ]
  },
  {
    path: '/logout',
    name: 'logout',
    redirect: () => {
      store.commit("administrationModule/logout")
      return "/login"
    }
  },
  {
    path: '/not-found',
    name: 'notFound',
    component: NotFoundView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {

  let accessToken = localStorage.getItem("x-access-token");
  let refreshToken = localStorage.getItem("x-refresh-token")

  if(!store.state.administrationModule.user.isLoggedIn
      && (accessToken !== null && accessToken !== undefined && accessToken.trim().length > 0)
      && (refreshToken !== null && refreshToken !== undefined && refreshToken.trim().length > 0)){
    store.commit("administrationModule/setUserAccessToken", {
      tokens: {
        "x-access-token": accessToken,
        "x-refresh-token": refreshToken
      }
    })
  }

  if(!store.state.administrationModule.user.isLoggedIn && (to.name !== 'login' && to.name !== 'verify')){
    next({name: 'login'})
  }else {
    next()
  }

})

function can(name, sub, next){
  store.dispatch("administrationModule/validatePermission", {name: name, sub: sub})
      .then(() => {
        console.log("success")
        next()
      })
      .catch(error => {
        if(error === 404){
          next({name: 'notFound'})
        }else {
          next({name: 'login'})
        }
      })
}

export default router
