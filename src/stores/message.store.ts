import { defineStore } from 'pinia';

export const useMessageStore = defineStore('message', {
  state: () => ({
    message: '',
    isShow: false,
  }),
  actions: {
    toggleMessage() {
      this.isShow = !this.isShow;
    },
    showMessage(newMessage: string) {
      this.isShow = true;
      this.message = newMessage;
      setTimeout(() => {
        this.isShow = false;
      }, 3000);
    },
  },
});

export default useMessageStore;
