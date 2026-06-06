package com.wipro.orderservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private int id;
    
    private int productId;
    private int quantity;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private Order order;
}