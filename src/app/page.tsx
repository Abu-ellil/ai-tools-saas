import Image from "next/image";
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
              <Link href="/sign-up">ابدأ الآن مجاناً</Link>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>المحادثة الذكية</CardTitle>
                <CardDescription>
                  محادثات ذكية مع نماذج ChatGPT المتطورة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                  <Image
                    src="/placeholder.svg"
                    alt="محادثة ذكية"
                    width={100}
                    height={100}
                    className="opacity-70"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/tools/chat">جرب الآن</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>توليد الصور</CardTitle>
                <CardDescription>إنشاء صور إبداعية من وصف نصي</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                  <Image
                    src="/placeholder.svg"
                    alt="توليد الصور"
                    width={100}
                    height={100}
                    className="opacity-70"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/tools/image">جرب الآن</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>توليد الفيديو</CardTitle>
                <CardDescription>
                  إنشاء مقاطع فيديو قصيرة من وصف نصي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                  <Image
                    src="/placeholder.svg"
                    alt="توليد الفيديو"
                    width={100}
                    height={100}
                    className="opacity-70"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/tools/video">جرب الآن</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>توليد الصوت</CardTitle>
                <CardDescription>
                  تحويل النص إلى صوت طبيعي بلهجات متعددة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                  <Image
                    src="/placeholder.svg"
                    alt="توليد الصوت"
                    width={100}
                    height={100}
                    className="opacity-70"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/tools/audio">جرب الآن</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
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
                  <Link href="/sign-up">اشترك الآن</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
