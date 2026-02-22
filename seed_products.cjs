const https = require('https');
const fs = require('fs');
const path = require('path');

// Ler .env.local manualmente para evitar dependências extras
const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length === 2) {
        env[parts[0].trim()] = parts[1].trim().replace(/^"(.*)"$/, '$1');
    }
});

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("ERRO: Credenciais do Supabase não encontradas no .env.local");
    process.exit(1);
}

// Dados do Catálogo
const products = [
    {
        id: 'f260fdaa-1e7f-40aa-9cfc-6379da0fe72f', // UUID extraído da URL da imagem Kyte por conveniência
        name: 'Linha Setta 120 2000j',
        category: 'Linhas e fios',
        description: 'Linha de costura de alta qualidade da marca Setta, etiqueta 120. Com 2000 jardas, oferece resistência superior.',
        price: 6.20,
        stock: 90,
        sku: 'LNH-SET-120-2000',
        image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Ff260fdaa-1e7f-40aa-9cfc-6379da0fe72f.jpg?alt=media',
        spec: '2000 jardas • Etiqueta 120 • 100% Poliéster',
        barcode: '',
        images: []
    },
    {
        id: '32b7141c-4bed-4aea-a6d2-cadfae4c3387',
        name: 'Linha Korefios 120 1500j',
        category: 'Linhas e fios',
        description: 'Linha de alta qualidade da marca Korefios, etiqueta 120. Ideal para costuras em tecidos leves e médios.',
        price: 6.50,
        stock: 150,
        sku: 'LNH-KOR-120-1500',
        image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F32b7141c-4bed-4aea-a6d2-cadfae4c3387.jpg?alt=media',
        spec: '1500 jardas • Etiqueta 120 • 100% Poliéster',
        barcode: '',
        images: [
            'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F32b7141c-4bed-4aea-a6d2-cadfae4c3387.jpg?alt=media',
            'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fa4b065af-5383-4f32-8f36-a2bcb45bbeac.jpg?alt=media'
        ]
    },
    {
        id: 'c55016f8-cff5-4c71-8df3-77075ceb1816',
        name: 'Linha de costura 120 Resistente 2000j',
        category: 'Linhas e fios',
        description: 'Linha de alta performance e resistência extra. Com 2000 jardas, é perfeita para produção profissional.',
        price: 5.80,
        stock: 120,
        sku: 'LNH-RES-120-2000',
        image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fc55016f8-cff5-4c71-8df3-77075ceb1816.jpg?alt=media',
        spec: '2000 jardas • Etiqueta 120',
        barcode: '',
        images: []
    },
    {
        id: '06f7aa10-cef2-4496-96a0-3bf9e3a37838',
        name: 'Linha Wlamar 120 2000j',
        category: 'Linhas e fios',
        description: 'Linha de costura Wlamar, ideal para acabamentos e costuras diversas.',
        price: 6.00,
        stock: 80,
        sku: 'LNH-WLA-120-2000',
        image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F06f7aa10-cef2-4496-96a0-3bf9e3a37838.jpg?alt=media',
        spec: '2000 jardas • Etiqueta 120',
        barcode: '',
        images: []
    }
];

const restProducts = [
    { id: 'd8b5699c-564a-4c85-bc31-61c464389b61', name: 'Chave liga/desliga para máquina', category: 'Acessórios p/ máquina', description: 'Chave de acionamento segura para motores de máquinas de costura industriais.', price: 35.0, stock: 15, sku: 'ACC-CHV-LIG', image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fd8b5699c-564a-4c85-bc31-61c464389b61.jpg?alt=media', spec: 'Compatível com motores 1/2HP e 3/4HP', barcode: '', images: [] },
    { id: '1a5e7ac4-3a97-4a4a-ae96-f6fb9fc58bf8', name: 'Correia de motor para máquina industrial', category: 'Acessórios p/ máquina', description: 'Correia de transmissão reforçada para motores de máquinas industriais.', price: 15.0, stock: 45, sku: 'COR-MOT-IND', image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F1a5e7ac4-3a97-4a4a-ae96-f6fb9fc58bf8.jpg?alt=media', spec: 'Diversas medidas (M-30 a M-60)', barcode: '', images: [] },
    { id: '45fedf78-af2c-4814-b464-3a41a2759091', name: 'Graxa branca especial', category: 'Acessórios p/ máquina', description: 'Lubrificante de alta performance para engrenagens de máquinas.', price: 12.9, stock: 25, sku: 'GRX-BRA-IND', image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F45fedf78-af2c-4814-b464-3a41a2759091.jpg?alt=media', spec: 'Pote 100g • Alta Viscosidade', barcode: '', images: [] },
    { id: '5835e1cb-80a2-499c-9bbf-0aa33ff1203c', name: 'Kit 10 carretilhas (canelinha) Reta Industrial', category: 'Acessórios p/ máquina', description: 'Jogo com 10 carretilhas de aço para máquinas de costura reta industrial.', price: 20.0, stock: 50, sku: 'KIT-CAR-RET-IND', image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F5835e1cb-80a2-499c-9bbf-0aa33ff1203c.jpg?alt=media', spec: 'Aço Carbono • Padrão Industrial', barcode: '', images: [] },
    { id: 'ac97741c-32ab-49e1-915c-df6813a00ebf', name: 'Kit 5 carretilhas Alumínio Colorido', category: 'Acessórios p/ máquina', description: 'Carretilhas leves de alumínio colorido para máquinas industriais.', price: 15.0, stock: 30, sku: 'KIT-CAR-ALU-COL', image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fac97741c-32ab-49e1-915c-df6813a00ebf.jpg?alt=media', spec: 'Alumínio • Cores Sortidas', barcode: '', images: [] },
    { id: '0199077f-441c-407c-9dc3-537cad0ac002', name: 'Óleo para máquina (1 Litro)', category: 'Acessórios p/ máquina', description: 'Óleo mineral transparente para lubrificação de máquinas industriais.', price: 28.0, stock: 40, sku: 'OL-MAQ-1L', image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F0199077f-441c-407c-9dc3-537cad0ac002.jpg?alt=media', spec: 'Mineral • Baixa Viscosidade', barcode: '', images: [] },
    { id: 'b2618fa7-7867-4773-afc6-124c09491494', name: 'Óleo para máquina (5 Litros)', category: 'Acessórios p/ máquina', description: 'Óleo lubrificante em galão de 5 litros para maior economia.', price: 120.0, stock: 12, sku: 'OL-MAQ-5L', image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fb2618fa7-7867-4773-afc6-124c09491494.jpg?alt=media', spec: 'Galão Econômico • Uso Industrial', barcode: '', images: [] },
    { id: '4daf8d8c-6c52-41a9-b902-7897a9d0d887', name: 'Óleo Singer (1 Litro)', category: 'Acessórios p/ máquina', description: 'Óleo de marca premium para manutenção de máquinas de costura.', price: 35.0, stock: 20, sku: 'OL-SIN-1L', image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F4daf8d8c-6c52-41a9-b902-7897a9d0d887.jpg?alt=media', spec: 'Marca Original Singer', barcode: '', images: [] },
    { id: '991360f3-c014-449b-a8ec-d717c0ebdbd9', name: 'Polia de motor para máquina industrial', category: 'Acessórios p/ máquina', description: 'Polia de alumínio para motores de embreagem e eletrônicos.', price: 22.0, stock: 18, sku: 'POL-MOT-IND', image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F991360f3-c014-449b-a8ec-d717c0ebdbd9.jpg?alt=media', spec: 'Alumínio • Diversos diâmetros', barcode: '', images: [] },
    { id: '5081d585-a4c9-4a76-bc3f-88bf4bc1e5a7', name: 'Puxador e Passador de Elásticos/Cordão', category: 'Acessórios p/ máquina', description: 'Kit de ferramentas auxiliares para passar elásticos e virar roletês.', price: 15.0, stock: 25, sku: 'KIT-PUX-ELAS', image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F5081d585-a4c9-4a76-bc3f-88bf4bc1e5a7.jpg?alt=media', spec: 'Kit Completo • Aço Inox', barcode: '', images: [] },
    { id: '7c1f3326-d698-4794-87d9-de889cd0f559', name: 'Suporte de acessórios magnético', category: 'Acessórios p/ máquina', description: 'Organizador com imã potente para agulhas, alfinetes e utensílios.', price: 18.5, stock: 22, sku: 'SUP-MAG-ACC', image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F7c1f3326-d698-4794-87d9-de889cd0f559.jpg?alt=media', spec: 'Imã Extra Forte', barcode: '', images: [] },
    { id: '9bf4336c-72f9-4f08-8b97-cd3f5ecb1d64', name: 'Suporte de carretilha magnética (4 pilares)', category: 'Acessórios p/ máquina', description: 'Suporte magnético com 4 hastes para organização de carretilhas.', price: 25.0, stock: 14, sku: 'SUP-CAR-MAG-4', image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F9bf4336c-72f9-4f08-8b97-cd3f5ecb1d64.jpg?alt=media', spec: '4 Pilares • Base Magnética', barcode: '', images: [] },
    { id: '40375149-2c94-48f5-ae74-6d16eb4066ea', name: 'Suporte de celular imã flexível', category: 'Acessórios p/ máquina', description: 'Haste flexível com base magnética para fixar celular na máquina.', price: 45.0, stock: 10, sku: 'SUP-CEL-FLX', image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F40375149-2c94-48f5-ae74-6d16eb4066ea.jpg?alt=media', spec: 'Flexível • Fixação Instantânea', barcode: '', images: [] },
    { id: '54b633fc-db6b-4d30-aca7-51fca5d094f7', name: 'Barbante EuroRoma n°6 e n°8 (600g)', category: 'Barbantes', description: 'Barbante ecológico de alta qualidade para artesanato e crochê.', price: 18.9, stock: 60, sku: 'BAR-EUR-6-8-600', image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F54b633fc-db6b-4d30-aca7-51fca5d094f7.jpg?alt=media', spec: '600g • Ecológico • Várias Cores', barcode: '', images: [] },
    { id: 'bcd6539d-ab97-4681-9d06-278688482258', name: 'Led para máquina de costura com imã', category: 'Luminária p/ máquina', description: 'Luminária de 20 ou 30 pontos de LED com base magnética e haste flexível.', price: 35.0, stock: 30, sku: 'LUM-LED-IMA', image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2Fbcd6539d-ab97-4681-9d06-278688482258.jpg?alt=media', spec: 'Bivolt • Magnética • Flexível', barcode: '', images: [] },
    { id: '3fc3e59e-bf6b-4169-9134-77bbd91798d5', name: 'Luminária led para porta fio', category: 'Luminária p/ máquina', description: 'Iluminação potente adaptada para o suporte de linhas da máquina.', price: 40.0, stock: 15, sku: 'LUM-LED-PFT', image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F3fc3e59e-bf6b-4169-9134-77bbd91798d5.jpg?alt=media', spec: 'Especial p/ Porta Fio', barcode: '', images: [] },
    { id: '40500dae-f6d8-412e-bde4-9e91019d99e1', name: 'Aparelho de viés de 2 dobras (Reta Industrial)', category: 'Acessórios p/ máquina', description: 'Aparelho importado para aplicação de viés com duas dobras em máquina reta.', price: 45.0, stock: 8, sku: 'AP-VIES-RET-IMP', image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F40500dae-f6d8-412e-bde4-9e91019d99e1.jpg?alt=media', spec: 'Aço Inox • Diversas Medidas', barcode: '', images: [] },
    { id: '8d0057f1-b7be-49c5-b73c-f7ff427ca2b8', name: 'Aparelho de elástico (Overloque Nacional)', category: 'Acessórios p/ máquina', description: 'Tensora de elástico nacional para máquinas overloque.', price: 125.0, stock: 5, sku: 'AP-ELA-OV-NAC', image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F8d0057f1-b7be-49c5-b73c-f7ff427ca2b8.jpg?alt=media', spec: 'Fabricação Nacional • Alta Durabilidade', barcode: '', images: [] },
    { id: '45b67c5f-13ae-4d23-89d1-b3f0422c216d', name: 'Aparelho de viés de 2 dobras (Galoneira)', category: 'Acessórios p/ máquina', description: 'Guia de viés importado para galoneira industrial.', price: 60.0, stock: 6, sku: 'AP-VIES-GAL-IMP', image: 'https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/iBbZtqJaXiRiqTXCxZ8jVLMy9Ym1%2F45b67c5f-13ae-4d23-89d1-b3f0422c216d.jpg?alt=media', spec: 'Aço Inox • Alta Precisão', barcode: '', images: [] }
];

const allProducts = [...products, ...restProducts];

async function seed() {
    console.log(`Iniciando população de ${allProducts.length} produtos...`);

    const postData = JSON.stringify(allProducts);

    const options = {
        hostname: SUPABASE_URL.replace('https://', ''),
        path: '/rest/v1/products',
        method: 'POST',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
        }
    };

    const req = https.request(options, (res) => {
        let responseBody = '';
        res.on('data', (chunk) => { responseBody += chunk; });
        res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                console.log("Sucesso! Produtos inseridos/atualizados.");
            } else {
                console.error(`Erro: Status ${res.statusCode}`);
                console.error(responseBody);
            }
        });
    });

    req.on('error', (e) => {
        console.error(`Erro na requisição: ${e.message}`);
    });

    req.write(postData);
    req.end();
}

seed();
