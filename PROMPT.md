# 📱 KAYZEN — Shaxsiy Samaradorlik Web-Ilovasi (Texnik Topshiriq / Prompt)

> **Bu prompt boshqa AI ga (Claude, GPT-5, Gemini, v.b.) berilganda u **bitta urinishda** to'liq ishlaydigan, telefonga o'rnatish mumkin bo'lgan PWA web-ilovani yaratib berishi kerak.**
> Tushunmagan joyni o'zboshimcha o'zgartirma — savol berma, **shu hujjatdagi spetsifikatsiyaga qat'iy amal qil**.

---

## 0. UMUMIY MAQSAD

Telefondan (Android Chrome / iOS Safari) qulay ishlaydigan, **shaxsiy samaradorlik** ilovasini yarating. Foydalanuvchi har kuni:
- Vazifalarini boshqaradi (subtask + status + deadline bilan)
- Kunlik odatlar checklistini belgilab boradi
- Kayzen tahlili (kunlik refleksiya) yozadi
- Statistikasini ko'radi

Ilova **bitta foydalanuvchi uchun**, login yo'q, hamma ma'lumot brauzerda saqlanadi.

---

## 1. TEXNOLOGIK STEK (qat'iy)

- **Bitta `index.html` fayl** — HTML + CSS + JS bitta faylda inline (deploy oson bo'lishi uchun)
- **Vanilla JavaScript** (ES2020+). React/Vue/Svelte/jQuery **ISHLATMA**.
- **CSS**: zamonaviy (Custom Properties, Flexbox, Grid). Tailwind/Bootstrap **kerak emas**.
- Tashqi kutubxonalar: **faqat** Chart.js (statistika uchun) CDN orqali ruxsat etiladi. Boshqa hech nima.
- **localStorage** — barcha ma'lumotlar shu yerda.
- **PWA**:
  - `manifest.json` inline `<link rel="manifest" href="data:application/json;base64,...">` ko'rinishida (alohida fayl talab qilinmasin)
  - Service worker — `<script>`da blob URL orqali ro'yxatga olish (offline ishlash uchun)
- **Til**: Hamma UI matn — **O'zbek tilida lotin yozuvida**.
- **Ikonkalar**: Inline SVG (Lucide / Heroicons stilidagi). Tashqi ikona kutubxonasi kerak emas.

### Deliverable (yetkazilishi kerak)
- Bitta `index.html` fayl — boshqa hech qanday qaramlik yo'q.
- Foydalanuvchi shu faylni telefon brauzerda ochsa — to'liq ishlashi shart.

---

## 2. DIZAYN TIZIMI

### Mavzu
- **Faqat light theme** (yorug', oq fon). Dark mode keyin qo'shilishi mumkin, hozir kerak emas.
- Minimalistik, "Notion-vari" / "Things 3-vari" estetika. Ortiqcha bezak yo'q.

### Rang palitra (CSS variables)
```css
--bg: #FAFAF9;          /* Sahifa foni — issiq oq */
--surface: #FFFFFF;     /* Kartalar foni */
--surface-2: #F4F4F5;   /* Ikkinchi darajali fon */
--border: #E4E4E7;      /* Yengil chegara */
--text: #18181B;        /* Asosiy matn — deyarli qora */
--text-muted: #71717A;  /* Yordamchi matn — kul rang */
--text-light: #A1A1AA;  /* Placeholder, kam muhim */
--accent: #2563EB;      /* Asosiy aksent — ko'k */
--accent-soft: #DBEAFE; /* Ko'k yumshoq fon */
--success: #16A34A;     /* Yashil — bajarildi */
--success-soft: #DCFCE7;
--warning: #F59E0B;     /* Sariq — eslatma */
--danger: #DC2626;      /* Qizil — eng muhim, o'chirish */
--danger-soft: #FEE2E2;
--purple: #8B5CF6;      /* Binafsha — delegated */
--purple-soft: #EDE9FE;
```

### Status ranglari (Vazifalar uchun)
- 🚩 **Eng muhimi** → `--danger` (qizil bayroq ikonkasi + qizil badge)
- ✓ **Bajarilishi kerak** → `--accent` (ko'k badge) — default holat
- 👥 **Boshqaga topshirdim** → `--purple` (binafsha badge)

### Tipografiya
- Font stack: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Roboto", system-ui, sans-serif`
- Asosiy matn: 16px / 1.5 line-height / weight 400
- Karta sarlavhasi: 17px / weight 600
- Sahifa sarlavhasi (H1): 28px / weight 700 / `letter-spacing: -0.02em`
- Yordamchi matn: 14px / weight 400 / color `--text-muted`
- Tugma matni: 15px / weight 500

### Spacing va o'lchamlar
- Padding/margin: 4, 8, 12, 16, 20, 24, 32, 48 (pixelda)
- Border radius: 8px (tugma), 12px (karta), 16px (modal), 999px (badge/dumaloq)
- Tap target: minimum **44×44px** har qanday bosiladigan element
- Sahifa side-padding: 16px (mobil)
- Maksimal kontent kengligi: 480px (desktop ham bir ustun ko'rinishida, markazda)

### Animatsiyalar
- Standart o'tish: `transition: all 200ms ease-out;`
- Modal/sheet kirishi: `transform: translateY(100%) → 0`, 280ms
- Hover effekt: 100ms
- Checkbox bosilganda: kichik scale animatsiya (1 → 0.9 → 1)
- Vazifa bajarilganda: chap chizish + 80% opacity + 200ms keyin pastga siljish
- **Tap haptic**: `navigator.vibrate(8)` har bir checkbox/asosiy tugmada (mobilda)

### Layout — pastki tab navigatsiya
4 ta tab pastda fiksatsiyalangan:
1. 📋 Vazifalar
2. ✅ Chek list
3. 🧘 Kayzen
4. 📊 Statistika

Yuqorida — har bir bo'limga xos sarlavha va kontekstual tugmalar.
O'ng pastda **floating "+" tugmasi** (FAB) — bo'limga qarab kontekstli qo'shish.

---

## 3. BO'LIMLAR — BATAFSIL SPETSIFIKATSIYA

### 3.1. 📋 VAZIFALAR (Tasks)

#### Yuqori panel
- Sarlavha: "Vazifalar"
- Ostida — bugungi sana ("28 May, Payshanba")
- Qidiruv inputi (kichik ikona bilan)

#### "Bugungi 3 ta muhim" (MIT — Most Important Tasks)
- Yuqorida ajralib turuvchi karta (yengil ko'k fon `--accent-soft`)
- Sarlavha: "🎯 Bugungi 3 ta muhim"
- Foydalanuvchi 3 ta vazifani shu yerga pin qila oladi
- Agar bo'sh bo'lsa — "Bugungi eng muhim 3 ta vazifani belgilang" placeholder

#### Filtrlar (chip ko'rinishida, gorizontal scroll)
- Bugun • Ertaga • Bu hafta • Barchasi • Bajarilgan
- Status: Hammasi / 🚩 Muhim / ✓ Bajariladi / 👥 Topshirildi

#### Vazifa kartasi (UI)
```
┌────────────────────────────────────────┐
│  ○   1 soat marketing Deep Work        │
│      🚩 Eng muhimi  ·  📅 14:00       │
│      3/5 subtask  ·  #Marketing        │
└────────────────────────────────────────┘
```
- Chap: katta yumaloq checkbox (28px)
- Markaz: vazifa sarlavhasi (1 qator, ortig'i `...` bilan)
- Ostida: status badge + deadline (agar bor) + subtask progress + kategoriya teg
- Butun karta bosiladi — detal ekranga olib boradi
- Long-press — kontekst menyu (o'chirish, MIT ga qo'shish, duplikat)

#### Vazifa detali (full-screen modal yoki alohida ekran)
Tarkib (yuqoridan pastga):
1. **Sarlavha** — katta input, autofocus
2. **Status tanlash** — 3 ta tugma (rangli):
   - 🚩 Eng muhimi
   - ✓ Bajarilishi kerak
   - 👥 Boshqaga topshirdim
3. **Deadline** — sana + soat tanlash (`<input type="datetime-local">`), tozalash tugmasi bilan
4. **Kategoriya** — dropdown yoki teg input. Foydalanuvchi yangi yarata oladi (`#Marketing`, `#Shaxsiy`, `#Sport`, `#Moliya`, `#AI`...)
5. **Subtasklar** — kichik checkbox + matn satrlari, drag-and-drop tartiblash mumkin, "+ Subtask qo'shish" tugmasi
6. **Izoh** — `textarea`, ko'p qatorli matn
7. **Pomodoro tugmasi** — "🍅 Pomodoro boshlash" (25 daqiqalik fokus taymerini shu vazifa uchun ishga tushiradi)
8. Pastda — "MIT ga qo'shish/olib tashlash", "Arxivlash", "O'chirish" tugmalari (qizil rang)

#### Kontekst misol (foydalanuvchidan)
**Vazifa**: "1 soat marketing bo'yicha Deep Work"
- Status: 🚩 Eng muhimi
- Deadline: bugun 14:00
- Kategoriya: #Marketing
- Subtasklar:
  - ☐ Ads Manager reklamalarini tahlil qilib chiqish
  - ☐ Yangi kreativ takliflar yaratish
  - ☐ Takliflar uchun dizaynlar qilib chiqish
- Izoh: "Asosan video kreativlarga e'tibor berish"

#### "+" FAB tugmasi
- Bosilganda — pastdan kelib chiqadigan bottom-sheet ochiladi:
  - Sarlavha inputi (autofocus, klaviatura avtomatik ochiladi)
  - Status (default: ✓ Bajariladi)
  - Tezkor "deadline: bugun / ertaga / bu hafta" chiplar
  - "Yaratish" tugmasi
- Vazifa darhol ro'yxatda paydo bo'ladi, ortga otish (toast undo bilan)

---

### 3.2. ✅ KUNLIK CHEK LIST

#### Yuqori panel
- Sarlavha: "Chek list"
- Ostida — sana navigatori:
  - `‹ 27 May` **28 May, Payshanba** `29 May ›`
  - Sanani bosilganda — kalendar modali (qaysi kunga o'tish)
- O'ng yuqorida — sozlamalar ⚙️ ikona (habit larni boshqarish)

#### Statistika bo'limi (yuqorida, ikki ustun)
- Chap: dumaloq progress (radial chart) — "9/14 · 64%"
- O'ng: streak — "🔥 12 kun"
- Tushuncha: streak — har kun 100% bajarilgan kunlar ketma-ketligi. Bir kun chala bo'lsa 0 ga tushadi.

#### Habit elementlari ro'yxati
Har bir element — katta tap area karta:
```
┌────────────────────────────────────────┐
│  🌅  Bomdodga turish              ●●●●●●○ │   ← oxirgi 7 kun mini grafik
│                                       ☐  │   ← katta checkbox o'ngda
└────────────────────────────────────────┘
```
- Bosilganda: vibratsiya + checkbox to'lib qoladi (yashil)
- Hamma bajarilganda — engil "🎉" konfetti animatsiyasi (CSS keyframes orqali, 1 marta)

#### Boshlang'ich (default) habit lar — to'liq ro'yxat
Buni **seed data** sifatida birinchi marta ochilganda yarating:

| № | Emoji | Nomi |
|---|-------|------|
| 1 | 🌅 | Bomdodga turish |
| 2 | 📖 | 30 min Diniy kitob |
| 3 | 🧘 | Kayzen vaqt |
| 4 | 📝 | Kunni rejalashtirdim |
| 5 | 💊 | Vitamin ichdim |
| 6 | 💝 | Moddiy ehson qilish |
| 7 | 💰 | Finance report |
| 8 | 📿 | 2000 ta tasbeh |
| 9 | 🏋️ | Trenirovka |
| 10 | 📊 | Hisobotlarni tekshirdim |
| 11 | 🥗 | To'g'ri ovqatlanish |
| 12 | 🤖 | AI bo'yicha dars ko'rdim |
| 13 | 🎯 | Deep Work 1 (2 soat) |
| 14 | 🎯 | Deep Work 2 (2 soat) |

#### Sozlamalar modali (⚙️ bosilganda)
- Habit ro'yxati — drag-and-drop tartiblash
- Har bir qatorda: emoji o'zgartirish, nom tahrir, o'chirish ikonalari
- Pastda: "+ Yangi habit qo'shish" tugmasi

#### O'tgan kunlarni ko'rish
- Sana navigatori orqali har qanday o'tmish kunga o'tish va belgilash mumkin
- Kelajak kunlarga belgilash mumkin emas (bloklangan)

---

### 3.3. 🧘 KAYZEN VAQT JURNALI

#### Yuqori panel
- Sarlavha: "Kayzen tahlili"
- Sana navigatori (chek listdagi kabi)
- O'ng yuqorida — 📚 arxiv ikonkasi (oldingi yozuvlar ro'yxati) + ⚙️ sozlamalar (savollarni boshqarish)

#### Asosiy ekran
- Sarlavha ostida — "Bugun 10 daqiqa ajratib, o'zingizni tahlil qiling" yumshoq tushuntirish
- Har bir savol — alohida katta karta:
```
┌────────────────────────────────────────┐
│  Kecha samaradorliging qanday bo'ldi?  │
│                                        │
│  ┌────────────────────────────────┐   │
│  │ Javobingizni shu yerga yozing  │   │
│  │ ...                            │   │
│  │                                │   │
│  └────────────────────────────────┘   │
└────────────────────────────────────────┘
```
- `textarea` avtomatik o'lchamga moslashadi (qator ortgani sari ham o'sib boradi)
- **Saqlash tugmasi YO'Q** — har bir o'zgarish 500ms debounce bilan avtomatik saqlanadi
- Pastki o'ng burchakda kichik "✓ Saqlandi" indikator paydo bo'lib yo'qoladi

#### Boshlang'ich (default) savollar — to'liq ro'yxat
Seed data sifatida birinchi marta ochilganda yarating:

| № | Savol |
|---|-------|
| 1 | Kecha samaradorliging qanday bo'ldi? |
| 2 | G'alabalar kundaligi — kechagi g'alabalaringni yozing |
| 3 | Eng katta xavf nima va qanday oldini olaman? |
| 4 | Arzon va sifatli dofamin holati qanday? |
| 5 | Qanday qilib daromadni oshirish mumkin? |
| 6 | Qanday qarzdan tezroq chiqaman? |

#### Sozlamalar modali (⚙️)
- Savollar ro'yxati — drag-and-drop tartiblash
- Har birini tahrir, o'chirish
- "+ Yangi savol qo'shish" tugmasi
- "Savolni o'chirsam, eski javoblar nima bo'ladi?" — javoblar saqlanib qoladi, lekin ko'rsatilmaydi (xavfsiz)

#### Arxiv (📚)
- Sana bo'yicha tartiblangan ro'yxat — har bir karta:
  - Sana
  - Birinchi savolning javobidan 100 ta belgi preview
  - Bosilganda — to'liq yozuvga o'tadi (read-only, tahrir tugmasi bilan)
- Kalendar ko'rinishi (kichik) — qaysi kunlar yozilgan (nuqta bilan belgilangan)

---

### 3.4. 📊 STATISTIKA

#### Bo'limlar
1. **Bugungi xulosa**
   - Chek list: X/14 (Y%)
   - Vazifalar: bajarilgan Z ta / jami W ta
   - Pomodoro: bugungi fokus daqiqalari
   - Kayzen yozilganmi? ✓/✗

2. **Haftalik statistika** (oxirgi 7 kun)
   - Stacked bar chart: kunlik checklist bajarilish foizi (Chart.js bilan)
   - Bajarilgan vazifalar — sodda chiziqli grafik

3. **Oylik heatmap**
   - GitHub-style yashil heatmap — har bir kun katakcha
   - To'yinganligi: bajarilgan habit foiziga proportional
   - Bosilganda — o'sha kun chek listga o'tadi

4. **Habit darajalari** (har bir habit alohida)
   - Habit nomi
   - Oxirgi 30 kunda necha foiz bajarilgan (progress bar)
   - Eng uzun streak
   - Joriy streak

5. **Yutuqlar (achievements) — kelajak versiya uchun joy qoldiring**
   - 7 kun ketma-ket 100% — "Birinchi hafta" badge
   - 30 kun streak — "Mustahkam odat"
   - 100 ta vazifa bajardim
   - (Hozircha faqat 3 ta default badge, vizual)

---

## 4. QO'SHIMCHA MODULLAR

### 4.1. 🍅 Pomodoro taymer
- **Kirish**: yuqori o'ng burchakda doimo ko'rinadigan ikonka (har qanday bo'limdan)
- Bosilganda — to'liq ekran taymer ochiladi
- Standart sozlama: 25 min ish / 5 min dam / har 4 sessiyadan keyin 15 min uzoq dam
- Sozlamalarni o'zgartirish mumkin (sozlamalar modali ichida)
- Vazifa bilan bog'lash mumkin (ixtiyoriy dropdown)
- Tugaganda: ovoz signal (Web Audio API bilan oddiy "ding" tone), brauzer notification, `vibrate([200,100,200])`
- Sessiya tugagach — statistikaga `pomodoro.sessions` ga yoziladi
- Vazifa detalidagi "🍅 Pomodoro boshlash" tugmasi ham shu modalni shu vazifa bilan ochadi

### 4.2. 🔔 Notifikatsiyalar
- Sayt ilk ochilganda — yumshoq ravishda ruxsat so'raydi (banner ko'rinishida: "Eslatmalarni yoqamizmi?")
- Deadline yaqinlashganda — 1 soat oldin va aniq vaqtda
- Pomodoro tugaganda
- iOS Safari da PWA ga o'rnatilgandan keyingina notifikatsiyalar ishlaydi — bu cheklov, ogohlantirish ko'rsating

### 4.3. 💾 Eksport / Import
- Sozlamalar bo'limida 2 ta tugma:
  - **Eksport** — `kayzen-backup-2026-05-28.json` yuklab oladi
  - **Import** — JSON faylni yuklab, tasdiqlash so'rab (eski ma'lumotlar ustiga yozilishi haqida) qaytaradi
- Avtomatik eslatma: har 14 kunda bir marta "Backup yuklab olish vaqti keldi" banner

### 4.4. 📲 PWA o'rnatish
- `manifest.json`:
  ```json
  {
    "name": "Kayzen — Samaradorlik",
    "short_name": "Kayzen",
    "start_url": ".",
    "display": "standalone",
    "background_color": "#FAFAF9",
    "theme_color": "#FAFAF9",
    "icons": [
      { "src": "data:image/svg+xml;base64,...", "sizes": "192x192", "type": "image/svg+xml" },
      { "src": "data:image/svg+xml;base64,...", "sizes": "512x512", "type": "image/svg+xml" }
    ]
  }
  ```
- Ikonalar — oddiy SVG: oq fonda ko'k "✓" belgisi (Kayzen brendi)
- Service worker — barcha resurslarni keshlaydi, offline ishlaydi
- iOS Safari uchun ilk kirgan foydalanuvchiga "Bosh ekranga qo'shish" yo'riqnomasi (kichik bir martalik banner, "Tushundim" tugmasi bilan)

---

## 5. MA'LUMOTLAR MODELI (localStorage)

**Bitta kalit**: `kayzen-app-data`

**To'liq sxema**:
```json
{
  "version": 1,
  "tasks": [
    {
      "id": "uuid-v4-string",
      "title": "1 soat marketing Deep Work",
      "status": "important",  // "important" | "todo" | "delegated"
      "completed": false,
      "category": "Marketing",
      "deadline": "2026-05-28T14:00:00",  // local ISO, yoki null
      "notes": "Video kreativlarga e'tibor",
      "subtasks": [
        { "id": "uuid", "title": "Ads Manager tahlil", "done": false },
        { "id": "uuid", "title": "Yangi kreativ takliflar", "done": false }
      ],
      "isMIT": true,
      "mitDate": "2026-05-28",  // qachon MIT ga belgilangan, faqat o'sha kun MIT ko'rinadi
      "createdAt": "2026-05-28T09:00:00",
      "completedAt": null,
      "pomodoroCount": 0,
      "archived": false
    }
  ],
  "checklist": {
    "items": [
      { "id": "uuid", "emoji": "🌅", "name": "Bomdodga turish", "order": 0 }
      // ... 14 ta default item
    ],
    "days": {
      "2026-05-28": { "item-id-1": true, "item-id-2": false }
      // har bir kun uchun item ID → bajarildi bool
    }
  },
  "kayzen": {
    "questions": [
      { "id": "uuid", "text": "Kecha samaradorliging qanday bo'ldi?", "order": 0 }
      // ... 6 ta default savol
    ],
    "entries": {
      "2026-05-28": {
        "question-id-1": "Yaxshi o'tdi, lekin..."
      }
    }
  },
  "categories": ["Marketing", "Shaxsiy", "Sport", "Moliya", "AI"],
  "pomodoro": {
    "workMin": 25,
    "shortBreakMin": 5,
    "longBreakMin": 15,
    "sessions": [
      { "date": "2026-05-28", "minutes": 25, "taskId": "uuid-or-null", "completedAt": "ISO" }
    ]
  },
  "settings": {
    "theme": "light",
    "notificationsEnabled": false,
    "lastBackupAt": null,
    "firstRunCompleted": true
  }
}
```

### Sana kalitlari
- Hamma sana kalitlari: `YYYY-MM-DD` (mahalliy vaqt zonasiga ko'ra, UTC emas)
- Yordamchi funksiya: `function todayKey() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); }`

### UUID
- `crypto.randomUUID()` ishlatish (modern brauzerlarda mavjud)

### Migration / Versiyalash
- Birinchi marta ochilganda — `version: 1` bilan default seed data yaratiladi
- Versiya o'zgarsa — migration funksiyasi (kelajakda)

---

## 6. UX TALABLARI

### Performance
- Ilk yuklanish: **1 soniyadan kam** (bo'sh ma'lumot bilan)
- Har qanday tap — 100ms ichida vizual feedback
- Hech qanday "Saqlash" tugmasi YO'Q — barcha o'zgarish darhol localStorage'ga yoziladi (atom yozish)

### Empty states (bo'sh holatlar)
- **Vazifalar bo'sh**: katta 🎯 ikonka + "Hozircha vazifa yo'q. Birinchisini qo'shing!"
- **Chek list bo'sh kun**: oddiy ro'yxat, bajarilmagan elementlar
- **Kayzen yozilmagan**: "Bugungi tahlilingizni yozing — 10 daqiqa o'zingizga ajrating"
- **Statistika ma'lumot yo'q**: "Ma'lumot to'planmoqda. Kamida 3 kun foydalanishdan keyin grafiklar paydo bo'ladi"

### Undo (bekor qilish)
- Vazifa o'chirilganda — pastda 5 soniyalik toast: "Vazifa o'chirildi · BEKOR QILISH"
- Subtask o'chirilganda — undo
- Habit o'chirilganda — undo (ma'lumotlari ham qaytariladi)

### Tasodifiy aloqasizlik
- Ma'lumot localStorage'da, internet kerak emas — har doim ishlaydi

### Klaviatura
- Vazifa qo'shish modali ochilganda — input avtofokus
- Enter — saqlash
- Escape — yopish

### Accessibility (A11y)
- Hamma tugmalarda `aria-label`
- Fokus halqasi (`:focus-visible`) ko'rinarli
- Rang kontrasti WCAG AA darajada
- `prefers-reduced-motion` qo'llab-quvvatlash (animatsiyalarni o'chirib qo'yish)

---

## 7. KOD SIFATI

- **Modullik**: JS kodi mantiqiy bloklarda — `// === TASKS ===`, `// === CHECKLIST ===`, `// === KAYZEN ===`, `// === STATS ===`, `// === POMODORO ===`, `// === STORAGE ===`, `// === UI HELPERS ===`
- **Sof funksiyalar**: ma'lumotni o'zgartiruvchi funksiyalar yangi state qaytarsin (immutable yondashuv)
- **State management**: bitta global `state` ob'ekti, har o'zgarishdan keyin `saveState()` chaqiriladi va kerakli komponent re-render qilinadi
- **DOM**: `document.createElement` bilan ehtiyotkorlik bilan yarating, yoki `template literal + innerHTML`. XSS dan ehtiyot bo'ling — foydalanuvchi kiritgan matnni `textContent` orqali joylashtiring.
- **Izohlar**: asosiy funksiyalarda 1-2 qator izoh
- **Lint**: `var` yo'q, `const`/`let` ishlating. `===` ishlating. `async/await`.

---

## 8. SEED DATA (birinchi marta ochilganda)

Brauzer birinchi marta ochsa va `localStorage['kayzen-app-data']` bo'sh bo'lsa:
1. 14 ta default habit yaratiladi (yuqoridagi jadval)
2. 6 ta default kayzen savol yaratiladi (yuqoridagi jadval)
3. 5 ta default kategoriya yaratiladi: `["Marketing", "Shaxsiy", "Sport", "Moliya", "AI"]`
4. Vazifalar — bo'sh
5. Bir martalik onboarding banner: "Xush kelibsiz! Bu sizning shaxsiy samaradorlik ilovangiz" + "Boshlash" tugmasi

---

## 9. TEST SSENARIYLARI (qil va tekshir)

Ilova yaratilgandan keyin **shu test ssenariylar ishlashi shart**:

1. ✅ Yangi vazifa qo'shish → ro'yxatda paydo bo'ladi
2. ✅ Vazifaga 3 ta subtask qo'shish → hammasini belgilash → asosiy vazifa avtomatik bajariladi (yo'q, alohida — foydalanuvchi qo'lda belgilashi kerak)
3. ✅ Status "Eng muhimi" ga o'zgartirish → qizil badge ko'rinadi
4. ✅ Deadline qo'shish (bugun 14:00) → vazifada vaqt ko'rinadi
5. ✅ MIT ga qo'shish → yuqori blokda paydo bo'ladi
6. ✅ Chek listda bugun bir nechta odatni belgilash → progress va streak yangilanadi
7. ✅ Kayzen javobini yozish → 1 soniyadan keyin avtomatik saqlanadi → sahifani yangilash → matn saqlangan
8. ✅ Statistika sahifasi — bugungi va haftalik ma'lumotlarni ko'rsatadi
9. ✅ Pomodoro 25 daqiqalik taymer ishga tushadi va ovoz beradi
10. ✅ Eksport tugmasi JSON fayl yuklab oladi → uni import qilib qaytarish ishlaydi
11. ✅ Brauzer yopib qaytadan ochilganda — barcha ma'lumotlar joyida
12. ✅ iPhone Safari da "Bosh ekranga qo'shish" orqali ilova sifatida ishlaydi (offline ham)
13. ✅ Tasodifan o'chirilgan vazifa uchun "Bekor qilish" toast ishlaydi
14. ✅ Mobil brauzerda Lighthouse PWA ball: **90+**

---

## 10. QO'SHIMCHA G'OYALAR (kelajak versiyalar uchun joy qoldir)

Birinchi versiyaga shart emas, lekin kod strukturasi shularni qabul qilishga tayyor bo'lsin:
- 🌙 Dark mode (theme toggling)
- 🗣️ Voice-to-text (Web Speech API) — kayzen javoblarini ovoz bilan yozish
- 📅 Kalendar ko'rinishi vazifalar uchun
- 🔁 Takrorlanuvchi vazifalar (har dushanba, har kuni va h.k.)
- 🏆 Achievement system
- 📤 Telegram/Email orqali kunlik xulosani yuborish
- 🤝 Bir nechta qurilmadan kirish (Firebase/Supabase backend keyin qo'shilsa)
- 📈 Eisenhower matritsa ko'rinishi (Important × Urgent quadrants)
- ⏱️ Time blocking (kun jadvalini blok bo'lib rejalashtirish)

---

## 11. YAKUNIY YO'RIQNOMA

1. Bitta `index.html` fayl yarating — HTML, CSS, JS hammasi ichida
2. Yuqoridagi sxemaga 100% amal qiling
3. Hamma matn O'zbek tilida (lotin)
4. Hech qanday "TODO" yoki "tomorrow I will add" qoldirmang — to'liq ishlovchi versiya bering
5. Kodda qisqa, lekin foydali izohlar
6. Yakuniy fayl hajmi 200KB dan oshmasin (Chart.js CDN orqali alohida yuklanadi)
7. Foydalanish bo'yicha qisqa README ham qo'shing (HTML pastida `<!-- README --> ` izohi sifatida)

---

## 12. "FOYDALI BO'LSIN" PRINSIPI

Bu ilovaning maqsadi — foydalanuvchi har kuni 5–10 daqiqa ichida samaradorligini boshqarishi. Shuning uchun:
- **Tezlik**: har bir bosilish minimal qadam bilan natija beradi
- **Aniqlik**: har bir ekran "bu yerda nimani qilish kerak"ni darhol tushuntiradi
- **Motivatsiya**: streak, progress doiralari, kichik 🎉 animatsiyalari — dofamin omillari
- **Refleksiya**: kayzen jurnali kuniga 10 daqiqa ichki nutq uchun
- **Fokus**: MIT (3 ta muhim) — bir kunda kuchni 3 ta narsaga jamlash
- **Halollik**: streak buzilgan kun — ko'rsatiladi (yashirin emas), bu mas'uliyat hissi

---

**Tayyor bo'lsang — boshla. Bitta urinishda to'liq yakunlangan, ishlovchi `index.html` fayl ber.**
