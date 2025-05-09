import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-8 mt-auto">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">أدوات الذكاء</h3>
            <p className="text-muted-foreground">
              منصة متكاملة لأدوات الذكاء الاصطناعي للمستخدمين العرب
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-primary transition">
                  الأسعار
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-muted-foreground hover:text-primary transition">
                  الأدوات
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">الأدوات</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tools/chat" className="text-muted-foreground hover:text-primary transition">
                  المحادثة الذكية
                </Link>
              </li>
              <li>
                <Link href="/tools/image" className="text-muted-foreground hover:text-primary transition">
                  توليد الصور
                </Link>
              </li>
              <li>
                <Link href="/tools/video" className="text-muted-foreground hover:text-primary transition">
                  توليد الفيديو
                </Link>
              </li>
              <li>
                <Link href="/tools/audio" className="text-muted-foreground hover:text-primary transition">
                  توليد الصوت
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">تواصل معنا</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground">
                البريد الإلكتروني: info@ai-tools.com
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} أدوات الذكاء. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
