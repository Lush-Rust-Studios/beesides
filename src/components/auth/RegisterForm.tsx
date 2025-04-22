import React, { useState } from "react";
import { signUp, verifyEmail } from "@/lib/supabase/auth";

interface RegisterFormProps {
  onSuccess?: () => void;
  onLoginClick: () => void;
}

export function RegisterForm({ onSuccess, onLoginClick }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    // Validate password strength
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password.length < 8 || !hasUpperCase || !hasNumber) {
      setError(
        "Password must be at least 8 characters with 1 uppercase letter and 1 number"
      );
      setIsLoading(false);
      return;
    }

    const {
      user,
      error: signUpError,
      message: signUpMessage,
    } = await signUp(email, password, username);

    setIsLoading(false);

    if (signUpError) {
      setError(signUpError);
      return;
    }

    if (user) {
      // Set verification sent to true to show verification code input
      setVerificationSent(true);
      setMessage(
        signUpMessage || "Please check your email for a verification code"
      );
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!verificationCode || verificationCode.trim() === "") {
      setError("Please enter the verification code from your email");
      setIsLoading(false);
      return;
    }

    const { success, error: verifyError } = await verifyEmail(
      email,
      verificationCode
    );

    setIsLoading(false);

    if (verifyError) {
      setError(verifyError);
      return;
    }

    if (success) {
      onSuccess?.();
    }
  };

  if (verificationSent) {
    return (
      <form onSubmit={handleVerification} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-[4px] text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="p-3 bg-green-100 border border-green-300 text-green-800 rounded-[4px] text-sm">
            {message}
          </div>
        )}
        <div>
          <label className="block font-mono text-sm mb-2">
            VERIFICATION CODE
          </label>
          <input
            type="text"
            required
            className="w-full p-3 border-2 border-black rounded-[4px] font-mono focus:outline-none focus:border-[#FF3B3B]"
            placeholder="Enter code from your email"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#FF3B3B] text-white p-3 rounded-[4px] font-bold hover:translate-x-1 hover:-translate-y-1 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0"
        >
          {isLoading ? "VERIFYING..." : "VERIFY EMAIL"}
        </button>
        <div className="text-center pt-4">
          <span className="font-mono text-sm">DIDN'T RECEIVE A CODE? </span>
          <button
            type="button"
            onClick={() => {
              setVerificationSent(false);
              setVerificationCode("");
            }}
            className="font-bold hover:text-[#FF3B3B] transition"
          >
            TRY AGAIN
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-[4px] text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="block font-mono text-sm mb-2">USERNAME</label>
        <input
          type="text"
          required
          className="w-full p-3 border-2 border-black rounded-[4px] font-mono focus:outline-none focus:border-[#FF3B3B]"
          placeholder="cooluser123"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
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
        <p className="text-xs font-mono mt-1 text-gray-600">
          MINIMUM 8 CHARACTERS, 1 UPPERCASE, 1 NUMBER
        </p>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#FF3B3B] text-white p-3 rounded-[4px] font-bold hover:translate-x-1 hover:-translate-y-1 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0"
      >
        {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
      </button>
      <div className="text-center pt-4">
        <span className="font-mono text-sm">ALREADY HAVE AN ACCOUNT? </span>
        <button
          type="button"
          onClick={onLoginClick}
          className="font-bold hover:text-[#FF3B3B] transition"
        >
          LOGIN
        </button>
      </div>
    </form>
  );
}
