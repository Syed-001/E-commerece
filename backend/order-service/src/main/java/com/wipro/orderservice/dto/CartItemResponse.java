package com.wipro.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    private int cartId;
    private String userId;
    private int productId;
    private String productName;
    private double price;
    private int quantity;
}
