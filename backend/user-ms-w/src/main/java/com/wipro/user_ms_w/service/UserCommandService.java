package com.wipro.user_ms_w.service;

import com.wipro.user_ms_w.dto.AuthApiResponse;
import com.wipro.user_ms_w.dto.LoginReq;
import com.wipro.user_ms_w.entity.User;

public interface UserCommandService {
    AuthApiResponse registerUser(User user);
    AuthApiResponse loginUser(LoginReq req);
    User updateUser(int id, User user);
    void deleteUser(int id);
}
