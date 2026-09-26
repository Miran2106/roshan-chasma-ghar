import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile } from '../types/supabase';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: Error | null }>;
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

const LOCAL_USER_KEY = 'roshan_demo_user';

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

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => setAuthModalOpen(false);
  const openAccountDrawer = () => setAccountDrawerOpen(true);
  const closeAccountDrawer = () => setAccountDrawerOpen(false);

  // Fetch or create profile
  const fetchProfile = async (userId: string, userEmail: string) => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (!error && data) {
          setProfile(data as UserProfile);
          return;
        }
      } catch (err) {
        console.warn('Error fetching Supabase profile:', err);
      }
    }

    // Fallback profile
    setProfile({
      id: userId,
      email: userEmail,
      full_name: user?.user_metadata?.full_name || 'Roshan Patron',
      phone: user?.user_metadata?.phone || '+91 98200 12345',
      city: 'Mumbai',
      created_at: new Date().toISOString(),
    });
  };

  useEffect(() => {
    if (isSupabaseConfigured) {
      // 1. Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id, session.user.email ?? '');
        }
        setLoading(false);
      });

      // 2. Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id, session.user.email ?? '');
        } else {
          setProfile(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Offline fallback: check localStorage for saved demo user
      try {
        const saved = localStorage.getItem(LOCAL_USER_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setUser(parsed.user);
          setProfile(parsed.profile);
        }
      } catch (err) {
        console.warn('Local user read error:', err);
      }
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error };
      if (data.user) {
        await fetchProfile(data.user.id, data.user.email ?? email);
      }
      closeAuthModal();
      return { error: null };
    }

    // Demo offline sign-in
    const mockUser: any = {
      id: `usr-${Date.now()}`,
      email,
      user_metadata: { full_name: email.split('@')[0] },
      created_at: new Date().toISOString(),
    };
    const mockProfile: UserProfile = {
      id: mockUser.id,
      email,
      full_name: email.split('@')[0],
      phone: '+91 98200 54321',
      city: 'Mumbai',
      created_at: new Date().toISOString(),
    };
    setUser(mockUser);
    setProfile(mockProfile);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({ user: mockUser, profile: mockProfile }));
    closeAuthModal();
    return { error: null };
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    phone?: string
  ): Promise<{ error: Error | null }> => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone || '',
          },
        },
      });
      if (error) return { error };
      if (data.user) {
        await fetchProfile(data.user.id, data.user.email ?? email);
      }
      closeAuthModal();
      return { error: null };
    }

    // Demo offline sign-up
    const mockUser: any = {
      id: `usr-${Date.now()}`,
      email,
      user_metadata: { full_name: fullName, phone },
      created_at: new Date().toISOString(),
    };
    const mockProfile: UserProfile = {
      id: mockUser.id,
      email,
      full_name: fullName,
      phone: phone || '',
      city: 'Mumbai',
      created_at: new Date().toISOString(),
    };
    setUser(mockUser);
    setProfile(mockProfile);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({ user: mockUser, profile: mockProfile }));
    closeAuthModal();
    return { error: null };
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    localStorage.removeItem(LOCAL_USER_KEY);
    closeAccountDrawer();
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<{ error: Error | null }> => {
    if (profile) {
      const updated = { ...profile, ...data };
      setProfile(updated);

      if (isSupabaseConfigured && user) {
        const { error } = await supabase
          .from('profiles')
          .update(data)
          .eq('id', user.id);
        if (error) return { error };
      } else {
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({ user, profile: updated }));
      }
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
        isConfigured: isSupabaseConfigured,
        signIn,
        signUp,
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
