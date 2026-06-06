package com.wipro.orderservice.controller;

import com.wipro.orderservice.entity.Order;
import com.wipro.orderservice.service.OrderService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/order")
@Tag(name = "Order API", description = "Order processing and management")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Operation(summary = "Place a new order")
    @CircuitBreaker(name = "productService", fallbackMethod = "productServiceFallback")
    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestBody Order order) {
        return ResponseEntity.ok(orderService.placeOrder(order));
    }

    public ResponseEntity<?> productServiceFallback(Order order, Throwable t) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body("Service Unavailable: Please try later.");
    }
}