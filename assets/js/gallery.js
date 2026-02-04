
import { $, $all, escapeHtml, setActiveNav, initParallax, loadWorks, formatPrice, tgLink } from "./app.js";
import { applySiteConfig } from "./site.config.js";

applySiteConfig();
setActiveNav();
initParallax();

const grid = $("#grid");
const chips = $all(".chip");
const input = $("#searchInput");

const modal = $("#modal");
const modalImg = $("#modalImg");
const modalTitle = $("#modalTitle");
const modalSub = $("#modalSub");
const modalDesc = $("#modalDesc");
const modalPrice = $("#modalPrice");
const closeModal = $("#closeModal");
const copyTitle = $("#copyTitle");
const tgBtn = $("#tgBtn");

const kvMaterial = document.getElementById("kvMaterial");
const kvTechnique = document.getElementById("kvTechnique");

let allWorks = [];
let currentFilter = "all";
let query = "";

function matches(w){
  if (currentFilter !== "all" && (w.type || "").toLowerCase() !== currentFilter) return false;
  if (!query) return true;
  const q = query.toLowerCase();
  const blob = `${w.title||""} ${w.author||""} ${w.style||""} ${w.genre||""} ${w.type||""}`.toLowerCase();
  return blob.includes(q);
}

function render(){
  if (!grid) return;
  grid.innerHTML = "";

  const filtered = allWorks.filter(matches);

  if (!filtered.length){
    grid.innerHTML = `<div class="panel" style="grid-column:1/-1">
      <div class="smallcaps">ничего не найдено</div>
      <div style="margin-top:6px; color:var(--muted)">Попробуйте другой фильтр или запрос.</div>
    </div>`;
    return;
  }

  filtered.forEach((w) => {
    const card = document.createElement("article");
    card.className = "work";
    card.setAttribute("tabindex", "0");
    const badge = w.type ? `<div class="badge">${escapeHtml(w.type)}</div>` : "";
    card.innerHTML = `
      <div class="thumb">
        <img src="${escapeHtml(w.image || "")}" alt="${escapeHtml(w.title)}" loading="lazy" />
        <div class="frame" aria-hidden="true"></div>
        ${badge}
      </div>
      <div class="meta">
        <p class="title">${escapeHtml(w.title)}</p>
        <p class="sub">${escapeHtml(w.author || "—")} · ${escapeHtml(w.size || "")}${w.year ? " · " + escapeHtml(w.year) : ""}</p>
      </div>
    `;
    card.addEventListener("click", () => openWork(w));
    card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") openWork(w); });
    grid.appendChild(card);
  });
}

function openWork(w){
  modalImg.src = w.image || "";
  modalImg.alt = w.title || "";
  modalTitle.textContent = w.title || "";
  modalSub.textContent = [w.author, w.year, w.type, w.style, w.genre, w.size].filter(Boolean).join(" · ");
  modalDesc.textContent = w.description || "";
  modalPrice.textContent = formatPrice(w.price);
  if (kvMaterial) kvMaterial.textContent = w.material || "—";
  if (kvTechnique) kvTechnique.textContent = w.technique || "—";

  const baseTg = document.documentElement.dataset.telegram || "https://t.me/USERNAME_OR_CHANNEL";
  const text = `Здравствуйте! Интересует работа: ${w.title || ""}${w.author ? " ("+w.author+")" : ""}.`;
  tgBtn.href = tgLink(baseTg, text);
  modal.classList.add("open");
}
function close(){ modal.classList.remove("open"); }

chips.forEach(chip => {
  chip.addEventListener("click", () => {
    chips.forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    currentFilter = chip.dataset.filter;
    render();
  });
});

if (input){
  input.addEventListener("input", () => { query = input.value.trim(); render(); });
}
if (modal){
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
}
if (closeModal) closeModal.addEventListener("click", close);
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal?.classList.contains("open")) close(); });

if (copyTitle){
  copyTitle.addEventListener("click", async () => {
    try{
      await navigator.clipboard.writeText(modalTitle.textContent || "");
      copyTitle.textContent = "Скопировано ✓";
      setTimeout(() => (copyTitle.textContent = "Скопировать название"), 1200);
    }catch{
      copyTitle.textContent = "Не удалось";
      setTimeout(() => (copyTitle.textContent = "Скопировать название"), 1200);
    }
  });
}

(async function init(){
  try{ allWorks = await loadWorks(); render(); }
  catch(err){
    console.error(err);
    if (grid) grid.innerHTML = `<div class="panel" style="grid-column:1/-1">
      <div class="smallcaps">ошибка загрузки</div>
      <div style="margin-top:6px; color:var(--muted)">Откройте сайт через GitHub Pages или локальный сервер (а не двойным кликом).</div>
    </div>`;
  }
})();
