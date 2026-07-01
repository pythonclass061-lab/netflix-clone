import { create } from 'zustand';
import { User, Content } from '@/types';

interface AppState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  selectedProfile: number;
  myList: Content[];

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  setSelectedProfile: (index: number) => void;
  setMyList: (list: Content[]) => void;
  addToMyList: (content: Content) => void;
  removeFromMyList: (contentId: string) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: false,
  selectedProfile: 0,
  myList: [],

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token, isAuthenticated: !!token });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false, myList: [] });
  },

  setSelectedProfile: (index) => set({ selectedProfile: index }),

  setMyList: (list) => set({ myList: list }),

  addToMyList: (content) => set((state) => ({
    myList: [...state.myList, content]
  })),

  removeFromMyList: (contentId) => set((state) => ({
    myList: state.myList.filter((item) => item._id !== contentId)
  })),
}));
