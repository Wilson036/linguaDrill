'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import AuthForm from './auth-form';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  returnUrl?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  returnUrl,
}: AuthModalProps) {
  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  // 阻止背景滾動
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="hover:bg-muted absolute top-4 right-4 rounded-full p-1"
        >
          <X className="h-5 w-5" />
        </button>

        <AuthForm onSuccess={handleSuccess} returnUrl={returnUrl} />
      </div>
    </div>
  );
}
