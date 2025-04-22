import React, { useState } from 'react';
interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  onBackToLogin: () => void;
}
export function ForgotPasswordForm({
  onSuccess,
  onBackToLogin
}: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement actual password reset logic
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setIsLoading(false);
    setIsSubmitted(true);
    onSuccess?.();
  };
  if (isSubmitted) {
    return <div className="text-center">
        <div className="bg-green-50 border-2 border-green-500 rounded-[4px] p-4 mb-4">
          <p className="font-mono text-sm text-green-700">
            CHECK YOUR EMAIL FOR PASSWORD RESET INSTRUCTIONS
          </p>
        </div>
        <button onClick={onBackToLogin} className="font-bold hover:text-[#FF3B3B] transition">
          BACK TO LOGIN
        </button>
      </div>;
  }
  return <form onSubmit={handleSubmit} className="space-y-4">
      <p className="font-mono text-sm mb-4">
        ENTER YOUR EMAIL ADDRESS AND WE'LL SEND YOU A LINK TO RESET YOUR
        PASSWORD
      </p>
      <div>
        <label className="block font-mono text-sm mb-2">EMAIL</label>
        <input type="email" required className="w-full p-3 border-2 border-black rounded-[4px] font-mono focus:outline-none focus:border-[#FF3B3B]" placeholder="you@example.com" />
      </div>
      <button type="submit" disabled={isLoading} className="w-full bg-black text-white p-3 rounded-[4px] font-bold hover:translate-x-1 hover:-translate-y-1 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0">
        {isLoading ? 'SENDING...' : 'RESET PASSWORD'}
      </button>
      <div className="text-center pt-4">
        <button type="button" onClick={onBackToLogin} className="font-bold hover:text-[#FF3B3B] transition">
          BACK TO LOGIN
        </button>
      </div>
    </form>;
}