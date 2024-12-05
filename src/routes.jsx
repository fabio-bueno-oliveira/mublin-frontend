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
import SignupPage from './pages/Signup';
import MyAccountPage from './pages/MyAccount';
import Home from './pages/Home';
import StartIntroPage from './pages/Start/intro';
import StartStep1Page from './pages/Start/step1';
import StartStep2Page from './pages/Start/step2';
import StartStep3Page from './pages/Start/step3';
import StartStep4Page from './pages/Start/step4';
import MyProjectsPage from './pages/MyProjects';
import SearchPage from './pages/Search';
import NewProject from './pages/New/project';
import New from './pages/New';
import ProjectPage from './pages/ProjectPage';
import ProjectDashboardPage from './pages/ProjectDashboard';
import ProfilePage from './pages/Profile';
import PublicProfilePage from './pages/Profile/Public';
import GearProductPage from './pages/Gear/product';
import GearBrandPage from './pages/Gear/brand';
import Settings from './pages/Settings';
import MenuMobilePage from './pages/MenuMobile';

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route exact path="/:username/public" element={<PublicProfilePage />} />
        <Route element={<RequireAuth />}>
          <Route path="/my-account" element={<MyAccountPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/start/intro" element={<StartIntroPage />} />
          <Route path="/start/step1" element={<StartStep1Page />} />
          <Route path="/start/step2" element={<StartStep2Page />} />
          <Route path="/start/step3" element={<StartStep3Page />} />
          <Route path="/start/step4" element={<StartStep4Page />} />
          <Route path="/my-projects" element={<MyProjectsPage />} />
          <Route path="/project/:username" element={<ProjectPage />} />
          <Route path="/project/:username/dashboard" element={<ProjectDashboardPage />} />
          <Route path="/gear/product/:productId" element={<GearProductPage />} />
          <Route path="/gear/brand/:brandUrlName" element={<GearBrandPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/new/project" element={<NewProject />} />
          <Route path="/new" element={<New />} />
          <Route exact path="/:username" element={<ProfilePage />} />
          <Route exact path="/menu" element={<MenuMobilePage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        {/* <Route path="/:username" element={loggedIn ? <ProfilePage /> : <PublicProfilePage />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes