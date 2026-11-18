// Downloads every image the Haraj prototype uses into public/assets/,
// so the site no longer depends on Haraj's or Wikipedia's servers.
// Run once from the project folder:  node scripts/fetch-assets.mjs   (Node 18+)
import { mkdir, writeFile } from "node:fs/promises";

const URLS = [
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Toyota_Land_Cruiser_79_Simple_cabine_GRJ_facelift_2024_version_Afrique.jpg/330px-Toyota_Land_Cruiser_79_Simple_cabine_GRJ_facelift_2024_version_Afrique.jpg",
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/Toyota_Fortuner_4x2_V_2024.jpg/330px-Toyota_Fortuner_4x2_V_2024.jpg",
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/Toyota_Hilux_2.4_E_4x2_2014.jpg/330px-Toyota_Hilux_2.4_E_4x2_2014.jpg",
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/",
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Front.jpg/330px-2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Front.jpg",
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Toyota_Camry_AXVH80_2.5_HEV_Platinum_White_Pearl_Mica_05.jpg/330px-Toyota_Camry_AXVH80_2.5_HEV_Platinum_White_Pearl_Mica_05.jpg",
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/Toyota_Urban_Cruiser.jpg/330px-Toyota_Urban_Cruiser.jpg",
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/66/2015_Toyota_Fortuner_%28New_Zealand%29.jpg/330px-2015_Toyota_Fortuner_%28New_Zealand%29.jpg",
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/2021_Toyota_Land_Cruiser_300_3.4_ZX_%28Colombia%29_front_view_04.png/330px-2021_Toyota_Land_Cruiser_300_3.4_ZX_%28Colombia%29_front_view_04.png",
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/2017_Toyota_Yaris_L_5-door%2C_front_right%2C_08-25-2024.jpg/330px-2017_Toyota_Yaris_L_5-door%2C_front_right%2C_08-25-2024.jpg",
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/2019_Toyota_Avalon_XSE_in_Ruby_Flare_Pearl%2C_Front_Right%2C_09-05-2022.jpg/330px-2019_Toyota_Avalon_XSE_in_Ruby_Flare_Pearl%2C_Front_Right%2C_09-05-2022.jpg",
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ac/2018_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282018-08-27%29_01.jpg/330px-2018_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282018-08-27%29_01.jpg",
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/2023_Toyota_Sequoia_Limited_in_Wind_Chill_Pearl%2C_Front_Right%2C_01-16-2023.jpg/330px-2023_Toyota_Sequoia_Limited_in_Wind_Chill_Pearl%2C_Front_Right%2C_01-16-2023.jpg",
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/da/2021_Daihatsu_Rocky_1.0_TC_R_ADS_Package_%28Indonesia%29_front_view_02.jpg/330px-2021_Daihatsu_Rocky_1.0_TC_R_ADS_Package_%28Indonesia%29_front_view_02.jpg",
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/2024_Toyota_Land_Cruiser_250_VX_in_Platinum_White_Pearl_Mica%2C_front_left.jpg/330px-2024_Toyota_Land_Cruiser_250_VX_in_Platinum_White_Pearl_Mica%2C_front_left.jpg",
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg/330px-2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg",
  "https://v8-cdn.haraj.com.sa/assets/images/svg/bmw-logo.svg",
  "https://v8-cdn.haraj.com.sa/assets/images/svg/chevrolet-logo.svg",
  "https://v8-cdn.haraj.com.sa/assets/images/svg/dodge-logo.svg",
  "https://v8-cdn.haraj.com.sa/assets/images/svg/ford-logo.svg",
  "https://v8-cdn.haraj.com.sa/assets/images/svg/gmc-logo.svg",
  "https://v8-cdn.haraj.com.sa/assets/images/svg/lexus-icon.svg",
  "https://v8-cdn.haraj.com.sa/assets/images/svg/mercedes-logo.svg",
  "https://v8-cdn.haraj.com.sa/assets/images/svg/nissan-logo.svg",
  "https://v8-cdn.haraj.com.sa/assets/images/svg/toyota-logo.svg",
  "https://v8-cdn.haraj.com.sa/icons/home/new/animals-dark.svg",
  "https://v8-cdn.haraj.com.sa/icons/home/new/cars-dark.svg",
  "https://v8-cdn.haraj.com.sa/icons/home/new/coach-dark.svg",
  "https://v8-cdn.haraj.com.sa/icons/home/new/devices-dark.svg",
  "https://v8-cdn.haraj.com.sa/icons/home/new/fashion-dark.svg",
  "https://v8-cdn.haraj.com.sa/icons/home/new/food-dark.svg",
  "https://v8-cdn.haraj.com.sa/icons/home/new/furniture-dark.svg",
  "https://v8-cdn.haraj.com.sa/icons/home/new/games-dark.svg",
  "https://v8-cdn.haraj.com.sa/icons/home/new/h_icon_dark.svg",
  "https://v8-cdn.haraj.com.sa/icons/home/new/jobs-dark.svg",
  "https://v8-cdn.haraj.com.sa/icons/home/new/realestate-dark.svg",
  "https://v8-cdn.haraj.com.sa/icons/home/new/services-dark.svg"
];

const localPath = (url) => {
  const u = new URL(url);
  const name = decodeURIComponent(u.pathname.split("/").pop() || "img").replace(/[^\w.\-]+/g, "_");
  const dir = u.hostname.includes("haraj") ? "haraj" : "photos";
  return { dir: `public/assets/${dir}`, file: `public/assets/${dir}/${name}` };
};

let ok = 0, failed = 0;
for (const url of URLS) {
  const { dir, file } = localPath(url);
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (SWE482 prototype asset fetch)" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await mkdir(dir, { recursive: true });
    await writeFile(file, Buffer.from(await res.arrayBuffer()));
    ok++; console.log("✓", file);
  } catch (e) {
    failed++; console.log("✗", url, "-", e.message);
  }
}
console.log(`\nDone: ${ok} saved, ${failed} failed.`);
