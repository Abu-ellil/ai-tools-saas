import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export type AIModel =
  | "gpt-3.5-turbo"
  | "gpt-4"
  | "gpt-4-turbo-preview" // تحديث اسم النموذج
  | "gpt-4-0125-preview" // إصدار بديل
  | "claude-3-opus"
  | "claude-3-sonnet";

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function generateChatResponse(
  messages: Message[],
  model: AIModel
): Promise<string> {
  try {
    // Handle OpenAI models
    if (model.startsWith("gpt")) {
      try {
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-demo-key-for-development-only") {
          throw new Error("مفتاح OpenAI API غير صالح");
        }
        const response = await openai.chat.completions.create({
          model: model,
          messages: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          temperature: 0.7,
          max_tokens: 1000,
        });
        return (
          response.choices[0]?.message?.content || "لا توجد استجابة من النموذج"
        );
      } catch (error) {
        console.error("Error with OpenAI API:", error);
        throw error;
      }
    }
    // Handle Anthropic models
    else if (model.startsWith("claude")) {
      try {
        if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your_anthropic_api_key") {
          throw new Error("مفتاح Anthropic API غير صالح");
        }
        const systemMessage =
          messages.find((msg) => msg.role === "system")?.content || "";
        const nonSystemMessages = messages.filter(
          (msg) => msg.role !== "system"
        );
        const anthropicMessages = nonSystemMessages.map((msg) => ({
          role: msg.role === "system" ? "user" : msg.role,
          content: msg.content,
        }));
        const response = await anthropic.messages.create({
          model: model,
          system: systemMessage,
          messages: anthropicMessages,
          temperature: 0.7,
          max_tokens: 1000,
        });
        let responseText = "لا توجد استجابة من النموذج";
        if (response.content && response.content.length > 0) {
          const firstContent = response.content[0];
          if (typeof firstContent === "object" && "text" in firstContent) {
            responseText = firstContent.text;
          }
        }
        return responseText;
      } catch (error) {
        console.error("Error with Anthropic API:", error);
        throw error;
      }
    }
    throw new Error(`النموذج غير مدعوم: ${model}`);
  } catch (error) {
    console.error("Error generating AI response:", error);
    return `حدث خطأ أثناء توليد الاستجابة: ${
      error instanceof Error ? error.message : "خطأ غير معروف"
    }`;
  }
}

// Function to validate if we have the API key for a specific model
export function hasValidApiKey(model: AIModel): boolean {
  // في بيئة التطوير، نسمح باستخدام نماذج OpenAI فقط إذا كان المفتاح موجودًا
  const isDevelopment = process.env.NODE_ENV === "development";

  if (model.startsWith("gpt")) {
    return (
      !!process.env.OPENAI_API_KEY &&
      process.env.OPENAI_API_KEY !== "your_openai_api_key"
    );
  } else if (model.startsWith("claude")) {
    // في بيئة التطوير، نعتبر أن نماذج Claude غير متاحة إذا لم يكن هناك مفتاح API
    if (
      isDevelopment &&
      (!process.env.ANTHROPIC_API_KEY ||
        process.env.ANTHROPIC_API_KEY === "your_anthropic_api_key")
    ) {
      console.warn(
        "Anthropic API key is not set. Claude models are not available."
      );
      return false;
    }

    return (
      !!process.env.ANTHROPIC_API_KEY &&
      process.env.ANTHROPIC_API_KEY !== "your_anthropic_api_key"
    );
  }
  return false;
}
