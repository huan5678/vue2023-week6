import { defineStore } from 'pinia';
import {
  handleAddToCart,
  handleDeleteAllCart,
  handleDeleteCart,
  handleEditCart,
  handleGetCart,
} from '@/api';
import { CurrentSimpleResponse, ICart } from '@/types';
import { useMessageStore } from './message.store';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartData: [] as ICart[],
    finalTotal: 0,
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
      const { data } = await handleGetCart() as unknown as {data: {carts: ICart[]; final_total: number; id: string}};
      this.cartData = data.carts;
      this.finalTotal = data.final_total;
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
      await this.performCartAction(() => handleAddToCart(id, qty) as unknown as Promise<CurrentSimpleResponse>);
    },
    async updateCartData(id: string, product: {id: string; qty: number}) {
      await this.performCartAction(() => handleEditCart(id, product) as unknown as Promise<CurrentSimpleResponse>);
    },
    async deleteCartData(id: string) {
      await this.performCartAction(() => handleDeleteCart(id) as unknown as Promise<CurrentSimpleResponse>);
    },
    async clearCartData() {
      await this.performCartAction(() => handleDeleteAllCart() as unknown as Promise<CurrentSimpleResponse>);
    },
  },
});

export default useCartStore;
