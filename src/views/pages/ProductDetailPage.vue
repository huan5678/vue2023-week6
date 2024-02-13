<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ThumbsUp } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { handleAddToCart, handleGetProduct } from '@/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import
{
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCartStore, useMessageStore } from '@/stores';
import { ICart, IProduct } from '@/types';

const messageStore = useMessageStore();
const { showMessage } = messageStore;

const cartStore = useCartStore();
const { getCartData, updateCartData } = cartStore;
const {
  cartData,
} = storeToRefs(cartStore);
const router = useRouter();

const isLoading = ref(false);

const qty = ref('1');
const product = ref({} as IProduct);

onMounted(
  async () => {
    try {
      const { id } = router.currentRoute.value.params;
      const res = await handleGetProduct(id as string);
      product.value = res.product as IProduct;
    } catch (error: unknown) {
      showMessage((error as Error).message);
    }
  },
);

const handleUpdateCartQty = async (
  id: string,
) => {
  isLoading.value = true;
  await getCartData();
  if (cartData.value.some((item: ICart) => item.id === id)) {
    await updateCartData(id, { id, qty: parseInt(qty.value, 10) });
  } else {
    const res = await handleAddToCart(id, parseInt(qty.value, 10));
    if (res.success) {
      showMessage(res.message as string);
    }
  }
  getCartData();
  isLoading.value = false;
};

</script>

<template>
  <main class="container py-20">
    <div
      v-if="product && product.title !== undefined"
      class="flex flex-col"
    >
      <div class="grid grid-cols-3 gap-2">
        <img
          :src="product.imageUrl"
          class="col-span-2 aspect-video size-full rounded object-cover object-center"
          alt="主圖"
        >
        <div class="flex flex-auto flex-col gap-2">
          <img
            v-for="img in product.imagesUrl"
            :key="img"
            :src="img"
            class="max-h-48 rounded object-cover object-center"
            alt=""
          >
        </div>
      </div>
      <div class="flex flex-col gap-2 py-4">
        <div class="flex items-center gap-4 border-b pb-2">
          <h5 class="text-2xl font-medium">
            {{ product.title }}
          </h5>
          <Badge>
            {{
              product.category
            }}
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <div
                  :class="`p-2 ml-auto rounded ${product.top ? 'bg-amber-400 text-gray-50' : 'bg-gray-200 text-gray-700'}`"
                >
                  <ThumbsUp class="size-6" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div
                  :class="`p-2 text-sm  ${product.top ? 'text-amber-500' : 'text-gray-700 bg-white'}`"
                >
                  {{ product.top ? '熱門商品' : '普通商品' }}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div class="flex justify-between">
          <div>
            <p>商品描述：{{ product.description }}</p>
            <p>商品內容：{{ product.content }}</p>
          </div>
          <div class="flex items-center gap-2">
            <p>NT$ {{ product.price.toLocaleString() }}</p>
            <p class="text-sm">
              <span class="line-through">{{ product.origin_price.toLocaleString() }}</span>
            </p>
            元 / {{ product.unit }}
          </div>
        </div>
      </div>
      <div class="ml-auto mt-4 w-1/3">
        <div class="flex items-center gap-4">
          <Select v-model="qty">
            <SelectTrigger>
              <SelectValue>
                {{ qty }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="i in 10"
                  :key="i"
                  :value="i.toString()"
                >
                  {{ i }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            :disabled="isLoading"
            @click="() => handleUpdateCartQty(product.id as string)"
          >
            <Loader2
              v-if="isLoading"
              class="mr-2 size-4 animate-spin"
            />
            {{ isLoading ? '...' : '加入購物車' }}
          </Button>
        </div>
      </div>
    </div>
  </main>
</template>
