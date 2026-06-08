import { GoogleGenAI, Type } from "@google/genai";

export interface GeneratedContent {
  slides: {
    slideNumber: number;
    title: string;
    content: string;
    templateType: "Cover" | "Definition" | "Fact" | "CTA" | "Concept" | "Example";
  }[];
  caption: string;
  hashtags: string[];
}

export const generateCarousel = async (topic: string): Promise<GeneratedContent> => {
  console.log(`[GeminiService] Generating content for topic: "${topic}"...`);
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Generate an educational Instagram carousel about "${topic}". The content must be factually accurate, highly engaging, and educational in tone. Provide a moderate amount of detail (about 2 to 3 detailed sentences per slide) so it feels premium and informative, but not overwhelming. Return EXACTLY 7 slides following this structure: Hook (Cover), Definition, Concept, Concept, Example, Interesting Fact, Call To Action (CTA). Also provide a caption with an introduction, key takeaway, and hashtags.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          slides: {
            type: Type.ARRAY,
            description: "Exactly 7 educational slides",
            items: {
              type: Type.OBJECT,
              properties: {
                slideNumber: { type: Type.INTEGER, description: "Slide sequence number (1-7)" },
                title: { type: Type.STRING, description: "Catchy title for the slide" },
                content: { type: Type.STRING, description: "Main content of the slide (about 2 to 3 informative sentences. DO NOT make it a single short sentence)." },
                templateType: { 
                  type: Type.STRING, 
                  enum: ["Cover", "Definition", "Fact", "CTA", "Concept", "Example"],
                  description: "The visual template to use for this slide"
                }
              },
              required: ["slideNumber", "title", "content", "templateType"]
            }
          },
          caption: { type: Type.STRING, description: "Instagram caption containing intro and key takeaway" },
          hashtags: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of relevant hashtags without the # symbol"
          }
        },
        required: ["slides", "caption", "hashtags"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate content from Gemini API");
  }

  const result = JSON.parse(response.text) as GeneratedContent;
  return result;
};
