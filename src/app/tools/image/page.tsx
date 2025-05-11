"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Image as ImageIcon, Loader2 } from "lucide-react";

export default function ImagePage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedImage(null);

    // Simulate API call
    setTimeout(() => {
      // Placeholder image URL - in a real app, this would be the URL returned from the AI service
      setGeneratedImage("/placeholder.svg");
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">توليد الصور</h1>
          <p className="text-muted-foreground">
            إنشاء صور إبداعية من وصف نصي باستخدام تقنيات الذكاء الاصطناعي
            المتطورة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>إنشاء صورة جديدة</CardTitle>
                <CardDescription>
                  اكتب وصفاً تفصيلياً للصورة التي تريد إنشاءها
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGenerate} className="space-y-4">
                  <div>
                    <Input
                      placeholder="اكتب وصفاً للصورة التي تريد إنشاءها..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      disabled={isGenerating}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Button
                      type="submit"
                      disabled={isGenerating || !prompt.trim()}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          جاري التوليد...
                        </>
                      ) : (
                        "توليد الصورة"
                      )}
                    </Button>
                  </div>
                </form>

                <div className="mt-6">
                  <Tabs defaultValue="result">
                    <TabsList className="mb-4">
                      <TabsTrigger value="result">النتيجة</TabsTrigger>
                      <TabsTrigger value="history">السجل</TabsTrigger>
                    </TabsList>
                    <TabsContent value="result">
                      <div className="flex items-center justify-center border rounded-lg h-80 bg-muted/30">
                        {isGenerating ? (
                          <div className="flex flex-col items-center">
                            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                            <p className="mt-2 text-muted-foreground">
                              جاري توليد الصورة...
                            </p>
                          </div>
                        ) : generatedImage ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={generatedImage}
                              alt="Generated image"
                              fill
                              className="object-contain p-4"
                            />
                            <Button
                              size="sm"
                              className="absolute bottom-4 left-4"
                              variant="secondary"
                            >
                              <Download className="ml-2 h-4 w-4" />
                              تنزيل
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-muted-foreground">
                            <ImageIcon className="h-10 w-10 mb-2" />
                            <p>
                              اكتب وصفاً وانقر على &quot;توليد الصورة&quot; لإنشاء صورة
                              جديدة
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="history">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-lg p-2 bg-muted/30">
                          <div className="h-32 bg-muted rounded-md mb-2 flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <p className="text-xs truncate">
                            منظر طبيعي لغروب الشمس
                          </p>
                        </div>
                        <div className="border rounded-lg p-2 bg-muted/30">
                          <div className="h-32 bg-muted rounded-md mb-2 flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <p className="text-xs truncate">
                            قطة تلعب في الحديقة
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>الرصيد المتبقي</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground mt-1">
                  من أصل 50 صورة
                </p>
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
                    onClick={() =>
                      setPrompt("منظر طبيعي لغروب الشمس على شاطئ البحر")
                    }
                  >
                    منظر طبيعي لغروب الشمس
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-wrap h-auto py-2 whitespace-normal text-right"
                    onClick={() =>
                      setPrompt("قطة صغيرة تلعب في حديقة مليئة بالزهور")
                    }
                  >
                    قطة تلعب في الحديقة
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-wrap h-auto py-2 whitespace-normal text-right"
                    onClick={() =>
                      setPrompt("مدينة مستقبلية بأضواء نيون وناطحات سحاب")
                    }
                  >
                    مدينة مستقبلية
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
