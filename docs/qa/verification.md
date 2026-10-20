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

## Bosh sahifaning to‘liq redesign’i — 2026-10-18–19

Bu bo‘lim yuqoridagi avvalgi tekshiruvlardan keyingi yangi frontend o‘tishidir.
Mockup headerdan footergacha haqiqiy React komponentlari sifatida amalga oshirildi:
ivory fon, charcoal bo‘limlar, champagne-gold aksentlar, serif sarlavhalar,
qidiruv paneli, 3 ta mashhur / 2 ta yangi avtomobil kartasi, video, hamjamiyat,
ma’lumot kartalari va kontakt CTA. Statistika badge’lari va sayohat rasmlari
bosh sahifadan olib tashlandi. Mavjud foydalanuvchi o‘zgarishlari saqlandi;
backend, schema, auth cookie, order va profil upload himoyalari o‘zgartirilmadi.

### Ma’lumot va navigatsiya bog‘lanishlari

- `HomeNavbar.tsx` va `OtherNavbar.tsx`: barcha sahifalarda yagona LUXAVTO
  navigatsiyasi; mavjud Basket, login, account va logout handlerlari ishlatiladi.
  Mobil disclosure menyusi Escape bilan yopilib fokusni tugmaga qaytaradi.
- `homePage/index.tsx`, `BrandCars.tsx`, `NewCars.tsx`, `VehicleCard.tsx`:
  mashhurlik `productViews` bo‘yicha, chiplar haqiqiy `productCollection` so‘rovini
  yuboradi. Dastlab barcha active kuzovlar ko‘rsatiladi. Yangi kelganlar oldingi
  `SEDAN` + `createdAt` tanlovini saqlaydi, desktopda 2 karta ko‘rsatiladi.
  “Yangi” badge’i faqat `productCondition === NEW` bo‘lsa chiqadi; bu qo‘shilgan
  sanani taxmin qilish emas. Kartalardagi narx USD, yil va km API’dan olinadi;
  mavjud bo‘lmagan avtomat uzatma yoki boshqa metadata o‘ylab topilmagan.
- `SearchPanel.tsx`, `src/lib/catalogSearch.ts`, `Products.tsx`: URL query
  orqali qidiruv, kuzov va saralash katalogga uzatiladi. Faqat qo‘llab-quvvatlangan
  enum/sort qiymatlari olinadi; reload ham shu qiymatlarni tiklaydi.
- `Advertisement.tsx`: mavjud `/video/advertisement.mp4`, yangi poster,
  foydalanuvchi ochadigan MUI Dialog, native controls, muted playback; yopilganda
  pause va unmount, Escape hamda fokusni qaytarish saqlangan.
- `ActiveUsers.tsx`: faqat public nickname va avatar chiqariladi; telefon,
  manzil yoki email chiqarilmaydi. Rasmsiz a’zo uchun default avatar bor.
- `plans.ts`: eski tasdiqlanmagan aksiyalar, filial e’lonlari, sana va geografik
  namunalar o‘rniga mavjud katalog/yordam funksiyalariga olib boruvchi
  ma’lumot kartalari ishlatiladi. Yangiliklar CMS’i mavjud emas.
- `footer/index.tsx`, `siteContent.ts`: eski Dubai/telefon/email/24 soat
  qiymatlari tasdiqlanmagani uchun olib tashlandi. Kontaktlar `null` sifatida
  markazlashtirilgan va UI’da “hali kiritilmagan” deb aniq belgilangan.
  Tasdiqlangan social URL yo‘q — havolasiz social ikonalar chiqarilmaydi.
  Privacy sahifasi yo‘q — privacy havolasi qo‘shilmadi. Terms mavjud `/help` ga
  boradi. Har ikki kontakt CTA haqiqiy `#boglanish` footeriga o‘tadi.
- `auth/index.tsx`: Kirish oynasidan ro‘yxatdan o‘tish va orqaga o‘tish qo‘shildi;
  signup mavjud backend/service orqali ishlaydi. Modal maydonlari Uzbekcha.
- `lux-shell.css` va `home.css`: umumiy header/footer va bosh sahifa stillari
  `lux-*` bilan scope qilingan; eski katalog/profil/order stillari saqlangan.
  `public/index.html` / manifest’da LuxAvto nomi va `lang=uz` qo‘yildi.

### Haqiqiy brauzer sinovlari

Production build `127.0.0.1:3010` da, haqiqiy backend vaqtinchalik MongoDB
replica set bilan ishga tushirildi. `:3014` dagi faqat QA uchun proksi API’ni
`:3015` ga uzatdi. Loading / empty / 503 fault injection faqat shu vaqtinchalik
proksida bajarildi, ilova kodiga test endpointlari qo‘shilmadi. Baza faqat
`QA Sedan` / `QA Sport` fixture’lari va test hisobidan iborat edi. Production
bazasi yoki yozuvlari ishlatilmadi.

| Amal | Haqiqiy kuzatuv |
|---|---|
| Mobil menyu | Ochildi, 3 ta guest / 5 ta authenticated link ko‘rindi; Escape yopdi va fokusni qaytardi; route almashganda yopildi |
| Qidiruv | `QA Sport` + `SPORTS_CAR` + `productPrice` katalog URL’iga o‘tdi; 4 natija $27000 → $30000 tartibida chiqdi |
| Qidiruv reload | Query, matn va 4 ta filtrlangan natija saqlandi |
| Mashhur chiplar | SUV bo‘sh holatni, Sedan haqiqiy sedanlarni ko‘rsatdi |
| Homepage product link | `QA Sedan 17` tafsilotiga o‘tdi, slider rasmlari yuklandi |
| Savat | Details’da qo‘shilgan `QA Sport 1` homepage header savatida ko‘rindi, count 1; Clear cart bo‘shatdi |
| Signup / sessiya | Kirish → ro‘yxatdan o‘tish → test hisob yaratildi; reload’da account tugmasi va himoyalangan linklar tiklandi |
| Logout / login | Chiqish guest headerga qaytardi; shu test hisobi bilan qayta login ishladi |
| Boshqa sahifalar | Profil, buyurtmalar va yordamga yangi umumiy menyudan o‘tildi |
| Video | Foydalanuvchi bosgach `muted=true`, `controls=true`, `readyState=4`, `paused=false`; `currentTime` 5.66 soniyaga yetdi |
| Video Escape | Video DOM’dan olib tashlandi, fokus play tugmasiga qaytdi |
| Kontakt | `#boglanish` hash’i ochildi, footer viewportga keldi va fokus oldi |
| Sekin API | 3 loading xabari; product kartalari 0 |
| Bo‘sh API | Har uch bo‘lim uchun alohida bo‘sh matn; product kartalari 0 |
| API 503 | 3 error/retry holati; soxta kartalar ko‘rsatilmadi |
| Retry | API tiklangach har uch retry ishladi, errorlar 0, haqiqiy 5 ta karta qaytdi |

**390, 768, 1280 va 1440 CSS px** da bosh sahifa, katalog, tafsilot, profil,
buyurtmalar va yordam — **24 kombinatsiya** tekshirildi. Barchasida
`scrollWidth === innerWidth`; yuklangan `<img>` lar orasida buzilgani va
console error/warning yo‘q. [O‘lchovlar](homepage-browser-results.json).
Guest sessiya tekshiruvidagi 401 va ataylab berilgan 503 xatolari kutilgan;
frontend asset so‘rovlarida 4xx/5xx kuzatilmadi. Video autoplay’iga sahifa
boshlanishida tayanilmaydi: faqat play tugmasi bosilgandan keyingi ijro tekshirildi.

Desktop va mobil to‘liq sahifa ko‘rinishlari mockup bilan ko‘zdan kechirildi.
Mobil hero uchun alohida portrait manba (`picture` / 600 px breakpoint)
yaratildi; tablet kadrining yo‘nalishi ham avtomobilni ko‘proq ko‘rsatishga
moslashtirildi. Footerga o‘tilgach barcha 12 ta homepage rasmi yuklanganligi
va `naturalWidth > 0` ekani alohida tekshirildi.
Karta soni/bo‘lim nisbatlari, qidiruv panelining hero ustidagi joylashuvi, footer
va shrift/aksentlar solishtirildi. QA inventari mockupdagi real marka/model
namunalariga almashtirilmadi. A’zolar bazasi bo‘sh bo‘lgani uchun brauzerda
hamjamiyatning bo‘sh ko‘rinishi tekshirildi; to‘ldirilgan hamjamiyat avatari
fallback’i avtomatik testda tekshirildi.

### Ushbu o‘tishdagi avtomatik natijalar

| Tekshiruv | Natija |
|---|---|
| `CI=true npm test -- --watchAll=false --runInBand` | **20/20 o‘tdi**; oldingi auth/order/profil regressiyalari saqlandi |
| `npx tsc --noEmit --incremental false` | O‘tdi |
| Test API bilan frontend production build | O‘tdi |
| Mavjud `.env` bilan frontend production build | O‘tdi |
| O‘zgargan ilova fayllariga alohida ESLint | 0 error, katalogdagi avvalgi `setProducts` dependency ogohlantirishi 1 ta |
| Test fayli qo‘shilgan kengaytirilgan ESLint | **O‘tmadi:** 92 testing-library uslub qoidasi xatosi va 1 hook warning |
| `git diff --check` | O‘tdi |

ESLint’ning test uslubi talablari (`prefer-screen-queries`, render-result nomi,
`act` / native DOM kirishi) mavjud eski testing-library bilan yozilgan harnessga
ham tegadi. Bu xatolar yashirilmadi va qoidalar o‘chirilmadi; unrelated test
infratuzilmasi/dependency migratsiyasi bajarilmadi. Testlar va TypeScript alohida
o‘tdi. Eski React/testing-library deprecation warning’lari test logida qoladi.
Backend kodi bu redesign’da o‘zgarmagani uchun backend testlari qayta
ishga tushirilmadi; yuqoridagi 18/18 avvalgi upload o‘tishiga tegishli.

Yangi testlar: qidiruv handoff’i, kech kelgan mashhur mahsulot javobini rad etish,
error → retry, mobil menu Escape/route va video close/focus xatti-harakati.

### Tasvirlar va qolgan cheklovlar

[Desktop to‘liq sahifa](homepage-desktop.jpg), [desktop yuqori qismi](homepage-desktop-top.jpg),
[mobil ko‘rinish](homepage-mobile.jpg), [mobil to‘liq sahifa](homepage-mobile-full.jpg).
Tasvirlar alohida built-in imagegen orqali yaratilib, public/assets/luxavto
ichida JPEG sifatida saqlandi; [fayllar va yakuniy promptlar](homepage-assets.md).

Tasdiqlangan manzil, telefon, email, ish vaqti va social URLlar hali kerak.
Contact form provider va payment provider qo‘shilmadi. Production deployment,
haqiqiy inventar va ekran o‘quvchi bilan to‘liq audit bajarilmadi. Bosh sahifadan
tashqaridagi mavjud sahifalarda ayrim eski inglizcha matnlar saqlangan.

## Katalogning to‘liq redesign’i — 2026-10-19

Katalog headerdan footergacha yangi homepage dizayn tizimiga moslandi. Umumiy
`HomeNavbar`/`OtherNavbar` va footer qayta ishlatildi. Katalogning intro,
qidiruv/sort, radio sidebar, kartalar, pagination, skeleton/empty/error,
4 video va location bo‘limlari haqiqiy responsiv komponentlar sifatida yozildi.
Homepage komponentlari/stillari, detail sahifasi, backend, schema va oldingi
security/auth/order/profil upload tuzatishlari o‘zgartirilmadi. Dependency
qo‘shilmadi yoki yangilanmadi.

### Asosiy fayllar va haqiqiy API kontrakti

- `src/app/screens/productsPage/Products.tsx` — URL asosidagi qidiruv,
  saralash, bitta kuzov filtri va pagination; Redux’ga haqiqiy mahsulotlar
  uzatiladi. Effect’da barqaror dispatch va kech javobni rad etish bor.
- `CatalogVehicleCard.tsx` — haqiqiy rasm, nom, yil, km va USD narxi (sentlar
  saqlanadi), detail havolasi va savat amali. Model/schema’da transmission
  maydoni yo‘q; “Avtomat” taxmin qilib chiqarilmadi.
- `src/lib/catalogSearch.ts` — homepage’dan kelgan `search`, `collection`,
  `order` va katalogdagi `page` query’larini o‘qiydi. Sahifa hajmi 6 ta;
  search/category/sort o‘zgarsa 1-sahifaga qaytadi. Page almashganda filtrlar
  saqlanadi. Totalga sig‘maydigan URL sahifasi haqiqiy oxirgi sahifaga qaytariladi.
- `ProductService.ts` — `X-Total-Count` xavfsiz, manfiy bo‘lmagan integer va
  javobdagi mahsulotlardan kam bo‘lmasligi tekshiriladi. Header yo‘q/noto‘g‘ri
  bo‘lsa soxta 0 yoki page count yaratilmaydi; error/retry ko‘rsatiladi.
- `src/css/catalog.css` — faqat `.lux-catalog` va katalog player’i uchun stillar;
  eski product detail stillari saqlandi.
- `Basket.tsx` — mavjud cart/order handlerlari saqlandi; ko‘rinadigan matnlar
  va accessible nomlar Uzbekchaga o‘tkazildi, yetishmagan/buzilgan rasm uchun
  placeholder qo‘shildi. Kartadan savatga qo‘shish detail route’ini ochmaydi.

Backend `productCollection` orqali **bitta** enum qiymatini oladi; shu sabab
checkbox emas, radio ishlatildi. Saralash: `createdAt` kamayish, `productPrice`
o‘sish, `productViews` kamayish. Backend narx oralig‘i yoki kategoriya count
kontraktini bermaydi — min/max va taxminiy countlar qo‘shilmadi. Faqat
`X-Total-Count` dan kelgan umumiy natijalar soni ko‘rsatiladi. Backendga yangi
endpoint yoki pagination o‘zgartirishi kerak bo‘lmadi.

Eski “Unable to load cars” matni haqiqiy service so‘rovi rad etilganda chiqardi;
u faqat styling muammosi deb olinmadi. Joriy endpoint izolyatsiyalangan bazada
**HTTP 200**, `X-Total-Count: 21`, birinchi sahifada 6 ta fixture qaytardi va
brauzer normal natijalarni ko‘rsatdi. Tarixiy screenshot xatosining aynan qaysi
server/network/CORS holatidan kelgani bu muhitda qayta hosil qilinmadi;
production uchun “sababi tuzatildi” degan xulosa chiqarilmadi. Haqiqiy request
failure alohida QA proksi orqali 503 bilan tekshirildi.

### To‘rtta asl video saqlandi

`CatalogVideos.tsx` quyidagi **aynan oldingi source yo‘llarini** ishlatadi.
Fayllarning ish boshidagi va yakunidagi SHA-256 qiymatlari teng: video
almashtirilmadi, olib tashlanmadi yoki qayta kodlanmadi.

| Asl source | Fayldan o‘qilgan native o‘lcham | Taxminiy davomiylik |
|---|---|---|
| `/video/BMW.mp4` | 1080 × 1920 | 15.02 s |
| `/video/Bugatti.mp4` | 1080 × 1920 | 8.15 s |
| `/video/Lamborghini.mp4` | 1080 × 1920 | 9.01 s |
| `/video/Benz.mp4` | 480 × 854 | 8.01 s |

Fayllar portret logotip animatsiyalari. Preview posteri AVFoundation orqali
asl faylning 4-soniya kadridan yangi JPEG sifatida olindi; birinchi sekund qora
kirish kadri bo‘lgani uchun ishlatilmadi. Ikkinchi video uchun neytral
“Avtomobil taqdimoti” sarlavhasi tanlandi. Mockupdagi boshqa avtomobil videolari
bilan almashtirilmagan. Gallery landscape 2×2 / mobile 1 ustun, poster va
player `object-fit: contain` bilan native kontentni kesmaydi.

Bir vaqtda faqat bitta Dialog/player mount qilinadi. Ochilishda controls/muted,
yopilganda pause + unmount; Escape, fokus trap va ochgan tugmaga fokus qaytishi
MUI Dialog orqali saqlangan. Error matni, retry va asl videoni alohida ochish
havolasi bor. Video yuklanish xatosining fallback’i avtomatik testda tekshirildi;
brauzerda video network xatosi ataylab chaqirilmadi.

[Asl fayl hash’lari va poster metadata](catalog-media.json),
[haqiqiy brauzer ijro natijalari](catalog-video-browser.json).

### Location: tasdiqlanmagan restoran manzili olib tashlandi

Eski iframe URL’i `Kamolon Osh` restoraniga yo‘naltirilgan edi; uni LuxAvto
showroomi deb ko‘rsatish uchun dalil topilmadi. `CatalogLocation.tsx` va
`siteContent.ts` ichidagi `siteLocation` konfiguratsiyasi qo‘shildi. Hozir
address/embed/map URLlar tasdiqlanmagan va bo‘sh. UI’da “Manzil tasdiqlanmoqda” /
“Xarita hali sozlanmagan” ko‘rsatiladi; abstrakt SVG — real geografiya emas.
Restoran iframe’i yoki ishlamaydigan “Xaritada ochish” tugmasi chiqarilmaydi.
Tasdiqlangan URLlar kiritilgandagi iframe/havola branch’i kodda mavjud,
**haqiqiy manzil bilan brauzerda hali tekshirilmagan**. Yangi map provider
qo‘shilmadi. Umumiy footerning tasdiqlanmagan kontakt/social qiymatlari bo‘sh
qoldirildi.

### Haqiqiy brauzer tekshiruvlari

Frontend production build `127.0.0.1:3010`, faqat lokal QA proksi `:3014`,
haqiqiy backend `:3015` va vaqtinchalik MongoDB replica set ishlatildi.
Production bazasi/yozuvlari o‘zgartirilmadi. 17 sedan va 4 sport fixture bor;
kartalardagi `QA ...` nomlar va narxlar faqat sinov ma’lumotidir. Vizual fixture
rasmlari loyihadagi mavjud upload rasmlaridan vaqtinchalik katalogga nusxalandi;
production inventory UI’da hardcode qilinmadi. Loading/empty/503 faqat
vaqtinchalik proksida berildi, ilovaga QA endpointlari qo‘shilmadi.

| Amal | Kuzatilgan natija |
|---|---|
| Dastlabki katalog | 21 ta, 6 ta karta, newest tartibida `QA Sedan 01…06` |
| Oxirgi sahifa | 4-sahifada 3 ta mahsulot; Next disabled |
| Sedan filtri | Page 1, 17 ta natija; eski 4-sahifa saqlanib qolmadi |
| Views sort | `QA Sedan 17…12` kamayish tartibida |
| Sport + price sort | 4 ta; `QA Sport 1…4`, $27000 → $30000 |
| Search / Enter | `QA Sport 4` 1 ta natija berdi, qolgan filtrlar saqlandi |
| Search clear / reset | Clear kategoriyani saqladi; Tozalash search/category/sort/page’ni defaultga qaytardi |
| Reload / homepage handoff | `QA Sport`, `SPORTS_CAR`, `productPrice` va dropdown/radio qiymatlari reload’dan keyin saqlandi |
| Mobil draft/apply | SUV tanlanganda Apply’gacha 21 ta natija qoldi; Apply 0 ta natijaga o‘tkazdi va panelni yopdi |
| Mobil Escape/reset | Saqlanmagan Sedan draft’i bekor bo‘ldi; fokus toggle’ga qaytdi; empty reset 21 ta natijani tikladi |
| Detail link | Asl product detail route’i, 4 ta Swiper img, mavjud Add To Basket ko‘rindi |
| Cart | Katalog kartasidan qo‘shildi, route o‘zgarmadi; + 2 dona / $20000, − va clear ishladi; Uzbekcha mobil savat sig‘di |
| Auth | Katalogda signup, reload sessiya restore, account linklari, logout va qayta login ishladi; katalog URL’i saqlandi |
| Mobil nav | Ochildi/yopildi; Avtomobillar `aria-current=page` |
| 4 ta video | Barchasi readyState=4, muted; BMW vaqt 7.48 s ga yetdi, qolgan uchala video yakunigacha ijro etildi |
| Video close / keyboard | Escape va close player’ni olib tashladi, fokus ochgan tugmaga qaytdi; mobile Benz Enter bilan ochildi va contain bilan viewportga sig‘di |
| Sekin API | “Avtomobillar yuklanmoqda…”, 6 skeleton, 0 haqiqiy karta |
| Bo‘sh API | “0 ta avtomobil”, alohida empty matn va reset |
| 503 / retry | Error matni, 0 karta, pagination yo‘q; API tiklangach ayni query bilan 4 ta sport avtomobili qaytdi |
| Map | 0 iframe, tasdiqlanmagan restoran linki yo‘q, missing-config xabari ko‘rindi |

Katalog **390, 768, 1280, 1440 CSS px** da tekshirildi: kartalar 1/2/3/3,
video grid 1/2/2/2 ustun. 390/768’da collapsible panel, desktopda sidebar.
Homepage va detail ham 390/1440’da ko‘rildi: jami **8 layout kombinatsiyasi**da
horizontal overflow, yuklangan buzilgan img va console error/warning yo‘q.
[O‘lchovlar](catalog-browser-results.json). Ayrim dastlabki snapshotlarda hali
lazy-loadingdagi rasmlar alohida `pendingImages` sifatida yozilgan; ular broken
deb hisoblanmagan. Yakuniy katalog skrinshotlarida barcha 11 ta img yuklangani
va `naturalWidth > 0` ekani desktop/mobile’da alohida tasdiqlandi. Mobil ochiq
filter panelida ham overflow yo‘q.

Frontend asset logida 4xx/5xx kuzatilmadi; barcha to‘rtta MP4 uchun 206 range
javoblari bor. Guest `/member/detail` 401 javoblari va sun’iy QA 503 kutilgan.
Runtime’da kutilmagan failed request aniqlanmadi; tarixiy production xatosi
bu natijadan ishlayapti deb e’lon qilinmaydi.

### Yakuniy avtomatik natijalar

| Tekshiruv | Natija |
|---|---|
| Frontend Jest | **29/29**, 3 suite o‘tdi |
| TypeScript `tsc --noEmit --incremental false` | O‘tdi |
| Test API bilan production build | O‘tdi |
| Mavjud `.env` bilan production build | O‘tdi |
| Katalog/service/helper/Basket va yangi testlarga ESLint | **0 error / 0 warning** |
| Legacy `src/app/App.test.tsx` ESLint | **O‘tmadi: 91 test-uslub xatosi** |
| `git diff --check` | O‘tdi |
| 4 ta original video SHA-256 taqqoslash | Barchasi teng |

Oldingi auth/order/profile/homepage testlari olib tashlanmadi, yangi katalog
label/route’lariga moslashtirildi. Yangi testlar search/sort/category/page
reset, mobile draft/apply/reset, aniq total/last page, out-of-range URL,
loading/empty/error/retry, kech javobni rad etish, sentlar/cart/fallback,
4 source/player close/error va tasdiqlanmagan map branch’ini qamrab oladi.
Native React createRoot testida bitta `act` satri uchun Testing Library
false-positive qoidasi izoh bilan lokal istisno qilingan; global qoidalar
o‘chirilmadi. Eski `App.test.tsx` dagi prefer-screen-queries/render naming/native
DOM uslub xatolari va eski React/testing-library deprecation warning’lari
qolgan. Legacy test harness yoki dependency migratsiyasi bu vazifaga kiritilmadi.
Backend o‘zgarmagani sababli backend testlari bu o‘tishda qayta yuritilmadi.

[Desktop to‘liq](catalog-desktop.jpg), [desktop yuqori qismi](catalog-desktop-top.jpg),
[mobil ko‘rinish](catalog-mobile.jpg), [mobil to‘liq sahifa](catalog-mobile-full.jpg),
[mobil filtrlar](catalog-mobile-filters.jpg).

Qolganlar: tasdiqlangan showroom manzili/map URLlari, kontakt/social ma’lumotlar;
API qo‘llamaydigan price-range va kategoriya countlari; modelda yo‘q transmission.
Production deployment, haqiqiy showroom xaritasi va to‘liq screen-reader auditi
tekshirilmadi. Haqiqiy order yaratish/transition bu brauzer o‘tishida takrorlanmadi;
mavjud frontend order regressiyalari Jest’da saqlandi. Payment/contact provider
qo‘shilmadi.

Katalog QA yakunida agent tabi yopildi, viewport override tiklandi va
vaqtinchalik frontend/proksi/backend/MongoDB jarayonlari to‘xtatildi. Shu
preview’ning test bazasi va upload nusxalari tozalandi; source videolar va
production yozuvlariga tegilmadi.

## Yordam sahifasi qayta ishlanishi — 2026-10-19

### Ko‘lam va koddan tasdiqlangan holat

Ikkita biriktirilgan topshiriq matni bir xil. Ularda tilga olingan Help maketi
alohida rasm sifatida mavjud emas edi; shuning uchun aynan maket bilan piksel
bo‘yicha taqqoslash bajarilmadi. Sahifa topshiriqdagi tuzilma hamda avvalgi
homepage/catalog’ning ivory/charcoal/gold, serif/sans-serif uslubiga moslandi.

`src/app/screens/helpPage/index.tsx` eski TERMS/FAQ/CONTACT tablari va 1000px
balandlikni uchta bo‘lim kartasi, ikki ustunli FAQ, raqamlangan qoidalar va
split aloqa paneliga almashtiradi. `src/css/help.css` faqat `.lux-help` ichida
ishlaydi. Barcha yangi matnlar o‘zbekcha. Bir xil header/footer qayta ishlatiladi;
footer’dagi shartlar havolasi endi `/help#terms` bo‘limiga olib boradi.
`/help#faq`, `/help#terms`, `/help#contact` havolalari fokusni manzilga ko‘chiradi;
reduced-motion holatida silliq scroll o‘chadi. Eski tablarda URL deep-link
mexanizmi bo‘lmagan.

FAQ va qoidalar yozilishidan oldin haqiqiy auth, Settings, catalog, Basket,
orders komponentlari, API router va Order.service ko‘rildi. Joriy imkoniyatlar:
public katalog, hisob bilan order/profile, DB hisoblagan summa, pending’dan
cancel/confirm, process’dan finish; tasdiqlangan buyurtma uchun foydalanuvchi
cancel tugmasi yo‘q. Orders’dagi `Payment` faqat holatni o‘zgartiradi. FAQ buni
haqiqiy pul to‘lovi deb ko‘rsatmaydi. JPG/JPEG/PNG va 5 MiB haqidagi profil
rasmi yo‘riqnomasi mavjud client/server tekshiruvlariga mos.

**Aloqa xizmati mavjud emas.** Eski forma `action="#" method="POST"` edi;
frontend servislarida va backend routerlarida aloqa yuborish endpoint’i yo‘q.
Yangi forma name/email/subject/message uchun haqiqiy label’lar va disabled
fieldset/submit bilan ko‘rsatiladi. “Xabar yuborish hozircha mavjud emas.”
xabari doim ko‘rinadi; soxta pending/success yoki provider qo‘shilmadi.
`siteContact` ichida tasdiqlangan telefon/email yo‘q, shuning uchun bunday
havola o‘ylab topilmadi. Yuborish validatsiyasi/success/failure branch’lari
ulangan xizmat yo‘qligi sababli qo‘llanmaydi va tekshirilgan deb hisoblanmaydi.

### Haqiqiy brauzer tekshiruvi

Chrome’da production build `127.0.0.1:3010`, proksi `3014`, haqiqiy backend
`3015` orqali ishlatildi. Alohida vaqtinchalik MongoDB replica set, 21 ta QA
avtomobil va yangi test hisobi ishlatildi; production DB/yozuvlari o‘zgarmadi.
Hech qanday credential logga yoki ushbu hujjatga yozilmadi.

| Tekshiruv | Haqiqiy natija |
|---|---|
| 390 / 768 / 1280 / 1440 CSS px | Overflow yo‘q, buzilgan yuklangan img yo‘q; kichik kengliklarda kartalar/FAQ/contact bir ustun, desktop’da 3 / 2 / 2 ustun |
| Uchta tezkor karta | `#faq`, `#terms`, `#contact`; fokus tegishli section’ga ko‘chdi |
| FAQ | Barcha 6 savol Enter/Space bilan ochildi/yopildi; `aria-expanded` va panel hidden mos; bir vaqtda ko‘pi bilan bitta panel ochiq |
| Klaviatura | Tab keyingi FAQ tugmasiga o‘tdi; ko‘rinadigan solid focus outline; mobil menyu Escape bilan yopilib toggle’ga fokus qaytdi |
| Chuqur havola | `#faq` reload’da tiklandi; footer `/help#terms` ga o‘tkazib qoidalarni fokusladi |
| Contact | Barcha 4 maydon va submit disabled; mavjud emas xabari ko‘rinadi; xabar yuborilgani haqida yolg‘on tasdiq yo‘q |
| Header auth | Kirish oynasi, signup’ga o‘tish, alohida test signup, reload sessiya restore, Profilim/Buyurtmalar manzillari, logout va qayta login tasdiqlandi |
| Cart | Yordam header’idan bo‘sh savat ochildi; eski cart/order regressiya testlari ham o‘tdi |
| Umumiy footer | Homepage/catalog’da 390 va 1440 px: bittadan footer, overflow yo‘q; shartlar havolasi `/help#terms` ga ishladi |
| Console / requests | Tekshiruvda console error/warning yoki kutilmagan failed request aniqlanmadi; guest `/member/detail` 401 kutilgan; frontend assetlarda 4xx/5xx yo‘q |

[O‘lchovlar va FAQ dalillari](help-browser-results.json).
Homepage/catalog mobil snapshotlarida hali yuklanayotgan lazy rasmlar
`pendingImages` sifatida qayd etildi, ular broken deb baholanmadi; desktop’da
ular yuklangan. Help sahifasidagi rasmlar buzilmagan.

Bu o‘tishda buyurtma yaratish/status o‘zgartirish, profil tahriri yoki rasm
upload qayta bajarilmadi; yuqoridagi FAQ shu qismlarning joriy kodi va avvalgi
hujjatlashtirilgan tekshiruvlariga asoslangan. To‘liq screen-reader auditi,
boshqa brauzerlar va production deployment tekshirilmadi. Reduced-motion
branch’i avtomatik testda tekshirildi; operatsion tizim sozlamasi o‘zgartirilmadi.

### Avtomatik tekshiruvlar

| Tekshiruv | Natija |
|---|---|
| Frontend Jest | **33/33**, 4 suite o‘tdi; Help uchun 4 yangi mazmunli test |
| `tsc --noEmit --incremental false` | O‘tdi |
| Production build: isolated API / mavjud `.env` | Ikkalasi o‘tdi |
| Help kodi/testlari, FAQ/terms va footer ESLint | 0 error / 0 warning |
| Eski `src/app/App.test.tsx` alohida ESLint | O‘tmadi: avvaldan mavjud 91 test-uslub xatosi |
| `git diff --check` | O‘tdi |

Yangi regressiyalar uchta manzil/fokus, to‘g‘ridan-to‘g‘ri hash/reduced-motion,
accordion button/panel/hidden bog‘lanishi va unavailable formaning label,
disabled hamda submit guard’ini qamraydi. Eski App testi yangi Help sarlavhasiga
moslandi; oldingi xavfsizlik/order/profile/home/catalog testlari saqlandi.
Legacy testing-library/React deprecation warning’lari qolgan. Backend kodi,
dependencylar va DB sxemalari o‘zgarmadi; backend testlari bu o‘tishda qayta
ishlatilmadi.

[Desktop to‘liq](help-desktop.jpg), [desktop yuqori qism](help-desktop-top.jpg),
[mobil ko‘rinish](help-mobile.jpg), [mobil to‘liq sahifa](help-mobile-full.jpg).

Egasi belgilashi kerak: haqiqiy aloqa ma’lumotlari va kelajakdagi contact xizmati;
yuridik foydalanish/maxfiylik siyosati, refund/cancellation tijoriy shartlari,
kafolat va yetkazib berish shartlari. Hozirgi qoidalar amaldagi funksiyalar
bo‘yicha yo‘riqnoma; bunday siyosatlar o‘ylab topilmadi. Payment/contact provider
ushbu vazifada qo‘shilmadi. Asl Help maketi taqdim etilsa, u bilan aniq vizual
solishtirish hali bajarilishi mumkin.

Help QA yakunida test hisobidan chiqildi, agent tabi yopildi, vaqtinchalik
viewport override tiklandi. Frontend/proksi/backend/MongoDB test jarayonlari
to‘xtatildi va preview bazasi/upload nusxalari tozalandi. Manba fayllari va
production ma’lumotlariga tegilmadi.

## Frontend–backend ulanishini tiklash — 2026-10-19

### Tasdiqlangan sabablar va dastlabki dalillar

Amaldagi frontend `http://localhost:3001`, API `http://localhost:3004` da edi.
3000 portini boshqa Docker xizmati egallagan; CRA frontendni 3001 da ishga
 tushirgan. Backend `.env`ida `FRONTEND_ORIGIN` yo‘q edi, shuning uchun app.ts
`http://localhost:3000` fallback’ini ishlatgan. Frontend `.env`idagi
`REACT_APP_API_URL=http://localhost:3004` to‘g‘ri; Axios URL yoki marshrut xatosi
aniqlanmadi. Auth so‘rovlarida `withCredentials:true` mavjud.

Bundan tashqari, foydalanuvchining ayni Chrome tabidagi DevTools Network
throttling **Offline** holatida edi. Haqiqiy Retry so‘rovi Network panelida
`net::ERR_INTERNET_DISCONNECTED` bo‘ldi. Uni **No throttling** holatiga qaytarib,
yana Retry qilinganda **CORS AllowOriginMismatch** tasdiqlandi. Browser zoom,
ruxsatlar yoki xavfsizlik sozlamalari o‘zgartirilmadi.

| Dastlabki tekshiruv | Haqiqiy natija |
|---|---|
| Browser GET `http://localhost:3004/product/all?order=productViews&page=1&limit=3` | Offline’da HTTP javobi yo‘q; online’da Network Headers **200 OK**, ammo CORS AllowOriginMismatch |
| Direct GET `http://localhost:3004/product/all?page=1&limit=6&order=createdAt`, Origin `http://localhost:3001` | **200**, array 6, `X-Total-Count:8`, ACAO `http://localhost:3000`, credentials=true, X-Total-Count exposed |
| Browser signup `http://localhost:3004/member/signup` | OPTIONS **204 No Content**, ammo noto‘g‘ri origin; POST brauzer tomonidan bloklangan, muvaffaqiyatli signup HTTP javobi yo‘q |
| Direct POST `/member/signup`, Origin `http://localhost:3001`, yaroqsiz bo‘sh body | **403**, `Request origin is not allowed`; yozuv yaratilmagan |
| Eski browser Console yozuvlari | Product/signup/login URLlarida `ERR_CONNECTION_REFUSED` ham bor edi; HTTP status mavjud emas. Bu eski urinishlar, joriy diagnozda API allaqachon ishlayotgan edi |

Browser signup diagnostikasi uchun 2000 belgidan uzun telefonli, server
validatsiyasidan o‘ta olmaydigan input ishlatildi; masofaviy bazada hisob
 yaratilmasligi ta’minlandi. Parol/request body/token/cookie qiymatlari
hujjatga yoki diagnostika natijalariga chiqarilmadi.

Joriy DB faqat o‘qib tekshirildi: ulanish sog‘lom, writable primary va replica
set bor; **11 ta product, 8 ta ACTIVE**. Bu bo‘sh baza emas. Order/points
transaction’lari uchun replica set zarur; signup/catalog o‘zi transaction talab
qilmaydi. Yetishmagan konfiguratsiya faqat `FRONTEND_ORIGIN`; mavjud MONGO_URL,
SECRET_TOKEN va SESSION_SECRET qiymatlari chop etilmadi va almashtirilmadi.
Backend marshrutlari `/` ostida to‘g‘ri ulangan. Qayta startup logida MongoDB
connection succeed va port 3004 muvaffaqiyatli ishga tushgani tasdiqlandi.

### Minimal tuzatish

- Frontend `package.json`: `start:local` → `PORT=3001 react-scripts start`.
- Backend `package.json`: `start:local` → `FRONTEND_ORIGIN=http://localhost:3001 npm run start:dev`.
- Ikkala README’da haqiqiy port juftligi, custom-port tartibi, CRA API URL’ni
  startup/build vaqtida olishi, backend restart’i va Offline diagnostikasi yozildi.
- Backend regressiyasiga aynan 3001 uchun credentialed preflight/catalog header,
  3000 origin’ining POST’ini 403 bilan rad etish va invalid signup 400 bilan
  bazaga yozmaslik tekshiruvi qo‘shildi.

Mavjud `.env` fayllari o‘zgartirilmadi. CORS middleware, origin guard, cookie,
auth/validation, DB sxemasi va frontend dizayn kodi o‘zgartirilmadi; wildcard
credentialed CORS qo‘shilmadi, xatolar yashirilmadi. Ikki dev server ham yangi
buyruq bilan haqiqiy qayta ishga tushirildi. 3001 band bo‘lsa, CRA taklif qilgan
boshqa portni shunchaki qabul qilmang: avvalgi frontendni ishlating yoki ikkala
process konfiguratsiyasini aynan yangi origin’ga moslang.

### Tuzatishdan keyingi haqiqiy brauzer natijalari

Oddiy lokal muhit **3001 → 3004** da qayta yuklandi: featured **3**, new **2**,
loading-error alert **0**. Direct API qayta tekshirildi: **200**, ACAO aynan
`http://localhost:3001`, credentials=true, total **8**, qaytgan array **6**.
Masofaviy bazaga valid signup yoki product detail/view-counter yozuvi yuborilmadi.

Autentifikatsiya va detail sinovlari uchun alohida vaqtinchalik Mongo replica
set ishga tushirildi: frontend `http://localhost:3010`, QA proksi `3014`, haqiqiy
backend `3015`. Faqat mavjud API’dan o‘qilgan **8 ta ommaviy ACTIVE avtomobil**
va mavjud rasm fayllari nusxalandi; **0 ta o‘ylab topilgan avtomobil** qo‘shildi.
Production a’zolari yoki credential’lari nusxalanmadi. Yangi yagona test USER va
member/Uzavto uchun mavjud bootstrap servisi orqali alohida test dealership
ADMIN yaratildi. Dastlab faqat product nusxalari bo‘lgani uchun QA’da shu
member/Uzavto so‘rovi 404 edi; test dealership qo‘shilgach 200 bilan tekshirildi.
Bu 404 production endpointi ishlamayotganining dalili sifatida talqin qilinmadi.

| Izolatsiyalangan browser oqimi | Haqiqiy natija |
|---|---|
| Unique signup | OPTIONS **204**, POST **201**; UI hisob menyusiga o‘tdi |
| DB tekshiruvi | Test nickname bo‘yicha aynan **1 ta USER / ACTIVE / points=0**; parol hash sifatida saqlangan |
| Reload sessiya | `/member/detail` **200**; hisob menyusi tiklandi |
| Logout + reload | POST **200**, keyingi member/detail **401**, UI guest holatida |
| Qayta login | POST **200**, UI authenticated |
| Takroriy signup | POST **400**; “The nickname or phone number is already in use.” ko‘rindi, username saqlandi; ikkinchi hisob yaratilmagan |
| Cookie | Signup/login’da **HttpOnly=true, SameSite=Lax, Secure=false**; qiymatlar yozilmadi. Hostname ikkala tarafda localhost |
| Featured / new | **3 / 2** karta, tegishli API 200 yoki valid cached 304 |
| Katalog | **8 ta**, birinchi sahifada **6**, ikkinchisida **2** karta |
| Product detail | Haqiqiy `/product/:id` **200**, rasm naturalWidth **830**, mavjud detail kontenti ko‘rindi; ko‘rilish hisoblagichi faqat nusxa bazada o‘zgardi |
| Loading | QA proksida 3 s kechikish: homepage’da 3 loading matni; catalog’da 6 skeleton, 0 karta |
| Empty | Faqat QA proksi 200 `[]` + total=0 qaytardi: catalog 0, empty matn, alert yo‘q; homepage’da haqiqiy empty matnlar |
| Error | Faqat QA proksi 503: homepage’da 3 alohida error/retry, catalog’da error/retry va 0 karta |
| Retry | Normal API tiklangach catalog 8 ta; uchala homepage retry orqali featured/new 3/2, alert 0 |

Fault injection faqat vaqtinchalik QA proksida; ilova kodi va oddiy 3001/3004
muhitiga qo‘shilmagan. Empty holat production bazani o‘chirish bilan sinovdan
 o‘tkazilmadi. Kutilgan 401, duplicate-signup 400, dastlabki QA dealership 404
va ataylab 503 javoblari alohida qayd etilgan. Frontend statik asset logida
4xx/5xx yo‘q. Normallashtirilgan production build tabida JS error/warning
aniqlanmadi. Ishlab chiqish buildidagi eski MUI/findDOMNode StrictMode
deprecation warning’lari saqlanadi; dependency yangilanmadi.

[Sanitizatsiyalangan browser request dalillari](connection-network.json),
[tiklangan haqiqiy homepage](connection-home.jpg),
[izolatsiyalangan product detail](connection-detail.jpg).

### Yakuniy tekshiruvlar va qolganlar

| Tekshiruv | Natija |
|---|---|
| Frontend Jest | **33/33**, 4 suite |
| Backend Node test runner + build | **19/19**, jumladan yangi alternate-origin regressiya |
| Frontend TypeScript | O‘tdi |
| Frontend production build, mavjud API URL | O‘tdi |
| Izolatsiyalangan API bilan frontend production build | O‘tdi |
| Ikkala repo `git diff --check` | O‘tdi |
| Ikkala `start:local` bilan real restart | Frontend **3001**, backend **3004**, data brauzerda qayta yuklandi |

Bu o‘tishda TS/CSS/UI modullari o‘zgarmadi. Alohida npm lint buyrug‘i yo‘q;
avvalgi legacy App.test.tsx lint-uslub qarzi bu konfiguratsiya vazifasiga
kiritilmadi. Hech qanday dependency upgrade amalga oshirilmadi.

Bitta mavjud public product yozuvida eski **SPORT_CAR**, amaldagi enum/query’da
**SPORTS_CAR** bor. Nusxalashda bu haqiqiy saqlangan qiymat aniqlandi; snapshot
uni aynan saqladi. Shu sabab Sport filtri eski yozuvni topmasligi mumkin.
Production data migratsiyasi ushbu vazifada taqiqlanganligi uchun yozuv
o‘zgartirilmadi. Bu umumiy loading/signup xatosining sababi emas.

Oddiy ishlash uchun frontend **3001**, API **3004** va mavjud MONGO_URL orqali
ulaniladigan MongoDB replica set kerak. Docker’ning 3000 portidagi xizmati
tegilmadi. Production signup/login yozuvlari yaratilmagani sabab ularning
masofaviy bazaga yozish qismi alohida sinovdan o‘tkazilgan deb da’vo qilinmaydi;
xuddi shu haqiqiy backend kodi va auth yo‘li izolatsiyada tekshirildi.
Payment/contact provider qo‘shilmadi.

Yakuniy oddiy lokal katalog ham `http://localhost:3001/products` da tekshirildi:
8 ta total, 6 ta karta, 0 alert. Takroriy signup’dan so‘ng QA DB’da shu nickname
bo‘yicha yana aynan 1 ta hisob borligi tekshirildi. QA tabi yopildi, viewport
override tiklandi; vaqtinchalik frontend/proksi/backend/Mongo jarayonlari
va ularning bazasi/upload nusxalari tozalandi. **Oddiy frontend 3001 va backend
3004 ishlashda qoldirildi.** Manba `.env`lar va production yozuvlari o‘zgarmadi.

## Buyurtmalar sahifasi redesign’i — 2026-10-19

### Amalga oshirilgan o‘zgarishlar

Biriktirilgan maketdagi ivory/charcoal/gold uslub, serif sarlavhalar, chapdagi
buyurtmalar va o‘ngdagi ixcham profil/karta panellari haqiqiy React komponentlari
bilan amalga oshirildi. Shared header/footer saqlandi. `/orders` kirish bilan
himoyalangan, “Buyurtmalar” faol navigatsiya; breadcrumb, sarlavha, matn va pastki
“Katalogga qaytish” havolasi mavjud. Sahifa ilk ochilganda dialog yopiq,
to‘lov uchun hech bir buyurtma avtomatik tanlanmaydi.

Asosiy fayllar: `ordersPage/index.tsx`, `OrderCard.tsx`, `PaymentPanel.tsx`,
`cardValidation.ts`, `orderPresentation.ts`, `src/css/order.css`. Uchta eski
status renderer umumiy OrderCard bilan almashtirildi. OrderService faqat o‘z
so‘rovlariga credentials qo‘llaydi; global Axios defaults o‘zgartirilmaydi,
order javoblari console’ga chiqarilmaydi va noto‘g‘ri non-array javob rad etiladi.
Help FAQ yangi tab/tugma nomlari va to‘lov namoyishiga moslandi. API marshrutlari,
auth, backend status/price/points xavfsizligi, dependencylar o‘zgarmadi.

Backend kodi tekshirildi: **PENDING → PROCESS**, **PENDING → DELETE**,
**PROCESS → FINISH**. UI tablari **Kutilmoqda / Jarayonda / Yakunlangan**.
PROCESS’da bekor qilish, FINISH’da amal tugmalari yo‘q. Tasdiqlash to‘lovdan
alohida dialog; “Bu amal pul yechmaydi” mazmuni aniq. Cancel soft-status DELETE;
bekor qilingan buyurtmalar ushbu uch tabga qayta chiqarilmaydi.

Kartalar barcha orderItems’ni, productData orqali mavjud rasm/nom/yil/km,
miqdor, buyurtmadagi saqlangan itemPrice va qator summasini ko‘rsatadi. Olib
tashlangan mahsulot fallback bilan o‘qiladi. Yakuniy **orderTotal bevosita API’dan**;
qo‘shimcha orderDelivery musbat bo‘lsa alohida ko‘rsatiladi. Currency modeli
alohida field saqlamaydi; UI mavjud katalogdagi USD konvensiyasini saqlaydi.
Transmission field mavjud emasligi uchun “Avtomat” o‘ylab qo‘shilmadi. Reference
haqiqiy order ID’ning oxirgi 8 belgisidan hosil qilinadi; API to‘liq ID oladi.
Sana haqiqiy createdAt’dan olinadi. Brauzer Uzbek ICU’si “M10” chiqargani aniqlandi
va oy nomlari o‘zbekcha ko‘rsatiladigan qilib tuzatildi.

Buyurtmalar tanlangan status uchun sahifalab yuklanadi. “Yana buyurtmalarni
ko‘rsatish” qolganlarini olib keladi; kech kelgan javob yangi tabni bosib
ketmaydi. Keyingi sahifa xatosida oldingi kartalar saqlanadi. Loading, empty,
error va retry alohida. State hisob ID’siga bog‘langan; hisob almashganda oldingi
buyurtma/karta komponenti qayta yaratiladi.

### To‘lov imkoniyatining haqiqiy holati

**Provider mavjud emas. Bu faqat lokal namoyish.** PAN/CVV oladigan endpoint,
provider SDK/logosi, haqiqiy charge, “paid” field yoki soxta muvaffaqiyat
qo‘shilmadi. Panel tepasida sinov ma’lumotlari uchun namoyish ekani aytiladi;
formaning tagida doimiy “provider ulanmagan” ogohlantirishi yoki texnik eslatma yo‘q.

PENDING yoki PROCESS kartasidagi “To‘lov uchun tanlash” ayni buyurtmani tanlaydi.
Panel uning reference’i va serverdan olingan total’ini ko‘rsatadi. Tanlovsiz
“To‘lov qilish” disabled va buyurtma tanlash so‘raladi. Karta raqami guruhlanadi,
expiry OO/YY bo‘ladi, CVV password input, preview faqat masked raqam va oxirgi
4 belgini ko‘rsatadi. Checksum/uzunlik, expiry/oy/o‘tgan muddat, CVV va ism
validatsiyasi bor; bu bank yoki provider tekshiruvi deb ko‘rsatilmaydi.

Valid input dialog ochadi: “To‘lov amalga oshirilsinmi?”, tanlangan order va
haqiqiy summa/USD, Bekor qilish / Ha, tasdiqlash / close. Cancel/Escape/close
order’ni o‘zgartirmaydi. Confirm faqat **“To‘lovni hozir amalga oshirib bo‘lmadi.”**
natijasini ko‘rsatadi va maydonlarni tozalaydi. Provider yo‘qligi sababli hech
qanday payment/order-update HTTP so‘rovi yuborilmaydi. Takroriy confirm ref-lock
bilan himoyalangan. Card values faqat PaymentPanel useState xotirasida;
localStorage/sessionStorage/Redux/DB/log/analytics’ga uzatilmaydi. Unmount,
hisob/order tanlovi almashishi va reload xotirani tozalaydi. Persist yozuvlari
Jest spy bilan, tarmoq yo‘qligi QA request logi bilan tekshirildi; brauzer
storage’ining yashirin qiymatlari eksport qilinmadi.

### Izolatsiyalangan brauzer muhiti va dalillar

Chrome’da production build: localhost **3010**, QA proksi **3014**, haqiqiy
backend **3015**, alohida tasodifiy loopback portdagi Mongo replica set.
Production bazaga yangi order yoki account/status yozilmadi. Faqat mavjud
8 public ACTIVE product va rasmlari vaqtinchalik nusxalandi. Unique test USER
UI signup orqali yaratildi. Backend servislaridan 2 PENDING (bittasi ikki
mahsulotli), 1 PROCESS, 1 FINISH test order yaratildi. Seed’da yuborilgan client
itemPrice e’tiborga olinmay, narxlar DB’dan hisoblangani tasdiqlandi.

| Haqiqiy browser tekshiruvi | Natija |
|---|---|
| Dastlab bo‘sh account | Empty matn + katalog link, dialog 0, payment disabled |
| Real orders | 2 pending karta, jami 3 item; boshqa tablarda real process/finish kartalar |
| 390 / ~768 / 1280 / 1440 | Yakuniy CSS o‘lchovlar **390/767/1280/1440**; overflow yo‘q, yuklangan broken image yo‘q; tablar 50px baland |
| Mobil summa | Katta summa oxirgi raqami sinishi aniqlandi; mobile total alohida qatorda to‘liq chiqadigan qilib tuzatildi va qayta ko‘rildi |
| Dialog ilk holati | Yopiq; birinchi order yashirin avtomatik tanlanmaydi |
| To‘lov selection | Ikkinchi, multi-item order tanlanganda aynan uning reference/DB total’i chiqdi |
| Card invalid | Empty input uchun 4 field error; noto‘g‘ri checksum, o‘tgan expiry va qisqa CVV mobil brauzerda ham rad etildi; dialog ochilmadi |
| Card format | PAN guruhlash va expiry format ishladi; CVV masked; preview’da faqat 4 raqam borligi qiymatlarni chiqarmasdan tekshirildi |
| Payment keyboard | Tab oxirgi confirm’dan close’ga o‘tib dialog ichida qoldi; Cancel/Escape/close’dan keyin fokus To‘lov qilish’ga qaytdi |
| Mobil dialog | 390px’da taxminan **354×292px**, viewportga sig‘di; Escape ishladi |
| Demo confirm | Truthful unavailable natija, barcha maydonlar tozalandi; **0 payment request, 0 order-update request** |
| DB demo solishtirish | 4 order holati, total/delivery va points oldingi snapshot bilan bir xil |
| Card memory | Reload va Profilni tahrirlash orqali route’dan chiqib qaytganda fields bo‘sh; hisob almashishi Jest’da ham tekshirildi |
| Bekor qilish | Ortga hech narsani o‘zgartirmadi; confirm’dan keyin multi-item order **DELETE** bo‘ldi |
| Update error/retry | QA’da `/order/update` preflight’iga ataylab **OPTIONS 503** berildi: inline error/retry. So‘ng normal javobga qayta urinildi |
| Duplicate/pending | Kechiktirilgan OPTIONS/POST paytida double-click faqat bitta update yubordi; tugmalar disabled, Escape dialogni yopmadi; tugagach fokus PENDING tabga qaytdi |
| Buyurtmani tasdiqlash | Escape qaytdi; qayta confirm **PENDING → PROCESS**, “To‘lov amalga oshirilmadi” notice |
| Yakunlash | Close qaytdi; qayta confirm **PROCESS → FINISH**, FINISH kartada action 0; fokus FINISH tabga qaytdi |
| Points | Seed’dan keyin 2; bitta yangi order confirm’dan keyin **3**, cancel/finish/demo qo‘shimcha point bermadi |
| List loading | QA delay: loading matni va 0 karta |
| List 503 / retry | Error ko‘rindi, empty sifatida ko‘rsatilmadi; normal retry ayni FINISH tabida 2 karta qaytardi |
| Load more | Qo‘shimcha 6 isolated pending fixture: avval 5; page-2 503’da 5 saqlandi; retry’dan keyin 6, more tugmasi yo‘q |
| Navigatsiya | Tab ArrowRight/Enter; profil havolasi; catalog-return; savat; mobil menu Escape va active Orders tekshirildi |
| Auth himoyasi | Logout’dan keyin /orders → /, Buyurtmalarim sarlavhasi yo‘q, Kirish ko‘rindi |
| Console/assets | Production QA tabida JS error/warning yo‘q; statik assetlarda 4xx/5xx yo‘q |

Amaldagi backend GET `/order/all` va POST `/order/update` uchun **201** qaytaradi;
frontend bu mavjud shartnomani qabul qiladi. QA’dagi ataylab GET 503 va OPTIONS
503 kutilgan xatolar; kutilmagan network failure aniqlanmadi. Kechiktirilgan
cancel tekshiruvida automation’ning qisqa kutish muddati oldin tugadi; keyingi
holat tekshiruvi haqiqiy yakunlangan DELETE va fokus tiklanganini tasdiqladi.
Bu application failure sifatida qayd etilmadi. Fault injection faqat vaqtinchalik
proksida, ilova kodida yo‘q.

[Raqamli layout dalillari](orders-browser-results.json),
[API/DB natijalari](orders-api-results.json), [desktop](orders-desktop.jpg),
[desktop yuqori qism](orders-desktop-top.jpg), [mobil](orders-mobile.jpg),
[mobil to‘liq sahifa](orders-mobile-full.jpg). Rasmlar **karta maydonlari bo‘sh**
holatda olingan. Kiritilgan test karta raqami yoki CVV screenshot/report’da yo‘q.
Maketi bilan asosiy grid, panel, kartalar va pastki strip solishtirildi;
maketdagi sample inventar/kontaktlar o‘ylab qo‘shilmadi. Biriktirilgan sahifa
rasmida alohida ochiq modal ko‘rinmagani sabab dialog matndagi talablar va
mavjud LuxAvto uslubiga ko‘ra ishlab chiqildi.

### Yakuniy avtomatik tekshiruvlar

| Tekshiruv | Natija |
|---|---|
| Frontend Jest | **43/43**, 5 suite; Orders uchun 10 yangi regressiya |
| Backend Node tests + build | **19/19**, alohida test replica set |
| Frontend TypeScript | O‘tdi |
| Production build, mavjud .env / QA API | Ikkalasi o‘tdi |
| Yangi Orders/helper/test, OrderService, FAQ ESLint | **0 error / 0 warning** |
| `src/app/App.test.tsx` alohida ESLint | **O‘tmadi: 95 test-uslub xatosi** |
| `git diff --check` | O‘tdi |

Mavjud auth/profile/image/cart/home/catalog/help testlari saqlandi; eski Orders
matn/window.confirm kutishlari yangi yorliq/MUI dialoglariga moslandi. Yangi
regressiyalar status mapping/multi-item/removed product/authoritative total,
loading/error/empty/retry, guest/late response, target order/card validation,
modal close/confirm/focus, duplicate pending/retry, no false payment/persistence,
unmount/account change, load-more va Uzbek date fallback’ni qamraydi.
App.test.tsx eski Testing Library/native DOM uslubida qolgan va lintga to‘liq
mos emas; global lint qoidalari o‘chirilmadi, test kutubxonasi migratsiyasi
qilinmadi. Oldingi React/test-library deprecation warning’lari ham qolgan.

Haqiqiy to‘lov, hosted/tokenized provider, server-side payment idempotency va
verified payment callback yo‘q; bular namoyish sifatida tekshirilmagan yoki
tayyor deb ko‘rsatilmaydi. Live charge bajarilmadi. Boshqa brauzerlar va to‘liq
screen-reader auditi tekshirilmadi. Eski production inventar kontenti va uning
legacy SPORT_CAR qiymati ushbu redesign’da o‘zgartirilmadi. Normal frontend
3001/backend 3004 konfiguratsiyasi va avvalgi xavfsizlik tuzatishlari saqlandi.

QA yakunida hisobdan chiqildi, agent tabi yopildi va viewport override tiklandi.
Vaqtinchalik 3010/3014/3015 serverlar va MongoDB replica set to‘xtatildi;
preview bazasi hamda upload nusxalari o‘chirildi. Oddiy frontend **3001** va API
**3004** ishlashda qoldi. Karta qiymatlari saqlangan screenshot yoki hisobot
artefakti yaratilmagan; mavjud `.env`lar va production yozuvlari o‘zgarmagan.

## Shaxsiy profil redesign — 2026-10-19

### O‘zgargan sahifa va tasdiqlangan API shartnomasi

Biriktirilgan profil maketiga mos `/member-page` sahifasi yaratildi: ivory fon,
oq tahrirlash va preview kartalari, oltin aksent, serif sarlavhalar, avtomobil
suratli charcoal yordamchi blok va pastki yordam tasmasi. Mavjud umumiy header,
footer, `/orders` va `/help` yo‘llari saqlandi. Boshqa sahifalar qayta ishlab
chiqilmadi, dependency yoki `.env` o‘zgartirilmadi. Tegishli AGENTS.md topilmadi.

Asosiy kod: `src/app/screens/userPage/index.tsx`, `Settings.tsx`,
`profileValidation.ts`, `src/css/userPage.css`. Regressionlar:
`Profile.behavior.test.tsx`, `src/app/services/MemberService.test.ts`, mavjud
`src/app/App.test.tsx` profil testlari.

Backendning `member-input.ts`, `Member.service.ts`, `Member.model.ts`,
`profile-image-upload.ts`, member controller/router va frontend MemberService,
ContextProvider tekshirildi. Backendga kod o‘zgarishi kerak bo‘lmadi.

- Faqat nick/telefon majburiy; manzil/tavsif ixtiyoriy. Eski formaning bo‘sh
  manzil/tavsifni rad etishi tuzatildi. Har matn maydoni API’dagi 2000 belgi bilan
  chegaralangan; maketdagi 500 chegara qo‘llanmagan.
- API telefon uchun regex yoki davlat formatini belgilamagan. `type="tel"`,
  `autocomplete="tel"`, bo‘sh qiymat va uzunlik tekshiruvi ishlatiladi; yangi
  mamlakat yoki raqam uzunligi cheklovi kiritilmagan.
- Rasm chegarasi aniq 5 MiB = 5 242 880 bayt. Client MIME+kengaytma+hajmni,
  mavjud server esa bulardan tashqari fayl imzosini va bitta fayl talabini
  tekshiradi. Server himoyalari saqlandi.
- Draft preview, server javobiga asoslangan save, oxirgi saqlangan holatga
  cancel, pending blokirovkasi, inline o‘zbekcha xabarlar va object URL cleanup
  qo‘shildi. Upload xatosida avvalgi saqlangan rasm tiklanadi, matnlar yo‘qolmaydi.
- MemberService’ning mavjud multipart allowlist’i o‘zgarmadi. File bo‘lmagan
  saqlangan/`blob:` yo‘li yuborilmaydi. ID/rol/status/ball/password yuborilmaydi.
  Auth context va `memberData` server javobi bilan sinxronlanadi. Aloqasiz context
  yangilanishi draftni bosib ketmasligi regression bilan tekshirildi.

### Haqiqiy brauzer tekshiruvi

Chrome’da frontend **http://127.0.0.1:3010**, vaqtinchalik API proxy **3014**,
haqiqiy backend **3015** va yangi mahalliy MongoDB `preview` replica set
ishlatildi. Bazada 2 ta faqat QA hisobi yaratildi. Asosiy API’dan 11 ta ochiq
avtomobil yozuvi va rasmlari faqat o‘qilib vaqtinchalik bazaga ko‘chirildi; yangi
inventar o‘ylab topilmadi. Production hisob/mahsulot/buyurtma yozuviga yozilmadi.
Parol/token/cookie qiymatlari log yoki screenshot’ga kiritilmadi.

Brauzer file chooser ruxsati mavjud edi; `setFiles` bilan haqiqiy native input
orqali tanlash ishladi. Brauzer yoki extension ruxsatlari o‘zgartirilmadi.
Bu natijalar faqat HTTP multipart testi asosida chiqarilmagan.

| Brauzerdagi amal | Kuzatilgan natija |
| --- | --- |
| Guest `/member-page`, so‘ng yangi test signup | Profil ko‘rsatilmasdan home’ga o‘tdi; signup 201, profilga kirish ishladi |
| Saqlangan profil, draft preview | Haqiqiy nom; yo‘q manzil/tavsif bo‘sh input va o‘zbekcha fallback; draft ko‘rinishi darhol yangilandi |
| Bekor qilish | Draft manzil va tanlangan rasm oxirgi saqlangan qiymatlarga qaytdi; logout bo‘lmadi |
| Matnli save | `/member/update` 200, server tasdig‘idan keyin muvaffaqiyat xabari |
| PNG va JPEG | Ikkalasi chooser → blob preview → haqiqiy multipart 200 orqali saqlandi; header/preview bir xil server rasmiga o‘tdi |
| Reload, logout, login, yana reload | Session detail 200; JPEG, manzil va tavsif saqlandi; logout 200/home; login 200 |
| TXT va 5 MiB+1 PNG | Aniq o‘zbekcha xabar, oldingi JPEG saqlandi; 0 ta update so‘rovi |
| Bir faylni qayta tanlash | PNG tanlash → cancel → aynan shu faylni qayta tanlash ishladi |
| PNG kengaytmali noto‘g‘ri baytlar | Haqiqiy backend 400; tushunarli o‘zbekcha xabar; oldingi JPEG va yozilgan manzil saqlandi |
| Band nick va band telefon | Har biri haqiqiy backend 400; o‘zbekcha bandlik xabari; draft nomi yo‘qolmadi |
| Bo‘sh nick va telefon | Ikkita inputga bog‘langan xabar, `aria-invalid`/`aria-describedby`; fokus birinchi xato maydoniga o‘tdi |
| Vaqtinchalik POST 503 | Xato va matnlar saqlanib qolgani ko‘rsatildi; oldingi JPEG tiklandi; retry failed faylni qayta yubormasdan 200 bilan ishladi |
| 3 soniyalik POST kechikishi | Save/cancel/inputlar disabled; bitta update so‘rovi; yakunda 200 |
| Bo‘sh manzil va tavsifni saqlash | 200; fallback matnlari ko‘rindi; keyin sinov qiymatlari qayta saqlandi |
| Mobilda 2000 belgi va formatlangan telefon | `2000 / 2000`, haqiqiy save 200; so‘ng qisqa test tavsifi tiklandi |
| Buyurtmalarim/Yordam markazi | Tegishli haqiqiy sahifalar ochildi |
| Klaviatura | Upload input Tab bilan fokuslandi, ko‘rinadigan focus outline bor |

503 va 3 soniyalik kechikish faqat `/tmp`dagi vaqtinchalik QA proxy’da
**POST /member/update** uchun yoqilgan. Ilovaga mock success yoki fault rejimi
qo‘shilmagan, OPTIONS odatdagi backend yo‘lidan o‘tgan. Qolgan API javoblari
haqiqiy backenddan olingan. Yakuniy logda profile update: **8×200, 3×400,
1×503**; boshlang‘ich guest `/member/detail` 401 kutilgan. Signup/login cookie’lari
HttpOnly + SameSite=Lax, secure=false (faqat lokal HTTP sozlamasi), aniq
credentialed CORS origin bilan qaytdi.

Dastlab `localhost:3010` testida bir upload 401 qaytardi, cookie mavjud edi;
anig‘i sabab tasdiqlanmadi. Cookie host bo‘yicha umumiy bo‘lgani uchun asosiy
`localhost` sessiyalaridan ajratilgan `127.0.0.1` muhitiga o‘tildi. Yuqoridagi
barcha yakuniy oqimlar shu alohida hostda o‘tdi; auth himoyasi susaytirilmadi.

Yakuniy DB o‘qishida test profilidagi nom/telefon/manzil/tavsif va JPEG yo‘li UI’ga
mos, haqiqiy fayl mavjud va JPEG imzosi to‘g‘ri: barcha tekshiruvlar true.
`memberType=USER`, `memberStatus=ACTIVE`, `memberPoints=0`; 2 ta muvaffaqiyatli
rasm fayli mavjud. Soxta fayl saqlanmagan.

### Responsiv va vizual natijalar

Browser zoom o‘zgartirilmagan; viewport override actual DOM `innerWidth` bo‘yicha
kalibrlangan. **390, 768, 1280, 1440 × 900 CSS px** o‘lchandi:

- To‘rttalasida horizontal overflow yo‘q, buzilgan `<img>` yo‘q.
- 1280/1440 da asosiy 2 ustun; 768 da form yuqorida, preview/helper yonma-yon;
  390 da hammasi bir ustun va telefon/manzil alohida qatorga o‘tadi.
- Upload va action tugmalari kamida 44 px; mobil save/cancel to‘liq kenglikda.
- Desktop va mobil rasmlar vizual ko‘rib chiqildi; mavjud avtomobil asseti
  yordamchi panelda ishlatildi, maket sahifa rasmi sifatida qo‘yilmadi.
- Yakuniy Chrome Console `error`/`warn` loglari bo‘sh. Network’dagi ataylab
  sinovdan o‘tkazilgan 400/503 va guest 401 yashirilmagan; odatiy assetlarda
  4xx/5xx kuzatilmadi.

Artefaktlar (faqat test ma’lumotlari):
[desktop to‘liq](profile-desktop.jpg), [desktop yuqori](profile-desktop-top.jpg),
[mobil yuqori](profile-mobile.jpg), [mobil to‘liq](profile-mobile-full.jpg),
[tuzilmali natijalar va maxfiy qiymatlarsiz network](profile-browser-results.json).

### Avtomatik tekshiruvlar va chegaralar

- Frontend Jest: **51/51**, 7 suite (oldingi 43 + 8 yangi); mavjud App profili
  testlari yangi UI va context/header/localStorage sinxronlashiga moslashtirildi.
- Backend: **19/19**; mavjud security/order/upload regressiyalari alohida test
  ma’lumotlarida o‘tdi. Backend production build test buyrug‘ida o‘tdi.
- Frontend `tsc --noEmit --incremental false`: o‘tdi.
- Yangi profil TS/TSX va MemberService regression fayliga targeted ESLint:
  **0 error, 0 warning**.
- Frontend browser-QA build va odatiy `.env` bilan production build: o‘tdi.
- `git diff --check`: o‘tdi.
- Eski `App.test.tsx` to‘liq lint’i avvaldan qolgan **95 ta** Testing Library
  uslubi xatosi sabab toza emas; global qoidalar o‘chirilmagan yoki kutubxona yangilanmagan.
  React 18 bilan eski Testing Library deprecation warning’lari ham bor.

Faqat Chrome va emulyatsiya qilingan viewportlar tekshirildi; haqiqiy mobil
qurilma, boshqa brauzer va to‘liq screen-reader auditi bajarilmadi. Context refresh
va protected payload regressiyalari kod testlari bilan tekshirildi, brauzerda
sun’iy rol/status/ball yuborish amali bajarilmadi. To‘lov va kontakt provayderlari
qo‘shilmagan; ularning ishlashi da’vo qilinmaydi. Asosiy 3001/3004 ilovasida real
hisob yoki production profilga yozish bajarilmadi.

QA yakunida test hisobidan chiqildi, agent tabi yopildi, vaqtinchalik viewport
bekor qilindi. 3010/3014/3015 va QA MongoDB to‘xtatildi; test baza/rasm katalogi
o‘chirilgani tekshirildi. Oddiy frontend **3001**, backend **3004** ishlashda
qoldi. Brauzer parol saqlash taklifi qabul qilinmagan, maxfiy qiymatlar hisobotga
qo‘shilmagan. Mavjud foydalanuvchi tablari yopilmagan.
