import React, { createContext, useContext, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import AuthModal from '../components/AuthModal';

interface AuthModalContextType {
  isAuthModalOpen: boolean;
  authModalTab: 'signin' | 'register';
  initialEmail?: string;
  redirectUrl?: string;
  openAuthModal: (tab?: 'signin' | 'register', email?: string, redirectUrl?: string) => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'register'>('signin');
  const [initialEmail, setInitialEmail] = useState<string>('');
  const [redirectUrl, setRedirectUrl] = useState<string>('');

  const openAuthModal = (tab: 'signin' | 'register' = 'signin', email: string = '', url: string = '') => {
    setAuthModalTab(tab);
    setInitialEmail(email);
    setRedirectUrl(url);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setRedirectUrl('');
  };

  return (
    <AuthModalContext.Provider value={{ isAuthModalOpen, authModalTab, initialEmail, redirectUrl, openAuthModal, closeAuthModal }}>
      {children}
      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={closeAuthModal}
            initialTab={authModalTab}
            initialEmail={initialEmail}
            redirectUrl={redirectUrl}
          />
        )}
      </AnimatePresence>
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};
