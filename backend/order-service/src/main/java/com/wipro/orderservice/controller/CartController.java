package com.wipro.orderservice.controller;

import com.wipro.orderservice.dto.CartItemResponse;
import com.wipro.orderservice.dto.CartRequest;
import com.wipro.orderservice.entity.CartItem;
import com.wipro.orderservice.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@Tag(name = "Cart API", description = "Shopping cart operations")
public class CartController {

    @Autowired
    private CartService cartService;

    @Operation(summary = "Add a product to the cart")
    @PostMapping("/addProd")
    public ResponseEntity<CartItem> addProduct(@RequestBody CartRequest request) {
        return ResponseEntity.ok(cartService.addProduct(request));
    }

    @Operation(summary = "Remove a product from the cart")
    @DeleteMapping("/deleteProd/{itemId}")
    public ResponseEntity<String> deleteCartItem(@PathVariable int itemId) {
        cartService.deleteCartItem(itemId);
        return ResponseEntity.ok("Cart item deleted successfully");
    }

    @Operation(summary = "Update product quantity in the cart")
    @PutMapping("/update")
    public ResponseEntity<CartItem> updateQuantity(@RequestBody CartRequest request) {
        return ResponseEntity.ok(cartService.updateQuantity(request));
    }

    @Operation(summary = "View cart for a user")
    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItemResponse>> getCart(@PathVariable String userId) {
        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }
}
