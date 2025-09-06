// import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./component/layout/scrolltop";
import ErrorPage from "./pages/errorpage";
import LogIn from "./pages/login";
import SignUp from "./pages/signup";
import MetrimoniulRoutes from "./metrimoniul/routes/metrimoniul-routes";
import DatingRoutes from "./dating/routes/dating-routes";
import HomePageMetri from "./pages/home-metrimonial";
import HomePage from "./pages/home-dating";
import NoInternetPage from "./component/nointernet/NoInternetPage";
import useOnlineStatus from "./component/nointernet/useOnlineStatus";
import Search from "./metrimoniul/pagesMetrimoniul/search";
import AstroPage from "./metrimoniul/pagesMetrimoniul/Astro-page";
import PurchaseHistory from "./metrimoniul/pagesMetrimoniul/purchasehistory.jsx";

const App = () => {
  const isOnline = useOnlineStatus();

  return (
    <div className="App">
      <Router>
        <ScrollToTop />
        <Routes>
          {isOnline ? (
            <>
              <Route path="*" element={<ErrorPage />} />
              <Route path="login" element={<LogIn />} />
              <Route path="register" element={<SignUp />} />
              <Route path="/" element={<HomePage />} />
              <Route path="dating/" element={<HomePage />} />
              <Route path="metrimonial/" element={<HomePageMetri />} />
              <Route path={`/dating/*`} element={<DatingRoutes />} />
              <Route path="/metrimonial/*" element={<MetrimoniulRoutes />} />
              <Route path="/search/*" element={<Search />} />
              <Route path="/search/*" element={<Search />} />
              <Route path="/purchase-history" element={<PurchaseHistory />} />
            </>
          ) : (
            <Route path="*" element={<NoInternetPage />} />
          )}
        </Routes>
      </Router>
    </div>
  );
};

export default App;
