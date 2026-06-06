package com.wipro.productservice.dto;
import lombok.Data;

@Data
public class ProductDto {
    private String prodName;
    private String prodDesc;
    private String prodCat;
    private int availableQty;
    private double price;
}