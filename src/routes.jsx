import React from 'react'
import {
  Routes,
  Route,
  BrowserRouter,
  useLocation,
  Navigate,
  Outlet
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import PricingPublicPage from './pages/LandingPage/Pricing';
import LoginPage from './pages/Login';
import ForgotPasswordPage from './pages/Login/forgotPassword';
import RedefinePasswordPage from './pages/Login/redefinePassword';
import SignupPage from './pages/Signup';
import MyAccountPage from './pages/MyAccount';
import Home from './pages/Home';
import StartIntroPage from './pages/Start/intro';
import StartStep1Page from './pages/Start/step1';
import StartStep2Page from './pages/Start/step2';
import StartStep3Page from './pages/Start/step3';
import StartStep4Page from './pages/Start/step4';
import MyProjectsPage from './pages/MyProjects';
import SearchPage from './pages/Search/index';
import NewPost from './pages/New/post';
import NewProject from './pages/New/project';
import JoinProject from './pages/New/join';
import AddGearToUserSetup from './pages/New/gear';
import New from './pages/New';
import ProjectPage from './pages/ProjectPage';
import ProjectDashboardPage from './pages/ProjectDashboard';
import ProjectDashboardTeamPage from './pages/ProjectDashboard/Team';
import ProfilePage from './pages/Profile';
import PublicProfilePage from './pages/Profile/Public';
import ProfileGear from './pages/Profile/Gear/gearExpanded';
import ProfileGearItem from './pages/Profile/Gear/item';
import ProfileTimeline from './pages/Profile/Timeline';
import GearProductPage from './pages/Gear/product';
import GearZoomPage from './pages/Gear/zoom';
import GearBrandPage from './pages/Gear/brand';
import SettingsProfileEdit from './pages/Settings/profile';
import SettingsMyPlan from './pages/Settings/plan';
import SettingsMyPicture from './pages/Settings/picture';
import SettingsMyGear from './pages/Settings/gear';
import SettingsSubmitNewGearProduct from './pages/Settings/submitNew';
import SettingsMusicalPreferences from './pages/Settings/preferences';
import SettingsAvailability from './pages/Settings/availability';
import SettingsBusinessPartners from './pages/Settings/endorsements';
import SettingsPassword from './pages/Settings/password';
import MenuMobilePage from './pages/MenuMobile';
import CheckoutSuccess from './pages/Checkout/success';
import AdminPage from './pages/Admin';

function AppRoutes () {

  const loggedIn = useSelector(state => state.authentication.loggedIn);

  function RequireAuth () {
    let location = useLocation();

    if (!loggedIn) {
      return <Navigate to="/" state={{ from: location }} />;
    }

    return <Outlet />;
  }

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPublicPage />} />
        <Route path="/login/forgot" element={<ForgotPasswordPage />} />
        <Route path="/login/redefine-password" element={<RedefinePasswordPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route exact path="/:username/public" element={<PublicProfilePage />} />
        <Route element={<RequireAuth />}>
          <Route path="/home" element={<Home />} />
          {/* First Steps */}
          <Route path="/start/intro" element={<StartIntroPage />} />
          <Route path="/start/step1" element={<StartStep1Page />} />
          <Route path="/start/step2" element={<StartStep2Page />} />
          <Route path="/start/step3" element={<StartStep3Page />} />
          <Route path="/start/step4" element={<StartStep4Page />} />
          {/* Projects */}
          <Route path="/projects" element={<MyProjectsPage />} />
          <Route path="/project/:username" element={<ProjectPage />} />
          <Route path="/dashboard/:username" element={<ProjectDashboardPage />} />
          <Route path="/dashboard/:username/team" element={<ProjectDashboardTeamPage />} />
          {/* Gear, products and companies */}
          <Route path="/gear/product/:productId" element={<GearProductPage />} />
          <Route path="/gear/product/zoom/:productId" element={<GearZoomPage />} />
          <Route path="/company/:brandUrlName" element={<GearBrandPage />} />
          {/* User settings */}
          <Route path="/my-account" element={<MyAccountPage />} />
          <Route path="/settings/plan" element={<SettingsMyPlan />} />
          <Route path="/settings/picture" element={<SettingsMyPicture />} />
          <Route path="/settings/preferences" element={<SettingsMusicalPreferences />} />
          <Route path="/settings/availability" element={<SettingsAvailability />} />
          <Route path="/settings/endorsements" element={<SettingsBusinessPartners />} />
          <Route path="/settings/my-gear" element={<SettingsMyGear />} />
          <Route path="/settings/submit-product" element={<SettingsSubmitNewGearProduct />} />
          <Route path="/settings/password" element={<SettingsPassword />} />
          <Route path="/settings" element={<SettingsProfileEdit />} />
          {/* Search */}
          <Route path="/search" element={<SearchPage />} />
          {/* New item */}
          <Route path="/new/post" element={<NewPost />} />
          <Route path="/new/project" element={<NewProject />} />
          <Route path="/new/join" element={<JoinProject />} />
          <Route path="/new/gear" element={<AddGearToUserSetup />} />
          <Route path="/new" element={<New />} />
          {/* System Admin */}
          <Route path="/admin" element={<AdminPage />} />
          {/* User profile */}
          <Route exact path="/:username/gear" element={<ProfileGear />} />
          <Route exact path="/:username/gear/:itemId" element={<ProfileGearItem />} />
          <Route exact path="/:username/timeline" element={<ProfileTimeline/>} />
          {/* Misc */}
          <Route exact path="/menu" element={<MenuMobilePage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/:username" element={loggedIn ? <ProfilePage /> : <PublicProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes