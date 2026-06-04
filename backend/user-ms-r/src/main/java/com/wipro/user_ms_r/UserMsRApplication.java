package com.wipro.user_ms_r;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class UserMsRApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserMsRApplication.class, args);
	}

}
