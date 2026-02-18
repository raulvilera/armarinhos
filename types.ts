
export interface Product {
  id: string;
  name: string;
  category: 'Acessórios p/ máquina' | 'Linhas e fios' | 'Barbantes' | 'Luminária p/ máquina' | 'Aparelhos' | 'Outros';
  description: string;
  price: number;
  oldPrice?: number;
  stock: number;
  sku: string;
  barcode?: string;
  image: string;
  images?: string[];
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

export interface FiscalInfo {
  cpfCnpj?: string;
  razaoSocial?: string;
  emitirNF: boolean;
  tipoDocumento: 'NF-e' | 'NFS-e';
}

export interface Sale {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  customerName?: string;
  fiscal?: FiscalInfo;
}

<<<<<<< HEAD
export type ViewType = 'STOREFRONT' | 'DASHBOARD' | 'CATALOG' | 'CHECKOUT' | 'POS' | 'CUSTOMERS' | 'LOGIN' | 'SUBSCRIPTIONS' | 'SUPER_ADMIN';
=======
export type ViewType = 'STOREFRONT' | 'DASHBOARD' | 'CATALOG' | 'CHECKOUT' | 'POS' | 'CUSTOMERS' | 'LOGIN' | 
>>>>>>> dd7af30 (initial: setup project with Supabase and SaaS structure)
