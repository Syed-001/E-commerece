package com.wipro.productservice.service.impl;

import com.wipro.productservice.entity.Product;
import com.wipro.productservice.exception.ResourceNotFoundException;
import com.wipro.productservice.repo.ProductRepository;
import com.wipro.productservice.service.ProductService;
import com.wipro.productservice.dto.OrderEventDto;
import com.wipro.productservice.dto.OrderItemDto;  

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {
	
	@Autowired
	private KafkaTemplate<String, OrderEventDto> kafkaTemplate;

    @Autowired
    private ProductRepository repo;

    @Override
    public Product addProduct(Product product) {
        return repo.save(product);
    }
    
    @Override
    public List<Product> saveAllProducts(List<Product> products) {
        return repo.saveAll(products);
    }

    @Override
    public Product updateProduct(int id, Product product) {
        Product existing = getProductById(id);
        existing.setProdName(product.getProdName());
        existing.setPrice(product.getPrice());
        existing.setAvailableQty(product.getAvailableQty());
        return repo.save(existing);
    }

    @Override
    public void deleteProduct(int id) {
        repo.deleteById(id);
    }

    @Override
    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    @Override
    public Product getProductById(int id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    @Override
    public List<Product> getProductsByCategory(String category) {
        return repo.findByProdCat(category);
    }



    @KafkaListener(topics = "order-placed-topic", groupId = "product-group")
    public void handleOrderPlaced(OrderEventDto event) {
        try {
            System.out.println("Deducting inventory for Order ID: " + event.getOrderId());
            
            for (OrderItemDto item : event.getItems()) {
                Product product = repo.findById(item.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found"));
                
                if(product.getAvailableQty() < item.getQuantity()) {
                    throw new RuntimeException("Not enough stock in database");
                }
                
                product.setAvailableQty(product.getAvailableQty() - item.getQuantity());
                repo.save(product);
            }
            // Optional: Send to 'inventory-success-topic' to update order to COMPLETED
        } catch (Exception e) {
            System.err.println("Inventory deduction failed: " + e.getMessage());
            // SAGA ROLLBACK: Tell Order Service to cancel the order!
            kafkaTemplate.send("inventory-failed-topic", event);
        }
    }

    @KafkaListener(topics = "payment-failed-topic", groupId = "product-group")
    public void handlePaymentFailure(OrderEventDto event) {
        System.out.println("Restoring inventory for Order ID: " + event.getOrderId());
        
        for (OrderItemDto item : event.getItems()) {
            Product product = repo.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            
            product.setAvailableQty(product.getAvailableQty() + item.getQuantity());
            repo.save(product);
        }
    }
}