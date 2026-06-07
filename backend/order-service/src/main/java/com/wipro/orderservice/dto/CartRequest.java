package com.wipro.orderservice.dto;

import lombok.Data;

@Data
public class CartRequest {
    private String userId;
    private int productId;
    private int quantity;
}
