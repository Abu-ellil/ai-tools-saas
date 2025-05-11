"use client";

import { useState } from "react";
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
import { Download, Loader2, Video } from "lucide-react";

export default function VideoPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedVideo(null);

    // Simulate API call
    setTimeout(() => {
      // In a real app, this would be the URL returned from the AI service
      setGeneratedVideo("https://example.com/video.mp4");
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">توليد الفيديو</h1>
          <p className="text-muted-foreground">
            إنشاء مقاطع فيديو قصيرة من وصف نصي باستخدام أحدث تقنيات الذكاء
            الاصطناعي
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>إنشاء فيديو جديد</CardTitle>
                <CardDescription>
                  اكتب وصفاً تفصيلياً للفيديو الذي تريد إنشاءه
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGenerate} className="space-y-4">
                  <div>
                    <Input
                      placeholder="اكتب وصفاً للفيديو الذي تريد إنشاءه..."
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
                        "توليد الفيديو"
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
                              جاري توليد الفيديو...
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              قد يستغرق هذا بضع دقائق
                            </p>
                          </div>
                        ) : generatedVideo ? (
                          <div className="relative w-full h-full flex flex-col items-center justify-center">
                            <Video className="h-16 w-16 text-primary mb-4" />
                            <p className="text-center mb-4">
                              تم توليد الفيديو بنجاح!
                            </p>
                            <Button variant="secondary">
                              <Download className="ml-2 h-4 w-4" />
                              تنزيل الفيديو
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-muted-foreground">
                            <Video className="h-10 w-10 mb-2" />
                            <p>
                              اكتب وصفاً وانقر على &quot;توليد الفيديو&quot; لإنشاء فيديو
                              جديد
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="history">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-lg p-2 bg-muted/30">
                          <div className="h-32 bg-muted rounded-md mb-2 flex items-center justify-center">
                            <Video className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <p className="text-xs truncate">
                            شروق الشمس على شاطئ البحر
                          </p>
                        </div>
                        <div className="border rounded-lg p-2 bg-muted/30">
                          <div className="h-32 bg-muted rounded-md mb-2 flex items-center justify-center">
                            <Video className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <p className="text-xs truncate">
                            سيارة تسير في طريق جبلي
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
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground mt-1">
                  من أصل 10 فيديو
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
                      setPrompt("شروق الشمس على شاطئ البحر مع أمواج هادئة")
                    }
                  >
                    شروق الشمس على الشاطئ
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-wrap h-auto py-2 whitespace-normal text-right"
                    onClick={() =>
                      setPrompt("سيارة تسير في طريق جبلي مع مناظر طبيعية خلابة")
                    }
                  >
                    سيارة في طريق جبلي
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-wrap h-auto py-2 whitespace-normal text-right"
                    onClick={() =>
                      setPrompt("مدينة مزدحمة في الليل مع أضواء النيون")
                    }
                  >
                    مدينة ليلية مضاءة
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
