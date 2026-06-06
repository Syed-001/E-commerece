package com.wipro.productservice.service;

import com.wipro.productservice.entity.Product;
import java.util.List;

public interface ProductService {
    Product addProduct(Product product);
    List<Product> saveAllProducts(List<Product> products);
    Product updateProduct(int id, Product product);
    void deleteProduct(int id);
    List<Product> getAllProducts();
    Product getProductById(int id);
    List<Product> getProductsByCategory(String category);
}