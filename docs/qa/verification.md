# LuxAvto tekshiruv hisoboti — 2026-10-18

Tekshiruv avvalgi hisobotni qayta tekshirishdan boshlandi. Mavjud foydalanuvchi
o‘zgarishlari saqlandi; haqiqiy `.env` va production yozuvlari o‘zgartirilmadi.
Runtime dependencylar yangilanmadi. Brauzer uchun 127.0.0.1:3010/3014 va alohida,
vaqtinchalik MongoDB replica set ishlatildi. Sinov bazasida 17 sedan, 4 sport
avtomobili va faqat test hisoblari bor edi.

## Haqiqiy brauzerda tekshirilgan oqimlar

| Oqim | Kuzatilgan natija |
|---|---|
| Signup | Bo‘sh maydonlarda xabar, to‘ldirilganda hisob yaratildi |
| Login | Noto‘g‘ri parolda xabar, to‘g‘ri parolda sessiya tiklandi |
| Logout/reload | Logout’dan keyin himoyalangan sahifadan chiqildi; reload sessiyani qayta ochmadi |
| Sessiya restore | Kirgan hisob reload’dan keyin `/member/detail` orqali tiklandi |
| Profil | Bo‘sh nickname rad etildi; manzil/tavsif saqlandi va reload’da qoldi |
| Katalog | Qidiruv, bo‘sh natija, sedan/sport/hatchback filtrlari va narx/ko‘rishlar saralashi tekshirildi |
| Pagination | 17 sedan 8/8/1 bo‘lindi; 3-sahifada next o‘chdi; qidiruv 1-sahifaga qaytdi |
| Tafsilot | Rasmlar yuklandi, next bilan faol rasm o‘zgardi, savatga qo‘shildi |
| Savat | +/−, summa, reload’da saqlanish, bitta elementni o‘chirish va tozalash tekshirildi |
| Buyurtma | Bitta va ikkita avtomobil uchun $10000/$21000 buyurtmalar yaratildi |
| Confirmation | Native oynadagi Cancel holatni o‘zgartirmadi; OK PROCESS’ga o‘tkazdi |
| Yakunlash | Qabul qilish confirmation’i FINISH’ga o‘tkazdi; reload’da finished yozuv qoldi |
| Bekor qilish | Cancel dialogni yopganda yozuv qoldi; OK bilan pending ro‘yxatdan chiqdi |

Native confirmation dastlab CDP boshqaruvini to‘xtatdi. Keyin aynan test tabi
Chrome’ning native tab qidiruvi orqali faollashtirildi va dialog tugmalari native
boshqaruv bilan bosildi. Confirmation kodini almashtirish yoki cheklovni
o‘chirish talab qilinmadi. Haqiqiy pul operatsiyasi bajarilmadi.

## Tasdiqlangan va tuzatilgan muammolar

- Mobil navbar, hero matni, kartalar, footer, katalog, profil, savat va order
  konteynerlarining qat’iy kengliklari overflow keltirardi. Ranglar, rasmlar va
  komponentlar saqlanib, moslashuvchan o‘lcham va grid/breakpointlar kiritildi.
- Pagination natijalar sonini bilmasdan mavjud bo‘lmagan sahifani chiqarardi;
  qidiruv sahifa raqamini tiklamasdi. API massiv shaklini saqlab,
  `X-Total-Count` qaytaradi; frontend aniq sahifa sonini ishlatadi.
- Qidiruvdagi regex belgilar literal sifatida qayta ishlanadi; pagination
  parametrlari serverda tekshiriladi. Kech kelgan eski katalog javobi yangi
  filtr natijasini bosib ketmaydi.
- Auth ID/label’lari takrorlanardi; forma holati ochilishlar orasida qolardi.
  Endi IDlar noyob, maydonlar controlled, submit vaqtida takroriy bosish
  o‘chiriladi va xatoda kiritilgan qiymatlar saqlanadi. Mobil forma sig‘adi.
- Fayl tanlash bekor qilinganda undefined dereference, o‘chirilgan product bilan
  order renderida crash, malformed cart JSON bilan boshlanishdagi crash va
  eski tafsilot qolib ketishi uchun himoya qo‘shildi.
- Order kartasining max-height’i va tor tabs/selected kontrasti tuzatildi;
  slayderga mavjud Swiper A11y moduli, profil maydonlariga label bog‘lanishi
  va savat ikonalariga accessible nomlar qo‘shildi.
- Tasdiqlangan buyurtmadan ball olgan rasmsiz foydalanuvchi Active Users’da
  `/undefined` so‘rovini keltirardi. Default avatar bilan tuzatildi va brauzerda
  qayta tekshirildi.
- Takroriy telefon profil update’ida 500 qaytarardi. 400 validatsiya xatosi
  qilib tuzatildi; haqiqiy HTTP/MongoDB regressiyasi va quyidagi profil rasmi
  brauzer sinovida ham aniq xabar bilan qayta tasdiqlandi.

## Responsive va resurslar

Bosh sahifa, katalog, profil, order va help sahifalari har biri **390, 768 va
1280 CSS px** kengliklarda tekshirildi. 15 kombinatsiyaning barchasida document
scrollWidth viewport kengligiga teng, buzilgan `<img>` va console error/warning
ro‘yxati bo‘sh. To‘ldirilgan order, ikki elementli order, product details, mobil
auth va savat ham alohida ko‘rildi.

Yakuniy o‘tishda qayd etilgan **48 API** va **248 frontend asset** javobida
4xx/5xx yo‘q. Oldingi xato sinovlaridagi ataylab chaqirilgan auth 401,
`/undefined` 404 va duplicate profile 500 bu yakuniy hisobga kiritilmagan.
Videolarda tekshirilgan DOM holatida MediaError yo‘q va katalog MP4lari
readyState=4 edi; avtoijro alohida tasdiqlangan oqim sifatida e’lon qilinmaydi.

[O‘lchovlar](browser-results.json), [mobil ko‘rinish](mobile.png),
[desktop bosh sahifa](desktop.png), [mobil savat](cart.png).
Skrinshotlar tekshiruv davomida, JSON o‘lchovlari yakuniy o‘tishda olindi.

## Avtomatik tekshiruvlar

| Tekshiruv | Natija |
|---|---|
| Frontend Jest (profil rasmi regressiyalari bilan) | 15/15 o‘tdi |
| Backend Node regressiya testlari (profil rasmi regressiyalari bilan) | 18/18 o‘tdi |
| Frontend TypeScript / production build | O‘tdi |
| Backend TypeScript / production build va EJS/static nusxalari | O‘tdi |
| Ikkala repoda `git diff --check` | O‘tdi |
| Foreground mongod + mongosh init + primary tekshiruvi | O‘tdi |

Backend testlari o‘z mongod jarayoni, random lokal port, test bazasi va test-only
kalitlarini yaratib/tozalaydi. Parallel confirmation, ballning bir martaligi,
rollback, protected fields, hisob statusi, cookie, multipart upload va production
HTTP server shu yerda tekshirildi. Frontend testlari xizmatlarni mock qiladi;
ular haqiqiy brauzer oqimlari o‘rniga ko‘rsatilmagan.

## Profil rasmi — ruxsat yoqilgandan keyingi haqiqiy brauzer tekshiruvi

Avvalgi urinishda kengaytmaning file URL ruxsati yuklashni bloklagan edi;
`chrome://extensions` sozlamalarini avtomatizatsiya orqali ochish ham URL siyosati
bilan bloklandi. Foydalanuvchi **Allow access to file URLs** ruxsatini qo‘lda
yoqqach, Chrome file chooser `setFiles` orqali ishladi. Agent ruxsatlarni
o‘zgartirmadi va cheklovni aylanib o‘tmadi. Ushbu natijalar avvalgi
“brauzerda sinalmagan” cheklovini almashtiradi; HTTP multipart natijasidan
brauzer muvaffaqiyati haqida xulosa chiqarilmadi.

Sinov yangidan yaratilgan vaqtinchalik MongoDB replica set va faqat test
hisobida, `http://127.0.0.1:3010` frontend hamda `:3014` API bilan bajarildi.
Rasm fixture’lari loyiha logotipining vaqtinchalik PNG/JPEG nusxalari, matn
fayli va 5 MiB + 1 baytli PNG fixture’dan iborat; shaxsiy fayllar yuklanmadi.

| Haqiqiy brauzer amali | Kuzatilgan natija |
|---|---|
| PNG tanlash va Save | Preview ko‘rindi, `/member/update` 200, rasm `uploads/members/*.png` dan ochildi |
| Reload | Aynan saqlangan PNG URL qoldi, `complete=true`, `naturalWidth>0` |
| Logout → Login → My Page | Shu PNG URL va yuklangan rasm qaytdi |
| TXT tanlash | “Only images with jpeg, jpg, png format allowed!”; avvalgi rasm o‘zgarmadi |
| 5 MiB + 1 bayt PNG tanlash | “Profile image must be 5 MiB or smaller.”; avvalgi rasm o‘zgarmadi |
| Matnni `.png` nomida yuborish va Save | API 400, “The selected file is not a valid JPEG or PNG image.”; oldingi rasm tiklandi |
| Yangi valid rasm + band telefon bilan Save | API 400, “The nickname or phone number is already in use.”; oldingi rasm tiklandi |
| Xatodan keyin telefonni tiklash, Save va reload | API 200; muvaffaqiyatsiz fayl qayta yuborilmadi, oldingi PNG URL saqlandi |
| Valid JPEG tanlash, Save va reload | API 200, `uploads/members/*.jpg` yuklandi, `naturalWidth>0` |

Tuzatishdan oldin brauzerda TXT uchun umumiy “Something went wrong !” xabari
va 5 MiB dan katta PNG’ning muvaffaqiyatli saqlanishi tasdiqlandi. Tuzatishlar:

- `src/app/screens/userPage/Settings.tsx`: MIME turi va 5 MiB hajm tekshiruvi,
  aniq xabar, inputni tozalash, blob URL’ni bo‘shatish; Save javobidan keyin
  server rasmini ko‘rsatish va xatoda avvalgi saqlangan rasmni tiklash.
- Backend `src/libs/utils/profile-image-upload.ts` va `src/router.ts`:
  faqat profil endpointi uchun JPEG/PNG MIME va extension mosligi, fayl
  signature’i va 5 MiB limit; xatolar JSON 400. Bu to‘liq rasm dekoderi emas;
  shikastlangan rasm ma’lumotlarining barcha variantlari tekshirilmagan.
- Backend `src/controllers/member.controller.ts`: profil update rad etilsa,
  faqat yangi fayl o‘chiriladi; eski saqlangan rasmga tegilmaydi.
- `src/app/App.test.tsx` va backend `tests/security.test.cjs`: format/hajm,
  xabarlar, preview cleanup, muvaffaqiyatsiz faylni qayta yubormaslik,
  DB va diskdagi avvalgi rasmni saqlash regressiyalari.

Yakuniy JPEG reload’dan keyin brauzer console error/warning ro‘yxati bo‘sh,
buzilgan `<img>` yo‘q va gorizontal overflow yo‘q. Ataylab yuborilgan soxta
PNG va band telefon uchun ikki 400 javobi kutilgan validatsiya natijasi.
Yangi frontend Jest **15/15**, backend **18/18**, frontend `tsc --noEmit
--incremental false`, frontendning test API va odatiy `.env` bilan production
buildlari, backend production build va ikkala repoda `git diff --check` o‘tdi.
Dastlab testdagi `fireEvent` importi eski testing-library TypeScript
exportlariga mos kelmagani uchun build yiqildi; test DOM change hodisasi bilan
moslashtirilgach qayta build va testlar o‘tdi. Dependency yangilanmadi.

[Saqlangan JPEG skrinshoti](profile-upload-saved.png),
[hajm xabari skrinshoti](profile-upload-size.png).
Bu qo‘shimcha o‘tishda faqat profil rasmi oqimi qayta tekshirildi;
avvalgi 15 responsive kombinatsiya to‘liq qayta ishlatilmadi.

## Qolgan cheklovlar

Production muhiti va haqiqiy katalog yozuvlari tekshirilmadi. Payment provider
va contact service qo‘shilmadi. Eski testing/UI dependencylarning React
deprecation ogohlantirishlari test chiqishida qoladi; brauzerning yakuniy console
tekshiruvlari yuqorida alohida berilgan.

Backend README’da replica set talabi, mos hostname/origin/portlar va macOS
startup buyruqlari aniqlashtirildi. `--fork` macOS’da ishlamasligi amalda
tekshirildi; yo‘riqnoma foreground mongod va ikkinchi terminaldagi mongosh’dan
foydalanadi. Startup sinovi alohida vaqtinchalik katalogda PRIMARY’gacha o‘tdi.
