#!/bin/bash

#############################################
# Hi-Catering Backup Script
#############################################

set -e

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Настройки
BACKUP_DIR="${BACKUP_DIR:-/var/www/backups}"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Создание директории для бэкапов
mkdir -p "$BACKUP_DIR"

info "Начало создания резервной копии..."

# Бэкап базы данных PostgreSQL
if docker ps | grep -q hi-catering-postgres; then
    info "Создание бэкапа базы данных PostgreSQL..."
    
    # Получение данных подключения из .env
    if [ -f .env ]; then
        export $(cat .env | grep -v '^#' | xargs)
    fi
    
    DB_USER=${DATABASE_USERNAME:-strapi_prod}
    DB_NAME=${DATABASE_NAME:-hi_catering_prod}
    
    docker exec hi-catering-postgres pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_DIR/db_backup_$DATE.sql.gz"
    success "Бэкап базы данных создан: db_backup_$DATE.sql.gz"
else
    error "Контейнер PostgreSQL не запущен"
fi

# Бэкап загруженных файлов Strapi
if [ -d backend/public/uploads ]; then
    info "Создание бэкапа загруженных файлов..."
    tar -czf "$BACKUP_DIR/uploads_backup_$DATE.tar.gz" -C backend/public uploads
    success "Бэкап файлов создан: uploads_backup_$DATE.tar.gz"
fi

# Бэкап данных Strapi (включая SQLite если используется)
if [ -d backend/data ]; then
    info "Создание бэкапа данных Strapi..."
    tar -czf "$BACKUP_DIR/strapi_data_backup_$DATE.tar.gz" -C backend data
    success "Бэкап данных Strapi создан: strapi_data_backup_$DATE.tar.gz"
fi

# Бэкап .env файла
if [ -f .env ]; then
    info "Создание бэкапа .env файла..."
    cp .env "$BACKUP_DIR/env_backup_$DATE"
    success "Бэкап .env создан: env_backup_$DATE"
fi

# Удаление старых бэкапов
info "Удаление бэкапов старше $RETENTION_DAYS дней..."
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "env_backup_*" -mtime +$RETENTION_DAYS -delete

# Подсчет размера бэкапов
BACKUP_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
success "Резервное копирование завершено! Общий размер бэкапов: $BACKUP_SIZE"

# Вывод списка созданных бэкапов
echo ""
info "Созданные бэкапы:"
ls -lh "$BACKUP_DIR"/*_$DATE* 2>/dev/null || true

echo ""
info "Расположение бэкапов: $BACKUP_DIR"

