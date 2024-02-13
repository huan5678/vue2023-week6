import {
  handleLogin,
} from '@/api';
import { defineStore } from 'pinia';
import { useMessageStore } from './message.store';
import Cookies from 'js-cookie';

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
      console.log(token, message, success);
      this.showMessage(message as string);
      if(token){
        Cookies.set('token', token);
      }
      return success;
    }
},
});
