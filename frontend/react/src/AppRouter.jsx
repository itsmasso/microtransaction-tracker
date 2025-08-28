import { useState, useEffect } from "react";
import "./App.css";
import PageLayout from "./components/PageLayout/PageLayout";
import Dashboard from "./components/Dashboard/Dashboard";
import Games from "./components/Games/Games";
import Purchases from "./components/Purchases/Purchases";
import Analytics from "./components/Analytics/Analytics";
import Settings from "./components/Settings/Settings";
import Login from "./components/Login/Login";
import SignupWizard from "./components/Register/SignupWizard";
import PublicRoute from "./util/PublicRoute";
import ProtectedRoute from "./util/ProtectedRoute";
import Landing from "./components/Landing/Landing";
import PublicLayout from "./components/PublicLayout/PublicLayout";
import ForgotPasswordWizard from "./components/ForgotPassword/ForgotPasswordWizard";
import { checkAuth } from "./util/userAuthUtil";
import { Routes, Route, useLocation } from "react-router";
import { SignupModalProvider } from "./context/SignupModalContext";

const AppRouter = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
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
  }, [location.pathname]);
  const onLogout = () => {
    setUser(null);
  };
  if (loading) return null;
  return (
    <SignupModalProvider>
      <Routes>
        <Route element={<PublicRoute user={user} />}>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Landing />} />
            <Route path="login" element={<Login setUser={setUser} />} />
            <Route path="register" element={<SignupWizard />} />
            <Route path="forgot-password" element={<ForgotPasswordWizard />} />
          </Route>
        </Route>

        {/* Demo Routes */}
        <Route path="/demo" element={<PageLayout isDemo={true} />}>
          <Route path="dashboard" element={<Dashboard isDemo={true} />} />
          <Route path="games" element={<Games isDemo={true} />} />
          <Route path="purchases" element={<Purchases isDemo={true} />} />
          <Route path="analytics" element={<Analytics isDemo={true} />} />
          <Route path="settings" element={<Settings isDemo={true} />} />
        </Route>

        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/" element={<PageLayout onLogout={onLogout} user={user} />}>
            <Route path="dashboard" element={<Dashboard user={user} />}></Route>
            <Route path="games" element={<Games user={user} />}></Route>
            <Route path="purchases" element={<Purchases />}></Route>
            <Route path="analytics" element={<Analytics />}></Route>
            <Route path="settings" element={<Settings user={user} />}></Route>
          </Route>
        </Route>
      </Routes>
    </SignupModalProvider>
  );
};

export default AppRouter;
