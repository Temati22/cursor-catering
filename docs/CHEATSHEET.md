# 📋 Hi-Catering - Шпаргалка по командам

Краткий справочник по основным командам для управления проектом.

---

## 🚀 Деплой

```bash
# Автоматический деплой (рекомендуется)
./scripts/deploy.sh

# Деплой без создания бэкапа
./scripts/deploy.sh --no-backup

# Ручной деплой
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 🎮 Управление контейнерами

```bash
# Запуск всех сервисов
docker compose -f docker-compose.prod.yml up -d

# Остановка всех сервисов
docker compose -f docker-compose.prod.yml down

# Перезапуск всех сервисов
docker compose -f docker-compose.prod.yml restart

# Перезапуск конкретного сервиса
docker compose -f docker-compose.prod.yml restart backend
docker compose -f docker-compose.prod.yml restart frontend
docker compose -f docker-compose.prod.yml restart nginx

# Статус контейнеров
docker compose -f docker-compose.prod.yml ps

# Использование ресурсов
docker stats
```

---

## 📝 Логи

```bash
# Все логи (следить в реальном времени)
docker compose -f docker-compose.prod.yml logs -f

# Логи конкретного сервиса
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f postgres
docker compose -f docker-compose.prod.yml logs -f nginx

# Последние 100 строк логов
docker compose -f docker-compose.prod.yml logs --tail=100

# Логи с временными метками
docker compose -f docker-compose.prod.yml logs -f --timestamps

# Поиск ошибок в логах
docker compose -f docker-compose.prod.yml logs | grep -i error
docker compose -f docker-compose.prod.yml logs | grep -i warning
```

---

## 💾 Резервное копирование

```bash
# Создать полный бэкап
./scripts/backup.sh

# Ручное создание бэкапа БД
docker exec hi-catering-postgres pg_dump -U strapi_prod hi_catering_prod | gzip > backup_$(date +%Y%m%d).sql.gz

# Бэкап загруженных файлов
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz backend/public/uploads/

# Восстановление (интерактивное меню)
./scripts/restore.sh
```

---

## 🔄 Обновление проекта

```bash
# Стандартное обновление
cd /var/www/hi-catering
./scripts/backup.sh
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build

# Обновление с очисткой кеша
docker compose -f docker-compose.prod.yml down
docker system prune -a
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 🗄 База данных

```bash
# Вход в PostgreSQL
docker exec -it hi-catering-postgres psql -U strapi_prod -d hi_catering_prod

# Список таблиц (внутри psql)
\dt

# Выход из psql
\q

# Размер базы данных
docker exec hi-catering-postgres psql -U strapi_prod -d hi_catering_prod -c "SELECT pg_size_pretty(pg_database_size('hi_catering_prod'));"

# Экспорт базы данных
docker exec hi-catering-postgres pg_dump -U strapi_prod hi_catering_prod > db_backup.sql

# Импорт базы данных
cat db_backup.sql | docker exec -i hi-catering-postgres psql -U strapi_prod hi_catering_prod
```

---

## 🔧 Работа с контейнерами

```bash
# Войти в контейнер backend
docker exec -it hi-catering-backend sh

# Войти в контейнер frontend
docker exec -it hi-catering-frontend sh

# Выполнить команду в контейнере
docker exec hi-catering-backend npm run seed:all

# Копировать файл из контейнера
docker cp hi-catering-backend:/app/.env ./backend.env

# Копировать файл в контейнер
docker cp local-file.txt hi-catering-backend:/app/
```

---

## 🔐 SSL сертификаты

```bash
# Получение нового сертификата Let's Encrypt
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Обновление сертификатов
sudo certbot renew

# Копирование сертификатов в проект
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem infra/nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem infra/nginx/ssl/
sudo chown -R $USER:$USER infra/nginx/ssl

# Проверка срока действия сертификата
sudo certbot certificates

# Тест обновления (без реального обновления)
sudo certbot renew --dry-run
```

---

## 🌐 Nginx

```bash
# Проверка конфигурации Nginx
docker compose -f docker-compose.prod.yml exec nginx nginx -t

# Перезагрузка конфигурации Nginx
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload

# Перезапуск Nginx
docker compose -f docker-compose.prod.yml restart nginx

# Просмотр логов Nginx
docker compose -f docker-compose.prod.yml logs -f nginx
```

---

## 🧹 Очистка

```bash
# Удалить остановленные контейнеры
docker container prune

# Удалить неиспользуемые образы
docker image prune -a

# Удалить неиспользуемые volumes
docker volume prune

# Полная очистка системы Docker (ОСТОРОЖНО!)
docker system prune -a --volumes

# Просмотр использования диска Docker
docker system df
```

---

## 📊 Мониторинг

```bash
# Использование ресурсов контейнерами
docker stats

# Использование диска
df -h

# Использование диска в директории проекта
du -sh /var/www/hi-catering/*

# Проверка открытых портов
sudo netstat -tulpn | grep -E ':(80|443|1337|3000|5432|6379)'

# Проверка процессов Docker
ps aux | grep docker

# Системные логи Docker
journalctl -u docker -f

# Проверка памяти
free -h

# Загрузка CPU
top
# или
htop
```

---

## 🔍 Диагностика

```bash
# Проверка здоровья контейнеров
docker compose -f docker-compose.prod.yml ps

# Инспекция контейнера
docker inspect hi-catering-backend

# Инспекция сети
docker network inspect hi-catering_hi-catering-network

# Проверка переменных окружения
docker compose -f docker-compose.prod.yml exec backend env

# Тест подключения к БД
docker compose -f docker-compose.prod.yml exec backend node -e "require('pg').Client({host:'postgres',port:5432,user:'strapi_prod',password:process.env.DATABASE_PASSWORD,database:'hi_catering_prod'}).connect((e,c)=>console.log(e?'Error':'Connected'))"

# Проверка доступности сервисов
curl http://localhost:3000  # Frontend
curl http://localhost:1337  # Backend
curl http://localhost  # Nginx
```

---

## 🛠 Strapi (Backend)

```bash
# Создание администратора (если нужно)
docker exec -it hi-catering-backend npm run strapi admin:create-user

# Сброс пароля администратора
docker exec -it hi-catering-backend npm run strapi admin:reset-user-password

# Заполнение данными
docker exec -it hi-catering-backend npm run seed:all

# Публикация всех данных
docker exec -it hi-catering-backend npm run publish:all

# Настройка разрешений API
docker exec -it hi-catering-backend npm run setup:permissions

# Консоль Strapi
docker exec -it hi-catering-backend npm run strapi console
```

---

## 🔥 Экстренные ситуации

### Сайт не работает

```bash
# 1. Проверить статус контейнеров
docker compose -f docker-compose.prod.yml ps

# 2. Проверить логи на ошибки
docker compose -f docker-compose.prod.yml logs --tail=100 | grep -i error

# 3. Перезапустить все сервисы
docker compose -f docker-compose.prod.yml restart

# 4. Если не помогло - полный перезапуск
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d
```

### База данных не отвечает

```bash
# 1. Проверить статус PostgreSQL
docker compose -f docker-compose.prod.yml ps postgres

# 2. Проверить логи
docker compose -f docker-compose.prod.yml logs postgres

# 3. Перезапустить PostgreSQL
docker compose -f docker-compose.prod.yml restart postgres

# 4. Восстановить из бэкапа (если повреждена)
./scripts/restore.sh
```

### Диск заполнен

```bash
# 1. Проверить использование
df -h

# 2. Найти большие файлы
du -sh /var/www/hi-catering/* | sort -rh | head -20

# 3. Очистить Docker
docker system prune -a --volumes

# 4. Удалить старые бэкапы
find /var/www/backups -name "*.sql.gz" -mtime +30 -delete

# 5. Очистить логи
sudo journalctl --vacuum-time=7d
```

### SSL сертификат истек

```bash
# 1. Обновить сертификат
sudo certbot renew

# 2. Скопировать в проект
sudo cp /etc/letsencrypt/live/yourdomain.com/*.pem /var/www/hi-catering/infra/nginx/ssl/

# 3. Перезапустить Nginx
docker compose -f docker-compose.prod.yml restart nginx
```

---

## ⚡ Быстрые проверки

```bash
# Все ли работает?
curl -I https://yourdomain.com
curl -I https://api.yourdomain.com

# Статус всех сервисов одной командой
docker compose -f docker-compose.prod.yml ps && \
docker stats --no-stream && \
df -h | grep -E '^/dev/'

# Быстрый хелсчек
echo "=== Containers ===" && \
docker compose -f docker-compose.prod.yml ps && \
echo -e "\n=== Disk Usage ===" && \
df -h / && \
echo -e "\n=== Memory ===" && \
free -h && \
echo -e "\n=== Recent Errors ===" && \
docker compose -f docker-compose.prod.yml logs --tail=20 | grep -i error
```

---

## 📱 Полезные алиасы

Добавьте в `~/.bashrc` или `~/.zshrc`:

```bash
# Hi-Catering aliases
alias hc-cd='cd /var/www/hi-catering'
alias hc-up='cd /var/www/hi-catering && docker compose -f docker-compose.prod.yml up -d'
alias hc-down='cd /var/www/hi-catering && docker compose -f docker-compose.prod.yml down'
alias hc-restart='cd /var/www/hi-catering && docker compose -f docker-compose.prod.yml restart'
alias hc-logs='cd /var/www/hi-catering && docker compose -f docker-compose.prod.yml logs -f'
alias hc-ps='cd /var/www/hi-catering && docker compose -f docker-compose.prod.yml ps'
alias hc-backup='cd /var/www/hi-catering && ./scripts/backup.sh'
alias hc-deploy='cd /var/www/hi-catering && ./scripts/deploy.sh'
alias hc-stats='docker stats'

# После добавления выполните:
source ~/.bashrc  # или source ~/.zshrc
```

---

## 🔗 Быстрые ссылки

- 📖 [Полная документация](./README.md)
- 🚀 [Быстрый старт](./QUICK-START.md)
- 📦 [Установка на сервер](./DEPLOYMENT.md)
- 🖥 [Выбор хостинга](./SERVER-RECOMMENDATIONS.md)

---

**Сохраните эту шпаргалку в закладки! 📌**

*Последнее обновление: 7 ноября 2025*

