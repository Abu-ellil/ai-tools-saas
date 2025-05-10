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
    // في بيئة التطوير، إذا كان هناك خطأ في مفتاح API، استخدم نموذج وهمي
    const isDevelopment = process.env.NODE_ENV === "development";
    const mockResponse = `هذا رد وهمي لأغراض التطوير. لقد سألت: "${
      messages[messages.length - 1]?.content || "لا يوجد سؤال"
    }"`;

    // Handle OpenAI models
    if (model.startsWith("gpt")) {
      try {
        // التحقق من وجود مفتاح API صالح
        if (
          !process.env.OPENAI_API_KEY ||
          process.env.OPENAI_API_KEY === "sk-demo-key-for-development-only"
        ) {
          if (isDevelopment) {
            console.log(
              "Using mock response in development mode (no valid OpenAI API key)"
            );
            return mockResponse;
          } else {
            throw new Error("مفتاح OpenAI API غير صالح");
          }
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

        // في بيئة التطوير، استخدم نموذج وهمي في حالة الخطأ
        if (isDevelopment) {
          console.log("Using mock response due to OpenAI API error");
          return mockResponse;
        }

        throw error;
      }
    }

    // Handle Anthropic models
    else if (model.startsWith("claude")) {
      try {
        // التحقق من وجود مفتاح API صالح
        if (
          !process.env.ANTHROPIC_API_KEY ||
          process.env.ANTHROPIC_API_KEY === "your_anthropic_api_key"
        ) {
          if (isDevelopment) {
            console.log(
              "Using mock response in development mode (no valid Anthropic API key)"
            );
            return mockResponse;
          } else {
            throw new Error("مفتاح Anthropic API غير صالح");
          }
        }

        // Convert our message format to Anthropic's format
        const systemMessage =
          messages.find((msg) => msg.role === "system")?.content || "";

        // Filter out system messages as they're handled separately in Anthropic
        const nonSystemMessages = messages.filter(
          (msg) => msg.role !== "system"
        );

        // تحويل الرسائل إلى تنسيق Anthropic
        // Anthropic يقبل فقط role من نوع "user" أو "assistant"
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

        // التعامل مع محتوى الاستجابة
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

        // في بيئة التطوير، استخدم نموذج وهمي في حالة الخطأ
        if (isDevelopment) {
          console.log("Using mock response due to Anthropic API error");
          return mockResponse;
        }

        throw error;
      }
    }

    // في بيئة التطوير، استخدم نموذج وهمي للنماذج غير المدعومة
    if (isDevelopment) {
      console.log(`Using mock response for unsupported model: ${model}`);
      return mockResponse;
    }

    throw new Error(`النموذج غير مدعوم: ${model}`);
  } catch (error) {
    console.error("Error generating AI response:", error);

    // في بيئة التطوير، استخدم نموذج وهمي في حالة الخطأ
    if (process.env.NODE_ENV === "development") {
      console.log("Using mock response due to general error");
      return `هذا رد وهمي لأغراض التطوير. حدث خطأ: ${
        error instanceof Error ? error.message : "خطأ غير معروف"
      }`;
    }

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
