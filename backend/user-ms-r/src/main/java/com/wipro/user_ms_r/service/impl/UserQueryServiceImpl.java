package com.wipro.user_ms_r.service.impl;

import com.wipro.user_ms_r.entity.User;
import com.wipro.user_ms_r.repo.UserRepo;
import com.wipro.user_ms_r.service.UserQueryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserQueryServiceImpl implements UserQueryService {
    @Autowired private UserRepo repo;

    @Override
    public User getUserById(int id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public List<User> getAllUsers() {
        return repo.findAll();
    }
}