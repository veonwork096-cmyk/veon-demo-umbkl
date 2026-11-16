// Facts for the homepage — only from veon/client.json (company.*, C-xxx). Nothing invented.
// Phone display keeps the client's own format; `tel` is the E.164 form.

export interface Phone {
  label: string;
  display: string;
  tel: string;
}

export interface Place {
  /** what this address is (shown above it) */
  label?: string;
  /** address as written by the client */
  address: string;
  /** search string for the map link */
  map: string;
}

export interface Unit {
  id: string;
  name: string;
  short: string;
  forWhom: string;
  places: Place[];
  phones: Phone[];
  hours?: string;
}

const city = "Ужгород";
export const mapUrl = (q: string): string =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export const clinic = {
  name: "Ужгородська міська багатопрофільна клінічна лікарня",
  shortName: "УМБКЛ",
  legalName:
    "Комунальне некомерційне підприємство «Ужгородська міська багатопрофільна клінічна лікарня» Ужгородської міської ради",
  formerName: "Центральна міська клінічна лікарня",
  motto: "не лише необхідна допомога, а й добра порада, душевне тепло і комфортні умови",
  email: "office@umbkl.com",
  facebook: "https://www.facebook.com/hospitaluzh",
  instagram: "https://www.instagram.com/hospital_uzh/",
  health24: "https://h24.ua/",
  tariffOrder: "наказ від 14.09.2026 № 421-о",
};

/** Registry of planned treatment: phone booking Mon–Fri 13:00–16:00 (Europe/Kyiv). */
export const registry = {
  main: { label: "Реєстратура", display: "(0312) 66-20-96", tel: "+380312662096" } as Phone,
  mobile: { label: "Реєстратура, мобільний", display: "(095) 753-08-34", tel: "+380957530834" } as Phone,
  hours: "пн–пт 13:00–16:00",
  hoursShort: "пн–пт 13–16",
  open: { from: 13, to: 16, days: [1, 2, 3, 4, 5] },
};

export const reception: Phone = { label: "Приймальня", display: "(0312) 64-72-11", tel: "+380312647211" };

export const ct = {
  viberDisplay: "+38 063 810 88 70",
  viberHref: "viber://chat?number=%2B380638108870",
  phone: { label: "Запис на КТ", display: "+38 095 753 08 34", tel: "+380957530834" } as Phone,
};

export const units: Unit[] = [
  {
    id: "nevidkladni",
    name: "Клінічна лікарня з невідкладних станів та екстреної медичної допомоги",
    short: "Лікарня невідкладних станів",
    forWhom: "Екстрена допомога дітям і дорослим",
    hours: "цілодобово",
    places: [
      { address: "вул. Коршинського (колишня Грибоєдова), 20", map: `вул. Коршинського, 20, ${city}` },
    ],
    phones: [
      { label: "Приймальне відділення", display: "(050) 302-91-39", tel: "+380503029139" },
      { label: "Поліклінічне відділення", display: "(0312) 64-24-69", tel: "+380312642469" },
      { label: "Попередній запис", display: "(0312) 64-20-80", tel: "+380312642080" },
      { label: "Попередній запис, мобільний", display: "(099) 614-19-87", tel: "+380996141987" },
      { label: "Запис на КТ", display: "+38 099 800 13 34", tel: "+380998001334" },
    ],
  },
  {
    id: "planove",
    name: "Клінічна лікарня планового лікування",
    short: "Лікарня планового лікування",
    forWhom:
      "Терапія, хірургія, кардіологія, ортопедія та травматологія, неврологія, поліклініка",
    places: [{ address: "вул. Минайська, 71", map: `вул. Минайська, 71, ${city}` }],
    phones: [
      { label: "Реєстратура (запис 13:00–16:00, пн–пт)", display: "(0312) 66-20-96", tel: "+380312662096" },
      { label: "Реєстратура, мобільний", display: "(095) 753-08-34", tel: "+380957530834" },
      { label: "Приймальне відділення", display: "(0312) 66-22-22", tel: "+380312662222" },
    ],
  },
  {
    id: "dytiacha",
    name: "Клінічна дитяча лікарня",
    short: "Дитяча лікарня",
    forWhom: "Відокремлений підрозділ: приймальне й поліклінічне відділення на різних вулицях",
    places: [
      { label: "Приймальне відділення", address: "вул. Бращайків, 6", map: `вул. Бращайків, 6, ${city}` },
      { label: "Поліклінічне відділення", address: "вул. Гошовського, 2", map: `вул. Гошовського, 2, ${city}` },
    ],
    phones: [
      { label: "Приймальне відділення", display: "(075) 102-19-06", tel: "+380751021906" },
      { label: "Поліклінічне відділення", display: "(075) 102-19-05", tel: "+380751021905" },
      { label: "Поліклінічне відділення", display: "(075) 102-19-04", tel: "+380751021904" },
    ],
  },
  {
    id: "perynatalnyi",
    name: "Клінічний перинатальний центр",
    short: "Перинатальний центр",
    forWhom: "Вагітність і пологи; дві жіночі консультації в місті",
    places: [
      { label: "Перинатальний центр", address: "вул. Коршинського (колишня Грибоєдова), 20Б", map: `вул. Коршинського, 20Б, ${city}` },
      { label: "Жіноча консультація", address: "вул. Другетів, 79", map: `вул. Другетів, 79, ${city}` },
      { label: "Жіноча консультація", address: "вул. Героїв 128-ї бригади, 30", map: `вул. Героїв 128-ї бригади, 30, ${city}` },
    ],
    phones: [
      { label: "Приймальне відділення", display: "(0312) 64-70-67", tel: "+380312647067" },
      { label: "Приймальня медичного директора", display: "(0312) 64-72-81", tel: "+380312647281" },
      { label: "Жіноча консультація, вул. Другетів", display: "(095) 490-26-76", tel: "+380954902676" },
      { label: "Жіноча консультація, вул. Героїв 128-ї бригади", display: "(066) 905-65-58", tel: "+380669056558" },
    ],
  },
  {
    id: "ekspertna",
    name: "Експертна команда з оцінювання повсякденного функціонування особи",
    short: "Експертна команда",
    forWhom: "Оцінювання повсякденного функціонування особи; довідки — за телефонами",
    places: [],
    phones: [
      { label: "Довідки", display: "(075) 201-13-86", tel: "+380752011386" },
      { label: "Довідки", display: "(075) 201-13-87", tel: "+380752011387" },
    ],
  },
];

/** Directions: company.products_services[0–2]. */
export const directions: string[] = [
  "Екстрена медична допомога",
  "Терапія",
  "Хірургія",
  "Кардіологія",
  "Ортопедія та травматологія",
  "Неврологія",
  "Поліклініка",
  "Анестезіологія та інтенсивна терапія",
  "Паліативна допомога",
  "Дитяча хірургія",
  "Лабораторна діагностика",
  "Комп'ютерна томографія",
];

export interface Doctor {
  name: string;
  role: string;
  img: string;
}

/** Doctors with real photos (client's own portraits, same studio style). */
export const doctors: Doctor[] = [
  { name: "Малиш Юрій", role: "Лікар-кардіолог", img: "malysh-yurii" },
  { name: "Ігнатко Віктор", role: "Лікар-онколог", img: "ihnatko-viktor" },
  { name: "Хір Світлана", role: "Дитячий невролог", img: "khir-svitlana" },
];

export interface NewsItem {
  date: string;
  iso: string;
  title: string;
}

/** Latest three news from the client's homepage (C-010). */
export const news: NewsItem[] = [
  { date: "13.11.2026", iso: "2026-11-13", title: "Ви — ВПО? Держава гарантує вам безоплатну правничу допомогу" },
  { date: "06.11.2026", iso: "2026-11-06", title: "Співпраця задля спільної мети: УМБКЛ приймає делегацію з Дніпра" },
  { date: "29.10.2026", iso: "2026-10-29", title: "В УМБКЛ відбулася зустріч членів Асоціації ортопедів-травматологів Закарпаття" },
];

/** Path inside the site that respects the build base (GitHub Pages publishes under /<repo>/). */
export const asset = (p: string): string => `${import.meta.env.BASE_URL.replace(/\/?$/, "/")}${p.replace(/^\//, "")}`;
