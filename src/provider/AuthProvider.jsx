import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { getUserAPI } from "../api/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateAuthState = (session) => {
    if (session) {
      setUser(session.user);
      setRole(session.user.user_metadata?.role || "patient");
    } else {
      setUser(null);
      setRole(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const session = await getUserAPI();
      updateAuthState(session);
      setLoading(false);
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        updateAuthState(session);
      },
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
