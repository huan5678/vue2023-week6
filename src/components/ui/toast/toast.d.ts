import type { VariantProps } from 'class-variance-authority';
import type { ToastRootProps } from 'radix-vue';

interface ToastVariantProps extends VariantProps<typeof toastVariants> {}

export interface ToastProps extends ToastRootProps {
  class?: string;
  variant?: ToastVariantProps['variant'];
  onOpenChange?: ((value: boolean) => void) | undefined;
}
