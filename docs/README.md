# 📚 Документация Hi-Catering

Добро пожаловать в документацию по установке и настройке проекта Hi-Catering!

## 📖 Содержание

### 🚀 Деплой и установка

1. **[QUICK-START.md](./QUICK-START.md)** - Быстрый старт за 5 минут
   - Минимальная инструкция для опытных пользователей
   - Пошаговая установка на VPS
   - Основные команды

2. **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Полная инструкция по деплою
   - Подробные требования к серверу
   - Пошаговая установка с объяснениями
   - Production конфигурация
   - Резервное копирование
   - Решение проблем
   - Мониторинг и оптимизация

3. **[SERVER-RECOMMENDATIONS.md](./SERVER-RECOMMENDATIONS.md)** - Выбор хостинга
   - Обзор провайдеров хостинга
   - Сравнение цен и конфигураций
   - Рекомендации по этапам роста
   - Дополнительные сервисы (CDN, Monitoring, etc.)

---

## 🎯 Что выбрать?

### Я хочу быстро развернуть сайт
👉 Читайте [QUICK-START.md](./QUICK-START.md)

### Я хочу полностью понять процесс установки
👉 Читайте [DEPLOYMENT.md](./DEPLOYMENT.md)

### Я выбираю хостинг
👉 Читайте [SERVER-RECOMMENDATIONS.md](./SERVER-RECOMMENDATIONS.md)

### У меня проблема с развертыванием
👉 Раздел "Решение проблем" в [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🏗 Архитектура проекта

```
┌─────────────────────────────────────────────────┐
│                   Nginx (Reverse Proxy)          │
│              Port 80 (HTTP), 443 (HTTPS)         │
└────────────┬─────────────────┬──────────────────┘
             │                 │
             │                 │
   ┌─────────▼─────────┐  ┌────▼──────────────┐
   │   Next.js App      │  │  Strapi CMS       │
   │   (Frontend)       │  │  (Backend API)    │
   │   Port: 3000       │  │  Port: 1337       │
   └─────────┬──────────┘  └────┬──────────────┘
             │                  │
             │         ┌────────┴─────────┐
             │         │                  │
       ┌─────▼─────┐  ┌▼──────────┐  ┌───▼────┐
       │ PostgreSQL │  │   Redis   │  │ Files  │
       │  (DB)      │  │  (Cache)  │  │(Uploads)│
       └────────────┘  └───────────┘  └────────┘
```

### Компоненты

- **Frontend:** Next.js 16 + React 19 + TailwindCSS 4
- **Backend:** Strapi 5 (Headless CMS)
- **Database:** PostgreSQL 15
- **Cache:** Redis 7
- **Web Server:** Nginx (Reverse Proxy + SSL)
- **Container Platform:** Docker + Docker Compose

---

## 💻 Требования к серверу

### Минимальные
- **CPU:** 2 cores
- **RAM:** 4 GB
- **Disk:** 20 GB SSD
- **OS:** Ubuntu 22.04 LTS
- **Порты:** 80, 443, 22

### Рекомендуемые для Production
- **CPU:** 4+ cores
- **RAM:** 8 GB
- **Disk:** 100 GB SSD
- **OS:** Ubuntu 22.04 LTS
- **Бэкапы:** Автоматические
- **Мониторинг:** Настроенный

---

## 🔧 Основные команды

### Деплой

```bash
# Автоматический деплой
./scripts/deploy.sh

# Ручной деплой
docker compose -f docker-compose.prod.yml up -d --build
```

### Управление

```bash
# Просмотр логов
docker compose -f docker-compose.prod.yml logs -f

# Просмотр статуса
docker compose -f docker-compose.prod.yml ps

# Перезапуск
docker compose -f docker-compose.prod.yml restart

# Остановка
docker compose -f docker-compose.prod.yml down
```

### Резервное копирование

```bash
# Создать бэкап
./scripts/backup.sh

# Восстановить из бэкапа
./scripts/restore.sh
```

---

## 📂 Структура проекта

```
hi-catering/
├── apps/
│   └── web/                 # Next.js Frontend
│       ├── src/
│       ├── public/
│       ├── Dockerfile.dev   # Development
│       └── Dockerfile.prod  # Production
│
├── backend/                 # Strapi Backend
│   ├── src/
│   │   ├── api/            # API endpoints
│   │   ├── components/     # Reusable components
│   │   └── admin/          # Admin panel
│   ├── data/               # Database files
│   ├── public/uploads/     # Uploaded files
│   ├── Dockerfile.dev      # Development
│   └── Dockerfile.prod     # Production
│
├── infra/
│   └── nginx/
│       ├── nginx.conf      # Nginx configuration
│       └── ssl/            # SSL certificates
│
├── scripts/
│   ├── deploy.sh           # Автоматический деплой
│   ├── backup.sh           # Резервное копирование
│   └── restore.sh          # Восстановление
│
├── docs/                    # Документация
│   ├── DEPLOYMENT.md
│   ├── QUICK-START.md
│   ├── SERVER-RECOMMENDATIONS.md
│   └── README.md
│
├── docker-compose.yml       # Development
├── docker-compose.prod.yml  # Production
└── .env                     # Environment variables
```

---

## 🔐 Безопасность

### Обязательно перед деплоем

1. ✅ Измените все пароли в `.env`
2. ✅ Сгенерируйте уникальные ключи для Strapi
3. ✅ Настройте SSL-сертификаты
4. ✅ Настройте файрвол (UFW)
5. ✅ Настройте автоматические бэкапы
6. ✅ Установите fail2ban
7. ✅ Отключите root-вход по SSH

### Генерация безопасных ключей

```bash
# Генерация случайного ключа
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Генерация нескольких ключей
for i in {1..5}; do
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
done
```

---

## 🚨 Решение проблем

### Контейнеры не запускаются

```bash
# Просмотр логов
docker compose -f docker-compose.prod.yml logs

# Проверка занятых портов
sudo netstat -tulpn | grep -E ':(80|443|1337|3000)'

# Перезапуск Docker
sudo systemctl restart docker
```

### База данных недоступна

```bash
# Проверка статуса PostgreSQL
docker compose -f docker-compose.prod.yml ps postgres

# Просмотр логов БД
docker compose -f docker-compose.prod.yml logs postgres

# Вход в контейнер БД
docker exec -it hi-catering-postgres psql -U strapi_prod -d hi_catering_prod
```

### SSL не работает

```bash
# Проверка сертификатов
ls -la infra/nginx/ssl/

# Проверка конфигурации Nginx
docker compose -f docker-compose.prod.yml exec nginx nginx -t

# Обновление сертификатов Let's Encrypt
sudo certbot renew
```

---

## 📊 Мониторинг

### Проверка здоровья системы

```bash
# Использование ресурсов
docker stats

# Место на диске
df -h

# Логи системы
journalctl -u docker -f

# Логи приложения
docker compose -f docker-compose.prod.yml logs --tail=100 -f
```

### Рекомендуемые инструменты мониторинга

- **UptimeRobot** - Мониторинг доступности (бесплатно)
- **Netdata** - Системный мониторинг (бесплатно)
- **Datadog** - APM и метрики (от $15/мес)
- **Sentry** - Отслеживание ошибок (бесплатный план)

---

## 📈 Оптимизация

### Performance

1. Включите Redis кеширование в Strapi
2. Настройте CDN (Cloudflare)
3. Оптимизируйте изображения (используйте WebP)
4. Включите Gzip/Brotli компрессию в Nginx
5. Настройте Browser Caching

### SEO

1. Настройте `next-seo` в Frontend
2. Добавьте `robots.txt` и `sitemap.xml`
3. Настройте Open Graph метатеги
4. Добавьте структурированные данные (Schema.org)
5. Настройте Google Analytics / Yandex Metrika

---

## 🔄 Обновление проекта

```bash
cd /var/www/hi-catering

# Создание бэкапа перед обновлением
./scripts/backup.sh

# Получение последней версии
git pull origin main

# Пересборка и перезапуск
docker compose -f docker-compose.prod.yml up -d --build

# Проверка логов
docker compose -f docker-compose.prod.yml logs -f
```

---

## 💡 Полезные ссылки

### Документация технологий

- [Next.js Documentation](https://nextjs.org/docs)
- [Strapi Documentation](https://docs.strapi.io)
- [Docker Documentation](https://docs.docker.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)

### Инструменты

- [Let's Encrypt](https://letsencrypt.org) - Бесплатные SSL сертификаты
- [Cloudflare](https://cloudflare.com) - CDN и защита
- [Docker Hub](https://hub.docker.com) - Docker образы
- [UptimeRobot](https://uptimerobot.com) - Мониторинг аптайма

### Обучение

- [Docker для начинающих](https://docker-curriculum.com)
- [Ubuntu Server Guide](https://ubuntu.com/server/docs)
- [Nginx Beginner's Guide](https://nginx.org/en/docs/beginners_guide.html)

---

## 🤝 Поддержка

### Получить помощь

1. Проверьте раздел "Решение проблем" в [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Просмотрите логи: `docker compose -f docker-compose.prod.yml logs`
3. Проверьте issues в репозитории
4. Обратитесь к команде поддержки

### Сообщить о проблеме

При сообщении о проблеме укажите:
- Версию ОС
- Версии Docker и Docker Compose
- Логи ошибок
- Шаги для воспроизведения
- Скриншоты (если применимо)

---

## 📝 Changelog

### Version 1.0.0 (2025-11-07)
- ✅ Полная документация по деплою
- ✅ Production Dockerfiles
- ✅ Автоматические скрипты деплоя
- ✅ Скрипты резервного копирования
- ✅ Рекомендации по хостингу

---

## ⚖️ Лицензия

Этот проект и его документация распространяются согласно лицензии проекта.

---

**Успешного деплоя! 🚀**

*Документация обновлена: 7 ноября 2025*

