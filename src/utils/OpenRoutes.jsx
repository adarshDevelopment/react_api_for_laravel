import { useContext } from "react";
import { Route, useNavigate, Outlet } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import BlankPage from "../Pages/BlankPage";

const OpenRoutes = () => {
    const navigate = useNavigate();
    const { user, loading } = useContext(AppContext);

    if (loading) {
        return <BlankPage />
    }

    return !user ? <Outlet /> : navigate(-1);
}

export default OpenRoutes;