import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { camelize, getCurrentInstance, toHandlerKey } from 'vue';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export type ParseEmits<T extends Record<string, any>> = {
  [K in keyof T]: (...args: T[K]) => void;
};

// Vue doesn't have emits forwarding, in order to bind the emits we have to convert events into `onXXX` handlers
// issue: https://github.com/vuejs/core/issues/5917

export function useEmitAsProps<EventName extends string>(
	emit: (name: EventName, ...args: any[]) => void
) {
	const result: Record<string, any> = {};
	const vm = getCurrentInstance();
	if (!vm) return result;

	const events: EventName[] = Array.isArray(vm.type.emits)
		? vm.type.emits
		: typeof vm.type.emits === "object"
		? Object.keys(vm.type.emits)
		: [];

	if (!events.length) {
		console.warn(
			`No emitted event found. Please check component: ${vm.type.__name}`
		);
	}

	for (let i = 0; i < events.length; i++) {
		result[toHandlerKey(camelize(events[i]!))] = (...args: any) =>
			emit(events[i]!, ...args);
	}

	return result;
}