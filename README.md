# Admin Dashboard (Minimal Slice)

## О проекте

Минимальное решение Admin Dashboard на ASP.NET Core 8 (Minimal API) и React (Vite), демонстрирующее:

- REST API с EF Core + PostgreSQL (миграции, сидирование)
- JWT-аутентификацию (HS256)
- React-фронтенд с маршрутизацией и хранением токена
- Docker Compose и CI/CD (GitHub Actions) с тестами

---

## 🚀 Быстрый старт

1. Клонировать репозиторий и запустить:
   ```bash
   git clone https://github.com/YourPancakes/AdminDashboard.git
   cd AdminDashboard-main
   docker-compose up --build

2. Frontend на http://localhost:5173
Api на http://localhost:5000
Данные для входа: admin@mirra.dev / admin123

(Windows)
Получение токена через curl:
```bash
curl.exe -X POST "http://localhost:5000/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@mirra.dev\",\"pwd\":\"admin123\"}"
```
Get All Clietns:
```bash
curl.exe "http://localhost:5000/clients" ^
  -H "Authorization: Bearer <TOKEN>"
```
Create new client:
```bash
curl.exe -X POST "http://localhost:5000/clients" ^
  -H "Authorization: Bearer TOKEN" ^ 
  -H "Content-Type: application/json" ^  
  -d "{\"name\":\"Dave\",\"email\":\"dave@example.com\",\"balanceT\":123.45}"
