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
// import NotFound from './pages/NotFound'
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import Home from './pages/Home';
import PublicProfilePage from './pages/Profile/Public';

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
            <Route path="/home" element={<Home />} />
          </Route>
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </BrowserRouter>
    )
}

export default AppRoutes