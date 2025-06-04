import { useState, useEffect } from "react";
import "./App.css";
import PageLayout from "./components/PageLayout/PageLayout";
import Dashboard from "./components/Dashboard/Dashboard";
import Games from "./components/Games/Games";
import Purchases from "./components/Purchases/Purchases";
import Subscriptions from "./components/Subscriptions/Subscriptions";
import Settings from "./components/Settings/Settings";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import PublicRoute from "./util/PublicRoute";
import ProtectedRoute from "./util/ProtectedRoute";
import { checkAuth } from "./util/userAuthUtil";
import { Routes, Route, useLocation } from "react-router";

const AppRouter = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const publicPaths = ["/login", "/register"];
    if (!publicPaths.includes(location.pathname)) {
      const verify = async () => {
        try {
          const userData = await checkAuth();
          setUser(userData);
        } catch {
          setUser(null);
        } finally {
          setLoading(false);
        }
      };
      verify();
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  if (loading) return null;
  return (
    <Routes>
      <Route element={<PublicRoute user={user} />}>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<ProtectedRoute user={user} />}>
        <Route path="/" element={<PageLayout />}>
          <Route index element={<Dashboard user={user} />}></Route>
          <Route path="games" element={<Games user={user} />}></Route>
          <Route path="purchases" element={<Purchases />}></Route>
          <Route path="subscriptions" element={<Subscriptions />}></Route>
          <Route path="settings" element={<Settings />}></Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;
