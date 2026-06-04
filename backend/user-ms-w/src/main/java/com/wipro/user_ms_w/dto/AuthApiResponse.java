package com.wipro.user_ms_w.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthApiResponse {
	private String token;
	private String username;
	private int userType;
	private String message;
}