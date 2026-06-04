package com.wipro.user_ms_w.service.impl;

import com.wipro.user_ms_w.dto.AuthApiResponse;
import com.wipro.user_ms_w.dto.LoginReq;
import com.wipro.user_ms_w.entity.User;
import com.wipro.user_ms_w.repo.UserRepo;
import com.wipro.user_ms_w.service.UserCommandService;
import com.wipro.user_ms_w.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserCommandServiceImpl implements UserCommandService {
    @Autowired private UserRepo repo;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public AuthApiResponse registerUser(User user) {
        if (repo.existsByUsername(user.getUsername())) throw new RuntimeException("Username already exists");
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        repo.save(user);
        return new AuthApiResponse(null, user.getUsername(), user.getUserType(), "User Registered Successfully");
    }

    @Override
    public AuthApiResponse loginUser(LoginReq req) {
        Optional<User> optUser = repo.findByUsername(req.getUsername());
        if (optUser.isPresent()) {
            User user = optUser.get();
            if (passwordEncoder.matches(req.getPassword(), user.getPassword())) {
                String token = jwtUtil.generateToken(user.getUsername(), user.getUserType());
                return new AuthApiResponse(token, user.getUsername(), user.getUserType(), "Login Successful");
            }
        }
        throw new RuntimeException("Invalid Credentials");
    }

    @Override
    public User updateUser(int id, User user) {
        User existing = repo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        existing.setUsername(user.getUsername());
        existing.setEmail(user.getEmail());
        existing.setAddress(user.getAddress());
        existing.setUserType(user.getUserType());
        return repo.save(existing); 
    }

    @Override
    public void deleteUser(int id) {
        repo.deleteById(id);
    }
}