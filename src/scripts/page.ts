// Small page behaviours, no libraries. Everything works as plain anchors and links without JS.
import { registryStatus } from "./status";

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Live registry status: Mon–Fri 13:00–16:00, Europe/Kyiv. Holidays are unknown, so the static text says «у робочі дні». */
function kyivNow(): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Kyiv",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string): string => parts.find((p) => p.type === t)?.value ?? "";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return { day: days.indexOf(get("weekday")), minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

function paintStatus(): void {
  const { day, minutes } = kyivNow();
  if (day < 0 || Number.isNaN(minutes)) return; // keep the static text
  const s = registryStatus(day, minutes);
  document.querySelectorAll<HTMLElement>("[data-reg-status]").forEach((el) => {
    if (el.textContent !== s.text) el.textContent = s.text;
    el.dataset.state = s.open ? "open" : "closed";
  });
}
paintStatus();
window.setInterval(paintStatus, 60_000);

/* Mobile menu: native <dialog> gives the focus trap and Esc. */
const menu = document.querySelector<HTMLDialogElement>("#menu");
const openBtn = document.querySelector<HTMLButtonElement>("[data-menu-open]");
if (menu && openBtn && typeof menu.showModal === "function") {
  openBtn.addEventListener("click", () => {
    menu.showModal();
    openBtn.setAttribute("aria-expanded", "true");
  });
  menu.addEventListener("close", () => openBtn.setAttribute("aria-expanded", "false"));
  menu.querySelector("[data-menu-close]")?.addEventListener("click", () => menu.close());
  menu.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => a.addEventListener("click", () => menu.close()));
}

/* Motion 3 «вам сюди»: after a jump the target plate shows the yellow corner and its heading takes focus. */
function markHere(hash: string): void {
  if (!hash || hash === "#" || hash === "#top" || hash === "#main") return;
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return;
  const plate = target.classList.contains("plate") ? target : target.querySelector<HTMLElement>(".plate");
  if (!plate) return;
  document.querySelectorAll(".plate.is-here").forEach((el) => el.classList.remove("is-here"));
  void plate.offsetWidth; // restart the one-shot animation
  plate.classList.add("is-here");
  plate.querySelector<HTMLElement>(".plate__name, [data-here-focus]")?.focus({ preventScroll: true });
}
document.querySelectorAll<HTMLAnchorElement>("a[data-here], .hdr-urgent, a.go[href='#zapys'], .reg__quiet").forEach((a) => {
  a.addEventListener("click", () => {
    const hash = a.getAttribute("href") ?? "";
    window.setTimeout(() => markHere(hash), reduce ? 0 : 450);
  });
});

/* Directions: on phones the first 6 + «Показати всі напрями». */
const dir = document.querySelector<HTMLElement>("#dir-list");
const dirBtn = document.querySelector<HTMLButtonElement>("[data-dir-toggle]");
if (dir && dirBtn) {
  dirBtn.addEventListener("click", () => {
    const collapsed = dir.classList.toggle("is-collapsed");
    dirBtn.setAttribute("aria-expanded", String(!collapsed));
    dirBtn.textContent = collapsed ? "Показати всі напрями" : "Згорнути список";
    dir.querySelectorAll<HTMLElement>("[data-reveal]").forEach((li) => li.classList.add("is-visible"));
  });
}

/* Motion 5: bottom call bar on phones — after the hero board, hidden over contacts and footer. */
const bar = document.querySelector<HTMLElement>("[data-callbar]");
const boardEl = document.querySelector<HTMLElement>(".board");
const endZone = [document.querySelector("#kontakty"), document.querySelector(".site-footer")].filter(
  (el): el is Element => el !== null,
);
if (bar && boardEl && "IntersectionObserver" in window) {
  let pastHero = false;
  const inEnd = new Set<Element>();
  const update = (): void => {
    const show = pastHero && inEnd.size === 0;
    bar.classList.toggle("is-shown", show);
    bar.setAttribute("aria-hidden", String(!show));
    bar.querySelectorAll("a").forEach((a) => (show ? a.removeAttribute("tabindex") : a.setAttribute("tabindex", "-1")));
  };
  new IntersectionObserver(([e]) => {
    if (!e) return;
    pastHero = !e.isIntersecting && e.boundingClientRect.top < 0;
    update();
  }).observe(boardEl);
  const endIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? inEnd.add(e.target) : inEnd.delete(e.target)));
    update();
  });
  endZone.forEach((el) => endIo.observe(el));
}

/* Active anchor in the desktop nav: the yellow corner mark. */
const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-nav]"));
if (navLinks.length && "IntersectionObserver" in window) {
  const map = new Map<Element, HTMLAnchorElement>();
  navLinks.forEach((a) => {
    const s = document.querySelector(a.getAttribute("href") ?? "");
    if (s) map.set(s, a);
  });
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const link = map.get(e.target);
        if (!link || !e.isIntersecting) return;
        navLinks.forEach((l) => {
          l.classList.remove("is-active");
          l.removeAttribute("aria-current");
        });
        link.classList.add("is-active");
        link.setAttribute("aria-current", "true");
      });
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );
  map.forEach((_, s) => io.observe(s));
}
