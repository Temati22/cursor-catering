#!/bin/bash

#############################################
# Hi-Catering Restore Script
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

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Настройки
BACKUP_DIR="${BACKUP_DIR:-/var/www/backups}"

# Проверка наличия директории с бэкапами
if [ ! -d "$BACKUP_DIR" ]; then
    error "Директория с бэкапами не найдена: $BACKUP_DIR"
fi

# Функция для выбора бэкапа
select_backup() {
    local backup_type=$1
    local pattern=$2
    
    echo ""
    info "Доступные бэкапы ($backup_type):"
    
    backups=($(ls -t "$BACKUP_DIR"/$pattern 2>/dev/null))
    
    if [ ${#backups[@]} -eq 0 ]; then
        error "Бэкапы типа '$backup_type' не найдены"
    fi
    
    for i in "${!backups[@]}"; do
        echo "  $((i+1)). $(basename ${backups[$i]}) ($(ls -lh ${backups[$i]} | awk '{print $5}'))"
    done
    
    echo ""
    read -p "Выберите номер бэкапа для восстановления: " choice
    
    if ! [[ "$choice" =~ ^[0-9]+$ ]] || [ "$choice" -lt 1 ] || [ "$choice" -gt ${#backups[@]} ]; then
        error "Неверный выбор"
    fi
    
    selected_backup="${backups[$((choice-1))]}"
    echo "$selected_backup"
}

# Функция восстановления базы данных
restore_database() {
    info "Восстановление базы данных..."
    
    backup_file=$(select_backup "База данных" "db_backup_*.sql.gz")
    
    warning "ВНИМАНИЕ: Текущая база данных будет полностью перезаписана!"
    read -p "Продолжить? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        warning "Восстановление отменено"
        return
    fi
    
    # Проверка, что PostgreSQL запущен
    if ! docker ps | grep -q hi-catering-postgres; then
        error "Контейнер PostgreSQL не запущен. Запустите его командой: docker compose -f docker-compose.prod.yml up -d postgres"
    fi
    
    # Получение данных подключения
    if [ -f .env ]; then
        export $(cat .env | grep -v '^#' | xargs)
    fi
    
    DB_USER=${DATABASE_USERNAME:-strapi_prod}
    DB_NAME=${DATABASE_NAME:-hi_catering_prod}
    
    # Удаление существующей базы и создание новой
    info "Пересоздание базы данных..."
    docker exec hi-catering-postgres psql -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
    docker exec hi-catering-postgres psql -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;"
    
    # Восстановление из бэкапа
    info "Восстановление данных..."
    gunzip < "$backup_file" | docker exec -i hi-catering-postgres psql -U "$DB_USER" -d "$DB_NAME"
    
    success "База данных успешно восстановлена из $backup_file"
}

# Функция восстановления файлов
restore_uploads() {
    info "Восстановление загруженных файлов..."
    
    backup_file=$(select_backup "Загруженные файлы" "uploads_backup_*.tar.gz")
    
    warning "ВНИМАНИЕ: Текущие загруженные файлы будут перезаписаны!"
    read -p "Продолжить? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        warning "Восстановление отменено"
        return
    fi
    
    # Создание резервной копии текущих файлов
    if [ -d backend/public/uploads ]; then
        info "Создание резервной копии текущих файлов..."
        backup_name="uploads_before_restore_$(date +%Y%m%d_%H%M%S).tar.gz"
        tar -czf "$BACKUP_DIR/$backup_name" -C backend/public uploads
        info "Резервная копия создана: $backup_name"
    fi
    
    # Удаление текущих файлов
    rm -rf backend/public/uploads
    
    # Восстановление из бэкапа
    info "Восстановление файлов..."
    tar -xzf "$backup_file" -C backend/public
    
    success "Файлы успешно восстановлены из $backup_file"
}

# Функция восстановления данных Strapi
restore_strapi_data() {
    info "Восстановление данных Strapi..."
    
    backup_file=$(select_backup "Данные Strapi" "strapi_data_backup_*.tar.gz")
    
    warning "ВНИМАНИЕ: Текущие данные Strapi будут перезаписаны!"
    read -p "Продолжить? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        warning "Восстановление отменено"
        return
    fi
    
    # Создание резервной копии текущих данных
    if [ -d backend/data ]; then
        info "Создание резервной копии текущих данных..."
        backup_name="strapi_data_before_restore_$(date +%Y%m%d_%H%M%S).tar.gz"
        tar -czf "$BACKUP_DIR/$backup_name" -C backend data
        info "Резервная копия создана: $backup_name"
    fi
    
    # Удаление текущих данных
    rm -rf backend/data
    
    # Восстановление из бэкапа
    info "Восстановление данных..."
    tar -xzf "$backup_file" -C backend
    
    success "Данные Strapi успешно восстановлены из $backup_file"
}

# Главное меню
main_menu() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}   Hi-Catering Restore Script${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    echo "Что вы хотите восстановить?"
    echo "  1. База данных PostgreSQL"
    echo "  2. Загруженные файлы (uploads)"
    echo "  3. Данные Strapi (data)"
    echo "  4. Все (полное восстановление)"
    echo "  5. Выход"
    echo ""
    read -p "Выберите опцию (1-5): " choice
    
    case $choice in
        1)
            restore_database
            ;;
        2)
            restore_uploads
            ;;
        3)
            restore_strapi_data
            ;;
        4)
            restore_database
            restore_uploads
            restore_strapi_data
            success "Полное восстановление завершено!"
            ;;
        5)
            info "Выход..."
            exit 0
            ;;
        *)
            error "Неверный выбор"
            ;;
    esac
    
    echo ""
    info "После восстановления рекомендуется перезапустить приложение:"
    echo "  docker compose -f docker-compose.prod.yml restart"
}

# Запуск главного меню
main_menu

