import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { useEffect, useState } from "react";
import { useShopStore } from "./store/useStore";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Offers from "./pages/Offers";

export default function App() {
  const {isLoading, fetchShopData, logout } = useShopStore(); 
  const [checkingAuth, setCheckingAuth] = useState(true);
  useEffect(() => {
    const IsLoggedInCheck = localStorage.getItem('sooq-isLoggedIn') || false;
    if(!IsLoggedInCheck) {
      logout();
      localStorage.setItem("sooq-isLoggedIn", JSON.stringify(false))
    } else {
       isLoading(true);
        fetchShopData()
          .catch(() => {
            localStorage.removeItem("sooq-isLoggedIn");
            localStorage.removeItem("sooq-token");
          })
          .finally(() => {
            isLoading(false);
            setCheckingAuth(false)
          })
    }
  }, [])

  if (checkingAuth) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes >
          {/* Dashboard Layout */}
          <Route element={<ProtectedRoutes />}>
            <Route element={<AppLayout />} >
              <Route index path="/" element={<Home />} />

              <Route path="/products" element={<Outlet />}>
                <Route path="" element={<Products />} />
              </Route>

              <Route path="/orders" element={<Outlet />}>
                <Route path="" element={<Orders />} />
              </Route>

              <Route path="/offers" element={<Outlet />}>
                <Route path="" element={<Offers />} />
              </Route>


              {/* Others Page */}
              <Route path="/profile" element={<UserProfiles />} />
              
              <Route path="/blank" element={<Blank />} />

             
            </Route>
          </Route>

          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
