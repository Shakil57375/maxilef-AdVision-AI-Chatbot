import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { ChatProvider } from "./context/ChatContext";
import { Sidebar } from "./components/Sidebar";
import { ChatArea } from "./components/ChatArea";
import { Header } from "./components/Header";
import { Toaster } from "react-hot-toast";
import ModalForForgotPassword from "./components/Modals/ForgetPasswordModal";
import ModalForVerificationCode from "./components/Modals/VerificationCodeModal";
import ModalForResetPassword from "./components/Modals/ModalForResetPassword";
import Congratulations from "./components/Modals/Congratulation";
import ProfileModal from "./components/Modals/ModalForProfileEdit";
import { ModalForSettings } from "./components/Modals/SettingModal";
import { ModalForFAQ } from "./components/Modals/FaqModal";
import UpgradePage from "./components/UpgradeModal";
import { PrivateRoute } from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import ModalForSignUp from "./components/Modals/SingUpModal";
import ModalForLogin from "./components/Modals/LoginModal";
import ModalForAboutMe from "./components/Modals/AboutMe";
import SubscriptionDetails from "./components/Modals/ManageSuscription";
import VerifyForgetPasswordOtp from "./components/Modals/VerifyForgetPasswordOtp";
import Home from "./pages/Home/Home";
import { PublicRoute } from "./components/PublicRoute";
import NotFoundPage from "./pages/NotFoundPage";
import { HelpAndSupportPage } from "./components/Modals/HelpAndSupport";
import PrivacyPolicyPage from "./components/Modals/PrivacyAndPolicyModal";
import TermsAndConditionsPage from "./components/Modals/TermsAndCondtionModal";

function MainContent() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const routesWithHeaderAndSidebar = [
    "/",
    "/chat/:id",
    "/calendar",
    "/chat-editor/:id",
    "/verificationCode",
    "/congratulations",
    "/editProfile",
    "/helpAndSupport",
    "/settings",
    "/faq",
    "/saved-chats",
    "/upgrade",
    "/manageSubscription",
    "/TermsAndConditions",
    "/aboutMe",
    "/privacyAndPolicy",
  ];

  const showHeaderAndSidebar = routesWithHeaderAndSidebar.some((route) => {
    const match = new RegExp("^" + route.replace(":id", "[^/]+") + "$");
    return match.test(location.pathname);
  });

  const containerClass =
    location.pathname === "/home"
      ? "flex-1 flex flex-col"
      : "flex-1 flex flex-col h-screen";

  return (
    <div className={containerClass}>
      {showHeaderAndSidebar && <Header setIsSidebarOpen={setIsSidebarOpen} />}
      <div className="flex-1 flex overflow-hidden">
        {showHeaderAndSidebar && (
          <div className="">
            <Sidebar
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </div>
        )}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 dark:text-white">
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <ChatArea />
                </PrivateRoute>
              }
            />
            <Route path="/home" element={<Home />} />
            <Route
              path="/chat/:id"
              element={
                <PrivateRoute>
                  <ChatArea />
                </PrivateRoute>
              }
            />
            <Route
              path="/editProfile"
              element={
                <PrivateRoute>
                  <ProfileModal />
                </PrivateRoute>
              }
            />
            <Route
              path="/signUp"
              element={
                <PublicRoute>
                  <ModalForSignUp />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <ModalForLogin />
                </PublicRoute>
              }
            />
            <Route
              path="/forgetPassword"
              element={
                <PublicRoute>
                  <ModalForForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/verificationCode"
              element={<ModalForVerificationCode />}
            />
            <Route
              path="/verifyForgetPasswordOtp"
              element={
                <PublicRoute>
                  <VerifyForgetPasswordOtp />
                </PublicRoute>
              }
            />
            <Route
              path="/resetPass"
              element={
                <PublicRoute>
                  <ModalForResetPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/congratulations"
              element={
                <PublicRoute>
                  <Congratulations />
                </PublicRoute>
              }
            />
            <Route path="/helpAndSupport" element={<HelpAndSupportPage />} />
            <Route path="/settings" element={<ModalForSettings />} />
            <Route path="/faq" element={<ModalForFAQ />} />
            <Route
              path="/upgrade"
              element={
                <PrivateRoute>
                  <UpgradePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/manageSubscription"
              element={
                <PrivateRoute>
                  <SubscriptionDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/TermsAndConditions"
              element={<TermsAndConditionsPage />}
            />
            <Route path="/terms" element={<TermsAndConditionsPage />} />
            <Route path="/aboutMe" element={<ModalForAboutMe />} />
            <Route path="/privacyAndPolicy" element={<PrivacyPolicyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
          <div className="flex font-montserrat">
            <MainContent />
          </div>
          <Toaster />
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;