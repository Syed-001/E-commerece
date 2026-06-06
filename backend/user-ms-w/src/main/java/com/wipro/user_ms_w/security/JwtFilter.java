package com.wipro.user_ms_w.security;


import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.wipro.user_ms_w.util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Skip filtering for login and register routes
        String path = request.getServletPath();
        if (path.contains("/user/command/login") || path.contains("/user/command/register")) {              
            filterChain.doFilter(request, response);
            return;
        }

        String token = null;
        String username = null;

        // 2. Extract Token from Cookies (Exactly like your reference)
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("jwt")) {
                    token = cookie.getValue();
                    try {
                        // Assuming your JwtUtil uses extractClaims().getSubject() or extractUsername()
                        // Adjust the method call depending on what is inside your specific JwtUtil
                        username = jwtUtil.extractClaims(token).getSubject(); 
                    } catch (Exception e) {
                        System.out.println("Could not extract username from token");
                    }
                    break;
                }
            }
        }

        // 3. Validate Token and Authenticate
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            boolean valid = jwtUtil.validateToken(token);

            if (valid) {
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                java.util.Collections.emptyList());

                SecurityContextHolder.getContext().setAuthentication(auth);
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid or Expired JWT Token");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
