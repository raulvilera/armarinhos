
import { Product, Customer } from './types';

export const SHOP_CONTACTS = {
  whatsapp: '+5511952709128',
  whatsappUrl: 'https://wa.me/5511952709128',
  instagram: '@Armarinhovicmar',
  instagramUrl: 'https://instagram.com/Armarinhovicmar',
  email: 'llvllva33@gmail.com',
  phone: '+55(11) 95270-9128',
  address: 'Av. Imperador 4877'
};

export const INITIAL_PRODUCTS: Product[] = [
  // LINHAS E FIOS - FOCO EM IMAGENS REAIS FORNECIDAS
  {
    id: 'l_setta_2000',
    name: 'Linha Setta 120 2000j',
    category: 'Linhas e fios',
    description: 'Linha de costura de alta qualidade da marca Setta, etiqueta 120. Com 2000 jardas, oferece resistência superior e excelente desempenho em máquinas de costura industriais e domésticas. Ideal para diversos tipos de tecidos.',
    price: 6.20,
    stock: 90,
    sku: 'LNH-SET-120-2000',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Ff260fdaa-1e7f-40aa-9cfc-6379da0fe72f.jpg?alt=media',
    spec: '2000 jardas • Etiqueta 120 • 100% Poliéster'
  },
  {
    id: 'l_korefios_1500',
    name: 'Linha Korefios 120 1500j',
    category: 'Linhas e fios',
    description: 'Linha de alta qualidade da marca Korefios, etiqueta 120. Ideal para costuras em tecidos leves e médios, garantindo resistência e acabamento superior em máquinas industriais.',
    price: 6.50,
    stock: 150,
    sku: 'LNH-KOR-120-1500',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F32b7141c-4bed-4aea-a6d2-cadfae4c3387.jpg?alt=media',
    images: [
      'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F32b7141c-4bed-4aea-a6d2-cadfae4c3387.jpg?alt=media',
      'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fa4b065af-5383-4f32-8f36-a2bcb45bbeac.jpg?alt=media',
      'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F99fd8381-b6c9-40e0-8951-cb06f0f0e923.jpg?alt=media',
      'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F0b66c335-ff1e-418b-b7f6-3a8e68643e5d.jpg?alt=media'
    ],
    spec: '1500 jardas • Etiqueta 120 • 100% Poliéster'
  },
  {
    id: 'l1',
    name: 'Linha de costura 120 Resistente 2000j',
    category: 'Linhas e fios',
    description: 'Linha de alta performance e resistência extra. Com 2000 jardas, é perfeita para produção em larga escala, oferecendo menos trocas de cone e maior produtividade.',
    price: 5.80,
    stock: 120,
    sku: 'LNH-RES-120-2000',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fc55016f8-cff5-4c71-8df3-77075ceb1816.jpg?alt=media',
    images: [
      'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fc55016f8-cff5-4c71-8df3-77075ceb1816.jpg?alt=media',
      'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F36a54efa-2cc7-45e8-8fd6-2704173170f3.jpg?alt=media',
      'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F579271c5-4402-465c-8d63-ea1919e0a506.jpg?alt=media',
      'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F1e6f0161-cfd2-43af-a10e-2b3010afe7bf.jpg?alt=media'
    ],
    spec: '2000 jardas • Etiqueta 120 • Alta Performance'
  },
  
  // ACESSÓRIOS P/ MÁQUINA
  {
    id: 'ac_correia',
    name: 'Correia de motor para máquina industrial',
    category: 'Acessórios p/ máquina',
    description: 'Correia de transmissão de alta resistência para motores de máquinas de costura industriais (Reta, Overloque, Galoneira). Material durável que evita patinação.',
    price: 15.00,
    stock: 45,
    sku: 'COR-MOT-IND',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F1a5e7ac4-3a97-4a4a-ae96-f6fb9fc58bf8.jpg?alt=media',
    images: [
      'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F1a5e7ac4-3a97-4a4a-ae96-f6fb9fc58bf8.jpg?alt=media',
      'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F51dba067-987d-4905-95e4-95a3532e61e1.jpg?alt=media'
    ],
    spec: 'Diversas medidas (M-30 a M-60)'
  },
  {
    id: 'ac_graxa',
    name: 'Graxa branca especial para máquinas',
    category: 'Acessórios p/ máquina',
    description: 'Lubrificante de alta performance para engrenagens e mecanismos internos. Não mancha o tecido e reduz o ruído da máquina.',
    price: 12.90,
    stock: 25,
    sku: 'GRX-BRA-IND',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F45fedf78-af2c-4814-b464-3a41a2759091.jpg?alt=media',
    spec: 'Pote 100g • Alta Viscosidade'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Ana Cláudia Silva',
    email: 'ana.claudia@email.com',
    phone: '(11) 98877-6655',
    totalSpent: 450.90,
    ordersCount: 8,
    lastPurchase: '2024-05-15'
  }
];
