import {
  get, post, put, del,
} from '@/lib/http';
import type {
  ApiResponse,
  CartResponse,
  DynamicKeyResponse, IProduct, IUser, ItemResponse, LoginResponse,
  OrderResponse,
  ProductResponse,
  SimpleResponse,
} from '@/types/';
import { AxiosResponse } from 'axios';

export async function handleCheck(token: string): Promise<ItemResponse<{token: string}> | SimpleResponse> {
  try {
    const { data } = await post('/api/user/check', {}, {
      headers: {
        Authorization: token,
      },
    }) as AxiosResponse<ItemResponse<{ token: string }>>;
    return data;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
}

export async function handleLogin(username: string, password: string): Promise<LoginResponse> {
  try {
    const { data } = await post('/signin', {
      username,
      password,
    }) as AxiosResponse<LoginResponse>;
    return data;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
}

export async function handleLogout() {
  try {
    const { data } = await post('/logout');
    return data;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
}

export async function handleGetProductsAll(): Promise<ItemResponse<IProduct[]>> {
  try {
    const { data } = (await get('/products/all')) as AxiosResponse<ItemResponse<IProduct[]>>;
    return data;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
}

export async function handleGetProducts(page: string, category: string):
  Promise<ItemResponse<IProduct[]>> {
  try {
    const { data } = await get(
      `/products?${category ? `&category=${category}` : ''}${page ? `&page=${page}` : ''}`,
    ) as AxiosResponse<ItemResponse<IProduct[]>>;
    return data;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
}

export async function handleGetProduct(id: string): Promise<ItemResponse<IProduct>> {
  try {
    const { data } = await get(`/product/${id}`) as AxiosResponse<ItemResponse<IProduct>>;
    return data;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
}

export async function handleGetCart(): Promise<CartResponse> {
  try {
    const { data } = await get('/cart') as AxiosResponse<CartResponse>;
    return data;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
}

export async function handleAddToCart(id: string, qty: number): Promise<ApiResponse<IProduct>> {
  try {
    const { data } = await post('/cart', {
      data: {
        product_id: id,
        qty,
      },
    }) as AxiosResponse<ApiResponse<IProduct>>;
    return data;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
}

export async function handleEditCart(id: string, product: { id: string; qty: number }):
  Promise<ApiResponse<{
  data: {
    product_id: string;
    qty: number;
  }
}>> {
  try {
    const { data } = await put(`/cart/${id}`, {
      data: {
        product_id: product.id,
        qty: product.qty,
      },
    }) as AxiosResponse<ApiResponse<{ data: { product_id: string; qty: number } }>>;
    return data;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
}

export async function handleDeleteCart(id: string): Promise<SimpleResponse> {
  try {
    const { data } = await del(`/cart/${id}`) as AxiosResponse<SimpleResponse>;
    return data;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
}

export async function handleDeleteAllCart(): Promise<SimpleResponse> {
  try {
    const { data } = await del('/carts') as AxiosResponse<SimpleResponse>;
    return data;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
}

export async function handlePostOrder(order: {
  user: IUser;
  message?: string;
}): Promise<DynamicKeyResponse<string | number | boolean>> {
  try {
    const { data } = await post('/order', {
      data: {
        order,
      },
    });
    return data as DynamicKeyResponse<string | number | boolean>;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
}

export async function handleGetOrders(page?: string): Promise<OrderResponse> {
  try {
    const { data } = await get(`/orders${page ? `?page=${page}` : ''}`) as AxiosResponse<OrderResponse>;
    return data;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
}

export async function handleGetOrder(id: string): Promise<OrderResponse> {
  try {
    const { data } = await get(`/order/${id}`) as AxiosResponse<OrderResponse>;
    return data;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
}

export async function handlePayOrder(paymentData: IUser): Promise<ItemResponse<{
  message: string;
  total: number;
  created_at: number;
  orderId: string;
}>> {
  try {
    const { data } = await post('/order', {
      data: {
        user: {
          ...paymentData,
        },
      },
    }) as AxiosResponse<ItemResponse<{
      message: string; total: number; created_at: number; orderId: string
    }>>;
    return data;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
}

export async function handleGetAdminProducts(): Promise<ProductResponse> {
  try {
    const { data } = await get('/admin/products/all') as AxiosResponse<ProductResponse>;
    return data;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
}

export async function handleUpdateAdminProduct(id:string, product: IProduct): Promise<SimpleResponse> {
  try {
    const { data } = await put(`/admin/product/${id}`, {
      data: {
        ...product,
      },
    }) as AxiosResponse<SimpleResponse>;
    return data;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
}

export async function handleAddAdminProduct(product: IProduct): Promise<SimpleResponse> {
  try {
    const { data } = await post('/admin/product', {
      data: {
        ...product,
      },
    }) as AxiosResponse<SimpleResponse>;
    return data;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
}

export async function handleUpLoadImage(e: Event): Promise<string>
{
  const target = e.target as HTMLInputElement;
  const file: File = (target.files as FileList)[ 0 ];
  const formData = new FormData();
  formData.append('file-to-upload', file);
  try {
    const { data } = (await post('/admin/upload', formData)) as AxiosResponse<
      DynamicKeyResponse<{imageUrl: string}>
      >;
    return data.imageUrl as string;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
}

export async function handleDeleteAdminProduct(id: string): Promise<SimpleResponse> {
  try {
    const { data } = await del(`/admin/product/${id}`) as AxiosResponse<SimpleResponse>;
    return data;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
}
