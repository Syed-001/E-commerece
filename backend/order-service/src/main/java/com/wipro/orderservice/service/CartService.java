package com.wipro.orderservice.service;

import com.wipro.orderservice.dto.CartItemResponse;
import com.wipro.orderservice.dto.CartRequest;
import com.wipro.orderservice.entity.CartItem;

import java.util.List;

public interface CartService {

    CartItem addProduct(CartRequest request);

    void deleteCartItem(int cartId);

    CartItem updateQuantity(CartRequest request);

    List<CartItemResponse> getCartByUserId(String userId);

    void clearCart(String userId);
}
