import React, { useState } from "react";
import { signUp } from "@/lib/supabase/auth";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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

    const { user, error: signUpError } = await signUp(
      email,
      password,
      username
    );

    setIsLoading(false);

    if (signUpError) {
      setError(signUpError);
      return;
    }

    if (user) {
      // User is automatically signed in, proceed to success callback
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

export default RegisterForm;
