interface IProduct {
  title: string;
  category: string;
  content: string;
  description: string;
  imageUrl: string;
  imagesUrl: string[];
  is_enabled: string | number | boolean;
  origin_price: number;
  price: number;
  unit: string;
  enabled?: boolean;
  imageTemp?: string;
  top?: boolean;
  id?: string;
}

interface ProductsData {
  [key: string]: IProduct;
}

interface ICoupon {
  title: string;
  due_date: number;
  percent: number;
  code: string;
  is_enabled: number;
  id?: string;
}

interface IUser {
  name: string;
  email: string;
  tel: string;
  address: string;
}

interface IOrder {
  create_at: number;
    id: string;
    message: string;
    is_paid: boolean;
    products: {
      id: string;
      product_id: string;
      qty: number;
    }[];
    user: IUser;
  num: number;
}

interface ICart {
      coupon: ICoupon;
      final_total: number;
      id: string;
      product: IProduct;
      product_id: string;
      qty: number;
      total: number;
    }

export type FormStatus = 'new' | 'edit';

interface IPagination {
  total_pages: number;
  current_page: number;
  has_pre: boolean;
  has_next: boolean;
  category: string;
}

interface SimpleResponse {
  success: boolean;
  message?: string;
}

interface CurrentSimpleResponse {
  success: boolean;
  message: string;
}

interface BaseResponse {
  success: boolean;
  pagination?: IPagination;
  messages?: string[];
}

// 使用索引簽名來表示一個動態的鍵名
interface ItemResponse<T> {
  success: boolean;
  [key: string]: T | boolean;
}

interface DataResponse<T> extends BaseResponse {
  data: T;
}

// 使用動態鍵名的回應結構
interface DynamicKeyResponse<T> extends BaseResponse {
  [key: string]: T | boolean | IPagination | string[] | number | string | undefined;
}

// 聯合類型 ApiResponse
type ApiResponse<T> = SimpleResponse | DataResponse<T> | DynamicKeyResponse<T> | ItemResponse<T>;

type ProductResponse = ItemResponse<{
  products: ProductsData,
  message: string
}>;

type AddCartResponse = SimpleResponse & {
  data: ICart;
};

type CartResponse = ItemResponse<{
  data: {
    carts: ICart[];
    total: number;
    final_total: number;
  },
  messages: string[];
}>;

type LoginResponse = SimpleResponse & {
  token: string;
  uid: string;
  expired: number;
};

type OrderResponse = ItemResponse<{
  orders?: IOrder[];
  order?: IOrder;
  pagination: IPagination;
  messages: string[];
}>;

export type {
  IProduct,
  ICoupon,
  IUser,
  IOrder,
  IPagination,
  ICart,
  ProductsData,
  SimpleResponse,
  CurrentSimpleResponse,
  BaseResponse,
  ApiResponse,
  DynamicKeyResponse,
  DataResponse,
  ItemResponse,
  LoginResponse,
  AddCartResponse,
  CartResponse,
  OrderResponse,
  ProductResponse,
};
