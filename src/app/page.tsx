import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageIcon, MessageSquare, Music, Video } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            أدوات الذكاء الاصطناعي للمستخدمين العرب
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            منصة متكاملة تتيح لك استخدام أحدث تقنيات الذكاء الاصطناعي بواجهة
            عربية سهلة الاستخدام
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/chat">جرب المحادثة الذكية مجاناً</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">عرض الأسعار</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            أدواتنا المميزة
          </h2>
          {(() => {
            const tools = [
              {
                title: "المحادثة الذكية",
                description: "محادثات ذكية مع نماذج ChatGPT المتطورة",
                icon: MessageSquare,
                href: "/chat",
              },
              {
                title: "توليد الصور",
                description: "إنشاء صور إبداعية من وصف نصي",
                icon: ImageIcon,
                href: "/tools/image",
              },
              {
                title: "توليد الفيديو",
                description: "إنشاء مقاطع فيديو قصيرة من وصف نصي",
                icon: Video,
                href: "/tools/video",
              },
              {
                title: "توليد الصوت",
                description: "تحويل النص إلى صوت طبيعي بلهجات متعددة",
                icon: Music,
                href: "/tools/audio",
              },
            ];

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {tools.map((tool, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{tool.title}</CardTitle>
                      <CardDescription className="h-6">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                        <tool.icon className="h-16 w-16 text-primary opacity-70" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={tool.href}>جرب الآن</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">خطط الأسعار</h2>
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="text-2xl">الباقة الشهرية</CardTitle>
                <div className="text-4xl font-bold mt-2">
                  $5
                  <span className="text-lg text-muted-foreground">/شهرياً</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>✓ 100 رسالة ChatGPT</p>
                <p>✓ 50 صورة</p>
                <p>✓ 10 فيديو</p>
                <p>✓ 20 تحويل نص إلى صوت</p>
                <p>✓ حفظ المحتوى المُنشأ</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/login">اشترك الآن</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
