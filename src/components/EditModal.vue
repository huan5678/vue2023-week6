<script setup lang="ts">
import { ref, defineEmits, PropType } from 'vue';
import { Button } from './ui/button';
import
{
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { X, ImagePlus, FileStack } from 'lucide-vue-next';

import { useEmitAsProps } from '@/lib/utils';
import { IProduct } from '@/types';
import { handleUpLoadImage } from '@/api';

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
  'loading'
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



async function handleUpLoadMainImage(e: Event)
{
  try {
    const imageUrl = await handleUpLoadImage(e);
    props.temp.imageUrl = imageUrl;
  } catch (error: unknown) {
    if ((error as any)?.response?.data?.success === false) {
      emitProps.onSetMessage(`上傳圖片失敗 ${(error as any).response?.data?.message}`);
    }
  }
}

async function handleUpLoadProductImage(e: Event)
{
  try {
    const imageUrl = await handleUpLoadImage(e);
    props.temp.imagesUrl.push(imageUrl);
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
      <form class="p-4 border rounded max-h-[80vh] overflow-y-auto">
        <div class="flex flex-col gap-4">
          <div class="flex justify-between gap-4">
            <div class="flex flex-col flex-auto gap-2">
              <Label for="title" class="text-lg font-medium">產品名稱</Label>
              <Input type="text" id="title" v-model="props.temp.title"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
                     placeholder="請輸入產品名稱" />
            </div>
            <div class="flex flex-col flex-auto gap-2">
              <Label for="category" class="text-lg font-medium">產品分類</Label>
              <Input type="text" id="category" v-model="props.temp.category"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
                     placeholder="請輸入產品分類" />
            </div>
            <div class="flex flex-col flex-auto gap-2">
              <Label for="unit" class="text-lg font-medium">產品單位</Label>
              <Input type="text" id="unit" v-model="props.temp.unit"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
                     placeholder="請輸入產品單位" />
            </div>
          </div>
          <div class="flex justify-between gap-4">
            <div class="flex flex-col flex-auto gap-2">
              <Label for="origin_price" class="text-lg font-medium">產品原價</Label>
              <Input type="text" id="origin_price" v-model.number="props.temp.origin_price"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
                     placeholder="請輸入產品原價" pattern="[0-9]+" />
            </div>
            <div class="flex flex-col flex-auto gap-2">
              <Label for="price" class="text-lg font-medium">產品售價</Label>
              <Input type="text" id="price" v-model.number="props.temp.price"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
                     placeholder="請輸入產品售價" pattern="[0-9]+" />
            </div>
          </div>
          <div class="flex justify-between gap-4">
            <div class="flex flex-col flex-auto gap-2">
              <Label for="description" class="text-lg font-medium">產品描述</Label>
              <Textarea type="text" id="description" v-model="props.temp.description"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
                        placeholder="請輸入產品描述">
                                                                              </Textarea>
            </div>
            <div class="flex flex-col flex-auto gap-2">
              <Label for="content" class="text-lg font-medium">產品內容</Label>
              <Textarea type="text" id="content" v-model="props.temp.content"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
                        placeholder="請輸入產品內容">
                                                                              </Textarea>
            </div>
          </div>
          <div class="flex justify-between gap-4">
            <div class="flex flex-col flex-auto gap-2">
              <Label for="imageUrl" class="text-lg font-medium">產品主圖</Label>
              <img v-if="props.temp.imageUrl" :src="props.temp.imageUrl"
                   class="object-cover object-center w-full rounded aspect-video max-h-80" alt="主圖" />
              <form class="grid w-full max-w-sm items-center gap-1.5">
                <Label for="picture">上傳主圖片</Label>
                <div class="flex items-center gap-2">
                  <Input id="picture" v-if="showMainImage" type="file" accept="image/jpeg,image/png"
                         @change="handleUpLoadMainImage" />
                  <Button type="button" variant="outline" size="icon"
                          :disabled="isLoading === props.temp.id"
                          @click="showMainImage = !showMainImage">
                    <ImagePlus class="w-5 h-5" v-if="!showMainImage" />
                    <X class="w-5 h-5" v-else />
                  </Button>
                </div>
              </form>
              <div class="flex gap-2">
                <div>
                  <Label for="is_enabled" class="text-lg font-medium">是否啟用</Label>
                  <Switch id="is_enabled" :disabled="isLoading === props.temp.id"
                          v-model:checked="(props.temp.is_enabled as boolean)" />
                </div>
                <div>
                  <Label for="top" class="text-lg font-medium">是否熱門推送</Label>
                  <Switch id="top" v-model:checked="(props.temp.top as boolean)"
                          :disabled="isLoading === props.temp.id" />
                </div>
              </div>
            </div>
            <div class="flex flex-col w-1/2 gap-2">
              <Label for="imagesUrl" class="text-lg font-medium">產品圖片</Label>
              <div class="flex flex-wrap gap-4 p-4 overflow-x-scroll">
                <div class="relative flex-auto max-w-md max-h-32 aspect-square"
                     v-for="(img, idx) in props.temp.imagesUrl" :key="img + idx">
                  <img :src="img" class="object-cover object-center w-full h-full rounded"
                       :alt="img" />
                  <Button type="button" size="icon"
                          class="absolute top-0 grid p-4 text-white transition duration-300 -translate-x-6 -translate-y-4 bg-gray-600 border rounded hover:bg-gray-400 border-gray-950/75 left-full place-content-center"
                          :disabled="isLoading" @click="props.temp.imagesUrl.splice(idx, 1)">
                    <X class="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <form class="grid w-full max-w-sm items-center gap-1.5">
                <Label for="picture">上傳產品圖片</Label>
                <div class="flex items-center gap-2">
                  <Input id="picture" v-if="showProductImage" type="file"
                         accept="image/jpeg,image/png" @change="handleUpLoadProductImage" />
                  <Button type="button" variant="outline" size="icon" :disabled="isLoading"
                          @click="showProductImage = !showProductImage">
                    <FileStack class="w-5 h-5" v-if="!showProductImage" />
                    <X class="w-5 h-5" v-else />
                  </Button>
                </div>
              </form>
            </div>
          </div>
          <div class="flex justify-between gap-4">
            <Button type="button" variant="outline" :disabled="isLoading"
                    class="flex justify-center w-full rounded-md disabled:opacity-50 disabled:bg-gray-500"
                    @click="emitProps.onCloseModal()">{{ props.formStatus === '新增' ? '取消新增' :
                      '取消編輯' }}</Button>
            <Button type="button"
                    class="w-full bg-blue-500 hover:bg-blue-700 focus-visible:outline-cyan-600 disabled:opacity-50 disabled:bg-gray-500"
                    @click="props.formStatus === '新增' ? emitProps.onAddProduct() : emitProps.onUpdateProduct()"
                    :disabled="isLoading">{{ props.formStatus === '新增' ? '新增產品' : '完成編輯' }}</Button>
          </div>
        </div>
      </form>
    </div>
  </DialogContent>
</template>