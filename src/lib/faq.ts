import { businessConfig } from "./business-config";
import { getLowestPrice } from "./products";
import { formatStartingPrice } from "./pricing";
import type { Product } from "./types";

const { market } = businessConfig;

export function getAnnouncementItems() {
  return [
    {
      icon: "shield" as const,
      text: `شحن داخل ${market.countryName} • دفع عند الاستلام`,
    },
    {
      icon: "heart" as const,
      text: "حلال 100% • نباتي • بدون سكر مضاف",
    },
    {
      icon: "truck" as const,
      text: "ضمان استرجاع 30 يوم — تجربة بدون مخاطرة",
    },
  ];
}

export function getFaqItems(product?: Product) {
  const ingredient = product?.mainIngredient ?? "المكوّنات";
  const startingPrice = product
    ? formatStartingPrice(getLowestPrice(product))
    : "من 189 د.إ";

  return [
    {
      q: `هل الدفع عند الاستلام متاح داخل ${market.countryName}؟`,
      a: `نعم. الدفع عند الاستلام (كاش أو بطاقة) متوفر في كل مناطق ${market.countryName}، والشحن لجميع الطلبات.`,
    },
    {
      q: "كم الأسعار؟",
      a: `العروض ${startingPrice} — علبة 189 د.إ، علبتين 249 د.إ، 3 علب 299 د.إ.`,
    },
    {
      q: "هل العلكات حلال وبدون جيلاتين حيواني؟",
      a: "حلال 100%. العلكات نباتية بالكامل (بكتين بدل الجيلاتين الحيواني)، خالية من السكر المضاف.",
    },
    {
      q: "كم يستغرق التوصيل؟",
      a: `2–4 أيام عمل داخل ${market.countryName}. فريقنا يتصل فيك لتأكيد العنوان.`,
    },
    {
      q: "ما هو ضمان الاسترجاع؟",
      a: "ضمان رضا 30 يوم كامل. إذا لم يناسبك الروتين، تواصلي معنا وسنسترد قيمة طلبك.",
    },
    {
      q: "متى سألاحظ النتيجة؟",
      a: `تختلف من شخص لشخص. ${ingredient} يحتاج انتظام 2–4 أسابيع لنتيجة أوضح.`,
    },
  ];
}
