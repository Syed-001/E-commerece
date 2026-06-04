package com.wipro.user_ms_r.service;

import com.wipro.user_ms_r.entity.User;
import java.util.List;

public interface UserQueryService {
    User getUserById(int id);
    List<User> getAllUsers();
}