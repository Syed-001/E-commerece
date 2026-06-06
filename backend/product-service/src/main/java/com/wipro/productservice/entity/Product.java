package com.wipro.productservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String prodName;
    private String prodDesc;
    private String prodCat;
    private String make;
    private int availableQty;
    private double price;
    private String uom;
    private double prodRating;
    private String imageURL;
    private LocalDate dateOfManufacture;
}