# Визионер — сайт галереи (классический стиль + параллакс)

## Главное
- Главная: `index.html` (вход)
- Галерея: `gallery.html` (картины грузятся из `data/works.json`)
- Страницы: `about.html`, `contact.html`

## Где менять картины
1) Фото: `assets/img/works/`
2) Данные (название/параметры/цена): `data/works.json`

## Где менять контакты и Telegram
`assets/js/site.config.js`

## Локальный запуск (чтобы JSON работал)
```bash
python -m http.server 8000
```
Откройте: http://localhost:8000
