<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Loader2 } from 'lucide-vue-next';
import { handleGetProductsAll } from '@/api';
import { Button } from '@/components/ui/button';
import
{
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCartStore, useMessageStore } from '@/stores';
import { IProduct } from '@/types';

const productsData = ref<IProduct[]>([]);

const isLoading = ref('');

const cartStore = useCartStore();
const { addCartData } = cartStore;
const { showMessage } = useMessageStore();

const handleAddCart = async (id: string) => {
  isLoading.value = id;
  await addCartData(id, 1);
  isLoading.value = '';
};

onMounted(async () => {
  try {
    const { products } = await handleGetProductsAll();
    productsData.value = products as IProduct[];
  } catch (error: unknown) {
    showMessage((error as Error).message);
  }
});
</script>

<template>
  <section class="h-[80vh] bg-gray-300 py-6">
    <div class="container h-full">
      <div class="flex h-full items-center justify-end">
        <h1 class="text-6xl text-gray-700">
          Home View
        </h1>
      </div>
    </div>
  </section>
  <section class="px-10 py-20">
    <h2 class="mb-8 text-4xl">
      產品列表
    </h2>
    <div class="container">
      <ul class="grid grid-cols-4 gap-4">
        <Card
          v-for="item in productsData"
          :key="item.id"
        >
          <CardHeader>
            <CardTitle>{{ item.title }}</CardTitle>
            <CardDescription>{{ item.description }}</CardDescription>
          </CardHeader>
          <CardContent>
            <img
              class="aspect-video object-cover"
              :src="item.imageUrl"
              alt=""
            >
          </CardContent>
          <CardFooter>
            <div class="flex items-center justify-between">
              <span class="text-xl font-bold text-gray-500">NT${{ item.price.toLocaleString()
              }}</span>
              <Button
                :disabled="isLoading === item.id"
                @click="handleAddCart(item.id as string)"
              >
                <Loader2
                  v-if="isLoading === item.id"
                  class="mr-2 size-4 animate-spin"
                />
                {{ isLoading === item.id ? '...' : '加入購物車' }}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </ul>
    </div>
  </section>
</template>
