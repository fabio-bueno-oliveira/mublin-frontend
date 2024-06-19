import React from 'react'
import {
    Routes,
    Route,
    BrowserRouter,
    useLocation,
    Navigate,
    Outlet
  } from 'react-router-dom';
// import { useSelector } from 'react-redux'
// import NotFound from './pages/NotFound'
import Landing from './pages/LandingPage'
import Login from './pages/Login'
// import Home from './pages/Home'

function AppRoutes () {

    // const loggedIn = useSelector(state => state.authentication.loggedIn)
    const loggedIn = false

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
                <Route path="/" element={<Login />} />
                {/* <Route element={<RequireAuth />}>
                    <Route path="/home" element={<Home />} />
                </Route>
                <Route path="*" element={<NotFound />} /> */}
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes