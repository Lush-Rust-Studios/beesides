import React from "react";
import { X } from "lucide-react";
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}
export function AuthModal({
  isOpen,
  onClose,
  children,
  title,
}: AuthModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-full max-w-md rounded-[4px] border-4 border-black relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 hover:text-[#FF3B3B] transition"
        >
          <X size={24} />
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-black mb-6">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}
