import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    accessToken: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user && !!state.accessToken,
  },

  actions: {
    // Set user and accessToken in the store and localStorage
    setUser(user, accessToken) {
      this.user = user;
      this.accessToken = accessToken;
      localStorage.setItem('user', JSON.stringify(user)); 
      localStorage.setItem('accessToken', accessToken); 
    },

    // Get user and accessToken from localStorage and set them in the store
    loadUserFromStorage() {
      const user = JSON.parse(localStorage.getItem('user'));
      const accessToken = localStorage.getItem('accessToken');
      if (user && accessToken) {
        this.user = user;
        this.accessToken = accessToken;
      }
    },

    // Action for logging out (clearing the user and accessToken from both store and localStorage)
    logout() {
      this.user = null;
      this.accessToken = null;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    },
  },

  // Call loadUserFromStorage when the store is initialized
  persist: true,  // Pinia plugin to persist store across refreshes
  created() {
    this.loadUserFromStorage();
  }
});
