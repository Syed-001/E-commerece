package com.wipro.orderservice.service;

import com.wipro.orderservice.entity.Order;

import java.util.List;

public interface OrderService {

    Order createOrderFromCart(String userId);

    Order cancelOrder(int orderId);

    List<Order> getAllOrders();

    List<Order> getOrdersByUserId(String userId);

    Order getOrderById(int orderId);
}
