import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (mounted) {
        if (error) {
          setError(error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setError(null); // Clear any previous errors
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);
  const signIn = async (email, password) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error);
        throw error;
      }
      return data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };
  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error);
        throw error;
      }
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });

    if (error) throw error;
    return data;
  };

  const updatePassword = async (password) => {
    const { data, error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) throw error;
    return data;
  };

  const isAuthenticated = () => {
    return !!user;
  };
  const value = {
    user,
    session,
    loading,
    error,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    isAuthenticated,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
