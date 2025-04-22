import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import Landing from "./Pages/LandingPage";
import Login from "./Pages/Login";
import Signup from "./Pages/signup";
import { AuthProvider } from "./context/authContext";
import ProtectedRoute from "./Components/auth/protectedRoute";
import HomePage from "./Pages/users/HomePage";
import SearchPage from "./Pages/users/SearchPage";
import PharmacyAssistant from "./Components/Bot/chatBot";
import Explore from "./Pages/users/Explore";
import Directions from "./Pages/users/directions";
import NotFound from "./Pages/NotFound";
import DashboardPage from "./Pages/users/pharmacy/Dashboard";
import DrugsPage from "./Pages/users/pharmacy/Drugs";
import ProfilePage from "./Pages/users/pharmacy/Profile";

function App() {
  return (
    <div className="home">
      <AuthProvider>
        <BrowserRouter>
          {/* Chat bot is available on all pages */}
          <PharmacyAssistant />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/search" element={<SearchPage />} />

            {/* Protected Routes */}
            <Route
              path="/homepage"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/explore"
              element={
                <ProtectedRoute>
                  <Explore />
                </ProtectedRoute>
              }
            />

            <Route
              path="/directions/:id/:current_lat/:current_lng/:pharmacy_lat/:pharmacy_lng"
              element={
                <ProtectedRoute>
                  <Directions />
                </ProtectedRoute>
              }
            />

            <Route
              path="/pharmacy/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/pharmacy/drugs"
              element={
                <ProtectedRoute>
                  <DrugsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/pharmacy/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* 404 - This must be the last route */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          <Toaster position="top-right" reverseOrder={false} />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
