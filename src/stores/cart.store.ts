import {
  handleAddToCart,
  handleDeleteAllCart,
  handleDeleteCart,
  handleEditCart,
  handleGetCart,
} from '@/api';
import { defineStore } from 'pinia';
import { useMessageStore } from './message.store';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartData: [] as Cart[],
    final_total: 0,
    cartId: '',
    isCartOpen: false,
    isModalOpen: false,
  }),
  actions: {
    async showMessage(message: string) {
      const messageStore = useMessageStore();
      messageStore.showMessage(message);
    },
    async getCartData() {
      const { data } = await handleGetCart();
      this.cartData = data.carts;
      this.final_total = data.final_total;
      this.cartId = data.id;
    },
    async performCartAction(action: () => Promise<{success: boolean; message: string}>) {
      const { success, message } = await action();
      if (success) {
        this.showMessage(message);
        this.getCartData();
      }
    },
    openCart() {
      this.isCartOpen = true;
    },
    closeCart() {
      this.isCartOpen = false;
    },
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    async addCartData(id: string, qty: number) {
      await this.performCartAction(() => handleAddToCart(id, qty));
    },
    async updateCartData(id: string, product: {id: string; qty: number}) {
      await this.performCartAction(() => handleEditCart(id, product));
    },
    async deleteCartData(id: string) {
      await this.performCartAction(() => handleDeleteCart(id));
    },
    async clearCartData() {
      await this.performCartAction(() => handleDeleteAllCart());
    },
  },
});
