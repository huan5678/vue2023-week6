<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp } from 'lucide-vue-next';
import
{
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import
{
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

import EditModal from '@/components/EditModal.vue';


import { useMessageStore, useProductStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { SimpleResponse } from '@/types';
import { handleUpdateAdminProduct, handleDeleteAdminProduct } from '@/api';
import { AxiosError } from 'axios';

const messageStore = useMessageStore();
const { showMessage } = messageStore;

const productStore = useProductStore();
const { isModalOpen, temp, productsData } = storeToRefs(productStore);
const { tempRest, getAdminProducts } = productStore;

const router = useRouter();

const isLoading = ref('');

onMounted(
  async () =>
  {
    try {
      await getAdminProducts();
      const id = router.currentRoute.value.params.id;
      const product = productsData.value[ id as string ];
      temp.value = {
        ...product,
        id: id as string,
        is_enabled: product.is_enabled ? 1 : 0,
        top: product.top as boolean,
      };
    } catch (error: unknown) {
      showMessage((error as Error).message);
    }
  });


function handleCloseModal()
{
  isModalOpen.value = false;
  tempRest();
}


const dynamicIsLoading = computed(() =>
{
  return isLoading.value;
});

function handleLoading(id: string)
{
  isLoading.value = id;
}

async function handleUpdateProduct()
{
  try {
    isLoading.value = temp.value.id;
    const res = await handleUpdateAdminProduct(temp.value.id as string, {
      ...temp.value,
      is_enabled: temp.value.is_enabled ? 1 : 0,
      top: temp.value.top,
    });

    showMessage(res.message as string);
    isLoading.value = '';
    await getAdminProducts();
    handleCloseModal();
  } catch (error: unknown) {
    if ((error as AxiosError<SimpleResponse>).response?.data.success === false) {
      showMessage(`更新商品失敗 ${(error as AxiosError<SimpleResponse>).response?.data.message}`);
      isLoading.value = '';
    }
  }
}

async function handleDeleteProduct(id: string)
{
  try {
    await handleDeleteAdminProduct(id);
    showMessage('刪除成功');
    router.push('/dashboard/products');
  } catch (error: unknown) {
    showMessage((error as AxiosError<SimpleResponse>).response?.data.message as string);
  }
}

</script>

<template>
  <main class="container py-20">
    <div class="flex flex-col" v-if="temp && temp.title !== undefined">
      <div class="grid grid-cols-3 gap-2">
        <img :src="temp.imageUrl"
             class="object-cover object-center w-full col-span-2 rounded aspect-video max-h-80"
             alt="主圖" />
        <div class="flex flex-wrap gap-2">
          <img :src="img" class="object-cover object-center rounded max-h-48" alt=""
               v-for="img in temp.imagesUrl" />
        </div>
      </div>
      <div class="flex flex-col gap-2 py-4">
        <div class="flex items-center gap-4 pb-2 border-b">
          <h5 class="text-2xl font-medium">
            {{ temp.title }}
          </h5>
          <Badge>{{
            temp.category
          }}</Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <div
                     :class="`p-2 ml-auto rounded ${temp.top ? 'bg-amber-400 text-gray-50' : 'bg-gray-200 text-gray-700'}`">
                  <ThumbsUp class="w-6 h-6" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div
                     :class="`p-2 text-sm  ${temp.top ? 'text-amber-500' : 'text-gray-700 bg-white'}`">
                  {{ temp.top ? '熱門商品' : '普通商品' }}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p>商品描述：{{ temp.description }}</p>
        <p>商品內容：{{ temp.content }}</p>
        <div class="flex items-center gap-2">
          <p>{{ temp.price }}</p>
          <p class="text-sm">
            <del>{{ temp.origin_price }}</del>
          </p>
          元 / {{ temp.unit }}
        </div>
      </div>

      <div class="flex justify-between gap-4 mt-4">
        <Dialog>
          <DialogTrigger as-child>
            <Button type="button" variant="outline" :disabled="dynamicIsLoading === temp.id"
                    class="w-1/3 text-red-500 border-red-500 hover:bg-red-500 hover:text-white">
              刪除產品
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>刪除產品</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <p>確定要刪除產品 <span class="text-xl font-medium text-red-500">{{ temp.title }}</span>
                嗎？
              </p>
            </DialogDescription>
            <DialogFooter>
              <Button type="button" variant="destructive" class="w-1/2 mr-6"
                      @click="handleDeleteProduct(temp.id as string)">
                確認
              </Button>
              <DialogClose as-child>
                <Button type="button" variant="outline" class="w-1/2">
                  取消
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog v-model:open="isModalOpen">
          <DialogTrigger as-child>
            <Button type="button" class="w-1/3 text-white bg-blue-700 hover:bg-blue-900" @click="
              isModalOpen = true;
            ">編輯產品</Button>
          </DialogTrigger>
          <EditModal v-if="isModalOpen" :openProductForm="isModalOpen" :formStatus="'編輯'" :temp="temp"
                     :isLoading="dynamicIsLoading" @reset="tempRest" @onCloseModal="handleCloseModal"
                     @onUpdateProduct="handleUpdateProduct" @onSetMessage="showMessage"
                     @onLoading="handleLoading" />
        </Dialog>
      </div>
    </div>
  </main>
</template>
