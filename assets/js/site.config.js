
export const SITE = {
  phone: "+7 903 720 24 99",
  email: "hello@vizioner.art",
  telegram: "https://t.me/vizioner959",
  telegramChannel: "https://t.me/vizioner959"
};

export function applySiteConfig(){
  document.documentElement.dataset.telegram = SITE.telegram;

  const footers = document.querySelectorAll("footer .footer");
  footers.forEach(f=>{
    const spans = f.querySelectorAll("span");
    if (spans.length){
      spans[0].textContent = ` ${SITE.phone} · ${SITE.email}`;
    }
    const a = f.querySelector('a[href^="https://t.me/"]');
    if (a) a.href = SITE.telegramChannel;
  });

  const mail = document.querySelectorAll('a[href^="mailto:"]');
  mail.forEach(a=>{
    a.href = `mailto:${SITE.email}`;
    a.textContent = SITE.email;
  });

  const tg = document.querySelectorAll('a[href="https://t.me/USERNAME_OR_CHANNEL"]');
  tg.forEach(a=>{ a.href = SITE.telegram; });
}
