package com.wipro.productservice.controller;

import com.wipro.productservice.entity.Product;
import com.wipro.productservice.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
@Tag(name = "Product Management API", description = "Operations for Product Catalogue and Inventory")
public class ProductController {

    @Autowired
    private ProductService service;

    @Operation(summary = "Add a new product", description = "Admin adds a new product to inventory.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product successfully created")
    })
    @PostMapping("/add")
    public ResponseEntity<Product> addProduct(@Valid @RequestBody Product product) {
        return ResponseEntity.ok(service.addProduct(product));
    }
    
    @Operation(summary = "Add products in bulk", description = "Admin adds multiple products at once.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Products successfully created"),
            @ApiResponse(responseCode = "400", description = "Invalid request body")
    })
    @PostMapping("/bulk")
    public ResponseEntity<List<Product>> addProductsBulk(@Valid @RequestBody List<Product> products) {
        return ResponseEntity.ok(service.saveAllProducts(products));
    }

    @Operation(summary = "Get all products", description = "Fetches a complete list.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved list")
    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAll(
            @Parameter(description = "Optional filter by category") @RequestParam(required = false) String category) {

        if (category != null) {
            return ResponseEntity.ok(service.getProductsByCategory(category));
        }
        return ResponseEntity.ok(service.getAllProducts());
    }

    @Operation(summary = "Get product by ID", description = "Fetches a specific product by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product found"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @GetMapping("/id/{id}")
    public ResponseEntity<Product> getById(
            @Parameter(description = "ID of the product to retrieve") @PathVariable int id) {
        return ResponseEntity.ok(service.getProductById(id));
    }

    @Operation(summary = "Delete a product", description = "Removes a product from the database.")
    @ApiResponse(responseCode = "200", description = "Product successfully deleted")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable int id) {
        service.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }
}