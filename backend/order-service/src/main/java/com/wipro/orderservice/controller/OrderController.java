package com.wipro.orderservice.controller;

import com.wipro.orderservice.dto.CreateOrderRequest;
import com.wipro.orderservice.entity.Order;
import com.wipro.orderservice.service.OrderService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
@Tag(name = "Order API", description = "Order processing and management")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Operation(summary = "Create an order from the user's cart")
    @CircuitBreaker(name = "productService", fallbackMethod = "createOrderFallback")
    @PostMapping("/order")
    public ResponseEntity<Order> createOrder(@RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(orderService.createOrderFromCart(request.getUserId()));
    }

    @Operation(summary = "Cancel an order")
    @PutMapping("/{orderId}")
    public ResponseEntity<Order> cancelOrder(@PathVariable int orderId) {
        return ResponseEntity.ok(orderService.cancelOrder(orderId));
    }

    @Operation(summary = "List all orders for all users")
    @GetMapping("/order")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @Operation(summary = "List orders for a particular user")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable String userId) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @Operation(summary = "Get order details by order ID")
    @GetMapping("/{orderId:\\d+}")
    public ResponseEntity<Order> getOrderById(@PathVariable int orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    public ResponseEntity<?> createOrderFallback(CreateOrderRequest request, Throwable t) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body("Service Unavailable: Please try later.");
    }
}
