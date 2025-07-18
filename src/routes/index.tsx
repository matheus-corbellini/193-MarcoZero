import { Routes, Route, useNavigate } from "react-router-dom";
import UploadPage from "../pages/upload";
import ResultsPage from "../pages/results";
import LoginScreen from "../pages/auth/login";
import RegisterScreen from "../pages/auth/register";

export default function AppRoutes() {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route
        path="/"
        element={
          <LoginScreen onSwitchToRegister={() => navigate("/register")} />
        }
      />
      <Route
        path="/login"
        element={
          <LoginScreen onSwitchToRegister={() => navigate("/register")} />
        }
      />
      <Route
        path="/register"
        element={<RegisterScreen onSwitchToLogin={() => navigate("/login")} />}
      />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/results" element={<ResultsPage />} />
      {/* Adicione outras rotas aqui */}
    </Routes>
  );
}
