export type Trans = "أوتوماتيك" | "عادي";
export type Fuel = "بنزين" | "ديزل" | "هايبرد";

export interface Car {
  id: string;
  kind: "car";
  brand: string;
  model: string;
  title: string;
  year: number;
  km: number | null; // null = seller did not give a mileage
  trans: Trans;
  fuel: Fuel;
  color: string; // paint colour for the illustration
  colorName: string;
  body: "sedan" | "suv" | "pickup";
  city: string;
  price: number | null; // null = على السوم
  ago: number; // minutes since posted
  seller: string;
  desc: string;
  img?: string;
}

export interface Part {
  id: string;
  kind: "part";
  brand: string;
  title: string;
  fits: [number, number]; // compatible model years
  city: string;
  price: number | null;
  ago: number;
  seller: string;
}

export type Listing = Car | Part;

const IMG: Record<string, string> = {"11192915021": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Toyota_Land_Cruiser_79_Simple_cabine_GRJ_facelift_2024_version_Afrique.jpg/330px-Toyota_Land_Cruiser_79_Simple_cabine_GRJ_facelift_2024_version_Afrique.jpg", "11192915060": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/Toyota_Fortuner_4x2_V_2024.jpg/330px-Toyota_Fortuner_4x2_V_2024.jpg", "11192915388": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/Toyota_Hilux_2.4_E_4x2_2014.jpg/330px-Toyota_Hilux_2.4_E_4x2_2014.jpg", "11192911066": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Toyota_Camry_AXVH80_2.5_HEV_Platinum_White_Pearl_Mica_05.jpg/330px-Toyota_Camry_AXVH80_2.5_HEV_Platinum_White_Pearl_Mica_05.jpg", "11192913620": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Toyota_Camry_AXVH80_2.5_HEV_Platinum_White_Pearl_Mica_05.jpg/330px-Toyota_Camry_AXVH80_2.5_HEV_Platinum_White_Pearl_Mica_05.jpg", "11192910085": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg/330px-2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg", "11192914830": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/da/2021_Daihatsu_Rocky_1.0_TC_R_ADS_Package_%28Indonesia%29_front_view_02.jpg/330px-2021_Daihatsu_Rocky_1.0_TC_R_ADS_Package_%28Indonesia%29_front_view_02.jpg", "11192912201": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/66/2015_Toyota_Fortuner_%28New_Zealand%29.jpg/330px-2015_Toyota_Fortuner_%28New_Zealand%29.jpg", "11192914102": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Front.jpg/330px-2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Front.jpg", "11192914415": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/2021_Toyota_Land_Cruiser_300_3.4_ZX_%28Colombia%29_front_view_04.png/330px-2021_Toyota_Land_Cruiser_300_3.4_ZX_%28Colombia%29_front_view_04.png", "11192914990": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Toyota_Camry_AXVH80_2.5_HEV_Platinum_White_Pearl_Mica_05.jpg/330px-Toyota_Camry_AXVH80_2.5_HEV_Platinum_White_Pearl_Mica_05.jpg", "11192911890": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/2021_Toyota_Land_Cruiser_300_3.4_ZX_%28Colombia%29_front_view_04.png/330px-2021_Toyota_Land_Cruiser_300_3.4_ZX_%28Colombia%29_front_view_04.png", "11192912311": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/Toyota_Urban_Cruiser.jpg/330px-Toyota_Urban_Cruiser.jpg", "11192910311": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ac/2018_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282018-08-27%29_01.jpg/330px-2018_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282018-08-27%29_01.jpg", "11192910712": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/2024_Toyota_Land_Cruiser_250_VX_in_Platinum_White_Pearl_Mica%2C_front_left.jpg/330px-2024_Toyota_Land_Cruiser_250_VX_in_Platinum_White_Pearl_Mica%2C_front_left.jpg", "11192909877": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg/330px-2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg", "11192914670": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/2017_Toyota_Yaris_L_5-door%2C_front_right%2C_08-25-2024.jpg/330px-2017_Toyota_Yaris_L_5-door%2C_front_right%2C_08-25-2024.jpg", "11192914407": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Front.jpg/330px-2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Front.jpg", "11192908112": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/2023_Toyota_Sequoia_Limited_in_Wind_Chill_Pearl%2C_Front_Right%2C_01-16-2023.jpg/330px-2023_Toyota_Sequoia_Limited_in_Wind_Chill_Pearl%2C_Front_Right%2C_01-16-2023.jpg", "11192907766": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/2019_Toyota_Avalon_XSE_in_Ruby_Flare_Pearl%2C_Front_Right%2C_09-05-2022.jpg/330px-2019_Toyota_Avalon_XSE_in_Ruby_Flare_Pearl%2C_Front_Right%2C_09-05-2022.jpg"};
const car = (c: Omit<Car, "kind" | "brand">): Car => ({ kind: "car", brand: "تويوتا", img: IMG[c.id], ...c });
const part = (p: Omit<Part, "kind" | "brand">): Part => ({ kind: "part", brand: "تويوتا", ...p });

export const LISTINGS: Listing[] = [
  car({ id: "11192911066", model: "كامري", title: "كامري 2025 ستاندر", year: 2025, km: 21000, trans: "أوتوماتيك", fuel: "بنزين", color: "#e9e9ee", colorName: "أبيض لؤلؤي", body: "sedan", city: "الرياض", price: 98000, ago: 45, seller: "ابو فيصل", desc: "كامري 2025 ستاندر، مالك أول، صيانة وكالة، بدون حوادث. الممشى 21 ألف." }),
  car({ id: "11192913620", model: "كامري", title: "كامري 2025 LE", year: 2025, km: 36000, trans: "أوتوماتيك", fuel: "بنزين", color: "#2b2d33", colorName: "أسود", body: "sedan", city: "الدمام", price: 104000, ago: 180, seller: "معرض الخليج", desc: "كامري LE 2025، شاشة كبيرة، كاميرا خلفية، رادار." }),
  car({ id: "11192910085", model: "كورولا", title: "للبيع كورولا 2025 مطور xli", year: 2025, km: 42000, trans: "أوتوماتيك", fuel: "بنزين", color: "#9aa1ab", colorName: "فضي", body: "sedan", city: "العارضة", price: null, ago: 32, seller: "gdmy12345", desc: "كورولا 2025 مطور XLI، ممشى 42 ألف، السيارة بحالة الوكالة." }),
  car({ id: "11192914830", model: "رايز", title: "تويوتا رايز ستاندر 2025 باقل سعر بالمملكة", year: 2025, km: 0, trans: "أوتوماتيك", fuel: "بنزين", color: "#c23b3b", colorName: "أحمر", body: "suv", city: "بريدة", price: 74900, ago: 8640, seller: "شركة أوتوجيت للسيارات", desc: "رايز 2025 جديدة صفر كيلو، ضمان الوكالة." }),
  car({ id: "11192912201", model: "فورتشنر", title: "فورتشنر ديزل موديل 2025 مستعملة حبه فقط", year: 2025, km: 38000, trans: "أوتوماتيك", fuel: "ديزل", color: "#f1f1f3", colorName: "أبيض", body: "suv", city: "الرياض", price: 116000, ago: 30240, seller: "ابوطارق للسيارات تويوتا", desc: "فورتشنر ديزل 2025، حبة فقط، مستعملة استعمال خفيف." }),
  car({ id: "11192915021", model: "شاص", title: "شاص 2025", year: 2025, km: 9000, trans: "عادي", fuel: "بنزين", color: "#ededf0", colorName: "أبيض", body: "pickup", city: "الدمام", price: 220000, ago: 31, seller: "عضو 76390747", desc: "شاص 2025 غمارة، ممشى 9 آلاف، نظيف جداً." }),
  car({ id: "11192915060", model: "فورتشنر", title: "فورتشنر 4سلندر دبل 2026", year: 2026, km: 0, trans: "أوتوماتيك", fuel: "بنزين", color: "#f1f1f3", colorName: "أبيض", body: "suv", city: "خميس مشيط", price: null, ago: 31, seller: "ابو حمد", desc: "فورتشنر 2026 أربع سلندر دبل، جديد صفر." }),
  car({ id: "11192914102", model: "هايلكس", title: "هايلكس 2025 غمارتين", year: 2025, km: 18000, trans: "عادي", fuel: "ديزل", color: "#d8d2c4", colorName: "بيج", body: "pickup", city: "أبها", price: 112000, ago: 600, seller: "سعد الشهري", desc: "هايلكس غمارتين 2025 ديزل، ممشى 18 ألف." }),
  car({ id: "11192914415", model: "لاندكروزر", title: "لاندكروزر 2025 GXR", year: 2025, km: 64000, trans: "أوتوماتيك", fuel: "بنزين", color: "#3a3c44", colorName: "رمادي", body: "suv", city: "الرياض", price: 285000, ago: 900, seller: "معرض الصفوة", desc: "لاندكروزر GXR 2025، ممشى 64 ألف، سرفس كامل." }),
  car({ id: "11192914990", model: "كامري", title: "كامري هايبرد 2025 فل كامل", year: 2025, km: null, trans: "أوتوماتيك", fuel: "هايبرد", color: "#5d7fa8", colorName: "أزرق", body: "sedan", city: "الخبر", price: null, ago: 75, seller: "ماجد علي", desc: "كامري لومير هايبرد فل كامل اللون الجديد. للتواصل خاص." }),
  car({ id: "11192911890", model: "لاندكروزر", title: "لاندكروزر 2026 وارد سعودي L4", year: 2026, km: 17000, trans: "أوتوماتيك", fuel: "بنزين", color: "#ececf0", colorName: "أبيض", body: "suv", city: "الرياض", price: 329000, ago: 240, seller: "ابوخالد", desc: "لاندكروزر 2026 وارد سعودي، ممشى 17 ألف." }),
  car({ id: "11192912311", model: "اوربان كروزر", title: "اوربان كروزر 2026 نص فل", year: 2026, km: 3000, trans: "أوتوماتيك", fuel: "بنزين", color: "#406a52", colorName: "أخضر", body: "suv", city: "جدة", price: 88000, ago: 2880, seller: "فهد ع", desc: "اوربان كروزر نص فل، ممشى 3 آلاف." }),
  car({ id: "11192910311", model: "كامري", title: "كامري 2022 ستاندر شبه وكالة", year: 2022, km: 31000, trans: "أوتوماتيك", fuel: "بنزين", color: "#e6e6ea", colorName: "أبيض", body: "sedan", city: "الطائف", price: 72000, ago: 1600, seller: "عبدالله م", desc: "كامري 2022 ستاندر، ممشى 31 ألف." }),
  car({ id: "11192910712", model: "برادو", title: "برادو 2023 VX سعودي", year: 2023, km: 12000, trans: "أوتوماتيك", fuel: "بنزين", color: "#f3f3f5", colorName: "أبيض لؤلؤي", body: "suv", city: "الرياض", price: 205000, ago: 4300, seller: "عبداللطيف جميل", desc: "برادو VX 2023 سعودي، 6 سلندر." }),
  car({ id: "11192909877", model: "كورولا", title: "كورولا 2020 مخزن", year: 2020, km: 95000, trans: "أوتوماتيك", fuel: "بنزين", color: "#7d8590", colorName: "رمادي", body: "sedan", city: "مكة", price: 52000, ago: 5000, seller: "نواف", desc: "كورولا 2020 ممشى 95 ألف." }),
  car({ id: "11192915388", model: "هايلكس", title: "هايلكس 2014 للبيع ممشى 560 الف مغير كبوت فقط", year: 2014, km: 560000, trans: "عادي", fuel: "بنزين", color: "#f1f1f3", colorName: "أبيض", body: "pickup", city: "بيشة", price: null, ago: 6, seller: "علي زايد الشهري", desc: "تويوتا هايلوكس GLX 2014 مستخدم، قير عادي، بنزين. الممشى: 560 ألف كيلو أو أكثر. مغير كبوت فقط." }),
  car({ id: "11192914407", model: "هايلكس", title: "هايلكس 84", year: 1984, km: null, trans: "عادي", fuel: "بنزين", color: "#c8a46a", colorName: "ذهبي", body: "pickup", city: "رجال ألمع", price: null, ago: 700, seller: "ابو مشعل", desc: "هايلكس موديل 1984 قير عادي، الموتر عزمه قوي ومجدد." }),
  car({ id: "11192908112", model: "سيكويا", title: "سيكويا 2013", year: 2013, km: 265000, trans: "أوتوماتيك", fuel: "بنزين", color: "#2f3b4c", colorName: "كحلي", body: "suv", city: "تبوك", price: 61000, ago: 8000, seller: "3bdkrem", desc: "سيكويا 2013 فل كامل." }),
  car({ id: "11192907766", model: "افالون", title: "افالون 2019 ليمتد", year: 2019, km: 140000, trans: "أوتوماتيك", fuel: "بنزين", color: "#5b1f24", colorName: "عنابي", body: "sedan", city: "الرياض", price: 69000, ago: 9100, seller: "تركي", desc: "افالون ليمتد 2019." }),

  part({ id: "11192914380", title: "دعاسات كورولا قوالب 5D تويوتا الحق العرض خصم 100ريال", fits: [2020, 2025], city: "مكة", price: 200, ago: 40320, seller: "دكان زد" }),
  part({ id: "11192914507", title: "طاسة هايلكس حبة وحدة", fits: [2014, 2025], city: "الدمام", price: null, ago: 200, seller: "ابو عمر" }),
  part({ id: "11192911760", title: "صدام لاندكروزر GXR 2014 وكالة", fits: [2014, 2015], city: "جازان", price: null, ago: 3300, seller: "قطع جازان" }),
  part({ id: "11192911561", title: "اسطب كامري 2011", fits: [2010, 2011], city: "الرياض", price: 180, ago: 2400, seller: "تشليح الرياض" }),
  part({ id: "11192913712", title: "مكينة كورولا 2025 وكالة", fits: [2025, 2025], city: "الرياض", price: 9500, ago: 600, seller: "مكائن الوسطى" }),
  part({ id: "11192912955", title: "منظم اضافي في التكاية للفورشنر 2006 الى 2025", fits: [2006, 2025], city: "الرياض", price: null, ago: 40320, seller: "ابوعبدالكريم 8" }),
  part({ id: "11192915101", title: "كتالوج كامري 2007 - 2011", fits: [2007, 2011], city: "الرياض", price: null, ago: 40, seller: "al00000000" }),
];

export const MODELS: Record<string, string[]> = {
  "تويوتا": ["كامري", "كورولا", "يارس", "رايز", "فورتشنر", "هايلكس", "شاص", "لاندكروزر", "برادو", "اوربان كروزر", "افالون", "سيكويا"],
  "هيونداي": ["النترا", "سوناتا", "اكسنت", "توسان"],
  "نيسان": ["صني", "التيما", "باترول", "ماكسيما"],
};

export const CITIES = ["الرياض", "جدة", "مكة", "الدمام", "الخبر", "الطائف", "القصيم", "بريدة", "أبها", "خميس مشيط", "بيشة", "تبوك", "جازان", "العارضة", "رجال ألمع"];

const unit = (n: number, one: string, two: string, few: string, many: string) =>
  n === 1 ? one : n === 2 ? two : n <= 10 ? `${n} ${few}` : `${n} ${many}`;
export const timeAgo = (m: number) => {
  if (m < 1) return "الآن";
  if (m < 60) return "قبل " + unit(m, "دقيقة", "دقيقتين", "دقائق", "دقيقة");
  if (m < 1440) return "قبل " + unit(Math.round(m / 60), "ساعة", "ساعتين", "ساعات", "ساعة");
  if (m < 10080) return "قبل " + unit(Math.round(m / 1440), "يوم", "يومين", "أيام", "يوم");
  return "قبل " + unit(Math.round(m / 10080), "أسبوع", "أسبوعين", "أسابيع", "أسبوع");
};

export const fmt = (n: number) => n.toLocaleString("en-US");

/** Arabic count + noun agreement for "سيارة". */
export const cars = (n: number) =>
  n === 0 ? "لا توجد سيارات" : n === 1 ? "سيارة واحدة" : n === 2 ? "سيارتان" : n <= 10 ? `${n} سيارات` : `${n} سيارة`;
