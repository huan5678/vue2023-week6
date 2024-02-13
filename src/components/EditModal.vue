<script setup lang="ts">
import {
  computed, defineEmits, PropType, ref,
} from 'vue';
import { FileStack, ImagePlus, X } from 'lucide-vue-next';
import { handleUpLoadImage } from '@/api';
import { useEmitAsProps } from '@/lib/utils';
import { IProduct } from '@/types';
import { Button } from './ui/button';
import
{
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';

const showMainImage = ref(false);
const showProductImage = ref(false);

const emit = defineEmits([
  'addProduct',
  'updateProduct',
  'reset',
  'formStatus',
  'removeProductImage',
  'closeModal',
  'setMessage',
  'getAllProducts',
  'loading',
]);

const emitProps = useEmitAsProps(emit);

const props = defineProps({
  temp: {
    type: Object as PropType<IProduct>,
    required: true,
  },
  formStatus: {
    type: String as PropType<'新增' | '編輯'>,
    required: true,
  },
  isLoading: {
    type: String as PropType<string>,
    required: true,
  },
});

const temp = computed(() => props.temp);

async function handleUpLoadMainImage(e: Event) {
  try {
    const imageUrl = await handleUpLoadImage(e);
    temp.value.imageUrl = imageUrl;
  } catch (error: unknown) {
    if ((error as any)?.response?.data?.success === false) {
      emitProps.onSetMessage(`上傳圖片失敗 ${(error as any).response?.data?.message}`);
    }
  }
}

async function handleUpLoadProductImage(e: Event) {
  try {
    const imageUrl = await handleUpLoadImage(e);
    temp.value.imagesUrl.push(imageUrl);
  } catch (error: unknown) {
    emitProps.onSetMessage(`上傳圖片失敗 ${(error as any).response?.data?.message}`);
  }
}

</script>

<template>
  <DialogContent class="sm:max-w-[60rem] ">
    <DialogHeader>
      <DialogTitle>
        {{ formStatus === '新增' ? '新增產品' : '編輯產品' }}
      </DialogTitle>
    </DialogHeader>
    <div class="grid gap-4 py-4">
      <form class="max-h-[80vh] overflow-y-auto rounded border p-4">
        <div class="flex flex-col gap-4">
          <div class="flex justify-between gap-4">
            <div class="flex flex-auto flex-col gap-2">
              <Label
                for="title"
                class="text-lg font-medium"
              >產品名稱</Label>
              <Input
                id="title"
                v-model="temp.title"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-200/50"
                placeholder="請輸入產品名稱"
              />
            </div>
            <div class="flex flex-auto flex-col gap-2">
              <Label
                for="category"
                class="text-lg font-medium"
              >產品分類</Label>
              <Input
                id="category"
                v-model="temp.category"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-200/50"
                placeholder="請輸入產品分類"
              />
            </div>
            <div class="flex flex-auto flex-col gap-2">
              <Label
                for="unit"
                class="text-lg font-medium"
              >產品單位</Label>
              <Input
                id="unit"
                v-model="temp.unit"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-200/50"
                placeholder="請輸入產品單位"
              />
            </div>
          </div>
          <div class="flex justify-between gap-4">
            <div class="flex flex-auto flex-col gap-2">
              <Label
                for="origin_price"
                class="text-lg font-medium"
              >產品原價</Label>
              <Input
                id="origin_price"
                v-model.number="temp.origin_price"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-200/50"
                placeholder="請輸入產品原價"
                pattern="[0-9]+"
              />
            </div>
            <div class="flex flex-auto flex-col gap-2">
              <Label
                for="price"
                class="text-lg font-medium"
              >產品售價</Label>
              <Input
                id="price"
                v-model.number="temp.price"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-200/50"
                placeholder="請輸入產品售價"
                pattern="[0-9]+"
              />
            </div>
          </div>
          <div class="flex justify-between gap-4">
            <div class="flex flex-auto flex-col gap-2">
              <Label
                for="description"
                class="text-lg font-medium"
              >產品描述</Label>
              <Textarea
                id="description"
                v-model="temp.description"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-200/50"
                placeholder="請輸入產品描述"
              />
            </div>
            <div class="flex flex-auto flex-col gap-2">
              <Label
                for="content"
                class="text-lg font-medium"
              >產品內容</Label>
              <Textarea
                id="content"
                v-model="temp.content"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-200/50"
                placeholder="請輸入產品內容"
              />
            </div>
          </div>
          <div class="flex justify-between gap-4">
            <div class="flex flex-auto flex-col gap-2">
              <Label
                for="imageUrl"
                class="text-lg font-medium"
              >產品主圖</Label>
              <img
                v-if="props.temp.imageUrl"
                :src="props.temp.imageUrl"
                class="aspect-video max-h-80 w-full rounded object-cover object-center"
                alt="主圖"
              >
              <form class="grid w-full max-w-sm items-center gap-1.5">
                <Label for="picture">上傳主圖片</Label>
                <div class="flex items-center gap-2">
                  <Input
                    v-if="showMainImage"
                    id="picture"
                    type="file"
                    accept="image/jpeg,image/png"
                    @change="handleUpLoadMainImage"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    :disabled="isLoading === props.temp.id"
                    @click="showMainImage = !showMainImage"
                  >
                    <ImagePlus
                      v-if="!showMainImage"
                      class="size-5"
                    />
                    <X
                      v-else
                      class="size-5"
                    />
                  </Button>
                </div>
              </form>
              <div class="flex gap-2">
                <div>
                  <Label
                    for="is_enabled"
                    class="text-lg font-medium"
                  >是否啟用</Label>
                  <Switch
                    id="is_enabled"
                    v-model="temp.is_enabled"
                    :disabled="isLoading === props.temp.id"
                  />
                </div>
                <div>
                  <Label
                    for="top"
                    class="text-lg font-medium"
                  >是否熱門推送</Label>
                  <Switch
                    id="top"
                    v-model:checked="temp.top"
                    :disabled="isLoading === props.temp.id"
                  />
                </div>
              </div>
            </div>
            <div class="flex w-1/2 flex-col gap-2">
              <Label
                for="imagesUrl"
                class="text-lg font-medium"
              >產品圖片</Label>
              <div class="flex flex-wrap gap-4 overflow-x-scroll p-4">
                <div
                  v-for="(img, idx) in props.temp.imagesUrl"
                  :key="img + idx"
                  class="relative aspect-square max-h-32 max-w-md flex-auto"
                >
                  <img
                    :src="img"
                    class="size-full rounded object-cover object-center"
                    :alt="img"
                  >
                  <Button
                    type="button"
                    size="icon"
                    class="absolute left-full top-0 grid -translate-x-6 -translate-y-4 place-content-center rounded border border-gray-950/75 bg-gray-600 p-4 text-white transition duration-300 hover:bg-gray-400"
                    :disabled="isLoading === props.temp.id"
                    @click="temp.imagesUrl.splice(idx, 1)"
                  >
                    <X class="size-5" />
                  </Button>
                </div>
              </div>
              <form class="grid w-full max-w-sm items-center gap-1.5">
                <Label for="picture">上傳產品圖片</Label>
                <div class="flex items-center gap-2">
                  <Input
                    v-if="showProductImage"
                    id="picture"
                    type="file"
                    accept="image/jpeg,image/png"
                    @change="handleUpLoadProductImage"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    :disabled="isLoading"
                    @click="showProductImage = !showProductImage"
                  >
                    <FileStack
                      v-if="!showProductImage"
                      class="size-5"
                    />
                    <X
                      v-else
                      class="size-5"
                    />
                  </Button>
                </div>
              </form>
            </div>
          </div>
          <div class="flex justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              :disabled="isLoading === props.temp.id"
              class="flex w-full justify-center rounded-md disabled:bg-gray-500 disabled:opacity-50"
              @click="emitProps.onCloseModal()"
            >
              {{ props.formStatus === '新增' ? '取消新增' :
                '取消編輯' }}
            </Button>
            <Button
              type="button"
              class="w-full bg-blue-500 hover:bg-blue-700 focus-visible:outline-cyan-600 disabled:bg-gray-500 disabled:opacity-50"
              :disabled="isLoading === props.temp.id"
              @click="props.formStatus === '新增' ? emitProps.onAddProduct() : emitProps.onUpdateProduct()"
            >
              {{ props.formStatus === '新增' ? '新增產品' : '完成編輯' }}
            </Button>
          </div>
        </div>
      </form>
    </div>
  </DialogContent>
</template>
