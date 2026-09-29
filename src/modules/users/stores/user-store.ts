import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import type { User } from "@/payload-types";

export interface AuthStoreState {
  user: User | null;
}

export interface AuthStoreActions {
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
}

export interface AuthStore extends AuthStoreState {
  actions: AuthStoreActions;
}

export const useAuthStore = createWithEqualityFn<AuthStore>()(
  persist(
    immer((set) => ({
      actions: {
        login: (user) => {
          set((state) => {
            state.user = user;
          });
        },

        logout: () => {
          set((state) => {
            state.user = null;
          });
        },

        setUser: (user) => {
          set((state) => {
            state.user = user;
          });
        },

        updateUser: (updates) => {
          set((state) => {
            if (state.user) {
              Object.assign(state.user, updates);
            }
          });
        },
      },
      user: null,
    })),
    {
      name: "tvh_users",

      partialize: (state) => ({
        user: state.user,
      }),
    }
  ),
  shallow
);

export const useIsAuthenticated = () =>
  useAuthStore((state) => Boolean(state.user));

export const useAuthUser = () => useAuthStore((state) => state.user);

export const useAuthActions = () => useAuthStore((state) => state.actions);
