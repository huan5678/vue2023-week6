<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import type { ToastRootEmits } from 'radix-vue';
import { ToastRoot, useEmitAsProps } from 'radix-vue';
import { cn } from '../../../lib/utils';
import { ToastProps } from './toast';
import { toastVariants } from '.';

const props = defineProps<ToastProps>();
const emits = defineEmits<ToastRootEmits>();
</script>

<template>
  <ToastRoot
    v-bind="{ ...props, ...useEmitAsProps(emits) }"
    :class="cn(toastVariants({ variant: props.variant }), props.class)"
    @update:open="onOpenChange"
  >
    <slot />
  </ToastRoot>
</template>
