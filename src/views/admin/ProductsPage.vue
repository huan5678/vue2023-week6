<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import
{
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
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
import { handleAddAdminProduct, handleDeleteAdminProduct, handleGetAdminProducts } from '@/api';
import { useMessageStore, useUserStore, useProductStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { IProduct, ProductsData, SimpleResponse } from '@/types';
import { useRouter } from 'vue-router';
import { AxiosError } from 'axios';

const messageStore = useMessageStore();
const { showMessage } = messageStore;

const productStore = useProductStore();
const { productsData, isModalOpen, temp } = storeToRefs(productStore);
const { tempRest } = productStore;

const router = useRouter();


const itemsPerPage = 5;
const currentPage = ref(1);

const paginatedData = computed(() =>
{
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const productArray = Object.values(productsData.value);
  return productArray.slice(startIndex, endIndex);
});

function handlePageChange(newPage: number)
{
  currentPage.value = newPage;
}


const userStore = useUserStore();
const { isLogin } = storeToRefs(userStore);

const handleViewProductDetail = (item: IProduct) =>
{
  router.push(`/dashboard/product/${item.id}`);
};

onMounted(async () =>
{
  try {
    if (isLogin.value) {
      const res = await handleGetAdminProducts();
      showMessage('成功取得產品列表');
      productsData.value = res.products as unknown as ProductsData;
    }
  } catch (error: unknown) {
    showMessage((error as AxiosError<SimpleResponse>).response?.data.message as string);
  }
});

const isLoading = ref('');

const dynamicIsLoading = computed(() =>
{
  return isLoading.value;
});

function handleLoading(id: string)
{
  isLoading.value = id;
}

function handleCloseModal()
{
  isModalOpen.value = false;
  tempRest();
}

async function handleAddProduct()
{
  try {
    const res = await handleAddAdminProduct(temp.value);
    showMessage(res.message as string);
    tempRest();
    isModalOpen.value = false;
  } catch (error: unknown) {
    showMessage((error as AxiosError<SimpleResponse>).response?.data.message as string);
  }
}

async function handleDeleteProduct(id: string)
{
  try {
    isLoading.value = id;
    await handleDeleteAdminProduct(id);
    showMessage('刪除成功');
    await handleGetAdminProducts();
    isLoading.value = '';
    handleCloseModal();
  } catch (error: unknown) {
    showMessage((error as AxiosError<SimpleResponse>).response?.data.message as string);
  }
}

</script>

<template>
  <main class="container p-4 mx-auto space-y-4">
    <div class="grid space-y-2" v-if="isLogin === true">
      <h2 class="p-2 text-2xl font-bold text-center">產品列表</h2>
      <Table>
        <TableHeader class="border-b-2 border-black">
          <TableRow>
            <TableHead class="py-2" width="150">產品名稱</TableHead>
            <TableHead width="120">
              原價
            </TableHead>
            <TableHead width="120">
              售價
            </TableHead>
            <TableHead width="150">
              是否啟用
            </TableHead>
            <TableHead width="120">
              查看細節
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow class="border-b border-gray-200" v-for="item in paginatedData" :key="item.id">
            <TableCell width="150">
              {{ item.title }}
            </TableCell>
            <TableCell width="120">
              {{ item.price }}
            </TableCell>
            <TableCell width="120">
              {{ item.origin_price }}
            </TableCell>
            <TableCell width="150">
              <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
              <span v-else>未啟用</span>
            </TableCell>
            <TableCell class="flex justify-center gap-4 py-2" width="120">
              <Dialog>
                <DialogTrigger as-child>
                  <Button type="button" variant="outline"
                          class="text-red-500 border-red-500 hover:bg-red-500 hover:text-white">
                    刪除產品
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>刪除產品</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    <p>確定要刪除產品 <span class="text-xl font-medium text-red-500">{{ item.title }}</span>
                      嗎？
                    </p>
                  </DialogDescription>
                  <DialogFooter>
                    <Button type="button" variant="destructive" class="w-1/2 mr-6"
                            @click="handleDeleteProduct(item.id as string);">
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
              <Button type="button"
                      class="px-4 py-2 text-white transition duration-300 bg-blue-500 rounded hover:bg-blue-700"
                      @click="handleViewProductDetail(item)">查看細節</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div class="flex justify-center py-4 border-y">
        <Pagination v-slot="{ page }" :total="Object.keys(productsData).length"
                    :itemsPerPage="itemsPerPage" :sibling-count="1" show-edges :default-page="1"
                    :page="currentPage" @update:page="handlePageChange">
          <PaginationList v-slot="{ items }" class="flex items-center gap-1">
            <PaginationFirst />
            <PaginationPrev />
            <template v-for="(item, index) in items">
              <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value"
                                  as-child>
                <Button type="button" class="w-10 h-10 p-0"
                        :variant="item.value === page ? 'default' : 'outline'">
                  {{ item.value }}
                </Button>
              </PaginationListItem>
              <PaginationEllipsis v-else :key="item.type" :index="index" />
            </template>
            <PaginationNext />
            <PaginationLast />
          </PaginationList>
        </Pagination>
      </div>
      <p>目前有 <span>{{ Object.keys(productsData).length }}</span> 項產品</p>
      <div class="flex justify-end">
        <Dialog v-model:open="isModalOpen">
          <DialogTrigger as-child>
            <Button type="button" variant="outline"
                    class="text-blue-700 border-blue-700 hover:bg-blue-700 hover:text-white md:w-1/3"
                    @click="
                      isModalOpen = true;
                    tempRest();
                    ">新增產品</Button>
          </DialogTrigger>
          <EditModal v-if="isModalOpen" :openProductForm="isModalOpen" :formStatus="'新增'" :temp="temp"
                     :isLoading="dynamicIsLoading" @reset="tempRest" @closeModal="handleCloseModal"
                     @setMessage="showMessage" @addProduct="handleAddProduct"
                     @loading="handleLoading" />
        </Dialog>
      </div>
    </div>
  </main>
</template>
