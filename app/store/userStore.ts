import { create } from "zustand";
import { persist } from "zustand/middleware";

// -----------------------------------------
// User Interface
// -----------------------------------------
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  image: string | null;
  gender: string;
  dob: string;
  addressLatLong: string;
  type: string; // role
}

// -----------------------------------------
// Store Interface
// -----------------------------------------
interface UserStore {
  user: User | null;
  token: string | null;

  // local-only image file (NOT persisted)
  newImageFile: File | null;

  // reset password flow
  resetEmail: string | null;
  verificationEmail: string | null;

  // hydration flag
  isHydrated: boolean;

  // setters
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;

  setNewImageFile: (file: File | null) => void;

  setResetEmail: (email: string) => void;
  setVerificationEmail: (email: string) => void;

  setHydrated: () => void;

  logout: () => void;
}

// -----------------------------------------
// Zustand Store with Persistence
// -----------------------------------------
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      newImageFile: null,

      resetEmail: null,
      verificationEmail: null,

      isHydrated: false, // ⭐ مهم

      // SETTERS
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),

      setNewImageFile: (file) => set({ newImageFile: file }),

      setResetEmail: (email) => set({ resetEmail: email }),
      setVerificationEmail: (email) => set({ verificationEmail: email }),

      // hydration setter
      setHydrated: () => set({ isHydrated: true }),

      // LOGOUT
      logout: () =>
        set({
          user: null,
          token: null,
          resetEmail: null,
          verificationEmail: null,
          newImageFile: null,
        }),
    }),

    {
      name: "skillvera-user-storage",

      partialize: (state) => ({
        user: state.user,
        token: state.token,
        resetEmail: state.resetEmail,
        verificationEmail: state.verificationEmail,
      }),

      // ⭐ after rehydrate, mark store as ready
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated();
        }
      },
    }
  )
);