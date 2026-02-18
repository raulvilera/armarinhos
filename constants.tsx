
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
  // APARELHOS
  {
    id: 'ap3',
    name: 'Aparelho de viés de 2 dobras de reta importado',
    category: 'Aparelhos',
    description: 'Aparelho de viés de alta precisão para máquinas de costura retas industriais. Possui sistema de duas dobras que garante um acabamento impecável.',
    price: 45.00,
    stock: 12,
    sku: 'APR-VIE-RET-IMP',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fthumb_280_40500dae-f6d8-412e-bde4-9e91019d99e1.jpg?alt=media',
    spec: '2 Dobras • Reta Industrial'
  },
  
  // OUTROS (Originais + Novos solicitados)
  {
    id: 'ot1',
    name: 'Tesoura de Arremate com Mola Profissional',
    category: 'Outros',
    description: 'Tesoura de precisão tipo "snip" para corte rápido de fios e arremates.',
    price: 8.50,
    stock: 100,
    sku: 'OUT-TES-ARR',
    image: 'https://m.media-amazon.com/images/I/51pI6q8uVBL._AC_SL1000_.jpg',
    spec: 'Aço Carbono'
  },
  {
    id: 'ot2',
    name: 'Fita Métrica 1,5m em Fibra de Vidro',
    category: 'Outros',
    description: 'Fita métrica flexível que não estica, garantindo medições precisas.',
    price: 5.00,
    stock: 150,
    sku: 'OUT-FIT-MET',
    image: 'https://m.media-amazon.com/images/I/61b7bIuYenL._AC_SL1000_.jpg',
    spec: '150cm'
  },
  {
    id: 'ot3',
    name: 'Giz de Alfaiate Profissional (Unidade)',
    category: 'Outros',
    description: 'Giz de cera especial para marcação em tecidos. Sai facilmente com o ferro.',
    price: 2.50,
    stock: 200,
    sku: 'OUT-GIZ-ALF',
    image: 'https://m.media-amazon.com/images/I/41K-lE-T95L._AC_.jpg',
    spec: 'Marcação Temporária'
  },
  {
    id: 'ot_new1',
    name: 'Aparelho de elástico de overloque nacional',
    category: 'Outros',
    description: 'Aparelho robusto para aplicação de elásticos em máquinas overloque, fabricação nacional de alta durabilidade.',
    price: 35.00,
    stock: 15,
    sku: 'OUT-APR-ELA-OV',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fthumb_280_8d0057f1-b7be-49c5-b73c-f7ff427ca2b8.jpg?alt=media',
    spec: 'Overloque Nacional'
  },
  {
    id: 'ot_new2',
    name: 'Aparelho de viés de 2 dobras para Galoneira importado',
    category: 'Outros',
    description: 'Aparelho importado de alta precisão para aplicação de viés em máquinas galoneiras.',
    price: 58.00,
    stock: 10,
    sku: 'OUT-APR-VIE-GAL',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fthumb_280_45b67c5f-13ae-4d23-89d1-b3f0422c216d.jpg?alt=media',
    spec: '2 Dobras • Galoneira'
  },
  {
    id: 'ot_new3',
    name: 'Óleo de 5L p/máquina de costura',
    category: 'Outros',
    description: 'Galão de 5 litros de óleo mineral branco de alta viscosidade para máquinas de costura industriais.',
    price: 95.00,
    stock: 8,
    sku: 'OUT-OLE-5L',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fthumb_280_b2618fa7-7867-4773-afc6-124c09491494.jpg?alt=media',
    spec: '5 Litros • Mineral'
  },
  {
    id: 'ot_new4',
    name: 'Óleo Singer 1L Profissional',
    category: 'Outros',
    description: 'O legítimo óleo Singer em embalagem de 1 litro para lubrificação de alta performance.',
    price: 38.00,
    stock: 20,
    sku: 'OUT-OLE-SIN-1L',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fthumb_280_4daf8d8c-6c52-41a9-b902-7897a9d0d887.jpg?alt=media',
    spec: '1 Litro • Singer'
  },
  {
    id: 'ot_new5',
    name: 'Polia de motor para máquina industrial',
    category: 'Outros',
    description: 'Polia de transmissão resistente para motores de máquinas industriais de costura.',
    price: 25.00,
    stock: 30,
    sku: 'OUT-POL-MOT',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fthumb_280_991360f3-c014-449b-a8ec-d717c0ebdbd9.jpg?alt=media',
    spec: 'Padrão Industrial'
  },
  {
    id: 'ot_new6',
    name: 'Puxador e passador de elásticos e cordão',
    category: 'Outros',
    description: 'Kit completo com puxador, passador de elásticos/cordão e virador de roletê.',
    price: 18.90,
    stock: 40,
    sku: 'OUT-KIT-PUX',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fthumb_280_5081d585-a4c9-4a76-bc3f-88bf4bc1e5a7.jpg?alt=media',
    spec: 'Kit 3 em 1'
  },
  {
    id: 'ot_new7',
    name: 'Suporte de acessórios magnético com imã',
    category: 'Outros',
    description: 'Suporte prático com base magnética para organizar agulhas, alfinetes e tesouras metálicas.',
    price: 12.50,
    stock: 25,
    sku: 'OUT-SUP-MAG',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fthumb_280_7c1f3326-d698-4794-87d9-de889cd0f559.jpg?alt=media',
    spec: 'Base Magnética'
  },
  {
    id: 'ot_new8',
    name: 'Suporte de carretinha magnética 4 pilares',
    category: 'Outros',
    description: 'Organizador magnético para até 4 pilares de carretilhas (bobinas). Mantém tudo no lugar.',
    price: 24.00,
    stock: 18,
    sku: 'OUT-SUP-BOB',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fthumb_280_9bf4336c-72f9-4f08-8b97-cd3f5ecb1d64.jpg?alt=media',
    spec: '4 Pilares'
  },
  {
    id: 'ot_new9',
    name: 'Suporte de celular com imã flexível',
    category: 'Outros',
    description: 'Suporte flexível com imã potente para fixar celular na máquina de costura. Ideal para seguir tutoriais.',
    price: 32.00,
    stock: 15,
    sku: 'OUT-SUP-CEL',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fthumb_280_40375149-2c94-48f5-ae74-6d16eb4066ea.jpg?alt=media',
    spec: 'Imã Flexível'
  },

  // LUMINÁRIAS
  {
    id: 'l8',
    name: 'Luminária led para porta fio p/ máquina de costura',
    category: 'Luminária p/ máquina',
    description: 'Luminária de LED versátil projetada especificamente para fixação no suporte de fios (porta-fios).',
    price: 38.00,
    stock: 15,
    sku: 'LUM-LED-PF',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fthumb_280_3fc3e59e-bf6b-4169-9134-77bbd91798d5.jpg?alt=media',
    spec: 'LED • Fixação Porta-Fio'
  },
  {
    id: 'l7',
    name: 'Led para máquina de costura com imã',
    category: 'Luminária p/ máquina',
    description: 'Luminária de LED econômica e potente com base magnética forte para cabeçote.',
    price: 35.00,
    stock: 25,
    sku: 'LUM-LED-IMA',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fthumb_280_bcd6539d-ab97-4681-9d06-278688482258.jpg?alt=media',
    spec: 'LED • Base Magnética'
  },

  // ACESSÓRIOS
  {
    id: 'a8',
    name: 'Óleo de 1L para maquina',
    category: 'Acessórios p/ máquina',
    description: 'Óleo lubrificante de alta qualidade para máquinas industriais e domésticas.',
    price: 28.00,
    stock: 40,
    sku: 'ACC-OLE-1L',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fthumb_280_0199077f-441c-407c-9dc3-537cad0ac002.jpg?alt=media',
    spec: '1 Litro'
  },
  {
    id: 'a7',
    name: 'Kit 5 carretilhas (canelinha) alumínio colorido',
    category: 'Acessórios p/ máquina',
    description: 'Canelinhas de alumínio anodizado colorido para máquina reta industrial.',
    price: 10.00,
    stock: 50,
    sku: 'ACC-CAR-COL-5',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fthumb_280_ac97741c-32ab-49e1-915c-df6813a00ebf.jpg?alt=media',
    spec: '5 Unidades'
  },
  {
    id: 'a9',
    name: 'Correia de motor para máquina industrial',
    category: 'Acessórios p/ máquina',
    description: 'Correia de transmissão de alta resistência para motores industriais.',
    price: 15.00,
    stock: 35,
    sku: 'ACC-COR-MOT',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fthumb_280_1a5e7ac4-3a97-4a4a-ae96-f6fb9fc58bf8.jpg?alt=media',
    spec: 'Padrão Industrial'
  },
  {
    id: 'a10',
    name: 'Graxa Branca Especial',
    category: 'Acessórios p/ máquina',
    description: 'Graxa branca para lubrificação de engrenagens de plástico e metal.',
    price: 12.00,
    stock: 30,
    sku: 'ACC-GRX-BRN',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fthumb_280_45fedf78-af2c-4814-b464-3a41a2759091.jpg?alt=media',
    spec: 'Tubo 100g'
  },

  // BARBANTES
  {
    id: 'b1',
    name: 'Barbantes euroroma n°6 e n°8 600g',
    category: 'Barbantes',
    description: 'Barbantes EuroRoma ecológicos, ideais para crochê e artesanato.',
    price: 19.90,
    stock: 60,
    sku: 'BAR-EUR-68-600',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fthumb_280_54b633fc-db6b-4d30-aca7-51fca5d094f7.jpg?alt=media',
    spec: '600g • N°6 / N°8'
  },

  // LINHAS
  {
    id: 'l1',
    name: 'Linha de costura 120 Resistente 2000j',
    category: 'Linhas e fios',
    description: 'Linha de alta performance para costura em máquinas industriais.',
    price: 5.80,
    stock: 120,
    sku: 'LNH-RES-120-2000',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fthumb_280_c55016f8-cff5-4c71-8df3-77075ceb1816.jpg?alt=media',
    spec: '2000j • 120'
  },
  {
    id: 'l2',
    name: 'Linha korefios 120 1500j',
    category: 'Linhas e fios',
    description: 'Linha Korefios de alta qualidade para acabamento fino.',
    price: 6.50,
    stock: 90,
    sku: 'LNH-KOR-120-1500',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fthumb_280_32b7141c-4bed-4aea-a6d2-cadfae4c3387.jpg?alt=media',
    spec: '1500j • 120'
  },
  {
    id: 'l4',
    name: 'Linha setta 2000j 120',
    category: 'Linhas e fios',
    description: 'Linha Setta de alta performance reconhecida pela uniformidade.',
    price: 6.90,
    stock: 110,
    sku: 'LNH-SET-120-2000',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fthumb_280_f260fdaa-1e7f-40aa-9cfc-6379da0fe72f.jpg?alt=media',
    spec: '2000j • 120'
  },
  {
    id: 'l5',
    name: 'Linha wlamar 120 2000j',
    category: 'Linhas e fios',
    description: 'Linha Wlamar de excelência para durabilidade extrema.',
    price: 7.20,
    stock: 85,
    sku: 'LNH-WLA-120-2000',
    image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fthumb_280_06f7aa10-cef2-4496-96a0-3bf9e3a37838.jpg?alt=media',
    spec: '2000j • 120'
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
  },
  {
    id: 'c2',
    name: 'Marcos Oliveira',
    email: 'marcos.oli@bol.com.br',
    phone: '(11) 97766-5544',
    totalSpent: 120.00,
    ordersCount: 2,
    lastPurchase: '2024-05-20'
  }
];
