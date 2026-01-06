import { createContext, useEffect, useState } from "react";

type AuthContextType = {
  isLoading: boolean;
  session: null | UserAPIResponse;
  save: (data: UserAPIResponse) => void;
};

const LOCAL_STORAGE_KEY = "@refund";

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<null | UserAPIResponse>(null);
  const [isLoading, setIsLoading] = useState(true);

  function save(data: UserAPIResponse) {
    localStorage.setItem(
      `${LOCAL_STORAGE_KEY}:user`,
      JSON.stringify(data.user)
    );
    localStorage.setItem(`${LOCAL_STORAGE_KEY}:token`, data.token);

    setSession(data);
  }

  function loadUser() {
    const storedUser = localStorage.getItem(`${LOCAL_STORAGE_KEY}:user`);
    const storedToken = localStorage.getItem(`${LOCAL_STORAGE_KEY}:token`);

    if (storedUser && storedToken) {
      setSession({
        user: JSON.parse(storedUser),
        token: storedToken,
      });
    }

    setIsLoading(false);
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ session, save, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
