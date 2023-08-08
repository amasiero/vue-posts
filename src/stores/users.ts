import { defineStore } from 'pinia';
import { NewUser } from '../users';

interface UsersState {
  currentUserId?: string;
}

export const useUsers = defineStore('users', {
  state: (): UsersState => ({
    currentUserId: undefined,
  }),
  actions: {
    async authenticate() {
      try {
        const res = await window.fetch('/api/current-user', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result = await res.json();
        this.currentUserId = result.id;
      } catch (e) {
        this.currentUserId = undefined;
      }
    },
    async logout() {
      await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return this.authenticate();
    },
    async createUser(user: NewUser) {
      const body = JSON.stringify(user);
      await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
      return this.authenticate();
    },
  },
});
