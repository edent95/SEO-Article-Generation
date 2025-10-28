import { GoogleGenAI, Type } from "@google/genai";
import { OptimizedArticle, OptimizationResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const keywordDataSchema = {
  type: Type.OBJECT,
  properties: {
    text: { type: Type.STRING, description: "The keyword phrase." },
    kd: { type: Type.NUMBER, description: "Estimated Keyword Difficulty (0-100)." },
    volume: { type: Type.NUMBER, description: "Estimated monthly search volume." },
  },
  required: ["text", "kd", "volume"],
};

const optimizationSchema = {
  type: Type.OBJECT,
  properties: {
    refinedTitle: {
      type: Type.STRING,
      description: "The SEO-optimized title for the article."
    },
    keywordAnalysis: {
      type: Type.OBJECT,
      properties: {
        suggestedKeywords: {
          type: Type.ARRAY,
          description: "A list of suggested keyword replacements with data.",
          items: {
            type: Type.OBJECT,
            properties: {
              original: { ...keywordDataSchema, description: "The original keyword and its metrics." },
              suggestion: { ...keywordDataSchema, description: "The suggested new keyword and its metrics." },
              reason: { type: Type.STRING, description: "The reason for the suggestion." }
            },
            required: ["original", "suggestion", "reason"]
          }
        }
      },
      required: ["suggestedKeywords"]
    },
    refinedContentHtml: {
      type: Type.STRING,
      description: "The full, rewritten article content in clean, semantic HTML format, ready for publishing."
    },
    fetchedContentText: {
      type: Type.STRING,
      description: "The raw, unformatted text content that was fetched from the provided URL for analysis."
    }
  },
  required: ["refinedTitle", "keywordAnalysis", "refinedContentHtml", "fetchedContentText"]
};


export const optimizeArticleAndGenerateImages = async (
  url: string, 
  tone: string, 
  audience: string,
  preferredKeywords: string[]
): Promise<OptimizationResult> => {
  
  // --- Step 1: Generate Optimized Article ---
  let toneInstruction = '';
  if (tone && tone !== 'Default') {
    toneInstruction = `Adopt a **${tone.toLowerCase()}** tone of voice.`;
  }

  let audienceInstruction = '';
  if (audience) {
    audienceInstruction = `The target audience is **${audience}**. Tailor the language, complexity, and examples for this group.`;
  }
  
  let keywordHistoryInstruction = '';
  if(preferredKeywords.length > 0) {
    keywordHistoryInstruction = `**User's Preferred Keyword History:** The user has previously focused on these keywords: [${preferredKeywords.join(', ')}]. Consider this history to suggest related keywords or build upon their existing strategy to establish topic authority.`
  }

  const articlePrompt = `
    You are a world-class SEO expert and copywriter. I will provide a URL and content instructions.

    **IMPORTANT: All output you generate, including titles, keywords, and the article content, must be in English.**

    Your task is to perform the following optimizations and return the result as a single JSON object matching the provided schema.

    1.  **Fetch Content:** First, act as a web crawler. Access the provided URL, parse the main article content, and use that for your analysis. **You must return this raw, unformatted text in the 'fetchedContentText' field.** If the original article is not in English, translate its concepts for your analysis.
    2.  **Refine Title:** Based on the content, create a compelling, SEO-friendly English title that is highly clickable.
    3.  **Analyze & Suggest Keywords:**
        *   Identify the top 3-5 primary English keywords from the article's topic.
        *   For each keyword, suggest a better English alternative with higher potential.
        *   For BOTH the original and the suggested keyword, you MUST provide an estimated **Keyword Difficulty (KD)** on a 0-100 scale and an estimated monthly **Search Volume** as an integer. Base these estimations on your vast training data.
        *   Provide a brief reason in English for each suggestion.
        *   ${keywordHistoryInstruction}
    4.  **Refine Content:**
        *   Rewrite the article content in English to be more engaging and SEO-optimized. ${toneInstruction} ${audienceInstruction}
        *   **Stylistic Guide:** Use the article at https://edentan.co/rojak-marketing/ as a stylistic reference for the HTML structure and content flow.
        *   **Structure and Formatting:**
            *   Keep paragraphs short and focused (2-4 sentences).
            *   Use frequent H2 and H3 tags for clear hierarchy.
            *   Incorporate \`<blockquote>\` elements for key takeaways or impactful statements.
            *   Use \`<strong>\` and \`<em>\` for emphasis on important terms.
            *   Employ numbered \`<ol>\` and bulleted \`<ul>\` lists to make complex information digestible.
            *   Include a concluding summary section (e.g., "Key Takeaways" or "Final Thoughts").
        *   **Keywords & Links:** Naturally integrate the new suggested English keywords and add 2-3 high-quality, relevant backlinks to authoritative domains.
        *   **Visuals:** Instead of complex charts, embed 1-2 well-structured HTML tables or create "Key Insight" boxes using styled \`div\`s to present data or important points visually.
        *   **Final Output:** Format the entire article as clean, semantic HTML suitable for a WordPress blog post.

    URL: ${url}
  `;
  
  let article: OptimizedArticle;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: articlePrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: optimizationSchema,
        temperature: 0.7,
      }
    });

    const jsonText = response.text.trim();
    article = JSON.parse(jsonText) as OptimizedArticle;
  } catch (error) {
    console.error("Error calling Gemini API for article generation:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to optimize article. Gemini API error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while optimizing the article.");
  }
  
  // --- Step 2: Generate Cover Images ---
  let coverImages: string[] = [];
  try {
    const imagePrompt = `Create a visually stunning, high-resolution blog cover photo with a 16:9 aspect ratio. The image should be professional, engaging, and directly related to the article title: "${article.refinedTitle}". The style should be modern and clean.`;
    
    const imageResponse = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: imagePrompt,
      config: {
        numberOfImages: 3,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });
    
    coverImages = imageResponse.generatedImages.map(img => img.image.imageBytes);

  } catch(error) {
    console.warn("Image generation failed, but returning article content.", error);
    // Non-fatal error: return the article even if images fail.
  }

  return { article, coverImages };
};