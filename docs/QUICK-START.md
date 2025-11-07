# 🚀 Быстрый старт - Установка Hi-Catering на VPS

## Краткая инструкция для опытных пользователей

### Требования к серверу
- Ubuntu 22.04 LTS
- Минимум 4 GB RAM, 20 GB диск
- Открытые порты: 80, 443, 22
- Root или sudo доступ

---

## 5-минутная установка

### 1. Подготовка сервера

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# Установка Docker Compose (если не установлен)
sudo apt install docker-compose-plugin -y

# Настройка файрвола
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

### 2. Клонирование проекта

```bash
# Переход в директорию для проектов
cd /var/www

# Клонирование репозитория
sudo git clone <YOUR_REPOSITORY_URL> hi-catering
cd hi-catering
sudo chown -R $USER:$USER /var/www/hi-catering
```

### 3. Настройка окружения

```bash
# Копирование .env файла
cp env.example .env

# Генерация безопасных ключей
echo "APP_KEYS=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")" >> .env.generated
echo "API_TOKEN_SALT=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")" >> .env.generated
echo "ADMIN_JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")" >> .env.generated
echo "TRANSFER_TOKEN_SALT=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")" >> .env.generated
echo "JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")" >> .env.generated

# Редактирование .env - замените YOUR_DOMAIN на ваш домен
nano .env
```

**Минимальные изменения в .env:**

```env
# Замените yourdomain.com на ваш домен
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_STRAPI_URL=https://api.yourdomain.com
PUBLIC_URL=https://api.yourdomain.com

# Установите сильные пароли
DATABASE_PASSWORD=ВАШ_СИЛЬНЫЙ_ПАРОЛЬ_БД
REDIS_PASSWORD=ВАШ_СИЛЬНЫЙ_ПАРОЛЬ_REDIS

# Скопируйте сгенерированные ключи из .env.generated
APP_KEYS=сгенерированный_ключ_из_файла
API_TOKEN_SALT=сгенерированный_salt_из_файла
ADMIN_JWT_SECRET=сгенерированный_jwt_secret_из_файла
TRANSFER_TOKEN_SALT=сгенерированный_transfer_salt_из_файла
JWT_SECRET=сгенерированный_jwt_secret2_из_файла
```

### 4. Настройка DNS

Настройте A-записи у вашего регистратора доменов:

```
yourdomain.com        -> IP_ВАШЕГО_СЕРВЕРА
www.yourdomain.com    -> IP_ВАШЕГО_СЕРВЕРА
api.yourdomain.com    -> IP_ВАШЕГО_СЕРВЕРА
```

### 5. Получение SSL сертификата

```bash
# Установка Certbot
sudo apt install certbot -y

# Получение сертификата (убедитесь, что DNS уже настроен)
sudo certbot certonly --standalone \
  -d yourdomain.com \
  -d www.yourdomain.com \
  -d api.yourdomain.com \
  --email your@email.com \
  --agree-tos

# Копирование сертификатов
sudo mkdir -p infra/nginx/ssl
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem infra/nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem infra/nginx/ssl/
sudo chown -R $USER:$USER infra/nginx/ssl
```

### 6. Настройка Nginx конфигурации

```bash
# Редактирование nginx.conf - замените yourdomain.com на ваш домен
nano infra/nginx/nginx.conf
```

Замените все вхождения `yourdomain.com` на ваш реальный домен.

### 7. Запуск приложения

```bash
# Автоматический деплой (рекомендуется)
./scripts/deploy.sh

# ИЛИ ручной запуск
docker compose -f docker-compose.prod.yml up -d --build
```

### 8. Первоначальная настройка

```bash
# Дождитесь запуска всех сервисов (1-2 минуты)
docker compose -f docker-compose.prod.yml logs -f

# Откройте в браузере: https://api.yourdomain.com/admin
# Создайте администратора

# Заполнение тестовыми данными (опционально)
docker exec -it hi-catering-backend sh
npm run seed:all
npm run publish:all
npm run setup:permissions
exit
```

### 9. Проверка работы

Откройте в браузере:
- **Сайт:** https://yourdomain.com
- **API:** https://api.yourdomain.com
- **Админка:** https://api.yourdomain.com/admin

---

## Полезные команды

```bash
# Просмотр логов
docker compose -f docker-compose.prod.yml logs -f

# Перезапуск
docker compose -f docker-compose.prod.yml restart

# Остановка
docker compose -f docker-compose.prod.yml down

# Обновление
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build

# Резервное копирование
./scripts/backup.sh

# Восстановление
./scripts/restore.sh
```

---

## Автоматическое обновление SSL

```bash
# Создайте cron задачу для автообновления
sudo crontab -e

# Добавьте строку (обновление каждые 12 часов):
0 */12 * * * certbot renew --quiet --post-hook "cp /etc/letsencrypt/live/yourdomain.com/*.pem /var/www/hi-catering/infra/nginx/ssl/ && docker compose -f /var/www/hi-catering/docker-compose.prod.yml restart nginx"
```

---

## Автоматическое резервное копирование

```bash
# Добавьте в cron (каждый день в 3:00)
crontab -e

# Добавьте:
0 3 * * * cd /var/www/hi-catering && ./scripts/backup.sh >> /var/log/backup.log 2>&1
```

---

## Решение проблем

### Проблема: Контейнеры не запускаются

```bash
# Проверьте логи
docker compose -f docker-compose.prod.yml logs

# Проверьте порты
sudo netstat -tulpn | grep -E ':(80|443)'

# Остановите мешающие процессы
sudo systemctl stop apache2  # если есть Apache
sudo systemctl stop nginx    # если есть standalone Nginx
```

### Проблема: SSL не работает

```bash
# Проверьте наличие сертификатов
ls -la infra/nginx/ssl/

# Проверьте конфигурацию Nginx
docker compose -f docker-compose.prod.yml exec nginx nginx -t

# Перезапустите Nginx
docker compose -f docker-compose.prod.yml restart nginx
```

### Проблема: Backend не запускается

```bash
# Проверьте логи
docker compose -f docker-compose.prod.yml logs backend

# Проверьте подключение к БД
docker compose -f docker-compose.prod.yml exec postgres psql -U strapi_prod -d hi_catering_prod -c "SELECT 1;"

# Перезапустите backend
docker compose -f docker-compose.prod.yml restart backend
```

---

## Производительность

### Для высоконагруженных сайтов (10,000+ посетителей в день)

Рекомендуемые параметры сервера:
- **CPU:** 8+ cores
- **RAM:** 16 GB
- **Диск:** 200 GB SSD
- **Сеть:** 1 Gbps

Дополнительная оптимизация:
1. Настройте CDN (Cloudflare/AWS CloudFront)
2. Используйте внешний Redis кластер
3. Используйте managed PostgreSQL (AWS RDS/DigitalOcean Managed DB)
4. Настройте horizontal scaling для frontend

---

## Мониторинг

### Установка базового мониторинга

```bash
# Установка htop для мониторинга ресурсов
sudo apt install htop -y

# Просмотр ресурсов Docker
docker stats

# Установка Netdata (продвинутый мониторинг)
bash <(curl -Ss https://my-netdata.io/kickstart.sh)
```

Мониторинг будет доступен на `http://YOUR_SERVER_IP:19999`

---

## Безопасность

### Базовые меры безопасности

```bash
# Установка fail2ban
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Отключение root входа по SSH
sudo nano /etc/ssh/sshd_config
# Установите: PermitRootLogin no
sudo systemctl restart sshd

# Настройка автообновлений безопасности
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## Расширенная документация

Для подробной информации см. [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Поздравляем! Ваш сайт Hi-Catering запущен! 🎉**

