import { create } from 'zustand';

interface User {
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const STORAGE_KEY = 'ts-venn-auth';

function loadFromStorage(): User | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveToStorage(user: User | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

const initialUser = loadFromStorage();

export const useAuthState = create<AuthState>((set) => ({
  user: initialUser,
  isAuthenticated: initialUser !== null,

  login: (email: string, _password: string) => {
    const user: User = {
      email,
      name: email.split('@')[0],
    };
    saveToStorage(user);
    set({ user, isAuthenticated: true });
    return true;
  },

  logout: () => {
    saveToStorage(null);
    set({ user: null, isAuthenticated: false });
  },
}));
