package com.wipro.user_ms_w;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class UserMsWApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserMsWApplication.class, args);
	}

}
