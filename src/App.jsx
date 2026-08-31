import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResetPassword from "./pages/ResetPassword";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import CourseDetail from "./components/CourseDetail"
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CheckEmail from "./pages/CheckEmail";
import AuthCallback from "./pages/AuthCallback";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Main application (protected) */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />

                <div className="flex-1">
                  <Navbar />

                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/courses/:id" element={<CourseDetail />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;