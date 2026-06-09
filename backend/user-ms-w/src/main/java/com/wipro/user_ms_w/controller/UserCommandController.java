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

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/user/command")
@Tag(name = "User Command API", description = "Endpoints for Auth and Modifying Users")
public class UserCommandController {
    
    @Autowired 
    private UserCommandService commandService;

    @PostMapping("/register")
    @Operation(summary = "Register a new User")
    public ResponseEntity<AuthApiResponse> register(@RequestBody User user) {
        return ResponseEntity.ok(commandService.registerUser(user));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate a User and get JWT Token in Cookie")
    public ResponseEntity<AuthApiResponse> login(
            @RequestBody LoginReq req,
            HttpServletResponse response) { 

        //Get the response from service
        AuthApiResponse apiResponse = commandService.loginUser(req);

        //Check if login was successful and a token was generated
        if (apiResponse.getToken() != null && !apiResponse.getToken().isEmpty()) {
            
            //Create the HttpOnly Cookie EXACTLY like reference
            Cookie cookie = new Cookie("jwt", apiResponse.getToken());
            cookie.setHttpOnly(true);
            cookie.setSecure(false); // Change to true if using HTTPS in production
            cookie.setPath("/");
            cookie.setMaxAge(10 * 60 * 60); // 10 hours (matching your JwtUtil expiration)

            //Add the cookie to the HTTP response
            response.addCookie(cookie);

            //Remove token from the JSON body so it ONLY lives securely in the cookie
            apiResponse.setToken(null);
        } else {
            apiResponse.setMessage("Login Failed");
        }

        return ResponseEntity.ok(apiResponse);
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