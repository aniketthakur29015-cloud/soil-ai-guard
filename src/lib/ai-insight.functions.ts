import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InsightInput = z.object({
  areaHa: z.number(),
  lat: z.number(),
  lng: z.number(),
  crop: z.string().optional(),
  weather: z.string(),
  soil: z.string(),
  satellite: z.string(),
  diseases: z.string(),
  detailed: z.boolean().optional(),
});

export type FieldInsight = {
  summary: string;
  recommendations: string[];
};

const MODEL = "google/gemini-3.8-flash";

export const generateFieldInsight = createServerFn({ method: "POST" })
  .validator((input: unknown) => InsightInput.parse(input))
  .handler(async ({ data }): Promise<FieldInsight> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured for this app.");

    const prompt = `You are an agronomy advisor for Indian smallholder and mid-size farmers.
Field: ${data.areaHa.toFixed(2)} hectares at ${data.lat.toFixed(4)}, ${data.lng.toFixed(4)}${data.crop ? `, crop: ${data.crop}` : ""}.
Weather: ${data.weather}
Soil: ${data.soil}
Satellite indices: ${data.satellite}
Disease model output: ${data.diseases}

Write a ${data.detailed ? "detailed" : "short"} plain-language assessment.
Return ONLY JSON: {"summary": string, "recommendations": string[]}.
summary: ${data.detailed ? "3-4 sentences" : "1-2 sentences"}, no jargon.
recommendations: ${data.detailed ? "6" : "5"} short, specific, practical actions a farmer can do this week.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: "You are a concise agronomy expert. Always reply with valid JSON only." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 429) throw new Error("AI is busy right now. Please try again in a moment.");
      if (res.status === 402) throw new Error("AI credits are exhausted for this workspace.");
      throw new Error(`AI request failed (${res.status}): ${body.slice(0, 200)}`);
    }

    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const text = json.choices?.[0]?.message?.content ?? "";
    try {
      const parsed = JSON.parse(text) as Partial<FieldInsight>;
      return {
        summary: typeof parsed.summary === "string" ? parsed.summary : text.slice(0, 400),
        recommendations: Array.isArray(parsed.recommendations)
          ? parsed.recommendations.filter((r): r is string => typeof r === "string").slice(0, 8)
          : [],
      };
    } catch {
      return { summary: text.slice(0, 400), recommendations: [] };
    }
  });
