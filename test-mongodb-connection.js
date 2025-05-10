// اختبار الاتصال بقاعدة بيانات MongoDB
require("dotenv").config();
const mongoose = require("mongoose");

// استخدام الرابط مباشرة للاختبار
const MONGODB_URI =
  "mongodb+srv://mrabuellil:mrabuellil@cluster0.q2ntqy8.mongodb.net/ai-tools-saas";

async function testConnection() {
  try {
    console.log("جاري محاولة الاتصال بقاعدة البيانات...");
    await mongoose.connect(MONGODB_URI);
    console.log("تم الاتصال بنجاح بقاعدة بيانات MongoDB!");

    // عرض معلومات الاتصال
    console.log("معلومات الاتصال:");
    console.log(`- اسم قاعدة البيانات: ${mongoose.connection.name}`);
    console.log(
      `- حالة الاتصال: ${
        mongoose.connection.readyState === 1 ? "متصل" : "غير متصل"
      }`
    );
    console.log(`- المضيف: ${mongoose.connection.host}`);
    console.log(`- المنفذ: ${mongoose.connection.port}`);

    // إغلاق الاتصال
    await mongoose.disconnect();
    console.log("تم إغلاق الاتصال بنجاح");
  } catch (error) {
    console.error("خطأ في الاتصال بقاعدة البيانات:", error.message);

    // عرض تفاصيل أكثر عن الخطأ
    if (error.name === "MongoServerSelectionError") {
      console.error("لا يمكن الوصول إلى الخادم. تأكد من:");
      console.error("1. أن رابط الاتصال صحيح");
      console.error("2. أن اسم المستخدم وكلمة المرور صحيحان");
      console.error(
        "3. أن عنوان IP الخاص بك مسموح به في إعدادات الأمان في MongoDB Atlas"
      );
    }
  } finally {
    process.exit(0);
  }
}

testConnection();
