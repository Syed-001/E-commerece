package com.wipro.orderservice.service.impl;

import com.wipro.orderservice.entity.Order;
import com.wipro.orderservice.entity.OrderItem;
import com.wipro.orderservice.client.ProductClient;
import com.wipro.orderservice.dto.ProductDto;
import com.wipro.orderservice.dto.OrderEventDto; 
import com.wipro.orderservice.dto.OrderItemDto; 
import com.wipro.orderservice.repo.OrderRepository;
import com.wipro.orderservice.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private ProductClient productClient;
    @Autowired private KafkaTemplate<String, OrderEventDto> kafkaTemplate;

    @Override
    public Order placeOrder(Order order) {
        double calculatedTotal = 0.0;

        for (OrderItem item : order.getItems()) {
            ProductDto product = productClient.getProductById(item.getProductId());
            if (product.getAvailableQty() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for Product ID: " + item.getProductId());
            }
            calculatedTotal += (product.getPrice() * item.getQuantity());
            item.setOrder(order);
        }

 
        order.setTotalAmount(calculatedTotal);
        order.setOrderStatus("PENDING"); 
        order.setOrderDate(LocalDateTime.now());
        Order savedOrder = orderRepository.save(order);

        // Asynchronous Kafka Call: Initiate SAGA pattern
        List<OrderItemDto> itemDtos = savedOrder.getItems().stream()
                .map(item -> new OrderItemDto(item.getProductId(), item.getQuantity()))
                .collect(Collectors.toList());

        kafkaTemplate.send("order-placed-topic", new OrderEventDto(savedOrder.getOrderId(), itemDtos));
        System.out.println("SAGA Initiated: Order ID " + savedOrder.getOrderId());
            
        return savedOrder;
    }

    @KafkaListener(topics = "inventory-failed-topic", groupId = "order-group")
    public void handleInventoryFailureCompensation(OrderEventDto event) {
        System.out.println("SAGA Rollback: Inventory failed. Cancelling Order ID: " + event.getOrderId());
        Order order = orderRepository.findById(event.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setOrderStatus("CANCELLED");
        orderRepository.save(order);
    }
}