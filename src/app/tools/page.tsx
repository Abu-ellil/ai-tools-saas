import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Image as ImageIcon, Video, Music } from "lucide-react";

export const metadata = {
  title: "الأدوات - أدوات الذكاء",
  description: "استخدم أدوات الذكاء الاصطناعي المتاحة",
};

export default function ToolsPage() {
  return (
    <div className="container py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">أدوات الذكاء الاصطناعي</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          استخدم مجموعة متنوعة من أدوات الذكاء الاصطناعي المتطورة لتلبية احتياجاتك المختلفة
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>المحادثة الذكية</CardTitle>
            <CardDescription>
              تحدث مع نماذج ChatGPT المتطورة للحصول على إجابات ذكية ومساعدة في مختلف المجالات
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">✓ إجابات دقيقة ومفصلة</p>
              <p className="mb-2">✓ مساعدة في الكتابة والبرمجة</p>
              <p>✓ حفظ المحادثات السابقة</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/tools/chat">استخدم الأداة</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>توليد الصور</CardTitle>
            <CardDescription>
              إنشاء صور إبداعية من وصف نصي باستخدام تقنيات الذكاء الاصطناعي المتطورة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">✓ صور عالية الجودة</p>
              <p className="mb-2">✓ تخصيص أسلوب الصورة</p>
              <p>✓ تنزيل بصيغ متعددة</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/tools/image">استخدم الأداة</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>توليد الفيديو</CardTitle>
            <CardDescription>
              إنشاء مقاطع فيديو قصيرة من وصف نصي باستخدام أحدث تقنيات الذكاء الاصطناعي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">✓ فيديوهات قصيرة مبتكرة</p>
              <p className="mb-2">✓ تحكم في المدة والأسلوب</p>
              <p>✓ تنزيل بجودة عالية</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/tools/video">استخدم الأداة</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Music className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>توليد الصوت</CardTitle>
            <CardDescription>
              تحويل النص إلى صوت طبيعي بلهجات متعددة باستخدام تقنيات الذكاء الاصطناعي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">✓ أصوات طبيعية متعددة</p>
              <p className="mb-2">✓ تحكم في نبرة الصوت والسرعة</p>
              <p>✓ دعم اللغة العربية بلهجات مختلفة</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/tools/audio">استخدم الأداة</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
