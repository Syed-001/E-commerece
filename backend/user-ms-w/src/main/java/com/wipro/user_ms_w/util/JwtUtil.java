package com.wipro.user_ms_w.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    
    private static final String SECRET = "mysecretkeymysecretkeymysecretkey123456";
    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());
    private final long expiration = 1000 * 60 * 60 * 10; // 10 hours

    // 1. Generates the token during Login
    public String generateToken(String username, int userType) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", userType == 0 ? "ADMIN" : "CUSTOMER")
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key)
                .compact();
    }

    // 2. Extracts the data (Claims) from the token (Solves your first error)
    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // 3. Validates the token to ensure it isn't tampered with or expired
    public boolean validateToken(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (Exception e) {
            System.err.println("Token validation failed: " + e.getMessage());
            return false;
        }
    }
}