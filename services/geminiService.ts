import { GoogleGenAI, Type } from "@google/genai";
import { Product, ProductFeature, GeminiSummary, Answers, Language } from "../types";
import { locales } from '../lib/locales';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. Using a placeholder.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || 'MISSING_API_KEY' });


export const generateProductSummary = async (
  product: Product,
  includedFeatures: ProductFeature[],
  missingFeatures: ProductFeature[],
  answers: Answers,
  language: Language
): Promise<GeminiSummary | null> => {
  try {
    const t = locales[language].gemini;

    const schema = {
      type: Type.OBJECT,
      properties: {
        productSummary: {
          type: Type.STRING,
          description: t.schemaDescription
        },
      },
      required: ['productSummary'],
    };

    const includedFeatureNames = includedFeatures.map(f => f.name).join(', ');
    const missingFeatureNames = missingFeatures.map(f => f.name).join(', ');
    
    const lawyerCount = answers.lawyerCount ? parseInt(answers.lawyerCount as string, 10) : 0;
    const derivedUserType = isNaN(lawyerCount) ? t.userTypeFirm : (lawyerCount === 1 ? t.userTypeSolo : t.userTypeFirm);

    const userContext = `${t.userContextIntro}: ${derivedUserType}.`;

    const prompt = `
      ${t.promptIntro}
      
      **${t.promptProfile}:** ${userContext}
      
      **${t.promptProduct}:** ${product.name}

      **${t.promptIncludedFeatures}:** ${includedFeatureNames || t.promptNoFeatures}
      
      **${t.promptMissingFeatures}:** ${missingFeatureNames || t.promptAllWishesMet}

      ${t.promptTask(product.name)}
    `;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: t.systemInstruction,
            responseMimeType: "application/json",
            responseSchema: schema,
        },
    });
    
    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText) as GeminiSummary;

    return parsedJson;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    const fallbackText = language === 'de' 
      ? `Für Ihre spezifischen Anforderungen ist ${product.name} eine ausgezeichnete Wahl. Es deckt viele Ihrer Bedürfnisse ab und bietet eine solide Grundlage für effizientes Kanzleimanagement. Für eine detaillierte Besprechung Ihrer Anforderungen empfehlen wir eine persönliche Demo.`
      : `For your specific requirements, ${product.name} is an excellent choice. It covers many of your needs and provides a solid foundation for efficient law firm management. For a detailed discussion of your requirements, we recommend a personal demo.`;
    return { productSummary: fallbackText };
  }
};