
export interface Product {
  id: string;
  name: string;
  category: 'Acessórios p/ máquina' | 'Linhas e fios' | 'Barbantes' | 'Luminária p/ máquina' | 'Aparelhos' | 'Outros';
  description: string;
  price: number;
  oldPrice?: number;
  stock: number;
  sku: string;
  image: string;
  images?: string[]; // Para a galeria de fotos
  spec?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  ordersCount: number;
  lastPurchase?: string;
  avatar?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Sale {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  customerName?: string;
}

export type ViewType = 'STOREFRONT' | 'DASHBOARD' | 'CATALOG' | 'CHECKOUT' | 'POS' | 'CUSTOMERS';
