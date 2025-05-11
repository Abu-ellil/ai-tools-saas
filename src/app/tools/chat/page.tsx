"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Check,
  ChevronDown,
  Send,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { AIModel } from "@/lib/ai-service";

// تعريف أنواع النماذج المتاحة
type Model = {
  id: AIModel;
  name: string;
  description: string;
  maxTokens: number;
  isNew?: boolean;
};

// قائمة النماذج المتاحة
const availableModels: Model[] = [
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    description: "نموذج سريع وفعال للمحادثات اليومية",
    maxTokens: 4096,
  },
  {
    id: "gpt-4",
    name: "GPT-4",
    description: "نموذج متقدم مع قدرات فهم وإنشاء محتوى أفضل",
    maxTokens: 8192,
  },
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    description: "أحدث إصدار من GPT-4 مع أداء محسن",
    maxTokens: 16384,
    isNew: true,
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    description: "نموذج متقدم من Anthropic مع قدرات تحليلية عالية",
    maxTokens: 100000,
    isNew: true,
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    description: "نموذج متوازن من Anthropic للمهام اليومية",
    maxTokens: 100000,
  },
];

export default function ChatPage() {
  // حالة الرسائل
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content: "مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟",
    },
  ]);

  // حالة النموذج المحدد
  const [selectedModel, setSelectedModel] = useState<Model>(availableModels[0]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // استدعاء API الحقيقي
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model: selectedModel.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            response.statusText ||
            "حدث خطأ أثناء الاتصال بالخادم"
        );
      }

      const data = await response.json();

      const assistantMessage = {
        role: "assistant" as const,
        content: data.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      // إظهار رسالة خطأ للمستخدم
      const errorMessage = {
        role: "assistant" as const,
        content: `عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً. ${
          error instanceof Error ? error.message : ""
        }`,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">المحادثة الذكية</h1>
          <p className="text-muted-foreground">
            تحدث مع نماذج ChatGPT المتطورة للحصول على إجابات ذكية ومساعدة في
            مختلف المجالات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>المحادثة</CardTitle>
                  <CardDescription>
                    اطرح أسئلتك وسأقوم بالإجابة عليها
                  </CardDescription>
                </div>

                {/* قائمة اختيار النموذج */}
                <div className="flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span>{selectedModel.name}</span>
                          {selectedModel.isNew && (
                            <span className="bg-primary/20 text-primary text-xs py-0.5 px-1.5 rounded-md">
                              جديد
                            </span>
                          )}
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[260px]">
                      {availableModels.map((model) => (
                        <DropdownMenuItem
                          key={model.id}
                          className={cn(
                            "flex items-center justify-between py-2 cursor-pointer",
                            selectedModel.id === model.id && "bg-accent"
                          )}
                          onClick={() => setSelectedModel(model)}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{model.name}</span>
                              {model.isNew && (
                                <span className="bg-primary/20 text-primary text-xs py-0.5 px-1.5 rounded-md">
                                  جديد
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {model.description}
                            </p>
                          </div>
                          {selectedModel.id === model.id && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-75"></div>
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-150"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <form
                  onSubmit={handleSubmit}
                  className="w-full flex space-x-2 rtl:space-x-reverse"
                >
                  <Input
                    placeholder="اكتب رسالتك هنا..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>الرصيد المتبقي</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85</div>
                <p className="text-xs text-muted-foreground mt-1">
                  من أصل 100 رسالة
                </p>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      {selectedModel.name}
                    </span>
                    {selectedModel.isNew && (
                      <span className="bg-primary/20 text-primary text-xs py-0.5 px-1.5 rounded-md">
                        جديد
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    الحد الأقصى للرموز:{" "}
                    {selectedModel.maxTokens.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>اقتراحات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-wrap h-auto py-2 whitespace-normal text-right"
                    onClick={() => setInput("كيف يمكنني تعلم البرمجة؟")}
                  >
                    كيف يمكنني تعلم البرمجة؟
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-wrap h-auto py-2 whitespace-normal text-right"
                    onClick={() => setInput("ما هي فوائد الذكاء الاصطناعي؟")}
                  >
                    ما هي فوائد الذكاء الاصطناعي؟
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-wrap h-auto py-2 whitespace-normal text-right"
                    onClick={() => setInput("اكتب لي مقالة عن أهمية التعليم")}
                  >
                    اكتب لي مقالة عن أهمية التعليم
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
