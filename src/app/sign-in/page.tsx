"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { useAuthStore } from "@/lib/supabase/session";
import { createLogger } from "@/lib/utils/logger";

type AuthView = "login" | "register" | "forgot-password";

const logger = createLogger("page:SignIn");

export default function SignInPage() {
  const [authView, setAuthView] = useState<AuthView>("login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    // If already authenticated, redirect to the next path
    if (!isLoading && isAuthenticated) {
      logger.info("User already authenticated, redirecting", {
        nextPath,
      });
      router.push(nextPath);
    }
  }, [isAuthenticated, isLoading, router, nextPath]);

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

  const handleSuccess = () => {
    logger.info("Authentication successful, redirecting");
    router.push(nextPath);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-[4px] border-4 border-black">
        <div>
          <h2 className="text-3xl font-black text-center">{getAuthTitle()}</h2>
        </div>

        {authView === "login" && (
          <LoginForm
            onSuccess={handleSuccess}
            onRegisterClick={() => setAuthView("register")}
            onForgotPasswordClick={() => setAuthView("forgot-password")}
          />
        )}
        {authView === "register" && (
          <RegisterForm
            onSuccess={handleSuccess}
            onLoginClick={() => setAuthView("login")}
          />
        )}
        {authView === "forgot-password" && (
          <ForgotPasswordForm
            onSuccess={() => {
              setTimeout(handleSuccess, 2000);
            }}
            onBackToLogin={() => setAuthView("login")}
          />
        )}
      </div>
    </div>
  );
}
