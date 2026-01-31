/**
 * Simple authentication store (in-memory)
 * In production, this would use proper auth with tokens, sessions, etc.
 */

let currentUser: { username: string } | null = null;

export const auth = {
  login(username: string, password: string): boolean {
    // Hardcoded credentials
    if (username === "Testing" && password === "Testing") {
      currentUser = { username };
      // Store in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("livestoq_user", JSON.stringify(currentUser));
      }
      return true;
    }
    return false;
  },

  logout(): void {
    currentUser = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("livestoq_user");
    }
  },

  getCurrentUser(): { username: string } | null {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("livestoq_user");
      if (stored) {
        currentUser = JSON.parse(stored);
      }
    }
    return currentUser;
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },
};
