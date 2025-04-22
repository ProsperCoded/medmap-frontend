import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import Landing from "./Pages/Landing";
import Login from "./Pages/Login";
import Signup from "./Pages/signup";
import { AuthProvider } from "./context/authContext";
import ProtectedRoute from "./Components/auth/protectedRoute";
import HomePage from "./Pages/users/usersHomePage";
import SearchPage from "./Pages/users/SearchPage";
import PharmacyAssistant from "./Components/Bot/chatBot";
import Explore from "./Pages/users/Explore";
import Directions from "./Pages/users/directions";
import NotFound from "./Pages/NotFound";

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
              path="/search_result/:value"
              element={
                <ProtectedRoute>
                  <SearchPage />
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
