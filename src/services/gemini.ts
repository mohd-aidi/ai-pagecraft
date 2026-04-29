import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface GeneratedPage {
  html: string;
  explanation: string;
}

export async function generatePage(prompt: string): Promise<GeneratedPage> {
  const systemInstruction = `
You are an expert web designer and developer. 
Generate a complete, single-file HTML page based on the user's request.
Requirements:
1. Use Tailwind CSS for styling. Since this will be rendered in an iframe, use the Tailwind Play CDN: <script src="https://unpkg.com/@tailwindcss/browser@4"></script>.
2. Use Lucide icons if icons are needed: <script src="https://unpkg.com/lucide@latest"></script>. You must call lucide.createIcons() at the end of the body to render them.
3. Use Google Fonts if specific typography is requested.
4. Ensure the design is responsive and professional.
5. Use high-quality placeholders for images if needed (e.g. Unsplash).
6. The HTML must be self-contained and ready to preview.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            html: { 
              type: Type.STRING,
              description: "The full HTML source code of the page"
            },
            explanation: { 
              type: Type.STRING,
              description: "A brief explanation of the design choices"
            }
          },
          required: ["html", "explanation"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return result as GeneratedPage;
  } catch (error) {
    console.error("Error generating page:", error);
    throw error;
  }
}
