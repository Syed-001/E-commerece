package com.wipro.productservice.dto;
import lombok.Data;
import java.util.List;

@Data
public class OrderEventDto {
    private int orderId;
    private List<OrderItemDto> items;
}