package com.wipro.user_ms_w.controller;

import com.wipro.user_ms_w.dto.AuthApiResponse;
import com.wipro.user_ms_w.dto.LoginReq;
import com.wipro.user_ms_w.entity.User;
import com.wipro.user_ms_w.service.UserCommandService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user/command")
@Tag(name = "User Command API", description = "Endpoints for Auth and Modifying Users")
public class UserCommandController {
    @Autowired private UserCommandService commandService;

    @PostMapping("/register")
    @Operation(summary = "Register a new User")
    public ResponseEntity<AuthApiResponse> register(@RequestBody User user) {
        return ResponseEntity.ok(commandService.registerUser(user));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate a User and get JWT Token")
    public ResponseEntity<AuthApiResponse> login(@RequestBody LoginReq req) {
        return ResponseEntity.ok(commandService.loginUser(req));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing User profile")
    public ResponseEntity<User> update(@PathVariable int id, @RequestBody User user) {
        return ResponseEntity.ok(commandService.updateUser(id, user));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a User by ID")
    public ResponseEntity<String> delete(@PathVariable int id) {
        commandService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }
}