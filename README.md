# Wipro Capstone 2026

Capstone project using Angular, Spring Boot, MySQL, Kafka, Eureka, Gateway and Microservices.

---
inclusion: auto
---

<<<<<<< HEAD
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
=======
# Data Models & Entity Design

## Databases
- `wipro_user_db` — shared between User-MS-W and User-MS-R
- `wipro_product_db` — Product Service
- `wipro_order_db` — Order Service (orders + cart)

All use MySQL with `com.mysql.cj.jdbc.Driver`.

## Entity Classes

### User (user-ms-w / user-ms-r)
Table: `users`
```
id          int (PK, auto-increment)
username    String
email       String
password    String (encoded with PasswordEncoder)
address     String
userType    int (0 = ADMIN, 1 = CUSTOMER)
```

### Product (product-service)
Table: `products`
```
id           int (PK, auto-increment)
prodName     String
prodDesc     String
prodCat      String
make         String
availableQty int
price        double
uom          String
prodRating   double
imageURL     String
```

### Order (order-service) — Aggregate Root
Table: `orders`
```
orderId      int (PK, auto-increment)
userId       String
items        List<OrderItem> (OneToMany, cascade ALL, orphanRemoval, EAGER)
totalAmount  double
orderStatus  String ("PENDING", "CANCELLED")
orderDate    LocalDateTime
```

### OrderItem (order-service) — Child Entity
Table: inferred from JPA
```
id          (PK, auto-increment)
productId   int
quantity    int
order       Order (ManyToOne, mapped by "order")
```

### CartItem (order-service)
Table: `cart_items` (inferred)
```
cartId      int (PK, auto-increment)
userId      String
productId   int
quantity    int
```
- Unique constraint on (userId, productId)

## DTOs

### OrderEventDto (Kafka message payload)
Used for inter-service communication via Kafka topics.
```
orderId     int
items       List<OrderItemDto>
```

### OrderItemDto
```
productId   int
quantity    int
```

### ProductDto (OpenFeign response in Order Service)
```
id           int
prodName     String
price        double
availableQty int
```

### CartItemResponse (enriched cart view)
Returned by `/cart/{userId}` — includes product name and price resolved from Product Service.

### AuthApiResponse
```
token       String (nulled out before sending to client — stored in cookie)
username    String
userType    int
message     String
```
>>>>>>> eb48b07 (Update README.md)
