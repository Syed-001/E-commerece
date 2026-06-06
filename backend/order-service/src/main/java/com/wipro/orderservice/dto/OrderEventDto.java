package com.wipro.orderservice.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderEventDto {
    private int orderId;
    private List<OrderItemDto> items; 
}