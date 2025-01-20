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
import SearchPage from './pages/Search/initial';
import NewPost from './pages/New/post';
import NewProject from './pages/New/project';
import New from './pages/New';
import ProjectPage from './pages/ProjectPage';
import ProjectDashboardPage from './pages/ProjectDashboard';
import ProfilePage from './pages/Profile';
import PublicProfilePage from './pages/Profile/Public';
import ProfileGear from './pages/Profile/Gear/gearExpanded';
import GearProductPage from './pages/Gear/product';
import GearBrandPage from './pages/Gear/brand';
import SettingsProfileEdit from './pages/Settings/profileEdit';
import SettingsMyPicture from './pages/Settings/picture';
import SettingsMyGear from './pages/Settings/gear';
import SettingsSubmitNewGearProduct from './pages/Settings/submitNew';
import SettingsMusicalPreferences from './pages/Settings/preferences';
import SettingsAvailability from './pages/Settings/availability';
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
        <Route path="/login/forgot" element={<ForgotPasswordPage />} />
        <Route path="/login/redefine-password" element={<RedefinePasswordPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route exact path="/:username/public" element={<PublicProfilePage />} />
        <Route element={<RequireAuth />}>
          <Route path="/my-account" element={<MyAccountPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/start/intro" element={<StartIntroPage />} />
          <Route path="/start/step1" element={<StartStep1Page />} />
          <Route path="/start/step2" element={<StartStep2Page />} />
          <Route path="/start/step3" element={<StartStep3Page />} />
          <Route path="/start/step4" element={<StartStep4Page />} />
          <Route path="/projects" element={<MyProjectsPage />} />
          <Route path="/project/:username" element={<ProjectPage />} />
          <Route path="/project/:username/dashboard" element={<ProjectDashboardPage />} />
          <Route path="/gear/product/:productId" element={<GearProductPage />} />
          <Route path="/gear/brand/:brandUrlName" element={<GearBrandPage />} />
          <Route path="/settings/picture" element={<SettingsMyPicture />} />
          <Route path="/settings/preferences" element={<SettingsMusicalPreferences />} />
          <Route path="/settings/availability" element={<SettingsAvailability />} />
          <Route path="/settings/my-gear" element={<SettingsMyGear />} />
          <Route path="/settings/submit-product" element={<SettingsSubmitNewGearProduct />} />
          <Route path="/settings/password" element={<SettingsPassword />} />
          <Route path="/settings" element={<SettingsProfileEdit />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/new/post" element={<NewPost />} />
          <Route path="/new/project" element={<NewProject />} />
          <Route path="/new" element={<New />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* <Route exact path="/:username" element={<ProfilePage />} /> */}
          <Route exact path="/:username/gear" element={<ProfileGear />} />
          <Route exact path="/menu" element={<MenuMobilePage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/:username" element={loggedIn ? <ProfilePage /> : <PublicProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes