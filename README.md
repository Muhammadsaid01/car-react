# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) TS template.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
For the paired local setup use `npm run start:local` and open [http://localhost:3001](http://localhost:3001). Plain `npm start` may offer another port when 3000 is occupied.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## LuxAvto configuration and verification

Run `npm run start:local` in **both** this frontend and the sibling `Mod1`
project (two terminals). The local preset pairs frontend `http://localhost:3001`
with API `http://localhost:3004`. Port 3000 is currently occupied by another
service. The frontend preset sets `PORT=3001`; the backend preset sets only
`FRONTEND_ORIGIN=http://localhost:3001` at runtime. Neither overwrites `.env`.
The existing frontend API setting is `REACT_APP_API_URL=http://localhost:3004`.
Backend `PORT=3004`, `MONGO_URL`, `SECRET_TOKEN`, and `SESSION_SECRET` must already
be configured; never paste secret values into logs or screenshots.

Do not accept CRA's offer to switch to a different port while using this preset.
If 3001 is busy, use the existing LuxAvto instance or stop that instance before
starting another. To intentionally use a different port, start the frontend
with `PORT=<port> npm start` and the API with
`FRONTEND_ORIGIN=http://localhost:<port> npm run start:dev`. The origin must match
exactly, including scheme, hostname and port. Keep `localhost` on both sides for
local SameSite=Lax cookies; do not mix it with `127.0.0.1`.

CRA embeds `REACT_APP_API_URL` at startup/build time. After changing it, restart
the dev server, or rebuild and reload a static build. Backend environment
changes require restarting the API. If requests fail with
`ERR_INTERNET_DISCONNECTED`, check Chrome DevTools Network throttling is
**No throttling**, rather than **Offline**. A product request returning 200
with `Access-Control-Allow-Origin` for a different port still fails in a browser;
this is not an empty inventory response. A genuine empty response is JSON `[]`
with `X-Total-Count: 0` and matching CORS headers.
Authentication uses an HttpOnly API cookie; session restoration calls
`GET /member/detail` and does not trust localStorage as authentication.
See the backend README for HTTPS cookie settings and MongoDB replica-set requirements.

Checks: `./node_modules/.bin/tsc --noEmit --incremental false`,
`CI=true npm test -- --watchAll=false --runInBand`, and `npm run build`.
Set `BUILD_PATH` to a temporary directory to keep an existing build unchanged.
The Jest setup transforms real Swiper ESM modules and stubs only Swiper CSS;
MUI/Swiper media-query APIs are supplied for jsdom.

Yarn resolutions keep React/React DOM types on the existing React 18 versions,
including transitive router/testing-library imports. Runtime packages were not
upgraded. Use `yarn install --frozen-lockfile` for a reproducible install.
The TypeScript build worker is allocated 4096 MB to avoid CRA's 2048 MB heap limit.
The older test/UI libraries may still emit React deprecation/peer warnings.

Payment remains a status-confirmation flow without a payment provider.
The Help contact form has no contact service yet.

The running-browser verification and its limitations are recorded in
[docs/qa/verification.md](docs/qa/verification.md), with viewport measurements
and screenshots. The sibling backend README includes tested macOS foreground
MongoDB replica-set startup instructions and explicit hostname/origin settings.

### Bosh sahifa kontenti

Tasdiqlangan kontakt va ijtimoiy tarmoq manzillarini `src/lib/data/siteContent.ts`
fayliga kiriting. Hozir ular aniq belgilangan bo‘sh qiymatlar; namuna telefon yoki
email ishlatilmaydi. `src/lib/data/plans.ts` kartalari mavjud katalog/yordam
sahifalariga bog‘langan ma’lumot kontentidir. Bosh sahifa tasvirlari va promptlar:
[docs/qa/homepage-assets.md](docs/qa/homepage-assets.md). Oxirgi brauzer va build
natijalari [verification.md](docs/qa/verification.md) faylining redesign bo‘limida.

### Katalog

`/products` qidiruv, bitta kuzov turi, saralash va sahifani URL’da saqlaydi;
bir sahifada 6 ta mahsulot. API `X-Total-Count` ni qaytarishi va CORS orqali
expose qilishi kerak. Narx oralig‘i/kategoriya count endpointi mavjud emasligi
sabab ular uchun soxta boshqaruvlar chiqarilmaydi.

Haqiqiy showroom manzili tasdiqlangach `src/lib/data/siteContent.ts` ichidagi
`siteContact.address` va `siteLocation` URLlarini kiriting. Eski restoran
xaritasi showroom sifatida ishlatilmaydi. To‘rtta original video source’i
saqlandi; posterlar shu videolarning kadrlaridir. [Video metadata](docs/qa/catalog-media.json)
va [katalog QA natijalari](docs/qa/verification.md) mavjud.

### Buyurtmalar va to‘lov namoyishi

`/orders` autentifikatsiya bilan himoyalangan. Holat tablari PENDING → Kutilmoqda,
PROCESS → Jarayonda, FINISH → Yakunlangan. Buyurtmani tasdiqlash PENDING’dan
PROCESS’ga, bekor qilish PENDING’dan DELETE’ga, yakunlash PROCESS’dan FINISH’ga
mavjud API orqali o‘tadi. Bu amallar to‘lovdan alohida tasdiq oynasini ochadi.
Har buyurtmaning barcha mahsulotlari va API’dagi orderTotal ko‘rsatiladi;
buyurtmalar sahifalab yuklanadi, keyingi sahifa xatosida oldingi ro‘yxat saqlanadi.

Haqiqiy to‘lov provayderi hali ulanmagan. Karta paneli faqat sinov ma’lumotlari
uchun lokal namoyish: avval buyurtmani tanlash kerak. Karta qiymatlari faqat
PaymentPanel komponenti xotirasida turadi, saqlanmaydi yoki serverga yuborilmaydi.
Tasdiqlangan namoyish muvaffaqiyatli to‘lovni taqlid qilmaydi, buyurtmani yoki
ballarni o‘zgartirmaydi va karta maydonlarini tozalaydi. Komponentdan chiqish,
buyurtmani almashtirish va hisob almashishi ham shu xotirani tozalaydi.
Haqiqiy to‘lov uchun alohida hosted/tokenized provider va server tasdiqlashi
kerak; bu redesign’da bunday integratsiya qo‘shilmadi.

### Shaxsiy profil

`/member-page` sahifasi server tasdiqlagan sessiyani talab qiladi. Forma faqat
`memberNick`, `memberPhone`, `memberAddress`, `memberDesc` va tanlangan haqiqiy
rasm faylini mavjud multipart `/member/update` API’ga yuboradi. Manzil va tavsif
bo‘sh bo‘lishi mumkin; barcha matn maydonlari API’dagi **2000 belgi** chegarasiga
mos. Telefon uchun davlat kodi yoki yangi format cheklovi qo‘shilmagan: amaldagi
API bo‘sh bo‘lmagan satrni qabul qiladi, input esa `tel` turida.

Rasm JPEG/JPG/PNG, MIME va kengaytmasi mos, hajmi **5 MiB (5 242 880 bayt)**
yoki kichik bo‘lishi kerak. Server format, fayl imzosi va hajmni mustaqil
tekshiradi. Oldindan ko‘rish vaqtinchalik; saqlash xatosida avvalgi rasm qaytadi,
matnlar formada qoladi. “Bekor qilish” oxirgi saqlangan holatni tiklaydi.
Brauzer va regressiya natijalari: [verification.md](docs/qa/verification.md).

Mahalliy brauzer QA’sida asosiy `localhost` sessiyasi bilan cookie to‘qnashmasligi
uchun vaqtinchalik frontend/API’ni bir xil **127.0.0.1** hostname’da ishga tushirish
mumkin. Frontend `REACT_APP_API_URL` va backend `FRONTEND_ORIGIN` o‘sha originlarga
mos bo‘lishi kerak; frontend env o‘zgarsa qayta ishga tushirish/build zarur.
Cookie’lar port bo‘yicha ajratilmaydi. Bu QA tavsiyasi odatiy 3001/3004 startup
buyruqlarini almashtirmaydi.
