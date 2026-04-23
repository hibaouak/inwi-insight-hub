import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "admin" | "technician";

export interface User {
  name: string;
  email: string;
  role: UserRole;
  initials: string;
}

interface StoredUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateUser: (fields: Partial<Pick<User, "name" | "email" | "role">>) => void;
  changePassword: (current: string, next: string) => boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function makeInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("inwi_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = async (email: string, _password: string): Promise<boolean> => {
    const stored = localStorage.getItem("inwi_users");
    const users: StoredUser[] = stored ? JSON.parse(stored) : [];
    const found = users.find(u => u.email === email && u.password === _password);
    if (!found) return false;
    const u: User = {
      name: found.name,
      email: found.email,
      role: found.role,
      initials: makeInitials(found.name),
    };
    setUser(u);
    localStorage.setItem("inwi_user", JSON.stringify(u));
    return true;
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    const stored = localStorage.getItem("inwi_users");
    const users: StoredUser[] = stored ? JSON.parse(stored) : [];
    if (users.find(u => u.email === email)) return false;
    users.push({ name, email, password, role });
    localStorage.setItem("inwi_users", JSON.stringify(users));
    const u: User = { name, email, role, initials: makeInitials(name) };
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
      initials: makeInitials(fields.name ?? user.name),
    };
    setUser(updated);
    localStorage.setItem("inwi_user", JSON.stringify(updated));
    const stored = localStorage.getItem("inwi_users");
    const users: StoredUser[] = stored ? JSON.parse(stored) : [];
    const idx = users.findIndex(u => u.email === user.email);
    if (idx !== -1) {
      users[idx] = { ...users[idx], name: updated.name, email: updated.email, role: updated.role };
      localStorage.setItem("inwi_users", JSON.stringify(users));
    }
  };

  const changePassword = (current: string, next: string): boolean => {
    if (!user) return false;
    const stored = localStorage.getItem("inwi_users");
    const users: StoredUser[] = stored ? JSON.parse(stored) : [];
    const idx = users.findIndex(u => u.email === user.email);
    if (idx === -1 || users[idx].password !== current) return false;
    users[idx].password = next;
    localStorage.setItem("inwi_users", JSON.stringify(users));
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateUser,
      changePassword,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
