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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Loader2, Music, Play, Square } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function AudioPage() {
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsGenerating(true);
    setGeneratedAudio(null);

    // Simulate API call
    setTimeout(() => {
      // In a real app, this would be the URL returned from the AI service
      setGeneratedAudio("https://example.com/audio.mp3");
      setIsGenerating(false);
    }, 2000);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">توليد الصوت</h1>
          <p className="text-muted-foreground">
            تحويل النص إلى صوت طبيعي بلهجات متعددة باستخدام تقنيات الذكاء
            الاصطناعي
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>تحويل النص إلى صوت</CardTitle>
                <CardDescription>
                  اكتب النص الذي تريد تحويله إلى صوت
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGenerate} className="space-y-4">
                  <div>
                    <Textarea
                      placeholder="اكتب النص الذي تريد تحويله إلى صوت..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      disabled={isGenerating}
                      className="w-full min-h-32"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-1/2">
                      <label className="text-sm font-medium mb-2 block">
                        اختر الصوت
                      </label>
                      <select className="w-full p-2 rounded-md border">
                        <option value="male1">ذكر - فصحى</option>
                        <option value="female1">أنثى - فصحى</option>
                        <option value="male2">ذكر - خليجي</option>
                        <option value="female2">أنثى - خليجية</option>
                        <option value="male3">ذكر - مصري</option>
                        <option value="female3">أنثى - مصرية</option>
                      </select>
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label className="text-sm font-medium mb-2 block">
                        سرعة النطق
                      </label>
                      <select className="w-full p-2 rounded-md border">
                        <option value="0.75">بطيء</option>
                        <option value="1.0" selected>
                          متوسط
                        </option>
                        <option value="1.25">سريع</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Button
                      type="submit"
                      disabled={isGenerating || !text.trim()}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          جاري التوليد...
                        </>
                      ) : (
                        "توليد الصوت"
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
                      <div className="flex items-center justify-center border rounded-lg h-40 bg-muted/30">
                        {isGenerating ? (
                          <div className="flex flex-col items-center">
                            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                            <p className="mt-2 text-muted-foreground">
                              جاري توليد الصوت...
                            </p>
                          </div>
                        ) : generatedAudio ? (
                          <div className="flex flex-col items-center justify-center w-full">
                            <div className="flex items-center justify-center gap-4 mb-4">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={togglePlayback}
                              >
                                {isPlaying ? (
                                  <Square className="h-4 w-4" />
                                ) : (
                                  <Play className="h-4 w-4" />
                                )}
                              </Button>
                              <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full bg-primary ${
                                    isPlaying ? "w-1/3" : "w-0"
                                  }`}
                                ></div>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                00:15
                              </span>
                            </div>
                            <Button variant="secondary">
                              <Download className="ml-2 h-4 w-4" />
                              تنزيل الملف الصوتي
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-muted-foreground">
                            <Music className="h-10 w-10 mb-2" />
                            <p>
                              اكتب نصاً وانقر على &quot;توليد الصوت&quot; لإنشاء ملف صوتي
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="history">
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4 bg-muted/30">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium">
                              مرحباً بكم في منصة أدوات الذكاء
                            </p>
                            <div className="flex items-center gap-2">
                              <Button size="icon" variant="ghost">
                                <Play className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            ذكر - فصحى • 00:08
                          </p>
                        </div>
                        <div className="border rounded-lg p-4 bg-muted/30">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium">
                              الذكاء الاصطناعي يغير مستقبل العالم
                            </p>
                            <div className="flex items-center gap-2">
                              <Button size="icon" variant="ghost">
                                <Play className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            أنثى - فصحى • 00:12
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
                <div className="text-2xl font-bold">16</div>
                <p className="text-xs text-muted-foreground mt-1">
                  من أصل 20 ملف صوتي
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
                      setText(
                        "مرحباً بكم في منصة أدوات الذكاء، المنصة العربية الأولى لأدوات الذكاء الاصطناعي."
                      )
                    }
                  >
                    رسالة ترحيبية
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-wrap h-auto py-2 whitespace-normal text-right"
                    onClick={() =>
                      setText(
                        "الذكاء الاصطناعي هو قدرة الآلات على محاكاة الذكاء البشري، مثل التعلم واتخاذ القرارات وحل المشكلات."
                      )
                    }
                  >
                    تعريف الذكاء الاصطناعي
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-wrap h-auto py-2 whitespace-normal text-right"
                    onClick={() =>
                      setText(
                        "أهلاً وسهلاً بكم في هذا البودكاست. اليوم سنتحدث عن أهمية التعليم في عصر الذكاء الاصطناعي."
                      )
                    }
                  >
                    مقدمة بودكاست
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
