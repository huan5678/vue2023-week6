<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AxiosError } from 'axios';
import { ThumbsUp } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { handleDeleteAdminProduct, handleUpdateAdminProduct } from '@/api';
import EditModal from '@/components/EditModal.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import
{
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import
{
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useMessageStore, useProductStore } from '@/stores';
import { SimpleResponse } from '@/types';

const messageStore = useMessageStore();
const { showMessage } = messageStore;

const productStore = useProductStore();
const { isModalOpen, temp, productsData } = storeToRefs(productStore);
const { tempRest, getAdminProducts } = productStore;

const router = useRouter();

const isLoading = ref('');

onMounted(
  async () => {
    try {
      await getAdminProducts();
      const { id } = router.currentRoute.value.params;
      const product = productsData.value[id as string];
      temp.value = {
        ...product,
        id: id as string,
        is_enabled: product.is_enabled ? 1 : 0,
        top: product.top as boolean,
      };
    } catch (error: unknown) {
      showMessage((error as Error).message);
    }
  },
);

function handleCloseModal() {
  isModalOpen.value = false;
  tempRest();
}

const dynamicIsLoading = computed(() => {
  return isLoading.value;
});

function handleLoading(id: string) {
  isLoading.value = id;
}

async function handleUpdateProduct() {
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

async function handleDeleteProduct(id: string) {
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
    <div
      v-if="temp && temp.title !== undefined"
      class="flex flex-col"
    >
      <div class="grid grid-cols-3 gap-2">
        <img
          :src="temp.imageUrl"
          class="col-span-2 aspect-video max-h-80 w-full rounded object-cover object-center"
          alt="主圖"
        >
        <div class="flex flex-wrap gap-2">
          <img
            v-for="img in temp.imagesUrl"
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
            {{ temp.title }}
          </h5>
          <Badge>
            {{
              temp.category
            }}
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <div
                  :class="`p-2 ml-auto rounded ${temp.top ? 'bg-amber-400 text-gray-50' : 'bg-gray-200 text-gray-700'}`"
                >
                  <ThumbsUp class="size-6" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div
                  :class="`p-2 text-sm  ${temp.top ? 'text-amber-500' : 'text-gray-700 bg-white'}`"
                >
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

      <div class="mt-4 flex justify-between gap-4">
        <Dialog>
          <DialogTrigger as-child>
            <Button
              type="button"
              variant="outline"
              :disabled="dynamicIsLoading === temp.id"
              class="w-1/3 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              刪除產品
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>刪除產品</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <p>
                確定要刪除產品 <span class="text-xl font-medium text-red-500">{{ temp.title }}</span>
                嗎？
              </p>
            </DialogDescription>
            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                class="mr-6 w-1/2"
                @click="handleDeleteProduct(temp.id as string)"
              >
                確認
              </Button>
              <DialogClose as-child>
                <Button
                  type="button"
                  variant="outline"
                  class="w-1/2"
                >
                  取消
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog v-model:open="isModalOpen">
          <DialogTrigger as-child>
            <Button
              type="button"
              class="w-1/3 bg-blue-700 text-white hover:bg-blue-900"
              @click="
                isModalOpen = true;
              "
            >
              編輯產品
            </Button>
          </DialogTrigger>
          <EditModal
            v-if="isModalOpen"
            :open-product-form="isModalOpen"
            :form-status="'編輯'"
            :temp="temp"
            :is-loading="dynamicIsLoading"
            @reset="tempRest"
            @on-close-modal="handleCloseModal"
            @update-product="handleUpdateProduct"
            @on-set-message="showMessage"
            @on-loading="handleLoading"
          />
        </Dialog>
      </div>
    </div>
  </main>
</template>
