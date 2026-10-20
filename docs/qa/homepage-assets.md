# LuxAvto bosh sahifa tasvirlari

To‘rtta alohida illustrativ avtomobil fotosurati built-in `imagegen` bilan yaratildi.
Ular haqiqiy inventar yoki dilerlik manzilini tasdiqlamaydi. Production kartalar
har doim API’dan kelgan rasm, nom, narx va metadatani ishlatadi. QA rasmlarida
ko‘rinadigan `QA Sedan`/`QA Sport` yozuvlari faqat vaqtinchalik baza fixture’lari.

Project fayllari JPEG sifatida optimallashtirildi:

- `public/assets/luxavto/hero.jpg` — hero va kontakt banneri.
- `public/assets/luxavto/hero-mobile.jpg` — 600 px gacha bo‘lgan hero uchun portrait variant.
- `public/assets/luxavto/video-poster.jpg` — video posteri va ma’lumot kartasi.
- `public/assets/luxavto/editorial.jpg` — salon interyeri ma’lumot kartasi.
- `car-placeholder.svg` va `favicon.svg` — loyiha ichida yozilgan sodda SVGlar.

Asl PNGlar `/Users/a0000/.codex/generated_images/01a14e30-ace7-77e0-a74f-a26220c0c09c/`
katalogida saqlandi. Generation tool built-in; CLI/API fallback ishlatilmadi.

## Yakuniy promptlar

Hero:

> Use case: ads-marketing. Create a standalone photorealistic automotive photograph for a premium Uzbek car catalog website hero, no UI, no words, no watermark. Very wide landscape composition, 3:1 aspect. A silver premium rear-engine sports coupe in front three-quarter view on the RIGHT half of the frame, entire car visible, parked on dark polished stone terrace. On the left generous quiet negative space of distant mountain lake and terrace for website heading overlay. Sunset with warm champagne highlights, charcoal shadows, distant mountains, a modern glass villa at the far right. Refined realistic automotive photography, elegant and cinematic, natural reflections and realistic proportions. Match the mood of the supplied website reference but create original photography, not a screenshot or UI.

Video posteri:

> Use case: ads-marketing. Standalone photorealistic cinematic automotive photograph, ultrawide 3:1 composition for website video banner, no text no UI no watermark. A charcoal black angular premium supercar parked on polished dark stone driveway in front of modern sandstone villa wall illuminated by restrained warm strip lights at blue hour. Entire car visible in right two thirds in front three quarter view, elegant quiet darker negative space at left third for overlaid heading. Champagne highlights, charcoal, subtle warm gold. Realistic luxury automotive editorial photography. Original photograph, not a screenshot or collage.

Interyer:

> Use case: photorealistic-natural. Original luxury automotive editorial photograph for a website informational card, landscape 2:1 aspect, no text, UI, watermark or logos. Close view through the open passenger door of a premium car, exquisite cognac brown leather front seats, precise stitching, warm ivory ambient cabin lighting, subtle black dashboard and brushed metal. Balanced realistic materials and restrained golden sunlight. No people. High quality photographic, natural proportions.

Mobil hero (hero PNG reference sifatida berildi):

> Create a MOBILE WEBSITE HERO photographic variant of the referenced original automotive photograph. Portrait 4:5 image. Preserve the silver premium sports coupe identity, mountain lake sunset, realistic premium photographic style, warm champagne highlights and charcoal atmosphere. Recompose: generous darker quiet sky and distant mountains in the TOP HALF for overlaid website title and buttons. Place the entire car across the LOWER HALF on the stone terrace, front three-quarter view, complete front bumper and rear bumper visible with some breathing room left and right. Car takes about 85% image width. No text, UI, watermark or people. Original photo asset only, not a webpage. Keep details natural and proportions realistic.
