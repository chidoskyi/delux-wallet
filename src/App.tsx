import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import LandingPage from "./pages/landingPage"
import Login from "./pages/login"
import SignUp from "./pages/signUp"
import WalletSetup from "./pages/walletSetup"
import { AuthProvider } from "./context/AuthContext"
import { ProtectedRoute } from "./context/auth/ProtectedRoute"

export default function App() {
  return (
     <Router basename={process.env.PUBLIC_URL || '/'}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route 
            path="/setup" 
            element={
              <ProtectedRoute>
                <WalletSetup />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </AuthProvider>
    </Router>
  )
}
