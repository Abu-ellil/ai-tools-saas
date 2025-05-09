import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Check } from "lucide-react";

export const metadata = {
  title: "الأسعار - أدوات الذكاء",
  description: "خطط الأسعار لمنصة أدوات الذكاء الاصطناعي",
};

export default function PricingPage() {
  return (
    <div className="container py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">خطط الأسعار</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          اختر الخطة المناسبة لاحتياجاتك واستمتع بأدوات الذكاء الاصطناعي المتطورة
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">الخطة المجانية</CardTitle>
            <div className="text-4xl font-bold mt-2">$0<span className="text-lg text-muted-foreground">/شهرياً</span></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-primary ml-2" />
                <span>10 رسائل ChatGPT</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-primary ml-2" />
                <span>5 صور</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-primary ml-2" />
                <span>1 فيديو</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-primary ml-2" />
                <span>2 تحويل نص إلى صوت</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/sign-up">ابدأ مجاناً</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm w-fit mb-2">الأكثر شعبية</div>
            <CardTitle className="text-2xl">الخطة الاحترافية</CardTitle>
            <div className="text-4xl font-bold mt-2">$5<span className="text-lg text-muted-foreground">/شهرياً</span></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-primary ml-2" />
                <span>100 رسالة ChatGPT</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-primary ml-2" />
                <span>50 صورة</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-primary ml-2" />
                <span>10 فيديو</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-primary ml-2" />
                <span>20 تحويل نص إلى صوت</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-primary ml-2" />
                <span>حفظ المحتوى المُنشأ</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-primary ml-2" />
                <span>دعم أولوي</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/sign-up">اشترك الآن</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Custom Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">خطة مخصصة</CardTitle>
            <div className="text-4xl font-bold mt-2">اتصل بنا</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-primary ml-2" />
                <span>رصيد غير محدود</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-primary ml-2" />
                <span>API مخصصة</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-primary ml-2" />
                <span>تكامل مع أنظمتك</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-primary ml-2" />
                <span>دعم على مدار الساعة</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-primary ml-2" />
                <span>تدريب مخصص</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              اتصل بنا
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">أسئلة شائعة</h2>
        <div className="max-w-3xl mx-auto space-y-6 text-right">
          <div>
            <h3 className="text-xl font-semibold mb-2">كيف يتم احتساب الرصيد؟</h3>
            <p className="text-muted-foreground">
              يتم احتساب الرصيد بناءً على نوع الأداة المستخدمة. كل رسالة ChatGPT تستهلك نقطة واحدة، وكل صورة تستهلك نقطة واحدة، وكل فيديو يستهلك 5 نقاط، وكل تحويل نص إلى صوت يستهلك نقطتين.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">هل يمكنني ترقية خطتي في أي وقت؟</h3>
            <p className="text-muted-foreground">
              نعم، يمكنك ترقية خطتك في أي وقت. سيتم احتساب الرسوم بشكل تناسبي بناءً على الوقت المتبقي في اشتراكك الحالي.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">هل يمكنني إلغاء اشتراكي في أي وقت؟</h3>
            <p className="text-muted-foreground">
              نعم، يمكنك إلغاء اشتراكك في أي وقت. ستستمر في الوصول إلى الخدمة حتى نهاية فترة الفوترة الحالية.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
