import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import Landing from "./Pages/Landing";
import Login from "./Pages/Login";
import Signup from "./Pages/signup";
import { AuthProvider } from "./context/authContext";
import ProtectedRoute from "./Components/auth/protectedRoute";
import HomePage from "./Pages/usersHomePage";

function App() {
  return (
    <div className="home">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route
              path="/homepage"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster position="top-right" reverseOrder={false} />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
