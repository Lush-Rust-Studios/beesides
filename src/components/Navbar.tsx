"use client";
import React, { useState } from "react";
import { Search, User, Menu } from "lucide-react";
import { AuthModal } from "./auth/AuthModal";
import { LoginForm } from "./auth/LoginForm";
import { RegisterForm } from "./auth/RegisterForm";
import { ForgotPasswordForm } from "./auth/ForgotPasswordForm";
type AuthView = "login" | "register" | "forgot-password";
export function Navbar() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<AuthView>("login");
  const handleAuthClose = () => {
    setIsAuthOpen(false);
    setTimeout(() => setAuthView("login"), 300);
  };
  const getAuthTitle = () => {
    switch (authView) {
      case "register":
        return "Create Account";
      case "forgot-password":
        return "Reset Password";
      default:
        return "Welcome Back";
    }
  };
  return (
    <>
      <header className="border-b-4 border-black bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-12">
              <a href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#FF3B3B] rounded-[4px]"></div>
                <span className="font-black text-xl">BEESIDES</span>
              </a>
              <nav className="hidden md:flex items-center gap-8">
                <a
                  href="/discover"
                  className="font-bold hover:text-[#FF3B3B] transition"
                >
                  DISCOVER
                </a>
                <a
                  href="/charts"
                  className="font-bold hover:text-[#FF3B3B] transition"
                >
                  CHARTS
                </a>
                <a
                  href="/community"
                  className="font-bold hover:text-[#FF3B3B] transition"
                >
                  COMMUNITY
                </a>
                <a
                  href="/about"
                  className="font-bold hover:text-[#FF3B3B] transition"
                >
                  ABOUT
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-[#f0f0f0] rounded-[4px]">
                <Search size={20} />
              </button>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="p-2 hover:bg-[#f0f0f0] rounded-[4px]"
              >
                <User size={20} />
              </button>
              <button className="md:hidden p-2 hover:bg-[#f0f0f0] rounded-[4px]">
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>
      <AuthModal
        isOpen={isAuthOpen}
        onClose={handleAuthClose}
        title={getAuthTitle()}
      >
        {authView === "login" && (
          <LoginForm
            onSuccess={handleAuthClose}
            onRegisterClick={() => setAuthView("register")}
            onForgotPasswordClick={() => setAuthView("forgot-password")}
          />
        )}
        {authView === "register" && (
          <RegisterForm
            onSuccess={handleAuthClose}
            onLoginClick={() => setAuthView("login")}
          />
        )}
        {authView === "forgot-password" && (
          <ForgotPasswordForm
            onSuccess={() => setTimeout(handleAuthClose, 2000)}
            onBackToLogin={() => setAuthView("login")}
          />
        )}
      </AuthModal>
    </>
  );
}
