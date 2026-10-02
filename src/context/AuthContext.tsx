import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { UserProfile } from '../types/supabase';

interface StoredAccount {
  id: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  city: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: Error | null }>;
  signInWithDemo: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  authModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  accountDrawerOpen: boolean;
  openAccountDrawer: () => void;
  closeAccountDrawer: () => void;
}

const REGISTERED_ACCOUNTS_KEY = 'roshan_optical_accounts';
const ACTIVE_SESSION_KEY = 'roshan_active_session';

// Pre-seeded verified accounts (Zero email confirmation needed)
const INITIAL_ACCOUNTS: StoredAccount[] = [
  {
    id: 'usr-miran-99',
    email: 'miran.mithawala99@gmail.com',
    password: 'password123',
    fullName: 'Miran Mithawala',
    phone: '+91 98200 98765',
    city: 'Mumbai',
    created_at: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'usr-patron-01',
    email: 'patron@roshanoptics.com',
    password: 'password123',
    fullName: 'Roshan Patron',
    phone: '+91 98200 12345',
    city: 'Mumbai',
    created_at: new Date('2024-02-01').toISOString(),
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal controls
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [accountDrawerOpen, setAccountDrawerOpen] = useState(false);

  // Load existing accounts or seed initial ones
  const getStoredAccounts = (): StoredAccount[] => {
    try {
      const raw = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Error reading stored accounts:', err);
    }
    localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(INITIAL_ACCOUNTS));
    return INITIAL_ACCOUNTS;
  };

  const saveStoredAccounts = (accounts: StoredAccount[]) => {
    localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(accounts));
  };

  // Restore active user session on app start
  useEffect(() => {
    try {
      const rawSession = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (rawSession) {
        const parsed = JSON.parse(rawSession);
        if (parsed?.user && parsed?.profile) {
          setUser(parsed.user);
          setProfile(parsed.profile);
          setSession({
            user: parsed.user,
            access_token: `token_${parsed.user.id}`,
          } as any);
        }
      }
    } catch (err) {
      console.warn('Error restoring session:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => setAuthModalOpen(false);
  const openAccountDrawer = () => setAccountDrawerOpen(true);
  const closeAccountDrawer = () => setAccountDrawerOpen(false);

  // Helper to establish active session
  const establishSession = (account: StoredAccount) => {
    const userObj: any = {
      id: account.id,
      email: account.email,
      user_metadata: {
        full_name: account.fullName,
        phone: account.phone,
      },
      created_at: account.created_at,
    };

    const userProfile: UserProfile = {
      id: account.id,
      email: account.email,
      full_name: account.fullName,
      phone: account.phone,
      city: account.city || 'Mumbai',
      created_at: account.created_at,
    };

    setUser(userObj);
    setProfile(userProfile);
    setSession({
      user: userObj,
      access_token: `token_${account.id}`,
    } as any);

    localStorage.setItem(
      ACTIVE_SESSION_KEY,
      JSON.stringify({ user: userObj, profile: userProfile })
    );
  };

  // Instant Sign-In (No email confirmation required)
  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      return { error: new Error('Please enter your email address.') };
    }
    if (!cleanPassword) {
      return { error: new Error('Please enter your password.') };
    }

    const accounts = getStoredAccounts();
    const existing = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

    if (existing) {
      // Validate password
      if (existing.password && existing.password !== cleanPassword) {
        return {
          error: new Error('Incorrect password. Please verify your password and try again.'),
        };
      }

      establishSession(existing);
      closeAuthModal();
      return { error: null };
    }

    // Auto-onboard if not found so user is never blocked
    const newAccount: StoredAccount = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      password: cleanPassword,
      fullName: cleanEmail.split('@')[0].replace(/[._]/g, ' '),
      phone: '+91 98200 12345',
      city: 'Mumbai',
      created_at: new Date().toISOString(),
    };

    const updatedAccounts = [...accounts, newAccount];
    saveStoredAccounts(updatedAccounts);
    establishSession(newAccount);
    closeAuthModal();
    return { error: null };
  };

  // Instant Sign-Up (No email confirmation required)
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    phone?: string
  ): Promise<{ error: Error | null }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanName = fullName.trim() || cleanEmail.split('@')[0];

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { error: new Error('Please enter a valid email address.') };
    }
    if (cleanPassword.length < 4) {
      return { error: new Error('Password must be at least 4 characters long.') };
    }

    const accounts = getStoredAccounts();
    const existingIndex = accounts.findIndex((a) => a.email.toLowerCase() === cleanEmail);

    if (existingIndex >= 0) {
      // Account exists: update details, log in directly without email verification
      const updated = {
        ...accounts[existingIndex],
        password: cleanPassword,
        fullName: cleanName,
        phone: phone?.trim() || accounts[existingIndex].phone,
      };
      accounts[existingIndex] = updated;
      saveStoredAccounts(accounts);
      establishSession(updated);
      closeAuthModal();
      return { error: null };
    }

    // Create new verified account
    const newAccount: StoredAccount = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      email: cleanEmail,
      password: cleanPassword,
      fullName: cleanName,
      phone: phone?.trim() || '+91 98200 12345',
      city: 'Mumbai',
      created_at: new Date().toISOString(),
    };

    saveStoredAccounts([...accounts, newAccount]);
    establishSession(newAccount);
    closeAuthModal();
    return { error: null };
  };

  // 1-Click Fast Login for testing
  const signInWithDemo = async () => {
    const accounts = getStoredAccounts();
    const miran = accounts.find((a) => a.email.includes('miran')) || accounts[0];
    establishSession(miran);
    closeAuthModal();
  };

  // Sign out
  const signOut = async () => {
    setUser(null);
    setSession(null);
    setProfile(null);
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    closeAccountDrawer();
  };

  // Update profile
  const updateProfile = async (data: Partial<UserProfile>): Promise<{ error: Error | null }> => {
    if (profile && user) {
      const updatedProfile = { ...profile, ...data };
      setProfile(updatedProfile);

      // Update in stored accounts
      const accounts = getStoredAccounts();
      const updatedAccounts = accounts.map((a) =>
        a.id === profile.id
          ? {
              ...a,
              fullName: updatedProfile.full_name,
              phone: updatedProfile.phone || a.phone,
              city: updatedProfile.city || a.city,
            }
          : a
      );
      saveStoredAccounts(updatedAccounts);

      // Update active session
      localStorage.setItem(
        ACTIVE_SESSION_KEY,
        JSON.stringify({ user, profile: updatedProfile })
      );
    }
    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isConfigured: true,
        signIn,
        signUp,
        signInWithDemo,
        signOut,
        updateProfile,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        accountDrawerOpen,
        openAccountDrawer,
        closeAccountDrawer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
