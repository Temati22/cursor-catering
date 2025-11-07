#!/bin/bash

#############################################
# Hi-Catering Production Deployment Script
#############################################

set -e  # Выход при любой ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функции для цветного вывода
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

# Проверка наличия необходимых команд
check_requirements() {
    info "Проверка требований..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker не установлен. Установите Docker перед продолжением."
    fi
    
    if ! command -v docker compose &> /dev/null; then
        error "Docker Compose не установлен. Установите Docker Compose перед продолжением."
    fi
    
    success "Все требования выполнены"
}

# Проверка .env файла
check_env() {
    info "Проверка файла окружения..."
    
    if [ ! -f .env ]; then
        error "Файл .env не найден. Создайте его на основе env.example"
    fi
    
    # Проверка критических переменных
    required_vars=(
        "DATABASE_PASSWORD"
        "REDIS_PASSWORD"
        "APP_KEYS"
        "API_TOKEN_SALT"
        "ADMIN_JWT_SECRET"
        "JWT_SECRET"
    )
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" .env; then
            error "Переменная окружения ${var} не найдена в .env файле"
        fi
        
        value=$(grep "^${var}=" .env | cut -d '=' -f2-)
        if [[ "$value" == "toBeModified"* ]] || [[ -z "$value" ]]; then
            error "Переменная ${var} имеет значение по умолчанию. Пожалуйста, установите уникальное значение."
        fi
    done
    
    success "Файл окружения проверен"
}

# Проверка SSL сертификатов
check_ssl() {
    info "Проверка SSL сертификатов..."
    
    if [ ! -f infra/nginx/ssl/fullchain.pem ] || [ ! -f infra/nginx/ssl/privkey.pem ]; then
        warning "SSL сертификаты не найдены в infra/nginx/ssl/"
        warning "Приложение будет работать только по HTTP на порту 80"
        warning "Для HTTPS установите сертификаты или используйте Let's Encrypt"
        read -p "Продолжить без HTTPS? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            error "Деплой отменен"
        fi
    else
        success "SSL сертификаты найдены"
    fi
}

# Создание резервной копии
create_backup() {
    info "Создание резервной копии..."
    
    BACKUP_DIR="backups"
    mkdir -p $BACKUP_DIR
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    
    # Бэкап базы данных (если контейнер запущен)
    if docker ps | grep -q hi-catering-postgres; then
        info "Создание бэкапа базы данных..."
        docker exec hi-catering-postgres pg_dump -U strapi_prod hi_catering_prod > $BACKUP_DIR/db_backup_$TIMESTAMP.sql || warning "Не удалось создать бэкап базы данных"
    fi
    
    # Бэкап загруженных файлов
    if [ -d backend/public/uploads ]; then
        info "Создание бэкапа загруженных файлов..."
        tar -czf $BACKUP_DIR/uploads_backup_$TIMESTAMP.tar.gz backend/public/uploads || warning "Не удалось создать бэкап файлов"
    fi
    
    success "Резервные копии созданы в $BACKUP_DIR/"
}

# Остановка контейнеров
stop_containers() {
    info "Остановка существующих контейнеров..."
    
    if docker compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        docker compose -f docker-compose.prod.yml down
        success "Контейнеры остановлены"
    else
        info "Контейнеры не запущены"
    fi
}

# Сборка и запуск контейнеров
build_and_start() {
    info "Сборка и запуск контейнеров..."
    
    # Сборка образов
    docker compose -f docker-compose.prod.yml build --no-cache
    
    # Запуск контейнеров
    docker compose -f docker-compose.prod.yml up -d
    
    success "Контейнеры запущены"
}

# Проверка здоровья сервисов
check_health() {
    info "Проверка здоровья сервисов..."
    
    # Ожидание запуска сервисов
    sleep 10
    
    # Проверка статуса контейнеров
    if ! docker compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        error "Некоторые контейнеры не запустились. Проверьте логи: docker compose -f docker-compose.prod.yml logs"
    fi
    
    # Ожидание готовности backend (максимум 2 минуты)
    info "Ожидание готовности backend..."
    for i in {1..24}; do
        if docker compose -f docker-compose.prod.yml exec -T backend node -e "require('http').get('http://localhost:1337/_health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" &> /dev/null; then
            success "Backend готов к работе"
            break
        fi
        
        if [ $i -eq 24 ]; then
            error "Backend не запустился в течение 2 минут. Проверьте логи: docker compose -f docker-compose.prod.yml logs backend"
        fi
        
        echo -n "."
        sleep 5
    done
    
    # Ожидание готовности frontend (максимум 1 минута)
    info "Ожидание готовности frontend..."
    for i in {1..12}; do
        if docker compose -f docker-compose.prod.yml exec -T frontend node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" &> /dev/null; then
            success "Frontend готов к работе"
            break
        fi
        
        if [ $i -eq 12 ]; then
            error "Frontend не запустился в течение 1 минуты. Проверьте логи: docker compose -f docker-compose.prod.yml logs frontend"
        fi
        
        echo -n "."
        sleep 5
    done
    
    success "Все сервисы работают корректно"
}

# Показать информацию о деплое
show_info() {
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}   Деплой завершен успешно! 🚀${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    
    SITE_URL=$(grep "^NEXT_PUBLIC_SITE_URL=" .env | cut -d '=' -f2-)
    API_URL=$(grep "^NEXT_PUBLIC_STRAPI_URL=" .env | cut -d '=' -f2-)
    
    echo -e "${BLUE}Сайт доступен по адресу:${NC}"
    echo -e "  ${YELLOW}$SITE_URL${NC}"
    echo ""
    echo -e "${BLUE}Админ-панель Strapi:${NC}"
    echo -e "  ${YELLOW}$API_URL/admin${NC}"
    echo ""
    echo -e "${BLUE}Полезные команды:${NC}"
    echo -e "  Просмотр логов:      ${YELLOW}docker compose -f docker-compose.prod.yml logs -f${NC}"
    echo -e "  Статус контейнеров:  ${YELLOW}docker compose -f docker-compose.prod.yml ps${NC}"
    echo -e "  Остановить:          ${YELLOW}docker compose -f docker-compose.prod.yml down${NC}"
    echo -e "  Перезапустить:       ${YELLOW}docker compose -f docker-compose.prod.yml restart${NC}"
    echo ""
}

# Основная функция
main() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}   Hi-Catering Deployment Script${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    
    check_requirements
    check_env
    check_ssl
    
    # Подтверждение деплоя
    read -p "$(echo -e ${YELLOW}Начать деплой? ${GREEN}[y/N]${NC} )" -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        warning "Деплой отменен"
        exit 0
    fi
    
    create_backup
    stop_containers
    build_and_start
    check_health
    show_info
}

# Обработка аргументов командной строки
case "${1:-}" in
    --no-backup)
        info "Деплой без создания резервной копии"
        check_requirements
        check_env
        check_ssl
        stop_containers
        build_and_start
        check_health
        show_info
        ;;
    --help|-h)
        echo "Использование: $0 [OPTIONS]"
        echo ""
        echo "OPTIONS:"
        echo "  --no-backup    Пропустить создание резервной копии"
        echo "  --help, -h     Показать эту справку"
        echo ""
        exit 0
        ;;
    *)
        main
        ;;
esac

