package com.wipro.orderservice.service.impl;

import com.wipro.orderservice.client.ProductClient;
import com.wipro.orderservice.dto.CartItemResponse;
import com.wipro.orderservice.dto.CartRequest;
import com.wipro.orderservice.dto.ProductDto;
import com.wipro.orderservice.entity.CartItem;
import com.wipro.orderservice.repo.CartRepository;
import com.wipro.orderservice.service.CartService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductClient productClient;

    @Override
    @Transactional
    public CartItem addProduct(CartRequest request) {
        validateRequest(request);

        ProductDto product = productClient.getProductById(request.getProductId());
        if (product.getAvailableQty() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock for Product ID: " + request.getProductId());
        }

        CartItem cartItem = cartRepository
                .findByUserIdAndProductId(request.getUserId(), request.getProductId())
                .orElse(new CartItem(0, request.getUserId(), request.getProductId(), 0));

        cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
        return cartRepository.save(cartItem);
    }

    @Override
    @Transactional
    public void deleteCartItem(int cartId) {
        if (!cartRepository.existsById(cartId)) {
            throw new RuntimeException("Cart item not found with id: " + cartId);
        }
        cartRepository.deleteById(cartId);
    }

    @Override
    @Transactional
    public CartItem updateQuantity(CartRequest request) {
        if (request.getUserId() == null || request.getUserId().isBlank()) {
            throw new RuntimeException("userId is required");
        }
        if (request.getQuantity() <= 0) {
            throw new RuntimeException("quantity must be greater than zero");
        }

        CartItem cartItem = cartRepository
                .findByUserIdAndProductId(request.getUserId(), request.getProductId())
                .orElseThrow(() -> new RuntimeException(
                        "Cart item not found for user " + request.getUserId() + " and product " + request.getProductId()));

        ProductDto product = productClient.getProductById(request.getProductId());
        if (product.getAvailableQty() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock for Product ID: " + request.getProductId());
        }

        cartItem.setQuantity(request.getQuantity());
        return cartRepository.save(cartItem);
    }

    @Override
    public List<CartItemResponse> getCartByUserId(String userId) {
        return cartRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public void clearCart(String userId) {
        cartRepository.deleteByUserId(userId);
    }

    private CartItemResponse toResponse(CartItem item) {
        ProductDto product = productClient.getProductById(item.getProductId());
        return new CartItemResponse(
                item.getCartId(),
                item.getUserId(),
                item.getProductId(),
                product.getProdName(),
                product.getPrice(),
                item.getQuantity()
        );
    }

    private void validateRequest(CartRequest request) {
        if (request.getUserId() == null || request.getUserId().isBlank()) {
            throw new RuntimeException("userId is required");
        }
        if (request.getProductId() <= 0) {
            throw new RuntimeException("productId is required");
        }
        if (request.getQuantity() <= 0) {
            throw new RuntimeException("quantity must be greater than zero");
        }
    }
}
