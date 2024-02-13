import { defineStore } from 'pinia';
import { handleGetProducts, handleGetAdminProducts } from '@/api';
import { IProduct, ProductsData } from '@/types';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as IProduct[],
    productsData: {} as ProductsData,
    isModalOpen: false,
    temp: {
      id: '',
      title: '',
      category: '',
      content: '',
      description: '',
      imageUrl: '',
      imagesUrl: [''],
      is_enabled: 0,
      origin_price: 0,
      price: 0,
      unit: '',
      top: false,
    },
  }),
  actions: {
    async getAdminProducts() {
      const data = await handleGetAdminProducts();
      this.productsData = data.products as unknown as ProductsData;
    },
    async getProducts(page: string, category: string) {
      const { data } = await handleGetProducts(page, category);
      this.products = data as IProduct[];
    },
    async tempRest()
    {
      this.temp = {
        id: '',
        title: '',
        category: '',
        content: '',
        description: '',
        imageUrl: '',
        imagesUrl: [],
        is_enabled: 0,
        origin_price: 0,
        price: 0,
        unit: '',
        top: false,
      };
    },
  },
});
