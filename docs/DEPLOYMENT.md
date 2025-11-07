# 🚀 Инструкция по установке Hi-Catering на сервер

## 📋 Требования к серверу

### Минимальные требования
- **Процессор:** 2 CPU cores
- **Оперативная память:** 4 GB RAM (рекомендуется 8 GB)
- **Дисковое пространство:** 20 GB свободного места (рекомендуется 50 GB)
- **Операционная система:** Ubuntu 22.04 LTS или выше / Debian 11+ / CentOS 8+
- **Сетевое подключение:** Постоянное подключение к интернету

### Рекомендуемые параметры для Production
- **Процессор:** 4+ CPU cores
- **Оперативная память:** 8 GB RAM
- **Дисковое пространство:** 100 GB (SSD предпочтительно)
- **Операционная система:** Ubuntu 22.04 LTS
- **Резервное копирование:** Автоматические бэкапы
- **Мониторинг:** Настроенная система мониторинга

### Требуемое ПО на сервере
- **Docker:** версия 24.0+ 
- **Docker Compose:** версия 2.20+
- **Git:** для клонирования репозитория
- **SSL-сертификат:** Let's Encrypt или коммерческий сертификат

### Открытые порты
- **80** (HTTP) - обязательно
- **443** (HTTPS) - обязательно
- **22** (SSH) - для управления сервером

---

## 🛠 Установка на сервер (Ubuntu 22.04)

### Шаг 1: Подготовка сервера

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка необходимых пакетов
sudo apt install -y curl wget git nano ufw

# Настройка файрвола
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Шаг 2: Установка Docker

```bash
# Удаление старых версий Docker (если есть)
sudo apt remove docker docker-engine docker.io containerd runc

# Установка зависимостей
sudo apt install -y ca-certificates curl gnupg lsb-release

# Добавление официального GPG ключа Docker
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Добавление репозитория Docker
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Установка Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Добавление пользователя в группу docker
sudo usermod -aG docker $USER

# Перезагрузка для применения изменений группы
newgrp docker

# Проверка установки
docker --version
docker compose version
```

### Шаг 3: Клонирование проекта

```bash
# Создание директории для проекта
sudo mkdir -p /var/www
cd /var/www

# Клонирование репозитория
sudo git clone <YOUR_REPOSITORY_URL> hi-catering
cd hi-catering

# Изменение владельца директории
sudo chown -R $USER:$USER /var/www/hi-catering
```

### Шаг 4: Настройка переменных окружения

```bash
# Копирование примера конфигурации
cp env.example .env

# Редактирование .env файла
nano .env
```

**Важные переменные для Production:**

```env
# Frontend
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_STRAPI_URL=https://api.yourdomain.com
NODE_ENV=production

# Backend Strapi
DATABASE_CLIENT=postgres
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=hi_catering_prod
DATABASE_USERNAME=strapi_prod
DATABASE_PASSWORD=СИЛЬНЫЙ_ПАРОЛЬ_ТУТ
DATABASE_SSL=false

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=СИЛЬНЫЙ_ПАРОЛЬ_REDIS

# ВАЖНО: Сгенерируйте уникальные ключи для Production!
APP_KEYS=СГЕНЕРИРОВАННЫЙ_КЛЮЧ_1,СГЕНЕРИРОВАННЫЙ_КЛЮЧ_2
API_TOKEN_SALT=СГЕНЕРИРОВАННЫЙ_ТОКЕН_SALT
ADMIN_JWT_SECRET=СГЕНЕРИРОВАННЫЙ_JWT_SECRET
TRANSFER_TOKEN_SALT=СГЕНЕРИРОВАННЫЙ_TRANSFER_SALT
JWT_SECRET=СГЕНЕРИРОВАННЫЙ_JWT_SECRET_2

PUBLIC_URL=https://api.yourdomain.com
HOST=0.0.0.0
PORT=1337
```

**Генерация безопасных ключей:**

```bash
# Используйте этот скрипт для генерации ключей
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Шаг 5: Настройка Nginx для Production

Отредактируйте `infra/nginx/nginx.conf`:

```bash
nano infra/nginx/nginx.conf
```

Замените конфигурацию на:

```nginx
events {
    worker_connections 2048;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    sendfile        on;
    tcp_nopush     on;
    tcp_nodelay    on;
    keepalive_timeout  65;
    types_hash_max_size 2048;
    client_max_body_size 50M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

    # Frontend (Next.js)
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;

        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        location / {
            proxy_pass http://frontend:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }

    # Backend (Strapi)
    server {
        listen 80;
        server_name api.yourdomain.com;

        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name api.yourdomain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        location / {
            proxy_pass http://backend:1337;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            
            # Увеличенные таймауты для загрузки файлов
            proxy_connect_timeout 600;
            proxy_send_timeout 600;
            proxy_read_timeout 600;
            send_timeout 600;
        }
    }
}
```

### Шаг 6: Получение SSL-сертификата

#### Вариант А: Let's Encrypt (бесплатный)

```bash
# Установка Certbot
sudo apt install -y certbot

# Остановка контейнеров (если запущены)
cd /var/www/hi-catering
docker compose down

# Получение сертификата
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Копирование сертификатов в проект
sudo mkdir -p infra/nginx/ssl
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem infra/nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem infra/nginx/ssl/
sudo chown -R $USER:$USER infra/nginx/ssl

# Настройка автообновления
sudo certbot renew --dry-run
```

#### Вариант Б: Самоподписанный сертификат (только для тестирования)

```bash
# Создание директории для сертификатов
mkdir -p infra/nginx/ssl

# Генерация самоподписанного сертификата
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout infra/nginx/ssl/privkey.pem \
  -out infra/nginx/ssl/fullchain.pem
```

### Шаг 7: Создание Production Docker Compose файла

Создайте `docker-compose.prod.yml`:

```bash
nano docker-compose.prod.yml
```

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: hi-catering-postgres
    restart: always
    environment:
      POSTGRES_DB: ${DATABASE_NAME}
      POSTGRES_USER: ${DATABASE_USERNAME}
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - hi-catering-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DATABASE_USERNAME}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: hi-catering-redis
    restart: always
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - hi-catering-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    container_name: hi-catering-backend
    restart: always
    env_file:
      - .env
    volumes:
      - ./backend/data:/app/data
      - ./backend/public/uploads:/app/public/uploads
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - hi-catering-network
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:1337/_health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./apps/web
      dockerfile: Dockerfile.prod
    container_name: hi-catering-frontend
    restart: always
    env_file:
      - .env
    depends_on:
      - backend
    networks:
      - hi-catering-network
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    container_name: hi-catering-nginx
    restart: always
    volumes:
      - ./infra/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./infra/nginx/ssl:/etc/nginx/ssl:ro
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - frontend
      - backend
    networks:
      - hi-catering-network

volumes:
  postgres_data:
  redis_data:

networks:
  hi-catering-network:
    driver: bridge
```

### Шаг 8: Создание Production Dockerfiles

#### Backend Production Dockerfile

```bash
nano backend/Dockerfile.prod
```

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Копирование package.json и установка зависимостей
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts

# Копирование исходного кода
COPY . .

# Сборка приложения
ENV NODE_ENV=production
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Установка только production зависимостей
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts

# Копирование собранного приложения
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/data ./data

# Создание пользователя без root прав
RUN addgroup -g 1001 -S nodejs && \
    adduser -S strapi -u 1001 && \
    chown -R strapi:nodejs /app

USER strapi

EXPOSE 1337

CMD ["npm", "run", "start"]
```

#### Frontend Production Dockerfile

```bash
nano apps/web/Dockerfile.prod
```

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Установка зависимостей
COPY package*.json ./
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
RUN npm ci --ignore-scripts

# Копирование исходного кода и сборка
COPY . .
ENV NODE_ENV=production
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Установка только production зависимостей
COPY package*.json ./
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
RUN npm ci --only=production --ignore-scripts

# Копирование собранного приложения
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

# Создание пользователя без root прав
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "start"]
```

### Шаг 9: Запуск приложения

```bash
# Переход в директорию проекта
cd /var/www/hi-catering

# Сборка и запуск контейнеров
docker compose -f docker-compose.prod.yml up -d --build

# Просмотр логов
docker compose -f docker-compose.prod.yml logs -f

# Проверка статуса контейнеров
docker compose -f docker-compose.prod.yml ps
```

### Шаг 10: Первоначальная настройка Strapi

```bash
# Дождитесь запуска всех контейнеров (1-2 минуты)
# Затем перейдите на https://api.yourdomain.com/admin

# Создайте администратора при первом входе
# Логин: admin@yourdomain.com
# Пароль: [создайте надежный пароль]
```

### Шаг 11: Заполнение данными (опционально)

```bash
# Войдите в контейнер backend
docker exec -it hi-catering-backend sh

# Запустите скрипты наполнения данными
npm run seed:all
npm run publish:all
npm run setup:permissions

# Выход из контейнера
exit
```

---

## 🔧 Управление приложением

### Остановка приложения

```bash
cd /var/www/hi-catering
docker compose -f docker-compose.prod.yml down
```

### Перезапуск приложения

```bash
docker compose -f docker-compose.prod.yml restart
```

### Обновление приложения

```bash
cd /var/www/hi-catering

# Остановка контейнеров
docker compose -f docker-compose.prod.yml down

# Получение последней версии из Git
git pull origin main

# Пересборка и запуск
docker compose -f docker-compose.prod.yml up -d --build
```

### Просмотр логов

```bash
# Все сервисы
docker compose -f docker-compose.prod.yml logs -f

# Только frontend
docker compose -f docker-compose.prod.yml logs -f frontend

# Только backend
docker compose -f docker-compose.prod.yml logs -f backend
```

---

## 💾 Резервное копирование

### Создание бэкапа базы данных

```bash
# Создание директории для бэкапов
mkdir -p /var/www/backups

# Бэкап PostgreSQL
docker exec hi-catering-postgres pg_dump -U strapi_prod hi_catering_prod > /var/www/backups/db_backup_$(date +%Y%m%d_%H%M%S).sql
```

### Восстановление из бэкапа

```bash
# Восстановление базы данных
docker exec -i hi-catering-postgres psql -U strapi_prod hi_catering_prod < /var/www/backups/db_backup_YYYYMMDD_HHMMSS.sql
```

### Автоматическое резервное копирование

Создайте cron задачу:

```bash
# Создание скрипта бэкапа
nano /var/www/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/www/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Бэкап базы данных
docker exec hi-catering-postgres pg_dump -U strapi_prod hi_catering_prod > $BACKUP_DIR/db_backup_$DATE.sql

# Бэкап загруженных файлов
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz /var/www/hi-catering/backend/public/uploads

# Удаление старых бэкапов (старше 30 дней)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

```bash
# Сделать скрипт исполняемым
chmod +x /var/www/backup.sh

# Добавить в cron (каждый день в 3:00)
crontab -e

# Добавить строку:
0 3 * * * /var/www/backup.sh >> /var/log/backup.log 2>&1
```

---

## 🔒 Безопасность

### Базовая настройка файрвола

```bash
# UFW уже настроен на шаге 1, проверьте статус
sudo ufw status

# Если нужно закрыть прямой доступ к базе данных и Redis
# (они доступны только внутри Docker сети)
```

### Регулярные обновления

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Обновление Docker образов
cd /var/www/hi-catering
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d --build
```

### Мониторинг безопасности

```bash
# Установка fail2ban для защиты от брутфорса
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 📊 Мониторинг

### Проверка здоровья сервисов

```bash
# Проверка статуса контейнеров
docker compose -f docker-compose.prod.yml ps

# Проверка использования ресурсов
docker stats

# Проверка логов на ошибки
docker compose -f docker-compose.prod.yml logs --tail=100 | grep -i error
```

### Использование дискового пространства

```bash
# Проверка использования диска
df -h

# Очистка неиспользуемых Docker образов
docker system prune -a --volumes
```

---

## 🆘 Решение проблем

### Проблема: Контейнеры не запускаются

```bash
# Проверьте логи
docker compose -f docker-compose.prod.yml logs

# Проверьте, не заняты ли порты
sudo netstat -tulpn | grep -E ':(80|443|1337|3000|5432|6379)'
```

### Проблема: Ошибки подключения к базе данных

```bash
# Проверьте, запущен ли PostgreSQL
docker compose -f docker-compose.prod.yml ps postgres

# Проверьте логи PostgreSQL
docker compose -f docker-compose.prod.yml logs postgres

# Проверьте переменные окружения
docker compose -f docker-compose.prod.yml exec backend env | grep DATABASE
```

### Проблема: Frontend не может подключиться к Backend

```bash
# Проверьте сеть Docker
docker network ls
docker network inspect hi-catering_hi-catering-network

# Проверьте переменные окружения frontend
docker compose -f docker-compose.prod.yml exec frontend env | grep NEXT_PUBLIC
```

### Проблема: SSL сертификат не работает

```bash
# Проверьте наличие сертификатов
ls -la /var/www/hi-catering/infra/nginx/ssl/

# Проверьте конфигурацию Nginx
docker compose -f docker-compose.prod.yml exec nginx nginx -t

# Перезапустите Nginx
docker compose -f docker-compose.prod.yml restart nginx
```

---

## 📈 Оптимизация Production

### Настройка кеширования Redis

В Strapi админке:
1. Перейдите в Settings → Performance
2. Включите кеширование
3. Настройте время жизни кеша

### Настройка CDN (опционально)

Для загруженных изображений рекомендуется использовать CDN:
- Cloudflare
- AWS CloudFront
- DigitalOcean Spaces

### Мониторинг производительности

```bash
# Установка PM2 Keymetrics (опционально)
# Или используйте внешние сервисы:
# - New Relic
# - Datadog
# - Prometheus + Grafana
```

---

## 📞 Поддержка

### Полезные команды

```bash
# Просмотр всех контейнеров
docker ps -a

# Просмотр использования ресурсов
docker stats

# Вход в контейнер
docker exec -it hi-catering-backend sh
docker exec -it hi-catering-frontend sh

# Перезапуск определенного сервиса
docker compose -f docker-compose.prod.yml restart backend
```

### Логи

```bash
# Логи всех сервисов
docker compose -f docker-compose.prod.yml logs -f

# Логи с временными метками
docker compose -f docker-compose.prod.yml logs -f --timestamps

# Последние 100 строк логов
docker compose -f docker-compose.prod.yml logs --tail=100
```

---

## 🎯 Чек-лист после установки

- [ ] Все контейнеры запущены и здоровы
- [ ] SSL-сертификаты установлены и работают
- [ ] Создан администратор Strapi
- [ ] Заполнены начальные данные
- [ ] Настроены разрешения API
- [ ] Проверена работа сайта через браузер
- [ ] Настроено автоматическое резервное копирование
- [ ] Настроен мониторинг
- [ ] Настроен файрвол
- [ ] Документация передана команде

---

## 🔗 Полезные ссылки

- [Документация Next.js](https://nextjs.org/docs)
- [Документация Strapi](https://docs.strapi.io)
- [Документация Docker](https://docs.docker.com)
- [Документация PostgreSQL](https://www.postgresql.org/docs/)
- [Let's Encrypt](https://letsencrypt.org)

---

**Удачного деплоя! 🚀**

