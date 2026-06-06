package com.wipro.orderservice.service;

import com.wipro.orderservice.entity.Order;

public interface OrderService {
    Order placeOrder(Order order); 
}