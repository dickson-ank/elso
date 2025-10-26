"use client";

import { useState } from "react";
import LoginForm from "./login-form";
import SignupForm from "./signup-form";
import ForgotPasswordForm from "./forgot-password-form";

type AuthView = "login" | "signup" | "forgot-password";

export default function AuthContainer() {
  const [currentView, setCurrentView] = useState<AuthView>("login");

  const handleNavigate = (view: AuthView) => {
    setCurrentView(view);
  };

  return (
    <>
      {currentView === "login" && (
        <LoginForm
          onSignUp={() => handleNavigate("signup")}
          onForgotPassword={() => handleNavigate("forgot-password")}
        />
      )}
      {currentView === "signup" && (
        <SignupForm onBackToLogin={() => handleNavigate("login")} />
      )}
      {currentView === "forgot-password" && (
        <ForgotPasswordForm onBackToLogin={() => handleNavigate("login")} />
      )}
    </>
  );
}
