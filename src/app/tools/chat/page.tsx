"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content: "مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟",
    },
  ]);
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

    // Simulate API call
    setTimeout(() => {
      const assistantMessage = {
        role: "assistant" as const,
        content: "هذه استجابة تجريبية. في التطبيق الحقيقي، سيتم استبدال هذا بردود من OpenAI API.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">المحادثة الذكية</h1>
          <p className="text-muted-foreground">
            تحدث مع نماذج ChatGPT المتطورة للحصول على إجابات ذكية ومساعدة في مختلف المجالات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle>المحادثة</CardTitle>
                <CardDescription>
                  اطرح أسئلتك وسأقوم بالإجابة عليها
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
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
                <form onSubmit={handleSubmit} className="w-full flex space-x-2 rtl:space-x-reverse">
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
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>اقتراحات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setInput("كيف يمكنني تعلم البرمجة؟")}>
                    كيف يمكنني تعلم البرمجة؟
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setInput("ما هي فوائد الذكاء الاصطناعي؟")}>
                    ما هي فوائد الذكاء الاصطناعي؟
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setInput("اكتب لي مقالة عن أهمية التعليم")}>
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
