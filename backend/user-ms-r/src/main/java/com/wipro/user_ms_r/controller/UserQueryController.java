package com.wipro.user_ms_r.controller;

import com.wipro.user_ms_r.entity.User;
import com.wipro.user_ms_r.service.UserQueryService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/user/query")
@Tag(name = "User Query API", description = "Endpoints for reading User data")
public class UserQueryController {
    @Autowired private UserQueryService queryService;

    @GetMapping("/{id}")
    @Operation(summary = "Get User Details by ID")
    public ResponseEntity<User> getUser(@PathVariable int id) {
        return ResponseEntity.ok(queryService.getUserById(id));
    }

    @GetMapping
    @Operation(summary = "Get All Users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(queryService.getAllUsers());
    }
}