package com.wipro.orderservice.service.impl;

import com.wipro.orderservice.client.ProductClient;
import com.wipro.orderservice.dto.OrderEventDto;
import com.wipro.orderservice.dto.OrderItemDto;
import com.wipro.orderservice.dto.ProductDto;
import com.wipro.orderservice.entity.CartItem;
import com.wipro.orderservice.entity.Order;
import com.wipro.orderservice.entity.OrderItem;
import com.wipro.orderservice.repo.CartRepository;
import com.wipro.orderservice.repo.OrderRepository;
import com.wipro.orderservice.service.CartService;
import com.wipro.orderservice.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductClient productClient;

    @Autowired
    private KafkaTemplate<String, OrderEventDto> kafkaTemplate;

    @Override
    @Transactional
    public Order createOrderFromCart(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new RuntimeException("userId is required");
        }

        List<CartItem> cartItems = cartRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty for user: " + userId);
        }

        Order order = new Order();
        order.setUserId(userId);
        order.setItems(new ArrayList<>());

        double calculatedTotal = 0.0;
        for (CartItem cartItem : cartItems) {
            ProductDto product = productClient.getProductById(cartItem.getProductId());
            if (product.getAvailableQty() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for Product ID: " + cartItem.getProductId());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(cartItem.getProductId());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setOrder(order);
            order.getItems().add(orderItem);

            calculatedTotal += product.getPrice() * cartItem.getQuantity();
        }

        order.setTotalAmount(calculatedTotal);
        order.setOrderStatus("CONFIRMED");
        order.setOrderDate(LocalDateTime.now());
        Order savedOrder = orderRepository.save(order);

        List<OrderItemDto> itemDtos = savedOrder.getItems().stream()
                .map(item -> new OrderItemDto(item.getProductId(), item.getQuantity()))
                .collect(Collectors.toList());

        kafkaTemplate.send("order-placed-topic", new OrderEventDto(savedOrder.getOrderId(), itemDtos));
        cartService.clearCart(userId);

        return savedOrder;
    }

    @Override
    @Transactional
    public Order cancelOrder(int orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        if ("CANCELLED".equalsIgnoreCase(order.getOrderStatus())) {
            throw new RuntimeException("Order is already cancelled");
        }

        order.setOrderStatus("CANCELLED");
        return orderRepository.save(order);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    @Override
    public List<Order> getOrdersByUserId(String userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId);
    }

    @Override
    public Order getOrderById(int orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
    }

    @KafkaListener(topics = "inventory-failed-topic", groupId = "order-group")
    public void handleInventoryFailureCompensation(OrderEventDto event) {
        Order order = orderRepository.findById(event.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setOrderStatus("CANCELLED");
        orderRepository.save(order);
    }
}
