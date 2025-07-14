import { Outlet, Navigate } from "react-router";
import { useShopStore } from "../store/useStore";

const ProtectedRoutes = () => {

    const { isLoggedIn } = useShopStore();



    return isLoggedIn ? <Outlet /> : <Navigate to='/signin' />
}

export default ProtectedRoutes