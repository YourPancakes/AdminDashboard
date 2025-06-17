# Admin Dashboard 

## About the Project

Minimal Admin Dashboard solution using ASP.NET Core 8 (Minimal API) and React (Vite), demonstrating:

- REST API with EF Core + PostgreSQL (migrations, seeding)  
- JWT authentication (HS256)  
- React frontend with routing and token storage  
- Docker Compose and CI/CD (GitHub Actions) with tests  

---

## 🚀 Быстрый старт

1. Clone the repository and run:  
   ```bash
   git clone https://github.com/YourPancakes/AdminDashboard.git
   cd AdminDashboard
   docker-compose up --build

2. Frontend at http://localhost:5173  
3. API at http://localhost:5000  
4. Login credentials: admin@mirra.dev / admin123  

(Windows)
Obtaining a token via curl:
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
