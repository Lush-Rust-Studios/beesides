"use client";
import React, { useState, useEffect } from "react";
import { Search, User, Menu, LogOut } from "lucide-react";
import { AuthModal } from "./auth/AuthModal";
import { LoginForm } from "./auth/LoginForm";
import RegisterForm from "./auth/RegisterForm";
import { ForgotPasswordForm } from "./auth/ForgotPasswordForm";
import { useAuthStore } from "@/lib/supabase/session";
import { signOut, getCurrentProfile } from "@/lib/supabase/auth";
import { useRouter } from "next/navigation";
import { createLogger } from "@/lib/utils/logger";

type AuthView = "login" | "register" | "forgot-password";

// Create a logger for the Navbar component
const logger = createLogger("component:Navbar");
export function Navbar() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<AuthView>("login");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    // Close auth modal when user is authenticated
    if (isAuthenticated && isAuthOpen) {
      logger.info("User authenticated, closing auth modal");
      handleAuthClose();
    }
  }, [isAuthenticated]);

  // Add click outside handler for user menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const userMenuButton = document.getElementById("user-menu-button");
      const userMenu = document.getElementById("user-dropdown-menu");

      if (
        showUserMenu &&
        userMenuButton &&
        userMenu &&
        !userMenuButton.contains(target) &&
        !userMenu.contains(target)
      ) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const handleAuthClose = () => {
    setIsAuthOpen(false);
    setTimeout(() => setAuthView("login"), 300);
  };

  const handleUserButtonClick = () => {
    if (isAuthenticated) {
      // Toggle user menu
      setShowUserMenu(!showUserMenu);
    } else {
      // Open auth modal
      setIsAuthOpen(true);
    }
  };

  const handleProfileClick = async () => {
    if (!isAuthenticated) {
      logger.warn("User not authenticated, opening auth modal");
      setIsAuthOpen(true);
      setShowUserMenu(false);
      return;
    }

    if (profile?.username) {
      logger.info("Navigating to profile", { username: profile.username });
      router.push(`/profile/${profile.username}`);
    } else {
      // If authenticated but no username, try to fetch profile data first
      const currentProfile = await getCurrentProfile();
      if (currentProfile?.username) {
        logger.info("Navigating to profile after fetch", {
          username: currentProfile.username,
        });
        router.push(`/profile/${currentProfile.username}`);
      } else {
        logger.warn("Cannot navigate to profile: username not available");
        router.push("/profile");
      }
    }
    setShowUserMenu(false);
  };

  const handleLogout = async () => {
    logger.info("User logging out");
    await signOut();
    setShowUserMenu(false);
    router.push("/");
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
              <div className="relative">
                <button
                  id="user-menu-button"
                  onClick={handleUserButtonClick}
                  className={`p-2 hover:bg-[#f0f0f0] rounded-[4px] flex items-center ${isAuthenticated ? "text-[#FF3B3B]" : ""}`}
                  aria-label={isAuthenticated ? "User menu" : "Sign in"}
                >
                  {isAuthenticated && profile ? (
                    <div className="flex items-center gap-2">
                      <User size={20} />
                      <span className="hidden sm:block text-sm font-medium">
                        {profile.username}
                      </span>
                    </div>
                  ) : (
                    <User size={20} />
                  )}
                </button>

                {/* User dropdown menu */}
                {showUserMenu && isAuthenticated && (
                  <div
                    id="user-dropdown-menu"
                    className="absolute right-0 mt-2 w-48 bg-white border-2 border-black rounded-[4px] shadow-lg z-50"
                  >
                    <div className="p-2 border-b border-gray-200">
                      <p className="text-sm font-bold">{profile?.username}</p>
                      <p className="text-xs text-gray-600 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleProfileClick}
                        className="flex items-center w-full px-4 py-2 text-sm hover:bg-[#f0f0f0]"
                      >
                        <User size={16} className="mr-2" /> Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-[#f0f0f0]"
                      >
                        <LogOut size={16} className="mr-2" /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
