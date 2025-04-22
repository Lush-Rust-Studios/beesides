import React, { useState } from "react";
import { signIn } from "@/lib/supabase/auth";

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
}

export function LoginForm({
  onSuccess,
  onRegisterClick,
  onForgotPasswordClick,
}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { user, error: signInError } = await signIn(email, password);

    setIsLoading(false);

    if (signInError) {
      setError(signInError);
      return;
    }

    if (user) {
      onSuccess?.();
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-[4px] text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="block font-mono text-sm mb-2">EMAIL</label>
        <input
          type="email"
          required
          className="w-full p-3 border-2 border-black rounded-[4px] font-mono focus:outline-none focus:border-[#FF3B3B]"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-mono text-sm mb-2">PASSWORD</label>
        <input
          type="password"
          required
          className="w-full p-3 border-2 border-black rounded-[4px] font-mono focus:outline-none focus:border-[#FF3B3B]"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-black text-white p-3 rounded-[4px] font-bold hover:translate-x-1 hover:-translate-y-1 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0"
      >
        {isLoading ? "LOGGING IN..." : "LOGIN"}
      </button>
      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={onRegisterClick}
          className="font-bold hover:text-[#FF3B3B] transition"
        >
          CREATE ACCOUNT
        </button>
        <button
          type="button"
          onClick={onForgotPasswordClick}
          className="font-mono text-sm hover:text-[#FF3B3B] transition"
        >
          FORGOT PASSWORD?
        </button>
      </div>
    </form>
  );
}
