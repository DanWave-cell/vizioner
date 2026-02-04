
export function $(sel, root=document){ return root.querySelector(sel); }
export function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

export function escapeHtml(str){
  return String(str ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

export function setActiveNav(){
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll('.navlinks a').forEach(a=>{
    const href = (a.getAttribute("href") || "").toLowerCase();
    a.classList.toggle("active", href.endsWith(path));
  });
}

export function initParallax(){
  const sections = document.querySelectorAll(".parallax[data-parallax]");
  if (!sections.length) return;

  const onScroll = () => {
    const vh = window.innerHeight;
    sections.forEach(sec=>{
      const layer = sec.querySelector(".layer");
      if (!layer) return;
      const r = sec.getBoundingClientRect();
      const center = r.top + r.height/2;
      const t = (center - vh/2) / vh;
      const offset = Math.max(-60, Math.min(60, t * 36));
      layer.style.transform = `translate3d(0, ${offset}px, 0) scale(1.03)`;
    });
  };

  const onMouse = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5);
    const y = (e.clientY / window.innerHeight - 0.5);
    sections.forEach(sec=>{
      const layer = sec.querySelector(".layer");
      if (!layer) return;
      layer.style.backgroundPosition = `${50 + x*3}% ${50 + y*3}%`;
    });
  };

  window.addEventListener("scroll", onScroll, {passive:true});
  window.addEventListener("resize", onScroll);
  window.addEventListener("mousemove", onMouse, {passive:true});
  onScroll();
}

export async function loadWorks(){
  const res = await fetch("data/works.json", {cache:"no-store"});
  if (!res.ok) throw new Error("Не удалось загрузить data/works.json");
  const data = await res.json();
  return Array.isArray(data) ? data : (data.works || []);
}

export function formatPrice(p){ return p ? p : "Цена: по запросу"; }

export function tgLink(base, text){
  const url = new URL(base);
  if (text) url.searchParams.set("text", text);
  return url.toString();
}
