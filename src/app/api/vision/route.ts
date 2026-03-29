export const runtime = 'edge';

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return new Response(JSON.stringify({ error: "No image file provided" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Leverages perfectly constrained JSON mapping forcing AI to follow the data-structure natively
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      system: "You are an elite, highly-optimized AI nutritionist and macro estimator.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this exact food image. Identify the items visually present. Estimate the total calories, protein in grams, carbs in grams, and fats in grams. Return strictly as a JSON object matching this schema. Provide ONE very short, encouraging 1v1 piece of feedback as a 'feedback_tip'."
            },
            {
              type: "image",
              image: image // Base64 payload compressed tightly from the browser
            }
          ]
        }
      ],
      schema: z.object({
        item_name: z.string(),
        calories: z.number(),
        protein: z.number(),
        carbs: z.number(),
        fats: z.number(),
        feedback_tip: z.string()
      }),
    });

    return new Response(JSON.stringify(object), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Vision Processing Error:", error);
    return new Response(JSON.stringify({ error: "Failed to deeply analyze the provided image." }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
