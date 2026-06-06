package com.wipro.orderservice.client;

import com.wipro.orderservice.dto.ProductDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "PRODUCT-SERVICE")
public interface ProductClient {
    @GetMapping("/product/id/{id}")
    ProductDto getProductById(@PathVariable("id") int id);
}