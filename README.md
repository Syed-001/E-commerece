# Wipro Capstone 2026

Capstone project using Angular, Spring Boot, MySQL, Kafka, Eureka, Gateway and Microservices.

---
inclusion: auto
---

# Build, Run & Development Guide

## Prerequisites
- Java 17
- Maven (via included mvnw wrapper)
- MySQL running on localhost:3306
- Apache Kafka on localhost:9092
- Node.js with npm 11.13+
- Angular CLI 21

## Startup Order

Services must be started in this order:
1. **MySQL** — databases auto-create via `createDatabaseIfNotExist=true`
2. **Kafka** — required before order-service and product-service
3. **Eureka Server** (port 8761) — service registry
4. **Config Server** (port 8888) — centralized config
5. **User-MS-W** (port 8081) — user writes
6. **User-MS-R** (port 8084) — user reads
7. **Product Service** (port 8082) — product management
8. **Order Service** (port 8083) — orders and cart
9. **API Gateway** (port 9999) — single entry point
10. **Angular Frontend** (port 4200) — UI

## Running Backend Services

Each service uses Maven Wrapper:
```bash
# From each service directory:
./mvnw spring-boot:run
```

## Running Frontend

```bash
cd frontend/ecommerce
npm install
npm start    # ng serve on port 4200
```

## Database Credentials (Local Dev)
- Username: `root`
- Password: `root`
- Databases: `wipro_user_db`, `wipro_product_db`, `wipro_order_db`

## Config Server Notes
- Uses native profile (local filesystem, not Git)
- Config location: `file:///D:/wipro_capstone_2026/backend/config-repo/`
- Provides datasource config to product-service and order-service
- Services use `spring.config.import=optional:configserver:http://localhost:8888`

## Kafka Topics
- `order-placed-topic` — auto-created by Spring Kafka
- `inventory-failed-topic` — auto-created by Spring Kafka
- Consumer groups: `product-group`, `order-group`

## Swagger UI Access
- Product Service: http://localhost:8082/swagger-ui.html
- Order Service: http://localhost:8083/swagger-ui.html
- User-MS-W: http://localhost:8081/swagger-ui.html
- User-MS-R: http://localhost:8084/swagger-ui.html

## Testing
- Backend: JUnit / Spring Boot Test (`./mvnw test`)
- Frontend: Vitest (`npm run test`)

## Known Gaps / TODOs
- Eureka Server directory is empty (needs initialization)
- No admin panel routes in frontend (only customer flows exist)
- Config Server path is hardcoded to a local Windows path
- JWT secret is hardcoded and shared across services (not externalized)
