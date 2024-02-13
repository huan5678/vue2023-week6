<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import { Loader2 } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import * as z from 'zod';
import { handlePayOrder } from '@/api';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useCartStore } from '@/stores';

const cartStore = useCartStore();
const {
  getCartData, showMessage, closeModal, closeCart,
} = cartStore;

const formSchema = toTypedSchema(z.object({
  name: z.string().min(2, '最少請輸入兩個字').max(50, '最多輸入50個字'),
  email: z.string().email('請輸入正確的Email格式'),
  tel: z.string().min(10).max(10),
  address: z.string().max(50, '最多輸入50個字'),
}));

const {
  handleSubmit, meta, isSubmitting, resetForm,
} = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
  const res = await handlePayOrder(values);
  if (res.success) {
    await getCartData();
    showMessage('訂單已成立');
    resetForm();
    closeModal();
    closeCart();
  }
});

const layout = [{
  name: 'name',
  label: '姓名',
  placeholder: '請輸入姓名',
  type: 'text',
}, {
  name: 'email',
  label: 'Email',
  placeholder: '請輸入Email',
  type: 'email',
},
{
  name: 'tel',
  label: '電話',
  placeholder: '0912345678',
  type: 'tel',
},
{
  name: 'address',
  label: '地址',
  placeholder: '請輸入地址',
  type: 'text',
},
];

</script>

<template>
  <DialogContent class="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>收件人資訊</DialogTitle>
      <DialogDescription>
        <ol>
          <li>為保障您完整的會員權益，請務必填寫正確的手機號碼。</li>
          <li>若您的收件地址為郵政信箱，請勿填寫郵政信箱地址。</li>
        </ol>
      </DialogDescription>
    </DialogHeader>
    <form
      class="grid gap-4 py-4"
      @submit="onSubmit"
    >
      <div
        v-for="item in layout"
        :key="item.name"
        class="grid items-center gap-4"
      >
        <FormField
          v-slot="{ componentField }"
          :name="item.name"
          class="w-full"
        >
          <FormItem>
            <FormLabel>{{ item.label }}</FormLabel>
            <FormControl>
              <Input
                :type="item.type"
                :placeholder="item.placeholder"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <Button
        :disabled="!meta.valid || isSubmitting"
        type="submit"
        class="mt-10 flex items-center justify-center rounded-md border border-gray-100 p-2 transition duration-300 hover:bg-gray-500 hover:text-gray-100"
      >
        <Loader2
          v-if="isSubmitting"
          class="mr-2 size-4 animate-spin"
        />
        {{ isSubmitting ? '送出中...' : '完成結帳' }}
      </Button>
    </form>
  </DialogContent>
</template>
