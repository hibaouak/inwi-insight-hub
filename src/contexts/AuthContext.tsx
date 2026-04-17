import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  name: string;
  email: string;
  role: string;
  initials: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (fields: Partial<Pick<User, "name" | "email" | "role">>) => void;
  changePassword: (current: string, next: string) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("inwi_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = async (email: string, _password: string): Promise<boolean> => {
    const stored = localStorage.getItem("inwi_users");
    const users: Array<{ name: string; email: string; password: string; role: string }> = stored ? JSON.parse(stored) : [];
    const found = users.find(u => u.email === email);
    if (!found) return false;
    const u: User = {
      name: found.name,
      email: found.email,
      role: found.role,
      initials: found.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
    };
    setUser(u);
    localStorage.setItem("inwi_user", JSON.stringify(u));
    return true;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const stored = localStorage.getItem("inwi_users");
    const users: Array<{ name: string; email: string; password: string; role: string }> = stored ? JSON.parse(stored) : [];
    if (users.find(u => u.email === email)) return false;
    users.push({ name, email, password, role: "NOC Analyst" });
    localStorage.setItem("inwi_users", JSON.stringify(users));
    const u: User = {
      name,
      email,
      role: "NOC Analyst",
      initials: name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
    };
    setUser(u);
    localStorage.setItem("inwi_user", JSON.stringify(u));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("inwi_user");
  };

  const updateUser = (fields: Partial<Pick<User, "name" | "email" | "role">>) => {
    if (!user) return;
    const updated: User = {
      ...user,
      ...fields,
      initials: (fields.name ?? user.name).split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
    };
    setUser(updated);
    localStorage.setItem("inwi_user", JSON.stringify(updated));
    // update users list too
    const stored = localStorage.getItem("inwi_users");
    const users: Array<{ name: string; email: string; password: string; role: string }> = stored ? JSON.parse(stored) : [];
    const idx = users.findIndex(u => u.email === user.email);
    if (idx !== -1) {
      users[idx] = { ...users[idx], name: updated.name, email: updated.email, role: updated.role };
      localStorage.setItem("inwi_users", JSON.stringify(users));
    }
  };

  const changePassword = (current: string, next: string): boolean => {
    if (!user) return false;
    const stored = localStorage.getItem("inwi_users");
    const users: Array<{ name: string; email: string; password: string; role: string }> = stored ? JSON.parse(stored) : [];
    const idx = users.findIndex(u => u.email === user.email);
    if (idx === -1 || users[idx].password !== current) return false;
    users[idx].password = next;
    localStorage.setItem("inwi_users", JSON.stringify(users));
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, changePassword, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
