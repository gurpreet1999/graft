/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
import SearchCandidates from "layouts/pages/search-candidates";
import JobsRecruiter from "layouts/pages/jobs-recruiter";
import UserManagement from "layouts/pages/UserManagement";
import AdminLogin from "layouts/authentication/adminLogin/adminLogin";
import AdminConfirm from "layouts/authentication/adminLogin/adminConfirm";
import PricingPlans from "layouts/pages/account/settings/components/Billing/components/PricingPlans";
import CampaignHistory from "layouts/pages/campaign-history";
import Invoices from "layouts/pages/invoices";
import DashboardRecruiter from "layouts/pages/dasboard-recruiter";
import AdminDashboard from "layouts/pages/dashboard-admin";
import AdminProfile from "layouts/pages/admin-profile";
import Payment from "layouts/authentication/sign-up/components/NewRecrutier/Payment";
import GetAccess from "layouts/authentication/sign-up/components/NewRecrutier/GetAccess";
import Declined from "layouts/authentication/sign-up/components/NewRecrutier/Declined";
import PaymentGetAccess from "layouts/authentication/sign-up/components/NewRecrutier/GetAccess/PaymentGetAccess";
import PaymentDeclined from "layouts/authentication/sign-up/components/NewRecrutier/Declined/PaymentDeclined";
import Jobs from "./layouts/pages/Jobs";
import ProfileOverview from "./layouts/pages/profile/profile-overview";
import ProfileRecriuter from "./layouts/pages/profile-recruiter";
import SignInIllustration from "./layouts/authentication/sign-up";
import LoginIllustration from "./layouts/authentication/login";
import ForgotPassword from "./layouts/authentication/forgot-password";
import dashboardIcon from "./assets/images/icons/header/dashboard.svg";
import jobsIcon from "./assets/images/icons/header/jobs.svg";
import logoutIcon from "./assets/images/icons/header/logout.svg";
import searchIcon from "./assets/images/icons/header/search.svg";
import usersIcon from "./assets/images/icons/header/users.svg";
import invoices from "./assets/images/icons/header/invoices.svg";
import history from "./assets/images/icons/header/history.png";
import settingsIcon from "./assets/images/icons/header/setting.svg";

const routes = [
  {
    type: "profile",
    name: "User management",
    key: "user-management",
    noCollapse: true,
    route: "admin/profile",
    component: AdminProfile,
    private: false,
    role: "admin",
  },
  {
    type: "singleRoute",
    name: "Dashboard",
    key: "dashboard",
    icon: dashboardIcon,
    noCollapse: true,
    route: "admin/dashboard",
    component: AdminDashboard,
    private: false,
    role: "admin",
  },
  {
    type: "singleRoute",
    name: "User management",
    key: "user-management",
    icon: usersIcon,
    noCollapse: true,
    route: "admin/user-management",
    component: UserManagement,
    private: false,
    role: "admin",
  },
  {
    type: "title",
    name: "Login",
    key: "login",
    icon: dashboardIcon,
    noCollapse: true,
    route: "/authentication/admin",
    component: AdminLogin,
    private: false,
    role: "all",
  },
  {
    type: "title",
    name: "Forgot Password",
    key: "forgot-password",
    icon: dashboardIcon,
    noCollapse: true,
    route: "/authentication/forgot-password",
    component: ForgotPassword,
    private: false,
    role: "all",
  },
  {
    type: "singleRoute",
    name: "Logout",
    key: "logout",
    icon: logoutIcon,
    noCollapse: true,
    route: "/authentication/admin",
    component: AdminLogin,
    private: false,
    role: "admin",
  },
  {
    type: "title",
    name: "Logout",
    key: "logout",
    icon: logoutIcon,
    noCollapse: true,
    route: "/authentication/admin/confirm",
    component: AdminConfirm,
    private: false,
    role: "admin",
  },
  {
    type: "title",
    name: "Dashboard",
    key: "dashboard",
    icon: dashboardIcon,
    noCollapse: true,
    route: "admin/user-management/*",
    component: UserManagement,
    private: false,
    role: "admin",
  },
  {
    type: "profile",
    name: "Profile",
    key: "profile",
    noCollapse: true,
    route: "/profile",
    component: ProfileOverview,
    private: false,
    role: "candidate",
  },
  {
    type: "singleRoute",
    name: "Dashboard",
    key: "dashboard",
    icon: dashboardIcon,
    noCollapse: true,
    route: "/dashboard",
    component: ProfileOverview,
    private: false,
    role: "candidate",
  },
  {
    type: "singleRoute",
    name: "Jobs",
    key: "jobs",
    icon: jobsIcon,
    noCollapse: true,
    route: "/jobs",
    component: Jobs,
    private: true,
    role: "candidate",
  },
  {
    type: "title",
    name: "Jobs",
    key: "jobs",
    icon: jobsIcon,
    noCollapse: true,
    route: "/jobs/*",
    component: Jobs,
    private: true,
    role: "candidate",
  },
  {
    type: "singleRoute",
    name: "Logout",
    key: "logout",
    icon: logoutIcon,
    noCollapse: true,
    route: "/authentication/sign-up",
    component: SignInIllustration,
    private: false,
    role: "candidate",
  },
  {
    type: "profile",
    name: "Profile",
    key: "profile",
    icon: settingsIcon,
    noCollapse: true,
    route: "/profile",
    component: ProfileRecriuter,
    private: false,
    role: "recruiter",
  },
  {
    type: "singleRoute",
    name: "Dashboard",
    key: "recruiter",
    icon: dashboardIcon,
    noCollapse: true,
    route: "/dashboard",
    component: DashboardRecruiter,
    private: true,
    role: "recruiter",
  },
  {
    type: "singleRoute",
    name: "Jobs",
    key: "JobsRecruiter",
    icon: jobsIcon,
    noCollapse: true,
    route: "/jobs",
    component: JobsRecruiter,
    private: true,
    role: "recruiter",
  },
  {
    type: "title",
    name: "Pricing Plans",
    key: "PricingPlans",
    icon: jobsIcon,
    noCollapse: true,
    route: "/authentication/get-access",
    component: GetAccess,
    private: true,
    role: "recruiter",
  },
  {
    type: "title",
    name: "Pricing Plans",
    key: "PricingPlans",
    icon: jobsIcon,
    noCollapse: true,
    route: "/authentication/declined",
    component: Declined,
    private: true,
    role: "recruiter",
  },
  {
    type: "title",
    name: "Pricing Plans",
    key: "PricingPlans",
    icon: jobsIcon,
    noCollapse: true,
    route: "/authentication/declined/billing",
    component: PaymentDeclined,
    private: true,
    role: "recruiter",
  },
  {
    type: "title",
    name: "Pricing Plans",
    key: "PricingPlans",
    icon: jobsIcon,
    noCollapse: true,
    route: "/authentication/get-access/payment",
    component: PaymentGetAccess,
    private: true,
    role: "recruiter",
  },
  {
    type: "title",
    name: "Pricing Plans",
    key: "PricingPlans",
    icon: jobsIcon,
    noCollapse: true,
    route: "/authentication/billing",
    component: Payment,
    private: true,
    role: "recruiter",
  },
  {
    type: "title",
    name: "Dashboard",
    key: "recruiter",
    icon: dashboardIcon,
    noCollapse: true,
    route: "/dashboard/pricing-plan",
    component: PricingPlans,
    private: true,
    role: "recruiter",
  },
  {
    type: "singleRoute",
    name: "Search Candidates",
    key: "search-candidates",
    icon: searchIcon,
    noCollapse: true,
    route: "/search-candidates",
    component: SearchCandidates,
    private: true,
    role: "recruiter",
  },
  {
    type: "title",
    name: "JobsRecruiter",
    key: "JobsRecruiter",
    icon: jobsIcon,
    noCollapse: true,
    route: "/jobs/*",
    component: JobsRecruiter,
    private: true,
    role: "recruiter",
  },
  {
    type: "title",
    name: "JobsRecruiter",
    key: "JobsRecruiter",
    icon: jobsIcon,
    noCollapse: true,
    route: "/jobs/*",
    component: JobsRecruiter,
    private: true,
    role: "admin",
  },
  {
    type: "singleRoute",
    name: "Invoices",
    key: "Invoices",
    icon: invoices,
    noCollapse: true,
    route: "/invoices",
    component: Invoices,
    private: true,
    role: "recruiter",
  },
  {
    type: "singleRoute",
    name: "Campaign History",
    key: "CampaignHistory",
    icon: history,
    noCollapse: true,
    route: "/campaign-history",
    component: CampaignHistory,
    private: true,
    role: "recruiter",
  },
  {
    type: "title",
    name: "Campaign History",
    key: "CampaignHistory",
    icon: history,
    noCollapse: true,
    route: "/campaign-history/*",
    component: CampaignHistory,
    private: true,
    role: "recruiter",
  },
  {
    type: "singleRoute",
    name: "Logout",
    key: "logout",
    icon: logoutIcon,
    noCollapse: true,
    route: "/authentication/sign-up",
    component: SignInIllustration,
    private: true,
    role: "recruiter",
  },
  {
    type: "title",
    icon: logoutIcon,
    noCollapse: true,
    route: "/authentication/login",
    component: LoginIllustration,
    private: false,
    role: "all",
  },
  {
    type: "title",
    noCollapse: true,
    route: "/authentication/sign-up",
    component: SignInIllustration,
    private: false,
    role: "all",
  },
];

export const getRoutesByRole = (role) => {
  if (role === "recruiter")
    return routes.filter((route) => route.role === "recruiter" || route.role === "all");
  if (role === "candidate")
    return routes.filter((route) => route.role === "candidate" || route.role === "all");
  if (role === "admin")
    return routes.filter((route) => route.role === "admin" || route.role === "all");
  return routes.filter((route) => route.role === "all");
};
