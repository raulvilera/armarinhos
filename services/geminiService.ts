
import { GoogleGenAI } from "@google/genai";
import { SHOP_CONTACTS } from "../constants";
import { Product } from "../types";

export const getGeminiResponse = async (userPrompt: string, currentView: string, products?: Product[]) => {
  try {
    // Configuração oficial para SDK v1.x+
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const infoContext = `
      Vicmar Armarinhos - Contexto:
      - Local: ${SHOP_CONTACTS.address}
      - Contato: WhatsApp ${SHOP_CONTACTS.whatsapp}, Email ${SHOP_CONTACTS.email}
      - Social: ${SHOP_CONTACTS.instagram}
    `;

    const stockSummary = products ? `Estoque atualizado: ${products.slice(0, 10).map(p => `${p.name} (${p.stock}un)`).join(', ')}...` : '';

    const systemInstructions = currentView.includes('DASHBOARD') || currentView.includes('CATALOG') || currentView.includes('POS')
      ? `Você é o analista 'VicmarSaaS'. Ajude o lojista a gerenciar o negócio. Dados: ${stockSummary}. Seja preciso e técnico. ${infoContext}`
      : `Você é a assistente virtual do 'Armarinhos Vicmar'. Ajude clientes com dúvidas sobre produtos e costura. Estoque disponível: ${stockSummary}. Seja amigável e acolhedora. ${infoContext}`;

    // Chamada correta para geração de conteúdo
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstructions,
        temperature: 0.8,
      },
    });

    // Retorno do texto extraído corretamente da resposta
    return response.text || "Estou reajustando minha linha de raciocínio. Pode perguntar novamente?";
  } catch (error) {
    console.error("Gemini SDK Error:", error);
    return "Tive um problema técnico ao processar sua solicitação. Por favor, tente novamente.";
  }
};
