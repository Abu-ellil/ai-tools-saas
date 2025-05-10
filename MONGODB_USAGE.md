# استخدام MongoDB في مشروع أدوات الذكاء

هذا الدليل يشرح كيفية استخدام MongoDB في مشروع أدوات الذكاء الاصطناعي.

## الإعداد

1. تأكد من تثبيت MongoDB على جهازك أو استخدام خدمة MongoDB Atlas السحابية.
2. قم بتحديث ملف `.env` بإضافة رابط اتصال MongoDB:

```
MONGODB_URI=mongodb://localhost:27017/ai-tools-saas
```

إذا كنت تستخدم MongoDB Atlas، فسيكون الرابط بهذا الشكل:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ai-tools-saas?retryWrites=true&w=majority
```

## هيكل المشروع

تم إنشاء الملفات التالية لدعم MongoDB:

- `src/lib/mongodb.ts` - ملف الاتصال بقاعدة البيانات
- `src/lib/mongodb-db.ts` - ملف تصدير النماذج للاستخدام في التطبيق
- `src/models/User.ts` - نموذج المستخدم
- `src/models/Subscription.ts` - نموذج الاشتراك
- `src/models/UsageRecord.ts` - نموذج سجل الاستخدام
- `src/models/index.ts` - ملف تصدير جميع النماذج
- `src/app/api/webhook/clerk/mongodb-route.ts` - مثال لاستخدام MongoDB مع Clerk
- `src/app/api/user/mongodb-route.ts` - مثال لاستخدام MongoDB في API

## كيفية الاستخدام

### 1. استيراد النماذج

```typescript
import { db } from '@/lib/mongodb-db';
```

### 2. إنشاء سجل جديد

```typescript
// إنشاء مستخدم جديد
const newUser = new db.user({
  clerkId: 'clerk_123',
  email: 'user@example.com',
});

const savedUser = await newUser.save();
```

### 3. البحث عن سجلات

```typescript
// البحث عن مستخدم بواسطة clerkId
const user = await db.user.findOne({ clerkId: 'clerk_123' });

// البحث عن جميع المستخدمين
const allUsers = await db.user.find();

// البحث مع تصفية
const proUsers = await db.subscription.find({ plan: 'PRO' }).populate('userId');
```

### 4. تحديث سجل

```typescript
// تحديث اشتراك المستخدم
await db.subscription.updateOne(
  { userId: user._id },
  { $set: { credits: 100, plan: 'PRO' } }
);
```

### 5. حذف سجل

```typescript
// حذف مستخدم
await db.user.deleteOne({ clerkId: 'clerk_123' });

// حذف جميع سجلات استخدام المستخدم
await db.usageRecord.deleteMany({ userId: user._id });
```

## العلاقات بين النماذج

في MongoDB، يمكننا استخدام `populate` لتحميل البيانات المرتبطة:

```typescript
// البحث عن اشتراك مع بيانات المستخدم
const subscription = await db.subscription.findOne({ plan: 'PRO' }).populate('userId');

// الوصول إلى بيانات المستخدم
console.log(subscription.userId.email);
```

## التحويل من Prisma إلى MongoDB

إذا كنت تستخدم Prisma حاليًا، يمكنك التحويل تدريجيًا إلى MongoDB عن طريق:

1. إنشاء نماذج MongoDB موازية لنماذج Prisma
2. تحديث API تدريجيًا لاستخدام نماذج MongoDB
3. نقل البيانات من PostgreSQL إلى MongoDB باستخدام سكريبت هجرة

## مزايا استخدام MongoDB

- مرونة في هيكل البيانات (Schema-less)
- أداء عالي للعمليات القراءة والكتابة
- قابلية للتوسع الأفقي
- سهولة التعامل مع البيانات غير المهيكلة
- دعم ممتاز للتطبيقات في الوقت الفعلي
