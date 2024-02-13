import Cookies from 'js-cookie';
import { defineStore } from 'pinia';
import {
  handleLogin,
} from '@/api';
import { useMessageStore } from './message.store';

export const useUserStore = defineStore('user', {
  state: () => ({
    isLogin: false,
    token: '',
  }),
  actions: {
    async showMessage(message: string) {
      const messageStore = useMessageStore();
      messageStore.showMessage(message);
    },
    async userLogin(username: string, password: string) {
      const { token, message, success } = await handleLogin(username, password);
      this.token = token;
      this.showMessage(message as string);
      if (token) {
        Cookies.set('token', token);
      }
      return success;
    },
  },
});

export default useUserStore;
